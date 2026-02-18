from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from app.models import VideoUploadResponse, AnalysisResult, ErrorResponse
from app.services.video_service import VideoService
from app.services.huggingface_detector import HuggingFaceDeepfakeDetector
import uuid
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
video_service = VideoService()
deepfake_detector = HuggingFaceDeepfakeDetector()

# In-memory storage for analysis results (in production, use a database)
analysis_cache: dict[str, AnalysisResult] = {}


@router.post("/upload", response_model=VideoUploadResponse)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Upload a video file for deepfake analysis.
    """
    try:
        # Validate file
        video_service.validate_video(file)
        
        # Generate unique ID
        video_id = str(uuid.uuid4())
        
        # Save video
        file_path = await video_service.save_video(file, video_id)
        
        # Get file size
        file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
        
        # Initialize analysis status
        analysis_cache[video_id] = AnalysisResult(
            video_id=video_id,
            status="pending"
        )
        
        # Don't auto-start analysis - wait for manual trigger
        
        return VideoUploadResponse(
            message="Video uploaded successfully. Ready for analysis.",
            video_id=video_id,
            filename=file.filename,
            size_mb=round(file_size_mb, 2)
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/analysis/{video_id}", response_model=AnalysisResult)
async def get_analysis_result(video_id: str):
    """
    Get the analysis result for a specific video.
    """
    if video_id not in analysis_cache:
        raise HTTPException(status_code=404, detail="Video analysis not found")
    
    return analysis_cache[video_id]


@router.post("/analyze/{video_id}")
async def trigger_analysis(video_id: str, background_tasks: BackgroundTasks):
    """
    Manually trigger analysis for an uploaded video.
    """
    if video_id not in analysis_cache:
        raise HTTPException(status_code=404, detail="Video not found")
    
    result = analysis_cache[video_id]
    if result.status == "processing":
        raise HTTPException(status_code=409, detail="Analysis already in progress")
    
    # Get video path
    file_path = f"uploads/{video_id}.mp4"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video file not found")
    
    # Reset and schedule analysis
    analysis_cache[video_id].status = "pending"
    background_tasks.add_task(analyze_video_task, video_id, file_path)
    
    return {"message": "Analysis triggered", "video_id": video_id}


async def analyze_video_task(video_id: str, file_path: str):
    """
    Background task to analyze video for deepfakes using HuggingFace API.
    """
    try:
        # Update status
        analysis_cache[video_id].status = "processing"
        logger.info(f"Starting HuggingFace analysis for video {video_id}")
        
        # Perform analysis (sync function, but run in background)
        result = deepfake_detector.analyze_video(file_path, video_id)
        
        # Update cache with results
        analysis_cache[video_id] = result
        logger.info(f"Analysis completed for video {video_id}: {result.result}")
        
    except Exception as e:
        logger.error(f"Analysis failed for video {video_id}: {e}")
        # Mark as failed
        analysis_cache[video_id].status = "failed"
        analysis_cache[video_id].explanation = f"Analysis failed: {str(e)}"

import cv2
import numpy as np
from datetime import datetime
import time
import asyncio
from typing import List, Tuple
from app.models import (
    AnalysisResult, FrameAnalysis, SpatialAnalysis, 
    TemporalAnalysis, DeepfakeResult, AnalysisStatus
)
from app.config import settings


class DeepfakeDetector:
    """
    Simulated deepfake detection service.
    
    In production, this would integrate with actual AI models or external APIs.
    For now, it performs basic video analysis and generates realistic-looking results
    based on video characteristics.
    """
    
    def __init__(self):
        self.frame_sample_rate = settings.FRAME_SAMPLE_RATE
        self.confidence_threshold = settings.MIN_CONFIDENCE_THRESHOLD
    
    async def analyze_video(self, video_id: str, file_path: str) -> AnalysisResult:
        """
        Analyze video for deepfake indicators.
        
        This is a simulation that analyzes video properties and generates
        realistic detection results. In production, replace with actual
        AI model inference or external API calls.
        """
        start_time = time.time()
        
        try:
            # Extract video properties
            video_props = await self._extract_video_properties(file_path)
            
            # Analyze frames
            frame_analyses = await self._analyze_frames(file_path)
            
            # Compute spatial analysis
            spatial = self._compute_spatial_analysis(video_props, frame_analyses)
            
            # Compute temporal analysis
            temporal = self._compute_temporal_analysis(video_props, frame_analyses)
            
            # Calculate overall score and determine result
            overall_score = (spatial.overall_score + temporal.overall_score) / 2
            confidence = self._calculate_confidence(spatial, temporal, frame_analyses)
            result = self._determine_result(overall_score, confidence)
            
            # Find suspicious frames
            suspicious_frames = self._identify_suspicious_frames(frame_analyses)
            
            # Generate explanation and recommendations
            explanation, recommendations = self._generate_insights(
                result, confidence, spatial, temporal, suspicious_frames
            )
            
            processing_time = time.time() - start_time
            
            return AnalysisResult(
                video_id=video_id,
                status=AnalysisStatus.COMPLETED,
                result=result,
                confidence=round(confidence, 3),
                overall_score=round(overall_score, 3),
                spatial_analysis=spatial,
                temporal_analysis=temporal,
                suspicious_frames=suspicious_frames[:10],  # Top 10
                total_frames_analyzed=len(frame_analyses),
                processing_time_seconds=round(processing_time, 2),
                analyzed_at=datetime.now(),
                explanation=explanation,
                recommendations=recommendations
            )
        
        except Exception as e:
            return AnalysisResult(
                video_id=video_id,
                status=AnalysisStatus.FAILED,
                explanation=f"Analysis error: {str(e)}"
            )
    
    async def _extract_video_properties(self, file_path: str) -> dict:
        """Extract basic video properties using OpenCV."""
        cap = cv2.VideoCapture(file_path)
        
        props = {
            "frame_count": int(cap.get(cv2.CAP_PROP_FRAME_COUNT)),
            "fps": cap.get(cv2.CAP_PROP_FPS),
            "width": int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
            "height": int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
            "duration": 0
        }
        
        if props["fps"] > 0:
            props["duration"] = props["frame_count"] / props["fps"]
        
        cap.release()
        return props
    
    async def _analyze_frames(self, file_path: str) -> List[dict]:
        """Analyze sampled frames from the video."""
        cap = cv2.VideoCapture(file_path)
        frame_analyses = []
        frame_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            # Sample frames based on rate
            if frame_count % self.frame_sample_rate == 0:
                analysis = await self._analyze_single_frame(frame, frame_count, cap)
                frame_analyses.append(analysis)
            
            frame_count += 1
            
            # Limit analysis to prevent long processing times
            if frame_count > 300:  # ~10 seconds at 30fps
                break
        
        cap.release()
        return frame_analyses
    
    async def _analyze_single_frame(self, frame, frame_number: int, cap) -> dict:
        """
        Analyze a single frame for deepfake indicators.
        This is simplified - real analysis would use AI models.
        """
        # Simulate processing delay
        await asyncio.sleep(0.01)
        
        # Basic frame statistics
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blur = cv2.Laplacian(gray, cv2.CV_64F).var()  # Sharpness
        brightness = np.mean(gray)
        contrast = np.std(gray)
        
        # Calculate edges for detecting artifacts
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.count_nonzero(edges) / edges.size
        
        # Simulate anomaly detection with more sophisticated checks
        anomaly_score = 0.0
        anomaly_factors = []
        
        # 1. Check for unusual blur (common in deepfakes due to blending)
        if blur < 100:
            factor = 0.4 * (1 - blur / 100)  # 0 to 0.4 based on blur
            anomaly_score += factor
            anomaly_factors.append(("low_blur", factor))
        elif blur > 5000:  # Too sharp can also be suspicious
            factor = 0.3
            anomaly_score += factor
            anomaly_factors.append(("high_blur", factor))
        
        # 2. Check for brightness inconsistencies
        if brightness < 50:
            factor = 0.3
            anomaly_score += factor
            anomaly_factors.append(("dark_frame", factor))
        elif brightness > 210:
            factor = 0.3
            anomaly_score += factor
            anomaly_factors.append(("bright_frame", factor))
        
        # 3. Check contrast (deepfakes often have unnatural contrast)
        if contrast < 20 or contrast > 80:
            factor = 0.35
            anomaly_score += factor
            anomaly_factors.append(("unusual_contrast", factor))
        
        # 4. Check edge density (manipulation can create unusual edges)
        if edge_density < 0.05 or edge_density > 0.25:
            factor = 0.3
            anomaly_score += factor
            anomaly_factors.append(("edge_anomaly", factor))
        
        # 5. Add controlled randomness to simulate AI detection variability
        # This creates natural variation between videos
        random_factor = np.random.uniform(0.1, 0.5)
        anomaly_score += random_factor
        
        # Cap the score
        anomaly_score = min(anomaly_score, 1.0)
        
        timestamp = frame_number / cap.get(cv2.CAP_PROP_FPS) if cap.get(cv2.CAP_PROP_FPS) > 0 else 0
        
        return {
            "frame_number": frame_number,
            "timestamp": timestamp,
            "anomaly_score": anomaly_score,
            "blur": blur,
            "brightness": brightness,
            "contrast": contrast,
            "edge_density": edge_density,
            "anomaly_factors": anomaly_factors
        }
    
    def _compute_spatial_analysis(self, video_props: dict, frame_analyses: List[dict]) -> SpatialAnalysis:
        """Compute spatial analysis metrics."""
        avg_anomaly = np.mean([f["anomaly_score"] for f in frame_analyses])
        
        # Simulate different spatial metrics
        facial_inconsistencies = min(avg_anomaly * 1.1, 1.0)
        lighting_anomalies = min(avg_anomaly * 0.9, 1.0)
        artifact_detection = min(avg_anomaly * 1.05, 1.0)
        overall = (facial_inconsistencies + lighting_anomalies + artifact_detection) / 3
        
        return SpatialAnalysis(
            facial_inconsistencies=round(facial_inconsistencies, 3),
            lighting_anomalies=round(lighting_anomalies, 3),
            artifact_detection=round(artifact_detection, 3),
            overall_score=round(overall, 3)
        )
    
    def _compute_temporal_analysis(self, video_props: dict, frame_analyses: List[dict]) -> TemporalAnalysis:
        """Compute temporal analysis metrics."""
        # Analyze frame-to-frame variations
        if len(frame_analyses) > 1:
            # Check anomaly score variations (sudden changes are suspicious)
            anomaly_variations = []
            brightness_variations = []
            contrast_variations = []
            
            for i in range(1, len(frame_analyses)):
                anomaly_diff = abs(frame_analyses[i]["anomaly_score"] - frame_analyses[i-1]["anomaly_score"])
                brightness_diff = abs(frame_analyses[i]["brightness"] - frame_analyses[i-1]["brightness"])
                contrast_diff = abs(frame_analyses[i]["contrast"] - frame_analyses[i-1]["contrast"])
                
                anomaly_variations.append(anomaly_diff)
                brightness_variations.append(brightness_diff)
                contrast_variations.append(contrast_diff)
            
            # High variation = suspicious
            avg_anomaly_variation = np.mean(anomaly_variations)
            avg_brightness_variation = np.mean(brightness_variations)
            avg_contrast_variation = np.mean(contrast_variations)
            
            # Calculate temporal score (higher = more suspicious)
            temporal_score = min(avg_anomaly_variation * 4, 1.0)  # Amplify variations
            
            # Add brightness variation component
            if avg_brightness_variation > 30:  # Sudden brightness changes
                temporal_score = min(temporal_score + 0.2, 1.0)
            
            # Add contrast variation component  
            if avg_contrast_variation > 20:  # Unstable contrast
                temporal_score = min(temporal_score + 0.2, 1.0)
            
            # Calculate individual metrics
            frame_continuity = temporal_score
            motion_consistency = min(temporal_score * 1.1, 1.0)
            temporal_artifacts = min(temporal_score * 0.95, 1.0)
        else:
            temporal_score = 0.4
            frame_continuity = 0.4
            motion_consistency = 0.4
            temporal_artifacts = 0.4
        
        return TemporalAnalysis(
            frame_continuity=round(frame_continuity, 3),
            motion_consistency=round(motion_consistency, 3),
            temporal_artifacts=round(temporal_artifacts, 3),
            overall_score=round(temporal_score, 3)
        )
    
    def _calculate_confidence(self, spatial: SpatialAnalysis, temporal: TemporalAnalysis, frames: List[dict]) -> float:
        """Calculate confidence in the detection result."""
        # More frames = higher confidence
        frame_confidence = min(len(frames) / 50, 1.0)
        
        # Consistency in scores = higher confidence
        scores = [spatial.overall_score, temporal.overall_score]
        consistency = 1.0 - abs(scores[0] - scores[1])
        
        confidence = (frame_confidence + consistency) / 2
        return max(0.5, min(confidence, 0.95))  # Range: 0.5-0.95
    
    def _determine_result(self, overall_score: float, confidence: float) -> DeepfakeResult:
        """Determine if video is likely real or fake."""
        if confidence < 0.6:
            return DeepfakeResult.UNCERTAIN
        
        # Adjusted thresholds for better differentiation
        if overall_score > 0.55:  # More sensitive to anomalies
            return DeepfakeResult.FAKE
        elif overall_score < 0.45:  # Tighter range for real
            return DeepfakeResult.REAL
        else:
            return DeepfakeResult.UNCERTAIN
    
    def _identify_suspicious_frames(self, frame_analyses: List[dict]) -> List[FrameAnalysis]:
        """Identify frames with highest anomaly scores."""
        sorted_frames = sorted(frame_analyses, key=lambda x: x["anomaly_score"], reverse=True)
        
        suspicious = []
        for frame_data in sorted_frames[:15]:
            anomalies = []
            if frame_data["blur"] < 100:
                anomalies.append("Low sharpness/blur detected")
            if frame_data["brightness"] < 50:
                anomalies.append("Unusually dark frame")
            elif frame_data["brightness"] > 210:
                anomalies.append("Overexposed frame")
            if frame_data.get("edge_density", 0) < 0.05 or frame_data.get("edge_density", 0) > 0.25:
                anomalies.append("Irregular edge patterns")
            if frame_data.get("contrast", 0) and (frame_data["contrast"] < 20 or frame_data["contrast"] > 80):
                anomalies.append("Unnatural contrast levels")
            if frame_data["anomaly_score"] > 0.65:
                anomalies.append("High manipulation probability")
            elif frame_data["anomaly_score"] > 0.5:
                anomalies.append("Moderate manipulation indicators")
            
            suspicious.append(FrameAnalysis(
                frame_number=frame_data["frame_number"],
                timestamp=round(frame_data["timestamp"], 2),
                confidence=round(frame_data["anomaly_score"], 3),
                is_fake=frame_data["anomaly_score"] > 0.55,
                anomalies=anomalies
            ))
        
        return suspicious
    
    def _generate_insights(
        self, 
        result: DeepfakeResult, 
        confidence: float,
        spatial: SpatialAnalysis,
        temporal: TemporalAnalysis,
        suspicious_frames: List[FrameAnalysis]
    ) -> Tuple[str, List[str]]:
        """Generate human-readable explanation and recommendations."""
        
        # Explanation
        if result == DeepfakeResult.FAKE:
            explanation = (
                f"Analysis indicates a {confidence * 100:.1f}% confidence that this video contains "
                f"deepfake or AI-generated content. Significant spatial and temporal anomalies were detected, "
                f"particularly in facial features and frame-to-frame consistency."
            )
        elif result == DeepfakeResult.REAL:
            explanation = (
                f"Analysis indicates a {confidence * 100:.1f}% confidence that this video is authentic. "
                f"No significant manipulation artifacts were detected in the analyzed frames."
            )
        else:
            explanation = (
                f"Analysis is inconclusive (confidence: {confidence * 100:.1f}%). "
                f"Some anomalies were detected, but they may be due to video quality or encoding rather than manipulation."
            )
        
        # Recommendations
        recommendations = []
        
        if result == DeepfakeResult.FAKE:
            recommendations.extend([
                "Further verification recommended before using this content",
                "Consider cross-referencing with original source",
                "Examine suspicious frames for visual artifacts",
                "Check audio-visual synchronization manually"
            ])
        elif result == DeepfakeResult.UNCERTAIN:
            recommendations.extend([
                "Try uploading a higher quality version if available",
                "Verify content with additional detection tools",
                "Check metadata and source information",
                "Look for corroborating evidence from other sources"
            ])
        else:
            recommendations.extend([
                "Video appears authentic based on analysis",
                "Always verify source and context",
                "No system is 100% accurate - use human judgment"
            ])
        
        if len(suspicious_frames) > 5:
            recommendations.append(f"Review {len(suspicious_frames)} flagged frames manually")
        
        if spatial.overall_score > 0.7:
            recommendations.append("High spatial anomalies detected - check for face swaps or image splicing")
        
        if temporal.overall_score > 0.7:
            recommendations.append("Temporal inconsistencies found - examine video for frame manipulation")
        
        return explanation, recommendations

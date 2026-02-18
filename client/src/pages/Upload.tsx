import { useState, useRef } from "react";
import Player from "../components/Player";
import Analysis from "../components/Analysis";
import CustomVideoPlayer, {
    type VideoPlayerHandle,
} from "../components/CustomVideoPlayer";
import { apiService, type AnalysisResult } from "../services/api";

export default function Upload() {
    const videoPlayerRef = useRef<VideoPlayerHandle>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoId, setVideoId] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
        null,
    );
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleVideoUpload = async (file: File) => {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        setUploadError(null);
        setVideoId(null);
        setAnalysisResult(null);

        // Upload to backend
        setIsUploading(true);
        try {
            const response = await apiService.uploadVideo(file);
            setVideoId(response.video_id);
            // Don't auto-start analysis - wait for button click
        } catch (error) {
            setUploadError(
                error instanceof Error ? error.message : "Upload failed",
            );
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const pollAnalysisResult = async (id: string) => {
        try {
            const result = await apiService.getAnalysisResult(id);
            setAnalysisResult(result);

            // Continue polling if still processing
            if (result.status === "pending" || result.status === "processing") {
                setTimeout(() => pollAnalysisResult(id), 2000);
            }
        } catch (error) {
            console.error("Error fetching analysis:", error);
        }
    };

    const handleRunAnalysis = async () => {
        if (videoId) {
            setAnalysisResult({
                video_id: videoId,
                status: "pending",
            });
            try {
                await apiService.triggerAnalysis(videoId);
                pollAnalysisResult(videoId);
            } catch (error) {
                console.error("Error triggering analysis:", error);
            }
        }
    };

    const handleChangeVideo = () => {
        setVideoFile(null);
        setVideoUrl(null);
        setVideoId(null);
        setAnalysisResult(null);
        setUploadError(null);
    };

    const handleSeekToTimestamp = (timestamp: number) => {
        if (videoPlayerRef.current) {
            videoPlayerRef.current.seekTo(timestamp);
        }
    };

    return (
        <main className="flex w-full flex-1 px-6 overflow-hidden">
            {!videoUrl ? (
                <Player
                    videoUrl={videoUrl}
                    onVideoUpload={handleVideoUpload}
                    isUploading={isUploading}
                    uploadError={uploadError}
                />
            ) : (
                <div className="w-3/4 p-4 flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold tracking-wide">
                        Uploaded Video
                    </h2>
                    <CustomVideoPlayer
                        ref={videoPlayerRef}
                        videoUrl={videoUrl}
                        suspiciousFrames={analysisResult?.suspicious_frames}
                        onChangeVideo={handleChangeVideo}
                    />
                </div>
            )}
            <Analysis
                hasVideo={!!videoFile}
                onRunAnalysis={handleRunAnalysis}
                analysisResult={analysisResult}
                onSeekToTimestamp={handleSeekToTimestamp}
            />
        </main>
    );
}

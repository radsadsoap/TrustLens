import { useEffect, useRef, useState, useCallback } from "react";
import type { FrameAnalysis } from "../services/api";

interface VideoWithArtifactsProps {
    videoUrl: string;
    suspiciousFrames?: FrameAnalysis[];
    onChangeVideo?: () => void;
}

export default function VideoWithArtifacts({
    videoUrl,
    suspiciousFrames = [],
    onChangeVideo,
}: VideoWithArtifactsProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [showArtifacts, setShowArtifacts] = useState(true);

    const drawArtifacts = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || !showArtifacts) {
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
            return;
        }

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Find the frame closest to current time (check ALL frames)
        const currentFrame = suspiciousFrames.find(
            (frame) => Math.abs(frame.timestamp - currentTime) < 0.5,
        );

        if (!currentFrame) return;

        // Draw artifact regions if present
        if (
            currentFrame.artifact_regions &&
            currentFrame.artifact_regions.length > 0
        ) {
            currentFrame.artifact_regions.forEach((region) => {
                const x = region.x * canvas.width;
                const y = region.y * canvas.height;
                const w = region.width * canvas.width;
                const h = region.height * canvas.height;

                // Choose color based on artifact type
                let color = "rgba(255, 0, 0, 0.5)";
                switch (region.type) {
                    case "blur_anomaly":
                        color = "rgba(255, 165, 0, 0.5)"; // Orange
                        break;
                    case "edge_inconsistency":
                        color = "rgba(255, 255, 0, 0.5)"; // Yellow
                        break;
                    case "face_blur":
                        color = "rgba(255, 0, 255, 0.6)"; // Magenta for faces
                        break;
                }

                // Draw semi-transparent rectangle
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, w, h);

                // Draw label background
                const labelText = `${region.type.replace(/_/g, " ")} (${Math.round(region.confidence * 100)}%)`;
                const textMetrics = ctx.measureText(labelText);
                const labelWidth = Math.max(textMetrics.width + 10, w);

                ctx.fillStyle = color;
                ctx.fillRect(x, Math.max(0, y - 25), labelWidth, 25);

                ctx.fillStyle = "white";
                ctx.font = "bold 12px sans-serif";
                ctx.fillText(labelText, x + 5, Math.max(16, y - 8));
            });
        }

        // Draw frame indicator if this is a suspicious frame
        if (currentFrame.is_fake) {
            ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            ctx.lineWidth = 5;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
            ctx.fillRect(0, 0, 300, 40);

            ctx.fillStyle = "white";
            ctx.font = "bold 16px sans-serif";
            ctx.fillText(
                `⚠️ Suspicious Frame (${Math.round(currentFrame.confidence * 100)}% confidence)`,
                10,
                25,
            );
        }
    }, [suspiciousFrames, showArtifacts, currentTime]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", drawArtifacts);
        video.addEventListener("resize", drawArtifacts);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", drawArtifacts);
            video.removeEventListener("resize", drawArtifacts);
        };
    }, [drawArtifacts]);

    useEffect(() => {
        drawArtifacts();
    }, [drawArtifacts]);

    return (
        <div className="flex flex-col gap-4 flex-1">
            <div className="relative flex-1">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    className="w-full h-full rounded border border-gray-700"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ objectFit: "contain" }}
                />
            </div>

            <div className="flex gap-2 items-center">
                <button
                    className="bg-gray-700 px-4 py-2 cursor-pointer hover:bg-gray-600 transition duration-200"
                    onClick={() => setShowArtifacts(!showArtifacts)}
                >
                    {showArtifacts ? "Hide Artifacts" : "Show Artifacts"}
                </button>

                {onChangeVideo && (
                    <button
                        className="bg-gray-700 px-4 py-2 cursor-pointer hover:bg-gray-600 transition duration-200"
                        onClick={onChangeVideo}
                    >
                        Change Video
                    </button>
                )}

                <div className="flex-1" />

                {suspiciousFrames && suspiciousFrames.length > 0 && (
                    <div className="text-sm text-gray-400">
                        {suspiciousFrames.filter((f) => f.is_fake).length}{" "}
                        suspicious frames / {suspiciousFrames.length} total
                        analyzed
                    </div>
                )}
            </div>

            {/* Legend */}
            {showArtifacts &&
                suspiciousFrames &&
                suspiciousFrames.length > 0 && (
                    <div className="bg-gray-900 border border-gray-700 p-3 rounded">
                        <h4 className="text-sm font-semibold mb-2">
                            Artifact Types:
                        </h4>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-orange-500" />
                                <span>Blur</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-yellow-500" />
                                <span>Edges</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-fuchsia-500" />
                                <span>Lighting</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-fuchsia-600" />
                                <span>Face</span>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}

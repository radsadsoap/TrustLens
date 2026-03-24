import {
    useEffect,
    useRef,
    useState,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from "react";
import { PlayIcon, PauseIcon } from "@phosphor-icons/react";
import type { FrameAnalysis } from "../services/api";

interface CustomVideoPlayerProps {
    videoUrl: string;
    suspiciousFrames?: FrameAnalysis[];
    onChangeVideo?: () => void;
}

export interface VideoPlayerHandle {
    seekTo: (time: number) => void;
    getCurrentTime: () => number;
}

const CustomVideoPlayer = forwardRef<VideoPlayerHandle, CustomVideoPlayerProps>(
    ({ videoUrl, suspiciousFrames = [], onChangeVideo }, ref) => {
        const videoRef = useRef<HTMLVideoElement>(null);
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [isPlaying, setIsPlaying] = useState(false);
        const [currentTime, setCurrentTime] = useState(0);
        const [duration, setDuration] = useState(0);
        const [showArtifacts, setShowArtifacts] = useState(true);

        // Expose methods to parent via ref
        useImperativeHandle(ref, () => ({
            seekTo: (time: number) => {
                if (videoRef.current) {
                    videoRef.current.currentTime = time;
                }
            },
            getCurrentTime: () => {
                return videoRef.current?.currentTime || 0;
            },
        }));

        const togglePlayPause = () => {
            if (videoRef.current) {
                if (isPlaying) {
                    videoRef.current.pause();
                } else {
                    videoRef.current.play();
                }
                setIsPlaying(!isPlaying);
            }
        };

        const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
            const progressBar = e.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            const newTime = pos * duration;

            if (videoRef.current) {
                videoRef.current.currentTime = newTime;
                setCurrentTime(newTime);
            }
        };

        const formatTime = (seconds: number) => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, "0")}`;
        };

        const drawArtifacts = useCallback(() => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || !canvas) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!showArtifacts) return;

            const currentFrame = suspiciousFrames.find(
                (frame) => Math.abs(frame.timestamp - currentTime) < 0.5,
            );

            if (!currentFrame) return;

            // Only draw face and lighting regions — skip edge/blur grid noise
            const regions = (currentFrame.artifact_regions ?? []).filter(
                (r) =>
                    r.type === "face_blur" ||
                    r.type === "lighting_inconsistency",
            );

            regions.forEach((region) => {
                const x = region.x * canvas.width;
                const y = region.y * canvas.height;
                const w = region.width * canvas.width;
                const h = region.height * canvas.height;
                ctx.strokeStyle =
                    region.type === "face_blur"
                        ? "rgba(255, 80, 80, 0.9)"
                        : "rgba(255, 200, 0, 0.8)";
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, w, h);
            });

            // Small badge in top-right when frame is suspicious
            if (currentFrame.is_fake) {
                const label = `⚠ ${Math.round(currentFrame.confidence * 100)}%`;
                ctx.font = "bold 13px sans-serif";
                const bw = ctx.measureText(label).width + 16;
                const bh = 26;
                const bx = canvas.width - bw - 8;
                const by = 8;
                ctx.fillStyle = "rgba(220, 38, 38, 0.82)";
                ctx.fillRect(bx, by, bw, bh);
                ctx.fillStyle = "white";
                ctx.fillText(label, bx + 8, by + 17);
            }
        }, [suspiciousFrames, showArtifacts, currentTime]);

        useEffect(() => {
            const video = videoRef.current;
            if (!video) return;

            const handleTimeUpdate = () => {
                setCurrentTime(video.currentTime);
            };

            const handleLoadedMetadata = () => {
                setDuration(video.duration);
            };

            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);

            video.addEventListener("timeupdate", handleTimeUpdate);
            video.addEventListener("loadedmetadata", handleLoadedMetadata);
            video.addEventListener("play", handlePlay);
            video.addEventListener("pause", handlePause);
            video.addEventListener("loadedmetadata", drawArtifacts);
            video.addEventListener("resize", drawArtifacts);

            return () => {
                video.removeEventListener("timeupdate", handleTimeUpdate);
                video.removeEventListener(
                    "loadedmetadata",
                    handleLoadedMetadata,
                );
                video.removeEventListener("play", handlePlay);
                video.removeEventListener("pause", handlePause);
                video.removeEventListener("loadedmetadata", drawArtifacts);
                video.removeEventListener("resize", drawArtifacts);
            };
        }, [drawArtifacts]);

        useEffect(() => {
            drawArtifacts();
        }, [drawArtifacts]);

        return (
            <div className="flex flex-col gap-4 flex-1 overflow-hidden">
                {/* Video Container */}
                <div className="relative flex-1 bg-black rounded overflow-hidden">
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-contain"
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{ objectFit: "contain" }}
                    />
                </div>

                {/* Custom Controls */}
                <div className="flex flex-col gap-3 bg-gray-900 p-4 rounded-lg border border-gray-700">
                    {/* Progress Bar */}
                    <div className="relative group">
                        <div
                            className="h-2 bg-gray-700 rounded cursor-pointer hover:h-3 transition-all"
                            onClick={handleSeek}
                        >
                            <div
                                className="h-full bg-red-600 rounded relative"
                                style={{
                                    width: `${(currentTime / duration) * 100}%`,
                                }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        {/* Anomaly markers on timeline */}
                        {suspiciousFrames
                            .filter((f) => f.is_fake)
                            .map((frame, idx) => (
                                <div
                                    key={idx}
                                    className="absolute top-0 w-1 h-2 bg-yellow-500 cursor-pointer hover:h-4 transition-all"
                                    style={{
                                        left: `${(frame.timestamp / duration) * 100}%`,
                                    }}
                                    title={`Anomaly at ${formatTime(frame.timestamp)}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (videoRef.current) {
                                            videoRef.current.currentTime =
                                                frame.timestamp;
                                        }
                                    }}
                                />
                            ))}
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center gap-4">
                        {/* Play/Pause Button */}
                        <button
                            onClick={togglePlayPause}
                            className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-colors"
                        >
                            {isPlaying ? (
                                <PauseIcon size={24} weight="fill" />
                            ) : (
                                <PlayIcon size={24} weight="fill" />
                            )}
                        </button>

                        {/* Time Display */}
                        <div className="text-sm text-gray-300 font-mono">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>

                        <div className="flex-1" />

                        {/* Artifact Toggle */}
                        <button
                            className="bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600 transition-colors rounded-lg"
                            onClick={() => setShowArtifacts(!showArtifacts)}
                        >
                            {showArtifacts ? "Hide Overlays" : "Show Overlays"}
                        </button>

                        {/* Change Video */}
                        {onChangeVideo && (
                            <button
                                className="bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600 transition-colors rounded-lg"
                                onClick={onChangeVideo}
                            >
                                Change Video
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    {suspiciousFrames && suspiciousFrames.length > 0 && (
                        <div className="text-xs text-gray-400 flex gap-4">
                            <span>
                                {
                                    suspiciousFrames.filter((f) => f.is_fake)
                                        .length
                                }{" "}
                                suspicious frames
                            </span>
                            <span>•</span>
                            <span>
                                {suspiciousFrames.length} total analyzed
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    },
);

CustomVideoPlayer.displayName = "CustomVideoPlayer";

export default CustomVideoPlayer;

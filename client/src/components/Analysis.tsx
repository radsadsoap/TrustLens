import {
    ShareNetworkIcon,
    CheckCircle,
    WarningCircle,
    Clock,
    SpinnerGap,
    PlayCircleIcon,
} from "@phosphor-icons/react";
import type { AnalysisResult } from "../services/api";

interface AnalysisProps {
    hasVideo: boolean;
    onRunAnalysis: () => void;
    analysisResult: AnalysisResult | null;
    onSeekToTimestamp?: (timestamp: number) => void;
}

export default function Analysis({
    hasVideo,
    onRunAnalysis,
    analysisResult,
    onSeekToTimestamp,
}: AnalysisProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const getResultColor = (result?: string) => {
        switch (result) {
            case "real":
                return "text-green-500";
            case "fake":
                return "text-red-500";
            case "uncertain":
                return "text-yellow-500";
            default:
                return "text-gray-400";
        }
    };

    const getResultIcon = (result?: string) => {
        switch (result) {
            case "real":
                return <CheckCircle size={24} className="text-green-500" />;
            case "fake":
                return <WarningCircle size={24} className="text-red-500" />;
            case "uncertain":
                return <Clock size={24} className="text-yellow-500" />;
            default:
                return null;
        }
    };

    const renderStatus = () => {
        if (!analysisResult) return null;

        switch (analysisResult.status) {
            case "pending":
            case "processing":
                return (
                    <div className="bg-blue-900/20 border border-blue-600 p-4 rounded flex items-center gap-3">
                        <SpinnerGap
                            size={24}
                            className="text-blue-500 animate-spin"
                        />
                        <span className="text-blue-400">
                            Analyzing video...
                        </span>
                    </div>
                );

            case "failed":
                return (
                    <div className="bg-red-900/20 border border-red-600 p-4 rounded">
                        <p className="text-red-400">
                            {analysisResult.explanation || "Analysis failed"}
                        </p>
                    </div>
                );

            case "completed":
                return (
                    <div className="space-y-4 overflow-y-auto flex-1">
                        {/* Result Summary */}
                        <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                            <div className="flex items-center gap-2 mb-2">
                                {getResultIcon(analysisResult.result)}
                                <h3 className="text-lg font-semibold">
                                    Result:{" "}
                                    <span
                                        className={getResultColor(
                                            analysisResult.result,
                                        )}
                                    >
                                        {analysisResult.result?.toUpperCase()}
                                    </span>
                                </h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">
                                Confidence:{" "}
                                {(
                                    (analysisResult.confidence || 0) * 100
                                ).toFixed(1)}
                                %
                            </p>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${
                                        analysisResult.result === "fake"
                                            ? "bg-red-500"
                                            : analysisResult.result === "real"
                                              ? "bg-green-500"
                                              : "bg-yellow-500"
                                    }`}
                                    style={{
                                        width: `${(analysisResult.confidence || 0) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Explanation */}
                        {analysisResult.explanation && (
                            <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                                <h4 className="font-semibold mb-2">
                                    Explanation
                                </h4>
                                <p className="text-sm text-gray-300">
                                    {analysisResult.explanation}
                                </p>
                            </div>
                        )}

                        {/* Spatial & Temporal Analysis */}
                        {(analysisResult.spatial_analysis ||
                            analysisResult.temporal_analysis) && (
                            <div className="bg-gray-900 border border-gray-700 p-4 rounded space-y-3">
                                {analysisResult.spatial_analysis && (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-sm">
                                            Spatial Analysis
                                        </h4>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">
                                                    Facial Inconsistencies:
                                                </span>
                                                <span>
                                                    {(
                                                        analysisResult
                                                            .spatial_analysis
                                                            .facial_inconsistencies *
                                                        100
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">
                                                    Lighting Anomalies:
                                                </span>
                                                <span>
                                                    {(
                                                        analysisResult
                                                            .spatial_analysis
                                                            .lighting_anomalies *
                                                        100
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">
                                                    Artifact Detection:
                                                </span>
                                                <span>
                                                    {(
                                                        analysisResult
                                                            .spatial_analysis
                                                            .artifact_detection *
                                                        100
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {analysisResult.temporal_analysis && (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-sm">
                                            Temporal Analysis
                                        </h4>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">
                                                    Frame Continuity:
                                                </span>
                                                <span>
                                                    {(
                                                        analysisResult
                                                            .temporal_analysis
                                                            .frame_continuity *
                                                        100
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">
                                                    Motion Consistency:
                                                </span>
                                                <span>
                                                    {(
                                                        analysisResult
                                                            .temporal_analysis
                                                            .motion_consistency *
                                                        100
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">
                                                    Temporal Artifacts:
                                                </span>
                                                <span>
                                                    {(
                                                        analysisResult
                                                            .temporal_analysis
                                                            .temporal_artifacts *
                                                        100
                                                    ).toFixed(0)}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Anomaly Timeline */}
                        {analysisResult.suspicious_frames &&
                            analysisResult.suspicious_frames.filter(
                                (f) => f.is_fake,
                            ).length > 0 && (
                                <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                                    <h4 className="font-semibold mb-3">
                                        Detected Anomalies Timeline
                                    </h4>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {analysisResult.suspicious_frames
                                            .filter((f) => f.is_fake)
                                            .sort(
                                                (a, b) =>
                                                    a.timestamp - b.timestamp,
                                            )
                                            .map((frame, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() =>
                                                        onSeekToTimestamp?.(
                                                            frame.timestamp,
                                                        )
                                                    }
                                                    className="bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-red-500 p-3 rounded cursor-pointer transition-all group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <PlayCircleIcon
                                                            size={24}
                                                            className="text-red-500 group-hover:scale-110 transition-transform"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-mono text-sm font-semibold text-red-400">
                                                                    {formatTime(
                                                                        frame.timestamp,
                                                                    )}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    Frame{" "}
                                                                    {
                                                                        frame.frame_number
                                                                    }
                                                                </span>
                                                                <span className="ml-auto text-xs font-semibold text-red-400">
                                                                    {Math.round(
                                                                        frame.confidence *
                                                                            100,
                                                                    )}
                                                                    % confidence
                                                                </span>
                                                            </div>
                                                            {frame.anomalies &&
                                                                frame.anomalies
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {frame.anomalies.map(
                                                                            (
                                                                                anomaly,
                                                                                i,
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="text-xs bg-red-900/30 text-red-300 px-2 py-0.5 rounded"
                                                                                >
                                                                                    {
                                                                                        anomaly
                                                                                    }
                                                                                </span>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                        {/* Recommendations */}
                        {analysisResult.recommendations &&
                            analysisResult.recommendations.length > 0 && (
                                <div className="bg-gray-900 border border-gray-700 p-4 rounded">
                                    <h4 className="font-semibold mb-2">
                                        Recommendations
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                        {analysisResult.recommendations.map(
                                            (rec, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex gap-2"
                                                >
                                                    <span className="text-red-500">
                                                        •
                                                    </span>
                                                    <span>{rec}</span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                        {/* Metrics */}
                        {analysisResult.total_frames_analyzed && (
                            <div className="text-xs text-gray-500 space-y-1">
                                <div>
                                    Frames analyzed:{" "}
                                    {analysisResult.total_frames_analyzed}
                                </div>
                                {analysisResult.processing_time_seconds && (
                                    <div>
                                        Processing time:{" "}
                                        {analysisResult.processing_time_seconds}
                                        s
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="w-1/4 border-l p-4 flex flex-col gap-4 overflow-hidden">
            <h2 className="text-2xl font-semibold flex items-center gap-2 tracking-wide">
                <ShareNetworkIcon /> Analysis
            </h2>

            {!hasVideo ? (
                <p className="text-gray-300">
                    Upload a video to begin analysis.
                </p>
            ) : !analysisResult ? (
                <div className="flex flex-col gap-4">
                    <p className="text-gray-300">
                        Video uploaded successfully. Click below to analyze.
                    </p>
                    <button
                        onClick={onRunAnalysis}
                        className="bg-red-600 px-6 py-3 cursor-pointer hover:bg-red-700 transition duration-200 flex items-center gap-2 justify-center font-semibold"
                    >
                        Run Analysis
                    </button>
                </div>
            ) : (
                renderStatus()
            )}
        </div>
    );
}

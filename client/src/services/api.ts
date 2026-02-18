const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface VideoUploadResponse {
    message: string;
    video_id: string;
    filename: string;
    size_mb: number;
}

export interface ArtifactRegion {
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
    confidence: number;
}

export interface FrameAnalysis {
    frame_number: number;
    timestamp: number;
    confidence: number;
    is_fake: boolean;
    anomalies: string[];
    artifact_regions: ArtifactRegion[];
}

export interface SpatialAnalysis {
    facial_inconsistencies: number;
    lighting_anomalies: number;
    artifact_detection: number;
    overall_score: number;
}

export interface TemporalAnalysis {
    frame_continuity: number;
    motion_consistency: number;
    temporal_artifacts: number;
    overall_score: number;
}

export interface AnalysisResult {
    video_id: string;
    status: "pending" | "processing" | "completed" | "failed";
    result?: "real" | "fake" | "uncertain";
    confidence?: number;
    overall_score?: number;
    spatial_analysis?: SpatialAnalysis;
    temporal_analysis?: TemporalAnalysis;
    suspicious_frames?: FrameAnalysis[];
    total_frames_analyzed?: number;
    processing_time_seconds?: number;
    analyzed_at?: string;
    explanation?: string;
    recommendations?: string[];
}

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async uploadVideo(file: File): Promise<VideoUploadResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${this.baseUrl}/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Upload failed");
        }

        return response.json();
    }

    async getAnalysisResult(videoId: string): Promise<AnalysisResult> {
        const response = await fetch(`${this.baseUrl}/analysis/${videoId}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Failed to fetch analysis");
        }

        return response.json();
    }

    async triggerAnalysis(videoId: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/analyze/${videoId}`, {
            method: "POST",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Failed to trigger analysis");
        }
    }

    async checkHealth(): Promise<{ status: string }> {
        const response = await fetch(
            `${this.baseUrl.replace("/api", "")}/health`,
        );
        return response.json();
    }
}

export const apiService = new ApiService();

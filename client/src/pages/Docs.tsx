import {
    BookOpenIcon,
    CheckCircleIcon,
    CodeIcon,
    UploadIcon,
    ChartBarIcon,
    DesktopIcon,
    DatabaseIcon,
    BrainIcon,
    CubeIcon,
    GitBranchIcon,
    PlayCircleIcon,
    EyeIcon,
    ChartLineIcon,
    MapPinIcon,
    ShieldCheckIcon,
} from "@phosphor-icons/react";
import DocsNav from "../components/DocsNav";

export default function Docs() {
    return (
        <main className="flex w-full flex-1 overflow-hidden">
            <div id="docs-content" className="w-3/4 overflow-y-auto px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                        <BookOpenIcon size={40} />
                        Documentation
                    </h1>
                    <p className="text-gray-300 text-lg mb-8">
                        Learn how to use the Deepfake Video Detector to analyze
                        videos for AI-generated content.
                    </p>

                    <section id="overview" className="mb-12 scroll-mt-8">
                        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
                            Overview
                        </h2>
                        <p className="text-gray-300 mb-4">
                            The Deepfake Video Detector is an AI-powered tool
                            designed to analyze videos and detect potential
                            deepfake content. Using advanced machine learning
                            algorithms, our system examines various aspects of
                            the video including facial features, lighting
                            inconsistencies, and temporal artifacts to determine
                            the authenticity of the content.
                        </p>
                    </section>

                    <section id="architecture" className="mb-12 scroll-mt-8">
                        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-3">
                            <CubeIcon size={32} className="text-red-500" />
                            Architecture & Technologies
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Frontend Card */}
                            <div className="bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500/50 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-red-500/10 p-3 rounded-lg">
                                        <DesktopIcon
                                            size={32}
                                            className="text-red-500"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-red-500">
                                        Frontend
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                React 19
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Modern UI framework with latest
                                                features
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                TypeScript
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Type-safe development
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                Vite
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Fast build tool and dev server
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                TailwindCSS 4
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Utility-first CSS framework
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                React Router 7
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Client-side routing
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                Phosphor Icons
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Beautiful icon library
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Backend Card */}
                            <div className="bg-linear-to-br from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-700 hover:border-red-500/50 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-red-500/10 p-3 rounded-lg">
                                        <DatabaseIcon
                                            size={32}
                                            className="text-red-500"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-red-500">
                                        Backend
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                FastAPI 0.109
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                High-performance Python
                                                framework
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                Python 3.11
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Modern Python runtime
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                OpenCV 4.9
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Computer vision library
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                Pydantic
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Data validation
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                Docker Compose
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                Containerized deployment
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircleIcon
                                            size={20}
                                            className="text-red-500 shrink-0 mt-0.5"
                                        />
                                        <div>
                                            <span className="font-semibold text-gray-200">
                                                Uvicorn
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                ASGI server
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detection Algorithm */}
                        <div className="bg-linear-to-br from-red-950/20 to-gray-900 p-6 rounded-lg border border-red-500/30">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-red-500/10 p-3 rounded-lg">
                                    <BrainIcon
                                        size={32}
                                        className="text-red-500"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-red-500">
                                        Detection Algorithm
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        Enhanced computer vision with 7
                                        detection signals
                                    </p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 bg-gray-900/50 p-3 rounded">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-300">
                                        Blur Analysis (Laplacian)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-900/50 p-3 rounded">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-300">
                                        Edge Detection (Canny)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-900/50 p-3 rounded">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-300">
                                        Brightness & Contrast
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-900/50 p-3 rounded">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-300">
                                        Color Distribution
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-900/50 p-3 rounded">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-300">
                                        Noise Patterns
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-900/50 p-3 rounded">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-300">
                                        Face Detection (Haar)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-900/50 p-3 rounded md:col-span-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-300">
                                        Compression Artifacts (DCT)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="project-flow" className="mb-12 scroll-mt-8">
                        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-3">
                            <GitBranchIcon size={32} className="text-red-500" />
                            Project Flow
                        </h2>
                        <div className="space-y-6">
                            {/* Step 1 */}
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                        1
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                        <UploadIcon
                                            size={24}
                                            className="text-red-500"
                                        />
                                        Video Upload
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        User uploads video via drag-and-drop or
                                        file picker → Frontend sends POST
                                        request to{" "}
                                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded">
                                            /api/videos/upload
                                        </code>{" "}
                                        → Backend saves video to{" "}
                                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded">
                                            /uploads
                                        </code>{" "}
                                        directory → Returns video metadata
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                        2
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                        <PlayCircleIcon
                                            size={24}
                                            className="text-red-500"
                                        />
                                        Manual Analysis Trigger
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        User clicks "Run Analysis" button →
                                        Frontend sends POST to{" "}
                                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded">
                                            /api/videos/analyze
                                        </code>{" "}
                                        with video_id → Backend creates
                                        background task and returns task_id →
                                        Frontend begins polling
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                        3
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                        <CodeIcon
                                            size={24}
                                            className="text-red-500"
                                        />
                                        Frame Extraction
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        OpenCV reads video file → Extracts ~30
                                        frames evenly distributed across video
                                        duration → Each frame converted to numpy
                                        array for analysis
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                        4
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                        <BrainIcon
                                            size={24}
                                            className="text-red-500"
                                        />
                                        Frame Analysis
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        For each frame: Calculate 6 detection
                                        signals → Compute weighted suspicion
                                        score → Mark as suspicious if score ≥
                                        0.35 → Store frame data with timestamp
                                        and confidence
                                    </p>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                        5
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                        <MapPinIcon
                                            size={24}
                                            className="text-red-500"
                                        />
                                        Artifact Detection
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        For ALL frames (not just suspicious):
                                        Perform 4x4 grid analysis → Detect face
                                        regions using Haar Cascade → Find
                                        contours and high-contrast areas →
                                        Return artifact regions with normalized
                                        coordinates (0-1)
                                    </p>
                                </div>
                            </div>

                            {/* Step 6 */}
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                        6
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                        <ShieldCheckIcon
                                            size={24}
                                            className="text-red-500"
                                        />
                                        Overall Verdict
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Calculate percentage of suspicious
                                        frames → Mark as{" "}
                                        <span className="text-red-400 font-semibold">
                                            FAKE
                                        </span>{" "}
                                        if ≥40% suspicious → Mark as{" "}
                                        <span className="text-green-400 font-semibold">
                                            REAL
                                        </span>{" "}
                                        if ≤20% suspicious → Mark as{" "}
                                        <span className="text-yellow-400 font-semibold">
                                            SUSPICIOUS
                                        </span>{" "}
                                        if between 20-40%
                                    </p>
                                </div>
                            </div>

                            {/* Step 7 */}
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                        7
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                        <ChartLineIcon
                                            size={24}
                                            className="text-red-500"
                                        />
                                        Results Display
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        Frontend polls{" "}
                                        <code className="bg-red-500/10 text-red-400 px-2 py-1 rounded">
                                            /api/analysis/&lt;task_id&gt;
                                        </code>{" "}
                                        → Receives analysis result with verdict,
                                        confidence, and frame data → Updates UI
                                        with color-coded result
                                    </p>
                                </div>
                            </div>

                            {/* Step 8 */}
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                        8
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                        <EyeIcon
                                            size={24}
                                            className="text-red-500"
                                        />
                                        Interactive Timeline
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed mb-3">
                                        Custom video player displays anomaly
                                        markers on timeline → Analysis panel
                                        shows clickable timestamp cards → User
                                        clicks timestamp → Video seeks to that
                                        frame → Artifact overlays drawn on
                                        canvas
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                                            Orange: Blur
                                        </span>
                                        <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                                            Yellow: Edges
                                        </span>
                                        <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                                            Purple: Faces
                                        </span>
                                        <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm">
                                            Magenta: Lighting
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="how-it-works" className="mb-12 scroll-mt-8">
                        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
                            How It Works
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                        1
                                    </div>
                                </div>
                                <div>
                                    <h3
                                        id="upload-video"
                                        className="text-xl font-semibold mb-2 flex items-center gap-2 scroll-mt-8"
                                    >
                                        <UploadIcon size={24} />
                                        Upload Video
                                    </h3>
                                    <p className="text-gray-300">
                                        Navigate to the home page and upload
                                        your video file. You can either click
                                        the "Upload Video" button or drag and
                                        drop your video file directly into the
                                        upload area. Supported formats include
                                        MP4, AVI, MOV, and WebM.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                        2
                                    </div>
                                </div>
                                <div>
                                    <h3
                                        id="processing"
                                        className="text-xl font-semibold mb-2 flex items-center gap-2 scroll-mt-8"
                                    >
                                        <CodeIcon size={24} />
                                        Processing
                                    </h3>
                                    <p className="text-gray-300">
                                        Once uploaded, click the "Run Analysis"
                                        button in the Analysis panel. Our AI
                                        system will process the video frame by
                                        frame, analyzing facial movements,
                                        lighting patterns, and other telltale
                                        signs of manipulation. This typically
                                        takes 30-60 seconds depending on video
                                        length.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <div className="bg-red-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                        3
                                    </div>
                                </div>
                                <div>
                                    <h3
                                        id="review-results"
                                        className="text-xl font-semibold mb-2 flex items-center gap-2 scroll-mt-8"
                                    >
                                        <ChartBarIcon size={24} />
                                        Review Results
                                    </h3>
                                    <p className="text-gray-300">
                                        The analysis results will appear in the
                                        Analysis panel, showing a confidence
                                        score indicating the likelihood that the
                                        video contains deepfake content. You'll
                                        also receive detailed insights about
                                        specific frames or sections that raised
                                        suspicion.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="technical-details"
                        className="mb-12 scroll-mt-8"
                    >
                        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
                            Technical Details
                        </h2>
                        <div className="bg-gray-900 p-6 rounded border border-gray-700">
                            <h3 className="text-xl font-semibold mb-3">
                                Detection Methods
                            </h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex gap-2">
                                    <CheckCircleIcon
                                        size={24}
                                        className="shrink-0 text-red-600"
                                    />
                                    <span>
                                        <strong>
                                            Blur Analysis (Laplacian Variance):
                                        </strong>{" "}
                                        Calculates image sharpness to detect
                                        unnatural blur patterns typical of
                                        AI-generated faces
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircleIcon
                                        size={24}
                                        className="shrink-0 text-red-600"
                                    />
                                    <span>
                                        <strong>
                                            Edge Consistency (Canny Detection):
                                        </strong>{" "}
                                        Analyzes edge density and patterns to
                                        identify manipulation artifacts
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircleIcon
                                        size={24}
                                        className="shrink-0 text-red-600"
                                    />
                                    <span>
                                        <strong>
                                            Lighting & Brightness Analysis:
                                        </strong>{" "}
                                        Examines statistical properties of
                                        brightness and contrast for
                                        inconsistencies
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircleIcon
                                        size={24}
                                        className="shrink-0 text-red-600"
                                    />
                                    <span>
                                        <strong>
                                            Color Distribution (Histogram):
                                        </strong>{" "}
                                        Analyzes color channel distributions to
                                        detect anomalies
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircleIcon
                                        size={24}
                                        className="shrink-0 text-red-600"
                                    />
                                    <span>
                                        <strong>Noise Pattern Analysis:</strong>{" "}
                                        Detects unnatural high-frequency noise
                                        patterns
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircleIcon
                                        size={24}
                                        className="shrink-0 text-red-600"
                                    />
                                    <span>
                                        <strong>
                                            Face Detection (Haar Cascade):
                                        </strong>{" "}
                                        Identifies and analyzes facial regions
                                        for manipulation
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircleIcon
                                        size={24}
                                        className="shrink-0 text-red-600"
                                    />
                                    <span>
                                        <strong>
                                            Compression Artifacts (DCT):
                                        </strong>{" "}
                                        Analyzes encoding inconsistencies
                                        typical of deepfakes
                                    </span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <h3 className="text-xl font-semibold mb-3">
                                    Artifact Visualization
                                </h3>
                                <p className="text-gray-300 mb-3">
                                    The system provides real-time artifact
                                    overlays on the video player with
                                    color-coded regions:
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                        <span>Orange: Blur artifacts</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                        <span>
                                            Yellow: Edge inconsistencies
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                        <span>Purple: Face regions</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-pink-500 rounded"></div>
                                        <span>Magenta: Lighting anomalies</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="best-practices" className="mb-12 scroll-mt-8">
                        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
                            Best Practices
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            <li>
                                Upload the highest quality version of the video
                                available
                            </li>
                            <li>
                                Ensure videos are at least 480p resolution for
                                accurate analysis
                            </li>
                            <li>
                                Videos should be under 5 minutes for optimal
                                processing time
                            </li>
                            <li>
                                Multiple analyses can be run on the same video
                                from different angles
                            </li>
                            <li>
                                Results should be considered alongside other
                                verification methods
                            </li>
                        </ul>
                    </section>

                    <section id="limitations" className="mb-12 scroll-mt-8">
                        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
                            Limitations
                        </h2>
                        <div className="bg-yellow-900/20 border border-yellow-700 p-6 rounded">
                            <p className="text-gray-300 mb-3">
                                While our system is highly accurate, it's
                                important to understand its limitations:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                                <li>No detection system is 100% accurate</li>
                                <li>Advanced deepfakes may evade detection</li>
                                <li>
                                    Low-quality videos may produce false
                                    positives
                                </li>
                                <li>
                                    Results should be used as one factor in
                                    verification, not the sole determinant
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section id="privacy-security" className="mb-8 scroll-mt-8">
                        <h2 className="text-3xl font-semibold mb-4 border-b border-gray-700 pb-2">
                            Privacy & Security
                        </h2>
                        <p className="text-gray-300 mb-4">
                            We take your privacy seriously. Uploaded videos are
                            processed in real-time and are not stored on our
                            servers after analysis is complete. All video
                            processing happens in a secure, encrypted
                            environment, and no personal data is collected or
                            retained.
                        </p>
                    </section>
                </div>
            </div>
            <DocsNav />
        </main>
    );
}

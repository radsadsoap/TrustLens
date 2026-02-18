import {
    VideoCameraIcon,
    SpinnerGap,
    WarningCircle,
} from "@phosphor-icons/react";

interface PlayerProps {
    videoUrl: string | null;
    onVideoUpload: (file: File) => void;
    isUploading?: boolean;
    uploadError?: string | null;
}

export default function Player({
    videoUrl,
    onVideoUpload,
    isUploading,
    uploadError,
}: PlayerProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onVideoUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("video/")) {
            onVideoUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div className="w-3/4 p-4 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2 tracking-wide">
                <VideoCameraIcon />
                Upload Video
            </h2>

            {uploadError && (
                <div className="bg-red-900/20 border border-red-600 p-4 rounded flex items-center gap-2">
                    <WarningCircle size={24} className="text-red-600" />
                    <span className="text-red-400">{uploadError}</span>
                </div>
            )}

            {!videoUrl ? (
                <div
                    className="border-2 border-dashed p-8 flex items-center flex-col gap-4 justify-center text-center cursor-pointer transition duration-200 hover:border-gray-600"
                    onClick={() =>
                        document.getElementById("video-input")?.click()
                    }
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <input
                        id="video-input"
                        type="file"
                        accept="video/*"
                        hidden
                        onChange={handleFileChange}
                    />
                    <button
                        className="bg-red-600 px-8 py-3 cursor-pointer hover:bg-red-700 transition duration-200 flex items-center gap-2 justify-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById("video-input")?.click();
                        }}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <SpinnerGap
                                    size={20}
                                    className="animate-spin"
                                />
                                Uploading...
                            </>
                        ) : (
                            "Upload Video"
                        )}
                    </button>
                    <p>or drag / drop a video here</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 flex-1">
                    <video
                        src={videoUrl}
                        controls
                        className="w-full h-48 flex-1 rounded border border-gray-700"
                    />
                    <button
                        className="bg-gray-700 px-6 py-2 cursor-pointer hover:bg-gray-600 transition duration-200 w-fit"
                        onClick={() =>
                            document.getElementById("video-input")?.click()
                        }
                    >
                        Change Video
                    </button>
                    <input
                        id="video-input"
                        type="file"
                        accept="video/*"
                        hidden
                        onChange={handleFileChange}
                    />
                </div>
            )}
            <p
                className="text-gray-300 text-sm [&>span]:underline [&>span]:cursor-pointer
            [&>span]:hover:text-red-600 [&>span]:transition duration-200 [&>span]:underline-offset-3"
            >
                *By uploading, you agree to our <span>Terms of Service</span>{" "}
                and <span>Privacy Policy</span>.
            </p>
        </div>
    );
}

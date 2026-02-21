import React, { useRef, useState } from "react";

interface ImageUploadProps {
    onImageSelect: (file: File | null) => void;
    disabled?: boolean;
}

export function ImageUpload({
    onImageSelect,
    disabled = false,
}: ImageUploadProps): React.ReactNode {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file: File | null): void => {
        if (!file) {
            setPreview(null);
            setFileName("");
            onImageSelect(null);
            return;
        }

        // Validate
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert("Image must be smaller than 10MB.");
            return;
        }

        setFileName(file.name);
        onImageSelect(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent): void => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0] || null;
        handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent): void => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (): void => setIsDragging(false);

    const clearImage = (): void => handleFile(null);

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-[var(--color-text)]">
                Upload medical image
            </label>

            {preview ? (
                <div className="relative rounded-lg border border-[var(--color-border)] overflow-hidden">
                    <img
                        src={preview}
                        alt="Uploaded medical image"
                        className="w-full max-h-64 object-contain bg-gray-50"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button
                            type="button"
                            onClick={clearImage}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                        >
                            Remove
                        </button>
                    </div>
                    <div className="px-4 py-2 bg-white border-t border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-muted)] truncate">
                            {fileName}
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center py-10 px-6 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${isDragging
                            ? "border-[var(--color-primary)] bg-blue-50"
                            : "border-[var(--color-border)] hover:border-gray-400 bg-[var(--color-surface-alt)]"
                        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
                >
                    <div className="text-3xl mb-3">📷</div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                        Drop an image here or click to browse
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        Skin lesions, retinal scans, X-rays — max 10MB
                    </p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
        </div>
    );
}

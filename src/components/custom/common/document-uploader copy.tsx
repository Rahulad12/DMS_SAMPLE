import { useState, useCallback } from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import {
  CloudUpload,
  File,
  X,
  FileText,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// File type icons mapping
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return ImageIcon;
  if (fileType.startsWith("video/")) return FileVideo;
  if (fileType.startsWith("audio/")) return FileAudio;
  if (fileType.includes("pdf") || fileType.includes("document"))
    return FileText;
  if (
    fileType.includes("zip") ||
    fileType.includes("rar") ||
    fileType.includes("7z")
  )
    return Archive;
  return File;
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export interface FileUploaderProps {
  onFilesChange?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  disabled?: boolean;
  className?: string;
  title?: string;
  description?: string;
  showPreview?: boolean;
}

const DocumentUploader = ({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10485760, // 10MB default
  accept,
  disabled = false,
  className,
  title = "Upload Your Files",
  description = "Drag & drop files here, or click to select files",
  showPreview = true,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFilesChange?.(newFiles);
      setIsDragActive(false);
    },
    [files, maxFiles, onFilesChange],
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    maxFiles,
    maxSize,
    accept,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  };

  const { getRootProps, getInputProps, isDragReject } =
    useDropzone(dropzoneOptions);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer",
          "hover:border-primary/50 hover:bg-primary/5",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          isDragActive && "border-primary bg-primary/10 scale-[1.02]",
          isDragReject && "border-destructive bg-destructive/10",
          disabled &&
            "opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent",
          !isDragActive && !isDragReject && "border-border",
        )}
      >
        <input {...getInputProps()} />

        <div className="relative p-12 text-center">
          {/* Animated Background Gradient */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-300",
              isDragActive && "opacity-100",
            )}
          />

          {/* Upload Icon with Animation */}
          <div className="relative mb-6 flex justify-center">
            <div
              className={cn(
                "rounded-full bg-primary/10 p-6 transition-all duration-300",
                isDragActive && "scale-110 bg-primary/20 animate-pulse",
              )}
            >
              <CloudUpload
                className={cn(
                  "h-12 w-12 text-primary transition-transform duration-300",
                  isDragActive && "scale-110",
                )}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="relative space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {isDragActive ? "Drop files here" : title}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {isDragReject
                ? "Some files will be rejected. Please check file type and size."
                : description}
            </p>

            {/* File Constraints */}
            <div className="pt-4 flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
              {maxFiles && (
                <span className="px-3 py-1 rounded-full bg-muted">
                  Max {maxFiles} file{maxFiles > 1 ? "s" : ""}
                </span>
              )}
              {maxSize && (
                <span className="px-3 py-1 rounded-full bg-muted">
                  Max {formatFileSize(maxSize)} per file
                </span>
              )}
            </div>
          </div>

          {/* Browse Button */}
          <div className="relative mt-6">
            <Button
              type="button"
              variant="default"
              className="pointer-events-none"
              disabled={disabled}
            >
              Browse Files
            </Button>
          </div>
        </div>
      </div>

      {/* File Preview List */}
      {showPreview && files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Selected Files ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:border-primary/50 hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
                >
                  {/* File Icon */}
                  <div className="flex-shrink-0 rounded-md bg-primary/10 p-2">
                    <FileIcon className="h-5 w-5 text-primary" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;

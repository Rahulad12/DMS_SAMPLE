import { useState, useCallback } from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import {
  File,
  X,
  FileText,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  Archive,
  Upload,
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
  maxSize = 5242880,
  accept,
  disabled = false,
  className,
  // title = "Upload Your Files",
  // description = "Drag & drop files here, or click to select files",
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
    <div className={cn("space-y-6", className)}>
      {/* Compact Dropzone Area */}
      <div
        {...getRootProps()}
        className={cn(
          "relative overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer",
          "hover:border-primary/50 hover:bg-primary/5",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          isDragActive && "border-primary bg-primary/10",
          isDragReject && "border-destructive bg-destructive/10",
          disabled &&
          "opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent",
          !isDragActive && !isDragReject && "border-border",
        )}
      >
        <input {...getInputProps()} />

        <div className="flex items-center gap-4 p-4">
          {/* Upload Icon */}
          <div
            className={cn(
              "shrink-0 rounded-lg bg-primary/10 p-3 transition-all duration-200",
              isDragActive && "bg-primary/20 scale-105",
            )}
          >
            <Upload
              className={cn(
                "h-6 w-6 text-primary transition-transform duration-200",
                isDragActive && "scale-110",
              )}
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? "Drop files here" : "Drag file or"}{" "}
              <span className="text-primary underline">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isDragReject
                ? "Check Your Extensions or File Size"
                : `PDF, JPG, PNG (max ${formatFileSize(maxSize)})`}
            </p>
          </div>
        </div>
      </div>

      {/* File Preview Section
      {showPreview && files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            Document Preview
          </h4>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="space-y-2">
              {files.map((file, index) => {
                const FileIcon = getFileIcon(file.type);
                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="group flex items-center gap-3 rounded-md border border-border bg-background p-3 transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
                  >
                    <div className="shrink-0 rounded-md bg-primary/10 p-2">
                      <FileIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
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
        </div>
      )} */}
    </div>
  );
};

export default DocumentUploader;

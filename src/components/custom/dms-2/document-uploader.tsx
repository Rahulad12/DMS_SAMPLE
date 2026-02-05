import { useEffect, useState } from 'react';
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from '@/hooks/use-file-upload';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CloudUpload,
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  RefreshCwIcon,
  Trash2,
  TriangleAlert,
  Upload,
  VideoIcon,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Document } from '@/types/types';

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  documentLabel?: string;
}

interface DocumentUploaderProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  simulateUpload?: boolean;
  documents?: Document[];
}

export default function DocumentUploader({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  accept = '*',
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
  documents,
}: DocumentUploaderProps) {
  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);

  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: [],
    onFilesChange: (newFiles) => {
      const newUploadFiles = newFiles.map((file) => {
        const existingFile = uploadFiles.find((existing) => existing.id === file.id);

        if (existingFile) {
          return {
            ...existingFile,
            ...file,
          };
        } else {
          return {
            ...file,
            progress: 0,
            status: 'uploading' as const,
            documentLabel: selectedDocument ? getDocumentLabel(selectedDocument) : undefined,
          };
        }
      });
      setUploadFiles(newUploadFiles);
      onFilesChange?.(newFiles);
    },
  });

  const getDocumentLabel = (docId: number): string => {
    if (!documents) return '';
    const doc = documents.find((d) => d.id);
    return doc?.label || '';
  };

  // Simulate upload progress
  useEffect(() => {
    if (!simulateUpload) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;

          const increment = Math.random() * 15 + 5;
          const newProgress = Math.min(file.progress + increment, 100);

          if (newProgress >= 100) {
            const shouldFail = Math.random() < 0.05; // 5% chance to fail
            return {
              ...file,
              progress: 100,
              status: shouldFail ? ('error' as const) : ('completed' as const),
              error: shouldFail ? 'Upload failed. Please try again.' : undefined,
            };
          }

          return { ...file, progress: newProgress };
        }),
      );
    }, 500);

    return () => clearInterval(interval);
  }, [simulateUpload]);

  const removeUploadFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
    removeFile(fileId);
  };

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, progress: 0, status: 'uploading' as const, error: undefined } : file,
      ),
    );
  };

  const getFileIcon = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith('image/')) return <ImageIcon className="size-4" />;
    if (type.startsWith('video/')) return <VideoIcon className="size-4" />;
    if (type.startsWith('audio/')) return <HeadphonesIcon className="size-4" />;
    if (type.includes('pdf')) return <FileTextIcon className="size-4" />;
    if (type.includes('word') || type.includes('doc')) return <FileTextIcon className="size-4" />;
    if (type.includes('excel') || type.includes('sheet')) return <FileSpreadsheetIcon className="size-4" />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchiveIcon className="size-4" />;
    return <FileTextIcon className="size-4" />;
  };

  const getFileTypeLabel = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word') || type.includes('doc')) return 'Word';
    if (type.includes('excel') || type.includes('sheet')) return 'Excel';
    if (type.includes('zip') || type.includes('rar')) return 'Archive';
    if (type.includes('json')) return 'JSON';
    if (type.includes('text')) return 'Text';
    return 'File';
  };

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Required Documents */}
      {identificationType && (
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Required Documents for {identificationType.label}</CardTitle>
            <CardDescription>Upload all required documents below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents?.map((doc) => {
              const uploadedFile = uploadFiles.find((f) => f.documentLabel === doc.label);
              const isSelected = selectedDocument === doc.id;

              return (
                <div
                  key={doc.id}
                  className={cn(
                    'rounded-lg border-2 p-4 transition-all cursor-pointer hover:border-primary/50',
                    isSelected && 'border-primary bg-primary/5',
                    uploadedFile?.status === 'completed' && 'border-green-500 bg-green-50',
                  )}
                  onClick={() => setSelectedDocument(doc.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          uploadedFile?.status === 'completed'
                            ? 'bg-green-100'
                            : uploadedFile?.status === 'error'
                              ? 'bg-red-100'
                              : 'bg-slate-100',
                        )}
                      >
                        {uploadedFile?.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : uploadedFile?.status === 'error' ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <FileTextIcon className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{doc.label}</p>
                        {uploadedFile && (
                          <p className="text-xs text-muted-foreground">
                            {uploadedFile.file.name} ({formatBytes(uploadedFile.file.size)})
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={uploadedFile?.status === 'completed' ? 'default' : 'secondary'}
                      className={cn(
                        uploadedFile?.status === 'completed' && 'bg-green-600 hover:bg-green-700',
                      )}
                    >
                      {uploadedFile?.status === 'completed'
                        ? 'Uploaded'
                        : uploadedFile?.status === 'uploading'
                          ? `${Math.round(uploadedFile.progress)}%`
                          : 'Required'}
                    </Badge>
                  </div>
                </div>
              );
            })}

          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed p-8 text-center transition-all',
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50',
          !selectedDocument && 'opacity-50 pointer-events-none',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" disabled={!selectedDocument} />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 transition-all',
              isDragging && 'scale-110 from-primary/30 to-primary/10',
            )}
          >
            <Upload className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <p className="text-base font-semibold">
              {selectedDocument ? (
                <>
                  Drop files here or{' '}
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="cursor-pointer text-primary underline-offset-4 hover:underline"
                  >
                    browse files
                  </button>
                </>
              ) : (
                'Select a document type above to upload'
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {formatBytes(maxSize)} • Maximum files: {maxFiles}
            </p>
          </div>
        </div>
      </div>

      {/* Files Table */}
      {uploadFiles.length > 0 && (
        <Card className="border-2 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Uploaded Files ({uploadFiles.length})</CardTitle>
                <CardDescription>Manage your uploaded documents</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={openFileDialog} variant="outline" size="sm" disabled={!selectedDocument}>
                  <CloudUpload className="mr-2 h-4 w-4" />
                  Add files
                </Button>
                <Button onClick={clearFiles} variant="outline" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove all
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs bg-muted/50">
                    <TableHead className="h-10 font-semibold">Name</TableHead>
                    <TableHead className="h-10 font-semibold">Document Type</TableHead>
                    <TableHead className="h-10 font-semibold">File Type</TableHead>
                    <TableHead className="h-10 font-semibold">Size</TableHead>
                    <TableHead className="h-10 font-semibold">Status</TableHead>
                    <TableHead className="h-10 w-[100px] text-end font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadFiles.map((fileItem) => (
                    <TableRow key={fileItem.id} className="hover:bg-muted/50">
                      <TableCell className="py-3 ps-2">
                        <div className="flex items-center gap-2">
                          <div className="size-9 shrink-0 relative flex items-center justify-center">
                            {fileItem.status === 'uploading' ? (
                              <div className="relative">
                                <svg className="size-9 -rotate-90" viewBox="0 0 36 36">
                                  <circle
                                    cx="18"
                                    cy="18"
                                    r="16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    className="text-muted-foreground/20"
                                  />
                                  <circle
                                    cx="18"
                                    cy="18"
                                    r="16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeDasharray={`${2 * Math.PI * 16}`}
                                    strokeDashoffset={`${2 * Math.PI * 16 * (1 - fileItem.progress / 100)}`}
                                    className="text-primary transition-all duration-300"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  {getFileIcon(fileItem.file)}
                                </div>
                              </div>
                            ) : (
                              <div className="size-9 flex items-center justify-center bg-muted rounded-lg">
                                {getFileIcon(fileItem.file)}
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{fileItem.file.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className="font-medium">
                          {fileItem.documentLabel || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className="text-xs">
                          {getFileTypeLabel(fileItem.file)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground">
                        {formatBytes(fileItem.file.size)}
                      </TableCell>
                      <TableCell className="py-3">
                        {fileItem.status === 'completed' && (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Completed
                          </Badge>
                        )}
                        {fileItem.status === 'uploading' && (
                          <Badge variant="secondary">
                            <div className="mr-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                            {Math.round(fileItem.progress)}%
                          </Badge>
                        )}
                        {fileItem.status === 'error' && (
                          <Badge variant="destructive">
                            <XCircle className="mr-1 h-3 w-3" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-3 pe-2">
                        <div className="flex items-center justify-end gap-1">
                          {fileItem.status === 'error' ? (
                            <Button
                              onClick={() => retryUpload(fileItem.id)}
                              variant="ghost"
                              size="icon"
                              className="size-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            >
                              <RefreshCwIcon className="size-4" />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => removeUploadFile(fileItem.id)}
                              variant="ghost"
                              size="icon"
                              className="size-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="border-2">
          <TriangleAlert className="h-5 w-5" />
          <AlertTitle className="font-semibold">File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                • {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

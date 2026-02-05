import type { DMSDocument } from "../../../types/types";
import DocumentUploader from "@/components/custom/common/document-uploader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, RotateCcw } from "lucide-react";

interface DocumentDetailProps {
  document: DMSDocument;
  onUpload: (files: File[]) => void;
  onReplace: () => void;
}

export function DocumentDetail({
  document,
  onUpload,
  onReplace,
}: DocumentDetailProps) {
  const isUploaded = document.status === "uploaded";

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Document Info & Upload */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto lg:border-r border-slate-200">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-slate-800">
              {document.name}
            </h2>
            {document.required && (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0"
              >
                Required
              </Badge>
            )}
            {!document.required && (
              <Badge
                variant="outline"
                className="text-slate-500 border-slate-200"
              >
                Optional
              </Badge>
            )}
          </div>
          <p className="text-slate-500 text-sm">
            {isUploaded
              ? "Document uploaded successfully."
              : "Please upload the required document below."}
          </p>
        </div>

        {!isUploaded ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              <DocumentUploader
                onFilesChange={onUpload}
                maxFiles={1}
                title={`Upload ${document.name}`}
                description="Drag & drop or click to upload"
                className="border-0 shadow-none bg-transparent"
              />
              <p className="text-xs text-slate-400 text-center mt-3">
                Accepted formats: PDF, JPG, PNG (max 5MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 p-6">
            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">
              Document Uploaded
            </h3>
            <p className="text-sm text-slate-500 mb-1">{document.file?.name}</p>
            <p className="text-xs text-slate-400 mb-4">
              Uploaded {new Date().toLocaleDateString()}
            </p>
            <Button
              variant="outline"
              onClick={onReplace}
              className="text-slate-600 hover:text-slate-900"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Replace Document
            </Button>
          </div>
        )}
      </div>

      {/* Right Side - Document Preview (Wraps below on mobile, side-by-side on lg+) */}
      <div className="flex flex-col w-full lg:w-[45%] bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-semibold text-slate-800">Document Preview</h3>
          <p className="text-xs text-slate-500">
            Review your uploaded document below
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          {!isUploaded ? (
            <div className="text-center text-slate-400">
              <FileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Upload a document to preview</p>
            </div>
          ) : (
            <>
              {document.type === "image" && document.previewUrl ? (
                <div className="w-full h-full flex items-center justify-center bg-white rounded-lg shadow-sm p-4">
                  <img
                    src={document.previewUrl}
                    alt={document.name}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
              ) : document.previewUrl ? (
                <div className="w-full h-full flex flex-col">
                  <iframe
                    src={document.previewUrl}
                    className="flex-1 w-full rounded-lg shadow-sm bg-white"
                    title={document.name}
                  />
                  <div className="mt-4 text-center">
                    <a
                      href={document.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[#008eb0] hover:underline inline-flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" x2="21" y1="14" y2="3" />
                      </svg>
                      Open Full Viewer
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
                  <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    {document.file?.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {(document.file?.size || 0) / 1024 > 1024
                      ? `${((document.file?.size || 0) / 1024 / 1024).toFixed(2)} MB`
                      : `${Math.round((document.file?.size || 0) / 1024)} KB`}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

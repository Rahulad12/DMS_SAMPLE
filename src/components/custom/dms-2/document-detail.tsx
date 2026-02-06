import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, RotateCcw } from 'lucide-react';
import DocumentUploader from './document-uploader';

interface DocumentDetailProps {
  document: any;
  onUpload: (files: any[]) => void;
  onReplace: () => void;
}

export function DocumentDetail({
  document,
  onUpload,
  onReplace,
}: DocumentDetailProps) {
  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-400">Select a document to view</p>
      </div>
    );
  }

  // Check if file is base64 data or a File object
  const isBase64 = typeof document.file === 'string' && document.file.startsWith('data:');
  const isUploaded = isBase64 || (document.file !== undefined && document.file !== null);
  const previewSource = isBase64 ? document.file : document.previewUrl;

  return (
    <div className="flex-1 grid sm:grid-cols-1 md:grid-cols-[400px_1fr] overflow-hidden h-full">
      {/* document upload sections */}
      <div className="p-4 border-b border-slate-200 bg-white h-full overflow-y-auto max-h-screen">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-slate-800 capitalize">{document.label}</h2>
        </div>

        {/* Upload Status / Uploader */}
        {!isUploaded ? (
          <>
            <DocumentUploader
              maxSize={5 * 1024 * 1024}
              multiple={document.allowMultiple !== false}
              onFilesChange={onUpload}
              className="bg-transparent"
              documents={document.documents || []}
            />
          </>
        ) : (
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center ">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800 text-sm break-all">
                  {document.file?.name || document.label}
                </p>
                <p className="text-xs text-slate-500">
                  Uploaded {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            {document.allowUpdate !== false && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReplace}
                className="text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Replace
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Document Preview Section - Takes remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <div className="p-2 border-b border-slate-200 bg-white">
          <h3 className="font-semibold text-slate-800">Document Preview</h3>
        </div>

        <div className="flex-1 p-2 overflow-auto">
          {!isUploaded ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm text-slate-400 mb-4">No document uploaded yet</p>
                <label className="inline-block">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        onUpload(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                  />
                  <Button className="bg-[#008eb0] hover:bg-[#007a94]">
                    Upload Document
                  </Button>
                </label>
              </div>
            </div>
          ) : (
            <div className="h-[calc(100vh-200px)] overflow-auto">
              {(isBase64 || document.type === 'image') && previewSource ? (
                <div className="w-full h-full flex items-center justify-center bg-white">
                  <img
                    src={previewSource}
                    alt={document.label}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
              ) : previewSource ? (
                <div className="w-full h-full flex flex-col">
                  <iframe
                    src={previewSource}
                    className="flex-1 w-full h-full"
                    title={document.label}
                  />
                  <div className="mt-4 text-center">
                    <a
                      href={previewSource}
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
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    {document.file?.name || typeof document.file === 'string' ? 'Document' : 'File'}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {typeof document.file === 'object' && document.file?.size
                      ? (document.file.size / 1024 > 1024
                        ? `${(document.file.size / 1024 / 1024).toFixed(2)} MB`
                        : `${Math.round(document.file.size / 1024)} KB`)
                      : 'Base64 encoded'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

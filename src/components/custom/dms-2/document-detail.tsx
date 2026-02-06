// import { Button } from '@/components/ui/button';
// import { CheckCircle2, RotateCcw } from 'lucide-react';
// import DocumentUploader from './document-uploader';

// interface DocumentDetailProps {
//   document: any;
//   onUpload: (files: any[], label?: string) => void;
//   onReplace: () => void;
// }

// export function DocumentDetail({
//   document,
//   onUpload,
//   onReplace,
// }: DocumentDetailProps) {
//   if (!document) {
//     return (
//       <div className="flex-1 flex items-center justify-center max-h-screen h-screen border border-red-700">

//       </div>
//     );
//   }

//   // Check if file is base64 data or a File object
//   const isBase64 = typeof document.file === 'string' && document.file.startsWith('data:');
//   const isUploaded = isBase64 || (document.file !== undefined && document.file !== null);
//   const previewSource = isBase64 ? document.file : document.previewUrl;

//   return (
//     <div className="flex-1 grid sm:grid-cols-1 md:grid-cols-[400px_1fr] h-screen">
//       {/* document upload sections */}
//       <div className="p-4 border-b border-slate-200 bg-white h-screen overflow-y-auto">
//         <div className="flex items-center gap-2 mb-4">
//           <h2 className="text-xl font-bold text-slate-800 capitalize">{document.label}</h2>
//         </div>
//         {!isUploaded ? (
//           <>
//             <DocumentUploader
//               maxSize={5 * 1024 * 1024}
//               multiple={document.allowMultiple !== false}
//               onFilesChange={onUpload}
//               className="bg-transparent"
//               documents={document.documents || []}
//               defaultLabel={document.label}
//             />
//           </>
//         ) : (
//           <div className="flex items-center justify-between bg-green-50 rounded-lg p-4 border border-green-200">
//             <div className="flex items-center gap-3">
//               <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center ">
//                 <CheckCircle2 className="w-5 h-5 text-green-600" />
//               </div>
//               <div>
//                 <p className="font-medium text-slate-800 text-sm break-all">
//                   {document.file?.name || document.label}
//                 </p>
//                 <p className="text-xs text-slate-500">
//                   Uploaded {new Date().toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//             {document.allowUpdate !== false && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onReplace}
//                 className="text-slate-600 hover:text-slate-900"
//               >
//                 <RotateCcw className="w-4 h-4 mr-2" />
//                 Replace
//               </Button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Document Preview Section - Takes remaining space */}
//       <div className="flex-1 flex flex-col overflow-hidden h-full">
//         <div className="p-2 border-b border-slate-200 bg-white">
//           <h3 className="font-semibold text-slate-800">Document Preview</h3>
//         </div>

//         <div className="flex-1 p-2 overflow-auto">
//           <div className="h-[calc(100vh-200px)] overflow-auto">
//             {(isBase64 || document.type === 'image') && previewSource ? (
//               <div className="w-full h-full flex items-center justify-center bg-white">
//                 <img
//                   src={previewSource}
//                   alt={document.label}
//                   className="max-h-full max-w-full object-contain rounded"
//                 />
//               </div>
//             ) : previewSource ? (
//               <div className="w-full h-full flex flex-col">
//                 <iframe
//                   src={previewSource}
//                   className="flex-1 w-full h-full"
//                   title={document.label}
//                 />
//                 <div className="mt-4 text-center">
//                   <a
//                     href={previewSource}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-sm text-[#008eb0] hover:underline inline-flex items-center gap-1"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
//                       <polyline points="15 3 21 3 21 9" />
//                       <line x1="10" x2="21" y1="14" y2="3" />
//                     </svg>
//                     Open Full Viewer
//                   </a>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center border h-full flex items-center justify-center">
//                 <div className="w-16 h-16">
//                   No Document Uploaded
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// document-detail.tsx
import { Button } from '@/components/ui/button';
import { CheckCircle2, RotateCcw, FileText, X } from 'lucide-react';
import DocumentUploader from './document-uploader';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DocumentPreview } from '../common/document-preview';

interface DocumentDetailProps {
  document: any;
  onUpload: (files: any[], label?: string) => void;
  onReplace: () => void;
  onClose?: () => void;
}

export function DocumentDetail({
  document,
  onUpload,
  onReplace,
  onClose,
}: DocumentDetailProps) {
  if (!document) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-linear-to-br from-slate-50 to-slate-100 p-1">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No Document Selected
          </h3>
          <p className="text-slate-500 text-sm">
            Select a document from the list or upload a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  const isBase64 = typeof document.file === 'string' && document.file.startsWith('data:');
  const isUploaded = isBase64 || (document.file !== undefined && document.file !== null);
  const previewSource = isBase64 ? document.file : document.previewUrl;
  const fileSize = document.file?.size ? `${(document.file.size / (1024 * 1024)).toFixed(2)} MB` : 'N/A';

  return (
    <div className="flex-1 flex flex-col h-screen bg-linear-to-br from-slate-50 to-slate-100 border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-2 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 w-full">
          <div className="p-2 rounded-lg bg-blue-50">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className='w-full flex gap-2 item-center'>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 capitalize">
              {document.label}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs font-normal">
                {document.type || 'Document'}
              </Badge>
              {document.required && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </div>
          </div>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2 p-4 md:p-2 overflow-hidden">
        {/* Left Panel - Upload/Info Section */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-slate-100">
                <FileText className="w-4 h-4 text-slate-600" />
              </div>
              Document Details
            </h3>

            {!isUploaded ? (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 font-medium">
                    {document.required ? 'Required Document' : 'Optional Document'}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {document.description || `Please upload your ${document.label.toLowerCase()}`}
                  </p>
                </div>

                <DocumentUploader
                  maxSize={5 * 1024 * 1024}
                  multiple={document.allowMultiple !== false}
                  onFilesChange={onUpload}
                  className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl"
                  documents={document.documents || []}
                  defaultLabel={document.label}
                />

                <div className="text-xs text-slate-500 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Maximum file size:</span>
                    <span className="font-medium">5 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Allowed formats:</span>
                    <span className="font-medium">PDF, JPEG, PNG</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100 shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-green-800 text-sm truncate">
                        {document.file?.name || document.label}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-green-700">
                        <span>Uploaded {new Date().toLocaleDateString()}</span>
                        <span className="h-1 w-1 rounded-full bg-green-400"></span>
                        <span>{fileSize}</span>
                      </div>
                      {document.status === 'verified' && (
                        <Badge className="mt-2 bg-green-100 text-green-800 border-green-300">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {document.allowUpdate !== false && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onReplace}
                        className="flex-1 border-slate-300 hover:bg-slate-50"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Replace
                      </Button>
                    </div>
                  )}
                </div>

                {/* Document Status */}
                {document.status && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-700">Processing Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Verification</span>
                        <span className="font-medium text-slate-800">
                          {document.status === 'verified' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <Progress
                        value={document.status === 'verified' ? 100 : 50}
                        className="h-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Requirements Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Requirements</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                </div>
                <span>Clear and readable text/images</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                </div>
                <span>All pages must be included</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                </div>
                <span>File size must not exceed 5MB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Preview Section */}
        <div className="lg:col-span-2 flex flex-col">
          <DocumentPreview
            document={document}
            previewSource={previewSource}
            isBase64={isBase64}
          />
        </div>
      </div>
    </div>
  );
}
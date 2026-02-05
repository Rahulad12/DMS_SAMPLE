import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import DocumentStrip from './document-navbar-strip';
import type { DMSDocument, RequiredDocument } from '@/types/types';

interface DMSLayoutProps {
  children: ReactNode;
  enrollmentId: string;
  uploadedCount: number;
  totalCount: number;
  documents: RequiredDocument[];
  activeIndex: number;
  onSelectDocument: (index: string) => void;
}

const DMSLayout = ({
  children,
  enrollmentId,
  uploadedCount,
  totalCount,
  documents,
  activeIndex,
  onSelectDocument,
}: DMSLayoutProps) => {
  return (
    <SidebarProvider>
      <DocumentStrip
        requiredDocuments={documents}
        selectedTypeId={activeIndex}
        onSelectType={onSelectDocument}
        className="border-r"
      />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 z-10 shadow-sm flex-shrink-0">
          <div className="container mx-auto px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  Enrollment ID:{' '}
                  <span className="text-slate-700 font-bold">
                    {enrollmentId}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-slate-700 block mb-1">
                  {uploadedCount} / {totalCount} Documents
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-hidden bg-slate-50">
          <div className="container mx-auto px-2 py-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 flex-shrink-0">
          <div className="container mx-auto px-6 text-center">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shield-check"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Uploaded documents are logged for verification and audit purposes.
            </p>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DMSLayout;

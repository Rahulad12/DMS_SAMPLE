import type { ReactNode } from "react";
import { Progress } from "@/components/ui/progress";

interface DMSLayoutProps {
  children: ReactNode;
  enrollmentId: string;
  uploadedCount: number;
  totalCount: number;
}

export function DMSLayout({
  children,
  enrollmentId,
  uploadedCount,
  totalCount,
}: DMSLayoutProps) {
  const progress = Math.round((uploadedCount / totalCount) * 100) || 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                Enrollment Document Management
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Enrollment ID:{" "}
                <span className="text-slate-700">{enrollmentId}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-slate-700 block mb-1">
                {uploadedCount} / {totalCount} Documents
              </span>
            </div>
          </div>
          <div className="w-full">
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8 relative">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col overflow-hidden">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
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
    </div>
  );
}

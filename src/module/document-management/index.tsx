import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { DMSDocument } from "@/types/types";
import { DMSLayout } from "@/components/custom/dms/dms-layout";
import { DocumentStrip } from "@/components/custom/dms/document-strip";
import { DocumentDetail } from "@/components/custom/dms/document-detail";

// Mock Data
const INITIAL_DOCUMENTS: DMSDocument[] = [
  {
    id: "1",
    name: "Citizenship Certificate",
    required: true,
    status: "pending",
  },
  {
    id: "2",
    name: "Passport Photo",
    required: true,
    status: "pending",
    type: "image",
  },
  { id: "3", name: "Utility Bill", required: false, status: "pending" },
  {
    id: "4",
    name: "Tax Clearance Certificate",
    required: true,
    status: "pending",
  },
  {
    id: "5",
    name: "Land Ownership Document",
    required: false,
    status: "pending",
  },
  { id: "6", name: "Marriage Certificate", required: false, status: "pending" },
  { id: "7", name: "Marriage Certificate", required: false, status: "pending" },
  { id: "8", name: "Marriage Certificate", required: false, status: "pending" },
  { id: "9", name: "Marriage Certificate", required: false, status: "pending" },
  {
    id: "10",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "11",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "12",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "13",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "14",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "15",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "16",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "17",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "18",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "19",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "20",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "21",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "22",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "23",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "24",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "25",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "26",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "27",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "28",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "29",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
  {
    id: "30",
    name: "Marriage Certificate",
    required: false,
    status: "pending",
  },
];

export default function DMSContainer() {
  const [documents, setDocuments] = useState<DMSDocument[]>(INITIAL_DOCUMENTS);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeDocument = documents[activeIndex];
  const uploadedCount = documents.filter((d) => d.status === "uploaded").length;

  const handleSelectDocument = (index: number) => {
    setActiveIndex(index);
  };

  const handleUpload = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    const isImage = file.type.startsWith("image/");
    const previewUrl = URL.createObjectURL(file);

    const newDocuments = [...documents];
    newDocuments[activeIndex] = {
      ...newDocuments[activeIndex],
      status: "uploaded",
      file: file,
      previewUrl: previewUrl,
      type: isImage ? "image" : "pdf",
    };

    setDocuments(newDocuments);
    toast.success(`${activeDocument.name} uploaded successfully.`);
  };

  const handleReplace = () => {
    const newDocuments = [...documents];
    // Revoke old URL to avoid memory leaks
    if (newDocuments[activeIndex].previewUrl) {
      URL.revokeObjectURL(newDocuments[activeIndex].previewUrl!);
    }

    newDocuments[activeIndex] = {
      ...newDocuments[activeIndex],
      status: "pending",
      file: undefined,
      previewUrl: undefined,
    };
    setDocuments(newDocuments);
  };

  const activeDocRequiredAndMissing =
    activeDocument.required && activeDocument.status !== "uploaded";

  const canNavigateToNext = () => {
    // Check if current document is required and missing
    if (activeDocRequiredAndMissing) {
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!canNavigateToNext()) {
      toast.error("This document is required to continue.");
      return;
    }

    if (activeIndex < documents.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      toast.success("All steps completed!");
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <DMSLayout
      enrollmentId="NMB-2024-8892"
      uploadedCount={uploadedCount}
      totalCount={documents.length}
    >
      {/* Navigation Strip */}
      <DocumentStrip
        documents={documents}
        activeIndex={activeIndex}
        onSelect={handleSelectDocument}
      />

      {/* Main Content Area */}
      <DocumentDetail
        document={activeDocument}
        onUpload={handleUpload}
        onReplace={handleReplace}
      />

      {/* Bottom Navigation Control Bar */}
      <div className="border-t border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={activeIndex === 0}
          className="text-slate-600 border-slate-300 hover:bg-white hover:text-[#008eb0]"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-4">
          {activeDocRequiredAndMissing && (
            <span className="text-sm font-medium text-amber-600 animate-pulse hidden sm:inline-block">
              Required document missing
            </span>
          )}
          <Button
            onClick={handleNext}
            disabled={activeDocRequiredAndMissing}
            className={cn(
              "min-w-[120px] transition-all duration-300",
              activeDocRequiredAndMissing
                ? "bg-slate-300 text-slate-500 cursor-not-allowed hover:bg-slate-300"
                : "bg-[#008eb0] hover:bg-[#007a9a] text-white shadow-md hover:shadow-lg transform active:scale-95",
            )}
          >
            {activeIndex === documents.length - 1 ? "Finish" : "Next"}
            {activeIndex !== documents.length - 1 && (
              <ChevronRight className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
      </div>
    </DMSLayout>
  );
}

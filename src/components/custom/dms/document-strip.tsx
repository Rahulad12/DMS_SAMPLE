import { useRef, useEffect } from "react";
import type { DMSDocument } from "../../../types/types";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Lock } from "lucide-react";

interface DocumentStripProps {
  documents: DMSDocument[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function DocumentStrip({
  documents,
  activeIndex,
  onSelect,
}: DocumentStripProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active item
  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = activeItemRef.current;

      const offsetLeft = item.offsetLeft - container.offsetLeft;

      // Center the item
      container.scrollTo({
        left: offsetLeft - container.clientWidth / 2 + item.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  // Check if a document is clickable
  const isDocumentClickable = (index: number): boolean => {
    // Can always click on current or previous documents
    if (index <= activeIndex) return true;

    // Check if all required documents before this one are uploaded
    for (let i = 0; i < index; i++) {
      if (documents[i].required && documents[i].status !== "uploaded") {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="border-b border-slate-200 bg-white">
      <div
        ref={scrollContainerRef}
        className="flex gap-0 overflow-x-auto px-6 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {documents.map((doc, index) => {
          const isActive = index === activeIndex;
          const isUploaded = doc.status === "uploaded";
          const isClickable = isDocumentClickable(index);

          return (
            <button
              key={doc.id}
              ref={isActive ? activeItemRef : null}
              onClick={() => isClickable && onSelect(index)}
              disabled={!isClickable}
              className={cn(
                "relative flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 min-w-[180px] max-w-[240px]",
                isActive
                  ? "border-[#008eb0] text-[#008eb0] bg-slate-50"
                  : isClickable
                    ? "border-transparent text-slate-600 hover:text-[#008eb0] hover:bg-slate-50"
                    : "border-transparent text-slate-300 cursor-not-allowed bg-slate-50/50",
                isUploaded && !isActive && "text-slate-500",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-[10px] flex-shrink-0",
                  isUploaded
                    ? "bg-green-100 text-green-600"
                    : isActive
                      ? "bg-[#008eb0]/10 text-[#008eb0]"
                      : isClickable
                        ? "bg-slate-100 text-slate-500"
                        : "bg-slate-100 text-slate-300",
                )}
              >
                {isUploaded ? (
                  <Check className="w-3.5 h-3.5" />
                ) : !isClickable ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              <div className="flex flex-col items-start truncate flex-1">
                <span className="truncate w-full text-left">{doc.name}</span>
                {doc.required && !isUploaded && (
                  <span
                    className={cn(
                      "text-[10px] flex items-center gap-0.5",
                      isClickable ? "text-amber-600" : "text-slate-300",
                    )}
                  >
                    <AlertCircle className="w-2.5 h-2.5" /> Required
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

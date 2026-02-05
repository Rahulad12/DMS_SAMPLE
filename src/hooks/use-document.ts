import { useState } from "react";
import { toast } from "sonner";
import type { RequiredDocument, DocumentStatus } from "@/types/types";

export type ExtendedDocument = RequiredDocument & {
  status?: DocumentStatus;
  file?: File;
  previewUrl?: string;
  type?: "image" | "pdf";
};

export function useDocument(initialDocuments: RequiredDocument[]) {
  console.log(initialDocuments)
  // Initialize with extended properties
  const [documents, setDocuments] = useState<ExtendedDocument[]>(() =>
    initialDocuments.map((doc) => ({
      ...doc,
      status: "pending" as DocumentStatus,
    }))
  );

  const [activeId, setActiveId] = useState<string>(initialDocuments[0]?.id || "");

  const activeIndex = documents.findIndex((d) => d.id === activeId);
  const activeDocument = documents[activeIndex];
  console.log(activeDocument, "activeDocument")
  // Calculate uploaded count based on the 'status' or actual file presence
  const uploadedCount = documents.filter((d) => d.status === "uploaded").length;

  const handleSelectDocument = (id: string) => {
    setActiveId(id);
  };

  const handleUpload = (files: File[]) => {
    if (files.length === 0 || activeIndex === -1) return;

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
    toast.success(`${activeDocument.label} uploaded successfully.`);
  };

  const handleReplace = () => {
    if (activeIndex === -1) return;

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
      type: undefined
    };
    setDocuments(newDocuments);
  };

  return {
    documents,
    activeDocument,
    activeIndex,
    activeId,
    uploadedCount,
    handleSelectDocument,
    handleUpload,
    handleReplace,
  };
}

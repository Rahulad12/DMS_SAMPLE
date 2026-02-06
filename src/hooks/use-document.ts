import { useState } from "react";
import { toast } from "sonner";
import type { RequiredDocument } from "@/types/types";

export function useDocument(initialDocuments: RequiredDocument[]) {
  const [documents, setDocuments] = useState<RequiredDocument[]>(initialDocuments);
  const [activeId, setActiveId] = useState<string>("");

  // Helper: Find a document at any level by label
  const findDocumentByLabel = (docs: RequiredDocument[], targetLabel: string): any => {
    for (let category of docs) {
      if (category.documents && category.documents.length > 0) {
        for (let doc of category.documents) {
          if (doc.label === targetLabel) {
            return { ...doc, categoryId: category.id };
          }
          if (doc.documents && doc.documents.length > 0) {
            for (let nestedDoc of doc.documents) {
              if (nestedDoc.label === targetLabel) {
                return { ...nestedDoc, docId: doc.id, categoryId: category.id, parentLabel: doc.label };
              }
            }
          }
        }
      }
    }
    return null;
  };

  const activeDocument = activeId ? findDocumentByLabel(documents, activeId) : null;
  
  // Count uploaded documents
  const uploadedCount = documents.reduce((count, category) => {
    if (category.documents) {
      return count + category.documents.filter((doc: any) => 
        doc.documents?.some((d: any) => d.file)
      ).length;
    }
    return count;
  }, 0);

  const handleSelectDocument = (label: string) => {
    setActiveId(label);
  };

  const handleUpload = (files: any[]) => {
    if (files.length === 0 || !activeDocument) return;

    const file = files[0].file || files[0];
    const isImage = file.type.startsWith("image/");
    const previewUrl = URL.createObjectURL(file);

    const newDocuments = documents.map((category) => {
      if (category.id === activeDocument.categoryId) {
        return {
          ...category,
          documents: category.documents.map((doc: any) => {
            if (doc.id === activeDocument.docId) {
              return {
                ...doc,
                documents: doc.documents?.map((deepDoc: any) => 
                  deepDoc.label === activeId
                    ? { ...deepDoc, file: file, previewUrl: previewUrl, type: isImage ? "image" : "pdf" }
                    : deepDoc
                ),
              };
            }
            if (doc.label === activeId && doc.documents) {
              return { ...doc, documents: doc.documents };
            }
            return doc;
          }),
        };
      }
      return category;
    });

    setDocuments(newDocuments);
    toast.success(`${activeDocument.label} uploaded successfully.`);
  };

  const handleReplace = () => {
    if (!activeDocument) return;

    if (activeDocument.previewUrl) {
      URL.revokeObjectURL(activeDocument.previewUrl);
    }

    const newDocuments = documents.map((category) => {
      if (category.id === activeDocument.categoryId) {
        return {
          ...category,
          documents: category.documents.map((doc: any) => {
            if (doc.id === activeDocument.docId) {
              return {
                ...doc,
                documents: doc.documents?.map((deepDoc: any) => 
                  deepDoc.label === activeId
                    ? { ...deepDoc, file: undefined, previewUrl: undefined, type: undefined }
                    : deepDoc
                ),
              };
            }
            return doc;
          }),
        };
      }
      return category;
    });

    setDocuments(newDocuments);
  };

  return {
    documents,
    activeDocument,
    activeIndex: activeId,
    activeId,
    uploadedCount,
    handleSelectDocument,
    handleUpload,
    handleReplace,
  };
}

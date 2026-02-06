import { useState } from "react";
import { toast } from "sonner";
import type { RequiredDocument } from "@/types/types";

export function useDocument(initialDocuments: RequiredDocument[]) {
  console.log("initialDocuments", initialDocuments)
  const [documents, setDocuments] = useState<RequiredDocument[]>(initialDocuments);
  console.log("documents", documents)
  const [activeId, setActiveId] = useState<string>("");

  // Helper: Find a document at any level by label
  const findDocumentByLabel = (docs: RequiredDocument[], target: string): any => {
    for (let category of docs) {
      if (category.documents) {
        for (let doc of category.documents) {
          if (doc.label === target || doc.id === target) {
            return { ...doc, categoryId: category.id };
          }
          if (doc.documents) {
            for (let nestedDoc of doc.documents) {
              if (nestedDoc.label === target || (nestedDoc as any).id === target) {
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
  console.log("activeDocument", activeDocument);

  const handleSelectDocument = (label: string) => {
    setActiveId(label);
  };

  const handleUpload = (files: any[], subLabel?: string) => {
    if (files.length === 0 || !activeDocument) return;

    const file = files[0].file || files[0];
    const isImage = file.type?.startsWith("image/");
    const previewUrl = URL.createObjectURL(file);
    const targetLabel = subLabel || activeId;

    const newDocuments = documents.map((category) => {
      if (category.id === activeDocument.categoryId) {
        return {
          ...category,
          documents: category.documents.map((doc: any) => {
            // If this is the document we're looking for and it's a leaf
            if (doc.label === targetLabel || doc.id === targetLabel) {
              return { ...doc, file: file, previewUrl: previewUrl, type: isImage ? "image" : "pdf" };
            }

            // If it has children, check if one of them is the target
            if (doc.documents) {
              return {
                ...doc,
                documents: doc.documents.map((deepDoc: any) =>
                  deepDoc.label === targetLabel || deepDoc.id === targetLabel
                    ? { ...deepDoc, file: file, previewUrl: previewUrl, type: isImage ? "image" : "pdf" }
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
    toast.success(`${targetLabel} uploaded successfully.`);
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
    documents: initialDocuments,
    activeDocument,
    activeIndex: activeId,
    activeId,
    handleSelectDocument,
    handleUpload,
    handleReplace,
  };
}

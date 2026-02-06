export type DocumentStatus = "pending" | "uploaded";

// export interface DMSDocument {
//   id: string;
//   name: string;
//   required: boolean;
//   status: DocumentStatus;
//   file?: File;
//   previewUrl?: string; // For images
//   type?: "image" | "pdf" | "other";
// }

export interface DocumentRequestType {
  TransactionId: string;
  MerchantId: string;
  ProcessInstanceId: string;
}


export interface DMSDocument {
  required_documents: RequiredDocument[]
}

export interface RequiredDocument {
  id: string
  label: string
  documents: Document[]
  no_of_mandatory?: number
  isRequired: boolean
}

export interface Document {
  id: string
  label: string
  documents?: Document2[]
  file?: string | null | undefined
  allowMultiple?: boolean
  allowUpdate?: boolean
  allowDelete?: boolean
}

export interface Document2 {
  label: string
  file: string | null | undefined
}
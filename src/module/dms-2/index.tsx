import DMSLayout from '@/components/custom/dms-2/dms-layout';
import { DocumentDetail } from '@/components/custom/dms-2/document-detail';
import { mockDocument } from '@/data/mockDocument';
import { useDocument } from '@/hooks/use-document';
import { useGetDocuments } from '@/services/hooks/use-documents';



const DocumentUploadLayout = () => {
  const {
    documents,
    activeDocument,
    activeIndex,
    uploadedCount,
    handleSelectDocument,
    handleUpload,
    handleReplace,
  } = useDocument(mockDocument.required_documents);

  const { data, isLoading, error } = useGetDocuments({
    TransactionId: '',
    MerchantId: '',
    ProcessInstanceId: 'SME-0000010713-process',
  });

  console.log(data, isLoading, error);
  console.log(documents, "documents");
  console.log("activeIndex", activeIndex);
  return (
    <DMSLayout
      enrollmentId="NMB-2024-8892"
      uploadedCount={uploadedCount}
      totalCount={documents.length}
      documents={documents}
      activeIndex={activeIndex}
      onSelectDocument={handleSelectDocument}
    >
      <DocumentDetail
        document={activeDocument}
        onUpload={handleUpload}
        onReplace={handleReplace}
      />
    </DMSLayout>
  );
};

export default DocumentUploadLayout;

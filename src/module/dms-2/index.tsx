import DMSLayout from '@/components/custom/dms-2/dms-layout';
import { DocumentDetail } from '@/components/custom/dms-2/document-detail';
// import { mockDocument } from '@/data/mockDocument';
import { useDocument } from '@/hooks/use-document';
import { useGetDocuments } from '@/services/hooks/use-documents';



const DocumentUploadLayout = () => {
  const { data, isLoading, error } = useGetDocuments();
  console.log(data, isLoading, error);
  console.log("data.data", data?.data?.required_documents)
  // const requiredData = mockDocument.required_documents
  const requiredData = data?.data?.required_documents;
  console.log("requiredData", requiredData)
  const {
    documents,
    activeDocument,
    activeIndex,
    handleSelectDocument,
    handleUpload,
    handleReplace,
  } = useDocument(requiredData || []);
  console.log({ documents, activeDocument, activeIndex });

  // const { data, isLoading, error } = useGetDocuments({
  //   TransactionId: '',
  //   MerchantId: '',
  //   ProcessInstanceId: 'SME-0000010713-process',
  // });


  return (
    <DMSLayout
      enrollmentId="NMB-2024-8892"
      documents={documents || []}
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

import { Toaster } from "@/components/ui/sonner";
import DocumentUploadLayout from "./module/dms-2";
import ReactQueryProvider from "./providers/react-query-provider";
// import DMSContainer from "./module/document-management";

function App() {
  return (
    <ReactQueryProvider>
      {/* <DMSContainer /> */}
      <DocumentUploadLayout />
      <Toaster
        position="bottom-left"
        duration={3000}
        closeButton
        toastOptions={{
          style: {
            background: "#008eb0",
            color: "white",
            border: "none",
          },
          classNames: {
            closeButton: "bg-white text-[#008eb0] hover:bg-gray-100",
          },
        }}
      />
    </ReactQueryProvider>
  );
}

export default App;

import DocumentUploader from "./document-uploader";

/**
 * Demo component showing different usage examples of DocumentUploader
 */
const DocumentUploaderDemo = () => {
  const handleFilesChange = (files: File[]) => {
    console.log("Files changed:", files);
    // You can process files here, e.g., upload to server
  };

  return (
    <div className="container mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">File Upload Component Demo</h1>
        <p className="text-muted-foreground">
          Examples of the DocumentUploader component with different
          configurations
        </p>
      </div>

      {/* Example 1: Basic Usage */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Basic Usage</h2>
          <p className="text-sm text-muted-foreground">
            Default configuration with 5 files max, 10MB per file
          </p>
        </div>
        <DocumentUploader onFilesChange={handleFilesChange} />
      </section>

      {/* Example 2: Images Only */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Images Only</h2>
          <p className="text-sm text-muted-foreground">
            Accept only image files (PNG, JPG, GIF, WebP)
          </p>
        </div>
        <DocumentUploader
          onFilesChange={handleFilesChange}
          accept={{
            "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
          }}
          maxFiles={3}
          maxSize={5242880} // 5MB
          title="Upload Images"
          description="Drag & drop your images here, or click to browse"
        />
      </section>

      {/* Example 3: Documents Only */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Documents Only</h2>
          <p className="text-sm text-muted-foreground">
            Accept PDF and Word documents only
          </p>
        </div>
        <DocumentUploader
          onFilesChange={handleFilesChange}
          accept={{
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [".docx"],
          }}
          maxFiles={10}
          maxSize={20971520} // 20MB
          title="Upload Documents"
          description="PDF and Word documents accepted"
        />
      </section>

      {/* Example 4: Single File Upload */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Single File Upload</h2>
          <p className="text-sm text-muted-foreground">
            Upload only one file at a time
          </p>
        </div>
        <DocumentUploader
          onFilesChange={handleFilesChange}
          maxFiles={1}
          title="Upload Single File"
          description="Select one file to upload"
        />
      </section>

      {/* Example 5: Without Preview */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Without File Preview</h2>
          <p className="text-sm text-muted-foreground">
            Hide the file preview list
          </p>
        </div>
        <DocumentUploader
          onFilesChange={handleFilesChange}
          showPreview={false}
        />
      </section>

      {/* Example 6: Custom Styling */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Custom Styling</h2>
          <p className="text-sm text-muted-foreground">
            With custom className for additional styling
          </p>
        </div>
        <DocumentUploader
          onFilesChange={handleFilesChange}
          className="max-w-2xl mx-auto"
          title="Drop Your Files Here"
          description="We accept all file types up to 10MB"
        />
      </section>
    </div>
  );
};

export default DocumentUploaderDemo;

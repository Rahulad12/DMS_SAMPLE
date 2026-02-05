// // import { Badge } from '@/components/ui/badge';
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarTrigger,
// } from '@/components/ui/sidebar';
// import { cn } from '@/lib/utils';
// import type { RequiredDocument } from '@/types/types';
// import { FileText } from 'lucide-react';

// interface DocumentStripProps extends Omit<
//   React.ComponentProps<typeof Sidebar>,
//   'onSelect'
// > {
//   requiredDocuments: RequiredDocument[];
//   selectedTypeId: number;
//   onSelectType: (typeId: string) => void;
// }

// const DocumentStrip = ({
//   requiredDocuments,
//   selectedTypeId,
//   onSelectType,
//   className,
//   ...props
// }: DocumentStripProps) => {
//   console.log(requiredDocuments, "required_documents")
//   return (
//     <Sidebar
//       className={cn('bg-primary text-primary-foreground', className)}
//       {...props}
//     >
//       <SidebarContent className="gap-0 bg-primary">
//         <div className="p-2 flex items-center gap-2 border-b border-primary-foreground/10">
//           <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10" />
//           <h2 className="text-sm font-semibold">Document Handler</h2>
//         </div>
//         <div className="flex-1 overflow-auto">
//           <SidebarMenu className="gap-1 p-2">
//             {requiredDocuments.map((type) => {
//               console.log(type, "type")
//               const isActive = selectedTypeId === requiredDocuments.indexOf(type);
//               // const uploadedCount = type.documents.filter(
//               //   (doc) => doc.documents !== null
//               // ).length;
//               // const totalCount = type.documents.length;
//               // const isComplete = uploadedCount === totalCount;

//               return (
//                 <SidebarMenuItem key={type.id}>
//                   <SidebarMenuButton
//                     onClick={() => onSelectType(type.id)}
//                     className={cn(
//                       'w-full flex items-center justify-between gap-3 h-auto py-3 px-4 transition-all',
//                       isActive && 'bg-primary-foreground text-primary',
//                       !isActive &&
//                       'hover:bg-primary-foreground/10 hover:text-primary-foreground'
//                     )}
//                   >
//                     <div className="flex items-center gap-2 flex-1 min-w-0">
//                       {/* Icon */}
//                       <FileText
//                         className={cn(
//                           'h-4 w-4 shrink-0',
//                           isActive ? 'text-primary' : 'text-primary-foreground'
//                         )}
//                       />

//                       {/* Type Name */}
//                       <span className="text-sm font-medium truncate">
//                         {type.label}
//                       </span>
//                     </div>

//                     {/* Status Indicators */}
//                     {/* <div className="flex items-center gap-2 flex-shrink-0">
//                       {isComplete ? (
//                         <>
//                           <Badge
//                             variant="outline"
//                             className={cn(
//                               'text-xs',
//                               isActive
//                                 ? 'bg-green-800 text-primary-foreground border-primary-foreground/30'
//                                 : 'bg-green-50 text-green-700 border-green-200'
//                             )}
//                           >
//                             Complete
//                           </Badge>
//                           <CheckCircle2
//                             className={cn(
//                               'h-5 w-5',
//                               isActive
//                                 ? 'text-primary-foreground'
//                                 : 'text-green-600'
//                             )}
//                           />
//                         </>
//                       ) : (
//                         <Badge
//                           variant="outline"
//                           className={cn(
//                             'text-xs',
//                             isActive
//                               ? 'bg-primary text-primary-foreground border-primary-foreground/30'
//                               : 'bg-amber-50 text-amber-700 border-amber-200'
//                           )}
//                         >
//                           {uploadedCount}/{totalCount}
//                         </Badge>
//                       )}
//                     </div> */}
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               );
//             })}
//           </SidebarMenu>
//         </div>
//       </SidebarContent>
//     </Sidebar>
//   );
// };

// export default DocumentStrip;


import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { RequiredDocument, DMSDocument } from '@/types/types';
import { ChevronRight, FileText, Folder } from 'lucide-react';
import { useState } from 'react';

interface DocumentStripProps extends Omit<
  React.ComponentProps<typeof Sidebar>,
  'onSelect'
> {
  requiredDocuments: RequiredDocument[];
  selectedDocumentId: string;
  onSelectDocument: (document: DMSDocument | any) => void;
}

interface DocumentNodeProps {
  node: any;
  depth?: number;
  onSelectDocument: (document: any) => void;
  selectedDocumentId: string;
  getNodeId: (node: any) => string;
}

const DocumentNode = ({
  node,
  depth = 0,
  onSelectDocument,
  selectedDocumentId,
  getNodeId,
}: DocumentNodeProps) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const nodeId = getNodeId(node);
  const isSelected = selectedDocumentId === nodeId;
  const hasChildren = node.documents && node.documents.length > 0;
  const isLeaf = !hasChildren && node.file !== undefined;

  return (
    <div className="w-full">
      <SidebarMenuButton
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          } else {
            onSelectDocument(node);
          }
        }}
        className={cn(
          'w-full flex items-center justify-between gap-2 h-auto py-2 px-3 transition-all',
          isSelected && 'bg-primary-foreground text-primary',
          !isSelected && 'hover:bg-primary-foreground/10 hover:text-primary-foreground',
          depth > 0 && 'ml-4'
        )}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {hasChildren ? (
            <>
              <ChevronRight
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform',
                  isExpanded && 'rotate-90',
                  isSelected ? 'text-primary' : 'text-primary-foreground'
                )}
              />
              <Folder
                className={cn(
                  'h-4 w-4 shrink-0',
                  isSelected ? 'text-primary' : 'text-primary-foreground'
                )}
              />
            </>
          ) : (
            <FileText
              className={cn(
                'h-4 w-4 shrink-0',
                isSelected ? 'text-primary' : 'text-primary-foreground'
              )}
            />
          )}

          <span className="text-sm font-medium truncate">
            {node.label}
          </span>
        </div>

        {/* Optional: Show file status indicator for leaf nodes */}
        {isLeaf && node.file && (
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
        )}
      </SidebarMenuButton>

      {hasChildren && isExpanded && (
        <div className="w-full">
          {node.documents.map((child: any, index: number) => (
            <DocumentNode
              key={`${nodeId}-${index}`}
              node={child}
              depth={depth + 1 + 1}
              onSelectDocument={onSelectDocument}
              selectedDocumentId={selectedDocumentId}
              getNodeId={getNodeId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentStrip = ({
  requiredDocuments,
  selectedDocumentId,
  onSelectDocument,
  className,
  ...props
}: DocumentStripProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Helper function to generate a unique ID for any node
  const getNodeId = (node: any, parentPath: string = ''): string => {
    if (node.id) {
      return parentPath ? `${parentPath}-${node.id}` : node.id;
    }
    // For leaf nodes without ID, use label
    return parentPath ? `${parentPath}-${node.label}` : node.label;
  };

  // Function to flatten and get all selectable documents
  const getAllSelectableDocuments = (doc: any, parentPath: string = ''): any[] => {
    const currentPath = parentPath ? `${parentPath}-${doc.label}` : doc.label;

    // If it's a leaf node with file property or has documents array with allowMultiple/allowUpdate
    if (doc.file !== undefined || (doc.documents && doc.documents.length > 0)) {
      return [{
        ...doc,
        _path: currentPath
      }];
    }

    // If it has nested documents, recursively get them
    if (doc.documents && doc.documents.length > 0) {
      return doc.documents.flatMap((child: any) =>
        getAllSelectableDocuments(child, currentPath)
      );
    }

    return [];
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <Sidebar
      className={cn('bg-primary text-primary-foreground', className)}
      {...props}
    >
      <SidebarContent className="gap-0 bg-primary">
        <div className="p-2 flex items-center gap-2 border-b border-primary-foreground/10">
          <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10" />
          <h2 className="text-sm font-semibold">Document Handler</h2>
        </div>

        <div className="flex-1 overflow-auto">
          <SidebarMenu className="gap-0 p-2">
            {requiredDocuments.map((category) => {
              const isCategoryExpanded = expandedCategories.has(category.id);

              return (
                <div key={category.id} className="w-full">
                  {/* Category Header */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between gap-2 h-auto py-3 px-3 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <ChevronRight
                          className={cn(
                            'h-3 w-3 shrink-0 transition-transform',
                            isCategoryExpanded && 'rotate-90',
                            'text-primary-foreground'
                          )}
                        />
                        <Folder className="h-4 w-4 shrink-0 text-primary-foreground" />
                        <span className="text-sm font-medium truncate">
                          {category.label}
                        </span>
                      </div>
                      <span className="text-xs opacity-75">
                        {category.no_of_mandatory} required
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Category Documents - Recursively rendered */}
                  {isCategoryExpanded && category.documents.map((doc) => (
                    <DocumentNode
                      key={doc.id}
                      node={doc}
                      depth={1}
                      onSelectDocument={onSelectDocument}
                      selectedDocumentId={selectedDocumentId}
                      getNodeId={getNodeId}
                    />
                  ))}
                </div>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default DocumentStrip;
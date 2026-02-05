import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { RequiredDocument } from '@/types/types';
import { FileText, CheckCircle2 } from 'lucide-react';

interface DocumentStripProps extends Omit<
  React.ComponentProps<typeof Sidebar>,
  'onSelect'
> {
  requiredDocuments: RequiredDocument[];
  selectedTypeId: number;
  onSelectType: (typeId: string) => void;
}

const DocumentStrip = ({
  requiredDocuments,
  selectedTypeId,
  onSelectType,
  className,
  ...props
}: DocumentStripProps) => {
  console.log(requiredDocuments, "required_documents")
  return (
    <Sidebar
      className={cn('bg-primary text-primary-foreground', className)}
      {...props}
    >
      <SidebarContent className="gap-0 bg-primary">
        <div className="p-2 flex items-center gap-2 border-b border-primary-foreground/10">
          <SidebarTrigger className="text-primary-foreground hover:bg-primary-foreground/10" />
          <h2 className="text-sm font-semibold">Identification Types</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <SidebarMenu className="gap-1 p-2">
            {requiredDocuments.map((type) => {
              const isActive = selectedTypeId === type.id;
              const uploadedCount = type.documents.filter(
                (doc) => doc.documents !== null
              ).length;
              const totalCount = type.documents.length;
              const isComplete = uploadedCount === totalCount;

              return (
                <SidebarMenuItem key={type.id}>
                  <SidebarMenuButton
                    onClick={() => onSelectType(type.id)}
                    className={cn(
                      'w-full flex items-center justify-between gap-3 h-auto py-3 px-4 transition-all',
                      isActive && 'bg-primary-foreground text-primary',
                      !isActive &&
                      'hover:bg-primary-foreground/10 hover:text-primary-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {/* Icon */}
                      <FileText
                        className={cn(
                          'h-4 w-4 flex-shrink-0',
                          isActive ? 'text-primary' : 'text-primary-foreground'
                        )}
                      />

                      {/* Type Name */}
                      <span className="text-sm font-medium truncate">
                        {type.label}
                      </span>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isComplete ? (
                        <>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              isActive
                                ? 'bg-green-800 text-primary-foreground border-primary-foreground/30'
                                : 'bg-green-50 text-green-700 border-green-200'
                            )}
                          >
                            Complete
                          </Badge>
                          <CheckCircle2
                            className={cn(
                              'h-5 w-5',
                              isActive
                                ? 'text-primary-foreground'
                                : 'text-green-600'
                            )}
                          />
                        </>
                      ) : (
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            isActive
                              ? 'bg-primary text-primary-foreground border-primary-foreground/30'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          )}
                        >
                          {uploadedCount}/{totalCount}
                        </Badge>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default DocumentStrip;

import type { DocumentRequestType } from '@/types/types';
import getDocumentsDetails from '../apis/documet-service';
import { useQuery } from '@tanstack/react-query';

export const useGetDocuments = (data: DocumentRequestType) => {
  return useQuery({
    queryFn: () => getDocumentsDetails(data),
    queryKey: ['documents', data.ProcessInstanceId],
    enabled: !!data.ProcessInstanceId,
  });
};

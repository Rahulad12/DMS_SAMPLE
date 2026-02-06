import getDocumentsDetails from '../apis/documet-service';
import { useQuery } from '@tanstack/react-query';

export const useGetDocuments = () => {
  return useQuery({
    queryFn: () => getDocumentsDetails(),
    queryKey: ['documents'],
    // enabled: !!data.ProcessInstanceId,
  });
};
// export const useGetDocuments = (data: DocumentRequestType) => {
//   return useQuery({
//     queryFn: () => getDocumentsDetails(data),
//     queryKey: ['documents', data.ProcessInstanceId],
//     enabled: !!data.ProcessInstanceId,
//   });
// };

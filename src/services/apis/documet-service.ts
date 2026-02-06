// import type { DocumentRequestType } from '@/types/types';
import axiosInstance from '../axiosInstance';

const getDocumentsDetails = () => {
  return axiosInstance.get('/data');
};
// const getDocumentsDetails = (payload: DocumentRequestType) => {
//   return axiosInstance.post('/FetchDocument/GetDocuments', payload);
// };

export default getDocumentsDetails;

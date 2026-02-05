import type { DocumentRequestType } from '@/types/types';
import axiosInstance from '../axiosInstance';

const getDocumentsDetails = (payload: DocumentRequestType) => {
  return axiosInstance.post('/FetchDocument/GetDocuments', payload);
};

export default getDocumentsDetails;

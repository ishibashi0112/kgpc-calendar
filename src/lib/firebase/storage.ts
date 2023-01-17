import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  UploadResult,
} from "firebase/storage";

import { storage } from "./firebase";

export const fileUpload = async (
  file: File,
  filePath: string
): Promise<UploadResult> => {
  const storageRef = ref(storage, filePath);

  const uploadTask = await uploadBytes(storageRef, file);
  return uploadTask;
};

export const fileDownload = async (filePath: string) => {
  const storageRef = ref(storage, filePath);
  const fileURL = await getDownloadURL(storageRef);

  return fileURL;
};

export const deleteFile = async (filePath: string): Promise<void> => {
  const storageRef = ref(storage, filePath);
  await deleteObject(storageRef);
};

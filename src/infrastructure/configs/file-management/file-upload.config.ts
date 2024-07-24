export const fileUploadConfig = {
  uploadPath: 'uploads',
  parseName: (fileName: string) => fileName.replace(`\\`, '/'),
};

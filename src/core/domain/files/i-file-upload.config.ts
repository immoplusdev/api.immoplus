export interface IFileUploadConfig {
  uploadPath: "uploads",
  parseName: (fileName: string) => string,
}
// app/actions/Admin_Post/post-upload.ts
"use server";

import { uploadToOSS, uploadMultipleToOSS, deleteFromOSS } from "@/lib/oss";

// 上傳單一檔案到 OSS
export async function uploadFileToOSS(fileData: string, fileName: string): Promise<string> {
  try {
    // 將 base64 或 FormData 轉換為 Buffer
    const buffer = Buffer.from(fileData, 'base64');
    const url = await uploadToOSS(buffer, fileName);
    return url;
  } catch (error) {
    console.error("檔案上傳失敗:", error);
    throw new Error("檔案上傳失敗");
  }
}

// 上傳多個檔案到 OSS
export async function uploadFilesToOSS(formData: FormData): Promise<string[]> {
  try {
    const files: File[] = [];
    
    // 從 FormData 中提取檔案
    for (const entry of Array.from(formData.entries())) {
      const [key, value] = entry;
      if (value instanceof File && value.size > 0) {
        files.push(value);
      }
    }
    
    if (files.length === 0) {
      return [];
    }
    
    // 上傳所有檔案到 OSS
    const urls = await uploadMultipleToOSS(files);
    return urls;
  } catch (error) {
    console.error("批次檔案上傳失敗:", error);
    throw new Error("檔案上傳失敗");
  }
}
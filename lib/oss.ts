// lib/oss.ts
import OSS from 'ali-oss';

// 創建 OSS 客戶端
export const createOSSClient = () => {
  return new OSS({
    region: process.env.OSS_REGION!,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
    bucket: process.env.OSS_BUCKET!,
    endpoint: process.env.OSS_ENDPOINT!,
    secure: process.env.OSS_SECURE === 'true',
  });
};

// 上傳檔案到 OSS
export async function uploadToOSS(file: File | Buffer, fileName: string): Promise<string> {
  try {
    const client = createOSSClient();
    
    // 如果是瀏覽器的 File 物件，轉為 Buffer
    let buffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }
    
    // 生成唯一的檔案名稱
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop() || 'jpg';
    const ossFileName = `posts/${timestamp}_${randomString}.${fileExtension}`;
    
    // 上傳到 OSS
    const result = await client.put(ossFileName, buffer);
    
    // 返回檔案 URL
    return result.url;
  } catch (error) {
    console.error('OSS 上傳失敗:', error);
    throw new Error(`檔案上傳失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
  }
}

// 批次上傳檔案
export async function uploadMultipleToOSS(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => 
    uploadToOSS(file, file.name)
  );
  
  return Promise.all(uploadPromises);
}

// 刪除 OSS 檔案
export async function deleteFromOSS(urls: string[]): Promise<void> {
  try {
    const client = createOSSClient();
    
    // 從 URL 中提取檔案名稱
    const fileNames = urls.map(url => {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1); // 移除開頭的斜線
    });
    
    // 批次刪除
    await client.deleteMulti(fileNames, { quiet: true });
  } catch (error) {
    console.error('OSS 刪除失敗:', error);
    // 不拋出錯誤，因為刪除失敗不應該影響主要功能
  }
}
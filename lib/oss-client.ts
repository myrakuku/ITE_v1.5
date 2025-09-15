// import OSS from 'ali-oss';

// export function createOssClient() {
//   const region = process.env.OSS_REGION;
//   const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
//   const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
//   const bucket = process.env.OSS_BUCKET;
//   const secure = process.env.OSS_SECURE === 'true';

//   console.log("OSS Config:", { region, accessKeyId, bucket, secure });

//   if (!region || !accessKeyId || !accessKeySecret || !bucket) {
//     throw new Error('OSS 環境變數未正確設置');
//   }

//   return new OSS({
//     region,
//     accessKeyId,
//     accessKeySecret,
//     bucket,
//     secure,
//   });
// }

import "server-only";
import OSS from "ali-oss";

export function createOssClient() {
  const region = process.env.OSS_REGION;
  const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
  const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
  const bucket = process.env.OSS_BUCKET;
  const secure = process.env.OSS_SECURE === "true";

  console.log("OSS Config:", { region, accessKeyId, bucket, secure });

  if (!region || !accessKeyId || !accessKeySecret || !bucket) {
    throw new Error("OSS 環境變數未正確設置");
  }

  return new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    secure,
  });
}
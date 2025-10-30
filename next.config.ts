// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


// import type { NextConfig } from "next";
// const nextConfig: NextConfig = {
//   serverActions: {
//     bodySizeLimit: '30mb',
//   },
// };

// console.log("Next.js Config Loaded:", nextConfig);

// module.exports = nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ite-teacher-fold.oss-cn-hongkong.aliyuncs.com",
        port: "",
        pathname: "/products/**", // 保留對 products 路徑的支持
      },
      {
        protocol: "https",
        hostname: "ite-teacher-fold.oss-cn-hongkong.aliyuncs.com",
        port: "",
        pathname: "/special-course/**", // 添加對 special-course 路徑的支持
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
    ],
  },
  unoptimized: true, // 禁用圖片優化（僅用於開發環境）
  api: {
    bodyParser: {
      sizeLimit: "30mb",
    },
  },
};

export default nextConfig;
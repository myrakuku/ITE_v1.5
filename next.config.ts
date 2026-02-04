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
        pathname: "/products/**",
      },
      {
        protocol: "https",
        hostname: "ite-teacher-fold.oss-cn-hongkong.aliyuncs.com",
        pathname: "/special-course/**",
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: '**.aliyuncs.com',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '30mb', // 關鍵：允許大檔案
    },
  },

  // api: {
  //   bodyParser: {
  //     sizeLimit: "30mb", // API Routes 也支援
  //   },
  // },

};

export default nextConfig;
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



export const config = {
  api:{
    bodyParser: {
      sizeLimit: '30mb'
    }
  }
};
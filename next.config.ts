import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com", "sdmntprukwest.oaiusercontent.com", "sdmntprwestus3.oaiusercontent.com"], // 👈 allow Cloudinary images
  },
};

export default nextConfig;

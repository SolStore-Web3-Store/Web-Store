import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "res.cloudinary.com",
      "sdmntprukwest.oaiusercontent.com",
      "sdmntprwestus3.oaiusercontent.com",
      "utfs.io", // UploadThing CDN for store icons and banners
      "images.unsplash.com",
      "api.phantom.app"
    ],
  },
};

export default nextConfig;

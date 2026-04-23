import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns :[
      {
        hostname: "learnosii.t3.tigrisfiles.io",
        port : "",
        protocol:"https"
      }
    ]
  }
};

export default nextConfig;

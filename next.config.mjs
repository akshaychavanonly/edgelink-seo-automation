/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
  experimental: {
    serverComponentsExternalPackages: [
      "puppeteer",
      "puppeteer-core",
      "@sparticuz/chromium",
    ],
  },
};

export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "puppeteer",
      "puppeteer-core",
      "@sparticuz/chromium",
    ],
    outputFileTracingIncludes: {
      "/api/reports/[auditId]": [
        "./node_modules/@sparticuz/chromium/bin/**",
      ],
    },
  },
};

export default nextConfig;

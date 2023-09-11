/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    WC_PROJECT_ID: process.env.WC_PROJECT_ID,
    ECDSA_KEY: process.env.ECDSA_KEY,
  },
};

module.exports = nextConfig;

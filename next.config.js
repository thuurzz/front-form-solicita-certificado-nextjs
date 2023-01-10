/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_SITE_KEY: process.env.REACT_APP_SITE_KEY,
    REACT_APP_SECRET_KEY: process.env.REACT_APP_SECRET_KEY,
  },
};

module.exports = nextConfig;

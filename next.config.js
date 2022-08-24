/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.genius.com", "images.rapgenius.com"],
  },
};

module.exports = nextConfig;

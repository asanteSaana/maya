/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // The template's duplicate homepage and shop-layout variants were collapsed
  // into "/" and "/products". These keep old links and search results alive.
  async redirects() {
    return [
      { source: "/index2", destination: "/", permanent: true },
      { source: "/index3", destination: "/", permanent: true },
      { source: "/shop-grid", destination: "/products", permanent: true },
      {
        source: "/shop-left-sidebar",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/shop-right-sidebar",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

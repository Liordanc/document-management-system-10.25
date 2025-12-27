/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placeholder.com'],
  },
  // Enable bundle analyzer when ANALYZE env variable is set to 'true'
  ...(process.env.ANALYZE === 'true' ? {
    webpack: (config, { isServer }) => {
      // Import the bundle analyzer only when needed
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      );
      
      return config;
    },
  } : {}),
}

export default nextConfig

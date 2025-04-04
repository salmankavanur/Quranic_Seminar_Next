/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    'mongodb',
    '@napi-rs/snappy-linux-x64-gnu',
    '@napi-rs/snappy-linux-x64-musl',
    'kerberos',
    'mongodb-client-encryption'
  ],
  webpack: (config, { isServer }) => {
    // This is to handle the binary modules error
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
        fs: false,
        request: false,
        util: false,
        'util/types': false,
      };
    }

    return config;
  },
};

export default nextConfig;

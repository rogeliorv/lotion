const allowedOrigins = ['http://localhost:5000', 'https://lotion-ai.vercel.app'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return [
        {
            // matching all API routes
            source: "/api/:path*",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin on your routes
                { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,DELETE,PATCH,POST,PUT" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
        }
    ]
  },
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/rogeliorv/lotion",
        permanent: true,
      },
    ];
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;

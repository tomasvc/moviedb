module.exports = {
    reactStrictMode: true,
    env: {
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
        AUTH0_SECRET: process.env.AUTH0_SECRET,
        AUTH0_ISSUER: process.env.AUTH0_ISSUER,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        TMDB_API_KEY: process.env.TMDB_API_KEY,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
            }
        ]
    }
  }
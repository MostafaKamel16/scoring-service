export const config = {
  server: {
    port: Number(process.env.PORT) || 3000,
    requestTimeoutMs: 8000,
  },
  scoring: {
    weights: {
      stars: 0.5,
      forks: 0.3,
      recency: 0.2,
    },
  },
  cache: {
    ttlMs: 10 * 60 * 1000,
    maxEntries: 200,
  },
  github: {
    baseUrl: "https://api.github.com",
    userAgent: "redcare-popularity-service/1.0",
  },
};

const config = {
  api: {
    baseUrl: 'http://localhost:3000/api',
  },
} as const;

export type AppConfig = typeof config;

export default config;

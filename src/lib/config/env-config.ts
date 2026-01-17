
export const envConfig = {
  isProduction: import.meta.env.NODE_ENV === 'production',
  appName: import.meta.env.VITE_APP_NAME ?? 'Abyssal Rachel',
  betterAuthBaseUrl: import.meta.env.VITE_BETTER_AUTH_URL ?? 'http://localhost:3000'
}
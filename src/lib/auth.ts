import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from '@/lib/prisma.ts';
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { localization } from "better-auth-localization";
import { getLocale } from '@/paraglide/runtime';


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    tanstackStartCookies(),
    localization({
      defaultLocale: "ro-RO",
      fallbackLocale: "ro-RO",
      getLocale: () => {
        const locale = getLocale();
        switch (locale) {
          case "ro":
            return "ro-RO";
          case "ru":
            return "ru-RU";
          default:
            return "ro-RO"
        }
      }
    })
  ]
});


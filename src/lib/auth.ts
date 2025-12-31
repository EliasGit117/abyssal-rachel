import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma.ts';
import { localization } from 'better-auth-localization';
import { getLocale } from '@/paraglide/runtime';
import { resend } from './resend';


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails.send({
        from: process.env.AUTH_EMAIL_FROM!,
        to: user.email,
        subject: 'Hello World',
        html: `
          <p>Welcome 👋</p>
          <p>Click below to verify your email:</p>
          <a href="${url}">Verify email</a>
        `
      }).then((res) => {
        if (res.error) {
          console.error('Failed to send email verification', res.error);
          return;
        }

        console.info('Email verification sent', res.data);
      }).catch(e => (
        console.error('Failed to send email verification', e)
      ));
    }
  },
  plugins: [
    // Removed coz breaks the production app build
    // tanstackStartCookies(),
    localization({
      defaultLocale: 'ro-RO',
      fallbackLocale: 'ro-RO',
      getLocale: () => {
        const locale = getLocale();
        switch (locale) {
          case 'ro':
            return 'ro-RO';
          case 'ru':
            return 'ru-RU';
          default:
            return 'ro-RO';
        }
      }
    })
  ]
});


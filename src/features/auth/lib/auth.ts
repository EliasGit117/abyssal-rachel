import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma.ts';
import { localization } from 'better-auth-localization';
import { getLocale } from '@/paraglide/runtime';
import { resend } from '@/lib/resend.ts';
import { admin as adminPlugin, magicLink } from 'better-auth/plugins';
import { accessControl, user, admin } from '@/features/auth/lib/permissions.ts';


export const auth = betterAuth({
  // user: {
  //   additionalFields: {
  //     role: { type: "string", input: false, required: false, defaultValue: "user" }
  //   },
  // },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    },
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [process.env.VITE_BETTER_AUTH_URL!],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({user, url}) => {
      const locale = getLocale();

      void resend.emails.send({
        to: user.email,
        from: process.env.AUTH_EMAIL_FROM!,
        subject: locale === 'ro' ? 'Resetare parola' : 'Сброс пароля',
        text: locale === 'ro' ?
          `Atasă linkul pentru resetare parolă: ${url}` :
          `Нажмите на ссылку для сброса пароля: ${url}`,
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const locale = getLocale();

      return resend.emails.send({
        to: user.email,
        from: process.env.AUTH_EMAIL_FROM!,
        subject: locale === 'ro' ? 'Verificare email' : 'Потверждение эл. почты',
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
    },
  },
  plugins: [
    // Removed coz breaks the production app build
    // tanstackStartCookies(),
    adminPlugin({
      ac: accessControl,
      roles: {
        admin,
        user
      }
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const locale = getLocale();

        return resend.emails.send({
          from: process.env.AUTH_EMAIL_FROM!,
          to: email,
          subject: locale === 'ro' ? 'Autorizare cu Magic Link' : 'Авторизация с помощью Magic Link',
          html: `
          <p>Welcome 👋</p>
          <p>Click below to verify your email:</p>
          <a href="${url}">Sign in</a>
        `
        }).then((res) => {
          if (res.error) {
            console.error('Failed to send magic link email', res.error);
            return;
          }

          console.info('Magic link email sent', res.data);
        }).catch(e => (
          console.error('Failed to send magic link email', e)
        ));
      }
    }),
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

export type TUser = typeof auth.$Infer.Session.user;
export type TSession = typeof auth.$Infer.Session.session;


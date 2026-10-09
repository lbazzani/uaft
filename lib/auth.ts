import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { postaAttiva } from '@/lib/mail/posta';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // Ogni fallimento torna null (per NextAuth «CredentialsSignin»): né il
      // browser né chi prova le password deve leggere errori di Prisma, o
      // capire se un'email esiste.
      async authorize(credentials) {
        // Posta spenta (cluster: nessun database): niente login, e nessuna
        // query che fallirebbe a ogni tentativo dal LoginDialog della landing.
        if (!postaAttiva()) return null;

        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
          return null;
        }
        // bcrypt lavora sui primi 72 byte: oltre è solo CPU sprecata
        if (email.length > 254 || password.length > 200) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          // il dettaglio resta nei log del pod, non nella risposta
          console.error('auth: login non riuscito per un errore interno', error instanceof Error ? error.name : '');
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

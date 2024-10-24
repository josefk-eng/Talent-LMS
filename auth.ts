import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { db } from './lib/db';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<any | undefined> {
    try {

        const user = await db.schoolAccount.findUnique({
            where: {
                email
            }
        });

        return user

    } catch (error){
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
          var myUser = null;

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);
        
            if (!user) return null;
            
            await bcrypt.compare(password, user.password)
                .then(same => {
                    if (same) {
                        myUser = user
                    }
                });
          }
          return myUser;
      },
  })],
});


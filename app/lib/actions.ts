'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {

  try {
    console.log(formData)
    const success = await signIn('credentials', {
        redirectTo: "/",
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    } );
  } catch (error) {
    console.log(`THIS IS THE ERROR => ${error}`)
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
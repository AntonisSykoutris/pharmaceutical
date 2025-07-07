'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ActionButton from '@/components/common/action-button';

const AuthUI = () => {
  const router = useRouter();
  const {
    email,
    password,
    handleLogin,
    handleGoogleLogin,
    handleSignup,
    setEmail,
    setPassword,
    error,
    isSignUpMode,
    setIsSignUpMode,
    clearError,
  } = useAuth();

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    clearError();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;
    if (isSignUpMode) {
      const result = await handleSignup();
      success = typeof result === 'boolean' ? result : false;
    } else {
      const result = await handleLogin(e);
      success = typeof result === 'boolean' ? result : false;
    }

    // Redirect to /platform only if login or signup succeeded and user is signed in
    if (success) {
      router.push('/platform');
    }
  };

  return (
    <section id='features' className='container py-24 sm:py-32 relative min-h-screen flex items-center justify-center '>
      {/* Glow background */}
      <div className='absolute -z-10 inset-0 overflow-hidden flex justify-center'>
        <div className='w-[600px] h-[600px] bg-gradient-to-r from-[#D247BF] to-primary opacity-30 blur-3xl rounded-full mt-32' />
      </div>
      <div className='max-w-md w-full bg-white p-8 rounded-xl shadow-md'>
        <h1 className='text-3xl font-bold mb-6 text-center'>{isSignUpMode ? 'Create an Account' : 'Welcome Back'}</h1>

        <Button variant='outline' className='w-full mb-4' onClick={handleGoogleLogin}>
          <LogIn className='mr-2 h-4 w-4' />
          Continue with Google
        </Button>

        <div className='flex items-center my-4'>
          <div className='flex-grow border-t border-gray-300'></div>
          <span className='mx-4 text-gray-500 text-sm'>OR</span>
          <div className='flex-grow border-t border-gray-300'></div>
        </div>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <label htmlFor='email' className='sr-only'>
              Email
            </label>
            <div className='relative'>
              <Input
                type='email'
                id='email'
                name='email'
                autoComplete='username email'
                placeholder='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Mail className='absolute right-3 top-3 h-4 w-4 text-gray-400' />
            </div>
          </div>

          <div>
            <label htmlFor='password' className='sr-only'>
              Password
            </label>
            <div className='relative'>
              <Input
                type='password'
                id='password'
                name='password'
                autoComplete='current-password'
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Lock className='absolute right-3 top-3 h-4 w-4 text-gray-400' />
            </div>
          </div>

          {error && <div className='text-red-600 text-sm text-center'>{error}</div>}

          <ActionButton
            name={isSignUpMode ? 'Sign Up' : 'Login'}
            onClick={() => console.log('Demo booked')}
            variant='primary'
            className='w-full'
            type='submit'
          />

          {/* <Button type='submit' className='w-full'>
            <LogIn className='mr-2 h-4 w-4' />
            {isSignUpMode ? 'Sign Up' : 'Login'}
          </Button> */}
        </form>

        <p className='text-center text-sm mt-4'>
          {isSignUpMode ? 'Already have an account?' : 'New to the platform?'}{' '}
          <Link href='#' className='underline' onClick={toggleMode}>
            {isSignUpMode ? 'Login' : 'Sign Up'}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AuthUI;

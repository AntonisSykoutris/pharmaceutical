import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import Section from '@/components/common/section';

export default function Page() {
  return (
    <Section id='auth' className='flex min-h-svh w-full items-center justify-center p-6 md:p-10' showGradient>
      <div className='w-full max-w-sm'>
        <ForgotPasswordForm />
      </div>
    </Section>
  );
}

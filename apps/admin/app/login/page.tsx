import { LoginForm } from '@/features/auth/LoginForm';
import { APP_NAME } from '@realworkstudio/config';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--admin-border)] bg-white p-8 shadow-sm">
        <h1 className="text-center text-xl font-semibold text-slate-900">{APP_NAME} Admin</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sign in to manage content</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

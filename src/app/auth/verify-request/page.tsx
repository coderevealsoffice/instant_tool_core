// Magic Link email verification page

export const metadata = {
  title: "Auth Verify request | Instant Tool",
  description: "Access the Auth Verify request page on Instant Tool.",
};

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full text-center">
        {/* Email icon */}
        <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect width="20" height="16" x="2" y="4" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
            Check your email
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            A magic sign-in link has been sent to your email address. Click the link in the email to sign in to your account.
          </p>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400 text-left">
            <p className="font-bold mb-1">⏱ Link expires in 10 minutes</p>
            <p className="font-medium opacity-80">If you don&apos;t see the email, check your spam folder.</p>
          </div>

          <a
            href="/auth/login"
            className="mt-6 inline-block text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ← Back to login
          </a>
        </div>
      </div>
    </div>
  )
}

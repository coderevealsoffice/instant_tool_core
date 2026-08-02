import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Shield, Key, Smartphone, LogOut, Lock } from "lucide-react"

export const metadata = {
  title: "Security Settings - InstantTool",
}

export default async function SecuritySettingsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 w-full">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Security & Privacy</h1>
        <p className="text-slate-500">Manage your password, 2FA, and connected devices.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <Key className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="font-bold text-slate-900">Change Password</h2>
              <p className="text-sm text-slate-500">Update the password used to log in to your account.</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition max-w-md" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition max-w-md" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition max-w-md" />
            </div>
            <div className="pt-2">
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg transition">
                Update Password
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <h2 className="font-bold text-slate-900">Two-Factor Authentication (2FA)</h2>
              <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Authenticator App</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">Use an app like Google Authenticator or Authy to generate one-time codes when you log in.</p>
              </div>
            </div>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-6 rounded-lg transition shrink-0 whitespace-nowrap">
              Enable 2FA
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-red-100 bg-red-50/30 flex items-center gap-3">
            <Lock className="w-5 h-5 text-red-600" />
            <div>
              <h2 className="font-bold text-red-900">Danger Zone</h2>
              <p className="text-sm text-red-600/80">Destructive actions for your account.</p>
            </div>
          </div>
          <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900">Sign out of all devices</h3>
              <p className="text-sm text-slate-500 mt-1">If you lost a device or noticed suspicious activity.</p>
            </div>
            <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 transition whitespace-nowrap">
              <LogOut className="w-4 h-4" /> Sign out all sessions
            </button>
          </div>
          <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900">Delete Account</h3>
              <p className="text-sm text-slate-500 mt-1">Permanently delete your account and all data.</p>
            </div>
            <button className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-2.5 px-4 rounded-lg transition whitespace-nowrap">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getSiteSettings } from "./settings-actions"
import SettingsClient from "./SettingsClient"

export const metadata = {
  title: "Site Settings - Super Admin",
}

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/")
  }

  const settings = await getSiteSettings()

  return (
    <div className="p-8 w-full space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Global Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage site-wide configurations like SEO, Infrastructure APIs, and integrations.</p>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  )
}

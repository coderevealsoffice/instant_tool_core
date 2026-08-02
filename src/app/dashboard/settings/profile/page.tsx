import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { User, Mail, Camera, Save, Phone, MapPin } from "lucide-react"

export const metadata = {
  title: "Profile Settings - InstantTool",
}

export default async function ProfileSettingsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const userId = typeof session.user.id === 'string' ? session.user.id : undefined
  const userEmail = typeof session.user.email === 'string' ? session.user.email : undefined

  let user = null;
  if (userId) {
    try {
      user = await prisma.user.findUnique({
        where: { id: userId }
      })
    } catch (error) {
      console.error("Prisma error fetching user in profile:", error)
    }
  } else if (userEmail) {
    try {
      user = await prisma.user.findUnique({
        where: { email: userEmail }
      })
    } catch (error) {
      console.error("Prisma error fetching user by email in profile:", error)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 w-full">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Profile Settings</h1>
        <p className="text-slate-500">Update your personal information and public profile details.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <form className="space-y-8">
          
          <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                {user?.image ? (
                  <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Profile Picture</h3>
              <p className="text-sm text-slate-500 mb-3">Upload a new avatar (JPG or PNG, max 2MB).</p>
              <div className="flex gap-3">
                <button type="button" className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition">Upload New</button>
                <button type="button" className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition">Remove</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> Full Name
              </label>
              <input 
                type="text" 
                defaultValue={user?.name || ""}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" /> Email Address
              </label>
              <input 
                type="email" 
                defaultValue={user?.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400">Email cannot be changed directly. Contact support.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Phone Number
              </label>
              <input 
                type="tel" 
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Location
              </label>
              <input 
                type="text" 
                placeholder="e.g. New York, USA"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-700 transition">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-2 transition">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

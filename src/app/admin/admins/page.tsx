import { getAdminsAndUsers } from "./admin-actions"
import AdminsClient from "./AdminsClient"

export const metadata = {
  title: "Admin Management - Super Admin"
}

export default async function AdminsPage() {
  const staff = await getAdminsAndUsers()
  
  return (
    <div className="p-8 w-full space-y-8">
      <AdminsClient initialStaff={staff} />
    </div>
  )
}

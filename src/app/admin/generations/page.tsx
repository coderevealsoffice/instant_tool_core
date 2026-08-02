import { ReactElement } from "react"


export const metadata = {
  title: "Admin Generations | Instant Tool",
  description: "Access the Admin Generations page on Instant Tool.",
};

export default function GenerationsPage(): ReactElement {
 return (
 <div className="p-8">
 <h1 className="text-2xl font-bold mb-4">All Generations</h1>
 <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500">
 View and manage all generations across the platform here.
 </p>
 </div>
 )
}

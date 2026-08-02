import { ReactNode } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function AdminLayout({ children }: { children: ReactNode }) {
 const session = await auth()
 
 if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
 redirect("/")
 }

 return (
 <SidebarProvider>
 <AppSidebar />
 <SidebarInset>
 <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b dark:border-slate-800">
 <div className="flex items-center gap-2 px-4">
 <SidebarTrigger className="-ml-1" />
 <Separator orientation="vertical" className="mr-2 h-4 dark:bg-slate-800" />
 <Breadcrumb>
 <BreadcrumbList>
 <BreadcrumbItem>
 <BreadcrumbPage>Admin Panel</BreadcrumbPage>
 </BreadcrumbItem>
 </BreadcrumbList>
 </Breadcrumb>
 </div>
 <div className="px-4">
 <ThemeToggle />
 </div>
 </header>
 {children}
 </SidebarInset>
 </SidebarProvider>
 )
}

"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LifeBuoy,
  BookOpen,
  FileText,
  Settings,
  Plus,
  ChevronsUpDown,
  GalleryVerticalEnd,
  HelpCircle,
  FolderOpen,
  Database,
  BarChart,
  HardDrive,
  Download,
  QrCode,
  Bell,
  Shield,
  Box,
  Server,
  DollarSign,
  Activity,
  Layers,
  Cpu,
  Mail,
  ToggleLeft
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data = {
  userNav: [
    { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Files", url: "/dashboard/files", icon: FolderOpen },
    { title: "History", url: "/dashboard/history", icon: Activity },
    { title: "Buy Credits", url: "/dashboard/buy-credits", icon: DollarSign },
    { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
    { title: "Settings", url: "/dashboard/settings/profile", icon: Settings },
  ],
  adminNav: [
    { title: "Overview", url: "/admin", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Plans", url: "/admin/plans", icon: Layers },
    { title: "Coupons", url: "/admin/coupons", icon: Box },
    { title: "Credits", url: "/admin/credits", icon: Database },
    { title: "Tool Pricing", url: "/admin/tool-pricing", icon: DollarSign },
    { title: "Jobs", url: "/admin/jobs", icon: Activity },
    { title: "Payments", url: "/admin/payments", icon: CreditCard },
    { title: "Support Tickets", url: "/admin/support", icon: LifeBuoy },
    { title: "CMS / Content", url: "/admin/cms", icon: BookOpen },
    { title: "Reports", url: "/admin/reports", icon: BarChart },
    { title: "AI Content Manager", url: "/admin/ai-content", icon: Cpu },
    { title: "Ad Placements", url: "/admin/ads", icon: GalleryVerticalEnd },
  ],
  superAdminNav: [
    { title: "Admin Management", url: "/admin/admins", icon: Shield },
    { title: "Role / Permission", url: "/admin/roles", icon: Users },
    { title: "Tool Credit Matrix", url: "/admin/tool-matrix", icon: Database },
    { title: "Global Settings", url: "/admin/settings", icon: Settings },
    { title: "Payment Settings", url: "/admin/settings/payments", icon: CreditCard },
    { title: "Queue / Workers", url: "/admin/queue", icon: Server },
    { title: "Audit Logs", url: "/admin/logs", icon: FileText },
    { title: "Feature Toggles", url: "/admin/features", icon: ToggleLeft },
    { title: "FAQs", url: "/admin/faqs", icon: HelpCircle },
    { title: "Blogs", url: "/admin/blog", icon: FileText },
    { title: "Legal Page Manager", url: "/admin/legal", icon: BookOpen },
    { title: "Content Templates", url: "/admin/templates", icon: Layers },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role || "USER"
  
  const userFallback = session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"

  let displayRole = "User"
  if (userRole === "SUPER_ADMIN") displayRole = "Super Admin"
  if (userRole === "ADMIN") displayRole = "Admin"

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold tracking-tight">InstantTool</span>
                  <span className="truncate text-[10px] uppercase font-bold text-amber-500">{displayRole}</span>
                </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {userRole === "USER" && (
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {data.userNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} render={<Link href={item.url} />}>
                      <item.icon />
                      <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
        
        {(userRole === "SUPER_ADMIN" || userRole === "ADMIN") && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.adminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname.startsWith(item.url)} render={<Link href={item.url} />}>
                      <item.icon />
                      <span className="flex-1">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {userRole === "SUPER_ADMIN" && (
          <SidebarGroup>
            <SidebarGroupLabel>Super Admin Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.superAdminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname.startsWith(item.url)} render={<Link href={item.url} />}>
                      <item.icon />
                      <span className="flex-1">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-bold">{userFallback.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold">{session?.user?.name || "User"}</span>
                    <span className="truncate text-xs">{session?.user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              } />
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">{userFallback.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{session?.user?.name || "User"}</span>
                        <span className="truncate text-xs">{session?.user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/" className="cursor-pointer">
                    Back to Main Site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer text-red-600 focus:text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

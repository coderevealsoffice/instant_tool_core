#!/bin/bash

# Base directories
mkdir -p src/app/dashboard
mkdir -p src/app/admin
mkdir -p src/app/super-admin

# Function to create a page
create_page() {
  local route=$1
  local title=$2
  mkdir -p "src/app$route"
  cat << INNER_EOF > "src/app$route/page.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">$title</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>$title</CardTitle>
          <CardDescription>This is a placeholder for the $title page.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
INNER_EOF
}

# User Dashboard
create_page "/dashboard/credits" "Credits"
create_page "/dashboard/subscription" "Subscription"
create_page "/dashboard/buy-credits" "Buy Credits"
create_page "/dashboard/billing" "Billing / Invoices"
create_page "/dashboard/files" "My Files"
create_page "/dashboard/jobs" "Jobs / Processing History"
create_page "/dashboard/downloads" "Downloads"
create_page "/dashboard/qr-manager" "QR Manager"
create_page "/dashboard/notifications" "Notifications"
create_page "/dashboard/support" "Support Tickets"
create_page "/dashboard/settings/profile" "Profile Settings"
create_page "/dashboard/settings/security" "Security Settings"

# Admin Dashboard
create_page "/admin/users" "Manage Users"
create_page "/admin/plans" "Manage Plans"
create_page "/admin/credits" "Manage Credits"
create_page "/admin/tool-pricing" "Tool Pricing"
create_page "/admin/jobs" "All Jobs"
create_page "/admin/payments" "Payments & Transactions"
create_page "/admin/coupons" "Coupons"
create_page "/admin/qr-records" "QR Records"
create_page "/admin/support" "Admin Support Tickets"
create_page "/admin/cms" "CMS / Content Manager"
create_page "/admin/reports" "Reports & Analytics"
create_page "/admin/ai-content" "AI Content Manager"
create_page "/admin/ads" "Ad Placements"
create_page "/admin/settings" "Admin Settings"

# Super Admin Dashboard
create_page "/super-admin/admins" "Admin Management"
create_page "/super-admin/roles" "Role / Permission Matrix"
create_page "/super-admin/tool-matrix" "Tool Credit Matrix"
create_page "/super-admin/settings/site" "Site Settings"
create_page "/super-admin/settings/seo" "Global SEO"
create_page "/super-admin/settings/adsense" "Global AdSense"
create_page "/super-admin/settings/storage" "Storage Settings"
create_page "/super-admin/settings/queue" "Queue / Worker Settings"
create_page "/super-admin/settings/smtp" "SMTP Settings"
create_page "/super-admin/settings/payments" "Payment Settings"
create_page "/super-admin/settings/ai" "AI Provider Settings"
create_page "/super-admin/logs/audit" "Audit Logs"
create_page "/super-admin/logs/system" "System Logs"
create_page "/super-admin/features" "Feature Toggles"
create_page "/super-admin/legal" "Legal Page Manager"
create_page "/super-admin/templates" "Content Templates"

echo "Done generating routes!"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


export const metadata = {
  title: "Admin Settings Storage | Instant Tool",
  description: "Access the Admin Settings Storage page on Instant Tool.",
};

export default function Page() {
 return (
 <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
 <div className="flex items-center justify-between space-y-2">
 <h2 className="text-3xl font-bold tracking-tight">Storage Settings</h2>
 </div>
 <Card>
 <CardHeader>
 <CardTitle>Storage Settings</CardTitle>
 <CardDescription>This is a placeholder for the Storage Settings page.</CardDescription>
 </CardHeader>
 <CardContent>
 <p className="text-sm text-muted-foreground">Content will be implemented here.</p>
 </CardContent>
 </Card>
 </div>
 )
}

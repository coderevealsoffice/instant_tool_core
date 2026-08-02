import { auth } from "@/auth"
import prisma from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { File, HardDrive, Download, Trash, FileText, Image as ImageIcon, FileAudio, FileVideo, FileArchive } from "lucide-react"

export const metadata = {
  title: "My Files - InstantTool",
}

function getFileIcon(mimeType: string) {
  if (mimeType.includes("image")) return <ImageIcon className="w-8 h-8 text-blue-500" />
  if (mimeType.includes("audio")) return <FileAudio className="w-8 h-8 text-amber-500" />
  if (mimeType.includes("video")) return <FileVideo className="w-8 h-8 text-rose-500" />
  if (mimeType.includes("pdf")) return <FileText className="w-8 h-8 text-red-500" />
  if (mimeType.includes("zip") || mimeType.includes("compressed")) return <FileArchive className="w-8 h-8 text-slate-500" />
  return <File className="w-8 h-8 text-slate-400" />
}

export default async function MyFilesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const files = await prisma.fileAsset.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  })

  // Calculate usage
  const totalStorageBytes = files.reduce((acc, file) => acc + file.sizeBytes, 0)
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(1)

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">My Files</h1>
          <p className="text-slate-500">Access and manage all the files you've uploaded or processed.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
          <HardDrive className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Storage Used</div>
            <div className="font-black text-slate-900">{totalStorageMB} MB</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
              <tr>
                <th className="px-6 py-4 font-bold">File Name</th>
                <th className="px-6 py-4 font-bold">Size</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Uploaded Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.mimeType)}
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1 max-w-[300px]" title={file.fileName}>
                          {file.fileName}
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {file.isOutput ? "Processed Output" : "Original Upload"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {(file.sizeBytes / 1024).toFixed(1)} KB
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">
                      {file.mimeType.split('/')[1] || file.mimeType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(file.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={file.fileUrl} target="_blank" download className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Download">
                        <Download className="w-4 h-4" />
                      </a>
                      <button className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition" title="Delete">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {files.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                      <File className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">No Files Yet</h3>
                    <p className="text-slate-500">Files you upload or process using our tools will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

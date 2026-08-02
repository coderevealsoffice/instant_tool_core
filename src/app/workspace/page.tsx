"use client"
import dynamic from 'next/dynamic'

const WorkspaceClient = dynamic(() => import('./client'), { ssr: false })

export default function Page() {
  return <WorkspaceClient />
}

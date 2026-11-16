import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client"
import os from 'os'
import fs from 'fs'
import path from 'path'

// Bulletproof .env loading for scripts and standalone runners (e.g. seed scripts)
if (!process.env.DATABASE_URL) {
  try {
    // Try dotenv first
    require('dotenv').config()
  } catch {
    // Ignore
  }

  // If still not set, parse .env directly from disk
  if (!process.env.DATABASE_URL) {
    try {
      const candidates = [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), '.env.local'),
        path.resolve(__dirname, '../../../.env'),
        path.resolve(__dirname, '../../.env'),
      ]
      for (const envPath of candidates) {
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, 'utf-8')
          const match = content.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m)
          if (match && match[1]) {
            process.env.DATABASE_URL = match[1]
            break
          }
        }
      }
    } catch {
      // Ignore
    }
  }
}

let connectionString = process.env.DATABASE_URL || "postgres://pradeepyadav@127.0.0.1:5432/instant_tool?sslmode=disable"

// On Linux production server (147.79.66.96), connecting to itself via public IP hangs
// because Linux lacks hairpin NAT by default. Automatically map 147.79.66.96 to 127.0.0.1
// if running on the server.
if (connectionString.includes("147.79.66.96")) {
  try {
    const interfaces = os.networkInterfaces()
    const isOwnIP = Object.values(interfaces).flat().some(iface => iface?.address === "147.79.66.96")
    if (isOwnIP || process.platform === 'linux') {
      connectionString = connectionString.replace(/147\.79\.66\.96/g, '127.0.0.1')
    }
  } catch {
    if (process.platform === 'linux') {
      connectionString = connectionString.replace(/147\.79\.66\.96/g, '127.0.0.1')
    }
  }
}

// Log sanitized connection string
const sanitized = connectionString.replace(/:[^:@]+@/, ':****@')
console.log("PRISMA CONNECTING TO:", sanitized)

const prismaClientSingleton = () => {
  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    statement_timeout: 8000,
    query_timeout: 8000,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma

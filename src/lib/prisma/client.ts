import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client"
import os from 'os'

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
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 10000,
    statement_timeout: 4000,
    query_timeout: 4000,
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

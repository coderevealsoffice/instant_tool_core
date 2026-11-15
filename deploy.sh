#!/bin/bash
set -e

echo "🚀 Starting Deployment..."

echo "📥 1. Pulling latest code..."
git fetch origin main
git reset --hard origin/main

echo "📦 2. Generating Prisma Client..."
npx prisma generate

echo "🔨 3. Building Next.js with standalone asset sync..."
npm run build

echo "🔄 4. Restarting PM2 process..."
pm2 restart instant-tool-ai || pm2 start ecosystem.config.js
pm2 save

echo "✅ Deployment Successful! Check https://devigo.cloud"


#!/bin/bash
set -e

echo "🚀 Starting Deployment..."

echo "📥 1. Pulling latest code from origin/main..."
git fetch origin main
git reset --hard origin/main

echo "🔧 2. Ensuring local database host in .env (127.0.0.1:5432)..."
if [ -f .env ]; then
  sed -i 's/@147\.79\.66\.96:5432/@127.0.0.1:5432/g' .env
fi

echo "📦 3. Generating Prisma Client..."
npx prisma generate

echo "🧹 4. Cleaning previous build cache..."
rm -rf .next

echo "🔨 5. Building Next.js with standalone asset sync..."
npm run build

echo "🔄 6. Restarting PM2 process..."
pm2 restart instant-tool-ai || pm2 start ecosystem.config.js
pm2 save

echo "✅ Deployment Successful! Check https://devigo.cloud"

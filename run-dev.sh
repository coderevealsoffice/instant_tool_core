#!/bin/bash
export NEXT_TELEMETRY_DISABLED=1
export NO_COLOR=1
export FORCE_COLOR=0
npm run dev > /tmp/next-dev.log 2>&1 &
DEV_PID=$!
echo "Started next dev with PID: $DEV_PID"
sleep 20
echo "=== Log after 20s ==="
cat /tmp/next-dev.log
echo "=== Port 3000 ==="
lsof -i :3000 2>/dev/null || echo "Port 3000 not in use"
echo "=== Process still running? ==="
kill -0 $DEV_PID 2>/dev/null && echo "YES - PID $DEV_PID running" || echo "NO - process ended"

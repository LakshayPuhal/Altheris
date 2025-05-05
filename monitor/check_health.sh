#!/bin/bash
echo "🩺 Checking health of the app..."
URL="http://localhost:3000/health"
MAX_RETRIES=6
RETRY_DELAY=5
for i in $(seq 1 $MAX_RETRIES); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)
  echo "Try $i: Status $STATUS"
  if [ "$STATUS" == "200" ]; then
    echo "✅ App is healthy!"
    exit 0
  fi
  sleep $RETRY_DELAY
done
echo "❌ Health check failed! Rolling back..."
docker compose -f rollback-compose.yml up -d --force-recreate
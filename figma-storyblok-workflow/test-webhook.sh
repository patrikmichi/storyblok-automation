#!/bin/bash

# Test script for n8n webhook
# Usage: ./test-webhook.sh [webhook-url] [schema-file]

WEBHOOK_URL="${1:-https://n8n-latest-6jt9.onrender.com/webhook/push-schema}"
SCHEMA_FILE="${2:-test-schema.json}"

if [ ! -f "$SCHEMA_FILE" ]; then
  echo "❌ Schema file not found: $SCHEMA_FILE"
  exit 1
fi

echo "📤 Sending schema to n8n webhook..."
echo "   URL: $WEBHOOK_URL"
echo "   File: $SCHEMA_FILE"
echo ""

response=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @"$SCHEMA_FILE")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo "📥 Response (HTTP $http_code):"
echo "$body" | jq '.' 2>/dev/null || echo "$body"

if [ "$http_code" -eq 200 ]; then
  echo ""
  echo "✅ Success!"
else
  echo ""
  echo "❌ Failed with HTTP $http_code"
  exit 1
fi


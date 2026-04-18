#!/usr/bin/env bash
# RSV360 — Smoke test for the website module (admin + public endpoints)
# Usage: BASE_URL=http://localhost:5000 ./scripts/smoke-website.sh
# Requires: curl

BASE_URL="${BASE_URL:-http://localhost:5000}"
PASS=0
FAIL=0

check() {
  local label="$1"
  local url="$2"
  local expected_codes="$3"    # space-separated list of acceptable HTTP codes

  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url")

  local matched=false
  for c in $expected_codes; do
    if [ "$code" = "$c" ]; then
      matched=true
      break
    fi
  done

  if [ "$matched" = "true" ]; then
    echo "  PASS  [$code] $label"
    PASS=$((PASS + 1))
  else
    echo "  FAIL  [$code] $label  (expected: $expected_codes)"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "RSV360 — Website Module Smoke Test"
echo "Target: $BASE_URL"
echo "────────────────────────────────────────"

echo ""
echo "── Admin endpoints (auth gate expected) ─"
check "GET /api/admin/website/pages"    "$BASE_URL/api/admin/website/pages"    "200 401"
check "GET /api/admin/website/settings" "$BASE_URL/api/admin/website/settings" "200 401"
check "GET /api/admin/website/audit"    "$BASE_URL/api/admin/website/audit"    "200 401"

echo ""
echo "── Public endpoints (200 expected) ──────"
check "GET /api/website/navigation"     "$BASE_URL/api/website/navigation"     "200"
check "GET /api/website/settings"       "$BASE_URL/api/website/settings"       "200"

echo ""
echo "── Public page by slug ──────────────────"
check "GET /api/website/pages/home"     "$BASE_URL/api/website/pages/home"     "200 404"

echo ""
echo "────────────────────────────────────────"
echo "Result: $PASS passed, $FAIL failed"
echo ""

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0

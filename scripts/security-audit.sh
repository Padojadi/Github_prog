#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
REPORT_DIR="${ROOT_DIR}/backups/security-reports/${TIMESTAMP}"

mkdir -p "${REPORT_DIR}"

echo "[security-audit] Reports directory: ${REPORT_DIR}"

run_audit() {
  local target_dir="$1"
  local report_name="$2"
  echo "[security-audit] Auditing ${target_dir}"
  (
    cd "${target_dir}"
    # npm audit returns non-zero when vulnerabilities exist; we still want reports.
    npm audit --json > "${REPORT_DIR}/${report_name}.json" || true
  )
}

run_audit "${ROOT_DIR}/protosen-frontend-dev" "frontend-npm-audit"
run_audit "${ROOT_DIR}/protosen-backend-dev" "backend-npm-audit"

echo "[security-audit] Done."
echo "[security-audit] Frontend report: ${REPORT_DIR}/frontend-npm-audit.json"
echo "[security-audit] Backend report:  ${REPORT_DIR}/backend-npm-audit.json"

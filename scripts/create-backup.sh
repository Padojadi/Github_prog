#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="${ROOT_DIR}/backups"
ARCHIVE_PATH="${BACKUP_DIR}/protosen-app-backup-${TIMESTAMP}.tar.gz"

mkdir -p "${BACKUP_DIR}"

echo "[backup] Creating application backup..."
echo "[backup] Output: ${ARCHIVE_PATH}"

tar \
  --exclude=".git" \
  --exclude="**/node_modules" \
  --exclude="**/.next" \
  --exclude="**/dist" \
  --exclude="**/build" \
  -czf "${ARCHIVE_PATH}" \
  -C "${ROOT_DIR}" \
  README.md \
  protosen-frontend-dev \
  protosen-backend-dev \
  protosen-frontend-dev.zip \
  protosen-frontend-dev-latest.zip \
  protosen-backend-dev.zip \
  "project-bolt-sb1-wp5kudmy (1).zip"

echo "[backup] Backup complete."
echo "[backup] ${ARCHIVE_PATH}"

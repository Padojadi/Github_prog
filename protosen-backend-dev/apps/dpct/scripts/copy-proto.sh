#!/bin/sh

# ⚠️  NE PAS SUPPRIMER - Script essentiel pour le build de production
# Copy Protocol Buffer files to build directory
# Usage: sh scripts/copy-proto.sh (or npm run copy-proto)
# This script should be run from the project root directory

# Change to project root if running from scripts/
if [ "$(basename "$PWD")" = "scripts" ]; then
  cd ..
fi

# Find all proto files in src/modules/*/protos/ directories
PROTO_FILES=$(find ./src/modules -path "*/protos/*.proto" -type f)

if [ -z "$PROTO_FILES" ]; then
  echo "❌ No proto files found in src/modules/*/protos/"
  exit 1
fi

echo "🔍 Found proto files:"
echo "$PROTO_FILES"
echo ""

# Copy each proto file to the corresponding location in build/
for proto_file in $PROTO_FILES; do
  # Get the relative path from src/
  relative_path="${proto_file#./src/}"

  # Destination path in build/
  dest_file="./build/src/$relative_path"
  dest_dir=$(dirname "$dest_file")

  # Create destination directory if it doesn't exist
  mkdir -p "$dest_dir"

  # Copy the proto file
  cp "$proto_file" "$dest_file"
  echo "✅ Copied: $proto_file → $dest_file"
done

echo ""
echo "✅ All proto files copied to build/src/"

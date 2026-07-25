#!/bin/sh

# ⚠️  NE PAS SUPPRIMER - Script essentiel pour la génération gRPC
# Generate TypeScript types from Protocol Buffer definitions
# Usage: sh scripts/generate-grpc.sh (or npm run generate:grpc)
# This script should be run from the project root directory

# Change to project root if running from scripts/
if [ "$(basename "$PWD")" = "scripts" ]; then
  cd ..
fi

# Output directory for generated TypeScript files
OUT_DIR=./grpc/generated

# Create output directory
mkdir -p $OUT_DIR

# Find all proto files in src/modules/*/protos/ directories
PROTO_FILES=$(find ./src/modules -path "*/protos/*.proto" -type f)

if [ -z "$PROTO_FILES" ]; then
  echo "❌ No proto files found in src/modules/*/protos/"
  exit 1
fi

echo "🔍 Found proto files:"
echo "$PROTO_FILES"
echo ""

# Generate TypeScript types from all proto files
# Using src/modules/*/protos as proto_path to resolve imports correctly
npx grpc_tools_node_protoc \
  --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=$OUT_DIR \
  --ts_proto_opt=esModuleInterop=true,outputServices=grpc-js,env=node,returnObservable=true \
  --proto_path=./src/modules/user/protos \
  --proto_path=./src/modules/institution/protos \
  $PROTO_FILES

echo ""
echo "✅ TypeScript proto files generated in grpc/generated/"

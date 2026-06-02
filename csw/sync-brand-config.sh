#!/bin/bash
# VitalMatrix Brand Config Sync
# CSW is the source of truth. CSD receives the copy.
# Run after any change to brand-config.ts

CSW="C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-web/src/brand-config.ts"
CSD="C:/Users/Lenovo/Downloads/vitalmatrix-content-studio-dev/src/brand-config.ts"

if ! diff -q "$CSW" "$CSD" > /dev/null 2>&1; then
  echo "DRIFT DETECTED — syncing CSW → CSD"
  cp "$CSW" "$CSD"
  echo "Synced. Remember to commit CSD."
else
  echo "Brand config: IN SYNC"
fi

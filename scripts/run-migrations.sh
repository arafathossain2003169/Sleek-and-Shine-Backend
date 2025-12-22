#!/bin/bash
for file in src/migrations/*.sql; do
  echo "Running $file"
  psql "$DATABASE_URL" -f "$file"
done

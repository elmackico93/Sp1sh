#!/bin/bash

# Fix React component filenames and function names with hyphens

PROJECT_DIR="."

# Rename files and update component names
find "$PROJECT_DIR/pages" -name "*.tsx" | while read file; do
  if [[ "$file" == *"-"* ]]; then
    new_file=$(echo "$file" | sed -r 's/(.*)\/([^\/]+)-([^\/]+)\.tsx/\1\/\u\2\u\3.tsx/')

    if [ "$file" != "$new_file" ]; then
      git mv "$file" "$new_file"

      # Update the component name inside the file (hyphen to PascalCase)
      component_name=$(basename "$new_file" .tsx)
      sed -i -E "s/export default function [a-zA-Z0-9-]+\(\)/export default function ${component_name}Page()/" "$new_file"
    fi

    # Fix any hyphenated component names still present in files
    sed -i -E 's/export default function ([a-zA-Z]+)-([a-zA-Z]+)Page\(\)/export default function \u\1\u\2Page()/' "$new_file"
  fi
done

# Check TypeScript project
cd "$PROJECT_DIR"
npm install
npx tsc --noEmit

if [ $? -eq 0 ]; then
  echo "✅ TypeScript check passed, no errors found!"
else
  echo "❌ TypeScript check found errors. Please review and fix them."
fi
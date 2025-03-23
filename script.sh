#!/bin/bash

# Path to the scripts.ts file
FILE_PATH="./mocks/scripts.ts"

# Create a backup
cp "$FILE_PATH" "${FILE_PATH}.final.backup"

# Create a new temporary file
> "${FILE_PATH}.fixed"

# Process the file line by line
while IFS= read -r line; do
  # Replace all bash variable references using ${...} syntax with simpler $... syntax
  # This prevents JavaScript from interpreting them as template literals
  
  # First, handle specific named variables we've encountered
  modified=$(echo "$line" | 
    sed 's/\${cpu_usage}/\$cpu_usage/g' |
    sed 's/\${mem_usage}/\$mem_usage/g' |
    sed 's/\${used_mem}/\$used_mem/g' |
    sed 's/\${total_mem}/\$total_mem/g' |
    sed 's/\${rx_kbps}/\$rx_kbps/g' |
    sed 's/\${tx_kbps}/\$tx_kbps/g' |
    sed 's/\${RED}/\$RED/g' |
    sed 's/\${GREEN}/\$GREEN/g' |
    sed 's/\${YELLOW}/\$YELLOW/g' |
    sed 's/\${BLUE}/\$BLUE/g' |
    sed 's/\${NC}/\$NC/g' |
    sed 's/\${level}/\$level/g' |
    sed 's/\${message}/\$message/g' |
    sed 's/\${LOG_FILE}/\$LOG_FILE/g' |
    sed 's/\${timestamp}/\$timestamp/g')
    
  # Then use a general pattern to catch any remaining ${...} variables
  modified=$(echo "$modified" | sed -E 's/\$\{([a-zA-Z0-9_]+)\}/\$\1/g')
  
  # Write the modified line to the new file
  echo "$modified" >> "${FILE_PATH}.fixed"
done < "$FILE_PATH"

# Replace the original file with the fixed version
mv "${FILE_PATH}.fixed" "$FILE_PATH"

# Clear Next.js cache to ensure changes take effect
rm -rf .next

echo "All template literal issues have been fixed!"
echo "Please restart your development server with 'npm run dev'"
#!/bin/bash
#
# SP1SH COMPONENT EXPORT FIXER
# ============================
# Linus Torvalds: "Don't break the system."
# Kevin Mitnick:  "Trust nothing, verify everything."
# Bill Gates:     "Fix it once, fix it everywhere."

set -euo pipefail
IFS=$'\n\t'

COMPONENTS_DIR="components/home"
TARGET_COMPONENTS=(
  "FeaturedScript"
  "EmergencyScripts"
  "OSTabs"
  "TrendingTable"
  "CategoriesSection"
  "QuickActions"
)

echo "[INFO] 🔍 Controllo export default nei componenti dinamici..."

for component in "${TARGET_COMPONENTS[@]}"; do
  FILE_PATH="${COMPONENTS_DIR}/${component}.tsx"

  if [[ ! -f "$FILE_PATH" ]]; then
    echo "[WARNING] ⚠️  File non trovato: $FILE_PATH"
    continue
  fi

  if grep -q "export default" "$FILE_PATH"; then
    echo "[OK] ✅ $component ha già un export default"
  else
    # Trova il nome del componente esportato
    exported_name=$(grep -oE "export const ([A-Z][A-Za-z0-9_]*)" "$FILE_PATH" | awk '{print $3}' || true)

    if [[ -n "$exported_name" ]]; then
      echo -e "\n[INFO] ➕ Aggiungo 'export default $exported_name' a $FILE_PATH"
      echo -e "\nexport default $exported_name;" >> "$FILE_PATH"
      echo "[SUCCESS] ✅ Fix completato per $component"
    else
      echo "[ERROR] ❌ Nessun 'export const' trovato in $FILE_PATH. Correggere manualmente."
    fi
  fi
done

echo -e "\n[SUCCESS] 🧼 Controllo completato. Ora puoi eseguire: npm run dev"
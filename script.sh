#!/bin/bash

LAYOUT="components/layout/Layout.tsx"

echo "🧼 Rimuovendo OSNavbar duplicato da Layout.tsx..."

# Rimuove la riga di import di OSNavbar
sed -i.bak '/import { OSNavbar } from .\/OSNavbar/d' "$LAYOUT"

# Rimuove direttamente il componente <OSNavbar />
sed -i '/<OSNavbar \/>/d' "$LAYOUT"

echo "✅ Menu duplicato rimosso. Layout ripulito correttamente."

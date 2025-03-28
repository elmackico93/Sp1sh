#!/bin/bash

# Exit on error
set -e

# Paths (adjust if your structure is different)
SVG_FILE="public/assets/logo.svg"
HEADER_FILE="components/layout/Header.tsx"
GLOBAL_CSS="styles/globals.css"

# Check files exist
if [[ ! -f "$SVG_FILE" || ! -f "$HEADER_FILE" || ! -f "$GLOBAL_CSS" ]]; then
  echo "❌ One or more required files are missing. Make sure these exist:"
  echo "  - $SVG_FILE"
  echo "  - $HEADER_FILE"
  echo "  - $GLOBAL_CSS"
  exit 1
fi

# 1. Backup the original Header.tsx
cp "$HEADER_FILE" "$HEADER_FILE.bak"
echo "🔙 Backup created: $HEADER_FILE.bak"

# 2. Extract the <svg> from logo.svg, add classes
INLINE_SVG=$(awk '
  BEGIN {inside=0}
  /<svg/{inside=1}
  /<\/svg>/{inside=0; print; next}
  inside {
    # Inject class into blue and green paths
    gsub(/fill="#0173DD"/, "className=\"logo-blue-part\" fill=\"#0173DD\"")
    gsub(/fill="#43B532"/, "className=\"logo-green-part\" fill=\"#43B532\"")
    print
    next
  }
  /<svg/ { print }
' "$SVG_FILE")

# 3. Replace <img src="/assets/logo.svg" ... /> in Header.tsx with inline SVG
awk -v replacement="$INLINE_SVG" '
  BEGIN {skip=0}
  /<img[^>]*logo\.svg[^>]*>/ {
    print replacement;
    skip=1;
    next
  }
  skip && /\/>/ { skip=0; next }
  !skip { print }
' "$HEADER_FILE.bak" > "$HEADER_FILE"

echo "✅ Logo inlined into $HEADER_FILE with class names."

# 4. Inject CSS into globals.css if not already present
if ! grep -q '.logo-blue-part' "$GLOBAL_CSS"; then
cat <<EOF >> "$GLOBAL_CSS"

.logo-blue-part { fill: #0173DD; }
.logo-green-part { fill: #43B532; }
.logo-blue-part, .logo-green-part {
  transition: fill 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .logo-blue-part { fill: #43B532; }
  .logo-green-part { fill: #0173DD; }
}
EOF
  echo "🎨 CSS for dark mode color swapping added to $GLOBAL_CSS."
else
  echo "⚠️ CSS already present in $GLOBAL_CSS, skipping injection."
fi

echo "🎉 All done! Restart your dev server if it's running to see the effect."

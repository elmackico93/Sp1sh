#!/bin/bash

HEADER="components/layout/Header.tsx"

echo "🔁 Sistemazione finale: trigger su logo intero + nessun layout shift..."

# 1. Ripristina claim span senza onclick
sed -i 's/onClick={rotateClaim} //' "$HEADER"

# 2. Wrappa logo intero in un button
sed -i '/<Link href="\/" passHref className="flex items-center gap-3 mt-2/,/<\/div>/c\
<button onClick={rotateClaim} className="flex items-center gap-3 mt-2 sm:mt-3 mb-2 sm:mb-3 focus:outline-none">\
  <div className="flex items-center gap-3">\
    <div className="flex-shrink-0">\
      <img\
        src="/assets/logo.svg"\
        alt="Sp1sh Logo"\
        className="h-12 sm:h-14 w-auto bg-white dark:bg-gray-900 rounded-2xl p-1 ring-2 ring-primary drop-shadow-md transition-transform duration-200 hover:scale-110"\
        loading="eager"\
      />\
    </div>\
    <span className="brand-claim font-mono text-sm sm:text-[13px] text-blue-500 dark:text-primary-light opacity-100 whitespace-nowrap select-none min-w-[280px] block">\
      <span id="typed-claim">{animatedClaim}</span>\
      <span id="cursor" className="cursor">|</span>\
    </span>\
  </div>\
</button>' "$HEADER"

echo "✅ Click sul logo attivato e layout stabilizzato con spazio fisso!"

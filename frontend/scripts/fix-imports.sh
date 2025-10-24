#!/bin/bash

# Script to fix all versioned imports in the project
# This removes version numbers from package imports

echo "Fixing imports in UI components..."

# Fix Radix UI imports
find components/ui -name "*.tsx" -type f -exec sed -i '' 's/@radix-ui\/\([^@]*\)@[0-9.]*"/@radix-ui\/\1"/g' {} +

# Fix lucide-react imports
find components -name "*.tsx" -type f -exec sed -i '' 's/lucide-react@[0-9.]*/lucide-react/g' {} +

# Fix class-variance-authority imports
find components/ui -name "*.tsx" -type f -exec sed -i '' 's/class-variance-authority@[0-9.]*/class-variance-authority/g' {} +

# Fix other versioned imports
find components/ui -name "*.tsx" -type f -exec sed -i '' 's/react-day-picker@[0-9.]*/react-day-picker/g' {} +
find components/ui -name "*.tsx" -type f -exec sed -i '' 's/embla-carousel-react@[0-9.]*/embla-carousel-react/g' {} +
find components/ui -name "*.tsx" -type f -exec sed -i '' 's/cmdk@[0-9.]*/cmdk/g' {} +
find components/ui -name "*.tsx" -type f -exec sed -i '' 's/input-otp@[0-9.]*/input-otp/g' {} +
find components/ui -name "*.tsx" -type f -exec sed-i '' 's/react-resizable-panels@[0-9.]*/react-resizable-panels/g' {} +
find components/ui -name "*.tsx" -type f -exec sed -i '' 's/vaul@[0-9.]*/vaul/g' {} +
find components/ui -name "*.tsx" -type f -exec sed -i '' 's/next-themes@[0-9.]*/next-themes/g' {} +
find components/ui -name "*.tsx" -type f -exec sed -i '' 's/react-hook-form@[0-9.]*/react-hook-form/g' {} +

echo "All imports fixed!"
echo "Note: For Windows, use PowerShell script instead"

#!/bin/bash

# Fix all versioned imports in UI components

echo "Fixing versioned imports in UI components..."

# Fix @radix-ui imports
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-accordion@[0-9.]*/@radix-ui\/react-accordion/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-alert-dialog@[0-9.]*/@radix-ui\/react-alert-dialog/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-aspect-ratio@[0-9.]*/@radix-ui\/react-aspect-ratio/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-avatar@[0-9.]*/@radix-ui\/react-avatar/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-checkbox@[0-9.]*/@radix-ui\/react-checkbox/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-collapsible@[0-9.]*/@radix-ui\/react-collapsible/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-context-menu@[0-9.]*/@radix-ui\/react-context-menu/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-dialog@[0-9.]*/@radix-ui\/react-dialog/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-dropdown-menu@[0-9.]*/@radix-ui\/react-dropdown-menu/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-hover-card@[0-9.]*/@radix-ui\/react-hover-card/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-label@[0-9.]*/@radix-ui\/react-label/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-menubar@[0-9.]*/@radix-ui\/react-menubar/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-navigation-menu@[0-9.]*/@radix-ui\/react-navigation-menu/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-popover@[0-9.]*/@radix-ui\/react-popover/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-progress@[0-9.]*/@radix-ui\/react-progress/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-radio-group@[0-9.]*/@radix-ui\/react-radio-group/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-scroll-area@[0-9.]*/@radix-ui\/react-scroll-area/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-select@[0-9.]*/@radix-ui\/react-select/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-separator@[0-9.]*/@radix-ui\/react-separator/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-slider@[0-9.]*/@radix-ui\/react-slider/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-slot@[0-9.]*/@radix-ui\/react-slot/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-switch@[0-9.]*/@radix-ui\/react-switch/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-tabs@[0-9.]*/@radix-ui\/react-tabs/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-toggle@[0-9.]*/@radix-ui\/react-toggle/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-toggle-group@[0-9.]*/@radix-ui\/react-toggle-group/g' {} \;
find ./components/ui -name "*.tsx" -type f -exec sed -i 's/@radix-ui\/react-tooltip@[0-9.]*/@radix-ui\/react-tooltip/g' {} \;

# Fix other library imports with versions
find ./components -name "*.tsx" -type f -exec sed -i 's/lucide-react@[0-9.]*"/lucide-react"/g' {} \;
find ./components -name "*.tsx" -type f -exec sed -i 's/class-variance-authority@[0-9.]*"/class-variance-authority"/g' {} \;

echo "✅ Import fixes complete!"

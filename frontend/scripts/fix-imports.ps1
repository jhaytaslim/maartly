# PowerShell script to fix all versioned imports in the project
# This removes version numbers from package imports

Write-Host "Fixing imports in UI components..." -ForegroundColor Green

# Fix Radix UI imports
Get-ChildItem -Path "components/ui" -Filter "*.tsx" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace '@radix-ui/([^@"]*)@[0-9.]*"', '@radix-ui/$1"'
    Set-Content -Path $_.FullName -Value $content -NoNewline
}

# Fix lucide-react imports
Get-ChildItem -Path "components" -Filter "*.tsx" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'lucide-react@[0-9.]*', 'lucide-react'
    Set-Content -Path $_.FullName -Value $content -NoNewline
}

# Fix class-variance-authority imports
Get-ChildItem -Path "components/ui" -Filter "*.tsx" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'class-variance-authority@[0-9.]*', 'class-variance-authority'
    Set-Content -Path $_.FullName -Value $content -NoNewline
}

# Fix other versioned imports
$packages = @(
    'react-day-picker',
    'embla-carousel-react',
    'cmdk',
    'input-otp',
    'react-resizable-panels',
    'vaul',
    'next-themes',
    'react-hook-form',
    'sonner'
)

foreach ($package in $packages) {
    Get-ChildItem -Path "components" -Filter "*.tsx" -Recurse | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $content = $content -replace "$package@[0-9.]*", $package
        Set-Content -Path $_.FullName -Value $content -NoNewline
    }
}

Write-Host "All imports fixed!" -ForegroundColor Green

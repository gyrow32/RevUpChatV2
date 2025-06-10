# Create necessary directories if they don't exist
New-Item -ItemType Directory -Force -Path "app\components\chat"
New-Item -ItemType Directory -Force -Path "app\components\ui"
New-Item -ItemType Directory -Force -Path "app\components\layout"
New-Item -ItemType Directory -Force -Path "app\components\providers"
New-Item -ItemType Directory -Force -Path "app\lib\utils"
New-Item -ItemType Directory -Force -Path "app\lib\hooks"
New-Item -ItemType Directory -Force -Path "app\lib\api"
New-Item -ItemType Directory -Force -Path "app\lib\types"
New-Item -ItemType Directory -Force -Path "app\lib\constants"

# Move chat components
if (Test-Path "app\chat\components\Message.tsx") {
    Move-Item -Path "app\chat\components\Message.tsx" -Destination "app\components\chat\" -Force
}
if (Test-Path "app\chat\components\MessageList.tsx") {
    Move-Item -Path "app\chat\components\MessageList.tsx" -Destination "app\components\chat\" -Force
}
if (Test-Path "app\chat\components\ThinkingIndicator.tsx") {
    Move-Item -Path "app\chat\components\ThinkingIndicator.tsx" -Destination "app\components\chat\" -Force
}
if (Test-Path "app\chat\components\MessageInput.tsx") {
    Move-Item -Path "app\chat\components\MessageInput.tsx" -Destination "app\components\chat\" -Force
}
if (Test-Path "app\chat\components\ChatWindow.tsx") {
    Move-Item -Path "app\chat\components\ChatWindow.tsx" -Destination "app\components\chat\" -Force
}
if (Test-Path "app\chat\components\blocks") {
    Move-Item -Path "app\chat\components\blocks" -Destination "app\components\chat\" -Force
}

# Move lib files
if (Test-Path "lib\utils") {
    Get-ChildItem -Path "lib\utils" -Recurse | Move-Item -Destination "app\lib\utils\" -Force
}
if (Test-Path "lib\hooks") {
    Get-ChildItem -Path "lib\hooks" -Recurse | Move-Item -Destination "app\lib\hooks\" -Force
}
if (Test-Path "lib\api") {
    Get-ChildItem -Path "lib\api" -Recurse | Move-Item -Destination "app\lib\api\" -Force
}

# Move types
if (Test-Path "types") {
    Get-ChildItem -Path "types" -Recurse | Move-Item -Destination "app\lib\types\" -Force
}

# Move test files
if (Test-Path "__tests__") {
    Get-ChildItem -Path "__tests__" -Recurse | Move-Item -Destination "test\" -Force
} 
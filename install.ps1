# Script de instalación rápida para Windows PowerShell
# Sistema de Gestión Formativa - OEI El Salvador

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 Sistema de Gestión Formativa - OEI El Salvador       ║" -ForegroundColor Cyan
Write-Host "║  📦 Instalación Automática                                ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "Por favor instala Node.js 18+ desde https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📦 INSTALANDO BACKEND..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Set-Location backend

Write-Host "  → Instalando dependencias del backend..." -ForegroundColor White
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias del backend" -ForegroundColor Red
    exit 1
}

Write-Host "  → Generando Prisma Client..." -ForegroundColor White
npx prisma generate

Write-Host "  → Creando base de datos..." -ForegroundColor White
npx prisma migrate dev --name init

Write-Host "  → Poblando base de datos con datos iniciales..." -ForegroundColor White
npm run seed

Write-Host "✅ Backend configurado correctamente!" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "🎨 INSTALANDO FRONTEND..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Set-Location frontend

Write-Host "  → Instalando dependencias del frontend..." -ForegroundColor White
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias del frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend configurado correctamente!" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ INSTALACIÓN COMPLETADA EXITOSAMENTE                   ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 PARA INICIAR EL PROYECTO:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "    cd backend" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host "    → http://localhost:3001" -ForegroundColor Gray
Write-Host ""
Write-Host "  Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "    cd frontend" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host "    → http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentación: README.md" -ForegroundColor Cyan
Write-Host "🔧 Configuración: .env en cada carpeta" -ForegroundColor Cyan
Write-Host ""
Write-Host "¡Bienvenido al Sistema de Gestión Formativa OEI! 🎉" -ForegroundColor Green

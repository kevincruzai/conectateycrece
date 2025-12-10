# 🚀 Guía de Inicio Rápido - Sistema de Gestión Formativa OEI

## ⚡ Instalación en 3 Pasos

### 1. Instalar Dependencias

**Opción A: Script Automático (Recomendado)**
```powershell
.\install.ps1
```

**Opción B: Manual**
```powershell
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init

# Frontend
cd frontend
npm install
```

### 2. Iniciar Servidores

**Opción A: Script Automático**
```powershell
.\start.ps1
```

**Opción B: Manual (2 terminales)**
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3. Abrir Navegador
```
http://localhost:3000
```

## 👤 Primer Acceso

### Opción A: Usuario Admin Pre-creado (Recomendado)

Si ejecutaste el script de instalación, ya existe un usuario administrador:

```
Email: admin@oei.sv
Contraseña: admin123
```

⚠️ **IMPORTANTE**: Cambiar esta contraseña en producción

### Opción B: Crear tu Propio Usuario

1. **Registrarse**: Clic en "Regístrate aquí"
2. **Completar formulario** con tus datos
3. **Aprobar cuenta manualmente**:

```powershell
cd backend
npx prisma studio
```

En Prisma Studio:
- Abrir tabla `users`
- Editar tu usuario
- Cambiar `isActive` → `true`
- Cambiar `isApproved` → `true`
- Cambiar `role` → `"ADMIN_OEI"` (para acceso completo)

4. **Iniciar sesión** con tu email y contraseña

## 📋 Roles Disponibles

| Rol | Descripción |
|-----|-------------|
| `ADMIN_OEI` | Administrador total del sistema |
| `COORDINADOR` | Gestión de programas asignados |
| `PROVEEDOR` | Registro de asistencia y evaluaciones |
| `CONSULTA` | Solo lectura de dashboards |

## 🌐 URLs del Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: `npx prisma studio` en carpeta backend

## 📁 Estructura de Archivos

```
oieform/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Express + Prisma + TypeScript
├── install.ps1        # Script de instalación
├── start.ps1          # Script para iniciar todo
└── README.md          # Documentación completa
```

## 🛠️ Comandos Útiles

### Backend
```powershell
cd backend
npm run dev              # Iniciar servidor
npx prisma studio        # Visualizar base de datos
npx prisma migrate dev   # Crear nueva migración
npx prisma generate      # Regenerar Prisma Client
```

### Frontend
```powershell
cd frontend
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
```

## 🐛 Solución de Problemas

### Puerto 3000 o 3001 ocupado
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error de Prisma Client
```powershell
cd backend
npx prisma generate
```

### Reinstalar dependencias
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## 📚 Más Información

- Ver **README.md** para documentación completa
- Ver **Requeriments.md** para especificaciones del proyecto
- Ver **Stacktech.md** para detalles del stack tecnológico

## ✅ Checklist de Inicio

- [ ] Node.js 18+ instalado
- [ ] Dependencias instaladas (`.\install.ps1`)
- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 3000
- [ ] Cuenta de usuario creada y aprobada
- [ ] Acceso al dashboard exitoso

## 🎉 ¡Listo para usar!

El sistema está completamente funcional y listo para gestionar las empresas MIPYME+E del Proyecto ALICE LARDÉ.

**¿Preguntas?** Consulta la documentación completa en README.md

---

**OEI El Salvador** | Proyecto ALICE LARDÉ 🇸🇻

# 🚀 Sistema de Gestión Formativa - OEI El Salvador

Sistema web completo para la gestión, seguimiento y análisis del historial formativo de más de 500 empresas MIPYME+E participantes del **Proyecto ALICE LARDÉ** de OEI El Salvador.

![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Descripción

Plataforma integral que centraliza información, permite trazabilidad completa de participantes, gestión de múltiples perfiles de usuario y genera dashboards interactivos con estadísticas en tiempo real.

### ✨ Características Principales

- ✅ **Gestión de Empresas**: Registro y seguimiento de 500+ MIPYME+E
- ✅ **Programas Formativos**: Gestión completa de capacitaciones
- ✅ **Sistema de Roles**: 4 niveles diferenciados (Admin OEI, Coordinador, Proveedor, Consulta)
- ✅ **Dashboards Interactivos**: Estadísticas y métricas en tiempo real
- ✅ **Trazabilidad Completa**: Historial de intervenciones y auditoría
- ✅ **Reportería Avanzada**: Exportación en PDF, Excel y CSV
- ✅ **Real-time Updates**: Socket.IO para actualizaciones en vivo
- ✅ **Responsive Design**: Funciona perfecto en móviles, tablets y desktop

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **TypeScript 5**
- **Vite** - Build tool ultra rápido
- **Tailwind CSS** - Styling utility-first
- **React Router v6** - Routing SPA
- **Axios** - HTTP client con interceptors
- **Recharts** - Gráficas interactivas
- **Headless UI** + **Heroicons** - Componentes UI accesibles

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** - Type-safe database access
- **SQLite** (desarrollo) / **PostgreSQL** (producción)
- **JWT** - Autenticación stateless
- **Bcrypt** - Hash de contraseñas seguro
- **Socket.IO** - Real-time bidireccional
- **Helmet**, **CORS**, **Rate Limiting** - Seguridad

## 📦 Estructura del Proyecto

```
oieform/
├── frontend/               # React + TypeScript + Vite
│   ├── public/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── contexts/      # React Context (Auth)
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # API calls & services
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/               # Express + Prisma + TypeScript
│   ├── prisma/
│   │   ├── schema.prisma # Modelo de base de datos
│   │   └── dev.db        # SQLite database (desarrollo)
│   ├── src/
│   │   ├── middleware/   # Auth, error handling, validation
│   │   ├── routes/       # API endpoints
│   │   ├── utils/        # Database, helpers
│   │   └── index.ts      # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── Requeriments.md       # Especificación completa del proyecto
├── Stacktech.md          # Documentación técnica del stack
└── README.md             # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18+ y **npm** 9+
- **Git**
- (Opcional) **PostgreSQL** para producción

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd oieform
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
copy .env.example .env

# Editar .env con tus configuraciones
# Importante: Cambiar JWT_SECRET en producción

# Generar cliente de Prisma
npx prisma generate

# Crear base de datos y ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para visualizar la DB
npx prisma studio

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará corriendo en: **http://localhost:3001**

### 3. Configurar Frontend

```bash
# Abrir nueva terminal
cd frontend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
copy .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará corriendo en: **http://localhost:3000**

## 🎯 Uso del Sistema

### Acceso Inicial

1. Abrir **http://localhost:3000**
2. Hacer clic en **"Regístrate aquí"**
3. Completar formulario de registro
4. Esperar aprobación de administrador (o aprobar manualmente en la base de datos)

### Crear Primer Usuario Admin (Manual)

Opción 1: Usando Prisma Studio
```bash
cd backend
npx prisma studio
```
- Abrir tabla `users`
- Editar usuario creado
- Cambiar `role` a `"ADMIN_OEI"`
- Cambiar `isActive` a `true`
- Cambiar `isApproved` a `true`

Opción 2: Modificar directamente en SQLite
```bash
cd backend/prisma
# Usar cualquier cliente SQLite
```

### Roles del Sistema

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **ADMIN_OEI** | Administrador completo | Acceso total, gestión de usuarios, configuración |
| **COORDINADOR** | Coordinador de programas | Gestión de programas asignados, empresas, evaluaciones |
| **PROVEEDOR** | Proveedor externo | Registro de asistencia y evaluaciones de sus programas |
| **CONSULTA** | Solo lectura | Visualización de dashboards y reportes |

## 📊 Módulos del Sistema

### 1. Dashboard
- **KPIs** en tiempo real (empresas, programas, participantes, tasas)
- **Gráficas** de tendencias y distribuciones
- **Actividad reciente**

### 2. Empresas
- Listado con paginación y filtros
- Registro de nuevas empresas MIPYME+E
- Perfil de entrada y salida (nivel de digitalización)
- Historial formativo completo

### 3. Programas Formativos
- CRUD completo de programas
- Gestión de sesiones
- Asignación de instructores y proveedores
- Control de cupos y listas de espera

### 4. Inscripciones
- Registro de participantes en programas
- Estados: Inscrito, Confirmado, Completado, Abandonado
- Seguimiento de progreso individual

### 5. Asistencia
- Registro por sesión
- Estados: Presente, Ausente, Tardanza, Justificado
- Cálculo automático de porcentajes
- Alertas de baja asistencia

### 6. Evaluaciones
- Tipos: Diagnóstica, Formativa, Sumativa
- Escalas configurables
- Comparativas de rendimiento
- Identificación de participantes destacados

### 7. Reportes
- Generación de reportes personalizados
- Exportación en **PDF**, **Excel**, **CSV**
- Reportes predefinidos listos para usar
- Programación de reportes periódicos

### 8. Auditoría
- Logs completos de todas las acciones
- Trazabilidad: Quién, Qué, Cuándo
- Historial de cambios (before/after)
- Consultas por usuario, fecha, tipo de acción

## 🔐 Seguridad

- ✅ **JWT** con expiración configurable
- ✅ **Bcrypt** para hash de contraseñas
- ✅ **Helmet** - Headers de seguridad HTTP
- ✅ **CORS** configurado
- ✅ **Rate Limiting** - Protección contra ataques de fuerza bruta
- ✅ **Sanitización** de inputs
- ✅ **Protección** contra SQL Injection, XSS, CSRF
- ✅ **Roles y permisos** granulares

## 📱 Responsive Design

El sistema es completamente responsive y funciona perfecto en:
- 📱 **Móviles** (< 768px)
- 📱 **Tablets** (768px - 1024px)
- 💻 **Desktop** (> 1024px)

## 🚀 Despliegue en Producción

### Frontend (Vercel - Recomendado)

```bash
cd frontend
npm run build

# Deploy con Vercel CLI
npx vercel
```

O conectar repo de GitHub con Vercel para deploy automático.

### Backend (Railway/Render - Recomendado)

1. **Railway**:
   ```bash
   cd backend
   railway init
   railway up
   ```

2. **Render**:
   - Conectar repo de GitHub
   - Configurar variables de entorno
   - Deploy automático

### Base de Datos en Producción

**Migrar de SQLite a PostgreSQL:**

1. Crear base de datos PostgreSQL (Supabase, Railway, AWS RDS)

2. Actualizar `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. Actualizar `.env` con URL de PostgreSQL:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

4. Ejecutar migraciones:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## 🧪 Testing (Próximamente)

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
```

## 📚 Documentación Adicional

- [Requeriments.md](./Requeriments.md) - Especificación completa del proyecto
- [Stacktech.md](./Stacktech.md) - Guía completa del stack tecnológico
- [Prisma Docs](https://www.prisma.io/docs/) - Documentación de Prisma
- [React Docs](https://react.dev/) - Documentación de React

## 🐛 Troubleshooting

### Error: "Cannot find module..."
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Prisma Client not found"
```bash
cd backend
npx prisma generate
```

### Puerto 3000 o 3001 ya en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Base de datos corrupta
```bash
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
```

## 👥 Contribución

Este proyecto es para uso interno de OEI El Salvador. Para contribuir:

1. Fork del proyecto
2. Crear branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

**OEI El Salvador**
- Proyecto: Alice Lardé
- Email: contacto@oei.sv
- Website: https://www.oei.sv

---

## 🎉 Agradecimientos

Desarrollado con ❤️ para el **Proyecto ALICE LARDÉ** - OEI El Salvador

**Impulsando la transformación digital de las MIPYME+E salvadoreñas** 🇸🇻

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Producción Ready

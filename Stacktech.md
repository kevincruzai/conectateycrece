# 🚀 Stack Tecnológico Formulario OIE Captacion de Datos - Replicación para Nuevo Proyecto

## 📋 Resumen del Stack

Este documento detalla **todas las tecnologías, versiones y configuraciones** utilizadas en el proyecto Zhagra para que puedas replicarlo en tu nuevo proyecto de **formularios con dashboard**.

---

## 🎨 FRONTEND

### Core Framework
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.2.2"
}
```

**¿Por qué?**
- React 18: Concurrent features, mejor performance
- TypeScript: Type safety, mejor DX, menos bugs en producción

---

### Build Tool & Development Server

#### Vite (⚡ Recomendado sobre Create React App)
```json
{
  "vite": "^4.5.0",
  "@vitejs/plugin-react": "^4.1.0"
}
```

**Ventajas:**
- ⚡ **Ultra rápido**: Hot Module Replacement instantáneo
- 📦 **Build optimizado**: Usa Rollup para producción
- 🔧 **Zero config**: Funciona out-of-the-box
- 🌐 **Proxy incorporado**: Fácil integración con backend

**Configuración Vite** (`vite.config.ts`):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

---

### Routing

#### React Router DOM v6
```json
{
  "react-router-dom": "^6.8.1"
}
```

**Características usadas:**
- `BrowserRouter` - Routing sin hash
- `Routes` & `Route` - Declaración de rutas
- `Navigate` - Redirecciones programáticas
- `useLocation` - Acceso a ubicación actual
- `useNavigate` - Navegación programática
- `Link` - Navegación declarativa

**Patrón de Rutas Protegidas:**
```typescript
// Protected Route Component
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

### Styling

#### Tailwind CSS v3
```json
{
  "tailwindcss": "^3.3.5",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.31"
}
```

**¿Por qué Tailwind?**
- 🎨 **Utility-first**: Desarrollo más rápido
- 📦 **Tree-shaking**: CSS mínimo en producción
- 🎯 **Design system**: Consistencia visual
- 🔧 **Personalizable**: Fácil extender colores/espaciados

**Configuración** (`tailwind.config.js`):
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        green: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**PostCSS Config** (`postcss.config.js`):
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

### UI Components & Icons

#### Headless UI + Heroicons (By Tailwind Labs)
```json
{
  "@headlessui/react": "^1.7.17",
  "@heroicons/react": "^2.0.18"
}
```

**Componentes usados:**
- `Menu`, `Disclosure`, `Dialog` - Navegación y modales
- `Transition` - Animaciones accesibles
- Iconos: 24x24 outline y solid

**Ventaja:** 100% accesible (ARIA), sin estilos predefinidos, total libertad con Tailwind

---

### Data Visualization

#### Recharts
```json
{
  "recharts": "^2.15.4"
}
```

**Gráficas usadas en Zhagra:**
- `LineChart` - Tendencias de sensores en tiempo real
- `BarChart` - Comparativas de métricas
- `AreaChart` - Visualización de radiación solar
- `ResponsiveContainer` - Gráficas responsive

**Ejemplo:**
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

<LineChart data={sensorData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="timestamp" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
</LineChart>
```

---

### HTTP Client

#### Axios
```json
{
  "axios": "^1.6.0"
}
```

**Ventajas sobre fetch:**
- ✅ Interceptors (auth tokens automáticos)
- ✅ Request/response transformation
- ✅ Timeout automático
- ✅ JSON parsing automático

**Configuración típica** (`src/services/api.ts`):
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Real-Time Communication

#### Socket.IO Client
```json
{
  "socket.io-client": "^4.8.1"
}
```

**Uso en Zhagra:**
- Real-time sensor data updates
- Live chat with AI assistant
- Dashboard metrics streaming
- Multi-user collaboration

**Ejemplo:**
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

socket.on('connect', () => {
  console.log('✅ Connected to server');
});

socket.on('sensorUpdate', (data) => {
  updateSensorData(data);
});
```

---

### Utilities

#### Utility Libraries
```json
{
  "clsx": "^2.0.0",
  "date-fns": "^2.30.0"
}
```

**clsx:** Conditional CSS classes
```typescript
import clsx from 'clsx';

<div className={clsx(
  'base-class',
  isActive && 'bg-green-500',
  isDisabled && 'opacity-50'
)} />
```

**date-fns:** Date manipulation (más ligero que Moment.js)
```typescript
import { format, parseISO, differenceInDays } from 'date-fns';

format(new Date(), 'yyyy-MM-dd HH:mm');
differenceInDays(new Date(), startDate);
```

---

### TypeScript Configuration

**`tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

---

### Linting

#### ESLint Configuration
```json
{
  "eslint": "^8.53.0",
  "@typescript-eslint/eslint-plugin": "^6.10.0",
  "@typescript-eslint/parser": "^6.10.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.4"
}
```

---

## 🔧 BACKEND

### Core Framework

#### Express.js (Node.js)
```json
{
  "express": "^4.18.2",
  "typescript": "^5.2.2",
  "@types/express": "^4.17.21"
}
```

**¿Por qué Express?**
- 🚀 **Probado en producción**: Millones de apps
- 🔌 **Middleware ecosystem**: Enorme cantidad de plugins
- 📖 **Documentación extensa**: Fácil encontrar soluciones
- ⚡ **Performance**: Muy rápido para APIs REST

---

### Runtime & Development

#### TSX (TypeScript execution)
```json
{
  "tsx": "^4.20.5",
  "ts-node": "^10.9.1",
  "nodemon": "^3.0.2"
}
```

**Scripts:**
```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

**Ventaja TSX:** Más rápido que ts-node, soporte ESM nativo

---

### Database & ORM

#### Prisma ORM (⭐ Altamente Recomendado)
```json
{
  "prisma": "^5.6.0",
  "@prisma/client": "^5.6.0"
}
```

**¿Por qué Prisma sobre otros ORMs?**
- ✅ **Type-safe**: Auto-generación de tipos TypeScript
- ✅ **Migrations**: Sistema de migraciones robusto
- ✅ **Prisma Studio**: GUI visual para DB
- ✅ **Multi-DB**: SQLite, PostgreSQL, MySQL, MongoDB
- ✅ **Dev Experience**: Mejor que TypeORM o Sequelize

**Database:** SQLite (desarrollo) → PostgreSQL (producción)

**Schema Example** (`prisma/schema.prisma`):
```prisma
datasource db {
  provider = "sqlite"  // Cambiar a "postgresql" en producción
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  password  String   // Hashed con bcrypt
  role      String   @default("USER")
  isApproved Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  forms     Form[]   // Relación para tu proyecto de formularios
  
  @@map("users")
}

model Form {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      String   @default("DRAFT") // DRAFT, PUBLISHED, ARCHIVED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  questions   Question[]
  responses   Response[]
  
  @@map("forms")
}

model Question {
  id          String   @id @default(uuid())
  text        String
  type        String   // TEXT, MULTIPLE_CHOICE, CHECKBOX, SCALE
  required    Boolean  @default(false)
  order       Int
  
  formId      String
  form        Form     @relation(fields: [formId], references: [id])
  
  @@map("questions")
}

model Response {
  id          String   @id @default(uuid())
  answers     String   // JSON stringified
  submittedAt DateTime @default(now())
  
  formId      String
  form        Form     @relation(fields: [formId], references: [id])
  
  @@map("responses")
}
```

**Prisma Commands:**
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (DB GUI)
npx prisma studio

# Seed database
npx prisma db seed
```

---

### Authentication

#### JWT + Bcrypt
```json
{
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "@types/jsonwebtoken": "^9.0.5",
  "@types/bcryptjs": "^2.4.6"
}
```

**Flow de Autenticación:**
```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Register - Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// 2. Login - Compare password
const isValid = await bcrypt.compare(password, user.password);

// 3. Generate JWT token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);

// 4. Verify token (middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET!);
```

---

### Security Middleware

#### Helmet + CORS + Rate Limiting
```json
{
  "helmet": "^7.1.0",
  "cors": "^2.8.5",
  "express-rate-limit": "^7.1.5"
}
```

**Configuración de Seguridad:**
```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);
```

---

### Logging

#### Morgan
```json
{
  "morgan": "^1.10.0",
  "@types/morgan": "^1.9.9"
}
```

**Usage:**
```typescript
import morgan from 'morgan';

// Development
app.use(morgan('dev'));

// Production
app.use(morgan('combined'));
```

---

### Real-Time Communication

#### Socket.IO Server
```json
{
  "socket.io": "^4.7.4"
}
```

**Setup:**
```typescript
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('formSubmit', (data) => {
    // Broadcast to all clients
    io.emit('newResponse', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3001);
```

---

### Environment Variables

#### dotenv
```json
{
  "dotenv": "^16.3.1"
}
```

**`.env` file:**
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Frontend
FRONTEND_URL="http://localhost:3000"

# Optional: PostgreSQL (production)
# DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

**Usage:**
```typescript
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3001;
```

---

### Utilities

#### UUID
```json
{
  "uuid": "^9.0.1",
  "@types/uuid": "^9.0.7"
}
```

**Para IDs únicos:**
```typescript
import { v4 as uuidv4 } from 'uuid';

const newId = uuidv4(); // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
```

---

## 🗄️ BASE DE DATOS

### Desarrollo: SQLite

**Ventajas:**
- 📦 **Zero config**: Archivo local, no necesitas servidor
- ⚡ **Rápido**: Perfecto para desarrollo
- 🔄 **Portable**: Fácil compartir con equipo
- 💾 **Archivo único**: `dev.db` en `backend/prisma/`

**Connection:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

---

### Producción: PostgreSQL (Recomendado)

**Ventajas:**
- 🚀 **Escalable**: Millones de registros
- 🔒 **Seguro**: Row-level security, SSL
- 🌐 **Cloud-ready**: Compatible con Heroku, AWS RDS, Supabase
- 📊 **JSON support**: Queries complejos

**Migration path (SQLite → PostgreSQL):**
```bash
# 1. Cambiar en schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 2. Update .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# 3. Re-generate y migrar
npx prisma generate
npx prisma migrate dev
```

---

### Schema para Proyecto de Formularios

**Modelo sugerido:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // o "postgresql" en producción
  url      = env("DATABASE_URL")
}

// Usuario autenticado
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  username    String   @unique
  password    String   // bcrypt hashed
  fullName    String?
  role        String   @default("USER") // ADMIN, USER, VIEWER
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  forms       Form[]
  responses   Response[]
  
  @@map("users")
}

// Formulario creado
model Form {
  id          String   @id @default(uuid())
  title       String
  description String?
  category    String?
  status      String   @default("DRAFT") // DRAFT, PUBLISHED, ARCHIVED
  settings    String?  // JSON: { allowAnonymous, multipleSubmissions, etc }
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?
  
  // Owner
  createdBy   String
  creator     User     @relation(fields: [createdBy], references: [id])
  
  // Relations
  questions   Question[]
  responses   Response[]
  
  @@map("forms")
}

// Pregunta del formulario
model Question {
  id          String   @id @default(uuid())
  text        String
  description String?
  type        String   // TEXT, TEXTAREA, NUMBER, EMAIL, MULTIPLE_CHOICE, CHECKBOX, RADIO, SCALE, DATE, FILE
  required    Boolean  @default(false)
  order       Int      @default(0)
  options     String?  // JSON array para multiple choice: ["Option 1", "Option 2"]
  validation  String?  // JSON: { min, max, regex, etc }
  createdAt   DateTime @default(now())
  
  // Parent form
  formId      String
  form        Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  
  // Answers for this question
  answers     Answer[]
  
  @@map("questions")
}

// Respuesta de un usuario a un formulario
model Response {
  id          String   @id @default(uuid())
  ipAddress   String?
  userAgent   String?
  submittedAt DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Optional: User (si está logueado)
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  
  // Parent form
  formId      String
  form        Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
  
  // Individual answers
  answers     Answer[]
  
  @@map("responses")
}

// Respuesta individual a una pregunta
model Answer {
  id          String   @id @default(uuid())
  value       String   // Puede ser texto, número, JSON array para checkboxes
  createdAt   DateTime @default(now())
  
  // Parent question
  questionId  String
  question    Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  // Parent response
  responseId  String
  response    Response @relation(fields: [responseId], references: [id], onDelete: Cascade)
  
  @@map("answers")
}

// Analíticas del formulario (opcional)
model FormAnalytics {
  id              String   @id @default(uuid())
  date            DateTime @default(now())
  views           Int      @default(0)
  submissions     Int      @default(0)
  completionRate  Float    @default(0)
  avgTimeToComplete Int    @default(0) // segundos
  
  @@map("form_analytics")
}
```

---

## 📦 ESTRUCTURA DE PROYECTO RECOMENDADA

```
your-form-project/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── FormBuilder/
│   │   │   │   ├── QuestionEditor.tsx
│   │   │   │   ├── QuestionTypeSelector.tsx
│   │   │   │   └── FormPreview.tsx
│   │   │   ├── FormRenderer/
│   │   │   │   ├── FormView.tsx
│   │   │   │   └── QuestionComponents/
│   │   │   │       ├── TextInput.tsx
│   │   │   │       ├── MultipleChoice.tsx
│   │   │   │       ├── Checkbox.tsx
│   │   │   │       └── ScaleInput.tsx
│   │   │   └── Dashboard/
│   │   │       ├── StatsCard.tsx
│   │   │       └── ResponsesTable.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── FormBuilder.tsx
│   │   │   ├── FormEditor.tsx
│   │   │   ├── FormView.tsx (public)
│   │   │   ├── FormResponses.tsx
│   │   │   └── Analytics.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   └── formService.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useForms.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── dev.db (SQLite)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── formController.ts
│   │   │   ├── questionController.ts
│   │   │   └── responseController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── forms.ts
│   │   │   ├── questions.ts
│   │   │   └── responses.ts
│   │   ├── services/
│   │   │   ├── emailService.ts
│   │   │   └── analyticsService.ts
│   │   ├── utils/
│   │   │   ├── database.ts
│   │   │   └── logger.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── README.md
```

---

## 🚀 COMANDOS DE INSTALACIÓN RÁPIDA

### Frontend Setup
```bash
# Create Vite + React + TypeScript project
npm create vite@latest frontend -- --template react-ts

cd frontend

# Install core dependencies
npm install react-router-dom axios socket.io-client

# Install UI dependencies
npm install @headlessui/react @heroicons/react clsx date-fns recharts

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start dev server
npm run dev
```

### Backend Setup
```bash
mkdir backend && cd backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express cors dotenv helmet morgan express-rate-limit

# Install TypeScript + dev tools
npm install -D typescript tsx ts-node @types/node @types/express @types/cors @types/morgan

# Install Prisma
npm install -D prisma
npm install @prisma/client

# Install auth + security
npm install jsonwebtoken bcryptjs uuid
npm install -D @types/jsonwebtoken @types/bcryptjs @types/uuid

# Install Socket.IO
npm install socket.io

# Initialize Prisma
npx prisma init --datasource-provider sqlite

# Generate Prisma Client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Start dev server
npm run dev
```

---

## 🎯 PACKAGE.JSON COMPLETOS

### Frontend `package.json`
```json
{
  "name": "forms-dashboard-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "axios": "^1.6.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "recharts": "^2.15.4",
    "socket.io-client": "^4.8.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.24",
    "@types/react-dom": "^18.3.7",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
```

### Backend `package.json`
```json
{
  "name": "forms-dashboard-backend",
  "version": "1.0.0",
  "description": "Backend API for Forms Dashboard System",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "ts-node prisma/seed.ts"
  },
  "keywords": ["forms", "dashboard", "api"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@prisma/client": "^5.6.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "socket.io": "^4.7.4",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.16",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.9.0",
    "@types/uuid": "^9.0.7",
    "prisma": "^5.6.0",
    "ts-node": "^10.9.1",
    "tsx": "^4.20.5",
    "typescript": "^5.2.2"
  }
}
```

---

## 🌟 CARACTERÍSTICAS CLAVE DEL STACK

### Ventajas Generales:
1. ✅ **Full TypeScript**: Type safety en frontend y backend
2. ✅ **Desarrollo rápido**: Vite (frontend) + TSX (backend) = HMR instantáneo
3. ✅ **Zero config**: Prisma maneja migraciones automáticamente
4. ✅ **Production-ready**: Todas las librerías probadas en producción
5. ✅ **Escalable**: Fácil migrar de SQLite → PostgreSQL
6. ✅ **Real-time**: Socket.IO para actualizaciones live
7. ✅ **Seguro**: Helmet, CORS, Rate Limiting, JWT, Bcrypt
8. ✅ **Developer Experience**: Tailwind + Headless UI = desarrollo UI rápido

---

## 🔐 VARIABLES DE ENTORNO REQUERIDAS

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

**Backend `.env`:**
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-256-bit-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Frontend
FRONTEND_URL="http://localhost:3000"
CORS_ORIGINS="http://localhost:3000,http://localhost:3002"

# Email (opcional - para notificaciones)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Production: PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/formsdb"
```

---

## 📚 RECURSOS Y DOCUMENTACIÓN

### Frontend:
- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Headless UI**: https://headlessui.com/
- **Heroicons**: https://heroicons.com/
- **Recharts**: https://recharts.org/

### Backend:
- **Express**: https://expressjs.com/
- **Prisma**: https://www.prisma.io/
- **Socket.IO**: https://socket.io/
- **JWT**: https://jwt.io/

### Database:
- **SQLite**: https://www.sqlite.org/
- **PostgreSQL**: https://www.postgresql.org/

---

## 🎓 PATRONES Y MEJORES PRÁCTICAS USADOS

### Frontend:
1. **Context API** para state management global (Auth)
2. **Custom Hooks** para lógica reutilizable
3. **Protected Routes** para autenticación
4. **Axios Interceptors** para tokens automáticos
5. **Component composition** sobre prop drilling
6. **Tailwind utility classes** sobre CSS personalizado

### Backend:
1. **MVC Pattern**: Controllers, Services, Routes separados
2. **Middleware chain**: Auth → Validation → Controller
3. **Error handling centralizado**
4. **Environment-based configuration**
5. **Prisma migrations** para control de schema
6. **JWT stateless authentication**

---

## 🚀 DEPLOYMENT

### Frontend (Recomendado: Vercel)
```bash
# Build
npm run build

# Deploy to Vercel
npx vercel
```

### Backend (Recomendado: Railway / Render)
```bash
# Railway
railway init
railway up

# Or Render
# Connect GitHub repo → Auto deploy
```

### Database (Producción)
- **Supabase** (PostgreSQL managed, free tier)
- **Railway** (PostgreSQL incluido)
- **AWS RDS** (Escalable)
- **PlanetScale** (MySQL serverless)

---

## ✅ CHECKLIST DE INICIO PARA NUEVO PROYECTO

### Día 1: Setup inicial
- [ ] Crear repo en GitHub
- [ ] Setup frontend con Vite + React + TypeScript
- [ ] Instalar Tailwind CSS
- [ ] Setup backend con Express + TypeScript
- [ ] Instalar Prisma y crear schema inicial
- [ ] Configurar `.env` files

### Día 2: Autenticación
- [ ] Crear User model en Prisma
- [ ] Implementar registro (bcrypt)
- [ ] Implementar login (JWT)
- [ ] Crear AuthContext en frontend
- [ ] Protected routes con middleware

### Día 3: Core Features
- [ ] Crear modelos de Form/Question/Response
- [ ] CRUD de formularios en backend
- [ ] Form builder UI en frontend
- [ ] Form renderer (vista pública)

### Día 4: Dashboard
- [ ] Vista de respuestas
- [ ] Gráficas con Recharts
- [ ] Exportación de datos
- [ ] Real-time con Socket.IO (opcional)

### Día 5: Pulido
- [ ] Error handling completo
- [ ] Loading states
- [ ] Validaciones
- [ ] Testing básico
- [ ] Deployment

---

## 💡 TIPS ADICIONALES

1. **Usa Prisma Studio**: `npx prisma studio` para visualizar DB
2. **ESLint + Prettier**: Mantén código consistente
3. **Git Hooks**: Husky para linting pre-commit
4. **Commitizen**: Commits semánticos
5. **Storybook**: Para componentes UI (opcional)
6. **React Query**: Para cache de peticiones (opcional pero muy recomendado)

---

## 📞 SOPORTE

Este stack es **probado en producción** en el proyecto Zhagra y **altamente escalable** para un proyecto de formularios con dashboard.

**¿Dudas?** Toda la documentación oficial está linkada arriba.

**Último update:** Octubre 2025  
**Versión del documento:** 1.0  
**Autor:** Basado en el stack de Zhagra

---

¡Buena suerte con tu proyecto! 🚀🎉

# 🎨 Guía Visual de Colores y Estilos

## 🎨 Paleta de Colores del Sistema

### Colores Principales
```css
/* Primary - Azul Institucional */
primary-50:  #eff6ff   /* Fondo claro */
primary-100: #dbeafe   /* Hover suave */
primary-500: #3b82f6   /* Principal */
primary-600: #2563eb   /* Botones */
primary-700: #1d4ed8   /* Hover botones */
primary-900: #1e3a8a   /* Texto oscuro */

/* Success - Verde */
success-50:  #f0fdf4
success-500: #22c55e
success-600: #16a34a
success-700: #15803d

/* Warning - Amarillo/Naranja */
warning-50:  #fffbeb
warning-500: #f59e0b
warning-600: #d97706

/* Danger - Rojo */
danger-50:  #fef2f2
danger-500: #ef4444
danger-600: #dc2626
danger-700: #b91c1c

/* Grises */
gray-50:  #f9fafb   /* Fondo de página */
gray-100: #f3f4f6   /* Fondo cards */
gray-200: #e5e7eb   /* Bordes */
gray-500: #6b7280   /* Texto secundario */
gray-700: #374151   /* Texto principal */
gray-900: #111827   /* Títulos */
```

## 📐 Componentes Base (Tailwind)

### Botones
```tsx
// Botón Principal
<button className="btn-primary">
  Guardar
</button>

// Botón Secundario
<button className="btn-secondary">
  Cancelar
</button>

// Botón Peligro
<button className="btn-danger">
  Eliminar
</button>
```

### Cards
```tsx
<div className="card">
  {/* Contenido */}
</div>
```

### Inputs
```tsx
<input 
  className="input-field"
  type="text"
  placeholder="Ejemplo"
/>
```

### Badges
```tsx
<span className="badge badge-success">Activo</span>
<span className="badge badge-warning">Pendiente</span>
<span className="badge badge-danger">Inactivo</span>
<span className="badge badge-primary">En Proceso</span>
```

### Loading Spinner
```tsx
<div className="spinner"></div>
```

## 🎯 Estados de Roles

### Badges por Rol
```tsx
// Admin OEI
<span className="badge" style="bg-purple-100 text-purple-800">
  ADMIN OEI
</span>

// Coordinador
<span className="badge" style="bg-blue-100 text-blue-800">
  COORDINADOR
</span>

// Proveedor
<span className="badge" style="bg-green-100 text-green-800">
  PROVEEDOR
</span>

// Consulta
<span className="badge" style="bg-gray-100 text-gray-800">
  CONSULTA
</span>
```

## 📊 Estados de Programas

```tsx
// Planificado
<span className="badge badge-warning">Planificado</span>

// En Curso
<span className="badge badge-primary">En Curso</span>

// Finalizado
<span className="badge badge-success">Finalizado</span>

// Cancelado
<span className="badge badge-danger">Cancelado</span>
```

## 👥 Estados de Inscripción

```tsx
// Inscrito
<span className="badge" style="bg-blue-100 text-blue-800">
  Inscrito
</span>

// Confirmado
<span className="badge badge-success">Confirmado</span>

// Completado
<span className="badge" style="bg-green-100 text-green-800">
  Completado
</span>

// Abandonado
<span className="badge badge-danger">Abandonado</span>

// Lista de Espera
<span className="badge badge-warning">Lista de Espera</span>
```

## 📋 Estados de Asistencia

```tsx
// Presente
<span className="badge badge-success">Presente</span>

// Ausente
<span className="badge badge-danger">Ausente</span>

// Tardanza
<span className="badge badge-warning">Tardanza</span>

// Justificado
<span className="badge" style="bg-blue-100 text-blue-800">
  Justificado
</span>
```

## 🎓 Iconos (Heroicons)

### Navegación Principal
```tsx
import {
  HomeIcon,              // Dashboard
  BuildingOfficeIcon,    // Empresas
  AcademicCapIcon,       // Programas
  UserGroupIcon,         // Participantes
  ChartBarIcon,          // Reportes
  Cog6ToothIcon,         // Configuración
} from '@heroicons/react/24/outline';
```

### Acciones
```tsx
import {
  PlusIcon,              // Agregar
  PencilIcon,            // Editar
  TrashIcon,             // Eliminar
  EyeIcon,               // Ver
  ArrowDownTrayIcon,     // Descargar
  FunnelIcon,            // Filtrar
  MagnifyingGlassIcon,   // Buscar
} from '@heroicons/react/24/outline';
```

## 📱 Responsive Breakpoints

```css
/* Mobile First */
sm:  640px   /* Tablets pequeñas */
md:  768px   /* Tablets */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop grande */
2xl: 1536px  /* Desktop XL */
```

### Ejemplo de uso:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 columna en móvil, 2 en tablet, 4 en desktop */}
</div>
```

## ✨ Animaciones

### Fade In
```tsx
<div className="animate-fadeIn">
  {/* Contenido con fade in */}
</div>
```

### Transitions
```css
/* Todas las transiciones son suaves */
transition-colors duration-200
transition-all duration-200
```

## 🎯 Ejemplo de Card Completo

```tsx
<div className="card hover:shadow-lg transition-shadow duration-200">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900">
      Título de la Card
    </h3>
    <span className="badge badge-success">Activo</span>
  </div>
  
  {/* Content */}
  <p className="text-gray-600 mb-4">
    Contenido de la card con descripción...
  </p>
  
  {/* Footer */}
  <div className="flex gap-2">
    <button className="btn-primary flex-1">
      Acción Principal
    </button>
    <button className="btn-secondary">
      Cancelar
    </button>
  </div>
</div>
```

## 📊 Ejemplo de Tabla

```tsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Nombre
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Estado
        </th>
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
          Acciones
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          Empresa Ejemplo
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="badge badge-success">Activo</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button className="text-primary-600 hover:text-primary-900 mr-4">
            Editar
          </button>
          <button className="text-danger-600 hover:text-danger-900">
            Eliminar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## 🎨 Tips de Diseño

### Espaciado
- `gap-4` para separación entre elementos (16px)
- `p-6` para padding interno de cards (24px)
- `mb-8` para separación de secciones (32px)

### Bordes
- `rounded-lg` para bordes suaves (8px)
- `rounded-full` para círculos perfectos
- `border border-gray-200` para bordes sutiles

### Sombras
- `shadow-sm` para cards normales
- `shadow-lg` para modales y dropdowns
- `shadow-2xl` para elementos destacados

### Tipografía
- `text-3xl font-bold` para títulos principales
- `text-lg font-semibold` para subtítulos
- `text-sm text-gray-600` para texto secundario

---

**Mantén consistencia en todos los componentes usando estas clases** ✨

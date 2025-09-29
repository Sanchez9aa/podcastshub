# 🎧 PodcastsHub

> **Prueba Técnica Frontend INDITEX** - Nivel Tech Lead

Mini-aplicación SPA para escuchar podcasts musicales desarrollada siguiendo principios enterprise-ready y patrones de arquitectura escalables.

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#️-arquitectura)
- [Decisiones de Diseño](#-decisiones-de-diseño)
- [Estrategia de Caché](#-estrategia-de-caché)
- [Componentes UI](#️-componentes-ui)
- [Testing](#-testing)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Scripts Disponibles](#-scripts-disponibles)
- [Gestión de Releases](#-gestión-de-releases)
- [Mejoras Implementadas](#-mejoras-implementadas)

## 🚀 Stack Tecnológico

### Core Framework
- **React 19** + **TypeScript** - Framework principal con tipado estricto
- **React Router v7** - Enrutado SPA sin hash (#)
- **Vite** - Build tool moderno

### State Management
- **TanStack Query** - Server state management y caché
- **Context API** - UI state

### Calidad de Código
- **Biome** - Linter y formatter 
- **Vitest** + React Testing Library - Testing framework
- **Husky** - Pre-commit hooks

### Estilos
- **CSS desde cero**
- **CSS Modules** - Scoped styles
- **Variables CSS** - Design system consistente

## 🏗️ Arquitectura

### Clean Architecture + Feature-Based

La aplicación sigue una **Clean Architecture ligera** adaptada a React, con separación clara en 4 capas:

```
src/
├── core/                           # 🔵 DOMAIN + APPLICATION LAYER
│   ├── entities/                   # Entidades del dominio
│   │   ├── Podcast.ts
│   │   ├── Episode.ts
│   │   └── PodcastDetail.ts
│   ├── repositories/               # Interfaces (contratos)
│   │   └── PodcastRepository.ts
│   └── use-cases/                  # Casos de uso
│       ├── getPodcasts.ts
│       ├── getPodcastDetail.ts
│       └── filterPodcasts.ts
│
├── infrastructure/                 # 🟡 INFRASTRUCTURE LAYER
│   ├── api/
│   │   ├── allOriginsProxy.ts      # Proxy CORS
│   │   └── types/
│   │       └── iTunesTypes.ts      # Tipos APIs externas
│   ├── cache/
│   │   └── StoragePersister.ts     # Persistencia localStorage
│   ├── query/
│   │   ├── queryClient.ts          # TanStack Query config
│   │   └── podcastQueries.ts       # Queries reutilizables
│   └── repositories/
│       └── ApiPodcastRepository.ts # Implementación repositorio
│
├── features/                       # 🟢 PRESENTATION LAYER
│   ├── podcast-list/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── PodcastListPage.tsx
│   ├── podcast-detail/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── PodcastDetailPage.tsx
│   └── episode-detail/
│       ├── components/
│       ├── hooks/
│       └── EpisodeDetailPage.tsx
│
└── shared/                         # 🔴 SHARED LAYER
    ├── components/
    │   ├── ui/                     # Componentes base
    │   └── layout/                 # Layout components
    ├── context/
    │   └── UIContext.tsx           # Context API (UI state)
    ├── constants/
    │   ├── api.ts                  # URLs y configuración
    │   └── pagination.ts
    ├── hooks/
    │   └── useNavigationLoading.ts
    └── utils/
        ├── formatDate.ts
        ├── formatDuration.ts
        └── sanitizeHtml.ts
```

### 🎯 Principios Arquitectónicos Aplicados

#### 1. **Imports Absolutos Obligatorios**
#### 2. **Separación Estricta de Tipos**
#### 3. **Dependency Inversion**
```typescript
// Core define contratos
export interface PodcastRepository {
  getPodcasts(): Promise<Podcast[]>;
}

// Infrastructure implementa
export const apiPodcastRepository: PodcastRepository = {
  getPodcasts: async () => { /* implementation */ }
};
```

## 🧠 Decisiones de Diseño

### 1. **¿Por qué Clean Architecture?**

**Decisión**: Implementar Clean Architecture ligera adaptada a React

**Justificación**:
- ✅ **Escalabilidad**: Agregar nuevas features sin afectar existentes
- ✅ **Testabilidad**: Lógica de negocio desacoplada de React
- ✅ **Mantenibilidad**: Separación clara de responsabilidades
- ✅ **Enterprise-ready**: Preparado para equipos grandes

**Alternativas consideradas**:
- ❌ **Estructura plana**: No escala para equipos tech lead
- ❌ **Feature folders simples**: Mezcla responsabilidades
- ❌ **Hex Architecture completa**: Over-engineering para 3 vistas

### 2. **¿Por qué TanStack Query + Context API?**

**Decisión**: TanStack Query para server state, Context API para UI state

**Justificación**:
- ✅ **Context API**: Requisito obligatorio de la prueba
- ✅ **TanStack Query**: Mejor herramienta para server state y caché
- ✅ **Separation of Concerns**: Cada herramienta para su propósito específico
- ✅ **Optimistic Updates**: TanStack Query maneja estados complejos

**Alternativas consideradas**:
- ❌ **Solo Context API**: No optimizado para server state
- ❌ **Zustand/Redux**: Prohibido explícitamente por requisitos

### 3. **¿Por qué Biome sobre ESLint?**

**Decisión**: Biome como linter y formatter único

**Justificación**:
- ✅ **Performance**: 20x más rápido que ESLint + Prettier
- ✅ **Configuración mínima**: Cero configuración por defecto
- ✅ **Consistencia**: Un solo tool para lint y format
- ✅ **TypeScript nativo**: Mejor soporte que ESLint

### 4. **¿Por qué CSS desde cero?**

**Decisión**: CSS Modules + Variables CSS, sin librerías UI

**Justificación**:
- ✅ **Requisito obligatorio**: Demostrar dominio de CSS
- ✅ **Control total**: Customización completa del diseño
- ✅ **Performance**: Sin overhead de librerías externas
- ✅ **Design System**: Variables CSS para consistencia

**Componentes creados**:
- `Card` - Podcast cards con hover effects
- `Spinner` - Loading indicators (3 tamaños)
- `Badge` - Contadores con variants
- `Skeleton` - Loading placeholders
- `Button` - Botones base con estados
- `Input` - Campos de formulario

## 💾 Estrategia de Caché

### Implementación Técnica

**Tecnología**: TanStack Query + localStorage persister + DOMPurify

**Configuración**:
```typescript
export const CACHE_CONFIG = {
  TTL_24_HOURS: 24 * 60 * 60 * 1000, // 24h exactas
  MAX_RETRIES: 3,
  EPISODES_LIMIT: 20,
} as const;

// QueryClient configuration
staleTime: CACHE_CONFIG.TTL_24_HOURS,    // Cuándo es "stale"
gcTime: CACHE_CONFIG.TTL_24_HOURS,       // Cuándo se limpia
maxAge: CACHE_CONFIG.TTL_24_HOURS,       // Persistencia localStorage
```

### Flujo de Caché

1. **Primera carga**: Fetch desde iTunes API → Guardar en localStorage
2. **Cargas posteriores**:
   - Si < 24h → Servir desde caché (sin request)
   - Si > 24h → Fetch nuevo + actualizar caché
3. **Validación**: TanStack Query maneja automáticamente la expiración
4. **Persistencia**: Sobrevive a reloads y cierre del navegador

### Beneficios Conseguidos

- ✅ **UX mejorada**: Carga instantánea en visitas repetidas
- ✅ **Bandwidth savings**: Reduce requests a iTunes API
- ✅ **Offline-first**: Funciona sin conexión (caché válido)
- ✅ **Battery saving**: Menos requests = menos consumo
- ✅ **Cumplimiento requisitos**: 24h exactas como especifica PDF

### Estrategia de Invalidación

```typescript
// Invalidación manual si necesaria
queryClient.invalidateQueries({ queryKey: ['podcasts'] });

// Auto-invalidación por tiempo
// TanStack Query maneja automáticamente con staleTime
```

## 🎨 Componentes UI

### Sistema de Design

**Variables CSS implementadas**:

```css
/* Colors - Primary System */
--bg-primary: #fafafa;        /* Background principal */
--bg-secondary: #ffffff;      /* Cards y contenedores */
--text-primary: #1a1a1a;      /* Texto principal */
--text-secondary: #666666;    /* Texto secundario */

/* Accent Colors */
--accent-primary: #007aff;    /* Links y botones primarios */
--accent-hover: #0056cc;      /* Hover states */

/* Status Colors */
--error-bg: #fef2f2;         /* Error backgrounds */
--error-text: #dc2626;       /* Error text */
--warning-bg: #fef3cd;       /* Warning backgrounds */
--success-bg: #ecfdf5;       /* Success backgrounds */

/* Spacing System */
--spacing-xs: 0.25rem;       /* 4px */
--spacing-sm: 0.5rem;        /* 8px */
--spacing-md: 1rem;          /* 16px */
--spacing-lg: 1.5rem;        /* 24px */
--spacing-xl: 2rem;          /* 32px */

/* Border Radius */
--radius-sm: 4px;            /* Pequeño */
--radius-md: 8px;            /* Medio */
--radius-lg: 12px;           /* Grande */
--radius-xl: 16px;           /* Extra grande */

/* Shadows */
--shadow-light: rgba(0, 0, 0, 0.1);   /* Sombra suave */
--shadow-medium: rgba(0, 0, 0, 0.15);  /* Sombra media */
--shadow-focus: rgba(0, 122, 255, 0.1); /* Focus states */
```

### Responsive Design

**Breakpoints definidos**:
```css
--breakpoint-sm: 640px;   /* Mobile large */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop small */
--breakpoint-xl: 1280px;  /* Desktop large */
```

**Grid adaptativo**:
- Desktop (1024px+): 4 columnas
- Tablet (768px-1023px): 2-3 columnas
- Mobile (< 768px): 1-2 columnas
- Mobile small (< 480px): 1 columna

## 📦 Instalación y Ejecución

### Requisitos Previos

- **Node.js** 18.0.0 o superior
- **npm** 8.0.0 o superior

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/Sanchez9aa/podcastshub.git
cd podcastshub

# Instalar dependencias
npm install
```

### Modo Desarrollo

```bash
# Servidor de desarrollo (assets sin minimizar)
npm run dev

# Abrir en navegador
# http://localhost:5173
```

**Características modo dev**:
- ✅ Hot Module Replacement (HMR)
- ✅ Assets sin minimizar pero concatenados
- ✅ Source maps habilitados
- ✅ Linting en tiempo real

### Modo Producción

```bash
# Build de producción (assets concatenados y minimizados)
npm run build

# Previsualizar build
npm run preview
```

**Características modo prod**:
- ✅ Assets concatenados y minimizados
- ✅ Tree shaking automático
- ✅ Code splitting por rutas
- ✅ Optimización de imágenes

## 📜 Scripts Disponibles

```json
{
  "dev": "vite",                    // Servidor desarrollo
  "build": "tsc && vite build",     // Build producción
  "preview": "vite preview",        // Preview build
  "lint": "biome check src/",       // Verificar linting
  "lint:fix": "biome check --write src/", // Auto-fix linting
  "format": "biome format --write src/",   // Formatear código
  "test": "vitest",                 // Run tests
  "test:ui": "vitest --ui",         // Tests con UI
  "test:coverage": "vitest --coverage" // Coverage report
}
```

## 🧪 Testing

### Framework de Testing

- **Vitest** - Test runner moderno y rápido
- **React Testing Library** - Testing utilities para React
- **jsdom** - DOM environment para tests
- **@testing-library/jest-dom** - Matchers personalizados

### Cobertura de Tests

```bash
# Ejecutar todos los tests
npm run test

# Tests con interfaz visual
npm run test:ui

# Reporte de cobertura
npm run test:coverage
```

### Estadísticas Actuales

- ✅ **427 tests pasando** al 100%
- ✅ **39 archivos de test** cubriendo toda la aplicación
- ✅ **Tests unitarios** y de **integración**

### Estructura de Tests

```
src/
├── **/__tests__/         # Tests unitarios
├── **/*.test.tsx         # Component tests
└── test/
    ├── setup.ts          # Configuración global
    ├── fixtures/         # Datos de prueba
    └── utils/            # Utilidades para testing
```

### Tipos de Tests Implementados

1. **Unit Tests**: Lógica de negocio y utilidades
2. **Component Tests**: Renderizado y comportamiento UI
3. **Integration Tests**: Flujos completos de usuario
4. **Hook Tests**: Custom hooks y state management
5. **API Tests**: Mocking y data fetching

## 🚀 Gestión de Releases

Este proyecto utiliza semantic-release para versionado automático. Los releases se generan automáticamente en CI/CD cuando los commits siguen el formato conventional commits.

## 🚀 Mejoras Implementadas

### Funcionalidades Core ✅

| Requisito | Estado | Implementación |
|-----------|--------|----------------|
| 3 vistas SPA | ✅ | React Router sin hash |
| URLs limpias | ✅ | BrowserRouter configurado |
| Caché 24h | ✅ | TanStack Query + localStorage |
| Filtrado inmediato | ✅ | Reacciona a cada keystroke |
| Loading indicator | ✅ | Esquina superior derecha |
| HTML interpretado | ✅ | DOMPurify + dangerouslySetInnerHTML |
| Reproductor nativo | ✅ | `<audio controls>` HTML5 |
| Componentes from scratch | ✅ | CSS puro sin librerías |
| Context API | ✅ | UI state management |
| Proxy CORS | ✅ | allorigins.win configurado |

### Calidad Tech Lead ✅

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| README explicativo | ✅ | Arquitectura y decisiones justificadas |
| Código SOLID | ✅ | Clean Architecture + DI |
| Biome 0 errores | ✅ | Linter limpio |
| Separación en capas | ✅ | 4 capas bien definidas |
| Consola limpia | ✅ | Solo console.error controlados |
| CSS responsive | ✅ | Mobile-first + variables |
| Git estándar | ✅ | Commits convencionales |
| Tests funcionando | ✅ | Vitest + RTL |
| Solución modular | ✅ | Feature-based + componentes |
| Custom hooks | ✅ | usePodcastList, useNavigationLoading |
| TypeScript completo | ✅ | Tipado estricto, cero any's |

### Mejoras Opcionales Implementadas 🎯

| Mejora | Estado | Beneficio |
|--------|--------|-----------|
| Variables CSS | ✅ | Design system consistente |
| Responsive design | ✅ | UX en todos los dispositivos |
| Error boundaries | ✅ | Mejor UX en errores |
| Skeleton loading | ✅ | Perceived performance |
| Infinite scroll | ✅ | UX para listas largas |
| Sanitización HTML | ✅ | Seguridad XSS |
| Performance optimizations | ✅ | useMemo, lazy loading |

## 🎯 Cumplimiento de Requisitos

### Criterios BCNC (20 puntos) ✅

1. ✅ **README explicativo** - Tecnologías, arquitectura, decisiones justificadas
2. ✅ **Código SOLID** - Clean Architecture + principios aplicados
3. ✅ **Biome 0 errores** - Linter completamente limpio
4. ✅ **Separación en capas** - Core/Infrastructure/Features/Shared
5. ✅ **Consola limpia** - Solo console.error controlados
6. ✅ **CSS desde cero** - Sin librerías, responsive design
7. ✅ **Git estándar** - Commits convencionales, tags
8. ✅ **Tests pasando** - Unit + integration tests
9. ✅ **Solución modular** - Componentes reutilizables
10. ✅ **Webpack/Vite** - Vite configurado dev/prod
11. ✅ **Custom hooks** - Lógica reutilizable
12. ✅ **TypeScript completo** - Tipado estricto

### Requisitos INDITEX ✅

- ✅ **SPA 3 vistas** - Lista, detalle podcast, detalle episodio
- ✅ **URLs sin hash** - React Router BrowserRouter
- ✅ **Caché 24h exactas** - TanStack Query + validación temporal
- ✅ **Filtrado inmediato** - Título + artista, cada keystroke
- ✅ **Loading esquina superior derecha** - Context API + UI
- ✅ **HTML interpretado** - Sanitizado con DOMPurify
- ✅ **Enlaces sidebar** - Imagen, título, autor clickables
- ✅ **Reproductor HTML5** - `<audio controls>` nativo
- ✅ **Proxy allorigins** - CORS handling
- ✅ **Componentes from scratch** - CSS puro, sin librerías

---
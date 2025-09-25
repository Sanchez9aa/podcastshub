# PodcastsHub

Mini-aplicación SPA para escuchar podcasts musicales.

## Stack Tecnológico

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Biome** (linter + formatter)
- **Vitest** + React Testing Library
- **Husky** (pre-commit hooks)

## Arquitectura

Clean Architecture con estructura feature-based:
- `src/core/` - Lógica de negocio
- `src/infrastructure/` - APIs y servicios externos
- `src/features/` - Componentes UI por funcionalidad
- `src/shared/` - Componentes y utilidades reutilizables

## Desarrollo

```bash
npm install
npm run dev
npm run build
npm run test
npm run lint
```

### Entorno de Desarrollo

**Windows**: Se recomienda usar Git Bash o WSL para los pre-commit hooks de Husky.

## Calidad de Código

- Pre-commit hooks configurados con Husky
- Linting y formatting automático con Biome
- Testing con Vitest
- Versionado automático con Semantic Release

---

**En desarrollo** 🚧
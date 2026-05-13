# QuizzArenaUI: Frontend Engineering Standards

**Proyecto:** QuizzArenaUI  
**Propósito:** Reglas, metodologías y estándares obligatorios para el código del cliente web.

---

## 1. Arquitectura Estructural

### A. Paradigma: Feature-Driven Architecture
El código se agrupa por dominio de negocio, no por tipo técnico. No debe existir una carpeta global tipo `/components` que agrupe elementos sin relación. Cada "Feature" encapsula sus propios componentes visuales, servicios API y gestión de estado.

**Estructura de Carpetas Sugerida:**
```text
src/
│
├── 📁 app/                    Ruteo global y configuración (App Module/Standalone)
│
├── 📁 shared/                 Design System y utilidades transversales
│   ├── 📁 ui/                 Componentes puros y genéricos
│   ├── 📁 styles/             Configuración de Tailwind y variables CSS globales
│   └── 📁 interceptors/       HttpInterceptors (Auth, RFC 7807 Error Handling)
│
├── 📁 core/                   Servicios Singleton (AuthService, SignalRService)
│
├── 📁 features/               Código agrupado por dominio
│   ├── 📁 LiveArena/
│   │   ├── 📁 components/     Leaderboard, AnswerButtons
│   │   ├── 📁 services/       Lógica de SignalR específica de la partida
│   │   └── 📁 store/          Signals para el estado del juego
│   │
│   ├── 📁 Assessment/
│   │   ├── 📁 components/     DraftQuestionEditor
│   │   └── 📁 services/       Llamadas REST a la API de preguntas
│   │
│   └── 📁 AIKnowledge/        Subida de videos y monitoreo de jobs
│
└── 📁 pages/                  Componentes enrutables (Smart Components)
    ├── InstructorDashboardPage
    ├── MatchLobbyPage
    └── StudentPinEntryPage
```

---

## 2. Metodología de Diseño Visual

### A. Atomic Design (en la carpeta `shared/ui`)
Para los componentes reutilizables, adoptamos la filosofía de Atomic Design:
*   **Átomos:** Botones base, inputs, iconos.
*   **Moléculas:** Campos de formulario con labels, barras de búsqueda.
*   **Organismos:** Modales globales, barras de navegación.

### B. Tailwind CSS
*   Se utilizarán las clases de utilidad de Tailwind CSS directamente en los templates HTML.
*   Para componentes muy complejos o donde el HTML se vuelva ilegible, se permite la abstracción en clases CSS mediante directivas como `@apply` dentro de la capa `@layer components`.

---

## 3. Calidad de Código

### A. CI/CD y Despliegue
*   El código se subirá a la rama `develop` mediante Pull Requests.
*   GitHub Actions verificará el linting y los tests antes de permitir el merge.
*   La rama `main` disparará automáticamente un despliegue hacia **Vercel**.

### B. Formateo y Linting
*   **Prettier:** Configurado para formatear automáticamente al guardar (con un `.prettierrc` en la raíz).
*   **ESLint / Angular ESLint:** Reglas estrictas para evitar variables `any` o inyecciones riesgosas.

### C. Testing
*   **Jest o Vitest:** Preferido sobre Karma/Jasmine por velocidad de ejecución y simplicidad de entorno.
*   En el MVP, la cobertura debe priorizarse en los Smart Components y servicios de conexión a la API.

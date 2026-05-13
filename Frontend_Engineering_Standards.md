# QuizzArenaUI: Frontend Engineering Standards

**Proyecto:** QuizzArenaUI  
**PropÃ³sito:** Reglas, metodologÃ­as y estÃ¡ndares obligatorios para el cÃ³digo del cliente web.

---

## 1. Arquitectura Estructural

### A. Paradigma: Feature-Driven Architecture
El cÃ³digo se agrupa por dominio de negocio, no por tipo tÃ©cnico. No debe existir una carpeta global tipo `/components` que agrupe elementos sin relaciÃ³n. Cada "Feature" encapsula sus propios componentes visuales, servicios API y gestiÃ³n de estado.

**Estructura de Carpetas Sugerida:**
```text
src/
â”‚
â”œâ”€â”€ ðŸ“ app/                    Ruteo global y configuraciÃ³n (App Module/Standalone)
â”‚
â”œâ”€â”€ ðŸ“ shared/                 Design System y utilidades transversales
â”‚   â”œâ”€â”€ ðŸ“ ui/                 Componentes puros y genÃ©ricos
â”‚   â”œâ”€â”€ ðŸ“ styles/             ConfiguraciÃ³n de Tailwind y variables CSS globales
â”‚   â””â”€â”€ ðŸ“ interceptors/       HttpInterceptors (Auth, RFC 7807 Error Handling)
â”‚
â”œâ”€â”€ ðŸ“ core/                   Servicios Singleton (AuthService, SignalRService)
â”‚
â”œâ”€â”€ ðŸ“ features/               CÃ³digo agrupado por dominio
â”‚   â”œâ”€â”€ ðŸ“ LiveArena/
â”‚   â”‚   â”œâ”€â”€ ðŸ“ components/     Leaderboard, AnswerButtons
â”‚   â”‚   â”œâ”€â”€ ðŸ“ services/       LÃ³gica de SignalR especÃ­fica de la partida
â”‚   â”‚   â””â”€â”€ ðŸ“ store/          Signals para el estado del juego
â”‚   â”‚
â”‚   â”œâ”€â”€ ðŸ“ Assessment/
â”‚   â”‚   â”œâ”€â”€ ðŸ“ components/     DraftQuestionEditor
â”‚   â”‚   â””â”€â”€ ðŸ“ services/       Llamadas REST a la API de preguntas
â”‚   â”‚
â”‚   â””â”€â”€ ðŸ“ AIKnowledge/        Subida de videos y monitoreo de jobs
â”‚
â””â”€â”€ ðŸ“ pages/                  Componentes enrutables (Smart Components)
    â”œâ”€â”€ InstructorDashboardPage
    â”œâ”€â”€ MatchLobbyPage
    â””â”€â”€ StudentMatchEntryPage
```

---

## 2. MetodologÃ­a de DiseÃ±o Visual

### A. Atomic Design (en la carpeta `shared/ui`)
Para los componentes reutilizables, adoptamos la filosofÃ­a de Atomic Design:
*   **Ãtomos:** Botones base, inputs, iconos.
*   **MolÃ©culas:** Campos de formulario con labels, barras de bÃºsqueda.
*   **Organismos:** Modales globales, barras de navegaciÃ³n.

### B. Tailwind CSS
*   Se utilizarÃ¡n las clases de utilidad de Tailwind CSS directamente en los templates HTML.
*   Para componentes muy complejos o donde el HTML se vuelva ilegible, se permite la abstracciÃ³n en clases CSS mediante directivas como `@apply` dentro de la capa `@layer components`.

---

## 3. Calidad de CÃ³digo

### A. CI/CD y Despliegue
*   El cÃ³digo se subirÃ¡ a la rama `develop` mediante Pull Requests.
*   GitHub Actions verificarÃ¡ el linting y los tests antes de permitir el merge.
*   La rama `main` dispararÃ¡ automÃ¡ticamente un despliegue hacia **Vercel**.

### B. Formateo y Linting
*   **Prettier:** Configurado para formatear automÃ¡ticamente al guardar (con un `.prettierrc` en la raÃ­z).
*   **ESLint / Angular ESLint:** Reglas estrictas para evitar variables `any` o inyecciones riesgosas.

### C. Testing
*   **Jest o Vitest:** Preferido sobre Karma/Jasmine por velocidad de ejecuciÃ³n y simplicidad de entorno.
*   En el MVP, la cobertura debe priorizarse en los Smart Components y servicios de conexiÃ³n a la API.


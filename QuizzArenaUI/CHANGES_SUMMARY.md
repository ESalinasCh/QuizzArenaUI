# Resumen de Cambios

## Contexto

El proyecto es una app Angular 21 para QuizArena, con autenticacion usando Keycloak mediante `angular-oauth2-oidc`.

El objetivo inicial fue analizar como se manejaba el access token y luego construir el flujo inicial para usuarios con rol `student`, usando mocks mientras la API real esta lista.

## Autenticacion y Roles

Se reviso el flujo de Keycloak y se encontro que `getIdentityClaims()` devuelve los claims del ID token, pero no trae roles.

Los roles vienen en el access token dentro de:

```json
realm_access.roles
```

Por eso se actualizo `AuthService` para:

- Usar `getIdentityClaims()` para datos del usuario.
- Usar `getAccessToken()` para leer roles.
- Decodificar el access token.
- Guardar los roles en `currentUser.roles`.
- Definir una ruta por defecto segun rol:
  - `student` -> `/student/quizzes`
  - `teacher` -> `/teacher/dashboard`
  - sin rol -> `/login`

Archivos principales:

- `src/app/core/services/auth.service.ts`
- `src/app/core/models/user.model.ts`

## Guards

Se separaron responsabilidades entre guards.

`authGuard` ahora solo valida si el usuario esta autenticado.

```txt
authGuard = verifica sesion
```

`roleGuard` valida si el usuario tiene el rol requerido por la ruta.

```txt
roleGuard = verifica permisos por rol
```

Esto evita mezclar autenticacion con autorizacion.

Archivos principales:

- `src/app/core/guards/auth.guard.ts`
- `src/app/core/guards/role.guard.ts`

## Rutas por Rol

Se separaron las rutas principales para `student` y `teacher`.

```txt
/student
/teacher
```

Las rutas usan lazy loading.

```ts
data: { roles: ['student'] }
data: { roles: ['teacher'] }
```

Tambien se agrego una pantalla de redireccion por rol para cuando el usuario entra a `/`.

Archivo principal:

- `src/app/app.routes.ts`
- `src/app/core/pages/role-redirect-page/role-redirect-page.ts`

## Estructura por Features

Se organizo el trabajo siguiendo una estructura limpia para Angular:

```txt
src/app/
  core/
    guards/
    interceptors/
    models/
    pages/
    services/

  features/
    auth/
    student/
    teacher/

  shared/
    atoms/
    molecules/
    organisms/
    templates/
```

La regla usada fue:

- `core`: auth, guards, interceptors y logica global.
- `features/student`: flujo especifico del estudiante.
- `features/teacher`: base para pantallas del profesor.
- `shared`: componentes realmente reutilizables.

## Dashboard Student

Se implemento la pantalla principal para estudiantes en:

```txt
/student/quizzes
```

Incluye:

- Saludo al usuario.
- Input para pegar enlace de quiz.
- Boton `Ir al quiz`.
- Lista de quizzes disponibles.
- Lista de quizzes recientes.
- Soporte para light theme y dark theme.
- Diseno mobile-first siguiendo las imagenes de referencia.

Componentes creados:

- `quiz-access-form`
- `available-quiz-card`
- `recent-quiz-card`
- `student-section-title`

Archivos principales:

- `src/app/features/student/pages/quiz-list-page/`
- `src/app/features/student/components/`

## Mocks con Forma de API

Se creo un servicio mock para simular la API futura.

```txt
StudentQuizService
```

Expone datos para:

- Dashboard del estudiante.
- Detalle inicial del quiz.
- Preguntas y opciones.

Importante: las preguntas no incluyen respuesta correcta, porque se espera que otro endpoint entregue esos valores.

Archivos principales:

- `src/app/features/student/services/student-quiz.service.ts`
- `src/app/features/student/mocks/student-quiz.mock.ts`
- `src/app/features/student/models/student-quiz.model.ts`

## Pantalla de Inicio del Quiz

Se implemento la pantalla que aparece despues de presionar `Empezar` en un quiz disponible.

Ruta:

```txt
/student/quizzes/:quizId/start
```

Incluye:

- Boton volver.
- Icono central.
- Titulo del quiz.
- Subtitulo.
- Cantidad de preguntas.
- Profesor.
- Limite de tiempo.
- Boton `Comenzar`.

Esta ruta usa modo inmersivo, ocultando sidebar y navbar para parecerse a una app mobile.

Archivo principal:

- `src/app/features/student/pages/quiz-session-page/`

## Pantalla de Preguntas

Se implemento la pantalla de preguntas siguiendo los screenshots de referencia.

Ruta:

```txt
/student/quizzes/:quizId/questions
```

Incluye:

- Header morado con `Pregunta 1 de 5`.
- Barra de progreso.
- Card con la pregunta.
- Opciones A, B, C, D.
- Seleccion visual de una opcion.
- Boton `Confirmar respuesta`.
- Avance a la siguiente pregunta.
- Redireccion a resultados al terminar.

Archivo principal:

- `src/app/features/student/pages/quiz-question-page/`

## Layout Inmersivo

Se ajusto `MainLayout` para soportar rutas inmersivas.

Las rutas con:

```ts
data: { immersive: true }
```

ocultan:

- Sidebar.
- Navbar.
- Padding normal del layout.

Esto se usa para:

- `/student/quizzes/:quizId/start`
- `/student/quizzes/:quizId/questions`

Archivos principales:

- `src/app/shared/templates/main-layout/main-layout.ts`
- `src/app/shared/templates/main-layout/main-layout.html`

## Iconos

Se agregaron iconos necesarios al sistema existente:

- `link`
- `arrow-right`
- `arrow-left`
- `play`
- `clock`
- `check`
- `warning`

Archivo:

- `src/app/shared/atoms/icon/icons.constants.ts`

## Teacher Base

Se creo una estructura base para teacher:

```txt
/teacher/dashboard
/teacher/quizzes
```

Esto permite que el login por rol ya pueda redirigir correctamente a usuarios `teacher`.

Archivos principales:

- `src/app/features/teacher/teacher.routes.ts`
- `src/app/features/teacher/pages/`

## Verificaciones

Se ejecuto:

```txt
npm.cmd run lint
npm.cmd run build
```

Ambos comandos pasaron correctamente despues de los cambios.

## Resumen del Flujo Actual

```txt
Usuario entra a la app
  -> Keycloak valida sesion
  -> AuthService lee ID token y access token
  -> Roles salen de realm_access.roles
  -> authGuard valida sesion
  -> roleGuard valida student/teacher
  -> student entra a /student/quizzes
  -> Empezar abre /student/quizzes/:quizId/start
  -> Comenzar abre /student/quizzes/:quizId/questions
  -> Confirmar avanza preguntas
  -> Al final va a resultados
```

## Estado Actual

El flujo student esta implementado con mocks, mobile-first, dark/light theme y estructura preparada para conectar API real reemplazando internamente el servicio.

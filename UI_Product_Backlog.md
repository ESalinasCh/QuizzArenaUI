# Scrum Product Backlog: QuizzArenaUI (Frontend)

**Proyecto:** QuizzArenaUI  
**Clasificación:** Gestión de Producto / Metodología Ágil  

Este documento desglosa el alcance funcional del MVP en Épicas e Historias de Usuario exclusivas del cliente **Frontend (Angular)**, enfocándose en la interacción, el diseño y el consumo de la API.

---

## Epic 0: Infraestructura y Habilitadores

### EN-0.1: Andamiaje de la Aplicación Angular
*   **Descripción:** Generar el proyecto base de Angular 17+ y configurar la estructura Feature-Driven.
*   **Definition of Done:** Proyecto creado, enrutador base configurado y Tailwind CSS instalado.

### EN-0.2: Sistema de Diseño y Mockups (UI/UX)
*   **Descripción:** Diseñar en Figma (o similar) los mockups de alta fidelidad para las pantallas críticas y trasladarlos a componentes "Átomo" usando Tailwind.
*   **Definition of Done:** Botones, inputs, tarjetas y paleta de colores implementados en `shared/ui`.

### EN-0.3: Pipeline de Despliegue en Vercel
*   **Descripción:** Conectar el repositorio de GitHub con Vercel para despliegues automáticos (CI/CD).

---

## Epic 1: Identidad y Seguridad (Identity Context)

### US-1.1: Flujo de Inicio de Sesión de Instructores
*   **Criterios de Aceptación:**
    *   Pantalla de Login con un botón "Ingresar con Proveedor de Identidad".
    *   Al hacer clic, redirigir al portal del IdP.
    *   A la vuelta, capturar el JWT, guardarlo de forma segura e inyectarlo en las peticiones subsecuentes mediante un HttpInterceptor.
    *   Redirigir al InstructorDashboardPage si es exitoso.

### US-1.2: Formulario de Ingreso de Estudiantes
*   **Criterios de Aceptación:**
    *   Pantalla pública donde se pide "PIN de Sala" (input numérico) y "Apodo".
    *   Validación de campos obligatorios en el cliente.
    *   Si la API rechaza el PIN o Apodo, mostrar un toast de error.
    *   Si es exitoso, redirigir al MatchLobbyPage.

---

## Epic 2: Gestión de Contenido (Assessment Context)

### US-2.1: Interfaz de Curación de Preguntas
*   **Criterios de Aceptación:**
    *   Lista de "Borradores de IA" pendientes de revisión.
    *   Formulario reactivo donde el profesor pueda editar el texto de la pregunta, editar o agregar distractores y marcar la opción correcta.
    *   Validación visual (borde rojo y mensaje) si no se marca una respuesta correcta o si hay menos de un distractor.

### US-2.2: Selección de Preguntas para Partida
*   **Criterios de Aceptación:**
    *   Vista con tabla/lista de preguntas aprobadas.
    *   Checkboxes para seleccionar. Un contador fijo en pantalla indica cuántas se han seleccionado.
    *   Botón "Crear Partida" desactivado hasta seleccionar un mínimo de 5.

---

## Epic 3: Asistente de IA (AIKnowledge Context)

### US-3.1: Interfaz de Subida de Archivos
*   **Criterios de Aceptación:**
    *   Zona de Drag-and-Drop y botón de selección de archivos.
    *   Indicador de progreso de subida (simulado o real según respuesta HTTP).

### US-3.2: Monitoreo de Jobs de Transcripción
*   **Criterios de Aceptación:**
    *   Lista de Jobs con estado visual (Ej. Spinner para `Processing`, Check verde para `Completed`).
    *   Suscripción a evento SignalR `TranscriptJobCompletedEvent` para actualizar el icono a verde sin que el usuario recargue la página.

---

## Epic 4: Motor de Gamificación en Vivo (LiveArena Context)

### US-4.1: Sala de Espera (Lobby)
*   **Criterios de Aceptación:**
    *   Vista del Profesor: Muestra el PIN en texto muy grande y tarjetas con los apodos de los alumnos que van entrando.
    *   Vista del Estudiante: Muestra un spinner "Esperando a que el profesor inicie".

### US-4.2: Lanzamiento de Pregunta (Sincronización Visual)
*   **Criterios de Aceptación:**
    *   Al recibir el evento de SignalR, la vista cambia instantáneamente mostrando la pregunta y opciones.
    *   Barra de progreso descendente conectada a un intervalo local (con fines cosméticos, no autoritativos).

### US-4.3: Interacción de Respuesta
*   **Criterios de Aceptación:**
    *   El alumno toca un botón de opción.
    *   Efecto visual (botón oscurecido/seleccionado) y bloqueo inmediato del resto de opciones para evitar doble submit.

### US-4.4: Visualización del Leaderboard
*   **Criterios de Aceptación:**
    *   Vista animada para el profesor mostrando la barra de posiciones ordenadas.
    *   Animación fluida si alguien sube o baja de posición.
    *   Los alumnos ven un popup "¡Respuesta Correcta!" o "Incorrecto" con su puntaje obtenido en la ronda.

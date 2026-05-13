# Scrum Product Backlog: QuizzArenaUI (Frontend)
**Proyecto:** QuizzArenaUI  
**ClasificaciÃ³n:** GestiÃ³n de Producto / MetodologÃ­a Ãgil  
Este documento desglosa el alcance funcional del MVP en Ã‰picas e Historias de Usuario exclusivas del cliente **Frontend (Angular)**, enfocÃ¡ndose en la interacciÃ³n, el diseÃ±o y el consumo de la API.
---
## Epic 0: Infraestructura y Habilitadores
### EN-0.1: Andamiaje de la AplicaciÃ³n Angular
*   **DescripciÃ³n:** Generar el proyecto base de Angular 17+ y configurar la estructura Feature-Driven.
*   **Definition of Done:** Proyecto creado, enrutador base configurado y Tailwind CSS instalado.
### EN-0.2: Sistema de DiseÃ±o y Mockups (UI/UX)
*   **DescripciÃ³n:** DiseÃ±ar en Figma (o similar) los mockups de alta fidelidad para las pantallas crÃ­ticas y trasladarlos a componentes "Ãtomo" usando Tailwind.
*   **Definition of Done:** Botones, inputs, tarjetas y paleta de colores implementados en `shared/ui`.
### EN-0.3: Pipeline de Despliegue en Vercel
*   **DescripciÃ³n:** Conectar el repositorio de GitHub con Vercel para despliegues automÃ¡ticos (CI/CD).
---
## Epic 1: Identidad y Seguridad (Identity Context)
### US-1.1: Flujo de Inicio de SesiÃ³n de Instructores
*   **Criterios de AceptaciÃ³n:**
    *   Pantalla de Login con un botÃ³n "Ingresar con Proveedor de Identidad".
    *   Al hacer clic, redirigir al portal del IdP.
    *   A la vuelta, capturar el JWT, guardarlo de forma segura e inyectarlo en las peticiones subsecuentes mediante un HttpInterceptor.
    *   Redirigir al InstructorDashboardPage si es exitoso.
### US-1.2: Ingreso de Estudiantes a Partida
*   **Criterios de AceptaciÃ³n:**
    *   Pantalla pÃºblica donde se pide "PIN de Sala" (input numÃ©rico) y "Apodo".
    *   ValidaciÃ³n de campos obligatorios en el cliente.
    *   
    *   Si es exitoso, redirigir al MatchLobbyPage.
---
## Epic 2: GestiÃ³n de Contenido (Assessment Context)
### US-2.1: Interfaz de CuraciÃ³n de Preguntas
*   **Criterios de AceptaciÃ³n:**
    *   Lista de "Borradores de IA" pendientes de revisiÃ³n.
    *   Formulario reactivo donde el profesor pueda editar el texto de la pregunta, editar o agregar distractores y marcar la opciÃ³n correcta.
    *   ValidaciÃ³n visual (borde rojo y mensaje) si no se marca una respuesta correcta o si hay menos de un distractor.
### US-2.2: SelecciÃ³n de Preguntas para Partida
*   **Criterios de AceptaciÃ³n:**
    *   Vista con tabla/lista de preguntas aprobadas.
    *   Checkboxes para seleccionar. Un contador fijo en pantalla indica cuÃ¡ntas se han seleccionado.
    *   BotÃ³n "Crear Partida" desactivado hasta seleccionar un mÃ­nimo de 5.
---
## Epic 3: Asistente de IA (AIKnowledge Context)
### US-3.1: Interfaz de Subida de Archivos
*   **Criterios de AceptaciÃ³n:**
    *   Zona de Drag-and-Drop y botÃ³n de selecciÃ³n de archivos.
    *   Indicador de progreso de subida (simulado o real segÃºn respuesta HTTP).
### US-3.2: Monitoreo de Jobs de TranscripciÃ³n
*   **Criterios de AceptaciÃ³n:**
    *   Lista de Jobs con estado visual (Ej. Spinner para `Processing`, Check verde para `Completed`).
    *   SuscripciÃ³n a evento SignalR `TranscriptJobCompletedEvent` para actualizar el icono a verde sin que el usuario recargue la pÃ¡gina.
---
## Epic 4: Motor de GamificaciÃ³n en Vivo (LiveArena Context)
### US-4.1: Sala de Espera (Lobby)
*   **Criterios de AceptaciÃ³n:**
    *   Vista del Profesor: Muestra el nombre de la clase y tarjetas con los nombres de los alumnos que van entrando.
    *   Vista del Estudiante: Muestra un spinner "Esperando a que el profesor inicie".
### US-4.2: Lanzamiento de Pregunta (SincronizaciÃ³n Visual)
*   **Criterios de AceptaciÃ³n:**
    *   Al recibir el evento de SignalR, la vista cambia instantÃ¡neamente mostrando la pregunta y opciones.
    *   Barra de progreso descendente conectada a un intervalo local (con fines cosmÃ©ticos, no autoritativos).
### US-4.3: InteracciÃ³n de Respuesta
*   **Criterios de AceptaciÃ³n:**
    *   El alumno toca un botÃ³n de opciÃ³n.
    *   Efecto visual (botÃ³n oscurecido/seleccionado) y bloqueo inmediato del resto de opciones para evitar doble submit.
### US-4.4: VisualizaciÃ³n del Leaderboard
*   **Criterios de AceptaciÃ³n:**
    *   Vista animada para el profesor mostrando la barra de posiciones ordenadas.
    *   AnimaciÃ³n fluida si alguien sube o baja de posiciÃ³n.
    *   Los alumnos ven un popup "Â¡Respuesta Correcta!" o "Incorrecto" con su puntaje obtenido en la ronda.


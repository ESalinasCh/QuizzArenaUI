# Technical Design Document (TDD): Frontend

**Proyecto:** QuizzArenaUI  
**Autor:** Ingeniería / Frontend  
**Estado:** Draft  
**Fecha:** Mayo 2026  

---

## 1. Contexto y Alcance

QuizzArenaUI es la aplicación cliente para la plataforma educativa de trivia competitiva. Este documento define la arquitectura técnica del frontend, asegurando una experiencia interactiva, fluida y síncrona para instructores y estudiantes.

## 2. Decisiones Técnicas Clave

### 2.1 Stack Tecnológico Principal
- **Framework:** Angular 17+ (aprovechando Signals para reactividad fina).
- **Estilos:** Tailwind CSS. Sustituye a Vanilla CSS para acelerar el desarrollo mediante utilidades, manteniendo la capacidad de crear abstracciones vía `@apply` si es necesario.
- **Comunicación en Tiempo Real:** `@microsoft/signalr` para WebSockets.
- **Llamadas API:** `HttpClient` nativo de Angular.
- **Despliegue y Hosting:** Vercel (Configurado para CI/CD automático desde la rama `main`).

### 2.2 Patrones de Manejo de Estado
- Para el estado global complejo (ej. Leaderboard y sesión de juego activa), se utilizará un servicio inyectado que exponga un estado reactivo basado en **Angular Signals**.
- No se implementarán librerías pesadas tipo NgRx en el MVP para evitar over-engineering.

### 2.3 Manejo de Errores Globales
- Implementación de un `HttpInterceptor` que capture las respuestas fallidas del backend (RFC 7807 Problem Details).
- Los errores se traducirán en alertas visuales amigables para el usuario (toasts/snackbars).

---

## 3. Integración con el Backend

El frontend consumirá APIs REST para la gestión de datos (Assessments, Login) y se conectará al Hub de SignalR para el ciclo de vida del juego (LiveArena). La interfaz nunca calculará tiempos ni latencias; siempre esperará la orden y los timestamps del servidor.

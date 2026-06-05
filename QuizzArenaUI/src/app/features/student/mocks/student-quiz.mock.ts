import { StudentQuizDashboard, StudentQuizStart } from '../models/student-quiz.model';

export const STUDENT_QUIZ_DASHBOARD_MOCK: StudentQuizDashboard = {
  availableQuizzes: [
    {
      id: 'project-1-review',
      title: 'Repaso Clase Project I',
      questionCount: 8,
      status: 'available',
    },
    {
      id: 'project-1-week-1',
      title: 'Clase Project I - Semana 1',
      questionCount: 8,
      status: 'new',
    },
  ],
  recentQuizzes: [
    {
      id: 'project-1-week-7',
      title: 'Clase Project I - Semana 7',
      score: 80,
      completedAtLabel: 'hace 2 dias',
      status: 'passed',
    },
    {
      id: 'project-1-week-6',
      title: 'Clase Project I - Semana 6',
      score: 60,
      completedAtLabel: 'hace 5 dias',
      status: 'warning',
    },
  ],
};

export const STUDENT_QUIZ_START_MOCKS: Record<string, StudentQuizStart> = {
  'project-1-review': {
    id: 'project-1-review',
    title: 'Quiz Semana 3',
    subtitle: 'Domain-Driven Design',
    professorName: 'Prof. Estiven',
    questionCount: 5,
    timeLimitSeconds: 12,
    questions: [
      {
        id: 'q1',
        statement: '¿Cuál es el propósito de un Aggregate Root en DDD?',
        options: [
          { id: 'q1-a', label: 'Controlar la consistencia de un cluster de entidades' },
          { id: 'q1-b', label: 'Controlar la consistencia de un cluster de entidades' },
          { id: 'q1-c', label: 'Controlar la consistencia de un cluster de entidades' },
          { id: 'q1-d', label: 'Controlar la consistencia de un cluster de entidades' },
        ],
      },
      {
        id: 'q2',
        statement: 'Para que sirve un agregado?',
        options: [
          { id: 'q2-a', label: 'Agrupar reglas e invariantes del dominio' },
          { id: 'q2-b', label: 'Reemplazar todos los servicios' },
          { id: 'q2-c', label: 'Crear estilos visuales' },
          { id: 'q2-d', label: 'Guardar variables de entorno' },
        ],
      },
      {
        id: 'q3',
        statement: 'Que es un bounded context?',
        options: [
          { id: 'q3-a', label: 'Un limite donde un modelo tiene significado claro' },
          { id: 'q3-b', label: 'Una clase abstracta' },
          { id: 'q3-c', label: 'Un archivo de rutas' },
          { id: 'q3-d', label: 'Un tipo de base de datos' },
        ],
      },
      {
        id: 'q4',
        statement: 'Que describe el ubiquitous language?',
        options: [
          { id: 'q4-a', label: 'El lenguaje compartido entre negocio y equipo tecnico' },
          { id: 'q4-b', label: 'El idioma del navegador' },
          { id: 'q4-c', label: 'Un framework de frontend' },
          { id: 'q4-d', label: 'Una libreria de testing' },
        ],
      },
      {
        id: 'q5',
        statement: 'Donde deberian vivir las reglas principales del negocio?',
        options: [
          { id: 'q5-a', label: 'En el modelo de dominio' },
          { id: 'q5-b', label: 'En los estilos CSS' },
          { id: 'q5-c', label: 'En el archivo index.html' },
          { id: 'q5-d', label: 'En el token JWT' },
        ],
      },
    ],
  },
  'project-1-week-1': {
    id: 'project-1-week-1',
    title: 'Quiz Semana 1',
    subtitle: 'Arquitectura Limpia',
    professorName: 'Prof. Estiven',
    questionCount: 8,
    timeLimitSeconds: 15,
    questions: [
      {
        id: 'q1',
        statement: 'Que capa contiene las reglas de negocio principales?',
        options: [
          { id: 'q1-a', label: 'Dominio' },
          { id: 'q1-b', label: 'Presentacion' },
          { id: 'q1-c', label: 'Infraestructura' },
          { id: 'q1-d', label: 'Estilos' },
        ],
      },
    ],
  },
};

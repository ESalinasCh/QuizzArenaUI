import {
  AvailableMatchResponse,
  CreatePlayResponse,
  MatchAttemptDetailResponse,
  MatchAttemptSummaryResponse,
  SubmitMatchAttemptResponse,
} from '../api/student-quiz.contract';

export const STUDENT_AVAILABLE_MATCHES_RESPONSE_MOCK: AvailableMatchResponse[] = [
  {
    id: 'project-1-review',
    title: 'Repaso Clase Project I',
    courseName: 'Domain-Driven Design',
    createdAt: '2026-06-11',
    questionCount: 5,
    professorName: 'Prof. Estiven',
    duration: 12,
  },
  {
    id: 'project-1-week-1',
    title: 'Clase Project I - Semana 1',
    courseName: 'Arquitectura Limpia',
    createdAt: '2026-06-03',
    questionCount: 5,
    professorName: 'Prof. Estiven',
    duration: 12,
  },
];

export const STUDENT_MATCH_ATTEMPTS_RESPONSE_MOCK: MatchAttemptSummaryResponse[] = [
  {
    id: 'attempt-project-1-week-7',
    title: 'Clase Project I - Semana 7',
    courseName: 'Domain-Driven Design I',
    completedAt: '2026-06-08',
    score: 80,
    status: 'passed',
    duration: 10,
  },
  {
    id: 'attempt-project-1-week-6',
    title: 'Clase Project I - Semana 6',
    courseName: 'Domain-Driven Design II',
    completedAt: '2026-06-05',
    score: 60,
    status: 'failed',
    duration: 12,
  },
];

export const STUDENT_PLAY_RESPONSE_MOCKS: Record<string, CreatePlayResponse> = {
  'project-1-review': {
    matchId: 'project-1-review',
    matchAttemptId: 'attempt-project-1-review',
    questions: [
      {
        id: 'q1',
        statement: 'Cual es el proposito de un Aggregate Root en DDD?',
        options: [
          { id: 'q1-a', label: 'Controlar la consistencia de un cluster de entidades' },
          { id: 'q1-b', label: 'Servir como base de datos principal' },
          { id: 'q1-c', label: 'Definir las rutas de la API' },
          { id: 'q1-d', label: 'Gestionar la autenticacion de usuarios' },
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
          { id: 'q3-b', label: 'Un tipo de base de datos' },
          { id: 'q3-c', label: 'Un framework de testing' },
          { id: 'q3-d', label: 'Un patron de diseno visual' },
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
    matchId: 'project-1-week-1',
    matchAttemptId: 'attempt-project-1-week-1',
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

export const STUDENT_MATCH_ATTEMPT_DETAIL_RESPONSE_MOCKS: Record<string, MatchAttemptDetailResponse> = {
  'attempt-project-1-week-7': {
    id: 'attempt-project-1-week-7',
    score: 80,
    status: 'passed',
    questions: [
      {
        questionId: 'q1',
        content: 'Cual es el proposito de un Aggregate Root en DDD?',
        selectedOptionId: 'q1-a',
        isCorrect: true,
        options: [
          { id: 'q1-a', description: 'Controlar la consistencia de un cluster de entidades', isCorrect: true },
          { id: 'q1-b', description: 'Servir como base de datos principal', isCorrect: false },
          { id: 'q1-c', description: 'Definir las rutas de la API', isCorrect: false },
          { id: 'q1-d', description: 'Gestionar la autenticacion de usuarios', isCorrect: false },
        ],
      },
      {
        questionId: 'q2',
        content: 'Para que sirve un agregado?',
        selectedOptionId: 'q2-a',
        isCorrect: true,
        options: [
          { id: 'q2-a', description: 'Agrupar reglas e invariantes del dominio', isCorrect: true },
          { id: 'q2-b', description: 'Reemplazar todos los servicios', isCorrect: false },
          { id: 'q2-c', description: 'Crear estilos visuales', isCorrect: false },
          { id: 'q2-d', description: 'Guardar variables de entorno', isCorrect: false },
        ],
      },
      {
        questionId: 'q3',
        content: 'Que es un bounded context?',
        selectedOptionId: 'q3-a',
        isCorrect: true,
        options: [
          { id: 'q3-a', description: 'Un limite donde un modelo tiene significado claro', isCorrect: true },
          { id: 'q3-b', description: 'Un tipo de base de datos', isCorrect: false },
          { id: 'q3-c', description: 'Un framework de testing', isCorrect: false },
          { id: 'q3-d', description: 'Un patron de diseno visual', isCorrect: false },
        ],
      },
      {
        questionId: 'q4',
        content: 'Que describe el ubiquitous language?',
        selectedOptionId: 'q4-a',
        isCorrect: true,
        options: [
          { id: 'q4-a', description: 'El lenguaje compartido entre negocio y equipo tecnico', isCorrect: true },
          { id: 'q4-b', description: 'El idioma del navegador', isCorrect: false },
          { id: 'q4-c', description: 'Un framework de frontend', isCorrect: false },
          { id: 'q4-d', description: 'Una libreria de testing', isCorrect: false },
        ],
      },
      {
        questionId: 'q5',
        content: 'Donde deberian vivir las reglas principales del negocio?',
        selectedOptionId: 'q5-b',
        isCorrect: false,
        options: [
          { id: 'q5-a', description: 'En el modelo de dominio', isCorrect: true },
          { id: 'q5-b', description: 'En los estilos CSS', isCorrect: false },
          { id: 'q5-c', description: 'En el archivo index.html', isCorrect: false },
          { id: 'q5-d', description: 'En el token JWT', isCorrect: false },
        ],
      },
    ],
  },
  'attempt-project-1-week-6': {
    id: 'attempt-project-1-week-6',
    score: 60,
    status: 'failed',
    questions: [
      {
        questionId: 'q1',
        content: 'Que es un bounded context?',
        selectedOptionId: 'q1-b',
        isCorrect: false,
        options: [
          { id: 'q1-a', description: 'Un limite donde un modelo tiene significado claro', isCorrect: true },
          { id: 'q1-b', description: 'Un tipo de base de datos', isCorrect: false },
          { id: 'q1-c', description: 'Un framework de testing', isCorrect: false },
          { id: 'q1-d', description: 'Un patron de diseno visual', isCorrect: false },
        ],
      },
    ],
  },
};

export const STUDENT_SUBMIT_MATCH_ATTEMPT_RESPONSE_MOCKS: Record<string, SubmitMatchAttemptResponse> = {
  'attempt-project-1-review': {
    attemptId: 'attempt-project-1-review',
    scorePercentage: 80,
    correctCount: 4,
    incorrectCount: 1,
    totalQuestions: 5,
    message: 'Muy bien, Maria!',
    questions: [
      {
        id: 'q1',
        number: 1,
        text: 'Cual es el proposito de un Aggregate Root en DDD?',
        selectedOptionId: 'q1-a',
        correctOptionId: 'q1-a',
        isCorrect: true,
      },
      {
        id: 'q2',
        number: 2,
        text: 'Para que sirve un agregado?',
        selectedOptionId: 'q2-a',
        correctOptionId: 'q2-a',
        isCorrect: true,
      },
      {
        id: 'q3',
        number: 3,
        text: 'Que es un bounded context?',
        selectedOptionId: 'q3-a',
        correctOptionId: 'q3-a',
        isCorrect: true,
      },
      {
        id: 'q4',
        number: 4,
        text: 'Que describe el ubiquitous language?',
        selectedOptionId: 'q4-a',
        correctOptionId: 'q4-a',
        isCorrect: true,
      },
      {
        id: 'q5',
        number: 5,
        text: 'Donde deberian vivir las reglas principales del negocio?',
        selectedOptionId: 'q5-b',
        correctOptionId: 'q5-a',
        isCorrect: false,
      },
    ],
  },
  'attempt-project-1-week-1': {
    attemptId: 'attempt-project-1-week-1',
    scorePercentage: 100,
    correctCount: 1,
    incorrectCount: 0,
    totalQuestions: 1,
    message: 'Excelente trabajo!',
    questions: [
      {
        id: 'q1',
        number: 1,
        text: 'Que capa contiene las reglas de negocio principales?',
        selectedOptionId: 'q1-a',
        correctOptionId: 'q1-a',
        isCorrect: true,
      },
    ],
  },
};

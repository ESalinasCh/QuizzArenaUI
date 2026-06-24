import { ClassSourceResponse, ExamResponse, QuestionResponse } from '../api/teacher-exam.contract';

export const TEACHER_CLASSES_RESPONSE_MOCK: ClassSourceResponse[] = [
  { id: 'source-ddd-1', name: 'DDD - Semana 1' },
  { id: 'source-ddd-2', name: 'DDD - Semana 2' },
  { id: 'source-hex-1', name: 'Hexagonal - Semana 1' },
];

export const TEACHER_QUESTIONS_RESPONSE_MOCK: QuestionResponse[] = [
  {
    id: 'q1',
    text: '¿Qué es un Bounded Context?',
    options: [
      'Una separación lógica del dominio con su propio lenguaje ubicuo',
      'Un módulo de base de datos independiente',
      'Un microservicio independiente',
      'Una capa de infraestructura',
    ],
    sourceId: 'source-ddd-1',
    sourceName: 'DDD - Semana 1',
  },
  {
    id: 'q2',
    text: 'Diferencia entre Entity y Value Object',
    options: [
      'Entity tiene identidad propia, Value Object se define por sus atributos',
      'Value Object tiene ID, Entity no',
      'Son lo mismo en DDD',
      'Entity es inmutable, Value Object no',
    ],
    sourceId: 'source-ddd-1',
    sourceName: 'DDD - Semana 1',
  },
  {
    id: 'q3',
    text: '¿Qué es un Aggregate Root?',
    options: [
      'La entidad raíz que controla el acceso al agregado',
      'El repositorio principal del dominio',
      'El primer módulo del sistema',
      'Un Value Object compuesto',
    ],
    sourceId: 'source-ddd-1',
    sourceName: 'DDD - Semana 1',
  },
  {
    id: 'q4',
    text: '¿Cuál es la diferencia entre un dominio y un subdominio?',
    options: [
      'El dominio es el área del negocio; el subdominio es una parte especializada dentro de él',
      'Son sinónimos en DDD',
      'El subdominio es siempre técnico, el dominio siempre de negocio',
      'Un dominio contiene solo un subdominio',
    ],
    sourceId: 'source-ddd-1',
    sourceName: 'DDD - Semana 1',
  },
  {
    id: 'q5',
    text: '¿Qué es un Domain Event?',
    options: [
      'Un hecho ocurrido en el dominio que puede interesar a otras partes del sistema',
      'Un error lanzado por el dominio',
      'Un comando que modifica el estado del dominio',
      'Una consulta de solo lectura al dominio',
    ],
    sourceId: 'source-ddd-2',
    sourceName: 'DDD - Semana 2',
  },
  {
    id: 'q6',
    text: '¿Para qué sirve un Repository en DDD?',
    options: [
      'Provee acceso a aggregates sin exponer la capa de persistencia',
      'Almacena configuración de la aplicación',
      'Gestiona la conexión HTTP al backend',
      'Define los casos de uso del dominio',
    ],
    sourceId: 'source-ddd-2',
    sourceName: 'DDD - Semana 2',
  },
  {
    id: 'q7',
    text: '¿Qué es una arquitectura hexagonal?',
    options: [
      'Una arquitectura que aísla el dominio de detalles técnicos mediante puertos y adaptadores',
      'Una arquitectura con seis capas de servicios',
      'Un patrón de microservicios con seis nodos',
      'Una variante de la arquitectura en capas con seis niveles',
    ],
    sourceId: 'source-hex-1',
    sourceName: 'Hexagonal - Semana 1',
  },
  {
    id: 'q8',
    text: '¿Cuál es la diferencia entre un puerto y un adaptador?',
    options: [
      'El puerto es la interfaz definida por el dominio; el adaptador es su implementación concreta',
      'El adaptador es interno al dominio; el puerto es externo',
      'Son equivalentes y se usan indistintamente',
      'El puerto gestiona la base de datos; el adaptador gestiona la UI',
    ],
    sourceId: 'source-hex-1',
    sourceName: 'Hexagonal - Semana 1',
  },
];

export function buildCreateExamResponseMock(
  title: string,
  description: string,
  questionIds: string[],
): ExamResponse {
  return {
    id: `exam-${Date.now()}`,
    title,
    description,
    status: 'draft',
    questionIds,
    createdAt: new Date().toISOString(),
  };
}

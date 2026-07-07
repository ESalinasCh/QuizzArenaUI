import { Question } from "../../../core/models/Question";

export const QUESTIONS_RESPONSE_MOCK: Question[] = [
    {
        id: 'q-001',
        content: '¿Cuál de los siguientes componentes de Angular se utiliza para gestionar la navegación entre diferentes vistas?',
        justification: 'El RouterModule provee las directivas y servicios necesarios para enrutar la aplicación mediante URLs.',
        status: 'Verified',
        type: 'MultipleChoice',
        processingJobId: 'job-9981',
        createdAt: new Date('2026-07-01T10:00:00Z'),
        updatedAt: new Date('2026-07-01T10:15:00Z')
    },
    {
        id: 'q-002',
        content: 'En el ciclo de vida de un componente de Angular, ¿qué método se ejecuta inmediatamente después de que se inicializan las propiedades de datos vinculadas por @Input?',
        justification: 'ngOnInit se ejecuta una única vez tras el primer ngOnChanges, siendo el lugar ideal para inicializar la lógica del componente.',
        status: 'Draft',
        type: 'MultipleChoice',
        processingJobId: 'job-9982',
        createdAt: new Date('2026-07-02T11:00:00Z'),
        updatedAt: new Date('2026-07-02T11:00:00Z')
    },
    {
        id: 'q-003',
        content: '¿Qué decorador se utiliza en Angular para definir que una clase funcionará como un servicio inyectable a través del sistema de Inyección de Dependencias?',
        justification: 'El decorador @Injectable() le indica al compilador de Angular que la clase puede ser utilizada con el Injector del framework.',
        status: 'Verified',
        type: 'MultipleChoice',
        processingJobId: 'job-9983',
        createdAt: new Date('2026-07-03T09:30:00Z'),
        updatedAt: new Date('2026-07-03T09:45:00Z')
    },
    {
        id: 'q-004',
        content: '¿Qué decorador se utiliza en Angular para definir que una clase funcionará como un servicio inyectable a través del sistema de Inyección de Dependencias?',
        justification: 'El decorador @Injectable() le indica al compilador de Angular que la clase puede ser utilizada con el Injector del framework.',
        status: 'Disapproved',
        type: 'MultipleChoice',
        processingJobId: 'job-9983',
        createdAt: new Date('2026-07-03T09:30:00Z'),
        updatedAt: new Date('2026-07-03T09:45:00Z')
    },
]
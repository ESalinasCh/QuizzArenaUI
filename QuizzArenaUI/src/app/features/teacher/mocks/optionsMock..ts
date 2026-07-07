import { Option } from "../../../core/models/Options";

export const OPTIONS_MOCK: Option[] = [
    {
        description: 'RouterModule',
        isCorrect: true,
        position: 1,
        questionId: 'q-001',
    },
    {
        description: 'HttpClientModule',
        isCorrect: false,
        position: 2,
        questionId: 'q-001',
    },
    {
        description: 'ReactiveFormsModule',
        isCorrect: false,
        position: 3,
        questionId: 'q-001',
    },
    {
        description: 'BrowserModule',
        isCorrect: false,
        position: 4,
        questionId: 'q-001',
    },

    {
        description: 'ngAfterViewInit',
        isCorrect: false,
        position: 1,
        questionId: 'q-002',
    },
    {
        description: 'ngOnInit',
        isCorrect: true,
        position: 2,
        questionId: 'q-002',
    },
    {
        description: 'ngOnDestroy',
        isCorrect: false,
        position: 3,
        questionId: 'q-002',
    },
    {
        description: 'ngDoCheck',
        isCorrect: false,
        position: 4,
        questionId: 'q-002',
    },
    {
        description: '@Component',
        isCorrect: false,
        position: 1,
        questionId: 'q-003',
    },
    {
        description: '@Directive',
        isCorrect: false,
        position: 2,
        questionId: 'q-003',
    },
    {
        description: '@Pipe',
        isCorrect: false,
        position: 3,
        questionId: 'q-003',
    },
    {
        description: '@Injectable()',
        isCorrect: true,
        position: 4,
        questionId: 'q-003',
    },

    {
        description: '@Injectable()',
        isCorrect: true,
        position: 1,
        questionId: 'q-004',
    },
    {
        description: '@InjectAttribute',
        isCorrect: false,
        position: 2,
        questionId: 'q-004',
    },
    {
        description: '@NgModule',
        isCorrect: false,
        position: 3,
        questionId: 'q-004',
    },
    {
        description: '@Input',
        isCorrect: false,
        position: 4,
        questionId: 'q-004',
    }
]
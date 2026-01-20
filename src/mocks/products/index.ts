import config from '@src/config';
import { API_ROUTES } from '@src/consts';
import { http, HttpResponse } from 'msw';

let mockProjects = [
  {
    id: 'd6f9910d-a33d-43d7-aa8e-9b6fc16b6e98',
    name: 'Автоматизация процессов (msw)',
    description: 'Разработка системы для автоматизации бизнес-процессов',
    color: '#ea4b3a',
    isActive: true,
    isCompleted: false,
    tasks: [
      {
        id: '786ca1dc-395c-4ce6-8820-e1815b7b8c5b',
        name: 'Анализ процессов',
        description: 'Изучение текущих бизнес-процессов',
        priority: null,
        date: null,
        status: 'IN_WORK',
        projectId: 'd6f9910d-a33d-43d7-aa8e-9b6fc16b6e98',
        isDeleted: false,
      },
      {
        id: '16e9d543-9e31-4b1a-ac65-83f3123cfb84',
        name: 'Разработка API',
        description: 'Создание API для интеграции систем',
        priority: null,
        date: null,
        status: 'FULFILLED',
        projectId: 'd6f9910d-a33d-43d7-aa8e-9b6fc16b6e98',
        isDeleted: false,
      },
    ],
    isFavorite: false,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Разработка мобильного приложения',
    description: 'Создание кроссплатформенного мобильного приложения',
    color: '#4287f5',
    isActive: true,
    isCompleted: true,
    tasks: [],
    isFavorite: false,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    name: 'Дизайн система',
    description: 'Создание единой дизайн системы для всех продуктов',
    color: '#34c759',
    isActive: true,
    isCompleted: false,
    tasks: [],
    isFavorite: false,
  },
];

export const projectHandlers = [
  http.get(`${config.api.baseUrl}/${API_ROUTES.PROJECTS}`, ({ request }) => {
    const url = new URL(request.url);

    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);
    const search = url.searchParams.get('search') || '';
    const isCompletedParam = url.searchParams.get('isCompleted');
    const isCompleted = isCompletedParam ? isCompletedParam === 'true' : undefined;

    let filtered = [...mockProjects];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(searchLower) || project.description.toLowerCase().includes(searchLower)
      );
    }

    if (isCompleted !== undefined) {
      filtered = filtered.filter(project => project.isCompleted === isCompleted);
    }

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const data = filtered.slice(startIndex, endIndex);
    const total = filtered.length;
    const totalPages = Math.ceil(total / size);

    return HttpResponse.json({ data, page, totalPages, total });
  }),

  http.get(`${config.api.baseUrl}/${API_ROUTES.PROJECTS}/:id`, ({ params }) => {
    const { id } = params;
    const project = mockProjects.find(p => p.id === id);
    if (!project) return HttpResponse.json({ message: 'Проект не найден' }, { status: 404 });

    return HttpResponse.json({ data: project });
  }),

  http.post(`${config.api.baseUrl}/${API_ROUTES.PROJECTS}`, async ({ request }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = (await request.json()) as any;

    const newProject = {
      id: `mock-id-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      color: body.color || '#4287f5',
      isActive: true,
      isCompleted: false,
      tasks: [],
      isFavorite: body.isFavorite ?? false,
    };

    mockProjects.push(newProject);
    return HttpResponse.json({ data: newProject }, { status: 201 });
  }),

  http.put(`${config.api.baseUrl}/${API_ROUTES.PROJECTS}/:id`, async ({ params, request }) => {
    const { id } = params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = (await request.json()) as any;

    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return HttpResponse.json({ message: 'Проект не найден' }, { status: 404 });

    const updatedProject = {
      ...mockProjects[index],
      ...body,
      updatedAt: new Date().toISOString(),
      id: mockProjects[index].id,
    };

    mockProjects[index] = updatedProject;
    return HttpResponse.json({ data: updatedProject });
  }),

  http.delete(`${config.api.baseUrl}/${API_ROUTES.PROJECTS}/:id`, ({ params }) => {
    const { id } = params;
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return HttpResponse.json({ message: 'Проект не найден' }, { status: 404 });

    mockProjects = mockProjects.filter(x => x.id !== id);
    return HttpResponse.json({ message: 'Проект успешно удален' }, { status: 200 });
  }),

  http.patch(`${config.api.baseUrl}/${API_ROUTES.PROJECTS}/:id/favorite`, ({ params }) => {
    const { id } = params;
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return HttpResponse.json({ message: 'Проект не найден' }, { status: 404 });

    const updatedProject = {
      ...mockProjects[index],
      isFavorite: !mockProjects[index].isFavorite,
      updatedAt: new Date().toISOString(),
    };

    mockProjects[index] = updatedProject;
    return HttpResponse.json({ data: updatedProject });
  }),

  http.post(`${config.api.baseUrl}/${API_ROUTES.PROJECTS}/:id/complete`, () => {
    return HttpResponse.json({ message: 'Не реализовано' }, { status: 501 });
  }),
];

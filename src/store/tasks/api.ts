import { createApi } from '@reduxjs/toolkit/query/react';
import type { ItemResponse, ItemsResponse, QueryParams, Task, TaskStatus } from '@src/types';
import { projectApi } from '../projects/api';
import { axiosBaseQueryAuth } from '@src/api/axios-base-query-auth';
import { API_ROUTES, QUERY_KEYS } from '@src/consts';

const url = {
  task: (taskId?: string) => (taskId ? `${API_ROUTES.TASKS}/${taskId}` : API_ROUTES.TASKS),
  project: (projectId: string) => `${API_ROUTES.PROJECTS}/${projectId}/${API_ROUTES.TASKS}`,
  taskStatus: (taskId: string) => `${url.task(taskId)}/status`,
};

const updateProjectOnTaskChange = (taskId: string, projectId?: string, status?: TaskStatus) => {
  if (!projectId) return [];

  const projectTags = [
    { type: QUERY_KEYS.PROJECTS, id: projectId },
    { type: QUERY_KEYS.PROJECTS, id: `${projectId}-${QUERY_KEYS.TASKS}` },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const optimisticUpdate = (dispatch: any) => {
    if (status) {
      dispatch(
        projectApi.util.updateQueryData('getProject', projectId, draft => {
          if (draft?.data?.tasks) {
            const taskIndex = draft.data.tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
              draft.data.tasks[taskIndex].status = status;
            }
          }
        })
      );
    }
  };

  return { projectTags, optimisticUpdate };
};

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: axiosBaseQueryAuth(),
  tagTypes: [QUERY_KEYS.TASKS],
  endpoints: build => ({
    // GET
    getTasksByStatus: build.query<ItemsResponse<Task>, { status: string } & QueryParams>({
      query: ({ status, page, size = 10 }) => ({
        url: `${API_ROUTES.TASKS}/status/${status}`,
        params: { page, size },
      }),
      providesTags: [QUERY_KEYS.TASKS],
    }),

    getTasks: build.query<ItemsResponse<Task>, string>({
      query: projectId => ({ url: url.project(projectId) }),
      providesTags: [QUERY_KEYS.TASKS],
    }),

    getTask: build.query<ItemResponse<Task> | null, string>({
      query: id => ({ url: url.task(id) }),
      providesTags: (result, error, id) => [{ type: QUERY_KEYS.TASKS, id }],
    }),

    // POST
    createTask: build.mutation<ItemResponse<Task>, unknown>({
      query: ({ projectId, ...newTask }) => ({
        url: url.project(projectId),
        method: 'POST',
        data: newTask,
      }),
      invalidatesTags: [QUERY_KEYS.PROJECTS, QUERY_KEYS.TASKS],
      onQueryStarted: async ({ projectId, id, status }, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedTask } = await queryFulfilled;
          const taskProjectId = updatedTask.data.projectId || projectId;

          if (!taskProjectId) return;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { projectTags, optimisticUpdate } = updateProjectOnTaskChange(id, taskProjectId, status) as any;

          dispatch(projectApi.util.invalidateTags(projectTags));
          optimisticUpdate(dispatch);
        } catch (error) {
          console.error('Failed to create task:', error);
        }
      },
    }),

    // PUT
    updateTask: build.mutation<ItemResponse<Task>, { id: string; data: Partial<Task> }>({
      query: ({ id, data }) => ({
        url: url.task(id),
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: QUERY_KEYS.TASKS, id }, QUERY_KEYS.TASKS],
    }),

    // DELETE
    deleteTask: build.mutation<void, string>({
      query: id => ({
        url: url.task(id),
        method: 'DELETE',
      }),
      invalidatesTags: [QUERY_KEYS.PROJECTS, QUERY_KEYS.TASKS],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(projectApi.util.invalidateTags([QUERY_KEYS.PROJECTS]));
        } catch (error) {
          console.error('Failed to delete task:', error);
        }
      },
    }),

    // PATCH
    updateStatusTask: build.mutation<ItemResponse<Task>, { id: string; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: url.taskStatus(id),
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (result, error, { id }) => {
        const tags = [QUERY_KEYS.TASKS, QUERY_KEYS.PROJECTS, { type: QUERY_KEYS.TASKS, id }];

        if (result?.data.projectId) {
          tags.push({ type: QUERY_KEYS.PROJECTS, id: `${result.data.projectId}-${QUERY_KEYS.TASKS}` });
        }

        return tags;
      },
      onQueryStarted: async ({ id, status }, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedTask } = await queryFulfilled;
          const { projectId } = updatedTask.data;

          if (!projectId) return;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { projectTags, optimisticUpdate } = updateProjectOnTaskChange(id, projectId, status) as any;

          dispatch(projectApi.util.invalidateTags(projectTags));
          optimisticUpdate(dispatch);
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
});

export const {
  useGetTasksByStatusQuery,
  useGetTasksQuery,
  useGetTaskQuery,
  useLazyGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateStatusTaskMutation,
} = tasksApi;

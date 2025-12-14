import { createApi } from '@reduxjs/toolkit/query/react';
import type { ItemResponse, ItemsResponse, QueryParams, Task, TaskStatus } from '@src/types';
import { projectApi } from '../projects/api';
import { axiosBaseQueryAuth } from '@src/api/axios-base-query-auth';
import { API_ROUTES, QUERY_KEYS } from '@src/consts';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: axiosBaseQueryAuth(),
  tagTypes: [QUERY_KEYS.TASKS, QUERY_KEYS.TASK],
  endpoints: build => ({
    getTasksByStatus: build.query<ItemsResponse<Task>, { status: string } & QueryParams>({
      query: ({ status, page, size = 10 }) => ({
        url: `${API_ROUTES.TASKS}/status/${status}`,
        params: { page, size },
      }),
      providesTags: [QUERY_KEYS.TASKS],
    }),
    getTasks: build.query<ItemsResponse<Task>, string>({
      query: projectId => ({
        url: `${API_ROUTES.PROJECTS}/${projectId}/${API_ROUTES.TASKS}`,
      }),
      providesTags: [QUERY_KEYS.TASKS],
    }),
    getTask: build.query<ItemResponse<Task> | null, string>({
      query: id => ({ url: `tasks/${id}` }),
    }),
    createTask: build.mutation<ItemResponse<Task>, unknown>({
      query: ({ projectId, ...newTask }) => ({
        url: `${API_ROUTES.PROJECTS}/${projectId}/${API_ROUTES.TASKS}`,
        method: 'POST',
        data: newTask,
      }),
      invalidatesTags: [QUERY_KEYS.TASKS],
    }),
    updateTask: build.mutation<ItemResponse<Task>, { id: string; data: Task }>({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.TASKS}/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: [QUERY_KEYS.TASKS],
    }),
    deleteTask: build.mutation<void, string>({
      query: id => ({
        url: `${API_ROUTES.TASKS}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [QUERY_KEYS.TASKS],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(projectApi.util.invalidateTags([QUERY_KEYS.PROJECT]));
        } catch (error) {
          console.error('Delete failed:', error);
        }
      },
    }),
    updateStatusTask: build.mutation<void, { id: string; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: `${API_ROUTES.TASKS}/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: [QUERY_KEYS.TASKS],
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

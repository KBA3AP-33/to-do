import { createApi } from '@reduxjs/toolkit/query/react';
import { TaskStatus, type ItemResponse, type ItemsResponse, type Project, type QueryParams } from '@src/types';
import { axiosBaseQueryAuth } from '@src/api/axios-base-query-auth';
import { API_ROUTES, QUERY_KEYS } from '@src/consts';
import { tasksApi } from '@src/store/tasks/api';
import type { RootState } from '..';

type UpdateProjectCache = {
  queryArgs: QueryParams & { isCompleted?: boolean };
  result: ReturnType<typeof projectApi.util.updateQueryData>;
  oldData: ItemsResponse<Project>;
};

const url = {
  project: (projectId?: string) => (projectId ? `${API_ROUTES.PROJECTS}/${projectId}` : API_ROUTES.PROJECTS),
  projectAction: (projectId: string, action: string) => `${url.project(projectId)}/${action}`,
};

const optimisticUpdateProjectsCache = (
  projectId: string,
  updatedData: Partial<Project>,
  getState: () => RootState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any
): UpdateProjectCache[] => {
  const state = getState();
  const cache = state[projectApi.reducerPath];
  const results: UpdateProjectCache[] = [];

  if (!cache?.queries) return results;

  Object.entries(cache.queries).forEach(([_, queryInfo]) => {
    const isGetProjectsQuery =
      queryInfo?.endpointName === 'getProjects' && queryInfo?.status === 'fulfilled' && queryInfo?.data;

    if (!isGetProjectsQuery) return;

    const queryArgs = (queryInfo.originalArgs as QueryParams & { isCompleted?: boolean }) || {};

    const updateResult = dispatch(
      projectApi.util.updateQueryData('getProjects', queryArgs, draft => {
        const projectIndex = draft.data.findIndex(project => project.id === projectId);
        if (projectIndex !== -1) {
          draft.data[projectIndex] = {
            ...draft.data[projectIndex],
            ...updatedData,
          };
        }
      })
    );

    results.push({ queryArgs, result: updateResult, oldData: queryInfo.data as ItemsResponse<Project> });
  });

  return results;
};

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: axiosBaseQueryAuth(),
  tagTypes: [QUERY_KEYS.PROJECTS],
  endpoints: build => ({
    // GET
    getProjects: build.query<ItemsResponse<Project>, QueryParams & { isCompleted?: boolean }>({
      query: ({ page = 1, size = 10, search = '', isCompleted }) => ({
        url: API_ROUTES.PROJECTS,
        params: {
          page,
          size,
          isCompleted,
          ...(search && { search }),
        },
      }),
      providesTags: [QUERY_KEYS.PROJECTS],
    }),

    getProject: build.query<ItemResponse<Project> | null, string>({
      query: id => ({ url: url.project(id) }),
      providesTags: (result, error, id) => [
        { type: QUERY_KEYS.PROJECTS, id },
        { type: QUERY_KEYS.PROJECTS, id: `${id}-${QUERY_KEYS.TASKS}` },
      ],
    }),

    // POST
    createProject: build.mutation<ItemResponse<Project>, Partial<Project>>({
      query: newProject => ({
        url: API_ROUTES.PROJECTS,
        method: 'POST',
        data: newProject,
      }),
      invalidatesTags: [QUERY_KEYS.PROJECTS],
    }),

    // PUT
    updateProject: build.mutation<ItemResponse<Project>, { id: string; data: Partial<Project> }>({
      query: ({ id, data }) => ({
        url: url.project(id),
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: QUERY_KEYS.PROJECTS, id }, QUERY_KEYS.PROJECTS],
      onQueryStarted: async ({ id, data }, { dispatch, queryFulfilled, getState }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cacheUpdates = optimisticUpdateProjectsCache(id, data, getState as any, dispatch);

        try {
          await queryFulfilled;
        } catch {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cacheUpdates.forEach(({ result }) => (result as any).undo());
        }
      },
    }),

    // DELETE
    deleteProject: build.mutation<void, string>({
      query: id => ({ url: url.project(id), method: 'DELETE' }),
      invalidatesTags: [QUERY_KEYS.PROJECTS],
    }),

    // PATCH
    favoriteProject: build.mutation<boolean, string>({
      query: id => ({
        url: url.projectAction(id, 'favorite'),
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: QUERY_KEYS.PROJECTS, id }, QUERY_KEYS.PROJECTS],
    }),

    completeAllTasks: build.mutation<boolean, string>({
      query: id => ({
        url: url.projectAction(id, 'complete'),
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: QUERY_KEYS.PROJECTS, id },
        QUERY_KEYS.PROJECTS,
        QUERY_KEYS.TASKS,
      ],
      onQueryStarted: async (projectId, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(projectApi.util.invalidateTags([{ type: QUERY_KEYS.TASKS, id: projectId }, QUERY_KEYS.TASKS]));
          dispatch(
            tasksApi.util.updateQueryData('getTasks', projectId, draft => {
              if (draft?.data) {
                draft.data.forEach(task => {
                  task.status = TaskStatus.FULFILLED;
                });
              }
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useLazyGetProjectsQuery,
  useGetProjectQuery,
  useLazyGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useFavoriteProjectMutation,
  useCompleteAllTasksMutation,
} = projectApi;

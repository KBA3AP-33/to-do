import { createApi } from '@reduxjs/toolkit/query/react';
import type { ItemResponse, ItemsResponse, Project, QueryParams } from '@src/types';
import { axiosBaseQueryAuth } from '@src/api/axios-base-query-auth';
import { API_ROUTES, QUERY_KEYS } from '@src/consts';
import type { RootState } from '..';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: axiosBaseQueryAuth(),
  tagTypes: [QUERY_KEYS.PROJECTS],
  endpoints: build => ({
    getProjects: build.query<ItemsResponse<Project>, QueryParams>({
      query: ({ page = 1, size = 10, search = '' }) => ({
        url: API_ROUTES.PROJECTS,
        params: {
          page,
          size,
          ...(search && { search }),
        },
      }),
      providesTags: [QUERY_KEYS.PROJECTS],
    }),
    getProject: build.query<ItemResponse<Project> | null, string>({
      query: id => ({ url: `${API_ROUTES.PROJECTS}/${id}` }),
      providesTags: (result, error, id) => [{ type: QUERY_KEYS.PROJECTS, id }],
    }),
    createProject: build.mutation<ItemResponse<Project>, unknown>({
      query: newProject => ({
        url: API_ROUTES.PROJECTS,
        method: 'POST',
        data: newProject,
      }),
      invalidatesTags: [QUERY_KEYS.PROJECTS],
    }),
    updateProject: build.mutation<ItemResponse<Project>, { id: string; data: Project }>({
      query: ({ id, data }) => ({
        url: `${API_ROUTES.PROJECTS}/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: QUERY_KEYS.PROJECTS, id }, QUERY_KEYS.PROJECTS],
      onQueryStarted: async ({ id, data }, { dispatch, queryFulfilled, getState }) => {
        const state = getState() as RootState;
        const cache = state[projectApi.reducerPath];

        const results: any[] = [];

        if (cache?.queries) {
          Object.entries(cache.queries).forEach(([_, queryInfo]) => {
            if (queryInfo?.endpointName === 'getProjects' && queryInfo?.data) {
              const queryArgs = queryInfo.originalArgs || {};

              const result = dispatch(
                projectApi.util.updateQueryData('getProjects', queryArgs, draft => {
                  const index = draft.data.findIndex(item => item.id === id);
                  if (index !== -1) {
                    const oldProject = draft.data[index];
                    draft.data[index] = { ...oldProject, ...data };
                  }
                })
              );

              results.push({
                queryArgs,
                result,
                oldData: queryInfo.data,
              });
            }
          });
        }

        try {
          await queryFulfilled;
        } catch {
          results.forEach(({ result }) => result.undo());
        }
      },
    }),
    deleteProject: build.mutation<void, string>({
      query: id => ({
        url: `${API_ROUTES.PROJECTS}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [QUERY_KEYS.PROJECTS],
    }),
    favoriteProject: build.mutation<boolean, string>({
      query: id => ({
        url: `${API_ROUTES.PROJECTS}/${id}/favorite`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: QUERY_KEYS.PROJECTS, id }, QUERY_KEYS.PROJECTS],
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
} = projectApi;

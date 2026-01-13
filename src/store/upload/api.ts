import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ROUTES, QUERY_KEYS } from '@src/consts';
import config from '@src/config';

export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.api.baseUrl,
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  tagTypes: [QUERY_KEYS.UPLOAD],
  endpoints: build => ({
    uploadImage: build.mutation<{ url: string }, Blob>({
      query: file => {
        const formData = new FormData();
        formData.append('file', file);

        return { url: API_ROUTES.UPLOAD, method: 'POST', body: formData };
      },
    }),
    deleteImage: build.mutation<void, string>({
      query: id => ({
        url: `${API_ROUTES.UPLOAD}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useUploadImageMutation, useDeleteImageMutation } = uploadApi;

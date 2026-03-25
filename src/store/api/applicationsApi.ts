import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { Job } from './jobsApi';

export interface Application {
  _id: string;
  user: string;
  job: Job;
  createdAt: string;
}

export const applicationsApi = createApi({
  reducerPath: 'applicationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Application'],
  endpoints: (builder) => ({
    getApplications: builder.query<Application[], void>({
      query: () => '/applications',
      providesTags: ['Application'],
    }),
    applyToJob: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/jobs/${id}/apply`,
        method: 'POST',
      }),
      invalidatesTags: ['Application'],
    }),
  }),
});

export const { useGetApplicationsQuery, useApplyToJobMutation } = applicationsApi;

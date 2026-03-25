import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

export interface Job {
  _id: string;
  companyName: string;
  position: string;
  type: string;
  location: string;
  postedBy: string;
  createdAt: string;
}

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/jobs',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Job', 'Application'],
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], { companyName?: string; location?: string; type?: string } | void>({
      query: (params) => ({
        url: '/',
        params: params || {},
      }),
      providesTags: ['Job'],
    }),
    createJob: builder.mutation<Job, Partial<Job>>({
      query: (job) => ({
        url: '/',
        method: 'POST',
        body: job,
      }),
      invalidatesTags: ['Job'],
    }),
    updateJob: builder.mutation<Job, { id: string; job: Partial<Job> }>({
      query: ({ id, job }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: job,
      }),
      invalidatesTags: ['Job'],
    }),
    deleteJob: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;

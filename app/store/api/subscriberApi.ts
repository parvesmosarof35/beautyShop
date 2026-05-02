import { baseApi } from "./baseApi";

export interface Subscriber {
  _id: string;
  email: string;
  isSubscribed: boolean;
  createdAt: string;
}

export const subscriberApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSubscribers: build.query<{ success: boolean; data: Subscriber[] }, void>({
      query: () => ({
        url: "/subscriber",
        method: "GET",
      }),
      providesTags: ["subscriber"],
    }),
    subscribe: build.mutation<{ success: boolean; data: Subscriber }, { email: string }>({
      query: (data) => ({
        url: "/subscriber",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subscriber"],
    }),
  }),
});

export const {
  useGetAllSubscribersQuery,
  useSubscribeMutation,
} = subscriberApi;

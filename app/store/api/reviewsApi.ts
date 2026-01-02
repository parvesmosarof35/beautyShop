import { baseApi } from "./baseApi";

export const reviewsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllReviews: build.query({
            query: ({ page = 1, limit = 10 }) => ({
                url: `/review?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["reviews"],
        }),
        createReview: build.mutation({
            query: (data) => ({
                url: "/review",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["reviews"],
        }),
        deleteReview: build.mutation({
            query: (id) => ({
                url: `/review/admin/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["reviews"],
        }),
    }),
});

export const {
    useGetAllReviewsQuery,
    useCreateReviewMutation,
    useDeleteReviewMutation
} = reviewsApi;
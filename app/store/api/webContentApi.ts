
import { baseApi } from "./baseApi";

const webContentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getHeroSection: builder.query({
            query: () => ({
                url: "/hero/get-hero-section",
                method: "GET",
            }),
            providesTags: ["Hero"],
        }),
        updateHeroSection: builder.mutation({
            query: (data) => ({
                url: "/hero/update-hero-section",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Hero"],
        }),
    }),
});

export const {
    useGetHeroSectionQuery,
    useUpdateHeroSectionMutation,
} = webContentApi;

export default webContentApi;

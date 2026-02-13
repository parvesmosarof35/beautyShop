import { baseApi } from "./baseApi";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query({
            query: () => ({
                url: "setting/find_by_socal_media_links_address_phone_email_texts",
                method: "GET",
            }),
            providesTags: ["settings"],
        }),
        updateSettings: builder.mutation({
            query: (data) => ({
                url: "setting/socal_media_links_address_phone_email_texts",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["settings"],
        }),
    }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;

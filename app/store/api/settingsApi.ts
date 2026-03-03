import { baseApi } from "./baseApi";

export interface NavbarLink {
    title: string;
    url: string;
    isActive: boolean;
}

export interface SocialLink {
    url: string;
    isActive: boolean;
}

export interface HomepageSection {
    title: string;
    subtitle: string;
}

export interface ISettings {
    navbarlinks?: NavbarLink[];
    instagram?: SocialLink;
    facebook?: SocialLink;
    tiktok?: SocialLink;
    twitterx?: SocialLink;
    whatsapp?: SocialLink;
    address?: SocialLink;
    phone?: SocialLink;
    email?: SocialLink;
    homepagesection2?: HomepageSection;
    homepagesection3?: HomepageSection & { buttontext: string };
    homepageCollections?: HomepageSection;
    footertext?: { logobelowtext: string; footerbottomtext: string };
    productpage?: HomepageSection;
    productdetails?: { Gotodetailstext: string; relatedproducttext: string };
}

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query<{ data: ISettings } | any, any>({
            query: () => ({
                url: "setting/find_by_socal_media_links_address_phone_email_texts",
                method: "GET",
            }),
            transformResponse: (response: { data: ISettings }) => response.data,
            providesTags: ["settings"],
        }),
        updateSettings: builder.mutation<any, Partial<ISettings>>({
            query: (data) => ({
                url: "setting/socal_media_links_address_phone_email_texts",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["settings"],
        }),
        getHomePageSection2: builder.query({
            query: () => ({
                url: "setting/home-page-section-2",
                method: "GET",
            }),
            providesTags: ["settings"],
        }),
        updateHomePageSection2: builder.mutation({
            query: (data) => ({
                url: "setting/home-page-section-2",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["settings"],
        }),
    }),
});

export const {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
    useGetHomePageSection2Query,
    useUpdateHomePageSection2Mutation
} = settingsApi;

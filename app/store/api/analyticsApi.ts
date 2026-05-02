import { baseApi } from "./baseApi";

export interface AnalyticsOverview {
  today: {
    date: string;
    totalVisits: number;
    uniqueVisitors: number;
    cartAdds: number;
    wishlistAdds: number;
  };
  total: {
    totalVisits: number;
    uniqueVisitors: number;
    cartAdds: number;
    wishlistAdds: number;
  };
  trends: {
    date: string;
    totalVisits: number;
    uniqueVisitors: number;
    cartAdds: number;
    wishlistAdds: number;
  }[];
}

export interface ProductAnalytics {
  mostClicked: any[];
  mostVisited: any[];
  mostCartAdded: any[];
  mostWishlistAdded: any[];
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAnalyticsOverview: build.query<{ success: boolean; data: AnalyticsOverview }, void>({
      query: () => ({
        url: "/analytics/overview",
        method: "GET",
      }),
      providesTags: ["analytics"],
    }),
    getProductAnalytics: build.query<{ success: boolean; data: ProductAnalytics }, void>({
      query: () => ({
        url: "/analytics/products",
        method: "GET",
      }),
      providesTags: ["analytics"],
    }),
    recordSiteVisit: build.mutation<{ success: boolean; data: any }, { isUnique: boolean }>({
      query: (data) => ({
        url: "/analytics/visit",
        method: "POST",
        body: data,
      }),
    }),
    recordProductClick: build.mutation<{ success: boolean; data: any }, string>({
      query: (id) => ({
        url: `/analytics/product/${id}/click`,
        method: "POST",
      }),
    }),
    recordProductVisit: build.mutation<{ success: boolean; data: any }, string>({
      query: (id) => ({
        url: `/analytics/product/${id}/visit`,
        method: "POST",
      }),
    }),
    recordAddToCart: build.mutation<{ success: boolean; data: any }, string>({
      query: (id) => ({
        url: `/analytics/product/${id}/cart`,
        method: "POST",
      }),
    }),
    recordAddToWishlist: build.mutation<{ success: boolean; data: any }, string>({
      query: (id) => ({
        url: `/analytics/product/${id}/wishlist`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetProductAnalyticsQuery,
  useRecordSiteVisitMutation,
  useRecordProductClickMutation,
  useRecordProductVisitMutation,
  useRecordAddToCartMutation,
  useRecordAddToWishlistMutation,
} = analyticsApi;

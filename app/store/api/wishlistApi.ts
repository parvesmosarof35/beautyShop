
import { baseApi } from "./baseApi";

export const wishlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Add item to wishlist
        addToWishlist: builder.mutation({
            query: (data) => ({
                url: "wishlist",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["wishlist"],
        }),

        // Get my wishlist
        getMyWishlist: builder.query({
            query: () => ({
                url: "wishlist/my-wishlist",
                method: "GET",
            }),
            providesTags: ["wishlist"],
        }),

        // Remove item from wishlist
        removeFromWishlist: builder.mutation({
            query: (productId) => ({
                url: `wishlist/product/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["wishlist"],
        }),
    }),
});

export const {
    useAddToWishlistMutation,
    useGetMyWishlistQuery,
    useRemoveFromWishlistMutation,
} = wishlistApi;

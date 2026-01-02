
import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add item to cart
    addToCart: builder.mutation({
      query: (data) => ({
        url: "cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart"],
    }),

    // Get my cart
    getMyCart: builder.query({
      query: () => ({
        url: "cart",
        method: "GET",
      }),
      providesTags: ["cart"],
    }),

    // Check if product in cart
    checkIfProductInCart: builder.query({
      query: (productId) => ({
        url: `cart/check/${productId}`,
        method: "GET",
      }),
      providesTags: ["cart"],
    }),

    // Clear my cart
    clearMyCart: builder.mutation({
      query: () => ({
        url: "cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),

    // Remove item from cart (by product ID based on route name /product/:productId, but checking controller naming)
    // The route says /product/:productId mapped to removeFromCart
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `cart/product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),

    // Update cart item quantity
    updateCartItemQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `cart/product/${productId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["cart"],
    }),

    // Delete cart item (by ID - /:id)
    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetMyCartQuery,
  useCheckIfProductInCartQuery,
  useClearMyCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
  useDeleteCartItemMutation,
} = cartApi;
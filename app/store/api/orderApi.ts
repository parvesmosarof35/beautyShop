import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCheckoutSession: build.mutation({
      query: (data) => ({
        url: "/payment/cart/create-checkout-session",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart", "Order", "product", "products"],
    }),
    createCheckoutSessionGooglePay: build.mutation({
      query: (data) => ({
        url: "/payment/cart/create-checkout-session-by-google-pay-stripe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart", "Order", "product", "products"],
    }),
    createCheckoutSessionApplePay: build.mutation({
      query: (data) => ({
        url: "/payment/cart/create-checkout-session-by-apple-pay-stripe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart", "Order", "product", "products"],
    }),
    createCheckoutSessionMultiple: build.mutation({
      query: (data) => ({
        url: "/payment/cart/create-checkout-session-by-multiple-payments-stripe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cart", "Order", "product", "products"],
    }),
    getMyOrders: build.query({
      query: (customerId) => ({
        url: `/order/my-orders/${customerId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    // ..........................................................
    getAllOrders: build.query({
      query: () => ({
        url: "/order",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    updateOrderStatus: build.mutation({
      query: ({ orderId, status }) => ({
        url: `/order/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
    // .................................................................

    getOrderById: build.query({
      query: (orderId) => ({
        url: `/order/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    updatePaymentStatus: build.mutation({
      query: ({ orderId, status }) => ({
        url: `/order/${orderId}/payment-status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
    cancelOrder: build.mutation({
      query: (orderId) => ({
        url: `/order/${orderId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useCreateCheckoutSessionGooglePayMutation,
  useCreateCheckoutSessionApplePayMutation,
  useCreateCheckoutSessionMultipleMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useCancelOrderMutation,
} = orderApi;
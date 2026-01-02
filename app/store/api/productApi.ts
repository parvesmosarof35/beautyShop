import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all product
        getAllProducts: builder.query({
            query: (params) => ({
                url: "product",
                method: "GET",
                params, // e.g., { page: 1, limit: 10 }
            }),
            providesTags: ["product"],
        }),

        // Create product
        createProduct: builder.mutation({
            query: (formData) => ({
                url: "product",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["product", "dashboard"],
        }),

        //  update product
        updateProduct: builder.mutation({
            query: ({ id, formData }) => ({
                url: `product/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["product"],
        }),

        // delete product
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `product/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product", "dashboard"],
        }),
        getFeaturedProducts: builder.query({
            query: () => ({
                url: "product/getfeaturedproducts",
                method: "GET",
            }),
            providesTags: ["product"],
        }),
    }),
});

export const {
    useCreateProductMutation,
    useGetAllProductsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetFeaturedProductsQuery,
} = productApi;

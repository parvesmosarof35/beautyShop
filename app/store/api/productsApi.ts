import { baseApi } from "./baseApi";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProduct: build.mutation({
      query: (data) => ({
        url: "/product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products", "collection", "dashboard"],
    }),
    getAllProducts: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/product",
        method: "GET",
        params: arg,
      }),
      providesTags: ["products"],
    }),
    getSingleProduct: build.query({
      query: ({ params }) => ({
        url: `/product/${params.id}`,
        method: "GET",
        params: params,
      }),
      providesTags: ["products"],
    }),
    getRelatedProducts: build.query({
      query: ({ params }) => ({
        url: `/product/getrelatedproducts/${params.id}?page=${params.page}&limit=${params.limit}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),
    updateProduct: build.mutation({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["products", "collection"],
    }),
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products", "collection", "dashboard"],
    }),
    getProductsByCollection: build.query({
      query: (collectionId) => ({
        url: `/product/collection/${collectionId}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),
    getSearchProducts: build.query({
      query: (searchTerm) => ({
        url: `/product/search?q=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsByCollectionQuery,
  useGetRelatedProductsQuery,
  useGetSearchProductsQuery,
} = productsApi;
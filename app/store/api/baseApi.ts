import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../config/envConfig";
import { jwtDecode } from "jwt-decode";
import { logout } from "../authSlice";


const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    const state: any = getState();
    const token = state?.auth?.token;
    if (token) {
      headers.set("Authorization", token);
    }
    return headers;
  },
});

const baseQueryWithLogout = async (args: any, api: any, extraOptions: any) => {
  const state: any = api.getState();
  const token = state?.auth?.token;

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // If token is expired, logout immediately
      if (decoded.exp < currentTime) {
        api.dispatch(logout());
        return {
          error: {
            status: 401,
            data: { message: "Token expired, logging out..." },
          },
        };
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
      api.dispatch(logout());
      return {
        error: {
          status: 401,
          data: { message: "Invalid token, logging out..." },
        },
      };
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  // If the server returns 401 Unauthorized, trigger logout
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithLogout,
  endpoints: () => ({}),
  tagTypes: [
    "admin",
    "dashboard",
    "user",
    "subscription",
    "auth",
    "plates_sales",
    "User",
    "faq",
    "aboutUs",
    "termsAndConditions",
    "privacy",
    "contact",
    "blog",
    "collection",
    "product",
    "products",
    "cart",
    "wishlist",
    "Order",
    "reviews",
    "Hero",
    "settings",
  ],
});
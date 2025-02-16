import { baseApi } from "../../base/baseApi";

export const userApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Fetch all Categorys
    getCategory: builder.query<Category , undefined>({
      query: () => {
        return {
          url: `/api/super-admin/category`,
        };
      },
    }),
    
    // Fetch Category by ID
    getCategoryById: builder.query<Category, string>({
      query: (queryArg) => {
        return {
          url: `/api/super-admin/category/${queryArg}`, // Use correct route for fetching by ID
        };
      },
    }),
    
    // Create a new Category
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (Category) => {
        return {
          url: `/api/super-admin/category`,
          method: "POST",
          body: Category,
        };
      },
    }),
    
    // Update an Category by ID
    updateCategory: builder.mutation<Category, { id: string; updates: Partial<Category> }>({
      query: (queryArg) => {
        return {
          url: `/api/super-admin/category/${queryArg.id}`, // Use correct route for updating
          method: "PUT",
          body: queryArg.updates,
        };
      },
    }),
    
    // Delete an Category by ID
    deleteCategoryById: builder.mutation<void, string>({
      query: (queryArg) => {
        return {
          url: `/api/super-admin/category/${queryArg}`,
          method: "DELETE",
        };
      },
    }),
    
    // Delete all Categorys (if applicable)
    deleteCategory: builder.mutation<void, void>({
      query: () => {
        return {
          url: `/api/super-admin/category_delete`, // Use correct route for deleting all
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteCategoryByIdMutation,
} = userApi;



       
export type Category = Array<{
    _id: string;
    AssetName: string;
    // Make: string;
    // Model: string;
  }>;

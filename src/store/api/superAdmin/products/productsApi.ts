import { baseApi } from "../../base/baseApi";

export const userApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    // Fetch all Productss
    getProducts: builder.query<Products[], void>({
      query: () => {
        return {
          url: `/api/super-admin/products`,
        };
      },
    }),
    
    // Fetch Products by ID
    getProductsById: builder.query<Products, string>({
      query: (queryArg) => {
        return {
          url: `/api/super-admin/products/${queryArg}`, // Use correct route for fetching by ID
        };
      },
    }),
    
    // Create a new Products
    createProducts: builder.mutation<Products, Partial<Products>>({
      query: (Products) => {
        return {
          url: `/api/super-admin/products`,
          method: "POST",
          body: Products,
        };
      },
    }),
    
    // Update an Products by ID
    updateProducts: builder.mutation<Products, { id: string; updates: Partial<Products> }>({
      query: (queryArg) => {
        return {
          url: `/api/super-admin/products/${queryArg.id}`, // Use correct route for updating
          method: "PUT",
          body: queryArg.updates,
        };
      },
    }),
    
    // Delete an Products by ID
    deleteProductsById: builder.mutation<void, string>({
      query: (queryArg) => {
        return {
          url: `/api/super-admin/products/${queryArg}`,
          method: "DELETE",
        };
      },
    }),
    
    // Delete all Productss (if applicable)
    deleteProducts: builder.mutation<void, void>({
      query: () => {
        return {
          url: `/api/super-admin/products_delete`, // Use correct route for deleting all
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByIdQuery,
  useCreateProductsMutation,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
  useDeleteProductsByIdMutation,
} = userApi;



export interface Products {
  _id:any;              // Unique identifier
  SessionStartDate: Date; // Date type for session start
  SessionEndDate: Date;   // Date type for session end
  UniqueID: string;       // Unique identifier
  PurchaseDate: Date;     // Date type for purchase
  InvoiceNumber: string;  // Invoice number
  AssetName: string;      // Asset name
  MakeModel: string;      // Make and model
  ProductSerialNumber: string; // Product serial number
  VendorName: string;     // Vendor's name
  Quantity: number;       // Quantity of Productss
  RateIncludingTaxes: number; // Rate with taxes included
  SimilarName: string;    // A similar or related name
  category: any,
  IssuedTo: string;       // To whom the product is issued
}

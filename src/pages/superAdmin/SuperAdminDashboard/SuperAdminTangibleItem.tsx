import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../../../store/api/superAdmin/products/productsApi";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import FormField from "../../../components/Forms/inputs/FormFields";
import { useState } from "react";
import Loader from "../../../components/Loader";

const SuperAdminTangibleItem = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: inventoryData } = useGetProductsQuery();
  const { categoryId } = useParams(); // Get category ID from URL

  const filteredByCategory = Array.isArray(inventoryData)
    ? inventoryData.filter((item: any) => item.category === categoryId)
    : [];

  // Apply search filter on the already filtered category data
  const filteredInventory:any = filteredByCategory.filter((item: any) =>
    Object.values(item).some(
      (value: any) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (<>
  <Breadcrumb pageName="Tangible" />
    <div className="overflow-x-auto">
    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white">
      <thead className="bg-gray-100 dark:bg-gray-800">
        <tr className="border border-gray-300 dark:border-gray-700">
          {[
            "Asset Name",
            "Invoice Number",
            "Issued To",
            "Make",
            "Model",
            "Serial Number",
            "Purchase Date",
            "Quantity",
            "Rate (Incl. Taxes)",
            "Similar Name",
            "Unique ID",
            "Vendor Name",
          ].map((header, index) => (
            <th key={index} className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 text-left">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-700">
        {filteredInventory.map((item:any, index:any) => (
          <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
            {[
              item.AssetName,
              item.InvoiceNumber,
              item.IssuedTo,
              item.Make,
              item.Model,
              item.ProductSerialNumber,
              new Date(item.PurchaseDate).toLocaleDateString(),
              item.Quantity,
              item.RateIncludingTaxes,
              item.SimilarName,
              item.UniqueID,
              item.VendorName,
            ].map((data, idx) => (
              <td key={idx} className="border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800">
                {data}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
 </> );
};

export default SuperAdminTangibleItem;

import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import ChartThree from "../../../components/Charts/ChartThree";
import { useGetCategoryQuery } from "../../../store/api/superAdmin/category/categoryApi";
import { useGetProductsQuery } from "../../../store/api/superAdmin/products/productsApi";
import { ROUTES } from "../../../components/consts/const";


const SuperAdminTangible = () => {
  const navigate = useNavigate(); // Initialize navigation
  const { data: inventoryData } = useGetProductsQuery();
  const { data: categoryList } = useGetCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });


  const handleRowClick = (item: any) => {
    const matchedCategory = categoryList?.find(
      (category) => category.AssetName === item.ItemName
    );
  
    if (matchedCategory?._id) {
      navigate(`${ROUTES.SUPER_ADMIN_TANGIBLE_ITEM}/${matchedCategory._id}`); // Pass ID in URL
    } else {
      console.log("No match found");
    }
  };
  

  const transformData = (data: any[], categoryList: any[]) => {
    return data
      ?.filter((item) => categoryList?.some((cat) => cat._id === item.category))
      ?.reduce((acc: Record<string, number>, item) => {
        const itemName = categoryList?.find((cat) => cat._id === item.category)?.AssetName;
        if (itemName) {
          acc[itemName] = (acc[itemName] || 0) + item.Quantity;
        }
        return acc;
      }, {} as Record<string, number>);
  };

  const formattedData: any =
    inventoryData &&
    categoryList &&
    Object?.entries(transformData(inventoryData, categoryList))?.map(
      ([ItemName, Quantity]) => ({
        ItemName,
        Quantity,
      })
    );

  return (
    <div>
      <Breadcrumb pageName="Tangible" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:grid-cols-2 2xl:gap-7.5">
        <div className="flex flex-col justify-center items-center w-full h-[600px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-boxdark shadow-md rounded-lg p-5">
          <table className="w-full h-full border-collapse border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr className="border dark:border-gray-700">
                <th className="border border-gray-300 px-6 py-3 dark:border-gray-600 dark:bg-gray-700">
                  Item Name
                </th>
                <th className="border border-gray-300 px-6 py-3 dark:border-gray-600 dark:bg-gray-700">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {formattedData?.map((item: any, index: any) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(item)} 
                  className="text-center border dark:border-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <td className="border border-gray-300 px-6 py-3 dark:border-gray-600 dark:bg-gray-800">
                    {item.ItemName}
                  </td>
                  <td className="border border-gray-300 px-6 py-3 dark:border-gray-600 dark:bg-gray-800">
                    {item.Quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center w-full h-[600px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-boxdark shadow-md rounded-lg p-5">
          <ChartThree data={formattedData} />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminTangible;

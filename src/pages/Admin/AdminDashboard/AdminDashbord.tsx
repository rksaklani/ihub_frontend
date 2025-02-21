import React, { useEffect, useState } from "react";
import { useGetAdminProductsQuery } from "../../../store/api/admin/adminProducts/AdminProducts";
import AdminCardStatus from "../../../components/AdminCardStatus";
import BarChart from "../../../components/Charts/BarChart";

const AdminDashboard: React.FC = () => {
  const [totalCategory, setTotalCategory] = useState<any>(0);

  const { data: getProductData } = useGetAdminProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  // console.log(getProductData)

  const totalQuantity: any = getProductData?.reduce(
    (sum, item) => sum + item.Quantity,
    0
  );
  useEffect(() => {
    const itemCounts: Record<string, number> = {};

    getProductData?.forEach(
      (product: { ItemName: string; Quantity: number }) => {
        const itemName: string = product.ItemName;
        itemCounts[itemName] = (itemCounts[itemName] || 0) + product.Quantity;
      }
    );
    if (getProductData) {
      setTotalCategory(Object.keys(itemCounts).length);
      console.log("itemCounts", Object.keys(itemCounts).length);
    }
  }, [getProductData]);

  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex-1 flex justify-start mr-6">
          <AdminCardStatus
            title="Total Quantity"
            total={totalQuantity}
            rate="Electronic"
          >
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
                fill=""
              />
              <path
                d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                fill=""
              />
            </svg>
          </AdminCardStatus>
        </div>
        <div className="flex-1 flex justify-end">
          <AdminCardStatus
            title="Total Category"
            total={totalCategory}
            rate="Electronic"
          >
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
                fill=""
              />
              <path
                d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                fill=""
              />
            </svg>
          </AdminCardStatus>
        </div>
      </div>
      <div className="pt-1"> </div>
      <div className="flex justify-between mt-6">
        <div className="flex-1 flex ">
          {" "}
          {/* Add left margin here */}
          <BarChart data={getProductData} />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

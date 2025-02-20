import { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import FormField from '../../../components/Forms/inputs/FormFields';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import {
  useDeleteAdminProductsByIdMutation,
  useUpdateAdminProductsMutation,
  useGetAdminProductsQuery,
} from '../../../store/api/admin/adminProducts/AdminProducts';

import Loader from '../../../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
export const TotalAdminProducts = () => {
  const { data: ItemData, isLoading, refetch } = useGetAdminProductsQuery();

  const [updateApi] = useUpdateAdminProductsMutation();
  const [deleteApi] = useDeleteAdminProductsByIdMutation();

  const [inventoryData, setInventoryData] = useState<any | undefined>(
    ItemData,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRow, setEditingRow] = useState<number | null>(null);
  // const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!ItemData || !ItemData.length) {
      <Loader />; // Set inventory data to an empty array if no data is available
      return;
    }

    setInventoryData(ItemData); // Keep inventory data updated when the query changes
  }, [ItemData]);

  const handleUpdate = (index: number) => {
    setEditingRow(index);
    // setIsEditing(true);

    // This will set the editing row to the current row index
  };

  const handleSave = async (index: number) => {
    debugger
    const updatedItem = inventoryData[index];
    const updatedData = {
      id: updatedItem._id, // Assuming UniqueID is used for identification
      updates: {
        UniqueID: updatedItem.UniqueID,
        ItemName: updatedItem.ItemName,
        Make: updatedItem.Make,
        ModelNumber: updatedItem.ModelNumber,
        SerialNumber: updatedItem.SerialNumber,

        Quantity: updatedItem.Quantity,

        IssuedTo: updatedItem.IssuedTo,
      },
    };

    try {
      const response = await updateApi(updatedData).unwrap();
      toast.success('Updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      console.log('Update Success:', response);
      setInventoryData({})
       refetch(); // Trigger refetch to update the data after saving
    } catch (error) {
      toast.error(
        'Failed to Update.',
        {
          icon: false,
        },
      );
      console.log('Error:', error);
    }

    setEditingRow(null); // Exit edit mode after saving
  };

  const handleDelete = async (id:any) => {
    try {
      await deleteApi(id).unwrap();
  
      toast.success('Deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
  
      // Update local state to reflect deletion
      setInventoryData((prevData:any) => prevData.filter((item:any) => item._id !== id));
  
      // Ensure the latest data is fetched
      await refetch();
    } catch (error) {
      toast.error('Deletion failed.', {
        icon: false,
      });
      console.error('Delete error:', error);
    }
  };
  

  const handleInputChange = <T extends keyof (typeof inventoryData)[0]>(
    index: number,
    field: T,
    value: string,
  ) => {
    const updatedData = [...inventoryData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setInventoryData(updatedData);
  };

  

 
  
  const addAndCheckCategory = (convertData: any, worksheet: any) => {

    let result: any[] = [];

    // Loop through convertData and attach the matched category ID to each item
    convertData.forEach((item: any, index: number) => {

      // Add row to worksheet for Excel file
      worksheet.addRow({
       UniqueID: item.UniqueID,


       ItemName: item.ItemName,
        Make: item.Make,
        ModelNumber: item.ModelNumber,
        SerialNumber: item.SerialNumber,

        Quantity: item.Quantity,

        IssuedTo: item.IssuedTo,
      });

      // Push the final data with the matched category ID into the result array
      result.push({
        UniqueID: item.UniqueID,
        ItemName: item.ItemName,
        Make: item.Make,
        ModelNumber: item.ModelNumber,
        SerialNumber: item.SerialNumber,
        Quantity: item.Quantity,
        IssuedTo: item.IssuedTo,
      });
    });

    // Return the final result
    return result;
  };

  const downloadExcel = () => {
    ;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory Data');

    worksheet.columns = [
      { header: 'Unique Identity No', key: 'UniqueID', width: 25 },
      { header: 'Item Name', key: 'ItemName', width: 25 },
      { header: 'Make', key: 'Make', width: 20 },
      { header: 'ModelNumber', key: 'ModelNumber', width: 20 },
      { header: 'Serial Number',key: 'SerialNumber',width: 25},

      { header: 'Quantity', key: 'Quantity', width: 15 },
      { header: 'Issued To', key: 'IssuedTo', width: 20 },
    ];
    addAndCheckCategory(inventoryData, worksheet);

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F4CCCC' },
      };
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      row.eachCell((cell: ExcelJS.Cell) => {
        if (rowNumber !== 1) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          if (rowNumber % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'CCFFFF' },
            };
          }
        }
      });
    });

    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'inventory_data.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  //  const data= addAndCheckCategory(inventoryData)
  const filteredData = inventoryData?.filter((item: any) =>
    Object.values(item).some((value: any) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <>
      <Breadcrumb pageName="Total Product" />
      <div className="mb-4 flex items-center justify-between ">
        <FormField
          type="text"
          name="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={downloadExcel}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download Excel
        </button>
      </div>

      <div className="relative overflow-x-auto max-h-[500px]">
        {!isLoading ? (
          <>
            {' '}
            <table className="w-full text-md text-center rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="sticky top-0 bg-gray-200 dark:bg-gray-800 border-gray-300">
                <tr>
                  
                  <th className="px-18 py-6">Unique Identity No</th>
                  <th className="px-18 py-6">Item Name</th>
                  <th className="px-18 py-6">Make</th>
                  <th className="px-18 py-6">Model Number</th>
                  <th className="px-18 py-6">Serial Number</th>
                  <th className="px-18 py-6">Quantity</th>
                  <th className="px-18 py-6">Issued To</th>
                  <th className="px-18 py-6">Actions</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto max-h-[400px]">
                {filteredData &&
                  filteredData.map((item: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        {editingRow === index ? (
                          <>
                           
                            {/* Unique ID */}
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.UniqueID}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'UniqueID',
                                    e.target.value,
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>
                            
                           
                           
                            {/* Asset Name */}
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.ItemName}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'ItemName',
                                    e.target.value,
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.Make}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'Make',
                                    e.target.value,
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.ModelNumber}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'ModelNumber',
                                    e.target.value,
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.SerialNumber}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'SerialNumber',
                                    e.target.value,
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>
                           
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.Quantity}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'Quantity',
                                    e.target.value,
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>
                            
                            
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.IssuedTo}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'IssuedTo',
                                    e.target.value,
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>

                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleSave(index)}
                                className="bg-green-500 text-white py-2 px-4 rounded"
                              >
                                Save
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                          <td className="px-6 py-4">{item.UniqueID}</td>
                           {/* Item Name*/}
                            <td className="px-6 py-4">{item.ItemName}</td>
                            {/* Make ModelNumber */}
                            <td className="px-6 py-4">{item.Make}</td>
                            <td className="px-6 py-4">{item.ModelNumber}</td>
                            {/* Product Serial Number */}
                            <td className="px-6 py-4">
                              {item.SerialNumber}
                            </td>
                           
                            {/* Quantity */}
                            <td className="px-6 py-4">{item.Quantity}</td>
                            
                            
                            {/* Issued To */}
                            <td className="px-6 py-4">{item.IssuedTo}</td>
                            {/* Edit & Delete Buttons */}
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleUpdate(index)}
                                className="bg-yellow-500 text-white py-2 px-4 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="bg-red-500 text-white py-2 px-4 rounded ml-2"
                                disabled={isLoading}
                              >
                                {isLoading ? 'deleting...' : 'Delete'}
                              </button>
                              <ToastContainer />
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <Loader />
          </>
        )}
      </div>
    </>
  );
};

import { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import FormField from '../../../components/Forms/inputs/FormFields';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import {
  useDeleteProductsByIdMutation,
  useGetProductsQuery,
  useUpdateProductsMutation,
} from '../../../store/api/superAdmin/products/productsApi';
import DateRangeField from '../../../components/Forms/DatePicker/DateRange';
import { useGetCategoryQuery } from '../../../store/api/superAdmin/category/categoryApi';
import Loader from '../../../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import { Edit, Trash } from "lucide-react";
export const TotalSuperAdminProducts = () => {
  const { data: inventoryDatas, isLoading, refetch } = useGetProductsQuery();
  const { data: categoryList } = useGetCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateApi] = useUpdateProductsMutation();
  const [deleteApi] = useDeleteProductsByIdMutation();

  const [inventoryData, setInventoryData] = useState<any | undefined>(
    inventoryDatas,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!inventoryDatas || !inventoryDatas.length) {
      <Loader />; // Set inventory data to an empty array if no data is available
      return;
    }

    setInventoryData(inventoryDatas); // Keep inventory data updated when the query changes
  }, [inventoryDatas]);

  const handleUpdate = (index: number) => {
    setEditingRow(index);
    setIsEditing(true);

    // This will set the editing row to the current row index
  };

  const handleSave = async (index: number) => {
    ;
    const updatedItem = inventoryData[index];

    const updatedData = {
      id: updatedItem._id, // Assuming UniqueID is used for identification
      updates: {
        session: {
          SessionStartDate: updatedItem.session.SessionStartDate,
          SessionEndDate: updatedItem.session.SessionEndDate,
        },
        UniqueID: updatedItem.UniqueID,
        PurchaseDate: updatedItem.PurchaseDate,
        InvoiceNumber: updatedItem.InvoiceNumber,
        AssetName: updatedItem.AssetName,
        Make: updatedItem.Make,
        Model: updatedItem.Model,
        ProductSerialNumber: updatedItem.ProductSerialNumber,
        VendorName: updatedItem.VendorName,
        Quantity: updatedItem.Quantity,
        RateIncludingTaxes: updatedItem.RateIncludingTaxes,
        Category: updatedItem.category, // Assuming this is an array or object
        SimilarName: updatedItem.SimilarName,
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
      // refetch(); // Trigger refetch to update the data after saving
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

  const handleDelete = async (id: any) => {
    try {
      await deleteApi(id).unwrap();
      toast.success('Deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      refetch(); // Refetch data after deletion
    } catch (error) {
      toast.error(
        'Deletion failed.',
        {
          icon: false,
        },
      );
      console.log('Delete error:', error);
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

  const handleInputDateChange = (index: number, field: string, value: any) => {
    ;
    setInventoryData((prevData: any) =>
      prevData.map((item: any, i: any) =>
        i === index
          ? {
              ...item,
              session: {
                ...item.session,
                [field]: value, // Extract 'SessionStartDate' or 'SessionEndDate'
              },
            }
          : item,
      ),
    );
  };

  const getYear = (date: Date) => {
    const d = new Date(date);
    return d.getFullYear();
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const addAndCheckCategory = (convertData: any, worksheet: any) => {
    ;
    // Array to store matched category IDs for each item in convertData
    let matchedCategories: any[] = [];

    // Loop through each inventory item to find the matched category
    convertData.forEach((inventoryItem: any) => {
      const matchedCategory = categoryList?.find((category: any) => {
        console.log('Checking category:', category); // Log each category in categoryList
        return category._id === inventoryItem.category;
      });

      // Push the matched category ID to the matchedCategories array
      let matchedAssetName = matchedCategory?.AssetName;
      matchedCategories.push(matchedAssetName); // Store the matched category ID or null if not found
    });

    // New array to store the final result
    let result: any[] = [];

    // Loop through convertData and attach the matched category ID to each item
    convertData.forEach((item: any, index: number) => {
      let matchedAssetName = matchedCategories[index]; // Get the matched ID for the current item
      console.log('Matched Category ID for item:', matchedAssetName);

      // Add row to worksheet for Excel file
      worksheet.addRow({
        session: `${getYear(item.session.SessionStartDate)}/${getYear(
          item.session.SessionEndDate,
        )}`,
        uniqueId: item.UniqueID,
        purchaseDate: formatDate(item.PurchaseDate),
        invoiceNumber: item.InvoiceNumber,
        assetName: item.AssetName,
        Make: item.Make,
        Model: item.Model,
        productSerialNumber: item.ProductSerialNumber,
        vendorName: item.VendorName,
        quantity: item.Quantity,
        rate: item.RateIncludingTaxes,
        category: matchedAssetName, // Use matched category ID for the row
        similarName: item.SimilarName,
        issuedTo: item.IssuedTo,
      });

      // Push the final data with the matched category ID into the result array
      result.push({
        session: {
          SessionStartDate: item.session.SessionStartDate,
          SessionEndDate: item.session.SessionEndDate,
        },
        UniqueID: item.UniqueID,
        PurchaseDate: item.PurchaseDate,
        InvoiceNumber: item.InvoiceNumber,
        AssetName: item.AssetName,
        Make: item.Make,
        Model: item.Model,
        ProductSerialNumber: item.ProductSerialNumber,
        VendorName: item.VendorName,
        Quantity: item.Quantity,
        RateIncludingTaxes: item.RateIncludingTaxes,
        SimilarName: item.SimilarName,
        category: matchedAssetName, // Assign the matched category ID
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
      { header: 'Session Date', key: 'session', width: 20 },
      { header: 'Unique Identity No', key: 'uniqueId', width: 25 },
      { header: 'Purchase Date', key: 'purchaseDate', width: 20 },
      { header: 'Invoice Number', key: 'invoiceNumber', width: 20 },
      { header: 'Asset Name', key: 'assetName', width: 25 },
      { header: 'Make', key: 'Make', width: 20 },
      { header: 'Model', key: 'Model', width: 20 },
      {
        header: 'Product Serial Number',
        key: 'productSerialNumber',
        width: 25,
      },
      { header: 'Vendor Name', key: 'vendorName', width: 25 },
      { header: 'Quantity', key: 'quantity', width: 15 },
      { header: 'Rate (Including Taxes)', key: 'rate', width: 20 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Similar Name', key: 'similarName', width: 20 },
      { header: 'Issued To', key: 'issuedTo', width: 20 },
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
            <table className="w-full text-md text-center rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="sticky top-0 bg-gray-200 dark:bg-gray-800 border-gray-300">
                <tr>
                  <th className="px-18 py-6">Session Date</th>
                  <th className="px-18 py-6">Unique Identity No</th>
                  <th className="px-18 py-6">Purchase Date</th>
                  <th className="px-18 py-6">Invoice Number</th>
                  <th className="px-18 py-6">Asset Name</th>
                  <th className="px-18 py-6">Make</th>
                  <th className="px-18 py-6">Model</th>
                  <th className="px-18 py-6">Product Serial Number</th>
                  <th className="px-18 py-6">Vendor Name</th>
                  <th className="px-18 py-6">Quantity</th>
                  <th className="px-18 py-6">Rate (Including Taxes)</th>
                  <th className="px-18 py-6">Category</th>
                  <th className="px-18 py-6">Similar Name</th>
                  <th className="px-18 py-6">Issued To</th>
                  <th className="px-18 py-6">Actions</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto max-h-[400px]">
                {filteredData &&
                  filteredData.map((item: any, index: number) => {
                  const matchedCategory = categoryList?.find(
                      (category: any) => {
                        console.log('Checking category:', category); 
                        return category._id === item.category;
                      },
                    );
                    let matchedAssetName = matchedCategory?.AssetName;

                    return (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        {editingRow === index ? (
                          <>
                            <td className="px-6 py-4">

                              <DateRangeField
                                label="Session Date (Start - End)"
                                startDate={
                                  item.session?.SessionStartDate
                                    ? new Date(item?.session?.SessionStartDate)
                                        .toISOString()
                                        .split('T')[0]
                                    : ''
                                }
                                endDate={
                                  item.session?.SessionEndDate
                                    ? new Date(item?.session?.SessionEndDate)
                                        .toISOString()
                                        .split('T')[0]
                                    : ''
                                }
                                onStartDateChange={(e) =>
                                  handleInputDateChange(
                                    index,
                                    'SessionStartDate',
                                    e.target.value,
                                  )
                                }
                                onEndDateChange={(e) =>
                                  handleInputDateChange(
                                    index,
                                    'SessionEndDate',
                                    e.target.value,
                                  )
                                }
                                isEditing={isEditing}
                              />
                            </td>
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
                            {/* Purchase Date */}
                            <td className="px-6 py-4">
                              <input
                                type="date"
                                value={
                                  new Date(item.PurchaseDate)
                                    .toISOString()
                                    .split('T')[0]
                                }
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'PurchaseDate',
                                    new Date(e.target.value).toISOString(),
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>
                            {/* Invoice Number */}
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.InvoiceNumber}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'InvoiceNumber',
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
                                value={item.AssetName}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'AssetName',
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
                                value={item.Model}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'Model',
                                    e.target.value,
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.ProductSerialNumber}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'ProductSerialNumber',
                                    e.target.value,
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.VendorName}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'VendorName',
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
                                value={item.RateIncludingTaxes}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'RateIncludingTaxes',
                                    e.target.value,
                                  )
                                }
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={matchedAssetName}
                                readOnly
                                className="w-[150px] rounded-lg border-[1.5px] border-stroke bg-gray-200 py-3 px-5 text-black outline-none transition   disabled:cursor-default disabled:bg-gray-200 dark:border-form-strokedark dark:bg-gray-700 dark:text-white  dark:disabled:bg-gray-800"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                value={item.SimilarName}
                                onChange={(e: any) =>
                                  handleInputChange(
                                    index,
                                    'SimilarName',
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
                            {/* Combined StartDate and EndDate Column */}
                            <td className="px-6 py-4">
                              {
                                getYear(item?.session?.SessionStartDate)
                              }
                              
                              {
                                getYear(item?.session?.SessionEndDate)
                              }
                            </td>
                            

                            {/* Unique ID */}
                            <td className="px-6 py-4">{item?.UniqueID}</td>
                            {/* Purchase Date */}
                            <td className="px-6 py-4">
                              {
                                new Date(item.PurchaseDate)
                                  .toISOString()
                                  .split('T')[0]
                              }
                            </td>
                            {/* Invoice Number */}
                            <td className="px-6 py-4">{item.InvoiceNumber}</td>
                            {/* Asset Name */}
                            <td className="px-6 py-4">{item.AssetName}</td>
                            {/* Make Model */}
                            <td className="px-6 py-4">{item.Make}</td>
                            <td className="px-6 py-4">{item.Model}</td>
                            {/* Product Serial Number */}
                            <td className="px-6 py-4">
                              {item.ProductSerialNumber}
                            </td>
                            {/* Vendor Name */}
                            <td className="px-6 py-4">{item.VendorName}</td>
                            {/* Quantity */}
                            <td className="px-6 py-4">{item.Quantity}</td>
                            {/* Rate Including Taxes */}
                            <td className="px-6 py-4">
                              {item.RateIncludingTaxes}
                            </td>
                            {/* Category */}
                            <td className="px-6 py-4"> {matchedAssetName}</td>

                            {/* Similar Name */}
                            <td className="px-6 py-4">{item.SimilarName}</td>
                            {/* Issued To */}
                            <td className="px-6 py-4">{item.IssuedTo}</td>
                            {/* Edit & Delete Buttons */}
                            {/* <td className="px-6 py-4">
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
 */}

                            {/* <div className="flex space-x-2"> */}
                            <td className="px-6 py-4">
                <button
                 onClick={() => handleUpdate(index)}
                  className="p-1 rounded text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                 onClick={() => handleDelete(item._id)}
                  className="p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-800"
                >
                  <Trash className="w-4 h-4" />
                </button>
                </td>
              {/* </div> */}
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

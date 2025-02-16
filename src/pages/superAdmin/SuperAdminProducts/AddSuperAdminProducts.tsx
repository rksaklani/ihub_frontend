import React, { useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import FormField from '../../../components/Forms/inputs/FormFields';
import DateRangeField from '../../../components/Forms/DatePicker/DateRange';
import { useCreateProductsMutation, useGetProductsQuery } from '../../../store/api/superAdmin/products/productsApi';
import { useGetCategoryQuery } from '../../../store/api/superAdmin/category/categoryApi';
import DropDown from '../../../components/Forms/DropDown/DropDown';
import * as XLSX from 'xlsx';
// import YearRangePicker from "../../../components/Forms/YearDateRange/Yeardaterange";

export const AddSuperAdminProducts = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState();
  const [createProduct, { isLoading, isSuccess }] =
    useCreateProductsMutation();
  const { data: categoryList } = useGetCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const {  refetch } = useGetProductsQuery();

  const [formData, setFormData] = useState<any>({
    session:{
      sessionStartDate: '',
    sessionEndDate: '',
    },
    uniqueID: '',
    purchaseDate: '',
    InvoiceNumber: '',
    assetName: '',
    Make: '',
    Model: '',
    productSerialNumber: '',
    vendorName: '',
    quantity: '',
    rateIncludingTaxes: '',
    similarName: '',
    issuedTo: '',
    category: '',
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory((prevData) => ({ ...prevData, category: value }));
    setFormData((prevData) => ({ ...prevData, category: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    
    const ff= selectedCategory?.category
    console.log(ff)
    // const matchedCategory: any =
    //   categoryList &&
    //   categoryList?.find(
    //     (category) =>
    //       category?.AssetName.trim().toLowerCase() ===
    //       formData.assetName.trim().toLowerCase(),
    //   );

    e.preventDefault();
  if(selectedCategory!== undefined){
    const productData = {
      session:{
      sessionStartDate: formData.session.sessionStartDate,
      sessionEndDate: formData.session.sessionEndDate,
      },
      UniqueID: formData.uniqueID,
      PurchaseDate: formData.purchaseDate,
      InvoiceNumber: formData.InvoiceNumber,
      AssetName: formData.assetName,
      Model: formData.Model,
      Make: formData.Make,
      ProductSerialNumber: formData.productSerialNumber,
      VendorName: formData.vendorName,
      Quantity: Number(formData.quantity),
      RateIncludingTaxes: Number(formData.rateIncludingTaxes),
      SimilarName: formData.similarName,
      IssuedTo: formData.issuedTo,
      category: selectedCategory?.category,
    };
    try {
      const fixedProductData = {
        ...productData,
        session:{
          SessionStartDate: new Date(productData.session.sessionStartDate),
          SessionEndDate: new Date(productData.session.sessionEndDate),
        },
        PurchaseDate: new Date(productData.PurchaseDate) || undefined,
      };
      const response = await createProduct(fixedProductData).unwrap();
      setFormData([{}])
      refetch()
      console.log('Product created successfully:', response);
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  }
   

  };


  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
  
    setFormData((prevData) => ({
      ...prevData,
      session: {
        ...prevData.session, // Preserve other session fields
        sessionStartDate: value, // Update only SessionStartDate
      },
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      session: {
        ...prevData.session, // Preserve other session fields
        sessionEndDate: value, // Update only SessionStartDate
      },
    }));
  };



// const convertYearRangeToDates=(sessionDates:any)=>{
//   const years = sessionDates; // Split "2024/2025" into ["2024", "2025"]
  
//   if (years.length !== 2) {
//     console.error("Invalid input format");
//     return null;
//   }
//   const startDate = new Date(`${years[0]}-04-01T00:00:00.000Z`).toISOString();
//   const endDate = new Date(`${years[1]}-03-01T00:00:00.000Z`).toISOString();
//   return { startDate, endDate };
// };
const convertYearRangeToDates = (sessionDates: any) => {
  const years = sessionDates; // Split "2024/2025" into ["2024", "2025"]
  
  // Check if the array length is exactly 2
  if (years.length !== 2 || !years[0] || !years[1]) {
    console.error("Invalid session dates format:", sessionDates);
    return { startDate: null, endDate: null }; // Return default null values for invalid input
  }
  
  // Try to create valid Date objects for the start and end dates
  const startDate = new Date(`${years[0]}-04-01T00:00:00.000Z`).toISOString();
  const endDate = new Date(`${years[1]}-03-01T00:00:00.000Z`).toISOString();
  
  // If the date values are invalid, log and return null
  if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
    console.error("Invalid date values:", { startDate, endDate });
    return { startDate: null, endDate: null };
  }
  
  return { startDate, endDate };
};


// const formatDate=(dateStr:any)=> {
//  // Split the input date string into day, month, and year
//  const [day, month, year] = dateStr.split('/');
    
//  // Create a new date object in the format "YYYY-MM-DD"
//  const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
 
//  // Return the ISO string in the desired format
//  return date.toISOString(); // Format as "DD-MM-YYYY"
// }


// const formatDate = (dateStr: any) => {
//   // Check if the input date string is a valid date format
//   if (!dateStr || typeof dateStr !== 'string' || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
//     console.error("Invalid date string format:", dateStr);
//     return null; // Return null for invalid date formats
//   }

//   const [day, month, year] = dateStr.split('/');
    
//   // Create a new date object in the format "YYYY-MM-DD"
//   const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

//   if (isNaN(date.getTime())) {
//     console.error("Invalid Date:", dateStr);
//     return null; // Return null for invalid date
//   }

//   // Return the ISO string in the desired format
//   return date.toISOString(); // Format as "DD-MM-YYYY"
// };

// const convertExcelSerialToDate = (serial:any) => {
//   const date = new Date((serial - 25569) * 86400 * 1000);
//   return date.toLocaleDateString("en-GB"); // "18/06/2021"
// };


// const convertExcelSerialToDate = (serial: any) => {
//   if (typeof serial !== "number") {
//     throw new Error("Input should be a number");
//   }
//   const date = new Date((serial - 25569) * 86400 * 1000);
//   return date.toLocaleDateString("en-GB"); // "18/06/2021"
// };


const convertExcelSerialToDate = (serial: any) => {
  if (serial === undefined) {
    console.log("All serial numbers are completed.");
    return null; // Stop further execution
  }
  if (typeof serial !== "number") {
    throw new Error("Input should be a number");
  }
  const date = new Date((serial - 25569) * 86400 * 1000);
  return date.toLocaleDateString("en-GB");
};

const formatDate = (dateStr: any) => {
  if (!dateStr || typeof dateStr !== "string" || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    return null; // Return null for invalid date formats
  }

  const [day, month, year] = dateStr.split('/');
  const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

  return isNaN(date.getTime()) ? null : date.toISOString();
};

// Example Usage
const serialNumbers = [44444, 44445, undefined, 44446];

for (const serial of serialNumbers) {
  const formattedDate = convertExcelSerialToDate(serial);
  if (formattedDate === null) break;
  console.log("Converted Date:", formatDate(formattedDate));
}

const convertJsonToModelData = (jsonData:any) => {
  return jsonData.map((item:any) => {
    const sessionDates = item['Session Date']?.split('/') || []; 
  const { startDate, endDate } = convertYearRangeToDates(sessionDates);
  const sessionStartDate = startDate;
   const sessionEndDate = endDate;
   console.log("Purchase",item['Purchase Date'])
   const  changeDateformat=convertExcelSerialToDate(item['Purchase Date'])
   console.log("purchaseDates",changeDateformat)
 const purchaseDates = formatDate(changeDateformat);
 console.log("purchaseDates",purchaseDates)
    return {
      session: {
        SessionStartDate: sessionStartDate,
        SessionEndDate: sessionEndDate,
      },
      UniqueID: item['Unique Identity No'],
      PurchaseDate: purchaseDates,
      InvoiceNumber: item['Invoice Number'],
      AssetName: item['Asset Name'],
      Make: item.Make,
      Model: item.Model,
      ProductSerialNumber: item['Product Serial Number'],
      VendorName: item['Vendor Name'],
      Quantity: item.Quantity,
      RateIncludingTaxes: item['Rate (Including Taxes)'],
      SimilarName: item['Similar Name'],
      category: item.Category, // You may need to look up the category ID based on this value
      IssuedTo: item['Issued To'],
    };
  });
};


const addAndCheckCategory = (convertData: any) => {
  
  // Array to store matched category IDs for each item in convertData
  let matchedCategories: any[] = [];

  // Loop through each inventory item to find the matched category
  convertData && convertData.forEach((inventoryItem: any) => {
    const matchedCategory = categoryList&&categoryList?.find((category: any) => {
      console.log("Checking category:", category); // Log each category in categoryList
      return category.AssetName === inventoryItem.category;
    });

    // Push the matched category ID to the matchedCategories array
    let matchedId = matchedCategory?._id;
    matchedCategories.push(matchedId); // Store the matched category ID or null if not found
  });

  // Map through convertData and attach the matched category ID to each item
  return convertData.map((item: any, index: number) => {
    let matchedId = matchedCategories[index]; // Get the matched ID for the current item
    console.log("Matched Category ID for item:", matchedId);

    return {
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
      category: matchedId, // Assign the matched category ID
      IssuedTo: item.IssuedTo,
    };
  });
};


const handleFileUpload = async (event:any) => {
  
const file = event.target.files?.[0]; // Get uploaded file
setSelectedFile(file);
  if (!file) {
    alert('Please upload a valid Excel file.');
    return;
  }

  try {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let jsonData = XLSX.utils.sheet_to_json(sheet);
      let convertData=convertJsonToModelData(jsonData)
      let isCategory=addAndCheckCategory(convertData)
      console.log('Parsed Excel Data:', convertData);
      console.log('Parsed Excel Data:', isCategory);
        try {
          await createProduct(isCategory).unwrap();
          console.log('Product uploaded successfully:', isCategory);
          alert('File uploaded and processed successfully!');
          setFormData([{}])
          refetch()
        } catch (error) {
          console.error('Error uploading product:', error);
        }
    };

    reader.readAsBinaryString(file);
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('An error occurred while uploading the file.');
  }
};

const handleUploadClick = () => {
  if (!selectedFile) {
    alert("Please select a file first!");
    return;
  }
};


  return (
    <>
      <Breadcrumb pageName="Add Product" />

      <div className="grid grid-cols-1">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col gap-5.5 p-6.5">
 
            <div className="flex items-center">
              {' '}
              {/* Flex container for input and button */}
              <input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="flex-1 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
              />
              <button
                className="flex-1 ml-4 rounded bg-primary py-4 font-medium text-white hover:bg-opacity-90"
                type="submit"
       onClick={handleUploadClick}

              >
                Upload your file
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4"></div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex flex-col gap-5.5 p-6.5">
                <DateRangeField
                  label="Session Date (Start - End)"
                  startDate={formData.session.sessionStartDate}
                  endDate={formData.session.sessionEndDate}
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                  isEditing={true}
                />

                <FormField
                  label="Unique ID"
                  type="text"
                  placeholder="Unique ID"
                  name="uniqueID"
                  value={formData.uniqueID}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Purchase Date"
                  type="date"
                  placeholder="Purchase Date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Invoice Number"
                  type="text"
                  placeholder="Invoice Number"
                  name="InvoiceNumber"
                  value={formData.InvoiceNumber}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Asset Name"
                  type="text"
                  placeholder="Asset Name"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Make"
                  type="text"
                  placeholder="Make"
                  name="Make"
                  value={formData.Make}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Model"
                  type="text"
                  placeholder="Model"
                  name="Model"
                  value={formData.Model}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Product Serial Number"
                  type="text"
                  placeholder="Product Serial Number"
                  name="productSerialNumber"
                  value={formData.productSerialNumber}
                  onChange={handleInputChange}
                />
                {/* <FormField
                  label="Serial Number"
                  type="text"
                  placeholder="Product Serial Number"
                  name="productSerialNumber"
                  value={formData.productSerialNumber}
                  onChange={handleInputChange}
                /> */}
                <FormField
                  label="Vendor Name"
                  type="text"
                  placeholder="Vendor Name"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex flex-col gap-5.5 p-7.5">
                <FormField
                  label="Quantity"
                  type="number"
                  placeholder="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Rate (Including Taxes)"
                  type="number"
                  placeholder="Rate (Including Taxes)"
                  name="rateIncludingTaxes"
                  value={formData.rateIncludingTaxes}
                  onChange={handleInputChange}
                />
                <DropDown
                  label="Category"
                  options={categoryList}
                  placeholder="Select an option"
                  onChange={handleCategoryChange}
                  buttonInUse={true}
                  // refresh={refresh}
                />
                <FormField
                  label="Similar Name"
                  type="text"
                  placeholder="Similar Name"
                  name="similarName"
                  value={formData.similarName}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Issued To"
                  type="text"
                  placeholder="Issued To"
                  name="issuedTo"
                  value={formData.issuedTo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end p-6">
                <button
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                  type="submit"
                  // disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {isSuccess && (
          <p className="text-green-500">Product added successfully!</p>
        )}
        {/* {isError && <p className="text-red-500">Error: {error?.data?.message || "Something went wrong!"}</p>} */}
      </form>
    </>
  );
};

import React, { useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import FormField from '../../../components/Forms/inputs/FormFields';
import { useCreateAdminProductsMutation,useGetAdminProductsQuery } from '../../../store/api/admin/adminProducts/AdminProducts';

import * as XLSX from 'xlsx';

export const AddAdminProducts = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [createProduct, { isLoading, isSuccess }] =
    useCreateAdminProductsMutation();
 
  const {  refetch } = useGetAdminProductsQuery();

  const [formData, setFormData] = useState<any>({
    UniqueID: '',
    ItemName: '',
    Make: '',
    ModelNumber: '',
    SerialNumber: '',
    Quantity: '',
    IssuedTo: '',

  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };



  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    debugger

    e.preventDefault();
 
    const productData = {

      UniqueID: formData.UniqueID,
      ItemName: formData.ItemName,
      ModelNumber: formData.ModelNumber,
      Make: formData.Make,
      SerialNumber: formData.SerialNumber,
      Quantity: Number(formData.Quantity),
      IssuedTo: formData.IssuedTo
    };
    try {
      console.log(productData)
     
      const response = await createProduct(productData).unwrap();
      setFormData([{}])
      refetch()
      console.log('Product created successfully:', response);
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  
   

  };


  const convertJsonToModelData = (jsonData:any) => {
    return jsonData.map((item:any) => {
      return {
        UniqueID: item['Unique Identity No'],
        ItemName: item['Item Name'],
        Make: item.Make,
        ModelNumber: item['Model Number'],
        SerialNumber: item['Serial Number'],
        Quantity: item.Quantity,
        IssuedTo: item['Issued To'],
      };
    });
  };
  
  const handleFileUpload = (event:any) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store file but do nothing yet
    }
  };
  
  const processFile = async (file:any) => {
    try {
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(sheet);
        let modelData = convertJsonToModelData(jsonData);
  
        try {
          await createProduct(modelData).unwrap();
          console.log('Product uploaded successfully:', modelData);
          alert('File uploaded and processed successfully!');
          setFormData([{}]);
          refetch();
        } catch (error) {
          console.error('Error uploading product:', error);
        }
      };
  
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('An error occurred while processing the file.');
    }
  };
  
  const handleUploadClick = () => {
    debugger
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }
  
    processFile(selectedFile); // Process only on button click
  };


  return (
    <>
      <Breadcrumb pageName="Add Product" />

      <div className="grid grid-cols-1">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col gap-5.5 p-6.5">
 
            <div className="flex items-center">

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
                

                <FormField
                  label="Unique ID"
                  type="text"
                  placeholder="Unique ID"
                  name="UniqueID"
                  value={formData.UniqueID}
                  onChange={handleInputChange}
                />
               
                <FormField
                  label="Item Name"
                  type="text"
                  placeholder="Item Name"
                  name="ItemName"
                  value={formData.ItemName}
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
                  label="ModelNumber"
                  type="text"
                  placeholder="ModelNumber"
                  name="ModelNumber"
                  value={formData.ModelNumber}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Serial Number"
                  type="text"
                  placeholder="Serial Number"
                  name="SerialNumber"
                  value={formData.SerialNumber}
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
                  name="Quantity"
                  value={formData.Quantity}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Issued To"
                  type="text"
                  placeholder="Issued To"
                  name="IssuedTo"
                  value={formData.IssuedTo}
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

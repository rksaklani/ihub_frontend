import { useState } from "react";
import FormField from "../../../components/Forms/inputs/FormFields";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";

export const  BuyNewAdminProducts=()=> {
  const [product, setProduct] = useState({
    uniqueID: "",
    vendorName: "",
    name: "",
    category: "",
    price: "",
    purchaseDate: "",
    deliveryDate: "",
    invoiceNumber: "",
    platform: "",
    invoiceFile: null, // To store the uploaded invoice
  });

  const [productList, setProductList] = useState([]); // Store all products locally

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProduct((prevState) => ({
      ...prevState,
      invoiceFile: e.target.files[0], // Store the selected file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate saving invoice to backend
    if (product.invoiceFile) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(product.invoiceFile);
      fileReader.onload = () => {
        const invoiceData = fileReader.result; // Base64 encoded file
        console.log("Invoice uploaded:", invoiceData);
      };
    }

    setProductList((prevList) => [...prevList, product]); // Add product to the list
    setProduct({
      uniqueID: "",
      vendorName: "",
      name: "",
      category: "",
      price: "",
      purchaseDate: "",
      deliveryDate: "",
      invoiceNumber: "",
      platform: "",
      invoiceFile: null,
    }); // Reset form
  };

  return (
    <div>
      <Breadcrumb pageName="Buy New Products" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-5.5 p-6.5">
              <form onSubmit={handleSubmit}>
                <FormField
                  label="Unique ID"
                  type="text"
                  name="uniqueID"
                  value={product.uniqueID}
                  onChange={handleChange}
                  placeholder="Unique ID"
                />
                <FormField
                  label="Vendor Name"
                  type="text"
                  name="vendorName"
                  value={product.vendorName}
                  onChange={handleChange}
                  placeholder="Vendor Name"
                />
                <FormField
                  label="Product Name"
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                />
                <FormField
                  label="Category"
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  placeholder="Category"
                />
                <FormField
                  label="Price"
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  placeholder="Price"
                />
                <FormField
                  label="Purchase Date"
                  type="date"
                  name="purchaseDate"
                  value={product.purchaseDate}
                  onChange={handleChange}
                />
                <FormField
                  label="Delivery Date"
                  type="date"
                  name="deliveryDate"
                  value={product.deliveryDate}
                  onChange={handleChange}
                />
                <FormField
                  label="Invoice Number"
                  type="text"
                  name="invoiceNumber"
                  value={product.invoiceNumber}
                  onChange={handleChange}
                  placeholder="Invoice Number"
                />
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Upload Invoice
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-stroke rounded"
                  />
                </div>

                <div className="flex justify-end p-6">
                  <button
                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">Product List</h2>
          <table className="min-w-full border-collapse border border-stroke">
            <thead>
              <tr>
                <th className="border border-stroke px-4 py-2">Unique ID</th>
                <th className="border border-stroke px-4 py-2">Vendor Name</th>
                <th className="border border-stroke px-4 py-2">Name</th>
                <th className="border border-stroke px-4 py-2">Category</th>
                <th className="border border-stroke px-4 py-2">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((prod, index) => (
                <tr key={index}>
                  <td className="border border-stroke px-4 py-2">
                    {prod.uniqueID}
                  </td>
                  <td className="border border-stroke px-4 py-2">
                    {prod.vendorName}
                  </td>
                  <td className="border border-stroke px-4 py-2">{prod.name}</td>
                  <td className="border border-stroke px-4 py-2">
                    {prod.category}
                  </td>
                  <td className="border border-stroke px-4 py-2">
                    {prod.invoiceFile ? (
                      <a
                        href={URL.createObjectURL(prod.invoiceFile)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        View Invoice
                      </a>
                    ) : (
                      "No Invoice"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

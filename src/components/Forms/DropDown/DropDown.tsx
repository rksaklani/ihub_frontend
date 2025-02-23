import React, { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { useCreateCategoryMutation, useDeleteCategoryByIdMutation, useUpdateCategoryMutation, useGetCategoryQuery } from "../../../store/api/superAdmin/category/categoryApi";
import ClickOutside from "../../ClickOutside";
import { Category } from '../../../store/api/superAdmin/category/categoryApi';

interface Option {
  _id: string;
  value: string;
  label: string;
  AssetName: string;
}

interface DropDownProps {
  label: string;
  options: Category | undefined;
  placeholder?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  buttonInUse?: boolean;
}

const DropDown: React.FC<DropDownProps> = ({
  label,
  options,
  placeholder = "Select an option",
  onChange,
  defaultValue = "",
  buttonInUse,
}) => {
  const {refetch } = useGetCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  }); // Fetch categories
  const [deleteCategoryById] = useDeleteCategoryByIdMutation();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editOption, setEditOption] = useState<Option | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>(""); // State for new category name
  const [dropdownOpen, setDropdownOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const handleSelectChange = (value: string, assetName: string) => {
    setSelectedOption(assetName);
    onChange(value);
    setDropdownOpen(false);
  };

  const handleEdit = (option: Option) => {
    setEditOption(option);
    setNewCategoryName(option.AssetName); // Set the input to the current asset name
    setIsPopupOpen(true);
  };

  const handleAddCategory = async () => {
    debugger
    // if (newCategoryName.trim() === "") return; // Prevent empty category creation
    if (!selectedCategory || !newCategoryName) {
      alert("Please select a category and enter an asset name.");
      return;
    }
    const payload: any = {
      [`CategoryType.${selectedCategory}.AssetName`]: newCategoryName,
    };
    try {
      const response = await createCategory(payload).unwrap();
      console.log('Category Created:', response);
      setIsPopupOpen(false);
      setNewCategoryName(""); // Reset input
      refetch(); // Refresh categories after creation
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editOption || newCategoryName.trim() === "") return; // Prevent empty updates
    const updatedData:any = {
      id: editOption._id,
      updates: { AssetName: newCategoryName },
    };

    try {
     await updateCategory(updatedData).unwrap();
 
      setIsPopupOpen(false);
      setEditOption(null); // Reset edit option
      setNewCategoryName(""); // Reset input
      refetch(); // Refresh categories after update
    } catch (error) {
      console.log('Error updating category:', error);
    }
  };

  const handleCancelPopup = () => {
    setEditOption(null);
    setIsPopupOpen(false);
    setNewCategoryName(""); // Reset input
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategoryById(categoryId).unwrap();
      console.log("Category deleted successfully");
      refetch(); // Refresh categories after deletion
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const categories = ["Tangible", "InTangible"];


  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <label className="mb-2.5 block text-black dark:text-white">{label}</label>

      <div
        className="relative z-20 bg transparent dark:bg-form-input"
        onClick={toggleDropdown}
      >
        <div
          className={`relative z-20 w-full rounded border border-stroke bg-white py-3 px-5 cursor-pointer outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
        >
          {selectedOption
            ? options?.find((option) => option.AssetName === selectedOption)?.AssetName || placeholder
            : placeholder}
        </div>
      </div>

      {dropdownOpen && (
  <ul className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto rounded border border-stroke bg-white p-2 shadow-lg dark:border-form-strokedark dark:bg-form-input">
    
    {/* 🟢 Tangible Assets */}
    <li className="px-2 py-1 font-bold text-black dark:text-white">Tangible</li>
    {options
      ?.filter((option: any) => option?.CategoryType?.Tangible) // सिर्फ Tangible दिखाएँ
      ?.map((option: any) => (
        <li
          key={option._id}
          className="flex justify-between items-center rounded bg-white p-2 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
          onClick={() => handleSelectChange(option._id, option.CategoryType.Tangible.AssetName)}
        >
          <span className="text-sm text-black dark:text-white">
            {option?.CategoryType?.Tangible?.AssetName}
            {console.log(option)}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(option);
              }}
              className="p-1 rounded text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(option._id);
              }}
              className="p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-800"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </li>
      ))}

    {/* 🔴 In-Tangible Assets */}
    <li className="px-2 py-1 font-bold text-black dark:text-white">In-Tangible</li>
    {options
      ?.filter((option: any) => option?.CategoryType?.InTangible) // सिर्फ InTangible दिखाएँ
      ?.map((option: any) => (
        <li
          key={option._id}
          className="flex justify-between items-center rounded bg-white p-2 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
          onClick={() => handleSelectChange(option._id, option.CategoryType.InTangible.AssetName)}
        >
          <span className="text-sm text-black dark:text-white">
            {option?.CategoryType?.InTangible?.AssetName}
            {console.log(option?.CategoryType?.InTangible?.AssetName)}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(option);
              }}
              className="p-1 rounded text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(option._id);
              }}
              className="p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-800"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </li>
      ))}
  </ul>
)}


      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold text-black dark:text-white">
              {editOption ? "Edit Category" : "Add New Category"}
            </h2>
            <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="w-full rounded border border-stroke py-3 px-4 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
    >
      <option value="">Choose a category</option>
      {categories.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </select>
            <label className="mb-2.5 block text-black dark:text-white">Asset Name</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter Asset Name"
              className="w-full rounded border border-stroke py-3 px-4 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleCancelPopup}
                className="rounded bg-gray-300 py-2 px-4 text-black hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={editOption ? handleSaveEdit : handleAddCategory}
                className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark"
              >
                {editOption ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {buttonInUse && (
        <button
          onClick={() => {
            setIsPopupOpen(true);
            setEditOption(null);
            setNewCategoryName(""); // Reset input for new category
          }}
          className="mt-3 rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark"
        >
          Add Category
        </button>
      )}
    </ClickOutside>
  );
};

export default DropDown;
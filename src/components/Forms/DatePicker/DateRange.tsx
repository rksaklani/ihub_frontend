// import React from 'react';

// interface DateRangeFieldProps {
//   label?: string;
//   startDate: string;
//   endDate: string;
//   onStartDateChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onEndDateChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   isEditing?: boolean; // Optional flag to indicate edit mode
// }

// const DateRangeField: React.FC<DateRangeFieldProps> = ({
//   label,
//   startDate,
//   endDate,
//   onStartDateChange,
//   onEndDateChange,
//   isEditing = false, // Default is false
// }) => {
//   console.log("startDate",startDate)
//   return (
//     <div>
//       {label && <label className="mb-3 block text-black dark:text-white">{label}</label>}
//       <div className="flex items-center">
//         {/* Start Date */}
//         <div className="relative w-full">
//           <input
//             type="date"
//             name="sessionStartDate" // Set name attribute for start date
//             value={startDate}
//             onChange={onStartDateChange} // Pass event directly
//             className={`w-full rounded-lg border-[1.5px] ${
//               isEditing ? 'border-primary' : 'border-stroke'
//             } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black`}
//             placeholder="Start Date"
//             disabled={!isEditing} // Disable input if not editing
//           />
//         </div>

//         {/* Separator */}
//         <span className="mx-4 text-gray-500">to</span>

//         {/* End Date */}
//         <div className="relative w-full">
//           <input
//             type="date"
//             name="sessionEndDate" // Set name attribute for end date
//             value={endDate}
//             onChange={onEndDateChange} // Pass event directly
//             className={`w-full rounded-lg border-[1.5px] ${
//               isEditing ? 'border-primary' : 'border-stroke'
//             } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black`}
//             placeholder="End Date"
//             disabled={!isEditing} // Disable input if not editing
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DateRangeField;

import React from 'react';

interface DateRangeFieldProps {
  label?: string;
  startDate: string;
  endDate: string;
  onStartDateChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing?: boolean;
}

const DateRangeField: React.FC<DateRangeFieldProps> = ({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  isEditing = false,
}) => {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-black dark:text-white">{label}</label>}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
        {/* Start Date */}
        <div className="relative w-full sm:w-1/2 flex-1">
          <input
            type="date"
            name="sessionStartDate"
            value={startDate}
            onChange={onStartDateChange}
            className={`w-full rounded-lg border-[1.5px] ${
              isEditing ? 'border-primary' : 'border-stroke'
            } bg-transparent px-3 py-2 sm:px-5 sm:py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-100 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-gray-800`}
            placeholder="Start Date"
            disabled={!isEditing}
          />
        </div>

        {/* Separator */}
        <span className="text-gray-500">to</span>

        {/* End Date */}
        <div className="relative w-full sm:w-1/2 flex-1">
          <input
            type="date"
            name="sessionEndDate"
            value={endDate}
            onChange={onEndDateChange}
            className={`w-full rounded-lg border-[1.5px] ${
              isEditing ? 'border-primary' : 'border-stroke'
            } bg-transparent px-3 py-2 sm:px-5 sm:py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-100 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-gray-800`}
            placeholder="End Date"
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeField;

import React, { useState, useEffect } from "react";

interface YearRangePickerProps {
  minYear?: number; // Minimum year to display in the dropdown (default: 2010)
  onRangeSelect: (range: { sessionStartDate: number | null; sessionEndDate: number | null }) => void; // Callback to return selected range
}

const YearRangePicker: React.FC<YearRangePickerProps> = ({
  minYear = 2010, // Default minimum year is 2010
  onRangeSelect,
}) => {
  const currentYear = new Date().getFullYear();
  const [sessionStartDate, setSessionStartDate] = useState<number | null>(null); // Starting year state
  const [sessionEndDate, setSessionEndDate] = useState<number | null>(null); // Ending year state
  const [maxYear, setMaxYear] = useState<number>(currentYear + 1); // Max year dynamic state
  
  // Generate an array of years within the range (from minYear to maxYear)
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

  useEffect(() => {
    // Update maxYear dynamically as we move into the next year
    const newYear = new Date().getFullYear();
    setMaxYear(newYear + 1); // Set maxYear to current year + 1
  }, [currentYear]);

  const handlesessionStartDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    setSessionStartDate(year);
    const newsessionEndDate = year + 1; // Automatically set sessionEndDate to next year
    setSessionEndDate(newsessionEndDate); // Automatically set the end year when start year is selected
    onRangeSelect({ sessionStartDate: year, sessionEndDate: newsessionEndDate });
  };

  const handlesessionEndDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    setSessionEndDate(year);
    onRangeSelect({ sessionStartDate: sessionStartDate || null, sessionEndDate: year });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        {/* Start Year Dropdown */}
        <div>
          <label htmlFor="sessionStartDate" className="block text-sm font-medium">
            Start Year
          </label>
          <select
            id="sessionStartDate"
            value={sessionStartDate || ""}
            onChange={handlesessionStartDateChange}
            className="bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"

          >
            <option value="" disabled>
              Select Start Year
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* End Year Dropdown */}
        <div>
          <label htmlFor="sessionEndDate" className="block text-sm font-medium">
            End Year
          </label>
          <select
            id="sessionEndDate"
            value={sessionEndDate || ""}
            onChange={handlesessionEndDateChange}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"

            disabled={!sessionStartDate} // Disable until start year is selected
          >
            <option value="" disabled>
              Select End Year
            </option>
            {years
              .filter((year) => !sessionStartDate || year >= sessionStartDate) // Filter valid years
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default YearRangePicker;

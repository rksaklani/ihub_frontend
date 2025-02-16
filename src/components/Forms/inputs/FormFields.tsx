

const FormField = ({ 
  label,
  type,
  placeholder,
  value,
  onChange,
  name

}: {
  label?: string;
  type: string;
  placeholder: string;
  value?: string;
  name: string;

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div>
      <label className="mb-3 block text-black dark:text-white">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
     
        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
      />
    </div>
  );
};

export default FormField;
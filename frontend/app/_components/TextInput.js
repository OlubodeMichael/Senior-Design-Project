'use client';

export default function TextInput({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg 
            shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-transparent bg-white text-gray-800 font-medium"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Input = ({ value, onChange, placeholder, label, type, options = [] }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label className="text-[13px] text-slate-800 block mb-1">{label}</label>

      {type === 'select' ? (
        <select
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 bg-slate-100 text-slate-800 outline-none"
        >
          <option value=""></option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <div className="input-box flex items-center border rounded px-3 py-2">
          <input
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none"
            value={value}
            onChange={(e) => onChange(e)}
          />
          {type === 'password' && (
            <>
              {showPassword ? (
                <FaRegEye
                  size={22}
                  className="text-primary cursor-pointer"
                  onClick={toggleShowPassword}
                />
              ) : (
                <FaRegEyeSlash
                  size={22}
                  className="text-slate-400 cursor-pointer"
                  onClick={toggleShowPassword}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;

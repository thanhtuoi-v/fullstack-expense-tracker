import React, { useEffect, useState } from 'react';
import Input from '../Inputs/Input';
import EmojiPickerPoup from '../EmojiPickerPoup';

const EditIncomeForm = ({ onUpdateIncome, initialData = {} }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setIncome({
        _id: initialData._id,
        source: initialData.source || "",
        amount: initialData.amount || "",
        date: initialData.date?.slice(0, 10) || "",
        icon: initialData.icon || "",
      });
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setIncome((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    onUpdateIncome(income);
  };

  return (
    <div>
      <EmojiPickerPoup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        label="Nguồn thu nhập"
        value={income.source}
        onChange={({ target }) => handleChange("source", target.value)}
        type="select"
        options={[
          "Lương công ty",
          "Làm tự do",
          "Đầu tư",
          "Thưởng",
          "Trợ cấp",
          "Khác"
        ]}
      />

      <Input
        label="Số tiền"
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        type="number"
      />

      <Input
        label="Ngày"
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleSubmit}
        >
          Cập nhật thu nhập
        </button>
      </div>
    </div>
  );
};

export default EditIncomeForm;

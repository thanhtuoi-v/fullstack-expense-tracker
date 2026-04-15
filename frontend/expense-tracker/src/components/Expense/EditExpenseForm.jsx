import React, { useEffect, useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPoup";

const EditExpense = ({ onUpdateExpense, initialData = {} }) => {
  const [expense, setExpense] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
    icon: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setExpense({
        _id: initialData._id,
        category: initialData.category || "",
        description: initialData.description || "",
        amount: initialData.amount || "",
        date: initialData.date?.slice(0, 10) || "",
        icon: initialData.icon || "",
      });
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setExpense((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    onUpdateExpense(expense);
  };

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        label="Danh mục"
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        type="select"
        options={[
          "Ăn uống",
          "Xăng xe, đi lại",
          "Chi phí y tế cơ bản",
          "Học phí",
          "Mua sắm",
          "Quà tặng",
          "Giải trí",
        ]}
      />

      <Input
        label="Mô tả"
        value={expense.description}
        onChange={({ target }) => handleChange("description", target.value)}
        placeholder="trà sữa, bánh ngọt,..."
        type="text"
      />

      <Input
        label="Số tiền"
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        type="text"
      />

      <Input
        label="Ngày"
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleSubmit}
        >
          Cập nhật chi tiêu
        </button>
      </div>
    </div>
  );
};

export default EditExpense;

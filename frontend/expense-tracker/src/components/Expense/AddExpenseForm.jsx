import React, { useState } from "react"; 
import Input from "../Inputs/Input"; 
import EmojiPickerPopup from "../EmojiPickerPoup";

const AddExpenseForm = ({ onAddExpense }) => {
  const [income, setIncome] = useState({
    category: "",
    description:"",
    amount: "",
    date: "",
    icon: ""
  });

  const handleChange = (key, value) => setIncome({...income, [key]: value});
  return (
    <div>
      <EmojiPickerPopup 
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      {/* <Input 
        label="Danh mục"
        value={income.category}
        onChange={({target}) => handleChange("category", target.value)}
        placeholder="thuê nhà, ăn uống,..."
        type = "text"
      /> */}
      <Input 
      label="Danh mục"
      value={income.category}
      onChange={({target}) => handleChange("category", target.value)}
      type="select"
      options={[
        "Ăn uống",
        "Xăng xe, đi lại",
        "Chi phí y tế cơ bản",
        "Học phí",
        "Mua sắm",
        "Quà tặng",
        "Giải trí"
      ]}
      />
      <Input 
        label="Mô tả"
        value={income.description}
        onChange={({target}) => handleChange("description", target.value)}
        placeholder="trà sữa, bánh ngọt ,..."
        type = "text"
      />
      <Input 
        label="Số tiền"
        value={income.amount}
        onChange={({target}) => handleChange("amount", target.value)}
        placeholder= ""
        type = "text"
      />
      <Input 
        label="Ngày"
        value={income.date}
        onChange={({target}) => handleChange("date", target.value)}
        placeholder=""
        type = 'Date'
      />
        <div className="flex justify-end mt-6">
        <button 
        type="button"
        className="add-btn add-btn-fill"
        onClick={() => onAddExpense(income)}
        >
            Thêm chi tiêu
            </button>
        </div>

      
    </div>
  );
};

export default AddExpenseForm;


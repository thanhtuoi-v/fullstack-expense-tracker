import React, { useState } from 'react'
import Input from '../Inputs/Input';
import EmojiPickerPoup from '../EmojiPickerPoup';

const AddIncomeForm = ({ onAddIncome }) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
    });

    const handleChange = (key, value) =>
        setIncome(({
            ...income,
            [key]: value,
        }));
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
                value={income.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Số tiền"
                placeholder=""
                type="number"
            />
            <Input
                value={income.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Ngày"
                placeholder="Freelance, Salary, etc"
                type="date"
            />
            <div className='flex justify-end mt-6'>
                <button
                    type='button'
                    className='add-btn add-btn-fill'
                    onClick={() => onAddIncome(income)}
                >
                    Thêm thu nhập
                </button>
            </div>
        </div>
    )
}
export default AddIncomeForm
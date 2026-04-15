import React from 'react';
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

const FinanceOverview = ({totalBalance,totalIncome,totalExpense}) => {
    
    const balanceData = [
        {name: "Số dư hiện tại", amount: totalBalance},
        {name: "Tổng chi tiêu", amount: totalExpense},
        {name: "Tổng thu nhập", amount: totalIncome},
    ];
    return (
    <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Tổng quan tài chính</h5>
            </div>

            <CustomPieChart
                data = {balanceData}
                label = "Số dư hiện tại"
                totalAmount = {`$${totalBalance}`}
                colors = {COLORS}
                showTextAnchor
            />
    </div>
    )
}

export default FinanceOverview
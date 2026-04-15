import React, { useEffect, useState } from 'react'
import {LuPlus} from "react-icons/lu";
import CustomsBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from '../../Utils/helper';

const IncomeOverview = ({transactions,onAddIncome}) => {

  const [chartData,setCharData] = useState([])

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setCharData(result);

    return () => {};
  }, [transactions]);
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <div className=''>
          <h5 className='text-lg'>Tổng quan thu nhập</h5>
          <p className='text-xs text-gray-400 mt-0.5'>
          Theo dõi thu nhập của bạn theo thời gian và phân tích xu hướng thu nhập.
          </p>
        </div>
        <button className='add-btn' onClick={onAddIncome}>
          <LuPlus className='text-lg'/>
          Thêm thu nhập
        </button>
      </div>
      <div className='mt-10'>
          <CustomsBarChart data={chartData}/>
      </div>

    </div>
  )
}

export default IncomeOverview
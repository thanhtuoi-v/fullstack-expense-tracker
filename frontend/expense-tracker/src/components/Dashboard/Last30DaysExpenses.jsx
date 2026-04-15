import React, { useEffect, useState } from 'react'
import { prepareExpenseBarChartData } from '../../Utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last30DaysExpenses = ({data}) => {

  const [chartData, setCharData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseBarChartData(data);
    setCharData(result);

    return() => {};
  }, [data]);

  return (
    <div className='card col-span-1'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Chi tiêu 30 ngày qua</h5>
      </div>

      <CustomBarChart data = {chartData}/>
    </div>
  )
}

export default Last30DaysExpenses
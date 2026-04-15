import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Customized,
} from "recharts";
import Customtooltip from '../Cards/Customtooltip';
import CustomLegend from './CustomLegend';


const CustomPieChart = ({
    data, 
    label, 
    totalAmount, 
    colors,
    showTextAnchor,
}) => {
  return <ResponsiveContainer width="100%" height={380}>
    <PieChart>
        <Pie
            data = {data}
            dataKey = "amount"
            nameKey = "name"
            cx = "50%"
            cy = "50%"
            outerRadius = {130}
            innerRadius = {100}
            labelLine = {false}
        >
            {data.map((entry, index) => (
                <Cell key = {`cell-${index}`} fill = {colors[index % colors.length]}/>
            ))}
            </Pie>
            <Tooltip content={<Customtooltip/>}/>
            <Legend content={<CustomLegend/>}/>
            {showTextAnchor && (
  <Customized
    component={({ width, height }) => {
      const centerX = width / 2;
      const centerY = height / 2;
      return (
        <>
          <text
            x={centerX}
            y={centerY - 20}
            textAnchor="middle"
            fill="#666"
            fontSize="14px"
          >
            {label}
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            fill="#333"
            fontSize="24px"
            fontWeight="semi-bold"
          >
            {totalAmount}
          </text>
        </>
      );
    }}
  />
)}
        </PieChart>
        </ResponsiveContainer>
}

export default CustomPieChart

                
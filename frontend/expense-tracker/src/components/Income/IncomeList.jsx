import moment from 'moment';
import React from 'react'
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { LuDownload } from 'react-icons/lu';

const IncomeList = ({ transactions, onDelete, onDownload,onEdit }) => {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <h5 className="text-lg">Nguồn thu nhập</h5>
          <button className="card-btn" onClick={onDownload}>
            <LuDownload className="text-base" /> Tải xuống
          </button>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2">
          {transactions?.map((income) => (
            <TransactionInfoCard
              key={income._id}
              title={income.source}
              icon={income.icon}
              date={moment(income.date).format("Do MMM YYYY")}
              amount={income.amount}
              type="income"
              onDelete={() => onDelete(income._id)}
              onEdit={() => onEdit(income)}
            />
          ))}
        </div>
      </div>
    );
  };
  

export default IncomeList
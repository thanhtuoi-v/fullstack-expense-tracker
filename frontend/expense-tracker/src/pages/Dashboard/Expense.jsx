import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../Utils/apiPaths';
import axiosInstance from '../../Utils/axiosInstance';
import toast from 'react-hot-toast';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import Modal from '../../components/Modal';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';
import DialogflowMessenger from '../../components/Dialogflow/DialogflowMessenger';
import EditExpense from '../../components/Expense/EditExpenseForm';


const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null);

  const handleUpdateExpense = async (expense) => {
    const { _id, category, amount, date, icon, description } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }
    if (!description) {
      toast.error("Description is required.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(_id), {
        category,
        description,
        amount,
        date,
        icon,
      });
      toast.success("Cập nhật chi tiêu thành công");
      setEditingExpense(null);
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error updating expense:", error.response?.data?.message || error.message);
      toast.error("Update failed");
    }
  };



  // Get All Expense Details 
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      )
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle Add Expense 
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon, description } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }
    if (!description) {
      toast.error("Description is required.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        description,
        amount,
        date,
        icon,
      })
      setOpenAddExpenseModal(false);
      toast.success("Thêm chi tiêu thành công");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    }

  };

  // Delete Expense 
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Xóa chi tiêu thành công");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };


  // handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        }
      );

      // Tạo URL cho blob dữ liệu
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx"); // hoặc .csv, .pdf tùy server trả về
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); // giải phóng bộ nhớ
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };


  useEffect(() => {
    fetchExpenseDetails();
    return () => { }
  }, []);


  return (
    <DashboardLayout activeMenu="Chi tiêu">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
            onEdit={(expense) => setEditingExpense(expense)}
          />

        </div>
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Thêm chi tiêu"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Xóa chi tiêu"
        >
          <DeleteAlert
            content="Bạn có muốn xóa chi tiêu này không?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
        <Modal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          title="Chỉnh sửa chi tiêu"
        >
          <EditExpense
    initialData={editingExpense}
    onUpdateExpense={handleUpdateExpense}
  />
        </Modal>
      </div>
      <DialogflowMessenger />
    </DashboardLayout>

  )
}

export default Expense
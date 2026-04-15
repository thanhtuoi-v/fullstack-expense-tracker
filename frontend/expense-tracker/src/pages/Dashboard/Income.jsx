import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { API_PATHS } from '../../Utils/apiPaths';
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../Utils/axiosInstance';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';
import DialogflowMessenger from '../../components/Dialogflow/DialogflowMessenger';
import EditIncomeForm from '../../components/Income/EditIncomeForm';

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false)
  const [editingIncome, setEditingIncome] = useState(null);

//handle Update Income
  const handleUpdateIncome = async (updatedIncome) => {
    try {
      await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(updatedIncome._id), updatedIncome);
      toast.success("Cập nhật thu nhập thành công");
      setEditingIncome(null); // Đóng modal
      fetchIncomeDetails(); // Cập nhật lại danh sách thu nhập
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Lỗi khi cập nhật thu nhập");
    }
  };
  

  // Get All Income Details 
  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      )
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle Add Income 
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    // Validation Checks
    if (!source.trim()) {
      toast.error("Source is required.");
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
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      })
      setOpenAddIncomeModal(false);
      toast.success("Thêm thu nhập thành công");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error adding income:",
        error.response?.data?.message || error.message
      );
    }

  };


  // Delete Income 
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Xóa thu nhập thành công");
      fetchIncomeDetails();
    } catch (error) {
      console.error(
        "Error deleting income:",
        error.response?.data?.message || error.message
      );
    }
  };


  // handle download income details 
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        }
      );

      // Tạo URL cho blob dữ liệu
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx"); // hoặc .csv, .pdf tùy server trả về
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); // giải phóng bộ nhớ
    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error("Failed to download income details. Please try again.");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();

    return () => {
    }
  }, [])


  return (
    <DashboardLayout activeMenu="Thu nhập">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadIncomeDetails}
            onEdit={(income) => setEditingIncome(income)}
          />
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Thêm thu nhập"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Xóa thu nhập"
        >
          <DeleteAlert
            content="Bạn có muốn xóa thu nhập này không?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
        <Modal
          isOpen={!!editingIncome}
          onClose={() => setEditingIncome(null)}
          title="Chỉnh sửa thu nhập"
        >
          <EditIncomeForm
            initialData={editingIncome}
            onUpdateIncome={handleUpdateIncome}
          />
        </Modal>
      </div>
      <DialogflowMessenger />
    </DashboardLayout>
  );
};

export default Income;
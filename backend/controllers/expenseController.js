const xlsx = require('xlsx');
const Expense = require('../models/Expense')

//Add Expense Source
exports.addExpense = async (req,res) => {
    const userId = req.user.id;
    try{
        const {icon, category,description, amount, date} = req.body || {};

        // Validation: check for missing fields
        if(!category || !amount || !date){
            return res.status(400).json({message: "All fileds are required"});
        }
        const newExpense = new Expense({
            userId,
            icon,
            category,
            description,
            amount,
            date: new Date(date)
        });
        await newExpense.save();
        res.status(200).json(newExpense);
    }catch (error){
        res.status(500).json({message: "Server Error"});
    }
}

//Get all Expense Source
exports.getAllExpense = async (req,res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({userId}).sort({date: -1});
        res.json(expense);
    }catch (error){
        res.status(500).json({message: "Server Error"});
    }
};

//Delete Expense Source
exports.deleteExpense = async (req,res) => {

    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message: "Expense deleted successfully"});
    } catch {
        res.status(500).json({message: "Server Error"});
    }
}

//Download Excel 
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel
        const data = expense.map((item) => ({
            Category: item.category,
            Description: item.description,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        const filePath = 'Expense_details.xlsx';
        xlsx.writeFile(wb, filePath);

        res.download(filePath);
    } catch (error) {
        console.error("Error generating Excel file:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
// Update Expense Source
exports.updateExpense = async (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;
    try {
        const { icon, category, description, amount, date } = req.body || {};

        // Validation
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: expenseId, userId }, // đảm bảo chỉ update expense của đúng user
            {
                icon,
                category,
                description,
                amount,
                date: new Date(date)
            },
            { new: true } // trả về bản ghi mới sau khi update
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json(updatedExpense);
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

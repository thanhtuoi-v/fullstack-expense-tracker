const xlsx = require('xlsx');
const Income = require('../models/Income')

//Add Income Source
exports.addIncome = async (req,res) => {
    const userId = req.user.id;
    try{
        const {icon, source, amount, date} = req.body || {};

        // Validation: check for missing fields
        if(!source || !amount || !date){
            return res.status(400).json({message: "All fileds are required"});
        }
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });
        await newIncome.save();
        res.status(200).json(newIncome);
    }catch (error){
        res.status(500).json({message: "Server Error"});
    }
}
// Update Income Source
exports.updateIncome = async (req, res) => {
    const incomeId = req.params.id;
    const userId = req.user.id;
    try {
        const { icon, source, amount, date } = req.body || {};
        // Validation
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const updatedIncome = await Income.findOneAndUpdate(
            { _id: incomeId, userId }, // Chỉ cho phép update của chính user đó
            {
                icon,
                source,
                amount,
                date: new Date(date),
            },
            { new: true }
        );
        if (!updatedIncome) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json(updatedIncome);
    } catch (error) {
        console.error("Error updating income:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

//Get all Income Source
exports.getAllIncome = async (req,res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({userId}).sort({date: -1});
        res.json(income);
    }catch (error){
        res.status(500).json({message: "Server Error"});
    }
};

//Delete Income Source
exports.deleteIncome = async (req,res) => {

    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({message: "Income deleted successfully"});
    } catch {
        res.status(500).json({message: "Server Error"});
    }
}

//Download Excel 
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");

        const filePath = 'income_details.xlsx';
        xlsx.writeFile(wb, filePath);

        res.download(filePath);
    } catch (error) {
        console.error("Error generating Excel file:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
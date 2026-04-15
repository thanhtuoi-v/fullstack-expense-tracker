const Expense = require("../models/Expense");
const Income = require("../models/Income");

exports.handleDialogflowRequest = async (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;
  let responseText = "Tôi chưa hiểu ý của bạn.";

  // CÁC MỐC THỜI GIAN DÙNG CHUNG
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // EXPENSE INTENTS
 
  if (intentName === "spending_today") {
    try {
      const expenses = await Expense.find({ date: { $gte: startOfDay, $lte: now } });
  
      if (expenses.length === 0) {
        return res.json({
          fulfillmentMessages: [
            {
              text: {
                text: ["Hôm nay bạn chưa có khoản chi tiêu nào."]
              }
            }
          ]
        });
      } else {
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  
        const messages = [];
  
        // Tổng chi tiêu
        messages.push({
          text: {
            text: [`Hôm nay bạn đã chi tổng cộng ${total.toLocaleString()} $ vào các khoản sau:`]
          }
        });
  
        // Chi tiết từng khoản
        expenses.forEach(e => {
          const detail = `- ${e.category || "Khác"}: ${e.amount.toLocaleString()} $`;
          messages.push({
            text: {
              text: [detail]
            }
          });
        });
  
        return res.json({
          fulfillmentMessages: messages
        });
      }
    } catch (error) {
      console.error(error);
      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: ["Không thể lấy dữ liệu chi tiêu hôm nay."]
            }
          }
        ]
      });
    }
  }
  
  if (intentName === "max_monthly_spending") {
    try {
      const expenses = await Expense.find({ date: { $gte: startOfYear, $lte: endOfYear } });
      const monthlyTotals = Array(12).fill(0);
      expenses.forEach(e => monthlyTotals[new Date(e.date).getMonth()] += e.amount);
      const max = Math.max(...monthlyTotals);
      const maxMonth = monthlyTotals.findIndex(m => m === max) + 1;
      responseText = `Tháng có chi tiêu nhiều nhất trong năm nay là tháng ${maxMonth} với ${max.toLocaleString()} $.`;
    } catch {
      responseText = "Không thể lấy dữ liệu chi tiêu trong năm.";
    }
  }

  if (intentName === "max_daily_spending_this_month") {
    try {
      const expenses = await Expense.find({ date: { $gte: startOfMonth, $lte: now } });
      const dailyTotals = {};
      expenses.forEach(e => {
        const day = new Date(e.date).toISOString().slice(0, 10);
        dailyTotals[day] = (dailyTotals[day] || 0) + e.amount;
      });
      const [maxDay, maxTotal] = Object.entries(dailyTotals).reduce((a, b) => b[1] > a[1] ? b : a);
      responseText = `Ngày có chi tiêu cao nhất trong tháng này là ${maxDay} với ${maxTotal.toLocaleString()} $.`;
    } catch {
      responseText = "Không thể lấy dữ liệu chi tiêu theo ngày.";
    }
  }

  if (intentName === "min_monthly_spending") {
    try {
      const expenses = await Expense.find({ date: { $gte: startOfYear, $lte: endOfYear } });
      const monthlyTotals = Array(12).fill(0);
      expenses.forEach(e => monthlyTotals[new Date(e.date).getMonth()] += e.amount);
      const nonZeroMonths = monthlyTotals.filter(m => m > 0);
      const min = Math.min(...nonZeroMonths);
      const minMonth = monthlyTotals.findIndex(m => m === min) + 1;
      responseText = `Tháng có chi tiêu ít nhất là tháng ${minMonth} với ${min.toLocaleString()} $.`;
    } catch {
      responseText = "Không thể lấy dữ liệu chi tiêu.";
    }
  }

  if (intentName === "min_daily_spending_this_month") {
    try {
      const expenses = await Expense.find({ date: { $gte: startOfMonth, $lte: now } });
      const dailyTotals = {};
      expenses.forEach(e => {
        const day = new Date(e.date).toISOString().slice(0, 10);
        dailyTotals[day] = (dailyTotals[day] || 0) + e.amount;
      });
      const filteredDays = Object.entries(dailyTotals).filter(([_, total]) => total > 0);
      const [minDay, minTotal] = filteredDays.reduce((a, b) => b[1] < a[1] ? b : a);
      responseText = `Ngày có chi tiêu thấp nhất trong tháng này là ${minDay} với ${minTotal.toLocaleString()} $.`;
    } catch {
      responseText = "Không thể lấy dữ liệu chi tiêu theo ngày.";
    }
  }

  if (intentName === "most_spent_category_this_month") {
    try {
      const expenses = await Expense.find({ date: { $gte: startOfMonth, $lte: now } });
      const categoryTotals = {};
      expenses.forEach(e => {
        const cat = e.category || 'Khác';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + e.amount;
      });
      const [maxCat, maxAmount] = Object.entries(categoryTotals).reduce((a, b) => b[1] > a[1] ? b : a);
      responseText = `Danh mục chi tiêu nhiều nhất trong tháng là "${maxCat}" với ${maxAmount.toLocaleString()} $.`;
    } catch {
      responseText = "Không thể lấy dữ liệu theo danh mục.";
    }
  }

  if (intentName === "total_expense_this_month") {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    try {
      const expenses = await Expense.find({
        date: { $gte: startOfMonth, $lte: now },
      });

      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      responseText = `Tổng chi tiêu tháng này của bạn là ${total.toLocaleString()} $.`;
    } catch (err) {
      console.error("Lỗi khi tính tổng chi tiêu tháng này:", err);
      responseText = "Đã xảy ra lỗi khi tính toán chi tiêu tháng này.";
    }
  }
  if (intentName === "Total_Spending_AllTime") {
    try {
      const expenses = await Expense.find({});
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      responseText = `Tổng chi tiêu từ trước đến nay là ${total.toLocaleString()} $.`;
    } catch (err) {
      responseText = "Lỗi khi lấy dữ liệu chi tiêu.";
    }
  }
  // INCOME INTENTS
  if (intentName === "income_today") {
    try {
      const incomes = await Income.find({ date: { $gte: startOfDay, $lte: now } });
      const total = incomes.reduce((sum, e) => sum + e.amount, 0);
      responseText = `Hôm nay bạn đã nhận được ${total.toLocaleString()} $.`;
    } catch {
      responseText = "Không thể lấy dữ liệu thu nhập hôm nay.";
    }
  }

  if (intentName === "max_monthly_income") {
    try {
      const incomes = await Income.find({ date: { $gte: startOfYear, $lte: endOfYear } });
      const monthlyTotals = Array(12).fill(0);
      incomes.forEach(e => monthlyTotals[new Date(e.date).getMonth()] += e.amount);
      const max = Math.max(...monthlyTotals);
      const maxMonth = monthlyTotals.findIndex(m => m === max) + 1;
      responseText = `Tháng có thu nhập cao nhất là tháng ${maxMonth} với ${max.toLocaleString()} $.`;
    } catch {
      responseText = "Không thể lấy dữ liệu thu nhập theo năm.";
    }
  }

  if (intentName === "min_monthly_income") {
    try {
      const incomes = await Income.find({ date: { $gte: startOfYear, $lte: endOfYear } });
      const monthlyTotals = Array(12).fill(0);
      incomes.forEach(e => monthlyTotals[new Date(e.date).getMonth()] += e.amount);
      const nonZero = monthlyTotals.filter(m => m > 0);
      const min = Math.min(...nonZero);
      const minMonth = monthlyTotals.findIndex(m => m === min) + 1;
      responseText = `Tháng có thu nhập thấp nhất trong là tháng ${minMonth} với ${min.toLocaleString()} $.`;
    } catch {
      responseText = "Không thể lấy dữ liệu thu nhập theo năm.";
    }
  }

  if (intentName === "total_income_this_month") {
    try {
      const incomes = await Income.find({ date: { $gte: startOfMonth, $lte: now } });
      const total = incomes.reduce((sum, e) => sum + e.amount, 0);
      responseText = `Tổng thu nhập tháng này của bạn là ${total.toLocaleString()} $.`;
    } catch {
      responseText = "Không thể lấy dữ liệu thu nhập tháng này.";
    }
  }
  if (intentName === "Total_InCome_AllTime") {
    try {
      const incomes = await Income.find({});
      const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
      responseText = `Tổng thu nhập từ trước đến nay của bạn là ${totalIncome.toLocaleString()} VND.`;
    } catch (err) {
      console.error("Lỗi khi tính tổng thu nhập:", err);
      responseText = "Đã xảy ra lỗi khi truy vấn tổng thu nhập.";
    }
  }
  if (intentName === "Expenses_By_Date") {
    try {
      const dateStr = req.body.queryResult.parameters.date; // Định dạng ISO từ Dialogflow
      if (!dateStr) {
        responseText = "Bạn vui lòng cung cấp ngày cụ thể để tôi kiểm tra.";
      } else {
        const inputDate = new Date(dateStr);
        const startOfInputDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
        const endOfInputDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 23, 59, 59, 999);
        const expenses = await Expense.find({
          date: { $gte: startOfInputDay, $lte: endOfInputDay }});
        if (expenses.length === 0) {
          responseText = `Bạn không có khoản chi tiêu nào vào ngày ${startOfInputDay.toLocaleDateString("vi-VN")}.`;
          const response = {
            fulfillmentMessages: [
              {
                text: {
                  text: [
                    responseText
                  ]}}]};
          return res.json(response);
        } else {
          const total = expenses.reduce((sum, e) => sum + e.amount, 0);
          // Chia phản hồi thành nhiều phần nhỏ
          const messages = [];
          // Phần đầu tiên: Tổng số tiền chi tiêu
          messages.push({
            text: {
              text: [
                `Vào ngày ${startOfInputDay.toLocaleDateString("vi-VN")}, bạn đã chi tổng cộng ${total.toLocaleString()} $ vào các khoản sau:`
              ]}});
          // Phần tiếp theo: Các khoản chi tiêu chi tiết, mỗi phần một khoản
          expenses.forEach(e => {
            const detailMessage = `- ${e.category || "Khác"}: ${e.amount.toLocaleString()} $`;
            messages.push({
              text: {
                text: [
                  detailMessage
                ]}});});
          // Trả về từng phần phản hồi
          const response = {
            fulfillmentMessages: messages
          };
          return res.json(response);}}
    } catch (error) {
      console.error(error);
      responseText = "Có lỗi xảy ra khi truy xuất dữ liệu chi tiêu theo ngày.";
      const response = {
        fulfillmentMessages: [
          {
            text: {
              text: [
                responseText
              ]}}]};
  
      return res.json(response);
    }
  }
  
 
  if (intentName === "what_can_you_do") {
    return res.json({
      fulfillmentMessages: [
        {
          text: {
            text: ["🧾 Tôi có thể giúp bạn thống kê các loại báo cáo tài chính sau đây:"]
          }
        },
        {
          text: {
            text: ["💸 *Chi tiêu:*"]
          }
        },
        {
          text: {
            text: [
              "1. Tôi đã chi bao nhiêu hôm nay?",
              "2. Tổng chi tiêu tháng này là bao nhiêu?",
              "3. Tổng chi từ trước đến giờ là bao nhiêu?",
              "4. Tháng nào tôi tiêu nhiều nhất?",
              "5. Tháng nào tôi chi tiêu ít nhất?",
              "6. Tôi chi nhiều nhất vào ngày nào tháng này?",
              "7. Ngày nào tôi chi ít nhất tháng này?",
              "8. Tôi tiêu nhiều nhất vào mục nào tháng này?",
              "9. Tôi chi gì vào ngày 01/04/2024?"
            ]
          }
        },
        {
          text: {
            text: ["💰 *Thu nhập:*"]
          }
        },
        {
          text: {
            text: [
              "10. Hôm nay tôi kiếm được bao nhiêu?",
              "11. Tháng này tôi có thu nhập bao nhiêu?",
              "12. Tổng thu nhập của tôi từ trước đến giờ là bao nhiêu?",
              "13. Tháng nào tôi thu nhiều nhất?",
              "14. Tháng nào tôi thu nhập ít nhất?"
            ]
          }
        },
        {
          text: {
            text: [
              "📊 *Khác:*",
              "15. Tình hình tài chính hiện tại của tôi?",
              "16. Bạn có thể làm gì?"
            ]
          }
        },
        {
          text: {
            text: ["📌 Hãy chọn một trong các câu hỏi trên hoặc nhập yêu cầu cụ thể để tôi hỗ trợ bạn tốt hơn nhé!"]
          }
        }
      ]
    });
  }
  
  if (intentName === "current_financial_report") {
    try {
      const [expenses, incomes] = await Promise.all([
        Expense.find({ date: { $gte: startOfMonth, $lte: now } }),
        Income.find({ date: { $gte: startOfMonth, $lte: now } })
      ]);
  
      const isSameDay = (d1, d2) =>
        new Date(d1).toDateString() === new Date(d2).toDateString();
  
      const expenseToday = expenses
        .filter(e => isSameDay(e.date, now))
        .reduce((sum, e) => sum + e.amount, 0);
      const incomeToday = incomes
        .filter(i => isSameDay(i.date, now))
        .reduce((sum, i) => sum + i.amount, 0);
  
      const expenseMonth = expenses.reduce((sum, e) => sum + e.amount, 0);
      const incomeMonth = incomes.reduce((sum, i) => sum + i.amount, 0);
      const balance = incomeMonth - expenseMonth;
  
      const categoryTotals = {};
      expenses.forEach(e => {
        const cat = e.category || "Khác";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + e.amount;
      });
  
      let category = "Không có";
      let amount = 0;
      for (const [cat, val] of Object.entries(categoryTotals)) {
        if (val > amount) {
          amount = val;
          category = cat;
        }
      }
  
      const lines = [
        `📊 Tôi đã thống kê báo cáo tài chính hiện tại như sau:`,
        `💰 **Thu nhập:**`,
        `- Hôm nay: ${incomeToday.toLocaleString()} $`,
        `- Tháng này: ${incomeMonth.toLocaleString()} $`,
        `💸 **Chi tiêu:**`,
        `- Hôm nay: ${expenseToday.toLocaleString()} $`,
        `- Tháng này: ${expenseMonth.toLocaleString()} $`,
        `📌 **Danh mục chi tiêu nhiều nhất:** ${category} với ${amount.toLocaleString()} $`
      ];
  
      return res.json({
        fulfillmentMessages: lines.map(line => ({
          text: { text: [line] }
        }))
      });
  
    } catch (err) {
      console.error("Lỗi khi tạo báo cáo tài chính:", err);
      return res.json({
        fulfillmentMessages: [
          { text: { text: ["Đã xảy ra lỗi khi lấy báo cáo tài chính hiện tại."] } }
        ]
      });
    }
  }
  
  return res.json({
    fulfillmentText: responseText,
  });
};

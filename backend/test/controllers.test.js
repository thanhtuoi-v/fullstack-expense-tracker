
const { loginUser } = require("../controllers/authController");
const { addExpense, updateExpense } = require("../controllers/expenseController");
const { addIncome, updateIncome } = require("../controllers/incomeController");

const User = require("../models/User");
const Expense = require("../models/Expense");
const Income = require("../models/Income");

jest.mock("../models/User");
jest.mock("../models/Expense");
jest.mock("../models/Income");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("loginUser controller", () => {
  it("trả lỗi nếu thiếu thông tin", async () => {
    const req = { body: { email: "" } };
    const res = mockResponse();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("trả lỗi nếu user không tồn tại hoặc mật khẩu sai", async () => {
    const req = { body: { email: "a@mail.com", password: "123" } };
    const res = mockResponse();

    User.findOne.mockResolvedValue(null);
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("addExpense controller", () => {
  it("trả lỗi nếu thiếu trường bắt buộc", async () => {
    const req = { body: { category: "", amount: 0, date: "" }, user: { id: "123" } };
    const res = mockResponse();
    await addExpense(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("thêm chi tiêu thành công", async () => {
    const req = {
      body: { category: "Food", amount: 100, date: "2024-01-01" },
      user: { id: "123" },
    };
    const res = mockResponse();
    Expense.prototype.save = jest.fn().mockResolvedValue(req.body);

    await addExpense(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("updateExpense controller", () => {
  it("trả lỗi nếu thiếu trường", async () => {
    const req = {
      body: { category: "", amount: 0, date: "" },
      user: { id: "123" },
      params: { id: "1" },
    };
    const res = mockResponse();
    await updateExpense(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("cập nhật chi tiêu thành công", async () => {
    const req = {
      body: { category: "Bills", amount: 150, date: "2024-01-01" },
      user: { id: "123" },
      params: { id: "1" },
    };
    const res = mockResponse();

    Expense.findOneAndUpdate.mockResolvedValue({ ...req.body });
    await updateExpense(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("addIncome controller", () => {
  it("trả lỗi nếu thiếu trường", async () => {
    const req = { body: { source: "", amount: 0, date: "" }, user: { id: "123" } };
    const res = mockResponse();
    await addIncome(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("thêm thu nhập thành công", async () => {
    const req = {
      body: { source: "Job", amount: 500, date: "2024-01-01" },
      user: { id: "123" },
    };
    const res = mockResponse();
    Income.prototype.save = jest.fn().mockResolvedValue(req.body);
    await addIncome(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("updateIncome controller", () => {
  it("trả lỗi nếu thiếu trường", async () => {
    const req = {
      body: { source: "", amount: 0, date: "" },
      user: { id: "123" },
      params: { id: "1" },
    };
    const res = mockResponse();
    await updateIncome(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("cập nhật thu nhập thành công", async () => {
    const req = {
      body: { source: "Bonus", amount: 800, date: "2024-01-01" },
      user: { id: "123" },
      params: { id: "1" },
    };
    const res = mockResponse();

    Income.findOneAndUpdate.mockResolvedValue({ ...req.body });
    await updateIncome(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

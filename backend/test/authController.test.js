process.env.JWT_SECRET = "testsecret";

const { registerUser } = require("../controllers/authController");
const User = require("../models/User");

jest.mock("../models/User");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("registerUser controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("trả lỗi nếu thiếu thông tin bắt buộc", async () => {
    const req = { body: { email: "test@email.com", password: "123456" } }; // thiếu fullName
    const res = mockResponse();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Vui lòng nhập đầy đủ thông tin",
    });
  });

  it("trả lỗi nếu email đã tồn tại", async () => {
    const req = {
      body: { fullName: "Test", email: "exist@email.com", password: "123456" },
    };
    const res = mockResponse();

    User.findOne.mockResolvedValue({ email: "exist@email.com" });

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "exist@email.com" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email đã tồn tại" });
  });

  it("tạo user nếu thông tin hợp lệ", async () => {
    const req = {
      body: {
        fullName: "New User",
        email: "new@email.com",
        password: "123456",
        profileImageUrl: "img.png",
      },
    };
    const res = mockResponse();

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: "abc123", ...req.body });

    await registerUser(req, res);

    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "abc123",
        user: expect.objectContaining({ email: "new@email.com" }),
        token: expect.any(String),
      })
    );
  });
});

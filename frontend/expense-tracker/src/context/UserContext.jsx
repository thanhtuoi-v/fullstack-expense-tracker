import axios from "axios";
import React, {createContext,  useEffect,  useState} from "react";



export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Gọi API lấy user khi app khởi động
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8000/api/v1/auth/getUser", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Lỗi lấy thông tin user:", err);
        setUser(null); // fallback nếu token sai
      });
    }
  }, []);


    //Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    };

    // Function to clear user data (e.g., on logout)
    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
            }}
        >
        {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
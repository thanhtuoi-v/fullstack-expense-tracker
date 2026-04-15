import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from "react-icons/lu";



export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Tổng quan",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },

    {
        id: "02",
        label: "Thu nhập",
        icon: LuWalletMinimal,
        path: "/income",
    },

    {
        id: "03",
        label: "Chi tiêu",
        icon: LuHandCoins,
        path: "/expense",
    },

    {
        id: "06",
        label: "Đăng xuất",
        icon: LuLogOut,
        path: "logout",
    },

];
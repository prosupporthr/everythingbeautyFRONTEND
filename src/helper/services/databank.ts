import { MessageQuestion, ProfileDelete, SecuritySafe } from "iconsax-reactjs";
import { BiMessageDetail } from "react-icons/bi";
import { BsPersonCircle, BsShop } from "react-icons/bs";
import { IoHeartOutline, IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";

export const menulist = [
    {
        title: "My Profile",
        icon: BsPersonCircle,
        link: "/profile"
    },
    {
        title: "Message",
        icon: BiMessageDetail,
        link: "/message"
    },
    {
        title: "Settings",
        icon: IoSettingsOutline,
        link: "/settings"
    },
    {
        title: "Wallet",
        icon: IoWalletOutline,
        link: "/wallet"
    },
    {
        title: "Favourite",
        icon: IoHeartOutline,
        link: "/bookmark"
    },
    {
        title: "My Order",
        icon: BsShop,
        link: "/myorder"
    },
    {
        title: "Logout",
        icon: TbLogout2,
        link: ""
    }
]

export const chargeTiming = [
    {
        value: "after_order",
        label: "After the job"
    },
    {
        value: "before_order",
        label: "Before the Job"
    }
]

export const dayOfTheWeek = [
    {
        value: 0,
        label: "Sun"
    },
    {
        value: 1,
        label: "Mon"
    },
    {
        value: 2,
        label: "Tue"
    },
    {
        value: 3,
        label: "Wed"
    },
    {
        value: 4,
        label: "Thu"
    },
    {
        value: 5,
        label: "Fri"
    },
    {
        value: 6,
        label: "Sat"
    }
]

export const settingsList = [ 
    // {
    //     label: "Security",
    //     details: "Protection against intruders",
    //     icon: SecuritySafe,
    //     iconcolor: "#34C759",
    //     link: "/settings/security"
    // },
    {
        label: "Get Help",
        details: "Get help from support team",
        icon: MessageQuestion,
        iconcolor: "#000000",
        link: "/settings/help"
    },
    {
        label: "Delete Account",
        details: "Permantly Remove your account",
        icon: ProfileDelete,
        iconcolor: "#FF383C"
    }
]



export const securityList = [ 
    {
        label: "Change Pin",
        details: "Protection against intruders", 
    },
    {
        label: "Get Help",
        details: "Get help from support team", 
    }
]
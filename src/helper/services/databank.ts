import { BiMessageDetail } from "react-icons/bi";
import { BsPersonCircle, BsShop } from "react-icons/bs";
import { IoHeartOutline, IoSettingsOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";

export const menulist = [
    {
        title: "My Profile",
        icon: BsPersonCircle,
        link: ""
    },
    {
        title: "Message",
        icon: BiMessageDetail,
        link: ""
    },
    {
        title: "Settings",
        icon: IoSettingsOutline,
        link: ""
    },
    {
        title: "Favourite",
        icon: IoHeartOutline,
        link: ""
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
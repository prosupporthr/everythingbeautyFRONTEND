
import { Briefcase, Shop, Message, Home, Receipt1, Wallet2, WalletAdd1, User, Heart, Calendar } from 'iconsax-reactjs';


export const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday", 
    "Thursday",
    "Friday",
    "Saturday"
]

export const skill = [
    "Hair Weaving",
    "Precision Cutting",
    "Balayage",
    "Color Artistry",
    "Advanced Skincare",
    "Bridal Styling",
    "Chemical Texturizing",
    "Scalp Treatments",
    "Brow & Lash Artistry"
]


export const walletList = [
    // {
    //     icon: EmptyWalletTick,
    //     label: "Make Payment",
    //     link: "/wallet"
    // },
    {
        icon: WalletAdd1,
        label: "Fund Wallet",
        link: "/wallet"
    },
    {
        icon: Wallet2,
        label: "Withdraw",
        link: "/wallet/withdraw"
    },
    {
        icon: Receipt1,
        label: "History",
        link: "/wallet/history"
    } 
]

export const paginationLimit = [
    {
        value: "10",
        label: "10",
    },
    {
        value: "20",
        label: "20",
    },
    {
        value: "30",
        label: "30",
    },
    {
        value: "40",
        label: "40",
    },
    {
        value: "50",
        label: "50",
    },
    {
        value: "60",
        label: "60",
    },
    {
        value: "70",
        label: "70",
    },
]; 

export const tabsClient = [
    { label: "Schedule", value: null, icon: Home },
    { label: "Post", value: "post", icon: Message },
    { label: "Bookmark", value: "favourite", icon: Heart },
    { label: "Profile", value: "profile", icon: User }, 
    // { label: "Settings", value: "settings" },
    // { label: "Profile", value: "profile" },
];


// const tabs = [
//     { label: "Overview", value: null },
//     { label: "Schedule", value: "schedule" },
//     { label: "Post", value: "post" },
//     { label: "Services", value: "services" },
//     { label: "My Product", value: "store" },
//     // { label: "Settings", value: "settings" },
//     { label: "Profile", value: "profile" },
// ];
export const tabs = [
    { label: "Overview", value: null, icon: Home },
    { label: "Schedule", value: "schedule", icon: Calendar },
    { label: "Post", value: "post", icon: Message },
    { label: "Services", value: "services", icon: Briefcase },
    { label: "My Product", value: "store", icon: Shop },
    // { label: "Profile", value: "profile", icon: User },
];
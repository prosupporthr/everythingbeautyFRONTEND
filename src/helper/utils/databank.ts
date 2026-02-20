
import { EmptyWalletTick, Receipt1, Wallet2, WalletAdd1 } from 'iconsax-reactjs';


export const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday", 
    "Thursday",
    "Friday",
    "Saturday"
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
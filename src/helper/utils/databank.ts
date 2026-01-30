
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
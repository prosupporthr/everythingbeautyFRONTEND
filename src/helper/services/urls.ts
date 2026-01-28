export const URLS = {
    LOGIN: `/user/login/email`,
    SIGNUP: `/user/signup/email`, 
    VERIFY: `/user/verify-otp`, 
    RESENDOTP: `/user/resend-otp`, 
    UPLOAD: "/upload/file",
    BUSINESS: "/business",
    BUSINESSFILTER: "/business/filter",
    CREATECHAT: "/messaging/chats",
    ADDRESS: "/address",
    SENDCHAT: "/messaging/messages",
    REVIEW: "/review",
    REVIEWBYUSERID: (item: string) => `/review/pending/${item}`,
    REVIEWBYBUSINESSID: (item: string) => `/review/business/${item}`,
    ADDRESSBYID: (item: string) => `/address/${item}`,
    CHATLIST: (item: string) => `/messaging/chats/user/${item}`,
    CHATLISTBYID: (item: string) => `/messaging/chats/${item}`,
    CHATDELETE: (item: string) => `/messaging/chats/${item}`,
    CHATMESSAGES: (item: string) => `/messaging/chats/${item}/messages`,
    BOOKING: "/booking",
    ORDER: "/order",
    SERVICE: "/service",
    SERVICEBYID: (item: string) => `/service/${item}`,
    PRODUCT: "/product",
    BUSINESSBYID: (item: string) => `/business/${item}`,
    PRODUCTBYID: (item: string) => `/product/${item}`,
    USERUPDATE: (item: string) => `/user/${item}`,
    BOOKMARK: `/bookmarks/toggle`,
    BOOKMARKBYID: (item: string) => `/bookmarks/${item}`
}

// export const IMAGE_URL = process.env.NEXT_PUBLIC_RESOURCE_URL as string; 

// export const RESOURCE_BASE_URL = process.env.NEXT_PUBLIC_AWS_BASE_URL as string; 

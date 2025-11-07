export const URLS = {
    LOGIN: `/user/login/email`,
    SIGNUP: `/user/signup/email`, 
    VERIFY: `/user/verify-otp`, 
    UPLOAD: "/upload/file",
    BUSINESS: "/business",
    BOOKING: "/booking",
    SERVICE: "/service",
    SERVICEBYID: (item: string) => `/service/${item}`,
    PRODUCT: "/product",
    PRODUCTBYID: (item: string) => `/product/${item}`,
    USERUPDATE: (item: string) => `/user/${item}`
}

// export const IMAGE_URL = process.env.NEXT_PUBLIC_RESOURCE_URL as string; 

// export const RESOURCE_BASE_URL = process.env.NEXT_PUBLIC_AWS_BASE_URL as string; 

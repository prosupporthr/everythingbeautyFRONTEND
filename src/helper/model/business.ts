import { IUserDetail } from "./user";

export interface IBusiness {
    userId: string;
    name: string;
    location: string;
    long: string;
    lat: string;
    days: number[];
    openingTime: string;
    closingTime: string;
    chargeTiming: string;
    pictures: string[];
    licenseNumber: string;
}

export interface IBooking {
    userId: string;
    businessId: string;
    serviceId: string;
    totalPrice: number;
    bookingDate: string;
}

export interface IOrder {
    userId: string;
    businessId: string;
    productId: string;
    quantity: number;
    totalPrice: number;
    paymentStatus: string;
    status: string;
}

export interface IBusinessDetails {
    _id: string;
    isDeleted: boolean;
    userId: string;
    name: string;
    location: string;
    long: string;
    lat: string;
    days: number[];
    openingTime: string;
    closingTime: string;
    chargeTiming: string;
    pictures: string[];
    rating: number;
    approved: boolean;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
    creator: IUserDetail;
}

export interface IServices {
    businessId: string;
    name: string;
    description: string;
    hourlyRate: number | string;
    allowReview: boolean;
    pictures?: string[];
    acceptsInitialDeposit: boolean;
    initialDepositPercentage: number | string;
}

export interface IOrderDetail {
    _id: string;
    isDeleted: boolean;
    userId: string;
    businessId: string;
    productId: string;
    quantity: number;
    totalPrice: number;
    paymentStatus: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: 0;
    user: IUserDetail;
    product: IProductDetail;
    business: IBusinessDetails;
}

export interface IBookingDetail {
    _id: string;
    isDeleted: boolean;
    userId: string;
    businessId: string;
    serviceId: string;
    totalPrice: number;
    bookingDate: string;
    paymentStatus: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    service: IServiceDetail;
    user: IUserDetail;
}

export interface IProduct {
    businessId: string;
    name: string;
    description: string;
    price: number | string;
    allowReview: boolean;
    pictures?: string[];
    colors?: { label: string; color: string }[];
    quantity?: string | number;
}

export interface IBookingmark {
    userId: string;
    type: string;
    serviceId?: string;
    productId?: string;
}

export interface IProductDetail {
    _id: string;
    isDeleted: boolean;
    businessId: string;
    name: string;
    description: string;
    allowReview: boolean;
    pictures: string[];
    price: number;
    colors: {
        label: string;
        color: string;
    }[];
    quantity: string | number;
    hasBookmarked: boolean;
    createdAt: string;
    updatedAt: string;
    business: IBusinessDetails;
}

export interface IServiceDetail {
    _id: string;
    isDeleted: boolean;
    businessId: string;
    name: string;
    description: string;
    hourlyRate: number;
    acceptsInitialDeposit: boolean;
    initialDepositPercentage: number | string;
    hasBookmarked: boolean;
    allowReview: boolean;
    pictures: string[];
    createdAt: string;
    updatedAt: string;
    business: IBusinessDetails;
}

export interface IRating {
    business: IBusinessDetails;
    orders: string[];
    bookings: string[];
}

export interface IRatingDetails {
    _id: string;
    isDeleted: boolean;
    userId: string;
    businessId: string;
    description: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    user: IUserDetail;
    business: {
        _id: string;
        name: string;
        location: string;
        pictures: string[];
        rating: number;
        approved: boolean;
        enabled: boolean;
    };
}

export interface IRatingForm {
    userId: string;
    businessId: string;
    description: string;
    rating: number;
}

export interface ITransaction {
    _id: string;
    isDeleted: boolean;
    userId: string;
    amount: number;
    source: string;
    type: string;
    flow: "inbound" | "outbound";
    typeId: string;
    stripeIntentId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: 0;
}

export interface IBank {
    "id": string,
    "bankName": string,
    "last4": string,
    "currency": string,
    "status": string,
    "isDefault": false
}

export interface IWithdraw {
    "userId": string,
    "amount": number,
    "bankAccountId": string,
    "currency": string
  }

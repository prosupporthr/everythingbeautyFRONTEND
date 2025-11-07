
export interface IBusiness {
    "userId": string,
    "name": string,
    "location": string,
    "long": string,
    "lat": string,
    "days": number[],
    "openingTime": string,
    "closingTime": string,
    "chargeTiming": string,
    "pictures": string[]
}

export interface IBooking {
    "userId": string,
    "businessId": string,
    "serviceId": string,
    "totalPrice": number,
    "bookingDate": string
}

export interface IBusinessDetails {
    "_id": string,
    "isDeleted": boolean,
    "userId": string,
    "name": string,
    "location": string,
    "long": string,
    "lat": string,
    "days": number[],
    "openingTime": string,
    "closingTime": string,
    "chargeTiming": string,
    "pictures": string[],
    "rating": number,
    "approved": boolean,
    "enabled": boolean,
    "createdAt": string,
    "updatedAt": string,
}

export interface IServices {
    "businessId": string,
    "name": string,
    "description": string,
    "hourlyRate": number,
    "allowReview": boolean,
    "pictures"?: string[]
}

export interface IProduct {
    "businessId": string,
    "name": string,
    "description": string,
    "price": number,
    "allowReview": boolean,
    "pictures"?: string[]
}

export interface IProductDetail {
    "_id": string,
    "isDeleted": boolean,
    "businessId": string,
    "name": string,
    "description": string,
    "allowReview": boolean,
    "pictures": string[],
    "price": number,
    "colors": string[],
    "createdAt": string,
    "updatedAt": string,
}

export interface IServiceDetail {
    "_id": string,
    "isDeleted": boolean,
    "businessId": string,
    "name": string,
    "description": string,
    "hourlyRate": number,
    "allowReview": boolean,
    "pictures": string[],
    "createdAt": string,
    "updatedAt": string,
}
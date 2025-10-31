
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

export interface IServices {
    "businessId": string,
    "name": string,
    "description": string,
    "hourlyRate": number,
    "allowReview": boolean,
    "pictures": string[]
}

export interface IProduct {
    "businessId": string,
    "name": string,
    "description": string,
    "price": number,
    "allowReview": boolean,
    "pictures": string[]
}
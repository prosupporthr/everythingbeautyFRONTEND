

export interface ILogin {
    email: string,
}

export interface IAuth {
    email: string,
}

export interface IOnboarding {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    gender: string,
    profilePicture: string,
    dateOfBirth: string,
}



export interface IUser {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    dateOfBirth: string,
    gender: string,
    profilePicture?: string,
    about: string,
    homeAddress: string,
    state: string,
    officeAddress: string,
    country: string
}

export interface IAddress {
    address: string,
    city: string,
    state: string,
    country: string,
    lat: string,
    long: string,
    isPrimary: boolean
}

export interface IAddressDetail {
    "_id": string,
    "isDeleted": false,
    "userId": string,
    "address": string,
    "city": string,
    "state": string,
    "country": string,
    "lat": string,
    "long": string,
    "isPrimary": true,
    "createdAt": string,
    "updatedAt": string,
    "__v": 0
}
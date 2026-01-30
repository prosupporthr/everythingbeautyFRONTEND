export interface IUserDetail {
    _id: string;
    isDeleted: boolean;
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    plan: string;
    about: string;
    country: string;
    officeAddress: string;
    state: string;
    homeAddress: string;
    isSuspended: boolean;
    createdAt: string;
    updatedAt: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    profilePicture: string;
    id: string;
    business: {
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
    };
}

export interface IWallet {
    _id: string;
    userId: string;
    balance: number;
    createdAt: string;
    isDeleted: boolean;
    updatedAt: string;
}

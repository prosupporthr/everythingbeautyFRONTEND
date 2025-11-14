

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
    profilePicture: string,
    about: string,
    homeAddress: string,
    state: string,
    officeAddress: string,
    country: string
}
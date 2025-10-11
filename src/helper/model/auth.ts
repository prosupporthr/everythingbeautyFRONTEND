

export interface ILogin {
    email: string, 
}

export interface IAuth {
    email: string,
    confirmemail: string
}

export interface IUserForm {
    fullName: string;
    about: string;
    profilePicture: string;
    track: string;
    interests: string[];
  }
import { IUserDetail } from "./user";

export interface ICreateChat {
    senderId: string;
    recipientId: string;
}

export interface ISendChat {
    chatId: string;
    senderId: string;
    type: "text" | "file" | string;
    message: string;
}

export interface IChatList {
    _id: string;
    isDeleted: boolean;
    senderId: string;
    recipientId: string;
    sender: IUserDetail;
    recipient: IUserDetail;
    createdAt: string;
    updatedAt: string;
    lastMessage: IChatMessage;
}

export interface IChatMessage {
    _id: string;
    isDeleted: boolean;
    chatId: string;
    isEdited: boolean;
    isRead: boolean;
    repliedMessage: string;
    message: string;
    senderId: string;
    sender: IUserDetail;
    type: string;
    createdAt: string;
    updatedAt: string;
}

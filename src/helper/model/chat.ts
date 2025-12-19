import { IUserDetail } from "./user"


export interface ICreateChat {
    "senderId": string,
    "recipientId": string, 
}

export interface ISendChat {
    "chatId": string,
    "senderId": string,
    "type": "text" | "file" | string,
    "message": string
  } 

export interface IChatList {
    "_id": "69272599f7590513f97160ca",
    "isDeleted": boolean,
    "senderId": string,
    "recipientId": string,
    sender: IUserDetail,
    recipient: IUserDetail, 
    "createdAt": "2025-11-26T16:06:49.519Z",
    "updatedAt": "2025-11-26T16:06:49.519Z",
    "__v": 0
} 

export interface IChatMessage {
    "_id": string,
    "isDeleted": boolean,
    "chatId": string,
    "message": string,
    "senderId": string,
    sender: IUserDetail
    "type": string,
    "createdAt": string,
    "updatedAt": string, 
  }
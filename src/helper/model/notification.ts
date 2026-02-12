

export interface INotification {
    "_id": string,
    "userId": string,
    "title": string,
    "description": string,
    "isForAdmin": boolean,
    "isRead": boolean,
    "readBy": string[],
    "createdAt": string,
    "updatedAt": string, 
}
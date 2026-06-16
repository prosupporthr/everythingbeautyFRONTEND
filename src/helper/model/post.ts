import { IUserDetail } from "./user";

export interface IPostComment {
    body: string;
    isReply: boolean;
    commentId: string;
    images?: string[];
}

export interface IComment {
    _id: string;
    isDeleted: boolean;
    body: string;
    isReply: boolean;
    commentId: string;
    images: [];
    userId: string;
    user: IUserDetail;
    postId: string;
    likes: [];
    createdAt: string;
    replies: number;
    updatedAt: string;
    __v: 0;
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

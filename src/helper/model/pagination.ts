export interface IPagination<T> {
    "success": boolean,
    "message": string,
    "data": Array<T> | null,
    "page": number,
    "total": number
}
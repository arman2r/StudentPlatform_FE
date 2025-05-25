import { ISubject } from "./ISubject.interface";

export interface IUser {
    id?: number | string;
    fullName?: string;
    email: string;
    passwordHash: string
    createdAt?: string;
    subjects?: ISubject[]
}
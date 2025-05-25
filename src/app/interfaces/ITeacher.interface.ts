import { ISubject } from "./ISubject.interface";

export interface ITeacher{
    id?: number;
    fullName?: string;
    email: string; 
    createdAt?: string;
    subjects?: ISubject[]
}
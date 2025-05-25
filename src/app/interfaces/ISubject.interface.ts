import { ITeacher } from "./ITeacher.interface";

export interface ISubject {
    id?: number;
    name: string;
    credits?: number;
    teacher?: ITeacher[];
}
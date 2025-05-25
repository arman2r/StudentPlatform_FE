export interface ITeacherSubject {
    subjectId?: number;
    teacherId: number[]; 
}

export interface ITeacherBySubject {
    teacherId?: number;
    teacherName?: string;
    subjectId?: number;
    subjectName?: string
}
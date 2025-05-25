import { Component, inject, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { SubjectsService } from '../../services/subjects.service';
import { ISubject } from '../../interfaces/ISubject.interface';
import { Subscription, forkJoin } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { IUser } from '../../interfaces/IUser.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherService } from '../../services/teacher.service';
import { ITeacherBySubject } from '../../interfaces/ITeacherSubject.interface';

@Component({
  selector: 'app-register-subject',
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, MatDividerModule, MatCardModule, FormsModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './register-subject.component.html',
  styleUrl: './register-subject.component.scss'
})
export class RegisterSubjectComponent implements OnInit {
  SubjectList: ISubject[] = [];
  isLoading = false;
  private subscription!: Subscription;
  private studentSubscription!: Subscription;
  private studenObj!: IUser;
  subjectForm!: FormGroup;
  subjectControl = new FormControl();
  userType!: string;
  private _snackbar = inject(MatSnackBar);
  subjectStudenAssigned: any;
  subjectsAssigned!: string[];

  constructor(private subjectService: SubjectsService, private teacherService: TeacherService, private studentService: StudentService, private router: Router) { }

  ngOnInit(): void {
    this.getSubjects();
    this.loadSubjects();
    const segments = this.router.url.split('/');
    const userType = segments[1]; // "student"
    this.userType = userType;

    if (userType === 'Student') {
      this.getUserType();
    } else {

    }

    this.subjectForm = new FormGroup({
      subjects: this.subjectControl
    });
  }

  getUserType() {
    this.studentSubscription = this.studentService.isStudent().subscribe({
      next: (student) => (this.studenObj = student),
      error: (err) => console.error('Error al obtener el tipo de usuario:', err),
    });
  }

  loadUserType() {
    this.isLoading = true;
    this.studentService.isStudent().subscribe({
      next: () => (this.isLoading = false),
      error: () => (this.isLoading = false),
    });
  }

  getSubjects() {
    this.subscription = this.subjectService.getSubjects().subscribe({
      next: (subjects) => {
        this.SubjectList = subjects;
        console.log('this.userType', this.userType === 'student');
        if (this.userType !== 'student' && this.userType !== undefined) {
          console.log('esta entrando aqui');
          this.teacherService.getTeacherDetail().subscribe({
            next: (teacher) => {
              console.log('subjects teacher', teacher);
              // Extrae solo los IDs de las materias del profesor y los setea en el control
              if (teacher.subjects?.length === 0) return
              const subjectIds = teacher.subjects?.map((subject: any) => subject.id.toString());
              this.subjectControl.setValue(subjectIds);
            },
            error: (err) => console.error('Error al obtener el profesor:', err),
          });
        } else {
          this.studentService.isStudent().subscribe({
            next: (student) => {
              console.log('subjects student', student);
              // Extrae solo los IDs de las materias del estudiante y los setea en el control
              if (student.subjects?.length === 0) return
              this.subjectStudenAssigned = student?.subjects;
              const subjectIds = student.subjects?.map((subject: any) => subject?.subjectId?.toString());
              console.log('subjectIds', subjectIds);
              this.subjectsAssigned = subjectIds as string[];
              this.subjectControl.setValue(subjectIds);
            },
            error: (err) => console.error('Error al obtener el estudiante:', err),
          })
        }
      },
      error: (err) => console.error('Error en la suscripción:', err),
    });
  }

  // Opcional: Forzar recarga de datos
  loadSubjects() {
    this.isLoading = true;
    this.subjectService.loadSubjects().subscribe({
      next: () => (this.isLoading = false),
      error: () => (this.isLoading = false),
    });
  }

  saveSubjects() {
    this.isLoading = true;
    const selectedSubjects = this.subjectControl.value;
    if (this.userType === 'student') {

      this.studentService.getTeacherBySubject(selectedSubjects[0]).subscribe({
        
        error: (err) => console.error('Error al obtener el profesor:', err),
      })

      const filterSelected = this.SubjectList.filter(subject => selectedSubjects.includes(subject.id?.toString()));
      
      if (filterSelected.length > 3) {
        this._snackbar.open('No puedes seleccionar más de 3 materias', 'Cerrar');
        this.isLoading = false;
      } else {
        const observables = selectedSubjects.map((subjectId: string) =>
          this.studentService.getTeacherBySubject(Number(subjectId))
        );

        forkJoin(observables).subscribe({
          next: (results: any) => {
            // Construir teacherBySubject combinando resultados
            const teacherBySubject = results.map((teacherArray: any, index: number) => ({
              subjectId: Number(selectedSubjects[index]),
              teacherId: teacherArray[0].teacherId
            }));

            // Ahora sí, llamar al servicio de asignación con los datos completos
            this.studentService.setSubjectsStudent(teacherBySubject).subscribe({
              next: () => {
                this._snackbar.open('Materias asignadas correctamente', 'Cerrar');
                this.isLoading = false;
                this.getSubjects();
                this.loadSubjects();
              },
              error: (error) => {
                this._snackbar.open('Error al asignar las materias', 'Cerrar', {
                  duration: 2000,
                });
                this._snackbar.open(error, 'Cerrar');
                this.isLoading = false;
                this.getSubjects();
                this.loadSubjects();
              }
            });
          },
          error: (err) => {
            this._snackbar.open('Error al obtener los profesores', 'Cerrar');
            this.isLoading = false;
          }
        });
      }
    } else {
      const filterSelected = this.SubjectList.filter(subject => selectedSubjects.includes(subject.id?.toString()));
      if (filterSelected.length > 2) {
        this._snackbar.open('No puedes seleccionar más de 2 materias', 'Cerrar');
        this.isLoading = false;
      } else {
        this.teacherService.setSubjectsTeacher(selectedSubjects).subscribe({
          next: () => {
            this._snackbar.open('Materias asignadas correctamente', 'Cerrar');
            this.isLoading = false;
            this.getSubjects();
            this.loadSubjects();
          },
          error: (error) => {
            this._snackbar.open('Error al asignar las materias', 'Cerrar', {
              duration: 2000,
            });
            this._snackbar.open(error, 'Cerrar');
            this.isLoading = false;
            this.getSubjects();
            this.loadSubjects();
          }
        })
      }
    }
  }

  validAssigned(subjectId: any) {

    if (this.userType === 'teacher') {
      if (this.subjectForm.value.subjects.length > 2) {
        this._snackbar.open('No puedes seleccionar más de 2 materias', 'Cerrar');
        this.subjectControl.setValue(
          this.subjectControl.value.filter((id: string) => id !== subjectId.toString())
        );
        return
      }
      return
    }
    // Preguntamos si el usuario tiene mas de 3 materias asignadas
    if (this.subjectForm.value.subjects.length > 3) {
      this._snackbar.open('No puedes seleccionar más de 3 materias', 'Cerrar');
      this.subjectControl.setValue(
        this.subjectControl.value.filter((id: string) => id !== subjectId.toString())
      );
      return
    } else {

      if (this.subjectForm.value.subjects.length < this.subjectsAssigned.length) return

      this.studentService.getTeacherBySubject(Number(subjectId)).subscribe({
        next: (teacher) => {
          console.log('teacher', teacher);
          const filterTeacher = this.subjectStudenAssigned.filter((item: ITeacherBySubject) => item.teacherId === teacher[0].teacherId);
          console.log('filterTeacher', filterTeacher);
          if (filterTeacher.length > 0) {
            this._snackbar.open('No puedes asignar mas de una materia con el mismo profesor', 'Cerrar', {
              duration: 5000,
            });
            this.subjectControl.setValue(
              this.subjectControl.value.filter((id: string) => id !== subjectId.toString())
            );
            this.getSubjects();
            this.loadSubjects();
          }
        },
        error: (err) => console.error('Error al obtener el profesor:', err),
      })
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Evita fugas de memoria

  }
}

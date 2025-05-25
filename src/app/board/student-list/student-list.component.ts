import { ChangeDetectionStrategy, Component, OnInit, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { StudentService } from '../../services/student.service';
import { ResponsePartner } from '../../interfaces/IParterners.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-student-list',
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatListModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent implements OnInit {
  accordion = viewChild.required(MatAccordion);
  studentList = signal<ResponsePartner[]>([]);
  isLoading = false;
  userType!: string;
  counterStudents = signal<number>(0);

  constructor(private studentService: StudentService, private router: Router) { }

  ngOnInit() {
    const segments = this.router.url.split('/');
    const userType = segments[1]; // "student"
    this.userType = userType;
    this.getPartnerStudents();
  }

  getPartnerStudents() {
    this.studentService.getStudyPartner().subscribe({
      next: (res) => {
        
        const resMapParnerts = Object.entries(res).map(([subject, partners]) => ({ subject, partners }) as ResponsePartner);
        this.studentList.set(resMapParnerts);
        resMapParnerts.forEach((partner) => {
          this.counterStudents.update((count) => count + (partner.partners?.length ?? 0));
        });
        
        //this.studentList.set(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}

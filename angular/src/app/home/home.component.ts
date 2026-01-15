import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import MatProgressSpinnerModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { ApiService } from '../services/api.service';
import { forkJoin, Observable } from 'rxjs'; // Import forkJoin, Observable
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../services/auth.service'; // Import AuthService
import { switchMap, map } from 'rxjs/operators'; // Import switchMap and map

interface CourseExamStatus {
  completed: boolean;
  answeredCount: number;
  totalQuestions: number;
}

interface Course {
  id: string;
  title: string;
  short_description: string;
  level: string;
  category_name: string;
  thumbnail: string;
  isExamCompleted: boolean;
  hasTakenExam: boolean;
  progressText: string;
  progressBarPercentage: number;
  averageScore: string;
  list_order: number; // Add list_order here
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule], // Add MatFormFieldModule and MatInputModule
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  protected readonly title = signal('Mock Bar App');
  loading = signal(true); // Make loading a signal

  allCourses = signal<Course[]>([]); // Array to hold all courses flattened from categories
  userDiagAns: any[] = []; // To store diag_ans for the logged-in user
  quizQuestionsCount: { [courseId: string]: number } = {}; // To store total questions per course

  searchTerm = signal('');

  filteredCourses = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allCourses().filter(course =>
      course.title.toLowerCase().includes(term) ||
      course.short_description.toLowerCase().includes(term) ||
      course.category_name.toLowerCase().includes(term) ||
      course.level.toLowerCase().includes(term)
    );
  });


  constructor(
    private apiService: ApiService,
    private router: Router, // Inject Router
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit() {
    this.fetchAllData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm.set(filterValue);
  }

  fetchAllData() {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('User not logged in. Cannot fetch data for courses.');
      this.loading.set(false); // Set loading to false if user not logged in
      return;
    }

    this.loading.set(true); // Set loading to true at the start of data fetching

    forkJoin({
      categoriesWithCourses: this.apiService.getCategoriesWithCourses(),
      diagAns: this.apiService.getDiagAnsForUser(),
      quizCounts: this.apiService.getQuizQuestionsCountPerCourse()
    }).pipe(
      // Once initial data is loaded, fetch exam statuses for all courses
      switchMap((initialResults: { categoriesWithCourses: any[]; diagAns: any[]; quizCounts: any[] }) => {
        let tempAllCourses: Course[] = []; // Specify type as Course[]
        initialResults.categoriesWithCourses.map((category: any) => {
          category.courses = category.courses.map((course: any) => ({
            ...course,
            category_name: category.category_name,
            thumbnail: course.upcoming_image_thumbnail || 'https://topbarassist.com/chanrobles-bar/mock/img/placeholder.jpg'
          }));
          tempAllCourses = tempAllCourses.concat(category.courses);
        });
        this.userDiagAns = initialResults.diagAns;
        this.quizQuestionsCount = initialResults.quizCounts.reduce((acc: { [key: string]: number }, curr: any) => {
          acc[curr.q_course_id] = curr.total_questions;
          return acc;
        }, {});

        const examStatusObservables: Observable<{ courseId: any; status: CourseExamStatus }>[] = tempAllCourses.map(course =>
          this.apiService.getExamStatusForCourse(course.id, userId).pipe(
            map((status: CourseExamStatus) => ({ courseId: course.id, status }))
          )
        );
        return forkJoin(examStatusObservables).pipe(
          map((examStatuses: { courseId: any; status: CourseExamStatus }[]) => ({ initialResults, examStatuses, tempAllCourses }))
        );
      })
    ).subscribe({
      next: ({ examStatuses, tempAllCourses }) => { // Changed initialResults parameter to be destructured correctly
        const examStatusMap = new Map<any, CourseExamStatus>(examStatuses.map((es: { courseId: any; status: CourseExamStatus }) => [es.courseId, es.status]));

        const processedCourses: Course[] = tempAllCourses.map(course => {
          const status = examStatusMap.get(course.id);
          return {
            ...course,
            isExamCompleted: status?.completed || false,
            hasTakenExam: (status?.answeredCount || 0) > 0 // User has taken exam if answered any questions
          };
        });

        // Explicitly sort all courses by list_order before further processing
        processedCourses.sort((a, b) => a.list_order - b.list_order);

        this.allCourses.set(this.processCoursesForMetrics(processedCourses)); // Update allCourses signal
        this.loading.set(false); // Set loading to false after successful data fetching
      },
      error: (error) => {
        console.error('Error fetching all data:', error);
        this.loading.set(false); // Set loading to false on error
      }
    });
  }

  processCoursesForMetrics(coursesToProcess: Course[]): Course[] {
    return coursesToProcess.map(course => {
      const courseId = course.id;
      const totalQuestions = this.quizQuestionsCount[courseId] || 0;

      const userAnswersForCourse = this.userDiagAns.filter(
        ans => ans.batch_id == courseId // Using == for potential type coercion with string/number IDs
      );

      const answeredQuestions = userAnswersForCourse.length;
      let progressText = `${answeredQuestions}/${totalQuestions} questions`;
      let progressBarPercentage = 0;

      if (totalQuestions > 0) {
        progressBarPercentage = (answeredQuestions / totalQuestions) * 100;
      }

      let averageScore = 0;
      if (answeredQuestions > 0) {
        const sumScores = userAnswersForCourse.reduce((sum, ans) => sum + ans.score, 0);
        averageScore = sumScores / answeredQuestions;
      }

      return {
        ...course,
        progressText,
        progressBarPercentage,
        averageScore: averageScore.toFixed(2) // Format to 2 decimal places
      };
    });
  }

  goToExam(courseId: string) {
    this.router.navigate(['/exam', courseId]);
  }

  goToHistory(courseId: string) {
    this.router.navigate(['/history', courseId]);
  }
}
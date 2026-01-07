import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getCategoriesWithCourses', 'getDiagAnsForUser', 'getQuizQuestionsCountPerCourse', 'getExamStatusForCourse']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserId']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading to false and populate courses on successful data fetch', fakeAsync(() => {
    // Arrange
    const mockCategories = [
      {
        category_name: 'Law',
        courses: [
          { id: '1', title: 'Civil Law', short_description: 'Desc 1', level: 'Beginner', upcoming_image_thumbnail: '' },
        ],
      },
    ];
    const mockDiagAns = [];
    const mockQuizCounts = [{ q_course_id: '1', total_questions: 10 }];
    const mockExamStatus = { completed: false, answeredCount: 0, totalQuestions: 10 };

    mockAuthService.getUserId.and.returnValue('123');
    mockApiService.getCategoriesWithCourses.and.returnValue(of(mockCategories));
    mockApiService.getDiagAnsForUser.and.returnValue(of(mockDiagAns));
    mockApiService.getQuizQuestionsCountPerCourse.and.returnValue(of(mockQuizCounts));
    mockApiService.getExamStatusForCourse.and.returnValue(of(mockExamStatus));

    // Act
    fixture.detectChanges(); // This triggers ngOnInit
    tick(); // Complete the asynchronous operations
    fixture.detectChanges(); // Update the view with the new data

    // Assert
    expect(component.loading()).toBe(false);
    expect(component.filteredCourses().length).toBeGreaterThan(0);
    expect(component.filteredCourses()[0].title).toBe('Civil Law');
  }));
});

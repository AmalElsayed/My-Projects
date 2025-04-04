import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  // ... بيانات المستخدم الأخرى
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = 'https://jsonplaceholder.typicode.com/users'; // تأكد من تطابق هذا مع عنوان URL لخادمك

  constructor(public http: HttpClient, private router: Router) {
    // تحقق عند بدء تشغيل التطبيق إذا كان هناك رمز مميز محفوظ
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedInSubject.next(true);
      this.loadUserProfile(); // حاول تحميل ملف تعريف المستخدم إذا كان هناك رمز مميز
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('authToken', response.token); // احفظ الرمز المميز
        this.isLoggedInSubject.next(true);
        this.loadUserProfile(); // قم بتحميل ملف تعريف المستخدم بعد تسجيل الدخول
        this.router.navigate(['/']); // قم بتوجيه المستخدم إلى الصفحة الرئيسية أو أي صفحة أخرى
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']); // قم بتوجيه المستخدم إلى صفحة تسجيل الدخول
  }

  loadUserProfile(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.http.get<User>(`${this.apiUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}` // قم بتضمين الرمز المميز في الرأس
        }
      }).subscribe(
        (user) => {
          this.currentUserSubject.next(user);
        },
        (error) => {
          console.error('Error loading user profile', error);
          this.logout(); // قم بتسجيل الخروج إذا فشل تحميل الملف الشخصي (قد يكون الرمز المميز غير صالح)
        }
      );
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}

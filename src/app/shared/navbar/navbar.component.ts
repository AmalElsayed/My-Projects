import { Component } from '@angular/core'; 
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  userName: string | null = null;

  constructor(public authService: AuthService, public router: Router) {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUser$.subscribe(user => {
      this.userName = user ? user.username : null;
    });
  }

  logout() {
    this.authService.logout();
  }
}

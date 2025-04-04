import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../services/auth.service'; 
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [NgIf],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
    if (!this.authService.currentUserValue) {
      this.authService.loadUserProfile();
    }
  }
}

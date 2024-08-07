// src/app/landing/landing.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../../base-layout/login/login.component';
import { CommonModule } from '@angular/common';
import { defaultLandingConfig, LandingConfig } from '../../../blueprints/landing/landing.blueprint';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [LoginComponent, CommonModule]
})
export class LandingComponent implements OnInit {
  config: LandingConfig = defaultLandingConfig;
  popupOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // You can add more logic here to dynamically fetch or update the config
  }

  toggleLogin(show: boolean) {
    this.config.showWelcome = !show;
    this.config.showLogin = show;
  }

  backgroundClick(event: MouseEvent) {
    if (this.config.showLogin && !this.popupOpen) {
      this.toggleLogin(false);
    }
  }

  contentClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onLoginPopupOpened() {
    this.popupOpen = true;
  }

  onLoginSuccess() {
    console.log('Login successful, navigating to /home');
    this.router.navigate(['/home']);
  }
}

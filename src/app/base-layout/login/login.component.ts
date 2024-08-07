import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult, BrowserAuthError } from '@azure/msal-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  @Output() onLoginSuccess = new EventEmitter<void>();
  @Output() loginPopupOpened = new EventEmitter<void>();

  loading: boolean = false;
  loginError: boolean = false;

  constructor(private msalService: MsalService) {}

  async signInWithMicrosoft() {
    this.loginPopupOpened.emit();
    this.loading = true;
    try {
      console.log('Clearing cache before login...');
      this.clearCache();

      if (this.isInteractionInProgress()) {
        console.log('Interaction is still in progress, retrying after delay...');
        await this.delay(2000);
      }

      if (this.isInteractionInProgress()) {
        console.error('Interaction in progress, aborting login');
        this.loading = false;
        this.loginError = true;
        return;
      }

      const result: AuthenticationResult | undefined = await this.msalService.loginPopup().toPromise();
      if (result) {
        this.msalService.instance.setActiveAccount(result.account);
        this.loading = false;
        this.loginError = false;
        this.onLoginSuccess.emit();
      } else {
        console.log('No result from loginPopup');
        this.loading = false;
        this.loginError = true;
      }
    } catch (error) {
      if (error instanceof BrowserAuthError && error.errorCode === 'interaction_in_progress') {
        console.error('Interaction in progress error:', error);
      } else {
        console.error('Login error:', error);
      }
      this.loading = false;
      this.loginError = true;
    }
  }

  clearCache() {
    console.log('Clearing localStorage and sessionStorage...');
    const msalKeys = Object.keys(localStorage).filter(key => key.includes('msal'));
    msalKeys.forEach(key => localStorage.removeItem(key));

    const sessionMsalKeys = Object.keys(sessionStorage).filter(key => key.includes('msal'));
    sessionMsalKeys.forEach(key => sessionStorage.removeItem(key));

    console.log('Cache cleared');
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isInteractionInProgress() {
    const keys = [...Object.keys(localStorage), ...Object.keys(sessionStorage)];
    return keys.some(key => key.includes('interaction_status'));
  }
}

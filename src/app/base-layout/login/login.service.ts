import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: MsalService, private router : Router) {

  }
  getPbiAccessToken = async() => {
    const tokenRequest : any = {
      //scopes: SsoConstants.powerBiScopes,
      account: this.authService.instance.getActiveAccount()
    };
    let accessTokenResponse : any = null;
    try{
      accessTokenResponse = await this.authService.acquireTokenSilent(tokenRequest).toPromise();
    }
    catch{
      this.router.navigate(['/'])
    }
    return accessTokenResponse.accessToken;
  }

  getWebAccessToken = async() => {
    const tokenRequest : any = {
      //scopes: SsoConstants.webApiScopes,
      account: this.authService.instance.getActiveAccount()
    };
    let accessTokenResponse : any = null;
    try{
      accessTokenResponse = await this.authService.acquireTokenSilent(tokenRequest).toPromise();
    }
    catch{
      this.router.navigate(['/'])
    }    return accessTokenResponse.accessToken;
  }

  logout() {
    //this.authService.logoutRedirect({ postLogoutRedirectUri: environment.postLogoutUrl });
  }


}

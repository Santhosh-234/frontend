import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { BaseLayoutService } from '../base-layout.service';
import { Abbreviations } from '../../../blueprints/base-layout/base-layout.blueprint';
import { LoginBluePrint } from '../../../blueprints/login/login.blueprint';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { Subject, filter, takeUntil } from 'rxjs';
import { InteractionStatus } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';
import { MsalconfigService } from '../../msalconfig.service';
import { Router } from '@angular/router';
import { LandingComponent } from '../../pages/landing/landing.component';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [LandingComponent, HeaderComponent, CommonModule]
})
export class LoginComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false;
  loginBlueprint: any = {};

  private readonly _destroy = new Subject<void>();
  constructor(private baseLayoutService: BaseLayoutService, @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadCastService: MsalBroadcastService,
    private authService: MsalService, private msalConfigService: MsalconfigService, private router: Router) {

  }
  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
  }
  loginIntialiser = async () => {
    this.loginBlueprint = LoginBluePrint.getLoginBlueprintData();
    return "Done";
  }
  login = async () => {
    let response: any = null;
    response = await this.authService.loginRedirect();
    this.authService.instance.setActiveAccount(response.account);
    this.authService.instance.setActiveAccount(response.account);
  }

  redirectUser() {
    this.router.navigate(['app'])
  }

  checkforActiveUser() {
    this.isUserLoggedIn = this.authService.instance.getAllAccounts().length > 0;
    if (this.isUserLoggedIn) {
      this.router.navigate(['app']);
    }
  }
  logout() {
    //this.authService.logoutRedirect({ postLogoutRedirectUri: environment.postLogoutUrl });
  }

  ngOnInit(): void {
    this.checkforActiveUser();
    this.msalBroadCastService.inProgress$.pipe
      (filter((interactionStatus: InteractionStatus) =>
        interactionStatus == InteractionStatus.None),
        takeUntil(this._destroy))
      .subscribe(x => {
        this.isUserLoggedIn = this.authService.instance.getAllAccounts().length > 0;
        if (
          this.authService.instance.getAllAccounts().length > 0
        ) {
          const accounts = this.authService.instance.getAllAccounts();
          this.authService.instance.setActiveAccount(accounts[0]);
          this.msalConfigService.isUserLoggedIn.next(this.isUserLoggedIn);
          this.redirectUser();
        }

      })
    this.baseLayoutService.setLoaded(false);
    this.loginIntialiser().then((data) => {
      this.baseLayoutService.setPageLevelMetadata(Abbreviations.login);
      this.baseLayoutService.setLoaded(true)
    })
  }
}

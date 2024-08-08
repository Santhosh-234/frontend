import { Component, OnInit } from '@angular/core';
import { BaseLayoutService } from './base-layout.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Abbreviations } from '../../blueprints/app/app.blueprint';
import { MsalconfigService } from '../msalconfig.service';
import { MsalService } from '@azure/msal-angular';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss'
})
export class BaseLayoutComponent implements OnInit{
  isUserLoggedIn: boolean = false;
  isLoaded: boolean = false;
  isLoadedObservable: any
  retailerData: any = [];
  profile?: any;
  profilePic?: any;
  switchingProfile: boolean = false;
  constructor(
    private baseLayoutService: BaseLayoutService,
    private router: Router,
    private store: Store,
    private msalConfigService: MsalconfigService,
    private authService: MsalService,
    private loginService: LoginService
    ) {

  }

  validateAndDetermineRedirect = async(numberOfRetailers: number, data: any) => {
    if (numberOfRetailers > 1) {
      // this.baseLayoutService.setUserRetailerAccess(data);
      // redirect to retailer selection page

      this.router.navigate(['app/retailers'])
    }
    // else if (numberOfRetailers == 1) {
    //   // redirect to base home
    //   let retailerData: string = data[0];
    //   this.store.dispatch(updateRetailerCode({ retailerCodeValue: retailerData }))
    //   if (data[0].hierarchies.length > 1) {

    //     let defaultRetailerHierarchy: any = data[0].hierarchies.filter((data: any) => data.isDefault == true);
    //     this.store.dispatch(updateHeirachyMetaData({ code: defaultRetailerHierarchy[0] }))
    //   }
    //   else {
    //     this.store.dispatch(updateHeirachyMetaData({ code: data[0].hierarchies[0] }))
    //   }
    //   this.router.navigate(['app/collaborationsuite'])
    // }
  }

  baseLayoutIntialiser = async () => {
    await this.loginService.getWebAccessToken();
    await this.loginService.getPbiAccessToken();
    //let userhasAccess: any = await this.baseLayoutService.checkForAppAccess();
    let retailerMetaData;
  //   if (userhasAccess) {
  //     retailerMetaData = await this.baseLayoutService.retailerHierarchyAccessMetaDataGenerator();
  //     // has access but no retailer access
  //     if (retailerMetaData.length == 0) {
  //       this.router.navigate(['app/no-access']);
  //     }
  //     this.store.dispatch(updateuserAccess({ accessData: retailerMetaData }))
  //     await this.validateAndDetermineRedirect(retailerMetaData.length, retailerMetaData);
  //   } else {
  //     this.router.navigate(['app/no-access']);
  //     return "Done"; // Return immediately when user doesn't have access.
  //   }
  //   await this.baseLayoutService.initialiseRetailerSpecificMount();
  //   this.profile = await this.msalConfigService.getProfile();
  //   this.baseLayoutService.profileDetails = this.profile;
  //   this.profilePic = await this.msalConfigService.getProfilePic();
  //   return "Done"; 
 }


  ngOnInit(): void {
    this.baseLayoutService.setLoaded(false);
    this.baseLayoutService.isLoaded$.subscribe((value) => {
      this.isLoaded = value;
    })
    this.baseLayoutService.switchingProfile.subscribe((value)=>{
      this.switchingProfile = value
    })
    this.baseLayoutIntialiser().then((data: any) => {
      this.baseLayoutService.setPageLevelMetadata(Abbreviations.baseLayout);
      this.baseLayoutService.setLoaded(true);
    });
  }

  

}

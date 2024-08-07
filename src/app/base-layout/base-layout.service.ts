import { Injectable } from '@angular/core';
import { BaseLayoutBlueprint } from '../../blueprints/base-layout/base-layout.blueprint';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class BaseLayoutService {
  private isLoaded = new BehaviorSubject<any>(false);
  public switchingProfile = new BehaviorSubject<any>(false);
  public profileDetails: any;
  isLoaded$ = this.isLoaded.asObservable();
  public isAdmin: boolean = false;
  private pageBackground = new BehaviorSubject<any>({});
  pageBackground$ = this.pageBackground.asObservable();
  public userRetailerAccess = new BehaviorSubject<any>('');
  public screenShotMode: boolean = false;
  public userRolesList: any = [];
  public userRoleListForAdmin: any = [];
  public sidenavExpanded: boolean = false;
  public topbarType = new BehaviorSubject<any>({ type: "type1", metadata: {} });
  public userURI = '';
  public retailerCode = '';
  public adminRoles = [];
  public userReportAccessList: any = [];
  public accessStortedSideNavData: any = new BehaviorSubject<any>([]);


  constructor(
    private http: HttpClient,
    private store: Store,
    private router : Router
  ) { }

  setLoaded = (value: boolean) => {
    this.isLoaded.next(value);
  }

  documentStyleVariablesIntialiser = () => {
    document.documentElement.style.setProperty('--baselayout-template', '');
    document.documentElement.style.setProperty('--sidebar-display', 'block');
    document.documentElement.style.setProperty('--topbar-display', 'block');
    document.documentElement.style.setProperty('--contentbody-display', 'block');
    document.documentElement.style.setProperty('--baselayout-rows', '100%');
    document.documentElement.style.setProperty('--baselayout-columns', '100%');

  }

  getGreetingText = () => {
    let now = new Date();
    let currentHour = now.getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  constructorGridAreaTemplateFromMetaData = (data: any) => {

    let metadata = data.layout;
    this.documentStyleVariablesIntialiser();
    const elementsToCheck = ["sidebar", "topbar", "contentbody"];
    let cssGridTemplate = '';
    for (let row = 0; row < metadata.length; row++) {
      cssGridTemplate += "'";
      for (let col = 0; col < metadata[row].length; col++) {
        const element = metadata[row][col];
        if (element) {
          cssGridTemplate += `${element} `;
        }
      }
      cssGridTemplate = cssGridTemplate.trim();
      if (cssGridTemplate) {
        cssGridTemplate += "'\n";
      }
    }

    const missingElements = elementsToCheck.filter(element => {
      return !metadata.flat().includes(element);
    });

    document.documentElement.style.setProperty('--baselayout-template', cssGridTemplate);
    document.documentElement.style.setProperty('--baselayout-rows', data.styleMetaData.gridTemplateRows);
    document.documentElement.style.setProperty('--baselayout-columns', (this.sidenavExpanded && !(missingElements.includes("sidebar"))) ? "24.9375rem calc(100% - 24.9375rem)" : (data.styleMetaData.gridTemplateColumns));

    missingElements.forEach((data) => {
      if (data == "sidebar") {

        document.documentElement.style.setProperty('--sidebar-display', 'none');
      }
      else if (data == "topbar") {

        document.documentElement.style.setProperty('--topbar-display', 'none');
      }
      else if (data == "contentbody") {

        document.documentElement.style.setProperty('--contentbody-display', 'none');
      }
    })
  }

  setPageTheme = (value: string) => {
    const className = BaseLayoutBlueprint.getBaseLayoutBlueprintDataDepthThree("appLayoutInfo", "pageStyleMetaData", value);
    const body = document.body;
    body.removeAttribute('class')
    if (this.screenShotMode == true && className == "helix-background") { //
      body.classList.add("framework-background-screenshotmode");
    }
    else {
      //body.classList.add(className);
    }
  }

  setScreenShotMode = (page: string) => {
    this.screenShotMode = !(this.screenShotMode);
    let data = BaseLayoutBlueprint.getBaseLayoutBlueprintDataDepthOne("appPageCodeMap");
    this.setPageTheme(data[page]);
  }

  setPageLevelMetadata = (value: any) => {
    this.setPageTheme(value)
    const pageLayout = BaseLayoutBlueprint.getBaseLayoutBlueprintDataDepthThree("appLayoutInfo", "gridAreaTemplate", value);

    this.constructorGridAreaTemplateFromMetaData(pageLayout);
    const topbarType: any = BaseLayoutBlueprint.getBaseLayoutBlueprintDataDepthFour("appLayoutInfo", "baseLayoutElements", "topBarType", value);

    if (topbarType.textContent == "dynamic") {
      const result: any = eval(topbarType.functionName);
      topbarType.textContent = result + ' , ' + this.profileDetails?.givenName + ' ' + this.profileDetails?.surname + '!';

    }
    this.topbarType.next(topbarType)

  }
  generateUserURI = async (retailerCode: string, hierarchyCode: string) => {
    this.userURI = BaseLayoutBlueprint.getUserUniqueURI(retailerCode, hierarchyCode, this.userRolesList[0])
  }
}

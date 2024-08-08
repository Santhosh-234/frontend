import { Component, Input, OnInit } from '@angular/core';
import { BaseLayoutService } from '../../base-layout/base-layout.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Profile } from '../../profile.model';
import { MsalconfigService } from '../../msalconfig.service';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';
import { commonBlueprint } from '../../../blueprints/common/common.blueprint';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: []
})
export class HeaderComponent implements OnInit {

  @Input() authenticatedView: string = '';
  @Input() profileDetails?: Profile;
  @Input() profilePhoto?: SafeResourceUrl;
  regionName : string = commonBlueprint.regionName; 
  topbarMetadata: any = {};
  profileDrowdownToggle: boolean = false;
  helloText = commonBlueprint.helloText;
  constructor(private baselayoutService: BaseLayoutService) {

  }


  ngOnInit(): void {
    this.baselayoutService.topbarType.subscribe((data) => {
      this.topbarMetadata = data;
      // this.getProfile();
      // this.getProfilePic();

    })
  }


  showMenu = () => {
    this.profileDrowdownToggle = true;
  }
  hideMenu = () => {
    this.profileDrowdownToggle = false;
  }
  toggleProfileDropdown() {
    this.profileDrowdownToggle = !(this.profileDrowdownToggle)
  }

}

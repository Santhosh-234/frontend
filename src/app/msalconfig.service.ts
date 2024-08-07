import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Profile } from './profile.model';
import { DomSanitizer } from '@angular/platform-browser';
const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

@Injectable({
  providedIn: 'root'
})
export class MsalconfigService {
  
  isUserLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private httpClient : HttpClient, private domSanitizer:DomSanitizer) { }

  async getUserProfile() {
    try {
      const profile = await this.httpClient
        .get<Profile>(GRAPH_ENDPOINT)
        .toPromise();
      return profile;
    } catch (error) {
      // Handle error appropriately
      throw error;
    }
  }

  async getProfile() {
    try {
      const profileInfo = await this.getUserProfile();
      return profileInfo;
    } catch (error) {
      // Handle error appropriately
      throw error;
    }
  }

  async getProfilePic() {
    try {
      const image = await this.httpClient
        .get("https://graph.microsoft.com/v1.0/me/photo/$value", {
          responseType: 'blob',
        })
        .toPromise();
  
      if (image instanceof Blob) {
        const profile = this.domSanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(image)
        );
        return profile;
      } else {
        throw new Error('Received an invalid or empty image.');
      }
    } catch (error) {
      try {
        const profileInfo = await this.getUserProfile();
        if (profileInfo) {
          const profile = `https://ui-avatars.com/api/?name=${profileInfo.givenName}+${profileInfo.surname}&background=random`;
          return profile;
        } else {
          throw new Error('Failed to retrieve profile information.');
        }
      } catch (error) {
        // Handle error appropriately
        throw error;
      }
    }
  }
  
  
}

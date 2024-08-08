import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { SocialAuthServiceConfig, SocialLoginModule, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { MsalModule, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MsalInterceptor } from '@azure/msal-angular';
import { provideHttpClient } from '@angular/common/http';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '8ffa51ed-7c44-4aec-99b9-767009a2565a',
      authority: 'https://login.microsoftonline.com/6ebbe8c1-b195-4a1b-a6e6-7797203a8aa1',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200'
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true,
    }
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    }
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map([
      ['https://graph.microsoft.com/v1.0/me', ['user.read']]
    ])
  };
}

async function initializeMsalInstance() {
  const msalInstance = MSALInstanceFactory();
  await msalInstance.initialize();
  return msalInstance;
}

initializeMsalInstance().then((msalInstance) => {
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(
        RouterModule.forRoot(routes),
        MsalModule.forRoot(msalInstance, MSALGuardConfigFactory(), MSALInterceptorConfigFactory()),
        SocialLoginModule
      ),
      (HttpClient),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true
      },
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                '772900034161-arv763khkvh0tgcg2ev4lk5jl897vr01.apps.googleusercontent.com'
              )
            }
          ]
        } as SocialAuthServiceConfig,
      }
    ]
  });
});

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Amplify from 'aws-amplify';

import awsconfig from './aws-export';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

Amplify.configure({
  Auth: {
    region: awsconfig.cognito.REGION,
    userPoolId: awsconfig.cognito.USER_POOL_ID,
    identityPoolId: awsconfig.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: awsconfig.cognito.APP_CLIENT_ID
},
  Storage: {
  region: awsconfig.s3.REGION,
  bucket: awsconfig.s3.BUCKET,
  identityPoolId: awsconfig.cognito.IDENTITY_POOL_ID
}

});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

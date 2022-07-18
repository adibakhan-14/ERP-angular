import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

declare var TextDecoder;

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }

  downloadFile(file){
    const contentType = file.type;
    const bucket = new S3(
    {
    accessKeyId: 'AKIA43VSSYE6AJKXZE47',
    secretAccessKey: '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',
    region: 'ap-southeast-1',
    }
    );
    const params = {
    Bucket: 'truckload-admin-backend-staging-attachmentsbucket-lcsfm639gu89',
    Key: file,
    ContentType: contentType
    };
    bucket.getObject(params, function (err, data) {
    if (err) {
    console.log('EROOR: ',JSON.stringify( err));
    return false;
    }
    else{
      console.log('File found.', data.Body);
      console.log(data.Body);

      return [true, data.Body];

      // const string = new TextDecoder('utf-8').decode(data.Body);

      //   console.log(string);

    }

    });

    }

}

import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmationDialog } from '../models/confirmation-dialog.model';
import { AsyncService } from '../services/async.service';

@Component({
  selector: 'confirmation-dialog',
  styles:[
    `
    .mat-raised-button.mat-primary{
      background-color:#519872;
      color: #fff;
  }


    `
  ],
  template: `
  <div fxLayout="column" fxLayoutAlign="space-around center" >

  <div class="icon-box" >
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
  width="100" height="100"
  viewBox="0 0 172 172"
  style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#f1c40f"><path d="M86,6.88c-43.65603,0 -79.12,35.46397 -79.12,79.12c0,43.65603 35.46397,79.12 79.12,79.12c43.65603,0 79.12,-35.46397 79.12,-79.12c0,-43.65603 -35.46397,-79.12 -79.12,-79.12zM86,13.76c39.93779,0 72.24,32.30221 72.24,72.24c0,39.93779 -32.30221,72.24 -72.24,72.24c-39.93779,0 -72.24,-32.30221 -72.24,-72.24c0,-39.93779 32.30221,-72.24 72.24,-72.24zM81.87469,49.19469c-1.032,0 -1.37734,0.68263 -1.37734,1.37063v46.44c0,1.032 0.68934,1.37734 1.37734,1.37734h7.90797c1.032,0 1.37735,-0.68934 1.37735,-1.37734v-46.44c0,-1.032 -0.68935,-1.37063 -1.37735,-1.37063zM81.87469,111.11469c-1.032,0 -1.37734,0.68263 -1.37734,1.37063v8.94937c0,1.032 0.68934,1.37063 1.37734,1.37063h8.25063c1.032,0 1.37734,-0.68263 1.37734,-1.37063v-8.94937c0,-1.032 -0.68934,-1.37063 -1.37734,-1.37063z"></path></g></g></svg>
</div>

    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div *ngIf="isTemplateRef(data?.content); else stringContent">
      <mat-dialog-content *ngTemplateOutlet="data.content"></mat-dialog-content>
    </div>
    <ng-template #stringContent>
      <mat-dialog-content [innerHTML]="data.content"></mat-dialog-content>
    </ng-template>
    <mat-dialog-actions *ngIf="!data?.disableActionButtons" fxLayoutAlign="end">
      <button
        mat-raised-button color="warn"
        [mat-dialog-close]="true"
        [disabled]="asyncService.isLoading | async"
      >
        {{ data.confirmButtonText || 'YES' }}
      </button>
      <button mat-raised-button color="primary" [mat-dialog-close]="false" >
        {{ data.cancelButtonText || 'NO' }}
      </button>
    </mat-dialog-actions>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public asyncService: AsyncService,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog
  ) {}

  isTemplateRef(content: any): boolean {
    if (typeof content !== 'string') {
      return true;
    }
    return false;
  }

}

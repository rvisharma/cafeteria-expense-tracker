import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule, MdNativeDateModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    MdNativeDateModule
  ]
})
export class CustomMaterialModule { }

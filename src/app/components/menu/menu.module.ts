/*import { CdkTableModule } from '@angular/cdk/table';*/

import { CommonModule } from '@angular/common';
import { MenuContainerComponent } from './container/container.component';
import { MenuEntryComponent } from './entry/entry.component';
import { MenuHeaderComponent } from './header/header.component';
import { MenuInputComponent } from './input/input.component';
import { MenuLeftComponent } from './left/left.component';
import { MenuRightComponent } from './right/right.component';
import { MenuTitleComponent } from './title/title.component';
import { NgModule } from '@angular/core';

const MEUN_MODULES = [
    MenuRightComponent,
    MenuTitleComponent,
    MenuLeftComponent,
    MenuHeaderComponent,
    MenuContainerComponent,
    MenuEntryComponent,
    MenuInputComponent
];

@NgModule({
    declarations: MEUN_MODULES,
    imports: [CommonModule],
    exports: MEUN_MODULES
})
export class MenuModule {}

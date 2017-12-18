import { Component, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class ThemeSelector {
    constructor(private dialog: MatDialog) {}

    public selectTheme(): Observable<string> {
        let dialogRef = this.dialog.open(ThemeSelectorDialog, {});
        return dialogRef.afterClosed();
    }
}

@Component({
    selector: 'theme-selector',
    templateUrl: 'theme-selector.component.html'
})
export class ThemeSelectorDialog {
    constructor(public dialogRef: MatDialogRef<ThemeSelectorDialog>) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}

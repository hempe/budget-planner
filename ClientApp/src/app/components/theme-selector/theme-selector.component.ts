import { Component, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

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

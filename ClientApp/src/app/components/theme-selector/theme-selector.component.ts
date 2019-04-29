import { Component, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

@Injectable()
export class ThemeSelector {
    constructor(private dialog: MatDialog) {}

    public selectTheme(): Observable<string> {
        const dialogRef = this.dialog.open(ThemeSelectorDialogComponent, {});
        return dialogRef.afterClosed();
    }
}

@Component({
    selector: 'theme-selector',
    templateUrl: 'theme-selector.component.html'
})
export class ThemeSelectorDialogComponent {
    constructor(public dialogRef: MatDialogRef<ThemeSelectorDialogComponent>) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}

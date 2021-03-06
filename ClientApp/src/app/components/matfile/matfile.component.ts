import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FileLikeObject, FileUploader, FileUploaderOptions } from 'ng2-file-upload';

@Component({
    selector: 'mat-file',
    templateUrl: './matfile.component.html',
    styleUrls: ['./matfile.component.css']
})
export class MatFileComponent implements OnInit {
    constructor(public dialog: MatDialog) {}

    @Input() public url: string;

    @Input() public text: string;

    @Output() onCompleteAll: EventEmitter<{}> = new EventEmitter();

    @Input() public color: string;

    public uploader: FileUploader;
    public hasBaseDropZoneOver = false;
    public hasAnotherDropZoneOver = false;

    ngOnInit(): void {
        const options: FileUploaderOptions = {
            url: this.url,
            isHTML5: true,
            autoUpload: true,
            method: 'PUT',
            disableMultipart: true,
            removeAfterUpload: true,
            filters: [
                {
                    name: 'types',
                    fn: (x: FileLikeObject) => {
                        return (
                            x.type === 'image/gif' ||
                            x.type === 'image/png' ||
                            x.type === 'image/jpeg' ||
                            x.type === 'image/jpg'
                        );
                    }
                }
            ]
        };

        this.uploader = new ExtendedFileUploader(options, () =>
            this.onCompleteAll.emit()
        );
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public onNoClick(): void {}
}

export class ExtendedFileUploader extends FileUploader {
    constructor(options: any, private _onCompleteAll: () => void) {
        super(options);
    }

    public onCompleteAll() {
        super.onCompleteAll();
        this._onCompleteAll();
    }
}

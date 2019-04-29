import { Component, Input, OnInit } from '@angular/core';
import { CustomErrorStateMatcher } from '../../services/custom-error-state-matcher';

@Component({
    selector: '[error]',
    templateUrl: 'error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
    @Input() public name: string;
    ngOnInit(): void {}

    public errors() {
        if (this.name === 'eMail') {
            console.info('lets check the email');
        }
        if (!CustomErrorStateMatcher.errors) { return []; }
        if (!this.name) { return []; }
        return CustomErrorStateMatcher.getErrors(this.name);
    }
}

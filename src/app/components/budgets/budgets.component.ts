import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IBudget, IClient, IGroup } from '../../common/file';
import { Observable, Subject } from 'rxjs';
import { array, clone, toNumber } from '../../common/helper';

import { FileService } from '../../services/file-service';
import { Http } from '@angular/http';
import { MatPaginator } from '@angular/material';
import { MenuEntry } from '../view-wrapper/view-wrapper.component';

@Component({
    selector: 'budgets',
    templateUrl: 'budgets.component.html',
    styleUrls: ['budgets.component.css']
})
export class BudgetsComponent implements OnInit {
    private budget: IGroup<IBudget>;
    private id: string;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fileService: FileService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.fileService.current.budgets = array(
            this.fileService.current.budgets
        );
        this.budget = this.fileService.current.budgets[toNumber(this.id)];
    }

    public goto(path: string) {
        this.router.navigate(['edit', 'budgets', this.id, path]);
    }
}

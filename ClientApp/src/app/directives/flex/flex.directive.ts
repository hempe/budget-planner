import { Directive, HostBinding, Input, OnInit } from '@angular/core';
@Directive({
    selector: '[flexContainer]'
})
export class FlexContainerDirective {
    @HostBinding('style.display') display = 'flex';
    @HostBinding('style.flex-flow') flexFlow = 'row wrap';
}

@Directive({
    selector: '[flex]'
})
export class FlexDirective implements OnInit {
    @HostBinding('style.flex-basis') flexBasis = '100%';

    @HostBinding('style.flex-grow') flexGrow = 10;

    @Input() flex = 0;
    ngOnInit() {
        if (this.flex) {
            this.flexBasis = (this.flex / 10) * 100 + '%';
        } else {
            this.flex = 1;
            this.flexBasis = 'auto';
        }
    }
}

@Directive({
    selector: '[flexBreak]'
})
export class FlexBreakDirective {
    @Input()
    @HostBinding('style.flex-basis')
    flexBasis = '100%';
}

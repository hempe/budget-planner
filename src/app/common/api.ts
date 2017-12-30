export interface Complete {
    budgets: BudgetData[];
    assets: Group<NamedValue>;
    revenue: Group<DatedValue>;
    client: Profile;
}

export interface DevelopmentElement {
    type: string;
    subType: string;
    id?: string;
    group: string;
    name: string;
    start?: number;
    end?: number;
    value?: number;
}
export interface BudgetData extends Group<FrequencyValue> {
    startYear?: number;
    endYear?: number;
}
export interface BudgetOverview extends OverviewValue {
    startYear?: number;
    endYear?: number;
}
export interface OverviewValue extends NamedValue {
    id: string;
    positive: OverviewContainer[];
    negative: OverviewContainer[];
}

export interface OverviewContainer extends Unit<NamedValue> {
    value: number;
}

export interface Unit<T> {
    name: string;
    elements: T[];
}

export interface Group<T> {
    name: string;
    positive: Unit<T>[];
    negative: Unit<T>[];
}

export const UnitKey = {
    positive: 'positive',
    negative: 'negative',
    total: 'total'
};

export interface FrequencyValue extends NamedValue {
    frequency?: number;
}

export interface NamedValue {
    name: string;
    value: number;
    checked?: boolean;
}

export interface DatedValue extends NamedValue {
    year?: number;
}

export interface Profile {
    city?: String;
    comment?: string;
    company?: string;
    eMail?: string;
    mobilNumber?: string;
    name?: string;
    prename?: string;
    street?: string;
    telNumber?: string;
    zipCode?: string;
    color?: string;
}

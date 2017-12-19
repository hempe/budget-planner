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

export interface IFile {
    budgets: Group<FrequencyValue>[];
    assets: Group<NamedValue>;
    revenue: Group<DatedValue>;
    development: IDevelopmentGroup;
    client: Profile;
    name: string;
    language?: string;
}

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

export interface IDevelopment {
    budget: number;
    year: number;
}

export interface IDevelopmentGroup {
    elements: IDevelopment[];
    name: string;
    from: number;
    to: number;
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

export namespace Files {
    export function CreateNew(): IFile {
        return <IFile>{};
    }

    export function OpenFile(doc: { name: string; data: string }): IFile {
        var file = JSON.parse(doc.data);
        var name = doc.name;
        var extensionPosition = name.lastIndexOf('.');
        if (name == '') return file;

        if (extensionPosition > 0)
            file.name = name.substr(0, extensionPosition);
        else file.name = name;
        return file;
    }
}

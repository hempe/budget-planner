export interface OverviewValue extends NamedValue {
    id: string;
    positiv: OverviewContainer[];
    negativ: OverviewContainer[];
}

export interface OverviewContainer extends Unit<NamedValue> {
    value: number;
}

export interface Unit<T> {
    name: string;
    elements: T[];
}

export interface IGroup<T> {
    name: string;
    positiv: Unit<T>[];
    negativ: Unit<T>[];
}

export interface IFile {
    budgets: IGroup<FrequencyValue>[];
    assets: IGroup<NamedValue>;
    revenue: IGroup<DatedValue>;
    development: IDevelopmentGroup;
    client: IClient;
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

export interface IClient {
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

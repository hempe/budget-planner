export interface IUnit<T> {
    name: string;
    elements: T[];
}

export interface IGroup<T> {
    name: string;
    positiv: IUnit<T>[];
    negativ: IUnit<T>[];
}

export interface IFile {
    budgets: IGroup<IBudget>[];
    assets: IGroup<IAsset>;
    revenue: IGroup<IRevenue>;
    development: IDevelopmentGroup;
    client: IClient;
    name: string;
    language?: string;
}

export interface IBudget extends IAsset {
    frequency?: number;
}

export interface IAsset {
    name: string;
    value: number;
    checked?: boolean;
}

export interface IRevenue extends IAsset {
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

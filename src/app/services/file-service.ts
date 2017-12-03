import { Files, IFile } from '../common/file';
export class FileService {
    public current: IFile;

    public loadFile(doc: { name: string; data: string }) {
        this.current = Files.OpenFile(doc);
    }

    public save() {
        if (this.current) {
            localStorage.setItem('current_file', JSON.stringify(this.current));
        }
    }

    public clearMemory() {
        this.current = undefined;
        localStorage.removeItem('current_file');
    }

    public loadMemory() {
        let value = localStorage.getItem('current_file');
        if (value && value != 'undefined') {
            try {
                this.current = JSON.parse(value);
            } catch (err) {}
        }
    }
}

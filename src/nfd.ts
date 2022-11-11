import { get } from 'node:https';
import { IncomingMessage } from 'node:http';
import { createWriteStream, existsSync, 
    mkdirSync, unlinkSync, WriteStream } from 'node:fs';

interface HelpDescription {
    options: string;
    description: string;
};


export class NodeFileDownloader {
    readonly url: string;
    readonly type: string;
    filename: string;
    constructor(file_link: string, type_file: string) {
        this.url = file_link;
        this.type = type_file;
        this.filename = `${Date.now()}.${this.type}`;
        !existsSync('nfd') && mkdirSync('nfd');
    }

    private async getHttpStream(url: string): Promise<IncomingMessage> {
        return new Promise((resolve) => 
        get(url, (response) => resolve(response)));
    }

    async startDownloading(): Promise<void> {
        try  {
            const readStream: IncomingMessage = await this.getHttpStream(this.url),
                writeStream: WriteStream = createWriteStream(`./nfd/${this.filename}`);
            writeStream.on('ready', () => {
                console.log('\x1b[36m%s\x1b[0m', ` Node File Downloader`);
                console.log('\x1b[32m%s\x1b[0m', ` Downloading ...`);
                console.time(` Duration`);
            });
            writeStream.on('finish', () => {
                console.log('\x1b[36m%s\x1b[0m', ` Successfully downloaded.`)
                console.timeEnd(` Duration`);
            });
            readStream.pipe(writeStream);
        }
        catch(error) {
            existsSync(`./nfd/${this.filename}`) && unlinkSync(`./nfd/${this.filename}`);
            console.error(`Erreur:\n${error}`);
            
        } 
    }
}

export class CliOptions {
    readonly nameCli: string;
    readonly descriptionCli: string;
    readonly helpCli: HelpDescription[];
    readonly exampleCli: string;

    constructor() {
        this.nameCli = 'Node File Downloader';
        this.descriptionCli = `>>> nfd is a CLI build with Typescript and Nodejs for downloading easier files...`;
        this.helpCli = [
            { options: '-h', description: 'help and description of nfd cli' },
            { options: '-u', description: 'for the URL or link of file' },
            { options: '-t', description: 'for the type of file' }
        ];
        this.exampleCli = `nfd -u <URL> -t <type>`;
    }

    helpOptions(): void {
        console.log('\x1b[36m%s\x1b[0m', `\t${this.nameCli}`);
        console.log(`${this.descriptionCli}\n`);
        console.log('\x1b[1m%s\x1b[0m', ` Options:`);
        this.helpCli.forEach(value => {
            console.log('\x1b[36m%s\x1b[0m', `   ${value.options}`, '\t', value.description);
        });
        console.log('\x1b[1m%s\x1b[0m', ' Example: ', `${this.exampleCli}\n`);
    }

    errorHandler(): void {
        console.log('\x1b[31m%s\x1b[0m', `>>> Error for the option command !`);
        console.log('\x1b[1m%s\x1b[0m', ' Options:');
        this.helpCli.forEach(value => {
            console.log('\x1b[36m%s\x1b[0m', `   ${value.options}`, '\t', value.description);
        });
        console.log('\x1b[1m%s\x1b[0m', ' Example: ', `${this.exampleCli}\n`);
    }
}

#! /usr/bin/env node
import { CliOptions, NodeFileDownloader } from "./nfd";

const options: Array<string> = process.argv.slice(2),
    option_shape_1: boolean = /^(\-u [a-z0-9_:/%@ç+èé=?-]+ \-t [a-z0-9]+)$/.test(options.join(' ')),
    option_shape_2: boolean = /^(\-t [a-z0-9]+ \-u [a-zA-Z0-9_:./%@ç+éè=?-]+)$/.test(options.join(' ')),
    help = new CliOptions();
    
if(option_shape_1 || option_shape_2) {
    const url:string = option_shape_1 ? options[1] : options[3];
    const type: string = option_shape_1 ? options[3]: options[1];
    const nfd = new NodeFileDownloader(url, type);
    nfd.startDownloading();
}
else if(options.length === 0) {
    help.helpOptions();
}
else {
    help.errorHandler();
}

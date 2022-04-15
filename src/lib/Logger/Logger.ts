import { color } from 'console-log-colors';

const { blueBright, redBright, yellowBright } = color;

export class Logger {
    debug: boolean;

    constructor(debug: boolean) {
        this.debug = debug;
    }

    log(str: any) {
        if (!this.debug) return;
        console.log(blueBright('threadshop:'), str);
    }

    error(str: any) {
        console.log(redBright('threadshop error:'), str);
    }

    warn(str: any) {
        console.log(yellowBright('threadshop warn:'), str);
    }

    errorString(str: string) {
        return `${redBright('threadshop error:')} ${str}`;
    }
}

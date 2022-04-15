import { Worker } from 'worker_threads';
import Logger from '../Logger';

export interface ThreadshopOptions {
    debug?: boolean;
    maxThreads?: number;
}

export interface ThreadshopConstructor {
    dir: string;
    worker: Worker;
    logger: Logger;
    maxThreads?: number;
}

export interface EmployeeList {
    [key: string]: Function;
}

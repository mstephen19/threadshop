import { EmployeeList, ThreadshopOptions } from '../Threadshop/types';
import Threadshop from '../Threadshop';
import { getDirname } from './utils/getDirname';
import init from './initialize';
import Logger from '../Logger';
import path from 'path';

export const employees = (employees: EmployeeList) => {
    return employees;
};

export const threadshop = ({ debug = false, maxThreads }: ThreadshopOptions = {}) => {
    const { dirname: dir, path: filePath } = getDirname(2);

    if (path.basename(filePath) !== 'threadshop.js') throw new Error('config file must be named threadshop.js!');

    const worker = init(dir);
    const logger = new Logger(debug);

    return new Threadshop({ dir, worker, logger, maxThreads });
};

import { Worker } from 'worker_threads';
import path from 'path';

const init = (dir: string) => {
    const worker = new Worker(path.join(__dirname, '/initialize.js'), {
        workerData: {
            dir,
        },
    });

    return worker;
};

export default init;

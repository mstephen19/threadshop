import EventEmitter from 'events';
import { Worker, SHARE_ENV, ResourceLimits } from 'worker_threads';

export class Employee extends EventEmitter {
    name: string;
    private path: string;
    args: any[];

    constructor({ name, path, args }: { name: string; path: string; args: any[] }) {
        super();

        this.name = name;
        this.path = path;
        this.args = args;
    }

    async run(resourceLimits: ResourceLimits) {
        const runWorker = () => {
            return new Promise((resolve, reject) => {
                const worker = new Worker(this.path, {
                    workerData: {
                        args: this.args,
                        employeeName: this.name,
                    },
                    env: SHARE_ENV,
                    resourceLimits,
                });

                worker.on('error', async (err) => {
                    this.emit('error', err);
                    reject(err);
                });

                worker.on('message', (data) => {
                    this.emit('done', data);
                    resolve(true);
                });
            });
        };

        await runWorker();
    }
}

// in the go function, create a new employee
// if the max cpus has been reached, queue up the employee into the queue
// on employee emit event 'done', return its value

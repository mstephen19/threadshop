import { ResourceLimits } from 'worker_threads';
import Employee from '../Employee';
import Logger from '../Logger';

export class Pool {
    running: number;
    queued: { employee: Employee; resourceLimits: ResourceLimits }[];
    private maxCpus: number;
    logger: Logger;

    constructor(maxCpus: number, logger: Logger) {
        this.maxCpus = maxCpus;
        this.running = 0;
        this.queued = [];
        this.logger = logger;
    }

    runNextEmployee() {
        const next = this.queued.shift();

        return this.runEmployee(next.employee, next.resourceLimits);
    }

    async runEmployee(employee: Employee, resourceLimits: ResourceLimits) {
        return new Promise((resolve, reject) => {
            if (this.running >= this.maxCpus) {
                return this.queued.push({ employee, resourceLimits });
            }

            try {
                this.logger.log(`running operation ${employee.name}`);
                employee.run(resourceLimits);
                this.running += 1;
            } catch (error) {
                const e = error as Error;

                this.running -= 1;
                reject(e.message);
            }

            employee.on('done', (data) => {
                this.running -= 1;
                if (this.queued.length) this.runNextEmployee();
                resolve(data);
            });

            employee.on('error', (err) => {
                this.running -= 1;
                reject(new Error(this.logger.errorString(`${err.message}`)));
            });
        });
    }
}

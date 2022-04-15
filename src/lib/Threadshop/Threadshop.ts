import EventEmitter from 'events';
import { ResourceLimits, Worker } from 'worker_threads';
import path from 'path';

import { Events } from './constants';
import Logger from '../Logger';
import { getCpus } from './utils/getCpus';
import Employee from '../Employee';
import Pool from '../Pool';
import { ThreadshopConstructor } from './types';

export class Threadshop extends EventEmitter {
    dir: string;
    private ready: boolean;
    private logger: Logger;
    private pool: Pool;

    constructor({ dir, worker, logger, maxThreads }: ThreadshopConstructor) {
        super();
        this.dir = dir;
        this.ready = false;
        this.logger = logger;
        this.pool = new Pool(!maxThreads || maxThreads > getCpus() ? getCpus() : maxThreads, this.logger);

        worker.on('message', () => {
            logger.log('ready');
            this.ready = true;
            this.emit(Events.ready);
        });

        worker.on('error', (err) => {
            throw new Error(logger.errorString(`failed to compile employees: ${err.message}`));
        });
    }

    async go(name: string, args: any[] = [], resourceLimits?: ResourceLimits) {
        if (!this.ready) throw new Error('the "ready" event hasn\'t yet been fired!');

        const employee = new Employee({ name, args, path: path.join(this.dir, '/employees/compiled.js') });

        let data: any;

        try {
            data = await this.pool.runEmployee(employee, resourceLimits);

            return data;
        } catch (err) {
            const e = err as Error;
            throw new Error(this.logger.errorString(`employee run for ${name} failed: ${e.message}`));
        }
    }

    get queued() {
        return this.pool.queued;
    }

    get running() {
        return this.pool.running;
    }
}

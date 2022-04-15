import * as fs from 'fs/promises';
import path from 'path';
import { Comments } from '../../Threadshop/constants';
import { parentPort, workerData } from 'worker_threads';

const initialize = async () => {
    const { dir } = workerData;

    const test = await fs.readFile(path.join(dir, '/employees/employees.js'));
    const code = Buffer.from(test).toString('utf-8');

    if (!code.includes(Comments.END_IMPORTS)) throw new Error('must include a "/* END IMPORTS */" comment in employees.js')

    const imports = code.split(Comments.END_IMPORTS)[0].trim();

    const employees = await import(path.join(dir, '/employees/employees.js'));

    const file = generateFile({ imports, employees });

    await fs.writeFile(path.join(dir, '/employees/compiled.js'), file);

    parentPort.postMessage(true);
};

initialize();

const generateFile = ({ imports, employees }) => {
    return `${imports}
const { workerData, parentPort, isMainThread, threadId } = require('worker_threads');

const run = async () => {
    const { employeeName, args: [ ...arr ] } = workerData;

    switch (employeeName) {
        default:
            throw new Error('this employee name doesn\\'t exist!');
        ${Object.entries(employees.default)
            .map(([name, func]) => {
                return `case '${name}': {
        const func = ${func}
        const data = await func(...arr)
        return data ?? true;
        }`;
            })
            .join('\n')}
    };
};

const runScript = async () => {
    let data;

    try {
        data = await run()
    } catch (e) {
        throw new Error(\`\${e.message}\`)
    };

    parentPort.postMessage(data);

    process.exit(0);
};

runScript();`;
};

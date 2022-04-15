import { cpus } from 'os';

export const getCpus = () => {
    return cpus().length;
};

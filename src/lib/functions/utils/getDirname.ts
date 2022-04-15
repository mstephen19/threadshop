import path from 'path';
import callsite from 'callsite';

export const getDirname = (site: number) => {
    return {
        dirname: path.dirname(callsite()[site].getFileName()),
        path: callsite()[site].getFileName(),
    };
};

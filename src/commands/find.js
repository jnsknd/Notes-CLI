import { findNotes } from '../notes.js';
import { listNotes } from '../utils/listNotes.js';

export const findCommand = {
    command: 'find <filter>',
    describe: 'find notes matching a search term',
    builder: (yargs) => {
        return yargs.positional('filter', {
            describe: 'text to search for in notes',
            type: 'string',
        });
    },
    handler: async (argv) => {
        const matches = await findNotes(argv.filter);
        listNotes(matches);
    },
};

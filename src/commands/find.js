import { findNotes } from '../notes.js';
import { listNotes } from '../utils/listNotes.js';

export const findCommand = {
    command: 'find <filter>',
    describe: 'find notes matching a search term',
    builder: (yargs) => {
        return yargs.positional('filter', {
            describe: 'search term to filter notes by (searches note content)',
            type: 'string',
        });
    },
    handler: async (argv) => {
        const matches = await findNotes(argv.filter);
        listNotes(matches);
    },
};

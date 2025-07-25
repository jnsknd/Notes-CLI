import { getAllNotes } from '../notes.js';
import { start } from '../web/server.js';

export const webCommand = {
    command: 'web [port]',
    describe: 'start web server to view notes',
    builder: (yargs) => {
        return yargs.positional('port', {
            describe: 'port number to bind server on',
            default: 5000,
            type: 'number',
        });
    },
    handler: async (argv) => {
        const notes = await getAllNotes();
        start(notes, argv.port);
    },
};

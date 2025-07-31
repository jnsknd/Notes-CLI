import { removeAllNotes } from '../notes.js';

export const cleanCommand = {
    command: 'clean',
    describe: 'delete all notes',
    builder: () => {},
    handler: async (argv) => {
        await removeAllNotes();
        console.log('All notes removed');
    },
};

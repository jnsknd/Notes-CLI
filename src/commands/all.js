import { getAllNotes } from '../notes.js';
import { listNotes } from '../utils/listNotes.js';

export const allCommand = {
    command: 'all',
    describe: 'list all notes',
    builder: () => {},
    handler: async (argv) => {
        const notes = await getAllNotes();
        listNotes(notes);
    },
};

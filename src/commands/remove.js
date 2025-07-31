import { removeNote } from '../notes.js';

export const removeCommand = {
    command: 'remove <id>',
    describe: 'delete a note by id',
    builder: (yargs) => {
        return yargs.positional('id', {
            type: 'number',
            description: 'id of the note to delete',
        });
    },
    handler: async (argv) => {
        const id = await removeNote(argv.id);

        if (id) {
            console.log('Note removed: ', id);
        } else {
            console.log('Note not found');
        }
    },
};

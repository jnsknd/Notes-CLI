import { newNote } from '../notes.js';

export const newCommand = {
    command: 'new <note>',
    describe: 'create a new note',
    builder: (yargs) => {
        return yargs
            .positional('note', {
                describe: 'content of the note to create',
                type: 'string',
            })
            .option('tags', {
                alias: 't',
                type: 'string',
                description: 'comma-separated tags to add to the note',
            });
    },
    handler: async (argv) => {
        const tags = argv.tags ? argv.tags.split(',') : [];
        const note = await newNote(argv.note, tags);
        console.log('Note added!', note.id);
    },
};

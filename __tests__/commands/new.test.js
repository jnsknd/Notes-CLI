import { jest } from '@jest/globals';

const mockNewNote = jest.fn();

jest.unstable_mockModule('../../src/notes.js', () => ({
    newNote: mockNewNote,
}));

const { newCommand } = await import('../../src/commands/new.js');

describe('new command', () => {
    let consoleSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe('command configuration', () => {
        it('should configure note positional argument and tags option', () => {
            const mockYargs = {
                positional: jest.fn().mockReturnThis(),
                option: jest.fn().mockReturnThis(),
            };

            newCommand.builder(mockYargs);

            expect(mockYargs.positional).toHaveBeenCalledWith('note', {
                describe: 'content of the note to create',
                type: 'string',
            });
            expect(mockYargs.option).toHaveBeenCalledWith('tags', {
                alias: 't',
                type: 'string',
                description: 'comma-separated tags to add to the note',
            });
        });
    });

    describe('handler function', () => {
        it('should create note without tags and log success', async () => {
            const mockNote = { id: 123, content: 'test note', tags: [] };

            mockNewNote.mockResolvedValue(mockNote);
            await newCommand.handler({ note: 'test note' });

            expect(mockNewNote).toHaveBeenCalledTimes(1);
            expect(mockNewNote).toHaveBeenCalledWith('test note', []);
            expect(consoleSpy).toHaveBeenCalledWith('Note added!', 123);
        });

        it('should create note with tags and log success', async () => {
            const mockNote = {
                id: 456,
                content: 'tagged note',
                tags: ['work', 'important'],
            };

            mockNewNote.mockResolvedValue(mockNote);
            await newCommand.handler({
                note: 'tagged note',
                tags: 'work,important',
            });

            expect(mockNewNote).toHaveBeenCalledWith('tagged note', [
                'work',
                'important',
            ]);
            expect(consoleSpy).toHaveBeenCalledWith('Note added!', 456);
        });

        it('should handle empty tags string', async () => {
            const mockNote = { id: 789, content: 'test note', tags: [] };

            mockNewNote.mockResolvedValue(mockNote);
            await newCommand.handler({ note: 'test note', tags: '' });

            expect(mockNewNote).toHaveBeenCalledWith('test note', []);
        });

        it('should handle newNote rejection', async () => {
            const error = new Error('Failed to create note');

            mockNewNote.mockRejectedValue(error);

            await expect(
                newCommand.handler({ note: 'test note' })
            ).rejects.toThrow('Failed to create note');

            expect(mockNewNote).toHaveBeenCalledWith('test note', []);
            expect(consoleSpy).not.toHaveBeenCalled();
        });
    });
});

import { jest } from '@jest/globals';

const mockRemoveNote = jest.fn();

jest.unstable_mockModule('../../src/notes.js', () => ({
    removeNote: mockRemoveNote,
}));

const { removeCommand } = await import('../../src/commands/remove.js');

describe('remove command', () => {
    let consoleSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe('command configuration', () => {
        it('should configure id positional argument', () => {
            const mockYargs = {
                positional: jest.fn().mockReturnThis(),
            };

            removeCommand.builder(mockYargs);

            expect(mockYargs.positional).toHaveBeenCalledWith('id', {
                type: 'number',
                description: 'id of the note to delete',
            });
        });
    });

    describe('handler function', () => {
        it('should remove note and log success when note exists', async () => {
            const id = 123;

            mockRemoveNote.mockResolvedValue(id);
            await removeCommand.handler({ id });

            expect(mockRemoveNote).toHaveBeenCalledTimes(1);
            expect(mockRemoveNote).toHaveBeenCalledWith(id);
            expect(consoleSpy).toHaveBeenCalledWith('Note removed: ', id);
        });

        it('should log not found when note does not exist', async () => {
            mockRemoveNote.mockResolvedValue(null);
            await removeCommand.handler({ id: 999 });

            expect(mockRemoveNote).toHaveBeenCalledWith(999);
            expect(consoleSpy).toHaveBeenCalledWith('Note not found');
        });

        it('should handle removeNote rejection', async () => {
            const error = new Error('Database error');

            mockRemoveNote.mockRejectedValue(error);

            await expect(removeCommand.handler({ id: 123 })).rejects.toThrow(
                'Database error'
            );

            expect(mockRemoveNote).toHaveBeenCalledWith(123);
            expect(consoleSpy).not.toHaveBeenCalled();
        });
    });
});

import { jest } from '@jest/globals';

const mockRemoveAllNotes = jest.fn();

jest.unstable_mockModule('../../src/notes.js', () => ({
    removeAllNotes: mockRemoveAllNotes,
}));

const { cleanCommand } = await import('../../src/commands/clean.js');

describe('clean command', () => {
    let consoleSpy;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe('handler function', () => {
        it('should call removeAllNotes and log success message', async () => {
            mockRemoveAllNotes.mockResolvedValue();
            await cleanCommand.handler({});

            expect(mockRemoveAllNotes).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith('All notes removed');
        });

        it('should handle removeAllNotes rejection', async () => {
            const error = new Error('Database connection failed');

            mockRemoveAllNotes.mockRejectedValue(error);

            await expect(cleanCommand.handler({})).rejects.toThrow(
                'Database connection failed'
            );

            expect(mockRemoveAllNotes).toHaveBeenCalledTimes(1);
            expect(consoleSpy).not.toHaveBeenCalled();
        });
    });
});

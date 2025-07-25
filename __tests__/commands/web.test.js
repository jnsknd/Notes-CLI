import { jest } from '@jest/globals';

const mockGetAllNotes = jest.fn();
const mockStart = jest.fn();

jest.unstable_mockModule('../../src/notes.js', () => ({
    getAllNotes: mockGetAllNotes,
}));

jest.unstable_mockModule('../../src/web/server.js', () => ({
    start: mockStart,
}));

const { webCommand } = await import('../../src/commands/web.js');

describe('web command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('command configuration', () => {
        it('should configure port positional argument with default', () => {
            const mockYargs = {
                positional: jest.fn().mockReturnThis(),
            };

            webCommand.builder(mockYargs);

            expect(mockYargs.positional).toHaveBeenCalledWith('port', {
                describe: 'port number to bind server on',
                default: 5000,
                type: 'number',
            });
        });
    });

    describe('handler function', () => {
        it('should get all notes and start server with specified port', async () => {
            const mockNotes = [
                { id: 1, title: 'Note 1', content: 'Content 1' },
                { id: 2, title: 'Note 2', content: 'Content 2' },
            ];

            mockGetAllNotes.mockResolvedValue(mockNotes);
            await webCommand.handler({ port: 3000 });

            expect(mockGetAllNotes).toHaveBeenCalledTimes(1);
            expect(mockStart).toHaveBeenCalledTimes(1);
            expect(mockStart).toHaveBeenCalledWith(mockNotes, 3000);
        });

        it('should handle empty notes array', async () => {
            mockGetAllNotes.mockResolvedValue([]);
            await webCommand.handler({ port: 5000 });

            expect(mockGetAllNotes).toHaveBeenCalledTimes(1);
            expect(mockStart).toHaveBeenCalledWith([], 5000);
        });

        it('should handle getAllNotes rejection', async () => {
            const error = new Error('Database connection failed');

            mockGetAllNotes.mockRejectedValue(error);

            await expect(webCommand.handler({ port: 8080 })).rejects.toThrow(
                'Database connection failed'
            );

            expect(mockGetAllNotes).toHaveBeenCalledTimes(1);
            expect(mockStart).not.toHaveBeenCalled();
        });
    });
});

import { jest } from '@jest/globals';

const mockFindNotes = jest.fn();
const mockListNotes = jest.fn();

jest.unstable_mockModule('../../src/notes.js', () => ({
    findNotes: mockFindNotes,
}));

jest.unstable_mockModule('../../src/utils/listNotes.js', () => ({
    listNotes: mockListNotes,
}));

const { findCommand } = await import('../../src/commands/find.js');

describe('find command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('command configuration', () => {
        it('should configure filter positional argument', () => {
            const mockYargs = {
                positional: jest.fn().mockReturnThis(),
            };

            findCommand.builder(mockYargs);

            expect(mockYargs.positional).toHaveBeenCalledWith('filter', {
                describe: 'text to search for in notes',
                type: 'string',
            });
        });
    });

    describe('handler function', () => {
        it('should call findNotes with filter and listNotes with results', async () => {
            const mockMatches = [
                { id: 1, title: 'Note 1', content: 'test content' },
                { id: 2, title: 'Note 2', content: 'another test' },
            ];
            const filter = 'test';

            mockFindNotes.mockResolvedValue(mockMatches);
            await findCommand.handler({ filter });

            expect(mockFindNotes).toHaveBeenCalledTimes(1);
            expect(mockFindNotes).toHaveBeenCalledWith(filter);
            expect(mockListNotes).toHaveBeenCalledTimes(1);
            expect(mockListNotes).toHaveBeenCalledWith(mockMatches);
        });

        it('should handle empty search results', async () => {
            const filter = 'nonexistent';

            mockFindNotes.mockResolvedValue([]);
            await findCommand.handler({ filter });

            expect(mockFindNotes).toHaveBeenCalledWith(filter);
            expect(mockListNotes).toHaveBeenCalledWith([]);
        });

        it('should handle findNotes rejection', async () => {
            const error = new Error('Search failed');
            const filter = 'test';

            mockFindNotes.mockRejectedValue(error);

            await expect(findCommand.handler({ filter })).rejects.toThrow(
                'Search failed'
            );

            expect(mockFindNotes).toHaveBeenCalledWith(filter);
            expect(mockListNotes).not.toHaveBeenCalled();
        });
    });
});

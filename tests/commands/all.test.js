import { jest } from '@jest/globals';

const mockGetAllNotes = jest.fn();
const mockListNotes = jest.fn();

jest.unstable_mockModule('../../src/notes.js', () => ({
    getAllNotes: mockGetAllNotes,
}));

jest.unstable_mockModule('../../src/utils/listNotes.js', () => ({
    listNotes: mockListNotes,
}));

const { allCommand } = await import('../../src/commands/all.js');

describe('all command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('handler function', () => {
        it('should call getAllNotes and listNotes with correct data', async () => {
            const mockNotes = [
                { id: 1, title: 'Note 1', content: 'Content 1' },
                { id: 2, title: 'Note 2', content: 'Content 2' },
            ];

            mockGetAllNotes.mockResolvedValue(mockNotes);
            await allCommand.handler({});

            expect(mockGetAllNotes).toHaveBeenCalledTimes(1);
            expect(mockListNotes).toHaveBeenCalledTimes(1);
            expect(mockListNotes).toHaveBeenCalledWith(mockNotes);
        });

        it('should handle empty notes array', async () => {
            mockGetAllNotes.mockResolvedValue([]);
            await allCommand.handler({});

            expect(mockGetAllNotes).toHaveBeenCalledTimes(1);
            expect(mockListNotes).toHaveBeenCalledWith([]);
        });

        it('should handle getAllNotes rejection', async () => {
            const error = new Error('Database connection failed');

            mockGetAllNotes.mockRejectedValue(error);

            await expect(allCommand.handler({})).rejects.toThrow(
                'Database connection failed'
            );

            expect(mockGetAllNotes).toHaveBeenCalledTimes(1);
            expect(mockListNotes).not.toHaveBeenCalled();
        });
    });
});

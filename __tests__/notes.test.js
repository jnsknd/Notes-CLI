import { expect, jest } from '@jest/globals';

jest.unstable_mockModule('../src/database/db.js', () => ({
    insertDB: jest.fn(),
    getDB: jest.fn(),
    saveDB: jest.fn(),
}));

const { getDB, insertDB, saveDB } = await import('../src/database/db.js');
const { findNotes, getAllNotes, newNote, removeAllNotes, removeNote } =
    await import('../src/notes.js');

describe('notes module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('newNote function', () => {
        it('should create and insert note', async () => {
            const mockNote = {
                id: expect.any(Number),
                content: 'test',
                tags: ['tag1'],
            };

            insertDB.mockResolvedValue(mockNote);
            const result = await newNote('test', ['tag1']);

            expect(insertDB).toHaveBeenCalledWith(mockNote);
            expect(result).toEqual(mockNote);
        });

        it('should default to empty tags', async () => {
            insertDB.mockResolvedValue({});
            await newNote('test');

            expect(insertDB).toHaveBeenCalledWith({
                id: expect.any(Number),
                content: 'test',
                tags: [],
            });
        });
    });

    describe('getAllNotes function', () => {
        it('should return notes from database', async () => {
            const mockNotes = [{ id: 1, content: 'test' }];
            getDB.mockResolvedValue({ notes: mockNotes });
            const result = await getAllNotes();

            expect(result).toBe(mockNotes);
        });
    });

    describe('findNotes function', () => {
        it('should filter by content', async () => {
            const notes = [
                { content: 'JavaScript tutorial' },
                { content: 'javascript basics' },
            ];
            getDB.mockResolvedValue({ notes });
            const result = await findNotes('javascript');

            expect(result).toHaveLength(2);
            expect(result[0].content).toBe('JavaScript tutorial');
            expect(result[1].content).toBe('javascript basics');
        });
    });

    describe('removeNote function', () => {
        it('should remove existing note', async () => {
            const notes = [{ id: 1 }, { id: 2 }, { id: 3 }];
            getDB.mockResolvedValue({ notes });
            const result = await removeNote(2);

            expect(saveDB).toHaveBeenCalledWith({
                notes: [{ id: 1 }, { id: 3 }],
            });
            expect(result).toBe(2);
        });

        it('should return undefined for non-existent id', async () => {
            getDB.mockResolvedValue({ notes: [{ id: 1 }] });
            const result = await removeNote(999);

            expect(saveDB).not.toHaveBeenCalled();
            expect(result).toBeUndefined();
        });
    });

    describe('removeAllNotes function', () => {
        it('should clear database', async () => {
            await removeAllNotes();

            expect(saveDB).toHaveBeenCalledWith({ notes: [] });
        });
    });
});

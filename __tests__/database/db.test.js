import { jest } from '@jest/globals';

const mockReadFile = jest.fn();
const mockWriteFile = jest.fn();

jest.unstable_mockModule('node:fs/promises', () => ({
    default: {
        readFile: mockReadFile,
        writeFile: mockWriteFile,
    },
    readFile: mockReadFile,
    writeFile: mockWriteFile,
}));

const { getDB, saveDB, insertDB } = await import('../../src/database/db.js');

describe('db module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getDB function', () => {
        it('should read and parse database file', async () => {
            const mockDbContent = { notes: [{ id: 1, content: 'test' }] };
            mockReadFile.mockResolvedValue(JSON.stringify(mockDbContent));
            const result = await getDB();

            expect(mockReadFile).toHaveBeenCalledTimes(1);
            expect(mockReadFile).toHaveBeenCalledWith(
                expect.stringContaining('db.json'),
                'utf-8'
            );
            expect(result).toEqual(mockDbContent);
        });

        it('should handle readFile rejection', async () => {
            const error = new Error('File not found');
            mockReadFile.mockRejectedValue(error);
            await expect(getDB()).rejects.toThrow('File not found');
        });

        it('should handle invalid JSON', async () => {
            mockReadFile.mockResolvedValue('invalid json');
            await expect(getDB()).rejects.toThrow();
        });
    });

    describe('saveDB function', () => {
        it('should stringify and write database to file', async () => {
            const mockDb = { notes: [{ id: 1, content: 'test' }] };
            mockWriteFile.mockResolvedValue();
            const result = await saveDB(mockDb);

            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(
                expect.stringContaining('db.json'),
                JSON.stringify(mockDb, null, 2)
            );
            expect(result).toBe(mockDb);
        });

        it('should handle writeFile rejection', async () => {
            const error = new Error('Write failed');
            mockWriteFile.mockRejectedValue(error);
            await expect(saveDB({})).rejects.toThrow('Write failed');
        });
    });

    describe('insertDB function', () => {
        it('should add note to database and save', async () => {
            const mockDb = { notes: [{ id: 1, content: 'existing' }] };
            const newNote = { id: 2, content: 'new note' };

            mockReadFile.mockResolvedValue(JSON.stringify(mockDb));
            mockWriteFile.mockResolvedValue();

            const result = await insertDB(newNote);

            expect(mockReadFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledTimes(1);
            expect(mockWriteFile).toHaveBeenCalledWith(
                expect.stringContaining('db.json'),
                JSON.stringify(
                    {
                        notes: [
                            { id: 1, content: 'existing' },
                            { id: 2, content: 'new note' },
                        ],
                    },
                    null,
                    2
                )
            );
            expect(result).toBe(newNote);
        });

        it('should handle getDB rejection during insert', async () => {
            const error = new Error('Read failed');

            mockReadFile.mockRejectedValue(error);
            await expect(insertDB({ id: 1 })).rejects.toThrow('Read failed');

            expect(mockWriteFile).not.toHaveBeenCalled();
        });

        it('should handle saveDB rejection during insert', async () => {
            const mockDb = { notes: [] };

            mockReadFile.mockResolvedValue(JSON.stringify(mockDb));
            mockWriteFile.mockRejectedValue(new Error('Write failed'));

            await expect(insertDB({ id: 1 })).rejects.toThrow('Write failed');
        });
    });
});

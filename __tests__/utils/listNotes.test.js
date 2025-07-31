import { jest } from '@jest/globals';

import { listNotes } from '../../src/utils/listNotes.js';

describe('listNotes function', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should display notes with correct formatting', () => {
        const notes = [
            { id: 1, content: 'First note', tags: ['work', 'important'] },
            { id: 2, content: 'Second note', tags: ['personal'] },
        ];

        listNotes(notes);

        expect(consoleSpy).toHaveBeenCalledTimes(8);
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'id: ', 1);
        expect(consoleSpy).toHaveBeenNthCalledWith(2, 'note: ', 'First note');
        expect(consoleSpy).toHaveBeenNthCalledWith(3, 'tags: ', [
            'work',
            'important',
        ]);
        expect(consoleSpy).toHaveBeenNthCalledWith(4, '\n');
        expect(consoleSpy).toHaveBeenNthCalledWith(5, 'id: ', 2);
        expect(consoleSpy).toHaveBeenNthCalledWith(6, 'note: ', 'Second note');
        expect(consoleSpy).toHaveBeenNthCalledWith(7, 'tags: ', ['personal']);
        expect(consoleSpy).toHaveBeenNthCalledWith(8, '\n');
    });

    it('should handle empty notes array', () => {
        listNotes([]);
        expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should handle notes with empty tags', () => {
        const notes = [
            {
                id: 1,
                content: 'Note without tags',
                tags: [],
            },
        ];

        listNotes(notes);

        expect(consoleSpy).toHaveBeenCalledTimes(4);
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'id: ', 1);
        expect(consoleSpy).toHaveBeenNthCalledWith(
            2,
            'note: ',
            'Note without tags'
        );
        expect(consoleSpy).toHaveBeenNthCalledWith(3, 'tags: ', []);
        expect(consoleSpy).toHaveBeenNthCalledWith(4, '\n');
    });
});

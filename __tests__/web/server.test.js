import { jest } from '@jest/globals';

const mockReadFile = jest.fn();
const mockCreateServer = jest.fn();
const mockListen = jest.fn();
const mockWriteHead = jest.fn();
const mockEnd = jest.fn();
const mockOpen = jest.fn();

jest.unstable_mockModule('node:fs/promises', () => ({
    default: {
        readFile: mockReadFile,
    },
}));

jest.unstable_mockModule('node:http', () => ({
    default: {
        createServer: mockCreateServer,
    },
}));

jest.unstable_mockModule('open', () => ({
    default: mockOpen,
}));

const { start } = await import('../../src/web/server.js');

describe('server module', () => {
    let consoleSpy;
    const mockServer = {
        listen: mockListen,
    };
    const mockRes = {
        writeHead: mockWriteHead,
        end: mockEnd,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        mockCreateServer.mockReturnValue(mockServer);
        mockListen.mockImplementation((port, callback) => callback());
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe('start function', () => {
        it('should create server, listen on port, log address and open browser', () => {
            const notes = [{ id: 1, content: 'test', tags: ['work'] }];
            const port = 3000;

            start(notes, port);

            expect(mockCreateServer).toHaveBeenCalledTimes(1);
            expect(mockListen).toHaveBeenCalledWith(port, expect.any(Function));
            expect(consoleSpy).toHaveBeenCalledWith(
                'Server running at http://localhost:3000'
            );
            expect(mockOpen).toHaveBeenCalledWith('http://localhost:3000');
        });

        it('should handle different port', () => {
            const notes = [];
            const port = 8080;

            start(notes, port);

            expect(mockListen).toHaveBeenCalledWith(8080, expect.any(Function));
            expect(consoleSpy).toHaveBeenCalledWith(
                'Server running at http://localhost:8080'
            );
            expect(mockOpen).toHaveBeenCalledWith('http://localhost:8080');
        });
    });

    describe('server request handling function', () => {
        it('should serve HTML template with notes', async () => {
            const notes = [
                { content: 'Test note', tags: ['work', 'important'] },
                { content: 'Another note', tags: [] },
            ];

            mockReadFile.mockResolvedValue(
                '<html><body>{{notes}}</body></html>'
            );
            start(notes, 3000);

            const requestHandler = mockCreateServer.mock.calls[0][0];
            await requestHandler({ url: '/' }, mockRes);

            expect(mockReadFile).toHaveBeenCalledWith(
                expect.stringContaining('template.html'),
                'utf-8'
            );
            expect(mockWriteHead).toHaveBeenCalledWith(200, {
                'Content-Type': 'text/html',
            });
            expect(mockEnd).toHaveBeenCalledWith(
                expect.stringContaining('<div class="note">')
            );
        });

        it('should serve CSS file', async () => {
            const cssContent = 'body { color: red; }';

            mockReadFile.mockResolvedValue(cssContent);
            start([], 3000);

            const requestHandler = mockCreateServer.mock.calls[0][0];
            await requestHandler({ url: '/css/styles.css' }, mockRes);

            expect(mockReadFile).toHaveBeenCalledWith(
                expect.stringContaining('styles.css'),
                'utf-8'
            );
            expect(mockWriteHead).toHaveBeenCalledWith(200, {
                'Content-Type': 'text/css',
            });
            expect(mockEnd).toHaveBeenCalledWith(cssContent);
        });

        it('should handle CSS file not found', async () => {
            mockReadFile.mockRejectedValue(new Error('File not found'));
            start([], 3000);

            const requestHandler = mockCreateServer.mock.calls[0][0];

            await expect(
                requestHandler({ url: '/css/styles.css' }, mockRes)
            ).rejects.toThrow('File not found');
        });

        it('should handle alternative CSS path', async () => {
            const htmlContent = '<html><body>{{notes}}</body></html>';

            mockReadFile.mockResolvedValue(htmlContent);
            start([], 3000);

            const requestHandler = mockCreateServer.mock.calls[0][0];
            await requestHandler({ url: '../css/styles.css' }, mockRes);

            expect(mockWriteHead).toHaveBeenCalledWith(200, {
                'Content-Type': 'text/html',
            });
            expect(mockEnd).toHaveBeenCalledWith(
                expect.stringContaining('<html>')
            );
        });
    });
});

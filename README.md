# Notes CLI

Command-line interface for creating, managing, and organizing notes with tag support and a web interface.

## Setup

### Install Dependencies

```bash
npm install
```

### Global Installation

```bash
npm link
```

## Help

```bash
notes-cli --help
```

## Usage

### Create a New Note

```bash
notes-cli new "<note-content>"

# Note with tags
notes-cli new "<note-content>" --tags "<tag1,tag2,tag3>"
```

### View All Notes

```bash
notes-cli all
```

### Search Notes

```bash
notes-cli find "<search-term>"
```

### Remove a Note

```bash
notes-cli remove <note-id>
```

### Clear All Notes

```bash
notes-cli clean
```

## Web Interface

```bash
notes-cli web

# Start on a specific port
notes-cli web <port-number>
```

## Testing

### Run All Tests

```bash
npm test
```

## Attribution

This project was created as part of the [Introduction to Node.js, v3](https://frontendmasters.com/courses/node-js-v3/) course on Frontend Masters. The original course content has been adapted and expanded upon. This repository is intended for educational purposes and portfolio demonstration.

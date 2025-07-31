import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { allCommand } from './all.js';
import { cleanCommand } from './clean.js';
import { findCommand } from './find.js';
import { newCommand } from './new.js';
import { removeCommand } from './remove.js';
import { webCommand } from './web.js';

yargs(hideBin(process.argv))
    .command(newCommand)
    .command(allCommand)
    .command(findCommand)
    .command(removeCommand)
    .command(webCommand)
    .command(cleanCommand)
    .demandCommand(1)
    .parse();

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { newCommand } from './new.js';
import { allCommand } from './all.js';
import { findCommand } from './find.js';
import { removeCommand } from './remove.js';
import { webCommand } from './web.js';
import { cleanCommand } from './clean.js';

yargs(hideBin(process.argv))
    .command(newCommand)
    .command(allCommand)
    .command(findCommand)
    .command(removeCommand)
    .command(webCommand)
    .command(cleanCommand)
    .demandCommand(1)
    .parse();

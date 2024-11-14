#!/usr/bin/env node

import { program } from 'commander';
import { askCommand } from './commands/askCommand.js';

program.addCommand(askCommand);

program.parse(process.argv);

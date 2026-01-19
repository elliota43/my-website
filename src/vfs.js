const fileSystem = {
  type: 'folder',
  name: '/',
  contents: {
    'articles': {
      type: 'folder',
      contents: {
        'react-hooks.txt': {
          type: 'file',
          content: `Understanding React Hooks
========================

React Hooks revolutionized how we write components...`
        },
        'terminal-portfolio.txt': {
          type: 'file',
          content: `Building a Terminal Portfolio
===========================

This article walks through creating an interactive terminal...`
        }
      }
    },
    'projects': {
      type: 'folder',
      contents: {
        'portfolio.txt': {
          type: 'file',
          content: `Terminal Portfolio
=================
An interactive terminal-based portfolio website.
Tech: React, Vite, CSS`
        }
      }
    },
    'resume.txt': {
      type: 'file',
      content: `
╔═══════════════════════════════════════╗
║        ELLIOT ANDERSON               ║
║        Software Developer            ║
╚═══════════════════════════════════════╝

CONTACT
-------
Email: elliot.anderson43@gmail.com
GitHub: github.com/elliota43
Twitter: @elliotlanderson

SKILLS
------
- React, JavaScript, Node.js
- Terminal interfaces & CLI tools
- Web development

EXPERIENCE
----------
Building cool stuff with code!
`
    },
    '.hidden': {
      type: 'file',
      content: 'You found a hidden file! 🎉'
    }
  }
};


let cwdPath = ['/'];

const FORTUNES = [
  "Code is like humor. When you have to explain it, it is bad.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "The best error message is the one that never shows up.",
  "Programs must be written for people to read.",
  "First, solve the problem. Then, write the code.",
  "Deleted code is debugged code.",
  "If it hurts, do it more often.",
  "The only way to go fast, is to go well.",
  "Small steps compound into big wins."
];

function getNodeByPath(pathArray) {
    let node = fileSystem;
    for (let part of pathArray) {
        if (part === '/' || part === '') continue;
        if (!node.contents || !node.contents[part]) return null;
        node = node.contents[part];
    }
    return node;
}

function resolvePath(path) {
    if (path.startsWith('/')) {
        return path.split('/').filter(p => p !== '');
    }
    return [...cwdPath.slice(1), ...path.split('/').filter(p => p !== '')];
}

const COMMANDS = {
  ls: {
    usage: 'ls [-la]',
    description: 'list directory contents',
    man: `NAME
  ls - list directory contents
SYNOPSIS
  ls [-la]
DESCRIPTION
  Lists files and folders in the current directory.`,
    handler: ({ args }) => {
      const node = getNodeByPath(cwdPath);
      if (!node || node.type !== 'folder') return 'Not a directory';

      const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');

      let entries = Object.entries(node.contents);

      if (!showHidden) {
        entries = entries.filter(([name]) => !name.startsWith('.'));
      }

      if (longFormat) {
        return entries.map(([name, item]) => {
          const type = item.type === 'folder' ? 'd' : '-';
          const size = item.type === 'file' ? (item.content?.length || 0) : 0;
          return `${type}rw-r--r--  1 user  ${size.toString().padStart(6)} ${name}`;
        }).join('\n') || '(empty)';
      }

      return entries.map(([name, item]) => {
        return item.type === 'folder' ? `${name}/` : name;
      }).join('  ') || '(empty)';
    }
  },
  cd: {
    usage: 'cd <dir>',
    description: 'change directory',
    man: `NAME
  cd - change directory
SYNOPSIS
  cd <dir>
DESCRIPTION
  Moves the working directory. Use ".." to go up or "/" for root.`,
    handler: ({ args }) => {
      if (args.length === 0) {
        cwdPath = ['/'];
        return '';
      }
      const dest = args[0];
      if (dest === '..') {
        if (cwdPath.length > 1) cwdPath.pop();
        return '';
      }
      if (dest === '.') return '';
      const newPath = dest.startsWith('/')
        ? ['/', ...dest.split('/').filter(p => p !== '')]
        : [...cwdPath, dest];
      const node = getNodeByPath(newPath);
      if (!node) return `cd: no such file or directory: ${dest}`;
      if (node.type !== 'folder') return `cd: not a directory: ${dest}`;
      cwdPath = newPath;
      return '';
    }
  },
  pwd: {
    usage: 'pwd',
    description: 'print working directory',
    man: `NAME
  pwd - print working directory
SYNOPSIS
  pwd
DESCRIPTION
  Prints the current directory path.`,
    handler: () => (cwdPath.length > 1 ? cwdPath.join('/') : '/')
  },
  cat: {
    usage: 'cat <file>',
    description: 'display file contents',
    man: `NAME
  cat - display file contents
SYNOPSIS
  cat <file>
DESCRIPTION
  Prints the contents of a file in the virtual filesystem.`,
    handler: ({ args }) => {
      if (args.length === 0) return 'cat: missing file operand';
      const filePath = resolvePath(args[0]);
      const node = getNodeByPath(['/', ...filePath]);
      if (!node) return `cat: ${args[0]}: No such file or directory`;
      if (node.type === 'folder') return `cat: ${args[0]}: Is a directory`;
      return node.content || '';
    }
  },
  mkdir: {
    usage: 'mkdir <dir>',
    description: 'create directory',
    man: `NAME
  mkdir - create directory
SYNOPSIS
  mkdir <dir>
DESCRIPTION
  Creates a directory in the current folder.`,
    handler: ({ args }) => {
      if (args.length === 0) return 'mkdir: missing operand';
      const dirName = args[0];
      if (dirName.includes('/')) return 'mkdir: only simple names supported (no paths)';
      const parent = getNodeByPath(cwdPath);
      if (parent.contents[dirName]) {
        return `mkdir: cannot create directory '${dirName}': File exists`;
      }
      parent.contents[dirName] = { type: 'folder', contents: {} };
      return '';
    }
  },
  touch: {
    usage: 'touch <file>',
    description: 'create empty file',
    man: `NAME
  touch - create empty file
SYNOPSIS
  touch <file>
DESCRIPTION
  Creates an empty file in the current directory.`,
    handler: ({ args }) => {
      if (args.length === 0) return 'touch: missing file operand';
      const fileName = args[0];
      if (fileName.includes('/')) return 'touch: only simple names supported (no paths)';
      const parent = getNodeByPath(cwdPath);
      if (!parent.contents[fileName]) {
        parent.contents[fileName] = { type: 'file', content: '' };
      }
      return '';
    }
  },
  rm: {
    usage: 'rm <name>',
    description: 'remove file or directory',
    man: `NAME
  rm - remove file or directory
SYNOPSIS
  rm <name>
DESCRIPTION
  Removes a file or directory in the current folder.`,
    handler: ({ args }) => {
      if (args.length === 0) return 'rm: missing operand';
      const name = args[0];
      const parent = getNodeByPath(cwdPath);
      if (!parent.contents[name]) {
        return `rm: cannot remove '${name}': No such file or directory`;
      }
      delete parent.contents[name];
      return '';
    }
  },
  help: {
    usage: 'help',
    description: 'show available commands',
    man: `NAME
  help - show available commands
SYNOPSIS
  help
DESCRIPTION
  Lists available commands in this terminal.`,
    handler: () => getHelpText()
  },
  man: {
    usage: 'man <command>',
    description: 'show manual for a command',
    man: `NAME
  man - show manual for a command
SYNOPSIS
  man <command>
DESCRIPTION
  Displays help pages for supported commands.`,
    handler: ({ args }) => {
      if (args.length === 0) return 'man: missing command';
      return getManPage(args[0]);
    }
  },
  fortune: {
    usage: 'fortune',
    description: 'print a random quote',
    man: `NAME
  fortune - print a random quote
SYNOPSIS
  fortune
DESCRIPTION
  Prints a random short quote each time.`,
    handler: () => FORTUNES[Math.floor(Math.random() * FORTUNES.length)]
  },
  grep: {
    usage: 'grep <text>',
    description: 'filter input by text',
    man: `NAME
  grep - filter input by text
SYNOPSIS
  <command> | grep <text>
DESCRIPTION
  Filters piped output, returning lines that include the text.`,
    handler: ({ args, input }) => {
      if (args.length === 0) return 'grep: missing search pattern';
      if (!input) return '';
      const pattern = args[0];
      return input
        .split('\n')
        .filter(line => line.includes(pattern))
        .join('\n');
    }
  },
  about: {
    usage: 'about',
    description: 'about me',
    man: `NAME
  about - about me
SYNOPSIS
  about
DESCRIPTION
  Short introduction and skills summary.`,
    handler: () => `Hi! I'm Elliot Anderson
      
A developer passionate about building cool stuff.
I love creating interactive experiences and terminal interfaces.

Skills: React, JavaScript, Node.js, Python
Currently building: This terminal portfolio!

Type 'cat resume.txt' to see my full resume.`
  },
  contact: {
    usage: 'contact',
    description: 'contact information',
    man: `NAME
  contact - contact information
SYNOPSIS
  contact
DESCRIPTION
  Displays ways to get in touch.`,
    handler: () => `Get in touch:
  
  Email:   elliot.anderson43@gmail.com
  GitHub:  github.com/elliota43
  Twitter: @elliotlanderson
  
Feel free to reach out!`
  },
  clear: {
    usage: 'clear',
    description: 'clear terminal',
    man: `NAME
  clear - clear terminal
SYNOPSIS
  clear
DESCRIPTION
  Clears the current terminal output.`,
    handler: () => '__clear__'
  }
};

function getHelpText() {
  const lines = Object.keys(COMMANDS).map((name) => {
    const cmd = COMMANDS[name];
    return `  ${cmd.usage.padEnd(12)} - ${cmd.description}`;
  });
  return `Available commands:\n${lines.join('\n')}`;
}

function getManPage(command) {
  const entry = COMMANDS[command];
  if (!entry) return `man: no manual entry for ${command}`;
  return entry.man || `man: no manual entry for ${command}`;
}

function getClosestCommand(command) {
  const commands = Object.keys(COMMANDS);
  if (!command) return null;
  let best = null;
  let bestScore = Infinity;
  for (const candidate of commands) {
    const score = levenshteinDistance(command, candidate);
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return bestScore <= 2 ? best : null;
}

function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function executeCommand(input) {
  const pipeline = input.split('|').map(segment => segment.trim()).filter(Boolean);
  if (pipeline.length === 0) return '';

  let output = '';
  for (let i = 0; i < pipeline.length; i++) {
    const segment = pipeline[i];
    const parts = segment.split(' ').filter(Boolean);
    const cmd = parts[0];
    const args = parts.slice(1);
    const command = COMMANDS[cmd];

    if (!command) {
      const suggestion = getClosestCommand(cmd);
      return suggestion
        ? `Command not found: ${cmd}. Did you mean '${suggestion}'?`
        : `Command not found: ${cmd}. Type 'help' for available commands.`;
    }

    const result = command.handler({ args, input: i === 0 ? '' : output });
    if (result === '__clear__') {
      if (pipeline.length > 1) return 'clear: cannot be used in a pipeline';
      return '__clear__';
    }
    output = result ?? '';
  }

  return output;
}

function getCwdPath() {
    return cwdPath.length > 1 ? cwdPath.join('/') : '/';
}

function getCompletions(partial) {
    const segments = partial.split('|');
    const active = segments[segments.length - 1].trimStart();
    const parts = active.trim().split(' ').filter(Boolean);
    const commands = Object.keys(COMMANDS);

    // Command getCompletions
    if (parts.length === 0) {
        return commands;
    }
    if (parts.length === 1) {
        return commands.filter(cmd => cmd.startsWith(parts[0]));
    }

    // File/folder completion for commands that take paths
    if (parts.length === 2 && ['cd', 'cat', 'rm'].includes(parts[0])) {
        const node = getNodeByPath(cwdPath);
        if (node && node.type === 'folder') {
            const entries = Object.keys(node.contents);
            return entries.filter(name => name.startsWith(parts[1]));
        }
    }

    if (parts.length === 2 && parts[0] === 'man') {
        return commands.filter(cmd => cmd.startsWith(parts[1]));
    }

    return [];
}

export { executeCommand, getCwdPath, getCompletions };

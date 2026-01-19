const fileSystem = {
    type: 'folder',
    name: '/',
    contents: {
        'articles': {
            type: 'folder',
            contents: {
                'react.txt': {
                    type: 'file',
                    content: 'Text version of an example react.js article...'
                },
            }
        },
        'resume.txt': {
            type: 'file',
            content: 'Elliot Anderson\nWeb Developer\nSkills: React, Node.js, Laravel, Go'
        },
    }
};

let cwdPath = ['/'];

function getNodeByPath(pathArray) {
    let node = fileSystem;
    for (let part of pathArray) {
        if (part === '/') continue;
        if (!node.contents || !node.contents[part]) return null;
        node = node.contents[part];
    }
    return node;
}

function executeCommand(input) {
  const [cmd, ...args] = input.trim().split(' ');
  let output = '';

  switch (cmd) {
    case 'ls': {
      const node = getNodeByPath(cwdPath);
      if (!node || node.type !== 'folder') return 'Not a directory';
      output = Object.keys(node.contents).join(' ') || '(empty)';
      break;
    }
    case 'pwd': {
      output = cwdPath.length > 1 ? cwdPath.join('/') : '/';
      break;
    }
    case 'cd': {
      if (args.length === 0) {
        cwdPath = ['/'];
        output = '';
        break;
      }
      let dest = args[0];
      if (dest === '..') {
        if (cwdPath.length > 1) cwdPath.pop();
        output = '';
        break;
      }
      const newPath = dest.startsWith('/') ? dest.split('/') : [...cwdPath, dest];
      const node = getNodeByPath(newPath);
      if (!node) {
        output = `No such directory: ${dest}`;
      } else if (node.type !== 'folder') {
        output = `${dest} is not a directory`;
      } else {
        cwdPath = newPath;
        output = '';
      }
      break;
    }
    case 'cat':
    case 'open': {
      if (args.length === 0) {
        output = 'Specify a file to open';
        break;
      }
      const node = getNodeByPath([...cwdPath, args[0]]);
      if (!node) {
        output = `No such file: ${args[0]}`;
      } else if (node.type === 'folder') {
        output = `${args[0]} is a directory`;
      } else {
        output = node.content;
      }
      break;
    }
    case 'help': {
      output = `Commands:
  ls - list files/folders
  cd <dir> - change directory
  pwd - show current dir
  cat <file> - show file content
  clear - clear screen
  help - show this message`;
      break;
    }
    case 'clear':
      return '__clear__'; // special token for clearing screen
    default:
      output = `Unknown command: ${cmd}. Type 'help' for commands.`;
  }
  return output;
}

function getCwdPath() {
    return cwdPath.length > 1 ? cwdPath.join('/') : '/';
}

export { executeCommand, getCwdPath };
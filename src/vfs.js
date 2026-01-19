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

function executeCommand(input) {
  const parts = input.trim().split(' ');
  const cmd = parts[0];
  const args = parts.slice(1);
  let output = '';

  switch (cmd) {
    case 'ls': {
      const node = getNodeByPath(cwdPath);
      if (!node || node.type !== 'folder') return 'Not a directory';
      
      const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
      
      let entries = Object.entries(node.contents);
      
      if (!showHidden) {
        entries = entries.filter(([name]) => !name.startsWith('.'));
      }
      
      if (longFormat) {
        output = entries.map(([name, item]) => {
          const type = item.type === 'folder' ? 'd' : '-';
          const size = item.type === 'file' ? (item.content?.length || 0) : 0;
          return `${type}rw-r--r--  1 user  ${size.toString().padStart(6)} ${name}`;
        }).join('\n');
      } else {
        output = entries.map(([name, item]) => {
          return item.type === 'folder' ? `${name}/` : name;
        }).join('  ');
      }
      
      output = output || '(empty)';
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
      if (dest === '.') {
        output = '';
        break;
      }
      const newPath = dest.startsWith('/') 
        ? ['/', ...dest.split('/').filter(p => p !== '')] 
        : [...cwdPath, dest];
      const node = getNodeByPath(newPath);
      if (!node) {
        output = `cd: no such file or directory: ${dest}`;
      } else if (node.type !== 'folder') {
        output = `cd: not a directory: ${dest}`;
      } else {
        cwdPath = newPath;
        output = '';
      }
      break;
    }

    case 'cat': {
      if (args.length === 0) {
        output = 'cat: missing file operand';
        break;
      }
      const filePath = resolvePath(args[0]);
      const node = getNodeByPath(['/', ...filePath]);
      if (!node) {
        output = `cat: ${args[0]}: No such file or directory`;
      } else if (node.type === 'folder') {
        output = `cat: ${args[0]}: Is a directory`;
      } else {
        output = node.content || '';
      }
      break;
    }

    case 'mkdir': {
      if (args.length === 0) {
        output = 'mkdir: missing operand';
        break;
      }
      const dirName = args[0];
      if (dirName.includes('/')) {
        output = 'mkdir: only simple names supported (no paths)';
        break;
      }
      const parent = getNodeByPath(cwdPath);
      if (parent.contents[dirName]) {
        output = `mkdir: cannot create directory '${dirName}': File exists`;
      } else {
        parent.contents[dirName] = {
          type: 'folder',
          contents: {}
        };
        output = '';
      }
      break;
    }

    case 'touch': {
      if (args.length === 0) {
        output = 'touch: missing file operand';
        break;
      }
      const fileName = args[0];
      if (fileName.includes('/')) {
        output = 'touch: only simple names supported (no paths)';
        break;
      }
      const parent = getNodeByPath(cwdPath);
      if (parent.contents[fileName]) {
        output = ''; // File exists, just update timestamp (we'll skip this)
      } else {
        parent.contents[fileName] = {
          type: 'file',
          content: ''
        };
        output = '';
      }
      break;
    }

    case 'rm': {
      if (args.length === 0) {
        output = 'rm: missing operand';
        break;
      }
      const name = args[0];
      const parent = getNodeByPath(cwdPath);
      if (!parent.contents[name]) {
        output = `rm: cannot remove '${name}': No such file or directory`;
      } else {
        delete parent.contents[name];
        output = '';
      }
      break;
    }

    case 'help': {
      output = `Available commands:
  ls [-la]     - list directory contents
  cd <dir>     - change directory
  pwd          - print working directory
  cat <file>   - display file contents
  mkdir <dir>  - create directory
  touch <file> - create empty file
  rm <name>    - remove file or directory
  clear        - clear terminal
  about        - about me
  contact      - contact information
  help         - show this message`;
      break;
    }

    case 'about': {
      output = `Hi! I'm Elliot Anderson
      
A developer passionate about building cool stuff.
I love creating interactive experiences and terminal interfaces.

Skills: React, JavaScript, Node.js, Python
Currently building: This terminal portfolio!

Type 'cat resume.txt' to see my full resume.`;
      break;
    }

    case 'contact': {
      output = `Get in touch:
  
  Email:   elliot.anderson43@gmail.com
  GitHub:  github.com/elliota43
  Twitter: @elliotlanderson
  
Feel free to reach out!`;
      break;
    }

    case 'clear':
      return '__clear__';

    default:
      output = `Command not found: ${cmd}. Type 'help' for available commands.`;
  }

  return output;
}

function getCwdPath() {
    return cwdPath.length > 1 ? cwdPath.join('/') : '/';
}

function getCompletions(partial) {
    const parts = partial.trim().split(' ');

    // Command getCompletions
    if (parts.length === 1) {
        const commands = ['ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'clear', 'help', 'about', 'contact'];
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

    return [];
}

export { executeCommand, getCwdPath, getCompletions };
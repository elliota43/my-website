import { useState, useEffect, useRef } from 'react';
import './Terminal.css';

function Terminal() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState([
        { type: 'output', content: 'Welcome to my portfolio!' },
        { type: 'output', content: 'Type "help" to see available commands.'},
        { type: 'output', content: ''}
    ]);
    const inputRef = useRef(null);
    const terminalRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);

    function handleCommand(cmd) {
        const trimmedCmd = cmd.trim().toLowerCase();

        setOutput(prev => [...prev, { type: 'input', content: cmd }]);

        let output = '';

        switch(trimmedCmd) {
            case 'help':
                output = `Available commands:
        help      - Show this help message
        about     - About me
        projects  - View my projects
        blog      - Read my blog posts
        contact   - Get in touch
        clear     - Clear terminal`;
                break;
            
            case 'about':
                output = `Hi! I'm Elliot Anderson -- 
        a developer passionate about building cool stuff.
        Skills: React, JavaScript, Node.js, etc.`;
                break;
            
            case 'projects':
                output = `My Projects:
        1. Terminal Portfolio - This website!
        2. Project Two - Description
        3. Project Three - Description
        
        Type 'project <number>' for more details.`;
                break;
            
            case 'blog':
                output = `Recent Blog Posts:
        1. Building a Terminal Portfolio
        2. My Journey into Web Development
        
        Type 'blog <number>' to read.`;
                break;
            
            case 'contact':
                output = `Get in touch:
        Email: elliot.anderson43@gmail.com
        GitHub: github.com/elliota43
        Twitter: @elliotlanderson`;
                break;
            
            case 'clear':
                setOutput([]);
                return;
            
            default:
                output = `Command not found: ${cmd}. Type 'help' for available commands.`;
            }

        setOutput(prev => [...prev, { type: 'output', content: output }]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (input.trim()) {
            handleCommand(input);
            setInput('');
        }
    }

    function handleTerminalClick() {
        inputRef.current?.focus();
    }

    return (
        <div className="terminal-container" onClick={handleTerminalClick}>
            <div className="terminal-header">
                <div className="terminal-buttons">
                    <span className="btn close"></span>
                    <span className="btn minimize"></span>
                    <span className="btn maximize"></span>
                </div>
                <div className="terminal-title">terminal@portfolio</div>
            </div>

            <div className="terminal-body" ref={terminalRef}>
                {output.map((item, index) => (
                    <div key={index} className={`terminal-line ${item.type}`}>
                        {item.type === 'input' && <span className="prompt">$ </span>}
                        <span className="content">{item.content}</span>
                    </div>
                ))}

                <form onSubmit={handleSubmit} className="terminal-input-line">
                    <span className="prompt">$ </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="terminal-input"
                        autoFocus
                        spellCheck="false"
                        />
                </form>
            </div>
        </div>
    );
}

export default Terminal;
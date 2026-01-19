import React, { useState, useEffect, useRef } from 'react';
import { executeCommand, getCwdPath } from '../vfs';

import './Terminal.css';


function Terminal() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState([
        { type: 'output', content: 'Welcome to my portfolio!' },
        { type: 'output', content: 'Type "help" to see available commands.'},
        { type: 'output', content: ''}
    ]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(null);

    const inputRef = useRef(null);

    const terminalRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        if (input.trim() === '') return;
        const cmd = input.trim();
        const result = executeCommand(cmd);

        setCommandHistory(prev => [...prev, cmd]);
        setHistoryIndex(null);

        if (result === '__clear__') {
            setOutput([]);
        } else {
            setOutput(h => [...h, { type: 'input', content: getCwdPath() + '$ ' + cmd }, { type: 'output', content: result }])
        }
        setInput('');
    }

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);

    function handleTerminalClick() {
        inputRef.current?.focus();
    }

    function handleKeyDown(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length === 0) return;

            let newIndex = historyIndex === null ? commandHistory.length - 1 : historyIndex - 1;
            if (newIndex < 0) newIndex = 0;

            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (commandHistory.length === 0) return;

            let newIndex = historyIndex === null ? -1 : historyIndex + 1;
            if (newIndex >= commandHistory.length) {
                setHistoryIndex(null);
                setInput('');
            } else {
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        }
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
                        onKeyDown={handleKeyDown}
                        className="terminal-input"
                        autoFocus
                        spellCheck="false"
                        autoComplete="off"
                        />
                </form>
            </div>
        </div>
    );
}

export default Terminal;
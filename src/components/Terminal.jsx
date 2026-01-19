import React, { useEffect, useRef, useReducer } from "react";
import { executeCommand, getCwdPath, getCompletions } from "../vfs";
import { Card, CardContent, CardHeader } from "./ui/card";

const initialState = {
  input: "",
  output: [
    { type: "output", content: "Welcome to my portfolio!" },
    { type: "output", content: 'Type "help" to see available commands.' },
    { type: "output", content: "" },
  ],
  commandHistory: [],
  historyIndex: null,
  tabCompletions: [],
  tabIndex: 0,
  clock: "",
};

const HISTORY_STORAGE_KEY = "terminal-history";

function applyCompletionToInput(input, completion) {
  const parts = input.split(" ");
  parts[parts.length - 1] = completion;
  return parts.join(" ");
}

function formatClockTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function initTerminalState(baseState) {
  let history = [];
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        history = parsed;
      }
    } catch {
      history = [];
    }
  }

  return {
    ...baseState,
    commandHistory: history,
    clock: formatClockTime(new Date()),
  };
}

function terminalReducer(state, action) {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.value };

    case "SET_CLOCK":
      return { ...state, clock: action.value };

    case "RESET_COMPLETIONS":
      return { ...state, tabCompletions: [], tabIndex: 0 };

    case "CANCEL": {
      const prompt = action.prompt; // computed outside reducer
      const line = `${state.input}^C`;

      // Print as a normal typed command line (prompt + content),
      // then a blank output line (optional, but feels terminal-y).
      return {
        ...state,
        input: "",
        historyIndex: null,
        tabCompletions: [],
        tabIndex: 0,
        output: [
          ...state.output,
          { type: "input", prompt, content: line },
          { type: "output", content: "" },
        ],
      };
    }

    case "SUBMIT": {
      const { cmd, prompt, result } = action;

      // "clear" behavior
      if (result === "__clear__") {
        return {
          ...state,
          input: "",
          output: [],
          commandHistory: [...state.commandHistory, cmd],
          historyIndex: null,
          tabCompletions: [],
          tabIndex: 0,
        };
      }

      return {
        ...state,
        input: "",
        output: [
          ...state.output,
          { type: "input", prompt, content: cmd },
          { type: "output", content: result },
        ],
        commandHistory: [...state.commandHistory, cmd],
        historyIndex: null,
        tabCompletions: [],
        tabIndex: 0,
      };
    }

    case "HISTORY_UP": {
      const { commandHistory, historyIndex } = state;
      if (commandHistory.length === 0) return state;

      let newIndex =
        historyIndex === null ? commandHistory.length - 1 : historyIndex - 1;
      if (newIndex < 0) newIndex = 0;

      return {
        ...state,
        historyIndex: newIndex,
        input: commandHistory[newIndex],
        tabCompletions: [],
        tabIndex: 0,
      };
    }

    case "HISTORY_DOWN": {
      const { commandHistory, historyIndex } = state;
      if (commandHistory.length === 0) return state;

      let newIndex = historyIndex === null ? -1 : historyIndex + 1;

      if (newIndex >= commandHistory.length) {
        return {
          ...state,
          historyIndex: null,
          input: "",
          tabCompletions: [],
          tabIndex: 0,
        };
      }

      return {
        ...state,
        historyIndex: newIndex,
        input: commandHistory[newIndex],
        tabCompletions: [],
        tabIndex: 0,
      };
    }

    case "TAB_FIRST": {
      const { completions } = action; // computed outside reducer
      if (!completions || completions.length === 0) return state;

      // If only one option, accept it and clear completion list
      if (completions.length === 1) {
        return {
          ...state,
          input: applyCompletionToInput(state.input, completions[0]),
          tabCompletions: [],
          tabIndex: 0,
        };
      }

      // Multiple options: set list and insert first completion
      return {
        ...state,
        tabCompletions: completions,
        tabIndex: 0,
        input: applyCompletionToInput(state.input, completions[0]),
      };
    }

    case "TAB_CYCLE": {
      const { tabCompletions, tabIndex } = state;
      if (!tabCompletions || tabCompletions.length === 0) return state;

      const nextIndex = (tabIndex + 1) % tabCompletions.length;
      return {
        ...state,
        tabIndex: nextIndex,
        input: applyCompletionToInput(state.input, tabCompletions[nextIndex]),
      };
    }

    default:
      return state;
  }
}

function Terminal() {
  const [state, dispatch] = useReducer(terminalReducer, initialState, initTerminalState);

  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [state.output]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(state.commandHistory)
      );
    }
  }, [state.commandHistory]);

  useEffect(() => {
    const tick = () => dispatch({ type: "SET_CLOCK", value: formatClockTime(new Date()) });
    const interval = window.setInterval(tick, 1000);
    tick();
    return () => window.clearInterval(interval);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const cmd = state.input.trim();
    if (!cmd) return;

    // side effects computed here (NOT in reducer)
    const prompt = getCwdPath();
    const result = executeCommand(cmd);

    dispatch({ type: "SUBMIT", cmd, prompt, result });
  }

  function handleTerminalClick() {
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    const isCancel = (e.ctrlKey || e.metaKey) && e.code === "KeyC";
    if (isCancel) {
      e.preventDefault();
      dispatch({ type: "CANCEL", prompt: getCwdPath() });
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();

      if (state.tabCompletions.length === 0) {
        const completions = getCompletions(state.input);
        if (!completions || completions.length === 0) return;
        dispatch({ type: "TAB_FIRST", completions });
      } else {
        dispatch({ type: "TAB_CYCLE" });
      }
      return;
    }

    // reset completions on any non-tab key
    if (state.tabCompletions.length) {
      dispatch({ type: "RESET_COMPLETIONS" });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      dispatch({ type: "HISTORY_UP" });
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      dispatch({ type: "HISTORY_DOWN" });
      return;
    }
  }

  return (
    <Card
      className="flex h-[60vh] min-h-[420px] w-full flex-col overflow-hidden bg-terminal-base/95 backdrop-blur md:h-[600px]"
      onClick={handleTerminalClick}
    >
      <CardHeader className="gap-2 bg-terminal-header/90">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f25f5c]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f2c14e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8ac926]" />
        </div>
        <div className="flex-1 text-center font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
          terminal@portfolio
        </div>
        <div className="min-w-[72px] text-right font-mono text-xs text-slate-400">
          {state.clock}
        </div>
      </CardHeader>

      <CardContent
        ref={terminalRef}
        className="flex-1 overflow-y-auto bg-terminal-base px-5 py-4 font-mono text-[13px] leading-5 text-slate-100"
      >
        <div className="flex flex-col gap-0">
          {state.output.map((item, index) => (
            <div
              key={index}
              className={
                item.type === "output" ? "text-terminal-output" : "text-slate-100"
              }
            >
              {item.type === "input" ? (
                <div className="flex items-start gap-0">
                  <span className="select-none text-terminal-highlight">
                    {item.prompt}$&nbsp;
                  </span>
                  <span className="whitespace-pre-wrap">{item.content}</span>
                </div>
              ) : (
                <span className="whitespace-pre-wrap">{item.content}</span>
              )}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-start gap-0">
            <span className="select-none text-terminal-highlight">
              {getCwdPath()}$&nbsp;
            </span>
            <div
              className="terminal-input-wrapper"
              style={{ "--cursor-pos": state.input.length }}
            >
              <input
                ref={inputRef}
                type="text"
                value={state.input}
                onChange={(e) => dispatch({ type: "SET_INPUT", value: e.target.value })}
                onKeyDown={handleKeyDown}
                className="terminal-input w-full bg-transparent text-slate-100 outline-none"
                autoFocus
                spellCheck="false"
                autoComplete="off"
              />
              <span className="terminal-block-cursor" aria-hidden="true" />
            </div>
          </form>

          {state.tabCompletions.length > 1 && (
            <div className="text-terminal-output">
              <span className="whitespace-pre-wrap">
                {state.tabCompletions.join("  ")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Terminal;

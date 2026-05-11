"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Terminal, CheckCircle2, AlertCircle, ChevronDown, Trash2, Code2, Save, Plus, Palette } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import Editor, { OnMount } from '@monaco-editor/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EXAMPLES: Record<string, { name: string; lang: string; code: string }> = {
  binarySearch: {
    name: 'Binary Search',
    lang: 'javascript',
    code: `// ⚡️ Live Demo: Binary Search Algorithm
// Click 'Run Code' to see it in action

function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found it! 🎯
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
const target = 19;

console.log(\`Searching for \${target} in array: [\${primes.join(', ')}]\`);
const index = binarySearch(primes, target);

if (index !== -1) {
    console.log(\`Found \${target} at index: \${index}\`);
} else {
    console.log(\`\${target} not found in array.\`);
}`
  },
  asyncAwait: {
    name: 'Async/Await',
    lang: 'javascript',
    code: `// 🌐 Async Data Simulation
// Demonstrating non-blocking execution

async function fetchUserData(id) {
  console.log(\`[Network] Fetching data for User ID: \${id}...\`);
  
  // Simulate network latency (800ms)
  await new Promise(r => setTimeout(r, 800));
  
  if (Math.random() > 0.9) throw new Error("Connection Timeout");
  
  return {
    id: id,
    username: "algo_master",
    stats: {
      solved: 142,
      rank: "Diamond"
    }
  };
}

// Top-level execution wrapper
(async () => {
  try {
    const user = await fetchUserData(101);
    console.log("✅ Data received:");
    console.log(user);
    
    console.log("Processing analytics...");
    await new Promise(r => setTimeout(r, 400));
    console.log("Done.");
  } catch (err) {
    console.error(err.message);
  }
})();`
  },
  errorHandling: {
    name: 'Error Handling',
    lang: 'javascript',
    code: `// 🐛 Runtime Error Detection
// Click Run to see how the editor highlights errors

function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero!");
  }
  return a / b;
}

console.log("Calculating 10 / 2...");
console.log(divide(10, 2));

console.log("Calculating 5 / 0...");
// This will throw an error and highlight line 14
console.log(divide(5, 0)); 

console.log("This will not run.");`
  }
};

const THEMES = [
  { id: 'vs-dark', name: 'VS Dark' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'monokai', name: 'Monokai' },
  { id: 'solarized-dark', name: 'Solarized' },
  { id: 'github-light', name: 'GitHub Light' },
];

const THEME_BG_COLORS: Record<string, string> = {
  'vs-dark': '#1e1e1e',
  'dracula': '#282a36',
  'monokai': '#272822',
  'solarized-dark': '#002b36',
  'github-light': '#ffffff',
};

interface SavedSnippet {
  id: string;
  name: string;
  code: string;
  lang: string;
}

const LiveDemo: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [activeExampleId, setActiveExampleId] = useState<string>('binarySearch');
  const [activeTheme, setActiveTheme] = useState<string>('vs-dark');
  const [code, setCode] = useState(EXAMPLES.binarySearch.code);
  const [output, setOutput] = useState<string[]>(['// Compiled in 12ms.', '// All tests passed.']);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [snippetName, setSnippetName] = useState("My Snippet");
  const [deleteSnippetId, setDeleteSnippetId] = useState<string | null>(null);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  // Load saved snippets
  useEffect(() => {
    const saved = localStorage.getItem('codesprint_snippets');
    if (saved) {
      try {
        setSavedSnippets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load snippets", e);
      }
    }
    
    // Fetch problems
    const fetchProblems = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/problems`);
        const data = await response.json();
        if (data && data.data) {
          const fetchedProblems = data.data;
          setProblems(fetchedProblems);
          if (fetchedProblems.length > 0) {
            const firstProblem = fetchedProblems[0];
            setActiveExampleId(firstProblem.uuid);
            
            let starter = '// Write your code here';
            if (firstProblem.starterCode) {
              if (typeof firstProblem.starterCode === 'string') {
                try {
                  const parsed = JSON.parse(firstProblem.starterCode);
                  starter = parsed.javascript || starter;
                } catch(e) {}
              } else {
                starter = firstProblem.starterCode.javascript || starter;
              }
            }
            setCode(starter);
          }
        }
      } catch (err) {
        console.error("Failed to fetch problems", err);
      }
    };
    fetchProblems();
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, isRunning]);

  // Sync theme
  useEffect(() => {
    if (resolvedTheme === 'light') {
      setActiveTheme('github-light');
    } else {
      setActiveTheme('vs-dark');
    }
  }, [resolvedTheme]);

  const defineMonacoThemes = (monaco: any) => {
    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'f8f8f2' },
        { token: 'comment', foreground: '6272a4' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'number', foreground: 'bd93f9' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'identifier', foreground: '50fa7b' },
        { token: 'type', foreground: '8be9fd' },
      ],
      colors: {
        'editor.background': '#282a36',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#44475a',
        'editorCursor.foreground': '#f8f8f2',
        'editorWhitespace.foreground': '#3B3A32',
        'editorIndentGuide.background': '#424450',
        'editorIndentGuide.activeBackground': '#ffffff',
      }
    });
    
    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: 'f8f8f2' },
        { token: 'comment', foreground: '75715e' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'number', foreground: 'ae81ff' },
        { token: 'keyword', foreground: 'f92672' },
        { token: 'identifier', foreground: 'a6e22e' },
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#3e3d32',
        'editorCursor.foreground': '#f8f8f2',
      }
    });

    monaco.editor.defineTheme('solarized-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
         { token: '', foreground: '839496' },
         { token: 'comment', foreground: '586e75' },
         { token: 'string', foreground: '2aa198' },
         { token: 'number', foreground: 'd33682' },
         { token: 'keyword', foreground: '859900' },
         { token: 'identifier', foreground: '268bd2' },
      ],
      colors: {
         'editor.background': '#002b36',
         'editor.foreground': '#839496',
         'editor.lineHighlightBackground': '#073642',
         'editorCursor.foreground': '#839496',
      }
    });

    monaco.editor.defineTheme('github-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d' },
        { token: 'keyword', foreground: 'd73a49' },
        { token: 'identifier', foreground: '6f42c1' },
        { token: 'string', foreground: '032f62' },
        { token: 'number', foreground: '005cc5' },
        { token: 'type', foreground: '005cc5' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editorCursor.foreground': '#24292e',
        'editorIndentGuide.background': '#d1d5da',
        'editor.selectionBackground': '#0366d625',
        'editor.inactiveSelectionBackground': '#0366d615',
      }
    });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    defineMonacoThemes(monaco);
  };

  const executeCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setStatus('idle');
    setOutput(['> Initializing runtime environment...', '> Executing script...']);

    // Clear editor markers
    if (monacoRef.current && editorRef.current) {
      const model = editorRef.current.getModel();
      monacoRef.current.editor.setModelMarkers(model, 'owner', []);
    }

    const isProblem = problems.some(p => p.uuid === activeExampleId);

    if (isProblem) {
       try {
           const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/problems/${activeExampleId}/run-demo`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ code, language: 'javascript' })
           });
           const data = await response.json();
           
           if (!response.ok) throw new Error(data.message || 'Execution failed');
           
           const result = data.data; 
           
           const logs: string[] = [];
           if (result.status === 'error') {
               logs.push(`[Error] ${result.message}`);
               if (result.output) logs.push(result.output);
               setStatus('error');
           } else {
               result.testResults.forEach((tr: any, i: number) => {
                   logs.push(`Test Case ${i+1}: ${tr.passed ? '✅ Passed' : '❌ Failed'}`);
                   if (!tr.passed && !tr.isHidden) {
                       logs.push(`   Expected: ${tr.expected}`);
                       logs.push(`   Got: ${tr.got}`);
                   }
               });
               if (result.status === 'success') {
                   logs.push('');
                   logs.push(`> All tests passed in ${result.time || 0}s ⚡️`);
                   setStatus('success');
               } else {
                   setStatus('error');
               }
           }
           setOutput(logs);
       } catch (err: any) {
           setOutput([`[Error] ${err.message}`]);
           setStatus('error');
       } finally {
           setIsRunning(false);
       }
       return;
    }

    // Delay for realism - Keep it short for responsiveness
    await new Promise(resolve => setTimeout(resolve, 800));

    const logs: string[] = [];
    
    const mockConsole = {
        log: (...args: any[]) => {
            logs.push(args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch (e) {
                        return String(arg);
                    }
                }
                return String(arg);
            }).join(' '));
            setOutput([...logs]); 
        },
        error: (...args: any[]) => {
             logs.push(`[Error] ${args.map(arg => String(arg)).join(' ')}`);
             setOutput([...logs]);
        },
        warn: (...args: any[]) => {
             logs.push(`[Warn] ${args.map(arg => String(arg)).join(' ')}`);
             setOutput([...logs]);
        },
        info: (...args: any[]) => {
             logs.push(`[Info] ${args.map(arg => String(arg)).join(' ')}`);
             setOutput([...logs]);
        },
        clear: () => {
            logs.length = 0;
            setOutput([]);
        }
    };

    try {
        // Use AsyncFunction to allow top-level await logic
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        const runUserCode = new AsyncFunction('console', code);
        
        const startTime = performance.now();
        await runUserCode(mockConsole);
        const endTime = performance.now();
        
        logs.push('');
        logs.push(`> Execution time: ${(endTime - startTime).toFixed(2)}ms ⚡️`);
        
        setOutput(logs);
        setStatus('success');
    } catch (error: any) {
        logs.push(`Runtime Error: ${error.message}`);
        setOutput(logs);
        setStatus('error');

        // Attempt to map error to line number
        if (monacoRef.current && editorRef.current && error.stack) {
            // Check for line number in stack trace
            const match = error.stack.match(/<anonymous>:(\d+):(\d+)/);
            if (match) {
                const line = parseInt(match[1], 10);
                // Adjust for AsyncFunction wrapper offset (usually 2 lines)
                const adjustedLine = line - 2;
                
                const model = editorRef.current.getModel();
                if (model && adjustedLine > 0 && adjustedLine <= model.getLineCount()) {
                     monacoRef.current.editor.setModelMarkers(model, 'owner', [{
                        startLineNumber: adjustedLine,
                        startColumn: 1,
                        endLineNumber: adjustedLine,
                        endColumn: 1000,
                        message: error.message,
                        severity: 8 // MarkerSeverity.Error
                     }]);
                }
            }
        }
    } finally {
        setIsRunning(false);
    }
  };

  const handleReset = () => {
    // If it's a preset
    if (EXAMPLES[activeExampleId]) {
        setCode(EXAMPLES[activeExampleId].code);
    } else {
        const problem = problems.find(p => p.uuid === activeExampleId);
        if (problem) {
            let starter = '// Write your code here';
            if (problem.starterCode) {
              if (typeof problem.starterCode === 'string') {
                try {
                  const parsed = JSON.parse(problem.starterCode);
                  starter = parsed.javascript || starter;
                } catch(e) {}
              } else {
                starter = problem.starterCode.javascript || starter;
              }
            }
            setCode(starter);
        } else {
            // If it's a saved snippet, reset to its saved state
            const snippet = savedSnippets.find(s => s.id === activeExampleId);
            if (snippet) {
                setCode(snippet.code);
            }
        }
    }
    
    setOutput(['// Compiled in 12ms.', '// All tests passed.']);
    setStatus('idle');
    if (monacoRef.current && editorRef.current) {
        monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), 'owner', []);
    }
  };

  const handleClearTerminal = () => {
    setOutput(['// Console cleared']);
    setStatus('idle');
  };

  const handleExampleChange = (key: string) => {
    setActiveExampleId(key);
    
    if (EXAMPLES[key]) {
        setCode(EXAMPLES[key].code);
    } else {
        const problem = problems.find(p => p.uuid === key);
        if (problem) {
            let starter = '// Write your code here';
            if (problem.starterCode) {
              if (typeof problem.starterCode === 'string') {
                try {
                  const parsed = JSON.parse(problem.starterCode);
                  starter = parsed.javascript || starter;
                } catch(e) {}
              } else {
                starter = problem.starterCode.javascript || starter;
              }
            }
            setCode(starter);
        } else {
            const snippet = savedSnippets.find(s => s.id === key);
            if (snippet) {
                setCode(snippet.code);
            }
        }
    }

    setOutput(['// Ready to execute...']);
    setStatus('idle');
    setIsDropdownOpen(false);
    if (monacoRef.current && editorRef.current) {
        monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), 'owner', []);
    }
  };

  const handleSaveSnippet = () => {
    setSnippetName("My Snippet");
    setIsSaveModalOpen(true);
  };

  const confirmSaveSnippet = () => {
    if (!snippetName.trim()) return;

    const newSnippet: SavedSnippet = {
        id: `custom-${Date.now()}`,
        name: snippetName.trim(),
        code,
        lang: 'javascript'
    };

    const updated = [...savedSnippets, newSnippet];
    setSavedSnippets(updated);
    localStorage.setItem('codesprint_snippets', JSON.stringify(updated));
    setActiveExampleId(newSnippet.id);
    setIsSaveModalOpen(false);
  };

  const handleDeleteSnippet = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setDeleteSnippetId(id);
  };

  const confirmDeleteSnippet = () => {
      if (!deleteSnippetId) return;
      
      const updated = savedSnippets.filter(s => s.id !== deleteSnippetId);
      setSavedSnippets(updated);
      localStorage.setItem('codesprint_snippets', JSON.stringify(updated));

      if (activeExampleId === deleteSnippetId) {
          handleExampleChange('binarySearch');
      }
      setDeleteSnippetId(null);
  };

  const getActiveName = () => {
      if (EXAMPLES[activeExampleId]) return EXAMPLES[activeExampleId].name;
      const problem = problems.find(p => p.uuid === activeExampleId);
      if (problem) return problem.title;
      const snippet = savedSnippets.find(s => s.id === activeExampleId);
      return snippet ? snippet.name : 'Unknown';
  };

  const getActiveThemeName = () => {
      return THEMES.find(t => t.id === activeTheme)?.name || 'Theme';
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Run: Ctrl + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning) executeCode();
      }
      
      // Reset: Ctrl + R
      if ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        handleReset();
      }

      // Save: Ctrl + S
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSaveSnippet();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, activeExampleId, savedSnippets, isRunning]);

  return (
    <section className="py-24 relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-green/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-brand-green font-mono text-sm font-semibold tracking-wider uppercase mb-3 block">
                        Interactive Sandbox
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold dark:text-white text-zinc-900 mb-6">
                        Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-300">speed.</span>
                    </h2>
                    <p className="dark:text-gray-400 text-zinc-500 max-w-2xl mx-auto">
                        Test our execution engine powered by the Monaco Editor. Real-time syntax highlighting, VIM keybindings, and near-instant output.
                    </p>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-5 gap-0 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-[#0F0F11] backdrop-blur-sm h-[600px] lg:h-[500px]">
                
                {/* Editor Section */}
                <div className="lg:col-span-3 flex flex-col border-r border-gray-200 dark:border-white/10 h-full relative group">
                    {/* Editor Toolbar */}
                    <div className="bg-gray-50 dark:bg-[#18181B] p-3 flex items-center justify-between border-b border-gray-200 dark:border-white/5 z-20 relative">
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
                             <div className="flex gap-1.5 hidden sm:flex shrink-0">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            
                            {/* Example Selector */}
                            <div className="relative shrink-0">
                                <button 
                                    onClick={() => {
                                        setIsDropdownOpen(!isDropdownOpen);
                                        setIsThemeDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 px-3 py-1.5 rounded transition-colors border border-gray-300 dark:border-white/5"
                                >
                                    <Code2 size={12} className="text-blue-400" />
                                    <span className="max-w-[100px] sm:max-w-[150px] truncate">{getActiveName()}</span>
                                    <ChevronDown size={12} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#1F1F22] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
                                        >
                                            <div className="px-3 py-2 text-[10px] uppercase text-gray-500 font-bold tracking-wider">Examples</div>
                                            {Object.entries(EXAMPLES).map(([key, example]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => handleExampleChange(key)}
                                                    className={`w-full text-left px-4 py-2 text-xs font-mono hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between group ${
                                                        activeExampleId === key ? 'text-brand-green bg-brand-green/5' : 'text-gray-600 dark:text-gray-400'
                                                    }`}
                                                >
                                                    {example.name}
                                                </button>
                                            ))}
                                            
                                            {problems.length > 0 && (
                                                <>
                                                    <div className="border-t border-white/10 my-1" />
                                                    <div className="px-3 py-2 text-[10px] uppercase text-gray-500 font-bold tracking-wider">Coding Problems</div>
                                                    {problems.map((problem) => (
                                                        <button
                                                            key={problem.uuid}
                                                            onClick={() => handleExampleChange(problem.uuid)}
                                                            className={`w-full text-left px-4 py-2 text-xs font-mono hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between group ${
                                                                activeExampleId === problem.uuid ? 'text-brand-green bg-brand-green/5' : 'text-gray-600 dark:text-gray-400'
                                                            }`}
                                                        >
                                                            {problem.title}
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                            
                                            {savedSnippets.length > 0 && (
                                                <>
                                                    <div className="border-t border-white/10 my-1" />
                                                    <div className="px-3 py-2 text-[10px] uppercase text-gray-500 font-bold tracking-wider">My Snippets</div>
                                                    {savedSnippets.map((snippet) => (
                                                        <div 
                                                            key={snippet.id} 
                                                            className={`w-full flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors group ${
                                                                activeExampleId === snippet.id ? 'bg-brand-green/5' : ''
                                                            }`}
                                                        >
                                                            <button
                                                                onClick={() => handleExampleChange(snippet.id)}
                                                                className={`text-left text-xs font-mono truncate flex-1 ${
                                                                    activeExampleId === snippet.id ? 'text-brand-green' : 'text-gray-400'
                                                                }`}
                                                            >
                                                                {snippet.name}
                                                            </button>
                                                            <button 
                                                                onClick={(e) => handleDeleteSnippet(e, snippet.id)}
                                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-400 transition-all"
                                                                title="Delete snippet"
                                                            >
                                                                <Trash2 size={10} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Theme Selector */}
                            <div className="relative shrink-0">
                                <button 
                                    onClick={() => {
                                        setIsThemeDropdownOpen(!isThemeDropdownOpen);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 px-3 py-1.5 rounded transition-colors border border-gray-300 dark:border-white/5"
                                    title="Select Theme"
                                >
                                    <Palette size={12} className="text-purple-400" />
                                    <span className="hidden sm:inline">{getActiveThemeName()}</span>
                                    <ChevronDown size={12} className={`transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                <AnimatePresence>
                                    {isThemeDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-[#1F1F22] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
                                        >
                                            <div className="px-3 py-2 text-[10px] uppercase text-gray-500 font-bold tracking-wider">Editor Theme</div>
                                            {THEMES.map((theme) => (
                                                <button
                                                    key={theme.id}
                                                    onClick={() => {
                                                        setActiveTheme(theme.id);
                                                        setIsThemeDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-xs font-mono hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between ${
                                                        activeTheme === theme.id ? 'text-purple-500 dark:text-purple-400 bg-purple-500/10' : 'text-gray-600 dark:text-gray-400'
                                                    }`}
                                                >
                                                    {theme.name}
                                                    {activeTheme === theme.id && <CheckCircle2 size={12} />}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                             <button 
                                onClick={handleSaveSnippet}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                                title="Save Snippet (Ctrl + S)"
                             >
                                 <Save size={14} />
                             </button>
                             <button 
                                onClick={handleReset}
                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                                title="Reset Code (Ctrl + R)"
                             >
                                 <RotateCcw size={14} />
                             </button>
                             <button 
                                onClick={executeCode}
                                disabled={isRunning}
                                title="Run Code (Ctrl + Enter)"
                                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${
                                    isRunning 
                                        ? 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        : 'bg-brand-green text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                }`}
                             >
                                 {isRunning ? <Skeleton className="w-[12px] h-[12px] rounded-full" /> : <Play size={12} fill="currentColor" />}
                                 {isRunning ? 'Run' : 'Run Code'}
                             </button>
                        </div>
                    </div>
                    
                    {/* Monaco Editor Wrapper */}
                    <div 
                        className="flex-1 relative overflow-hidden transition-colors duration-300" 
                        style={{ backgroundColor: THEME_BG_COLORS[activeTheme] }}
                    >
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            onMount={handleEditorDidMount}
                            theme={activeTheme}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                fontFamily: 'Fira Code',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 16 },
                                tabSize: 2,
                                renderLineHighlight: 'all',
                                lineNumbers: 'on',
                                glyphMargin: false,
                                folding: true,
                                bracketPairColorization: { enabled: true },
                                guides: { bracketPairs: true, indentation: true },
                                smoothScrolling: true,
                                cursorBlinking: 'smooth',
                                cursorSmoothCaretAnimation: 'on'
                            }}
                        />
                    </div>
                </div>

                {/* Terminal/Output Section */}
                <div 
                    className={`lg:col-span-2 bg-gray-100 dark:bg-[#0c0c0e] flex flex-col h-full border-t lg:border-t-0 relative group transition-all duration-500 ${
                        status === 'success' ? 'shadow-[inset_0_0_50px_rgba(16,185,129,0.05)]' : 
                        status === 'error' ? 'shadow-[inset_0_0_50px_rgba(239,68,68,0.05)]' : ''
                    }`}
                >
                     {/* Indeterminate Loading Bar */}
                     <AnimatePresence>
                        {isRunning && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-0 left-0 w-full h-0.5 bg-transparent z-30 overflow-hidden"
                            >
                                <motion.div 
                                    className="h-full bg-brand-green shadow-[0_0_8px_#10B981]"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                />
                            </motion.div>
                        )}
                     </AnimatePresence>

                     <div className="bg-gray-50 dark:bg-[#121214] p-3 flex items-center justify-between border-b border-gray-200 dark:border-white/5 z-10 relative">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-gray-500 dark:text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider">Console</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={handleClearTerminal}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                title="Clear Console"
                             >
                                 <Trash2 size={12} />
                             </button>
                             <AnimatePresence mode="wait">
                                {status === 'success' && (
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-[10px] text-brand-green font-bold px-2 py-0.5 bg-brand-green/10 rounded flex items-center gap-1 border border-brand-green/20"
                                    >
                                        <CheckCircle2 size={10} />
                                        SUCCESS
                                    </motion.span>
                                )}
                                {status === 'error' && (
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-[10px] text-red-400 font-bold px-2 py-0.5 bg-red-400/10 rounded flex items-center gap-1 border border-red-400/20"
                                    >
                                        <AlertCircle size={10} />
                                        ERROR
                                    </motion.span>
                                )}
                             </AnimatePresence>
                        </div>
                     </div>
                     
                     <div 
                        ref={terminalRef}
                        className="flex-1 font-mono text-sm overflow-y-auto scroll-smooth bg-gray-100 dark:bg-[#0c0c0e] relative"
                     >
                        {output.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-700 opacity-50 p-4">
                                <Terminal size={24} className="mb-2" />
                                <span className="text-xs">No output</span>
                            </div>
                        ) : (
                            <div className="p-4 pt-2">
                                {output.map((line, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-3 py-2 border-b border-gray-200 dark:border-white/5 last:border-0 hover:bg-gray-200 dark:hover:bg-white/5 -mx-4 px-4 transition-colors group/line"
                                    >
                                        <span className="text-gray-400 dark:text-gray-600 select-none shrink-0 w-4 text-right pt-0.5">
                                            {line.startsWith('>') ? '$' : (i + 1)}
                                        </span>
                                        <span className={
                                            line.includes('[Error]') || line.includes('Runtime Error') ? 'text-red-500 dark:text-red-400' :
                                            line.includes('Found') || line.includes('✅') ? 'text-brand-green' :
                                            line.includes('Execution time') ? 'text-brand-green/70 text-xs italic mt-1 block border-t border-gray-300 dark:border-white/5 pt-1 w-full' : 
                                            line.startsWith('>') ? 'text-gray-500 italic' :
                                            'text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed'
                                        }>
                                            {line}
                                        </span>
                                    </motion.div>
                                ))}
                                {isRunning && (
                                     <motion.div 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs py-3 pl-4 border-t border-gray-200 dark:border-white/5 mt-2 bg-gray-200/50 dark:bg-white/[0.02]" 
                                     >
                                        <Skeleton className="w-[12px] h-[12px] rounded-full" />
                                        <span className="font-mono animate-pulse">Running execution...</span>
                                     </motion.div>
                                )}
                            </div>
                        )}
                     </div>
                </div>
             </div>
        </div>

        {/* Modals */}
        <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-[#18181B] border-gray-200 dark:border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Save Snippet</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Give your code snippet a name to save it locally.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input 
                        value={snippetName}
                        onChange={(e) => setSnippetName(e.target.value)}
                        placeholder="My Snippet"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmSaveSnippet();
                        }}
                        autoFocus
                        className="bg-white dark:bg-[#0F0F11] border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus-visible:ring-brand-green"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSaveModalOpen(false)} className="dark:text-white dark:border-white/20 dark:hover:bg-white/10">Cancel</Button>
                    <Button onClick={confirmSaveSnippet} className="bg-brand-green text-black hover:bg-brand-green/90">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={!!deleteSnippetId} onOpenChange={(open) => !open && setDeleteSnippetId(null)}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-[#18181B] border-gray-200 dark:border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Delete Snippet</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this snippet? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setDeleteSnippetId(null)} className="dark:text-white dark:border-white/20 dark:hover:bg-white/10">Cancel</Button>
                    <Button variant="destructive" onClick={confirmDeleteSnippet}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </section>
  );
};

export default LiveDemo;
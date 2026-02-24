import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  const [code, setCode] = useState<string>("// Start coding here...");
  const [language, setLanguage] = useState<string>("javascript");
<<<<<<< HEAD
  const [theme, setTheme] = useState<string>("vs-dark"); // theme toggle
=======
>>>>>>> 9765bc712bb91be9f4c63f32406572739cdae632

  // 🔹 Run Code
  const handleRunCode = () => {
    console.log("Running code...");
    alert("Run triggered!"); // temporary demo
  };

  // 🔹 Save Code
  const handleSaveCode = () => {
    localStorage.setItem("duel-code", code);
    alert("Code saved!");
  };

  // 🔹 Prevent browser default Ctrl + S
  useEffect(() => {
    const preventSave = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventSave);
    return () => window.removeEventListener("keydown", preventSave);
  }, []);

<<<<<<< HEAD
  // 🔹 Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("duel-code", code);
      console.log("Auto-saved code!");
    }, 5000);
    return () => clearInterval(interval);
  }, [code]);

=======
>>>>>>> 9765bc712bb91be9f4c63f32406572739cdae632
  // 🔹 Monaco Shortcuts
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Ctrl + Enter → Run
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
<<<<<<< HEAD
      () => handleRunCode()
=======
      () => {
        handleRunCode();
      }
>>>>>>> 9765bc712bb91be9f4c63f32406572739cdae632
    );

    // Ctrl + S → Save
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
<<<<<<< HEAD
      () => handleSaveCode()
=======
      () => {
        handleSaveCode();
      }
>>>>>>> 9765bc712bb91be9f4c63f32406572739cdae632
    );

    // Ctrl + Shift + F → Format
    editor.addCommand(
      monaco.KeyMod.CtrlCmd |
        monaco.KeyMod.Shift |
        monaco.KeyCode.KeyF,
<<<<<<< HEAD
      () => editor.getAction("editor.action.formatDocument").run()
=======
      () => {
        editor.getAction("editor.action.formatDocument").run();
      }
>>>>>>> 9765bc712bb91be9f4c63f32406572739cdae632
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Live Code Duel</h2>

      {/* 🔹 Shortcut Info */}
      <div style={{ fontSize: "14px", color: "gray", marginBottom: "8px" }}>
        Shortcuts: Ctrl+Enter (Run) | Ctrl+S (Save) | Ctrl+Shift+F (Format)
      </div>

<<<<<<< HEAD
      {/* 🔹 Controls: Reset + Theme */}
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => setCode("// Start coding here...")}
          style={{ marginRight: "10px" }}
        >
          Reset
        </button>
        <button
          onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
        >
          Toggle Theme
        </button>
      </div>

      {/* 🔹 Language Selector */}
=======
>>>>>>> 9765bc712bb91be9f4c63f32406572739cdae632
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
      </select>

<<<<<<< HEAD
      {/* 🔹 Monaco Editor */}
=======
>>>>>>> 9765bc712bb91be9f4c63f32406572739cdae632
      <div style={{ marginTop: "10px" }}>
        <Editor
          height="500px"
          language={language}
          value={code}
<<<<<<< HEAD
          theme={theme}
=======
          theme="vs-dark"
>>>>>>> 9765bc712bb91be9f4c63f32406572739cdae632
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
}
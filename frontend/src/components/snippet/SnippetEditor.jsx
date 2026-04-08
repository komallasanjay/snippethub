import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { monochromeSetup } from './monochromeTheme';

export const SnippetEditor = ({ value, onChange, editable = true, language = 'javascript' }) => {
  const extensions = [javascript({ jsx: true }), monochromeSetup];

  return (
    <div className="border rounded-md overflow-hidden bg-card">
      <CodeMirror
        value={value}
        height="400px"
        extensions={extensions}
        onChange={onChange}
        readOnly={!editable}
        theme="dark"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
};

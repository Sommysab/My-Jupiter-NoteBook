import './text-editor.css';
import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
  cell: Cell;
} 

const default_content = `
**My Jupiter NoteBook**
----------

This is an interactive coding environment. You can write Javascript, see it executed, and write comprehensive documentation using the markdown.

- Click any text cell (including this one) to edit it.

- The code in each code editor is all joined together into one file. If you define a vairable in cell #1, you can refer to it in any following cell!

- You can show any React component, string, number or anything else by calling the **exec** function. This is a function built into this environment. Call **exec** multiple times to show multiple values

- Re-order or delete cells using the buttons on the top right

- Add new cells by hovering on the divider between each cell


`

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();

  useEffect(() => {
    const mouseEventTracker = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }

      setEditing(false);
    };

    document.addEventListener('click', mouseEventTracker, { capture: true });

    return () => {
      document.removeEventListener('click', mouseEventTracker, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor
          value={cell.content}
          onChange={(v) => updateCell(cell.id, v || '')}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditing(true)}>
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || default_content} />
      </div>
    </div>
  );
};

export default TextEditor;

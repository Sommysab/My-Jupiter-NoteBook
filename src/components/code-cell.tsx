import './code-cell.css';
import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useCumulativeCode } from '../hooks/use-cumulative-code';

interface CodeCellProps {
  cell: Cell;
}

const default_content = `
  import React from 'react';

  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return (
      <div>
        <button onClick={() => setCount(count + 1)}>Click</button>
        <h3>Count: {count}</h3>
      </div>
    )      
  }

  // Display any variable or React Component by calling 'exec'
  exec(<Counter />);
`;

const CodeCell: React.FC<CodeCellProps> = ({ cell}) => {
  const { updateCell, createBundle, defaultSet } = useActions();
  const [bundle, default_set] = useTypedSelector((state) => [state.bundles[cell.id], state.cells.default_set]);
  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => { 

    if(!cell.content && !default_set){ 
      updateCell(cell.id, default_content);
      defaultSet();
    }
    
    if (!bundle) {      
      createBundle(cell.id, cumulativeCode); 
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 750);

    return () => {
      clearTimeout(timer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [cumulativeCode, cell.id, createBundle]);

  
  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >        
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          { bundle && !bundle.loading && <Preview code={bundle.code} err={bundle.err} /> }
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;

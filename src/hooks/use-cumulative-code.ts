import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => { 

  return useTypedSelector( ({cells: { data, order }}) => { 

    const orderedCells = order.map((id) => data[id]); 

    const showFunc = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';

    const exec = value => {        
      const root = document.querySelector('#root'); 
      if(typeof value === 'object') {
        if(value.$$typeof && value.props) _ReactDOM.render(value, root);
        else root.innerHTML += JSON.stringify(value) +'<br />';         
      } else 
        root.innerHTML += value +'<br />'; 
    };    
    `; 
    const showFuncNoop = 'var exec = () => {}';
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        (c.id === cellId)
          ? cumulativeCode.push(showFunc)
          : cumulativeCode.push(showFuncNoop);

        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) break;
    }
    
    return cumulativeCode; 

  }).join('\n');
};

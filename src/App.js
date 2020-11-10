import './App.css';
import React from "react";


function cellRule(parentSlice) {
    if (parentSlice[0] && parentSlice[1] && parentSlice[2]) {
      return false;
    } else if (parentSlice[0] && parentSlice[1] && !parentSlice[2]) {
      return true;
    } else if (parentSlice[0] && !parentSlice[1] && parentSlice[2]) {
      return false;
    } else if (parentSlice[0] && !parentSlice[1] && !parentSlice[2]) {
      return true;
    } else if (!parentSlice[0] && parentSlice[1] && parentSlice[2]) {
      return true;
    } else if (!parentSlice[0] && parentSlice[1] && !parentSlice[2]) {
      return false;
    } else if (!parentSlice[0] && !parentSlice[1] && parentSlice[2]) {
      return true;
    } else if (!parentSlice[0] && !parentSlice[1] && !parentSlice[2]) {
      return false;
    }
}

function calculateCellStates(state) {
  const limit = 101;
  let states = [state];
  let curry = (state) => {
    if (states.length === limit) {
      return states;
    } else {
      /*const nextStates = state.map(x => !x);*/
      let nextStates = [];
      for(let i = 0 ; i < state.length; i++) {
        if (i===0) {
          const leftmostSlice = [false, state[0], state[1]];
          nextStates.push(cellRule(leftmostSlice));
        } else if (i===state.length - 1) {
          const rightmostSlice = [state[i-1], state[i], false];
          nextStates.push(cellRule(rightmostSlice));
        } else {
          const slice = state.slice(i-1, i+2);
          nextStates.push(cellRule(slice));
        }
      }
      states.push(nextStates);
      curry(nextStates)
    }
  }
  curry(state);
  return states;
}

function Cell(props) {
  return (
    <div className={`cell ${props.status ? 'on' : 'off'}`}> </div>
  )
}

function Generation(props) {
  return (
    props.cellStates.map( (x, colIndex) => {
        const cellStyle = {
          gridRowStart: props.rowIndex+1,
          rowSpan: 1,
          gridColumnStart: colIndex+1,
          columnSpan: 1
        }
        return <Cell style={cellStyle} status={x} />;
      }
    )
  )
}

function Grid() {
  const halfGeneration = Array(50).fill(false);
  const firstCell = [true];
  const genZero = halfGeneration.concat(firstCell, halfGeneration);
  return (
      <div className="grid">
        {calculateCellStates(genZero).map( (states, genNumber) => {
          return <Generation cellStates={states} rowIndex={genNumber}/>;
        })}
      </div>
  )
}

function App() {
  return (
    <Grid />
  );
}

export default App;

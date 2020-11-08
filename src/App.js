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
  const limit = 50;
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

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.status = props.status;
  }
  render() {
    return (
      <div className={`cell ${this.status ? 'on' : 'off'}`}> </div>
    )
  }
}

class Generation extends React.Component {
  constructor(props) {
    super(props);
    this.cellStates = props.cellStates;
  }
  render() {
    return (
      <div>
        {this.cellStates.map((x) => {
          return <Cell status={x} />;
          }
        )}
      </div>
    );
  }
}

function Grid() {
  const firstRow = [true].concat(Array(49).fill(false));

  return (
      <div className="grid">
        {calculateCellStates(firstRow).map( (states) =>
            <Generation cellStates={states} />
        )}
      </div>
  )
}

function App() {
  return (
    <Grid />
  );
}

export default App;

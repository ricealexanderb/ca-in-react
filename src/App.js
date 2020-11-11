import './App.css';
import React from "react";


class RuleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.changeRule = props.handleChange;
    this.handleChange = this.handleChange.bind(this);
    this.state = {ruleNumber: 30}
  }
  handleChange(event) {
    this.setState({ruleNumber: event.target.value});
    this.changeRule(event.target.value);
  }
  render() {
    return (
      <div className="rule-selector">
        <select value={this.state.ruleNumber} onChange={this.handleChange}>
          <option value="18">18</option>
          <option value="22">22</option>
          <option value="26">26</option>
          <option value="30">30</option>
          <option value="45">45</option>
          <option value="54">54</option>
          <option value="57">57</option>
          <option value="60">60</option>
          <option value="62">62</option>
          <option value="73">73</option>
          <option value="75">75</option>
          <option value="82">82</option>
          <option value="86">86</option>
          <option value="89">89</option>
          <option value="90">90</option>
          <option value="99">99</option>
          <option value="101">101</option>
          <option value="102">102</option>
          <option value="105">105</option>
          <option value="109">109</option>
          <option value="110">110</option>
          <option value="118">118</option>
          <option value="124">124</option>
          <option value="126">126</option>
          <option value="129">129</option>
          <option value="131">131</option>
          <option value="133">133</option>
          <option value="135">135</option>
          <option value="137">137</option>
          <option value="145">145</option>
          <option value="146">146</option>
          <option value="147">147</option>
          <option value="149">149</option>
          <option value="150">150</option>
          <option value="153">153</option>
          <option value="154">154</option>
          <option value="158">158</option>
          <option value="161">161</option>
          <option value="165">165</option>
          <option value="167">167</option>
          <option value="169">169</option>
          <option value="181">181</option>
          <option value="182">182</option>
          <option value="193">193</option>
          <option value="195">195</option>
          <option value="210">210</option>
          <option value="214">214</option>
          <option value="218">218</option>
          <option value="225">225</option>
        </select>
      </div>
    );
  }
}

function bitmaskForBit(index) {
  return 1 << index;
}

function cellRuleFromNumber(ruleNumber, parentSlice) {
  if (parentSlice[0] && parentSlice[1] && parentSlice[2]) {
    return ruleNumber & bitmaskForBit(7);
  } else if (parentSlice[0] && parentSlice[1] && !parentSlice[2]) {
    return ruleNumber & bitmaskForBit(6);
  } else if (parentSlice[0] && !parentSlice[1] && parentSlice[2]) {
    return ruleNumber & bitmaskForBit(5);
  } else if (parentSlice[0] && !parentSlice[1] && !parentSlice[2]) {
    return ruleNumber & bitmaskForBit(4);
  } else if (!parentSlice[0] && parentSlice[1] && parentSlice[2]) {
    return ruleNumber & bitmaskForBit(3);
  } else if (!parentSlice[0] && parentSlice[1] && !parentSlice[2]) {
    return ruleNumber & bitmaskForBit(2);
  } else if (!parentSlice[0] && !parentSlice[1] && parentSlice[2]) {
    return ruleNumber & bitmaskForBit(1);
  } else if (!parentSlice[0] && !parentSlice[1] && !parentSlice[2]) {
    return ruleNumber & bitmaskForBit(0);
  }
}

function calculateCellStates(state, cellRule) {
  /* TODO: rename 'state' because that name is used elsewhere in React */
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

function Grid(props) {
  const halfGeneration = Array(50).fill(false);
  const firstCell = [true];
  const genZero = halfGeneration.concat(firstCell, halfGeneration);
  return (
      <div className="grid">
        {calculateCellStates(genZero, props.cellRule).map( (states, genNumber) => {
          return <Generation cellStates={states} rowIndex={genNumber}/>;
        })}
      </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {cellRule: (parentSlice) => cellRuleFromNumber(30, parentSlice)};
    this.setRule = this.setRule.bind(this);
  }

  setRule(number) {
    this.setState( {cellRule: (parentSlice) => cellRuleFromNumber(number, parentSlice)});
  }

  render() {
    return (
      <div>
        <RuleSelector handleChange={this.setRule}/>
        <Grid cellRule={this.state.cellRule}/>
      </div>
    );
  }
}

export default App;

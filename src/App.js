import React, { Component } from 'react';
import logo from './logo.svg';
import fire from './fire';
import './App.css';

class ScoreForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      score: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleKeypress (e) {
    const characterCode = e.key
    if (characterCode === 'Backspace' || characterCode === 'Delete' 
        || characterCode === 'ArrowLeft' || characterCode === 'ArrowRight') return

    if (e.currentTarget.value.length >= 6) {
      e.preventDefault()
    }

    const characterNumber = Number(characterCode)
    if (characterNumber >= 0 && characterNumber <= 9) {
      if (e.currentTarget.value && e.currentTarget.value.length) {
        return
      } else if (characterNumber === 0) {
        e.preventDefault()
      }
    } else {
      e.preventDefault()
    }
  }
  
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  
  handleSubmit(event) {
    if (this.state.name !== '' && this.state.score !== '') {
      this.props.onNewScore(this.state);
      
      this.setState({
        name: "",
        score: ""
      });
    }
    event.preventDefault();
  }

  render () {
    return (
      <div className="row">
        <form className="row" onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="score">
              Score:
            </label>
            <input
              id="score"
              maxLength="6"
              type="number" 
              value={this.state.score} 
              onKeyDown={this.handleKeypress}
              onChange={this.handleInputChange}
              autoComplete="off"
              placeholder="______"
              name="score" />
          </div>
          <div>
            <label htmlFor="name">
              Name:
            </label>
            <input 
              id="name"
              maxLength="3"
              type="text" 
              value={this.state.name} 
              onChange={this.handleInputChange}
              autoComplete="off"
              placeholder="___"
              name="name" />
          </div>
          <div>
            <input id="submit" type="submit" value="Submit" />
          </div>
        </form>
      </div>
    )
  }
}

class Table extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      'scores': []
    }
  }
  
  componentDidMount () {
    const scoresRef = fire.database().ref('scores');
    scoresRef.on('value', (snapshot) => {
      var data = [];
      snapshot.forEach(ss => {
         data.push(ss.val());
      });
      this.setState({
        'scores': data.sort((a, b) => parseInt(a.score) < parseInt(b.score))
      })
    });
  }
  
  render () {
    
    function rankFormat(index) {
      if (index === 0) {
        return "st"
      }
      else if (index === 1) {
        return 'nd'
      }
      else if (index === 2) {
        return 'rd'
      }
      else {
        return 'th'
      }
    }
    
    const boardRows = this.state.scores
      .map((score, index) =>
        <tr key={index}>
          <td className="td-left">{index+1}{rankFormat(index)}</td>
          <td className="td-middle">{score.score}</td>
          <td className="td-right">{score.name}</td>
        </tr>
      );
    
    return (
      <div className="row">
        <table>
          <tbody>
            <tr>
              <th className="th-left">Rank</th>
              <th className="th-middle">Score</th>
              <th className="th-right">Name</th>
            </tr>
            {boardRows}
          </tbody>
        </table>
      </div>
    )
  }
}


class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'scores': [
        {'name': 'ADP', 'score': 24000},
        {'name': 'WIL', 'score': 30000},
        {'name': 'SAM', 'score': 18000}
      ]
    }
  }
  
  onNewScore(score) {
    const scoresRef = fire.database().ref('scores');
    scoresRef.push(score);
  }
  
  render() {
    return (
      <div>
        <ScoreForm onNewScore={this.onNewScore.bind(this)} />
        <Table scores={this.state.scores} />
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <h4 className="header">High Scores</h4>
        </div>
        <div className="row">
          <Leaderboard />
        </div>
      </div>
    );
  }
}

export default App;

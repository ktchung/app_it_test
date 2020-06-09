import React from 'react';
import logo from './img/logo.png';
import './App.css';

import GameBoard from './GameBoard.js';
import HighScore from './HighScore.js';
import RankToast from './RankToast.js';

import initSqlJs from 'sql.js';
import * as store from 'store';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: undefined,
      db: null,
      dbErr: null,
      showToast: false,
      rank: -1,
    };
  }

  componentDidMount() {
    initSqlJs()
      .then(SQL => this.readDB(SQL))
      .catch(err => this.setState({dbErr: err}));
  }

  readDB(SQL) {
    var dbStored = store.get("db");
    if (dbStored !== undefined) {
      // Database already exists
      console.log("Found database");
      var dataStored = new Uint8Array(Object.keys(dbStored.data).map((key) => dbStored.data[key]));
      // console.log("data stored:", dataStored);
      this.setState({db: new SQL.Database(dataStored)}, () => {
        this.readScoreTable();
      });
    } else {
      // Create new database
      console.log("Creating database");
      this.setState({db: new SQL.Database()}, () => {
        this.state.db.run("CREATE TABLE scores (name char, score int);");
        var bArray = this.state.db.export();
        store.set('db', {'data': bArray});
        // console.log(this.state.db.exec("SELECT * FROM scores ORDER BY score DESC"));
        this.readScoreTable();
      });
    }
  }

  readScoreTable() {
    var results = this.exec("SELECT RANK() OVER (ORDER BY score DESC) rank, name, score FROM scores");
    // console.log(results);
    this.setState({
      data: results[0],
      dbErr: results[1]
    });
  }

  exec(sql) {
    try {
      var results = this.state.db.exec(sql);
      // console.log(results);
      return [results, undefined];
    } catch (e) {
      return [undefined, e];
    }
  }

  render () {
    return (
      <div className="App">
        <div className="logo" onClick={() => {window.location.reload(false)}}>
          <img src={logo} alt="logo"/>
        </div>
        <GameBoard onFinish={this.handleFinished} appRef={this}/>
        <HighScore data={this.state.data} />
        <RankToast show={this.state.showToast} rank={this.state.rank} />
      </div>
    );
  }

  handleFinished(name, score, appRef) {
    // console.log(name, "scored", score);
    appRef.state.db.run("INSERT INTO scores VALUES (:name, :score)", {":name": name, ":score": score});
    var bArray = appRef.state.db.export();
    store.set('db', {'data': bArray});
    appRef.readScoreTable();
    try {
      var results = appRef.state.db.exec("SELECT rank FROM (SELECT RANK() OVER (ORDER BY score DESC) rank, name, score FROM scores) WHERE name=:name AND score=:score", {":name": name, ":score": score});
      // console.log(results[0].values[0][0]);
      appRef.setState({
        showToast: true,
        rank: results[0].values[0][0]
      });
      setTimeout(() => {
        appRef.setState({
          showToast: false
        });
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
}

export default App;
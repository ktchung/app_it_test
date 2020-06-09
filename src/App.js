import React from 'react';
import logo from './img/logo.png';
import './App.css';

import GameBoard from './GameBoard.js';
import HighScore from './HighScore.js';

import initSqlJs from 'sql.js';
import * as store from 'store';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: undefined,
      db: null,
      dbErr: null,
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
    var results = this.exec("SELECT * FROM scores ORDER BY score DESC");
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
      </div>
    );
  }

  handleFinished(name, score, appRef) {
    // console.log(name, "scored", score);
    appRef.state.db.run("INSERT INTO scores VALUES (:name, :score)", {":name": name, ":score": score});
    var bArray = appRef.state.db.export();
    store.set('db', {'data': bArray});
    appRef.readScoreTable();
  }
}

export default App;
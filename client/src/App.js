import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./Home";
import Player from "./Player";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/player/:id">
          <Player />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;

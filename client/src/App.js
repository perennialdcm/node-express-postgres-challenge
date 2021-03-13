import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import TodoList from './TodoList';
import TodoDetails from './TodoDetails';

function App() {
  return (
    <div className="App">
      {/* 
      <p>Display the list of to do tasks here with basic CRUD operations</p> */}
      <h1>Todo App</h1>
      <Router>
        <Switch>
          <Route exact path="/">
            <TodoList/>
          </Route>
          <Route exact path="/todos/:id">
            <TodoDetails/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

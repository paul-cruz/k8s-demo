import './App.css';
import CommentForm from './components/CommentForm';
import CommentsList from './components/CommentsList';
import Reactions from './components/Reactions';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1
        >
          Hello GDSC UNI
        </h1>
        <Reactions />
        <br />
        <CommentForm />
        <br />
        <CommentsList />
      </header>
    </div>
  );
}

export default App;

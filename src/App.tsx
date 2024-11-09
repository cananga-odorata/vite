import './App.css';
import UserProfile from './components/UserProfile';


function App() {
  const randomUserId = Math.floor(Math.random() * 10) + 1;

  return (
    <>
      <UserProfile userId={randomUserId} />
    </>
  );
}

export default App;

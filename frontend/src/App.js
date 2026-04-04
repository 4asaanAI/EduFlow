import './App.css';
import './theme.css';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Layout />
      </UserProvider>
    </ThemeProvider>
  );
}

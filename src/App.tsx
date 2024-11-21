import { useState } from 'react';
import MapComponent from "./components/MapComponent";
import { DarkModeSwitch } from 'react-toggle-dark-mode';

function App() {
  const [isDarkMode, setDarkMode] = useState(false);

  return (
    <div className="">
      <main className="">
        <div className="w-screen h-screen">
          <MapComponent isDarkMode={isDarkMode} />
          <DarkModeSwitch
            className="absolute top-0 right-0 m-2"
            checked={isDarkMode}
            onChange={(checked) => setDarkMode(checked)}
            size={40}
          />
        </div>
      </main>
      <footer className="">
      </footer>
    </div>
  )
}

export default App

import { useState } from 'react';
import MapComponent, { mapStyles } from "./components/MapComponent";
//import { DarkModeSwitch } from 'react-toggle-dark-mode';
import SlideInMenu from './components/SlideInMenu';
import { MapIcon, XMarkIcon } from "@heroicons/react/24/outline";


function App() {
  const [mapStyle, setMapSstyle] = useState("");

  const menuItems = Object.keys(mapStyles).map(styleName => {
    return {
      label: styleName,
      onClick: () => { setMapSstyle(styleName) }
    }
  });

  return (
    <div className="">
      <main className="">
        <div className="w-screen h-screen">
          <MapComponent mapStyle={mapStyle} />
          <SlideInMenu
            menuItems={menuItems}
            openIcon={<MapIcon className='h-6 w-6' />}
            closeIcon={<XMarkIcon className='h-6 w-6' />}
            position='right'
          />
          {/*
          <DarkModeSwitch
            className="absolute top-0 right-0 m-2"
            checked={isDarkMode}
            onChange={(checked) => setDarkMode(checked)}
            size={40}
          />
          */}
        </div>
      </main>
      <footer className="">
      </footer>
    </div>
  )
}

export default App

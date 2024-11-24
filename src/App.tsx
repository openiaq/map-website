import { useState } from 'react';
import MapComponent, { mapStyles } from "./components/MapComponent";
//import { DarkModeSwitch } from 'react-toggle-dark-mode';
import SlideInMenu from './components/SlideInMenu';

import { MapIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { IoMapSharp, IoCloseOutline } from "react-icons/io5";
import { IoRestaurantSharp, IoRestaurantOutline } from "react-icons/io5";
import { IoPricetagsSharp, IoPricetagsOutline } from "react-icons/io5";
import { IoCart, IoCartOutline } from "react-icons/io5";



import ToggleSwitch from './components/ToggleSwitch';



function App() {
  const [mapStyle, setMapSstyle] = useState("");

  const handleToggle = (state: boolean) => {
    console.log(`Toggle state: ${state ? "On" : "Off"}`);
  };

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
            openIcon={<IoMapSharp className='h-6 w-12' />}
            closeIcon={<IoCloseOutline className='h-6 w-6' />}
            position='right'
            topOffset='1rem'
          />
          {/*
          <DarkModeSwitch
            className="absolute top-0 right-0 m-2"
            checked={isDarkMode}
            onChange={(checked) => setDarkMode(checked)}
            size={40}
          />
          */}

          <div className="h-screen flex items-center justify-center bg-gray-100">
            <ToggleSwitch
              initialState={true}
              onToggle={handleToggle}
              onIcon={<IoCart className="w-6 h-8 text-gray-700" />}
              offIcon={<IoCartOutline className="w-6 h-8 text-gray-700" />}
              topOffset='4rem'
            />
            <ToggleSwitch
              initialState={true}
              onToggle={handleToggle}
              onIcon={<IoRestaurantSharp className="w-6 h-8 text-gray-700" />}
              offIcon={<IoRestaurantOutline className="w-6 h-8 text-gray-700" />}
              topOffset='7rem'
            />
            <ToggleSwitch
              initialState={true}
              onToggle={handleToggle}
              onIcon={<IoPricetagsSharp className="w-6 h-8 text-gray-700" />}
              offIcon={<IoPricetagsOutline className="w-6 h-8 text-gray-700" />}
              topOffset='10rem'
            />

          </div>

        </div>
      </main>
      <footer className="">
      </footer>
    </div>
  )
}

export default App

import { useState } from 'react';
import MapComponent, { mapStyles } from "./components/MapComponent";
//import { DarkModeSwitch } from 'react-toggle-dark-mode';
import SlideInMenu from './components/SlideInMenu';

import { MapIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon, MoonIcon } from "@heroicons/react/24/solid";

import { MdLocalGroceryStore, MdOutlineLocalGroceryStore } from "react-icons/md";
import { IoRestaurantSharp, IoRestaurantOutline } from "react-icons/io5";



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
            openIcon={<MapIcon className='h-6 w-6' />}
            closeIcon={<XMarkIcon className='h-6 w-6' />}
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
              onIcon={<MdLocalGroceryStore className="w-6 h-8 text-gray-700" />}
              offIcon={<MdOutlineLocalGroceryStore className="w-6 h-8 text-gray-700" />}
              topOffset='4rem'
            />
            <ToggleSwitch
              initialState={true}
              onToggle={handleToggle}
              onIcon={<IoRestaurantSharp className="w-6 h-8 text-gray-700" />}
              offIcon={<IoRestaurantOutline className="w-6 h-8 text-gray-700" />}
              topOffset='7rem'
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

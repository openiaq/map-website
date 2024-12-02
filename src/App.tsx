import { useState } from 'react';
import MapComponent, { LAYER_NAMES, mapStyles } from "./components/MapComponent";
//import { DarkModeSwitch } from 'react-toggle-dark-mode';
import ToggleSwitch from './components/ToggleSwitch';
import SlideInMenu from './components/SlideInMenu';
import { IoMapSharp, IoCloseOutline } from "react-icons/io5";
import { IoRestaurantSharp, IoRestaurantOutline } from "react-icons/io5";
import { IoPricetagsSharp, IoPricetagsOutline } from "react-icons/io5";
import { IoCart, IoCartOutline } from "react-icons/io5";


export default function App() {
  const [mapStyle, setMapStyle] = useState("");
  const [layerNames, setLayerNames] = useState<string[]>(LAYER_NAMES);

  const handleToggle = (newState: boolean, layerName: string) => {
    // setLayerNames must return new Array, or state change will be ignored
    if (newState) {
      setLayerNames(previous => [...previous, layerName]);
    }
    else {
      setLayerNames(previous => previous.filter(n => n !== layerName));
    }
  };

  const menuItems = Object.keys(mapStyles).map(styleName => {
    return {
      label: styleName,
      onClick: () => { setMapStyle(styleName) }
    }
  });

  return (
    <div className="">
      <main className="">
        <div className="w-screen h-screen">
          <MapComponent
            mapStyle={mapStyle}
            selectedLayerNames={layerNames}
          />
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
              onToggle={newState => handleToggle(newState, LAYER_NAMES[0])}
              onIcon={<IoCart className="w-6 h-8 text-gray-700" />}
              offIcon={<IoCartOutline className="w-6 h-8 text-gray-700" />}
              topOffset='4rem'
            />
            <ToggleSwitch
              initialState={true}
              onToggle={newState => handleToggle(newState, LAYER_NAMES[1])}
              onIcon={<IoRestaurantSharp className="w-6 h-8 text-gray-700" />}
              offIcon={<IoRestaurantOutline className="w-6 h-8 text-gray-700" />}
              topOffset='7rem'
            />
            <ToggleSwitch
              initialState={true}
              onToggle={newState => handleToggle(newState, LAYER_NAMES[2])}
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
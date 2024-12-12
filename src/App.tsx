import { useState } from 'react';
import MapComponent, { LAYER_NAMES, mapStyles } from "./components/MapComponent";
import ToggleSwitch from './components/ToggleSwitch';
import SlideInMenu from './components/SlideInMenu';
import { IoMapSharp, IoCloseOutline } from "react-icons/io5";
import { IoRestaurantSharp, IoRestaurantOutline } from "react-icons/io5";
import { IoPricetagsSharp, IoPricetagsOutline } from "react-icons/io5";
import { IoCart, IoCartOutline } from "react-icons/io5";
import DetailsPanel from './components/DetailsPanel';
import LineChart from './components/LineChart';

import 'maplibre-gl/dist/maplibre-gl.css';

export default function App() {
  const [mapStyle, setMapStyle] = useState("");
  const [layerNames, setLayerNames] = useState<string[]>(LAYER_NAMES);
  const [selectedObject, setSelectedObject] = useState<Record<string, any> | null>(null);

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

  const ICON_STYLE = "w-7 h-7 text-gray-700";
  return (
    <div className="">
      <main className="">
        <MapComponent
          mapStyle={mapStyle}
          selectedLayerNames={layerNames}
          onClick={o => {
            setSelectedObject(o);
          }}
        />
        <SlideInMenu
          menuItems={menuItems}
          openIcon={<IoMapSharp className='h-6 w-12' />}
          closeIcon={<IoCloseOutline className='h-6 w-6' />}
          position='right'
          topOffset='1rem'
        />
        <div className="">
          <ToggleSwitch
            initialState={true}
            onToggle={newState => handleToggle(newState, LAYER_NAMES[0])}
            hoverText={LAYER_NAMES[0].charAt(0).toUpperCase() + LAYER_NAMES[0].slice(1).toLowerCase()}
            onIcon={<IoCart className={ICON_STYLE} />}
            offIcon={<IoCartOutline className={ICON_STYLE} />}
            className="fixed top-20"
          />
          <ToggleSwitch
            initialState={true}
            onToggle={newState => handleToggle(newState, LAYER_NAMES[1])}
            hoverText={LAYER_NAMES[1].charAt(0).toUpperCase() + LAYER_NAMES[1].slice(1).toLowerCase()}
            onIcon={<IoRestaurantSharp className={ICON_STYLE} />}
            offIcon={<IoRestaurantOutline className={ICON_STYLE} />}
            className="fixed top-32"
          />
          <ToggleSwitch
            initialState={true}
            onToggle={newState => handleToggle(newState, LAYER_NAMES[2])}
            hoverText={LAYER_NAMES[2].charAt(0).toUpperCase() + LAYER_NAMES[2].slice(1).toLowerCase()}
            onIcon={<IoPricetagsSharp className={ICON_STYLE} />}
            offIcon={<IoPricetagsOutline className={ICON_STYLE} />}
            className="fixed top-44"
          />
        </div>
        {!!selectedObject &&
          <DetailsPanel
            isOpen={!!selectedObject}
            onClose={() => setSelectedObject(null)}
          >
            <h1 className="text-xl font-bold">{selectedObject?.name ?? "Unnamed"}</h1>
            <LineChart
              data={
                Array.isArray(selectedObject.allMeasurements[0].co2readings) ?
                  selectedObject.allMeasurements[0].co2readings.map((ppm: number, i: number) => {
                    return { x: i, y: ppm };
                  })
                  : []
              }
            />
            <code>{JSON.stringify(selectedObject, null, 4)}</code>
          </DetailsPanel>
        }
      </main>
      <footer className="fixed bg-white opacity-60 rounded-lg bottom-0 right-1 z-40 text-sm">
        &copy; OpenIAQ.org, IndoorCO2Map.com, OpenStreetMap contributors
      </footer>
    </div>
  )
}
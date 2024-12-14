//import { Map, NavigationControl } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
// import { MapView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import 'mapbox-gl/dist/mapbox-gl.css';
import ColorLegend, { colorFromValue } from './ColorLegend';
import { useState } from 'react';
import { TiLocationArrowOutline, TiLocationArrow } from "react-icons/ti";


//const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

export const mapStyles: { [key: string]: string } = {
  /*
  DEFAULT: "mapbox://styles/mapbox/streets-v9",
  MAPBOX_LIGHT: "mapbox://styles/mapbox/light-v9",
  MAPBOX_DARK: "mapbox://styles/mapbox/dark-v9",
  AIRCODA: "mapbox://styles/pwellner/cld2519en001f01s497tr94se",
  */

  CARTO_LIGHT: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // No key required
  CARTO_DARK: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json", // No key required

  MAPTILER_LIGHT: `https://api.maptiler.com/maps/streets-v2-light/style.json?key=${MAPTILER_KEY}`,
  MAPTILER_DARK: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`,
  MAPTILER_OSM: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${MAPTILER_KEY}`,
}

//-----------------------------------------------------------------------------
// Re-organize data from https://indoorco2map.com/chartdata/IndoorCO2MapData.json
// to aggregate measurements from the same venues
function filteredDataTransform(osmKeyRegEx: RegExp) {
  return (data: unknown) => {
    if (!Array.isArray(data)) {
      return [] as any;
    }
    type Measurement = {
      nwrID: string, // Unique venue ID
      osmKey: string, // e.g. shop,amenity,other,tourism,healthcare,leisure
      [key: string]: unknown,
    };
    const arrayData: Measurement[] = data;
    // Aggregate measurements from the same venue
    let venues: {
      [venueId: string]: Measurement[];
    } = {};
    // let osmKeys: Set<string> = new Set<string>();
    arrayData.map(item => {
      const venueMeasurements = venues[item.nwrID] = venues[item.nwrID] || [];
      // if (index === 1) console.log(">>> " + JSON.stringify(item));
      venueMeasurements.push(item);
      // osmKeys.add(item.osmKey);
    });
    // console.log(`>>>>> nVenues=${Object.keys(venues).length}`);
    // console.log(`>>>>> osmKeys=${Array.from(osmKeys)}`);
    return Object.values(venues).map(measurements => {
      return {
        position: [measurements[0].longitude, measurements[0].latitude],
        name: measurements[0].name,
        osmKey: measurements[0].osmKey,
        co2Avg: measurements[0].co2readingsAvg, // TODO: reduce() for avg of avgs
        allMeasurements: measurements
      }
    })
      .filter(d => osmKeyRegEx.test(d.osmKey));
  }
}

// Layer name mapped to rexexp for testing osmKey
const layerSpecs = {
  shops: /shop/,
  amenities: /amenity/,
  other: /^(?!shop$|amenity$).+$/ // Anything except shop or amenity
};
export const LAYER_NAMES = Object.keys(layerSpecs);


//-----------------------------------------------------------------------------
export default function MapComponent(props: {
  mapStyle: string,
  selectedLayerNames?: string[],
  onClick?: (o: Record<string, any>) => void,
}) {
  const [viewState, setViewState] = useState({
    longitude: 8,
    latitude: 50,
    zoom: 4,
  });
  const [isColorBlind, setIsColorBlind] = useState(false);
  const [searchString, setSearchString] = useState("");

  function isFound(d: any): boolean {
    if (!d) {
      return false;
    }
    return d.name.toLowerCase().includes(searchString);
  }

  let layers = Object.entries(layerSpecs).map(([layerName, regEx]) => {
    return new ScatterplotLayer({
      id: layerName,
      data: 'https://indoorco2map.com/chartdata/IndoorCO2MapData.json',
      dataTransform: filteredDataTransform(regEx),
      getFillColor: d => [...colorFromValue(d.co2Avg, isColorBlind), (.75 * 255)],
      getLineColor: [0, 0, 0, 255],
      stroked: true,
      getLineWidth: d => isFound(d) ? 1 : 0,
      lineWidthUnits: 'pixels',
      radiusUnits: 'pixels',
      getRadius: d => isFound(d) ? 7 : 0,
      pickable: true,
      visible: props.selectedLayerNames?.includes(layerName),
      updateTriggers: {
        getFillColor: [isColorBlind],
        getRadius: [searchString],
        getLineWidth: [searchString],
      },
      onClick: o => { props.onClick && props.onClick(o.object); },
    });
  });

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(`>>>>> position=${JSON.stringify(position)}`);
          const { latitude, longitude } = position.coords;
          setViewState((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };


  return (
    <div>
      <button
        className="absolute top-3 left-3 z-10 cursor-pointer"
        onClick={updateLocation}
      >
        <TiLocationArrowOutline className="w-7 h-7 border-gray-800 border-2 border-opacity-60 text-black bg-white opacity-80 rounded-full" />
      </button>

      <DeckGL
        layers={layers}
        initialViewState={viewState}
        controller={{
          scrollZoom: true,      // Allow zooming with the scroll wheel
          dragPan: true,         // Allow panning (XY movement)
          dragRotate: false,     // Disable map rotation
          touchRotate: false     // Disable touch-based rotation
        }}
        getTooltip={({ object: obj }) => obj && `${obj.name}: ${obj.co2Avg}`} // CO₂
        getCursor={({ isHovering, isDragging }) => (isDragging ? 'grabbing' : (isHovering ? 'pointer' : 'grab'))}
        onViewStateChange={(newState) => {
          const vs: any = newState.viewState; // Defeat type checking
          setViewState(
            {
              longitude: vs.longitude,
              latitude: vs.latitude,
              zoom: vs.zoom,
            }
          );
        }}
      >
        <Map
          mapStyle={mapStyles[props.mapStyle] || mapStyles.MAPTILER_OSM}
          // mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          // customAttribution={["&copy; OpenIAQ.org, IndoorCO2Map.com, OpenStreetMap"]}
          attributionControl={false} // Attributions elsewhere
        />
        <div className="text-white bg-gray-800 bg-opacity-60 absolute bottom-5 right-0 p-1 rounded-lg">
          <ColorLegend
            onSchemeSelection={newIsColorBlind => setIsColorBlind(newIsColorBlind)}
          />
        </div>
        <input
          type="text"
          value={searchString}
          onChange={event => setSearchString(event.target.value.toLowerCase())}
          placeholder={searchString || 'Search...'}
          className={"absolute bottom-5 left-1 bg-white border border-gray-800 rounded-lg"}
        />

      </DeckGL>
    </div>
  );
}

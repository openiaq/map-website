//import { Map, NavigationControl } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import 'mapbox-gl/dist/mapbox-gl.css';


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
  CARTO_TEST: "/testStyle.json", // Based on CARTO_LIGHT, with restaurant circles and text
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


function ppmColor(
  colorFromValueFunction: (value: number) => [number, number, number],
  ppm: number,
  alphaFraction: number = 1.0
): [number, number, number, number] {
  const alpha = Math.round(255 * alphaFraction);
  const rgbArray = colorFromValueFunction(ppm);
  return [...rgbArray, alpha];
};


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
  colorFromValueFunction: (v: number) => [number, number, number]; // rgb
  selectedLayerNames?: string[],
}) {

  let layers = Object.entries(layerSpecs).map(([name, regEx]) => {
    return new ScatterplotLayer({
      id: name,
      data: 'https://indoorco2map.com/chartdata/IndoorCO2MapData.json',
      dataTransform: filteredDataTransform(regEx),
      getFillColor: d => ppmColor(props.colorFromValueFunction, d.co2Avg, .75),
      getLineColor: [0, 0, 0, 255],
      stroked: true,
      getLineWidth: 1,
      lineWidthUnits: 'pixels',
      radiusUnits: 'pixels',
      getRadius: 7,
      pickable: true,
      visible: props.selectedLayerNames?.includes(name)
    });
  });

  return (
    <DeckGL
      layers={layers}
      views={new MapView()}
      initialViewState={{
        longitude: 0.45,
        latitude: 51.47,
        zoom: 5
      }}
      controller={{
        scrollZoom: true,      // Allow zooming with the scroll wheel
        dragPan: true,         // Allow panning (XY movement)
        dragRotate: false,     // Disable map rotation
        touchRotate: false     // Disable touch-based rotation
      }}
      getTooltip={({ object: obj }) => obj && `${obj.name}: ${obj.co2Avg}`} // CO\u2082 

    >
      <Map
        // mapStyle={props.isDarkMode ? mapStyles.CARTO_DARK : mapStyles.CARTO_LIGHT}
        // mapStyle={props.isDarkMode ? mapStyles.MAPTILER_DARK : mapStyles.MAPTILER_LIGHT}
        mapStyle={mapStyles[props.mapStyle] || mapStyles.MAPTILER_OSM}
      // mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      />
    </DeckGL>
  );
}

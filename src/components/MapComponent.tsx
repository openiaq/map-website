//import { Map, NavigationControl } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { GeoBoundingBox, TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, ScatterplotLayer } from '@deck.gl/layers';
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
  CARTO_DARK: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json", // No key required

  MAPTILER_LIGHT: `https://api.maptiler.com/maps/streets-v2-light/style.json?key=${MAPTILER_KEY}`,
  MAPTILER_DARK: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`,
  MAPTILER_OSM: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${MAPTILER_KEY}`,
}

//-----------------------------------------------------------------------------
// Re-organize data from https://indoorco2map.com/chartdata/IndoorCO2MapData.json
// to aggregate measurements from the same venues
/*
function dataTransform2(data: unknown) {
  if (!Array.isArray(data)) {
    return [] as any;
  }
  type Measurement = {
    nwrID: string, // Unique venue ID
    [key: string]: unknown,
  };
  const arrayData: Measurement[] = data;
  // Aggregate measurements from the same venue
  let venues: {
    [venueId: string]: Measurement[];
  } = {};
  arrayData.map(item => {
    const venueMeasurements = venues[item.nwrID] = venues[item.nwrID] || [];
    venueMeasurements.push(item);
  });
  // console.log(`>>>>> nVenues=${Object.keys(venues).length}`);
  return Object.values(venues).map(measurements => {
    return {
      position: [measurements[0].longitude, measurements[0].latitude],
      name: measurements[0].name,
      co2Avg: measurements[0].co2readingsAvg, // TODO: reduce() for avg of avgs
      allMeasurements: measurements
    }
  });
}*/

function dataTransform2(data: unknown) {
  if (!Array.isArray(data)) {
    return [];
  }

  type Measurement = {
    nwrID: string;
    longitude: number;
    latitude: number;
    name: string;
    co2readingsAvg: number;
    [key: string]: unknown;
  };

  const arrayData: Measurement[] = data;
  const venues: { [venueId: string]: Measurement[] } = {};

  arrayData.forEach((item) => {
    const venueMeasurements = (venues[item.nwrID] = venues[item.nwrID] || []);
    venueMeasurements.push(item);
  });

  function randomPointAround(lat: number, lon: number, radiusKm: number) {
    const radiusInDegrees = radiusKm / 111; // Approximation for degrees per km
    const u = Math.random();
    const v = Math.random();
    const w = radiusInDegrees * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    const newLat = lat + y;
    const newLon = lon + x / Math.cos((lat * Math.PI) / 180);
    return [newLon, newLat];
  }

  const expandedData = Object.values(venues).flatMap((measurements) => {
    const { longitude, latitude, name, co2readingsAvg } = measurements[0];
    const points = Array.from({ length: 20 }, () => {
      const [newLon, newLat] = randomPointAround(latitude, longitude, 100);
      return {
        position: [newLon, newLat],
        name: `${name} (Randomized)`,
        co2Avg: co2readingsAvg,
        allMeasurements: measurements,
      };
    });

    // Include the original point as well
    points.push({
      position: [longitude, latitude],
      name,
      co2Avg: co2readingsAvg,
      allMeasurements: measurements,
    });

    return points;
  });

  return expandedData;
}

function ppmColor(ppm: number, alphaFraction: number = 1.0): [number, number, number, number] {
  const alpha = Math.round(255 * alphaFraction);
  return ppm < 600 ? [44,123,182, alpha] :
  ppm < 800 ? [171,217,233, alpha] :
    ppm < 1000 ? [255,255,191, alpha] :
      ppm < 1200 ? [253,174,97, alpha] :
        [215, 25, 28, alpha];
}

//-----------------------------------------------------------------------------
export default function MapComponent(props: { mapStyle: string }) {
  /*
   To use OSM, remove <Map> component below and use this as first element
   of the DeckGL layers prop
  */
  const osmTileLayer = new TileLayer<ImageBitmap>({
    // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
    data: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    // Since these OSM tiles support HTTP/2, we can make many concurrent requests
    // and we aren't limited by the browser to a certain number per domain.
    maxRequests: 20,
    pickable: true,
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: devicePixelRatio === 1 ? -1 : 0,
    renderSubLayers: (props: any) => {
      const { west, north, east, south } = props.tile.bbox as GeoBoundingBox;
      return [
        new BitmapLayer(props, {
          data: undefined,
          image: props.data,
          bounds: [west, south, east, north]
        }),
      ];
    },
  });

  const scatterPlotLayer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: 'https://indoorco2map.com/chartdata/IndoorCO2MapData.json',
    dataTransform: dataTransform2,
    getFillColor: d => ppmColor(d.co2Avg, .70),
    stroked: true,
    getLineColor: [253,174,97, 255],
    getLineWidth: 1,
    lineWidthUnits: 'pixels',
    radiusUnits: 'pixels',
    getRadius: 10,
    pickable: true
  });

  return (
    <DeckGL
      layers={[scatterPlotLayer]}
      views={new MapView()}
      initialViewState={{
        longitude: 0.45,
        latitude: 51.47,
        zoom: 5
      }}
      controller={true}
      getTooltip={({ object: obj }) => obj && `${obj.name}: ${obj.co2Avg}`} // CO\u2082 

    >
      <Map
        //  mapStyle={props.isDarkMode ? mapStyles.CARTO_DARK : mapStyles.CARTO_LIGHT}
        //mapStyle={props.isDarkMode ? mapStyles.MAPTILER_DARK : mapStyles.MAPTILER_LIGHT}
        mapStyle={mapStyles[props.mapStyle] || mapStyles.MAPTILER_OSM}
        //mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      />
    </DeckGL>
  );
}

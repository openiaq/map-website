import { Map, NavigationControl } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import 'maplibre-gl/dist/maplibre-gl.css';



//const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const mapStyles = {
  DEFAULT: "mapbox://styles/mapbox/streets-v9",
  MAPBOX_LIGHT: "mapbox://styles/mapbox/light-v9",
  MAPBOX_DARK: "mapbox://styles/mapbox/dark-v9",
  CARTO_LIGHT: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  CARTO_DARK: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  AIRCODA: "mapbox://styles/pwellner/cld2519en001f01s497tr94se",
}


//-----------------------------------------------------------------------------
export default function MapComponent() {

  const layers = [
    new ScatterplotLayer({
      id: 'deckgl-circle',
      data: "/data.json",
      /*
      [
        { position: [0.45, 51.47] } // longitude, latitude
      ],
      */
      getPosition: d => d.position,
      getFillColor: d => { return d.co2Avg < 1000 ? [0, 255, 0, 100] : [255, 0, 0, 100] },
      radiusUnits: 'pixels',
      getRadius: 6,
    })
  ];

  return (
    <DeckGL
      initialViewState={{
        longitude: 0.45,
        latitude: 51.47,
        zoom: 5
      }}
      controller
      layers={layers}
    >
      <Map
        mapStyle={mapStyles.CARTO_LIGHT}
      //mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        <NavigationControl position="top-left" showCompass={false} />
      </Map>
    </DeckGL>
  );
}

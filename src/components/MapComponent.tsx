import { Map, NavigationControl, ViewState } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';

import 'mapbox-gl/dist/mapbox-gl.css';


const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

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
      data: [
        { position: [0.45, 51.47] }
      ],
      getPosition: d => d.position,
      getFillColor: [255, 0, 0, 50],
      getRadius: 1000,
      beforeId: 'waterway-label' // In interleaved mode render the layer under map labels
    })
  ];

  return (
    <DeckGL
      initialViewState={{
        longitude: 0.45,
        latitude: 51.47,
        zoom: 11
      }}
      controller
      layers={layers}
      style={{ width: '100%', height: '100vh' }}
    >
      <Map
        mapStyle={mapStyles.MAPBOX_DARK}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        <NavigationControl position="top-left" showCompass={false} />
      </Map>
    </DeckGL>
  );
}

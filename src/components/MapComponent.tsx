import { Map, useControl, NavigationControl } from 'react-map-gl';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { DeckProps } from '@deck.gl/core';
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

/*
function handleMove(evt: { viewState: ViewState }) {
  console.log(`>>>>> viewState=${JSON.stringify(evt.viewState)}`);
};
*/


// From example https://deck.gl/docs/developer-guide/base-maps/using-with-mapbox
function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
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
    <Map
      initialViewState={{
        longitude: 0.45,
        latitude: 51.47,
        zoom: 11
      }}
      //onMove={handleMove}
      style={{ width: '100%', height: '100vh' }}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapStyle={mapStyles.MAPBOX_DARK}
    >
      <DeckGLOverlay layers={layers} interleaved={true}/>
      <NavigationControl position="top-left" showCompass={false} />

    </Map>
  );
}


"use client" 
import * as React from 'react';
import Map, { NavigationControl, ViewState } from 'react-map-gl';


const handleMove = (evt: { viewState: ViewState }) => {
  console.log(`>>>>> viewState=${JSON.stringify(evt.viewState)}`);
};

export default function MapComponent() {
  return (
    <Map
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3.5
      }}
      onMove={handleMove}
      style={{ width: '100%', height: '100vh' }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v9"

    >
      <NavigationControl position="top-left" />
    </Map>
  );
}

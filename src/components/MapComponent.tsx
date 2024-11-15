
import Map, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const mapStyles = {
  DEFAULT: "mapbox://styles/mapbox/streets-v9",
  CARTO_LIGHT: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  CARTO_DARK: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  AIRCODA: "mapbox://styles/pwellner/cld2519en001f01s497tr94se",
}

/*
function handleMove(evt: { viewState: ViewState }) {
  console.log(`>>>>> viewState=${JSON.stringify(evt.viewState)}`);
};
*/

export default function MapComponent() {
  return (
    <Map
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3.5
      }}
      //onMove={handleMove}
      style={{ width: '100%', height: '100vh' }}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      mapStyle={mapStyles.CARTO_LIGHT}
    >
      <NavigationControl position="top-left" />
    </Map>
  );
}

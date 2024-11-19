//import { Map, NavigationControl } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { GeoBoundingBox, TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer, ScatterplotLayer } from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';


/*
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const mapStyles = {
  DEFAULT: "mapbox://styles/mapbox/streets-v9",
  MAPBOX_LIGHT: "mapbox://styles/mapbox/light-v9",
  MAPBOX_DARK: "mapbox://styles/mapbox/dark-v9",
  CARTO_LIGHT: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  CARTO_DARK: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  AIRCODA: "mapbox://styles/pwellner/cld2519en001f01s497tr94se",
}
*/

//-----------------------------------------------------------------------------
export default function MapComponent() {

  const tileLayer = new TileLayer<ImageBitmap>({
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

  type Measurement = {
    nwrID: string,
    [key: string]: unknown,
  };
  type VenueMeasurements = {
    [venueId: string]: Measurement[]; // Keys are strings, values are arrays of numbers
  };

  const layers = [
    tileLayer,
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: 'https://indoorco2map.com/chartdata/IndoorCO2MapData.json',
      dataTransform: (data) => {
        if (!Array.isArray(data)) {
          return [] as any;
        }
        const arrayData: Measurement[] = data;
        let venues: VenueMeasurements = {};
        arrayData.map(item => {
          const venueMeasurements = venues[item.nwrID] = venues[item.nwrID] || [];
          venueMeasurements.push(item);
        });

        const nVenues = Object.keys(venues).length;
        console.log(">>>>> nVenues=" + nVenues);
        return Object.values(venues).map(measurements => {
          return {
            position: [measurements[0].longitude, measurements[0].latitude],
            name: measurements[0].name,
            co2Avg: measurements[0].co2readingsAvg, // TODO: reduce() for avg of avgs
            allMeasurements: measurements
          }
        });
      },
      getPosition: d => d.position,
      getFillColor: d => {
        return d.co2Avg < 600 ? [0, 0, 255, 100] :
          d.co2Avg < 1000 ? [255, 255, 0, 100] :
            d.co2Avg < 1200 ? [255, 165, 0, 100] :
              [255, 0, 0, 100]
      },
      radiusUnits: 'pixels',
      getRadius: 6,
      pickable: true
    })
  ];

  return (
    <DeckGL
      layers={layers}
      views={new MapView({ repeat: true })}
      initialViewState={{
        longitude: 0.45,
        latitude: 51.47,
        zoom: 5
      }}
      controller={true}
      getTooltip={({ object: obj }) => obj && `${obj.name}: ${obj.co2Avg}`} // CO\u2082 

    >
      {/*
      <Map
        mapStyle={mapStyles.MAPBOX_DARK}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        <NavigationControl position="top-left" showCompass={false} />
      </Map>
      */}
    </DeckGL>
  );
}

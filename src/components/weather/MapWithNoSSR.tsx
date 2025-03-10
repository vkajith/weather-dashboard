import L from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { MAP_MARKERS, MAP_TILES } from '@/constant/api';

import { City } from '@/types/weather';

// Fix for Leaflet marker icons in Next.js
// This is needed because Leaflet's default icon paths are relative to the HTML file
const defaultIcon = L.icon({
  iconUrl: MAP_MARKERS.DEFAULT_ICON,
  shadowUrl: MAP_MARKERS.DEFAULT_SHADOW,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Component to update the map view when coordinates change
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);
  return null;
}

interface MapWithNoSSRProps {
  city: City;
}

const MapWithNoSSR = ({ city }: MapWithNoSSRProps) => {
  const [mapReady, setMapReady] = useState(false);

  // Extract center coordinates from city
  const center: [number, number] = [city.lat, city.lon];
  const cityName = city.name;

  // Initialize map only after component is mounted (client-side)
  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p>Loading map...</p>
      </div>
    );
  }

  // Custom blue marker for the city location
  const blueIcon = new L.Icon({
    iconUrl: MAP_MARKERS.BLUE_ICON,
    shadowUrl: MAP_MARKERS.SHADOW,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="h-64 rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <ChangeView center={center} />
        <TileLayer
          attribution={MAP_TILES.ATTRIBUTION}
          url={MAP_TILES.DARK}
        />
        <Marker position={center} icon={blueIcon}>
          <Popup>{cityName}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapWithNoSSR; 
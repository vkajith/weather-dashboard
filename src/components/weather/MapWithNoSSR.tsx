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
      <div className="h-64 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-md rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-300 mb-2"></div>
          <p className="text-blue-300">Loading map...</p>
        </div>
      </div>
    );
  }

  // Custom blue marker for the city location
  const blueIcon = new L.Icon({
    iconUrl: MAP_MARKERS.BLUE_ICON,
    shadowUrl: MAP_MARKERS.SHADOW,
    iconSize: [30, 45], // Slightly larger for better visibility
    iconAnchor: [15, 45],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Custom popup style
  const customPopup = L.popup({
    className: 'custom-popup',
    closeButton: true,
    autoClose: true,
    closeOnEscapeKey: true,
  });

  return (
    <div className="h-64 rounded-lg overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        className="z-0"
      >
        <ChangeView center={center} />
        <TileLayer
          attribution={MAP_TILES.ATTRIBUTION}
          url={MAP_TILES.DARK}
        />
        <Marker position={center} icon={blueIcon}>
          <Popup className="custom-popup">
            <div className="font-medium text-center">
              <span className="text-blue-600">{cityName}</span>
              <div className="text-xs text-gray-500 mt-1">
                {city.lat.toFixed(4)}, {city.lon.toFixed(4)}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapWithNoSSR; 
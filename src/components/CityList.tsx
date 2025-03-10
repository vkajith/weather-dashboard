import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useWeather } from '@/lib/WeatherContext';

import WeatherCard from './WeatherCard';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface CityItemProps {
  id: string;
  name: string;
  index: number;
  moveCity: (dragIndex: number, hoverIndex: number) => void;
  onRemove: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

const ItemType = 'city';

const CityItem: React.FC<CityItemProps> = ({
  id,
  name,
  index,
  moveCity,
  onRemove,
  isSelected,
  onSelect,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId() as string | symbol,
      };
    },
    hover(item: unknown, monitor) {
      const dragItem = item as DragItem;
      if (!ref.current) {
        return;
      }
      const dragIndex = dragItem.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as { y: number }).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCity(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      dragItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className="mb-4 cursor-move"
    >
      <WeatherCard
        city={name}
        onRemove={onRemove}
        isSelected={isSelected}
        onClick={onSelect}
      />
    </div>
  );
};

const CityList: React.FC = () => {
  const { cities, removeCity, reorderCities, selectedCity, setSelectedCity } = useWeather();
  const [isBrowser, setIsBrowser] = useState(false);

  // Ensure DnD provider is only rendered on the client
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleMoveCity = (dragIndex: number, hoverIndex: number) => {
    reorderCities(dragIndex, hoverIndex);
  };

  // Show a message if no cities are added
  if (cities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">My Cities</h2>
        <p className="text-gray-500">No cities added yet. Add a city to get started!</p>
      </div>
    );
  }

  // Render a placeholder during server-side rendering
  if (!isBrowser) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">My Cities</h2>
        <div className="animate-pulse space-y-4">
          {cities.map((city) => (
            <div key={city.id} className="h-40 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">My Cities</h2>
        <p className="text-sm text-gray-500 mb-4">Drag to reorder your cities</p>

        {cities
          .sort((a, b) => a.order - b.order)
          .map((city, index) => (
            <CityItem
              key={city.id}
              id={city.id}
              name={city.name}
              index={index}
              moveCity={handleMoveCity}
              onRemove={() => removeCity(city.id)}
              isSelected={selectedCity === city.id}
              onSelect={() => setSelectedCity(city.id)}
            />
          ))
        }
      </div>
    </DndProvider>
  );
};

export default CityList; 
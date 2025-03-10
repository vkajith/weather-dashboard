import React, { useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd/dist/core';
import { useDrag, useDrop } from 'react-dnd/dist/hooks';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Card } from '@/components/ui';

import { useWeather } from '@/contexts/WeatherContext';

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
    collect(monitor: any) {
      return {
        handlerId: monitor.getHandlerId() as string | symbol,
      };
    },
    hover(item: unknown, monitor: any) {
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
    collect: (monitor: any) => ({
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
  const [mounted, setMounted] = useState(false);

  // Make sure component mounted (client-side) before showing content that might cause hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMoveCity = (dragIndex: number, hoverIndex: number) => {
    reorderCities(dragIndex, hoverIndex);
  };

  if (!mounted) {
    return (
      <Card title="Your Cities">
        <div className="h-64 bg-white bg-opacity-5 rounded-lg"></div>
      </Card>
    );
  }

  return (
    <Card title="Your Cities">
      <div className="space-y-3">
        {cities.length === 0 ? (
          <div className="text-center py-8">
            <div className="weather-icon-container p-4 mb-4 animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">No Cities Added</h3>
            <p className="text-blue-200/80">
              Search and add cities using the search box above
            </p>
          </div>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
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
                    isSelected={city.id === selectedCity}
                    onSelect={() => setSelectedCity(city.id)}
                  />
                ))}
            </div>
          </DndProvider>
        )}
      </div>
    </Card>
  );
};

export default CityList; 
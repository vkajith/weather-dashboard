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
      className={`mb-6 cursor-move transition-all duration-200 ${isDragging ? 'scale-105 rotate-1' : ''}`}
    >
      <div className={`relative ${isDragging ? 'z-50' : 'z-10'}`}>
        {isDragging && <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md -m-1"></div>}
        <div className="relative">
          <WeatherCard
            city={name}
            onRemove={onRemove}
            isSelected={isSelected}
            onClick={onSelect}
          />
          {!isDragging && (
            <div className="absolute -right-1 -top-1 w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </div>
          )}
        </div>
      </div>
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
        <div className="h-64 bg-white/5 rounded-lg"></div>
      </Card>
    );
  }

  return (
    <Card title="Your Cities">
      {cities.length === 0 ? (
        <div className="text-center py-6">
          <div className="relative inline-block mb-3">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"></div>
            <div className="weather-icon-container p-3 animate-float relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-1 gradient-text">No Cities Added</h3>
          <p className="text-blue-200/80 text-sm">
            Search and add cities using the search box
          </p>
        </div>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 py-2">
            {cities.length > 1 && (
              <p className="text-blue-300/80 text-xs mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Drag to reorder cities
              </p>
            )}
            <div className="space-y-6">
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
          </div>
        </DndProvider>
      )}
    </Card>
  );
};

export default CityList; 
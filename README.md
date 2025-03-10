# Weather Dashboard

A modern, responsive weather dashboard application built with Next.js, TypeScript, and Tailwind CSS. This application allows users to search for cities, view current weather conditions, forecasts, and location maps with a beautiful, intuitive interface.

## Features

- **City Search**: Search for cities worldwide with autocomplete suggestions
- **Current Weather**: View detailed current weather information including temperature, feels like, humidity, wind speed, and more
- **5-Day Forecast**: See a 5-day weather forecast with daily high/low temperatures and conditions
- **Interactive Map**: View the location of selected cities on an interactive map
- **City Management**: Add, remove, and reorder cities with drag-and-drop functionality
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful, modern interface with glassmorphism effects, animations, and intuitive interactions
- **Real-time Updates**: Weather data automatically refreshes at regular intervals

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Maps**: [Leaflet](https://leafletjs.com/) / [React Leaflet](https://react-leaflet.js.org/)
- **Drag and Drop**: [React DnD](https://react-dnd.github.io/react-dnd/)
- **API**: [OpenWeatherMap API](https://openweathermap.org/api)

## Project Structure

```
weather-dashboard/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   └── weather/         # Weather-specific components
│   ├── contexts/            # React context providers
│   │   └── WeatherContext/  # Weather state management
│   ├── lib/                 # Library code
│   │   └── api/             # API service functions
│   ├── pages/               # Next.js pages
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
│       ├── ui/              # UI-related utilities
│       └── weather/         # Weather-related utilities
├── .env.local               # Environment variables (create this file)
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your OpenWeatherMap API key:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Adding a City

1. Use the search box at the top of the page to search for a city
2. Select a city from the dropdown suggestions
3. The city will be added to your list and its current weather will be displayed

### Viewing Weather Details

1. Click on a city in your list to view its detailed weather information
2. The main panel will show current conditions, temperature, and other weather details
3. Scroll down to see the 5-day forecast and location map

### Managing Cities

1. Drag and drop cities in your list to reorder them
2. Click the "X" button on a city card to remove it from your list

## Code Organization

### Components

- **Card**: Reusable card component with modern glassmorphism styling
- **CityList**: Displays the list of saved cities with drag-and-drop functionality
- **CitySelector**: Search component for finding and adding new cities
- **ForecastList**: Displays the 5-day weather forecast
- **MapView**: Shows the location of the selected city on a map
- **WeatherCard**: Compact card showing basic weather information for a city
- **WeatherToday**: Detailed view of current weather conditions

### Utilities

- **dateUtils**: Functions for formatting dates and times
- **dataUtils**: Functions for fetching weather data
- **styleUtils**: UI helper functions for styling and class management

### Context

- **WeatherContext**: Manages the state of cities, selected city, and provides methods for adding, removing, and reordering cities

## Code Structure and Best Practices

The codebase follows several best practices for maintainability and scalability:

### Separation of Concerns

- **Components**: Focus solely on rendering UI and handling user interactions
- **Utilities**: Handle reusable logic and data processing
- **Context**: Manages application state and provides methods for state manipulation
- **API Services**: Encapsulate all external API communication

### Code Reusability

- Common utility functions are extracted to dedicated files to avoid duplication
- UI components are designed to be reusable across the application
- Styling uses Tailwind CSS utility classes for consistency

### Performance Optimization

- SWR for efficient data fetching with caching and revalidation
- Component-level code splitting with dynamic imports
- Client-side hydration handling to prevent rendering errors
- Optimized rendering with proper React hooks usage

### Type Safety

- TypeScript interfaces for all data structures
- Strict type checking throughout the application
- Proper typing for component props and function parameters

### Maintainability

- Consistent code formatting and organization
- Comprehensive comments and documentation
- Clear separation between UI, business logic, and data fetching

## API Integration

This application uses the OpenWeatherMap API for weather data:

- **Current Weather**: `/data/2.5/weather` endpoint
- **5-Day Forecast**: `/data/2.5/forecast` endpoint
- **Geocoding**: `/geo/1.0/direct` endpoint for city search

## Customization

### Styling

The application uses Tailwind CSS for styling. You can customize the look and feel by modifying:

- `tailwind.config.js`: Change the theme, colors, and other Tailwind settings
- `src/styles/globals.css`: Modify global CSS variables and styles

### Adding Features

Some ideas for extending the application:

- Add user authentication to save cities across devices
- Implement unit/imperial unit toggle
- Add weather alerts and notifications
- Include air quality information
- Add historical weather data charts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Map tiles by [OpenStreetMap](https://www.openstreetmap.org/)
- Icons and design inspiration from various sources

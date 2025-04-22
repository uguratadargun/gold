# Gold Price Tracker

A React application that displays real-time gold prices from Altinkaynak.

## Features

- Real-time gold price updates
- Clean and modern UI using Chakra UI
- Automatic refresh every 5 minutes
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- React
- TypeScript
- Vite
- Chakra UI
- Axios

## Note

This application uses a CORS proxy service to fetch data from Altinkaynak. For production use, you might want to set up your own proxy server or use a different approach to handle CORS issues.

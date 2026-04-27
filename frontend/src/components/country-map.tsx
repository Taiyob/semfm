'use client';

import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

// Reliable TopoJSON source for global countries (50m resolution)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

interface CountryMapProps {
  countrySlug: string;
}

const COUNTRY_CONFIGS: Record<string, { center: [number, number]; scale: number; name: string }> = {
  portugal: {
    center: [-8, 39.5],
    scale: 3500,
    name: 'Portugal',
  },
  spain: {
    center: [-3.7, 40],
    scale: 2200,
    name: 'Spain',
  },
  greece: {
    center: [23.7, 38.3],
    scale: 2800,
    name: 'Greece',
  },
};

export function DynamicCountryMap({ countrySlug }: CountryMapProps) {
  const config = useMemo(() => COUNTRY_CONFIGS[countrySlug.toLowerCase()], [countrySlug]);

  if (!config) return null;

  return (
    <div className="w-full h-full flex items-center justify-center opacity-[0.25] mix-blend-multiply transition-opacity duration-1000">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: config.center,
          scale: config.scale,
        }}
        width={800}
        height={600}
        style={{
          width: '100%',
          height: '100%',
          outline: 'none',
        }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties.name === config.name)
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: '#2C3E50',
                      stroke: '#2C3E50',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: '#2C3E50',
                      outline: 'none',
                    },
                    pressed: {
                      fill: '#2C3E50',
                      outline: 'none',
                    },
                  }}
                />
              ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

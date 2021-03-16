// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import Map from './Map';
import { CurrentFlight } from './Map.types';

export default {
    title: 'Map',
    parameters: { layout: 'fullscreen' },
};

let lat = 1; let
    lng = 1;
const currentFlight = async (): Promise<CurrentFlight> => {
    lat *= -1;
    lng *= -1;
    return {
        flightNumber: '2222',
        latitude: lat,
        longitude: lng,
        altitude: Math.floor(Math.random() * 39000),
        heading: Math.random() * 360,
        aircraftType: 'A32NX',
        origin: 'KLAX',
        destination: 'KSFO',
    };
};

export const Default: React.FC = () => <div style={{ width: '100vw', height: '100vh' }}><Map /></div>;

export const ForceCartoLight: React.FC = () => <div style={{ width: '100vw', height: '100vh' }}><Map forceTileset="carto-light" /></div>;

export const NoMenu: React.FC = () => <div style={{ width: '100vw', height: '100vh' }}><Map disableMenu /></div>;

export const OnlyCurrentFlight: React.FC = () => (
    <div style={{ width: '100vw', height: '100vh' }}>
        <Map
            currentFlight={currentFlight}
            hideOthers
            refreshInterval={1000}
        />
    </div>
);

export const OnlyCurrentFlightNoFollow: React.FC = () => (
    <div style={{ width: '100vw', height: '100vh' }}>
        <Map
            currentFlight={currentFlight}
            hideOthers
            refreshInterval={1000}
            followCurrent={false}
        />
    </div>
);

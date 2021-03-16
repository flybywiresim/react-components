import React, { useEffect, useState } from 'react';
import { FeatureGroup, useMapEvents } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';

import { Telex, TelexConnection, Bounds } from '@flybywiresim/api-client';
import AirportsLayer from './AirportsLayer';
import FlightMarker from './FlightMarker';
import { useInterval } from '../hooks';
import { CurrentFlight, CurrentFLightCallback } from './Map.types';

export type FlightsLayerProps = {
    // eslint-disable-next-line no-unused-vars
    onConnectionsUpdate?: (connections: TelexConnection[]) => void,
    planeIcon: string,
    planeIconHighlight: string,
    departureIcon: string,
    arrivalIcon: string,
    currentFlight: CurrentFLightCallback,
    searchedFlight?: TelexConnection,
    refreshInterval: number,
    hideOthers?: boolean,
    followCurrent?: boolean,
}

const FlightsLayer = (props: FlightsLayerProps): JSX.Element => {
    const map = useMapEvents({
        moveend: (event) => {
            const newBounds = event.target.getBounds();

            if (!bounds.contains(newBounds)) {
                setBounds(newBounds);
            }
        },
    });

    // eslint-disable-next-line no-unused-vars
    const [, setIsUpdating] = useState<boolean>(false);
    const [data, setData] = useState<TelexConnection[]>([]);
    const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());
    const [selectedConnection, setSelectedConnection] = useState<TelexConnection | null>(null);
    const [currentFlight, setCurrentFlight] = useState<CurrentFlight | null>(null);

    useInterval(async () => {
        await getLocationData(false, map.getBounds());
    }, props.refreshInterval || 10000,
    { runOnStart: true, additionalDeps: [props.hideOthers] });

    useEffect(() => {
        if (!props.hideOthers) {
            getLocationData(false, bounds);
        }
    }, [bounds]);

    async function getLocationData(staged = false, bounds?: LatLngBounds) {
        setIsUpdating(true);

        let flights: TelexConnection[] = [];

        let apiBounds: Bounds = {
            north: 90,
            east: 180,
            south: -90,
            west: 0,
        };
        if (bounds) {
            apiBounds = {
                north: Math.ceil(Math.min(bounds.getNorth(), 90)),
                east: Math.ceil(Math.min(bounds.getEast(), 180)),
                south: Math.floor(Math.max(bounds.getSouth(), -90)),
                west: Math.floor(Math.max(bounds.getWest(), -180)),
            };
        }

        try {
            if (props.hideOthers && props.currentFlight) {
                const flight = await props.currentFlight();
                setCurrentFlight(flight);

                flights.push({
                    id: '',
                    isActive: true,
                    firstContact: new Date(),
                    lastContact: new Date(),
                    flight: flight.flightNumber,
                    location: {
                        x: flight.longitude,
                        y: flight.latitude,
                    },
                    trueAltitude: flight.altitude,
                    heading: flight.heading,
                    freetextEnabled: true,
                    aircraftType: flight.aircraftType,
                    origin: flight.origin,
                    destination: flight.destination,
                });

                if (props.followCurrent || props.followCurrent === undefined) {
                    map.flyTo({ lat: flight.latitude, lng: flight.longitude });
                }
            } else {
                flights = await Telex.fetchAllConnections(apiBounds, staged ? setData : undefined);
            }
        } catch (e) {
            console.error(e);
        }

        setIsUpdating(false);
        setData(flights);
        if (props.onConnectionsUpdate) {
            props.onConnectionsUpdate(flights);
        }
    }

    return (
        <FeatureGroup>
            {
                data.map((connection: TelexConnection) => (
                    <FlightMarker
                        key={connection.id}
                        connection={connection}
                        icon={props.planeIcon}
                        highlightIcon={props.planeIconHighlight}
                        isHighlighted={(props.searchedFlight && props.searchedFlight.flight === connection.flight) || currentFlight?.flightNumber === connection.flight}
                        onPopupOpen={() => setSelectedConnection(connection)}
                        onPopupClose={() => setSelectedConnection(null)}
                    />
                ))
            }
            {
                (selectedConnection !== null)
                    ? (
                        <AirportsLayer
                            connection={selectedConnection}
                            departureIcon={props.departureIcon}
                            arrivalIcon={props.arrivalIcon}
                        />
                    ) : ''
            }
        </FeatureGroup>
    );
};

export default FlightsLayer;

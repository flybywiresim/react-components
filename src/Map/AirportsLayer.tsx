import { Airport, AirportResponse, TelexConnection } from '@flybywiresim/api-client';
import React, { useEffect, useState } from 'react';

import { FeatureGroup, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import ArrivalWhite from './res/icons/arrival_white.png';
import DepartureWhite from './res/icons/departure_white.png';

export enum AirportType {
    Departure,
    Arrival,
}

export type AirportSearch = {
    icao: string,
    airportType: AirportType,
}

export type AirportsLayerProps = Partial<{
    departureIcon: string,
    arrivalIcon: string,
    airportSearch: AirportSearch[],
    connection: TelexConnection,
}>

export type DisplayedAirport = {
    airport: AirportResponse,
    airportType: AirportType,
}

const AirportsLayer = (props: AirportsLayerProps): JSX.Element => {
    const [displayedAirports, setDisplayedAirports] = useState<DisplayedAirport[]>([]);

    useEffect(() => {
        setDisplayedAirports([]);

        if (props.airportSearch) {
            findAirports(props.airportSearch);
            return;
        }

        if (props.connection) {
            findAirports([{
                icao: props.connection.origin,
                airportType: AirportType.Departure,
            }, {
                icao: props.connection.destination,
                airportType: AirportType.Arrival,
            }]);
        }
    }, [props.airportSearch, props.connection]);

    async function findAirports(searches: AirportSearch[]) {
        const airports: DisplayedAirport[] = [];

        for (const search of searches) {
            if (search.icao) {
                try {
                    // eslint-disable-next-line no-await-in-loop
                    airports.push(await getAirport(search.icao, search.airportType));
                } catch (e) {
                    console.error(e);
                }
            }
        }

        setDisplayedAirports(airports);
    }

    async function getAirport(icao: string, airportType: AirportType): Promise<DisplayedAirport> {
        const arpt = await Airport.get(icao);

        return {
            airportType,
            airport: arpt,
        };
    }

    return (
        <FeatureGroup>
            {
                displayedAirports.map((arptToShow) => (
                    <Marker
                        key={`${arptToShow.airport.icao}-${arptToShow.airportType}`}
                        zIndexOffset={9999}
                        position={[arptToShow.airport.lat, arptToShow.airport.lon]}
                        icon={L.icon({
                            iconSize: [26, 26],
                            iconAnchor: [13, 13],
                            iconUrl: (arptToShow.airportType === AirportType.Arrival) ? (props.arrivalIcon || ArrivalWhite) : (props.departureIcon || DepartureWhite),
                        })}
                    >
                        <Tooltip className="airport-tooltip" direction="top" permanent>
                            <p>
                                {arptToShow.airport.icao}
                                {' '}
                                -
                                {' '}
                                {arptToShow.airport.name}
                            </p>
                        </Tooltip>
                    </Marker>
                ))
            }
        </FeatureGroup>
    );
};

export default AirportsLayer;

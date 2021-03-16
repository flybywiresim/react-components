import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import { Telex, TelexConnection } from '@flybywiresim/api-client';
import { useInterval } from '../hooks';

export type FlightMarkerProps = {
    connection?: TelexConnection | string;
    icon: string;
    highlightIcon?: string;
    isHighlighted?: boolean;
    onPopupOpen?: () => void;
    onPopupClose?: () => void;
    autoUpdate?: boolean;
}

const FlightMarker = (props: FlightMarkerProps): JSX.Element => {
    const [connection, setConnection] = useState<TelexConnection>({
        aircraftType: '',
        id: '',
        isActive: false,
        firstContact: new Date(),
        lastContact: new Date(),
        freetextEnabled: false,
        destination: '',
        origin: '',
        heading: 0,
        trueAltitude: 0,
        flight: '',
        location: {
            x: 0,
            y: 0,
        },
    });

    useEffect(() => {
        if (typeof props.connection === 'undefined') {
            return;
        } if (typeof props.connection === 'string') {
            findAndSetConnection(props.connection);
        } else {
            setConnection(props.connection);
        }

        if (props.autoUpdate) {
            useInterval(async () => {
                if (props.autoUpdate && props.connection !== undefined) {
                    await findAndSetConnection(props.connection);
                }
            }, 15000,
            { runOnStart: true, additionalDeps: [props.autoUpdate] });
        }
    }, [props.connection]);

    async function findAndSetConnection(connection: string | TelexConnection | undefined) {
        if (typeof connection === 'undefined') {
            return;
        }

        try {
            if (typeof connection === 'string') {
                const result = await Telex.findConnections(connection);

                if (!result.fullMatch) {
                    console.error('Current FLT NBR did not return a full match');
                    return;
                }

                setConnection(result.fullMatch);
            } else {
                setConnection(await Telex.fetchConnection(connection.id));
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Marker
            position={[connection.location.y, connection.location.x]}
            // TODO: Need to get rid of L.divIcon. It produces twice as many DOM nodes as L.icon. Issue is the rotation.
            icon={L.divIcon({
                iconSize: [25, 27],
                iconAnchor: [12.5, 13.5],
                className: 'aircraft-marker',
                html: `<img alt="${connection.flight}" 
                        src="${(props.isHighlighted && !!props.highlightIcon) ? props.highlightIcon : props.icon}"
                        style="transform-origin: center; transform: rotate(${connection.heading}deg);"
                        width="25" height="27"
                        />`,
            })}
        >
            <Popup
                closeButton={false}
                className="aircraft-popup"
                onOpen={() => (props.onPopupOpen ? props.onPopupOpen() : {})}
                onClose={() => (props.onPopupClose ? props.onPopupClose() : {})}
            >
                <h1>
                    Flight
                    {connection.flight}
                </h1>
                {
                    (connection.origin && connection.destination)
                        ? (
                            <h2>
                                {connection.origin}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                    <path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
                                </svg>
                                {' '}
                                {connection.destination}
                            </h2>
                        )
                        : ''
                }
                <p>
                    Aircraft:
                    {connection.aircraftType}
                </p>
                <p>
                    Altitude:
                    {connection.trueAltitude}
                    ft
                </p>
            </Popup>
        </Marker>
    );
};

export default FlightMarker;

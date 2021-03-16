import React, { useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';

type WeatherLayerProps = {
    opacity?: number;
}

const WeatherLayer = (props: WeatherLayerProps): JSX.Element => {
    const [timestamp, setTimestamp] = useState<number>();

    useEffect(() => {
        getNewestLayer();
    }, []);

    async function getNewestLayer() {
        await fetch('https://api.rainviewer.com/public/maps.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error();
                }

                return response.json();
            })
            .then((timestamps) => timestamps.sort())
            .then((timestamps) => setTimestamp(timestamps[timestamps.length - 1]))
            .catch((err) => console.error(err));
    }

    return (
        <>
            {
                (timestamp !== undefined)
                    ? (
                        <TileLayer
                            url={`https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/2/1_1.png`}
                            tileSize={256}
                            opacity={props.opacity}
                        />
                    ) : <></>
            }
        </>
    );
};

export default WeatherLayer;

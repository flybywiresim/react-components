import React, { useState } from 'react';
import { TileLayer, MapContainer, ZoomControl } from 'react-leaflet';
import { NmScale } from '@marfle/react-leaflet-nmscale';
import WeatherLayer from './WeatherLayer';
import { TelexConnection } from '@flybywiresim/api-client';

import FlightsLayer from './FlightsLayer';
import MenuPanel from './MenuPanel';

import 'leaflet/dist/leaflet.css';
import './Map.scss';

import ArrivalWhite from './res/icons/arrival_white.png';
import ArrivalGray from './res/icons/arrival_gray.png';
import DepartureWhite from './res/icons/departure_white.png';
import DepartureGray from './res/icons/departure_gray.png';
import PlaneCyan from './res/icons/plane_cyan.png';
import PlaneBlue from './res/icons/plane_blue.png';
import CartoDarkPreview from './res/previews/carto-dark.png';
import CartoLightPreview from './res/previews/carto-light.png';
import OsmPreview from './res/previews/osm.png';

import { MeasureControl } from './MeasureControl';
import { MapProps, TileSet } from './Map.types';
import { useLocalStorage } from '../hooks';

const Map = (props: MapProps): JSX.Element => {
    const availableTileSets: TileSet[] = [
        {
            id: 1,
            value: 'carto-light',
            name: 'Light',
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
            planeIcon: PlaneCyan,
            planeIconHighlight: PlaneBlue,
            departureIcon: DepartureGray,
            arrivalIcon: ArrivalGray,
            previewImageUrl: CartoLightPreview,
        },
        {
            id: 2,
            value: 'osm',
            name: 'Open Street Map',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            planeIcon: PlaneCyan,
            planeIconHighlight: PlaneBlue,
            departureIcon: DepartureGray,
            arrivalIcon: ArrivalGray,
            previewImageUrl: OsmPreview,
        },
        {
            id: 3,
            value: 'carto-dark',
            name: 'Dark',
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
            planeIcon: PlaneCyan,
            planeIconHighlight: PlaneBlue,
            departureIcon: DepartureWhite,
            arrivalIcon: ArrivalWhite,
            previewImageUrl: CartoDarkPreview,
        }
    ];

    const [selectedTile, setSelectedTile] = useLocalStorage<TileSet>(
        'tileSet',
        availableTileSets[0],
        {
            valueOverride: !!props.forceTileset && (availableTileSets.find(x => x.value === props.forceTileset)),
        });
    const [searchedFlight, setSearchedFlight] = useState<TelexConnection>();
    const [weatherOpacity, setWeatherOpacity] = useState<number>(props.weatherOpacity || 0.2);
    const [showOthers, setShowOthers] = useState<boolean>(!props.hideOthers);

    return (
        <MapContainer
            id="live-map"
            center={props.center || [50, 8]}
            zoom={props.zoom || 5}
            scrollWheelZoom={!props.disableScroll}
            worldCopyJump={true}
            zoomControl={false} >
            <TileLayer zIndex={0} attribution={selectedTile.attribution} url={selectedTile.url} key={selectedTile.value} />
            {
                (!props.disableWeather) ?
                    <WeatherLayer opacity={weatherOpacity} /> : <></>
            }
            {
                (!props.disableFlights) ?
                    <FlightsLayer
                        planeIcon={selectedTile.planeIcon}
                        planeIconHighlight={selectedTile.planeIconHighlight}
                        departureIcon={selectedTile.departureIcon}
                        arrivalIcon={selectedTile.arrivalIcon}
                        currentFlight={props.currentFlight}
                        searchedFlight={searchedFlight}
                        refreshInterval={props.refreshInterval || 10000}
                        hideOthers={!showOthers}
                        followCurrent={props.followCurrent}
                    /> : <></>
            }
            {
                !props.disableMenu ?
                    <MenuPanel
                        onFound={(conn) => setSearchedFlight(conn)}
                        onNotFound={() => setSearchedFlight(undefined)}
                        onReset={() => setSearchedFlight(undefined)}
                        weatherOpacity={weatherOpacity}
                        onWeatherOpacityChange={setWeatherOpacity}
                        activeTileSet={selectedTile}
                        availableTileSets={availableTileSets}
                        onTileSetChange={setSelectedTile}
                        refreshInterval={props.refreshInterval || 10000}
                        showOthers={showOthers}
                        onShowOthersChange={setShowOthers}
                    />
                    : <></>
            }
            <ZoomControl position={props.zoomPosition || 'bottomright'} />
            <NmScale />
            <MeasureControl
                position={props.zoomPosition || 'bottomright'}
                unit={'nauticalmiles'}
                showBearings={true}
                showUnitControl={true}
                showClearControl={true}
                tempLine={{ color: '#00C2CB', weight: 2 }}
                fixedLine={{ color: '#00C2CB', weight: 2 }}
            />
        </MapContainer>
    );
};

export default Map;

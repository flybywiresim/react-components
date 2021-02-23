import React, { useState, useEffect, FormEvent } from 'react';
import { Telex, TelexConnection } from '@flybywiresim/api-client';
import { useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { useInterval } from '../hooks';
import { TileSet } from './Map.types';

type MenuPanelProps = {
    // eslint-disable-next-line no-unused-vars
    onFound?: (conn: TelexConnection) => void;
    onNotFound?: () => void;
    onReset?: () => void;
    weatherOpacity?: number;
    // eslint-disable-next-line no-unused-vars
    onWeatherOpacityChange?: (opacity: number) => void;
    activeTileSet?: TileSet;
    availableTileSets?: TileSet[];
    // eslint-disable-next-line no-unused-vars
    onTileSetChange?: (tileSet: TileSet) => void;
    refreshInterval?: number;
    showOthers?: boolean;
    // eslint-disable-next-line no-unused-vars
    onShowOthersChange?: (show: boolean) => void;
}

const MenuPanel = (props: MenuPanelProps): JSX.Element => {
    const mapRef = useMap();

    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [totalFlights, setTotalFlights] = useState<number>(NaN);
    const [searchValue, setSearchValue] = useState<string>('');
    const [autocompleteList, setAutocompleteList] = useState<TelexConnection[]>([]);

    useInterval(async () => {
        try {
            setTotalFlights(await Telex.countConnections());
        } catch (e) {
            console.error(e);
        }
    }, props.refreshInterval || 10000,
    { runOnStart: true });

    // Prevent click through
    useEffect(() => {
        const menu = L.DomUtil.get('menu-panel');
        if (menu) {
            L.DomEvent.disableClickPropagation(menu);
        }
    }, [mapRef]);

    async function handleSearch(flyTo?: boolean, searchOverride?: string) {
        const search = searchOverride || searchValue;

        if (!search) {
            if (props.onReset) {
                props.onReset();
            }
            return;
        }

        try {
            const res = await Telex.findConnections(search);
            setAutocompleteList(res.matches.sort((a, b) => {
                if (a.flight < b.flight) {
                    return -1;
                }
                if (a.flight > b.flight) {
                    return 1;
                }

                return 0;
            }));

            if (!res.fullMatch) {
                if (props.onNotFound) {
                    props.onNotFound();
                }
                return;
            }

            if (res.fullMatch.flight === search) {
                if (props.onFound) {
                    props.onFound(res.fullMatch);
                }

                if (flyTo === undefined || flyTo || res.matches.length === 1) {
                    const zoom = Math.max(10, 15 - res.fullMatch.trueAltitude * 5 / 12000);
                    mapRef.flyTo(new LatLng(res.fullMatch.location.y, res.fullMatch.location.x), zoom);
                }
            }
        } catch (e) {
            console.error(e);

            if (props.onNotFound) {
                props.onNotFound();
            }
        }
    }

    function handleTileSelect(event: FormEvent<HTMLInputElement>) {
        if (props.onTileSetChange && props.availableTileSets) {
            props.onTileSetChange(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                props.availableTileSets.find(x => x.value === event.target.value) || props.availableTileSets[0]);
        }
    }

    return (
        <div id="menu-panel" className="leaflet-top leaflet-left">
            <div className="search-bar">
                <button
                    className="menu-button"
                    aria-label="Menu"
                    onClick={() => setShowDetails(!showDetails)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg" strokeWidth="2" stroke="#b5b5b5" fill="none"
                        width="24" height="24" viewBox="0 0 24 24"
                        strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="6" x2="20" y2="6"/>
                        <line x1="4" y1="12" x2="20" y2="12"/>
                        <line x1="4" y1="18" x2="20" y2="18"/>
                    </svg>
                </button>
                <input
                    type="text"
                    aria-label="Search Field"
                    className="search-term"
                    list="autocomplete"
                    placeholder="Flight Number"
                    onChange={event => {
                        setSearchValue(event.target.value.toString());
                        handleSearch(false, event.target.value.toString());
                    }}
                    onKeyPress={event => event.key === 'Enter' ? handleSearch() : {}}
                    onFocus={(event) => event.target.select()}
                    onBlur={() => handleSearch()}/>
                <button
                    type="submit"
                    aria-label="Search"
                    onClick={() => handleSearch()}
                    className="search-button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke="#fff" fill="none"
                        width="24" height="24" viewBox="0 0 24 24"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="10" cy="10" r="7"/>
                        <line x1="21" y1="21" x2="15" y2="15"/>
                    </svg>
                </button>
                <datalist id="autocomplete">
                    {
                        autocompleteList.map(connection => !searchValue || connection.flight.startsWith(searchValue) ?
                            <option key={connection.id} value={connection.flight}/> : <></>)
                    }
                </datalist>
            </div>
            <div className="divider" hidden={!showDetails} />
            <div className="detail-area" hidden={!showDetails}>
                {
                    (props.weatherOpacity !== undefined && props.onWeatherOpacityChange) ?
                        <>
                            <p>Weather opacity</p>
                            <input
                                type="range"
                                value={100 * props.weatherOpacity}
                                min={0}
                                max={100}
                                onChange={event => props.onWeatherOpacityChange && props.onWeatherOpacityChange(Number(event.target.value) / 100)}
                            />
                        </> : <></>
                }
                {
                    (props.activeTileSet && props.availableTileSets && props.onTileSetChange) ?
                        <div onChange={handleTileSelect}>
                            {
                                props.availableTileSets.map(tileSet =>
                                    <label className="tileset-select" key={tileSet.value} >
                                        <input
                                            type="radio"
                                            name="tileset"
                                            value={tileSet.value}
                                            defaultChecked={props.activeTileSet && tileSet.value === props.activeTileSet.value} />
                                        <img src={tileSet.previewImageUrl} alt={tileSet.name} width="60rem" />
                                    </label>
                                )
                            }
                        </div> : <></>
                }
                {
                    props.onShowOthersChange ?
                        <>
                            <p>Show others</p>
                            <input
                                type="checkbox"
                                checked={props.showOthers}
                                onChange={event => props.onShowOthersChange ? props.onShowOthersChange(event.target.checked) : {}}
                            />
                        </> : <></>
                }
                <p className="active-flights">Active Flights<br/><span>{totalFlights.toString()}</span></p>
            </div>
        </div>
    );
};

export default MenuPanel;

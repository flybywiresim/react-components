import React, { useState, useEffect, FormEvent } from 'react';
import { Telex, TelexConnection } from '@flybywiresim/api-client';
import { useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { useInterval } from '../hooks';
import { TileSet } from './Map.types';
import { ChevronDown, ChevronUp, Menu, Menu2, Search } from 'tabler-icons-react';
import Toggle from '../Toggle';
import Slider from '../Slider';

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
        <div id="menu-panel" className="leaflet-top leaflet-left flex flex-col">
            <div className="w-full z-50 flex flex-row items-center h-11 px-3 py-2 bg-gray-50 border-2 border-teal-300 rounded-md shadow-md">
                <button
                    className="menu-button w-8 border-0 pointer focus:outline-none"
                    aria-label="Menu"
                    onClick={() => setShowDetails(!showDetails)}>
                    <ChevronDown className={`text-gray-500 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                </button>
                <input
                    type="text"
                    aria-label="Search Field"
                    className="text-base bg-gray-50 placeholder-gray-500 text-gray-600 focus:outline-none"
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
                    className="search-button ml-auto border-0 pointer"
                >
                    <Search className="text-gray-500" />
                </button>
                <datalist id="autocomplete">
                    {
                        autocompleteList.map(connection => !searchValue || connection.flight.startsWith(searchValue) ?
                            <option key={connection.id} value={connection.flight}/> : <></>)
                    }
                </datalist>
            </div>
            <div className="divider" hidden={!showDetails} />
            <div className="detail-area bg-gray-100 px-4 py-4 text-gray-50 divide-y divide-gray-300 -mt-1.5 rounded-b-md shadow-lg" hidden={!showDetails}>
                {
                    (props.weatherOpacity !== undefined && props.onWeatherOpacityChange) ?
                        <>
                            <h1 className="text-base text-gray-700 font-semibold">Weather opacity</h1>

                            <Slider
                                className="w-full"
                                dark={false}
                                value={100 * props.weatherOpacity}
                                onInput={(value) => props.onWeatherOpacityChange && props.onWeatherOpacityChange(Number(value) / 100)}
                            />
                        </> : <></>
                }
                {
                    (props.activeTileSet && props.availableTileSets && props.onTileSetChange) ?
                        <div className="mt-3 pt-2">
                            <h1 className="text-base text-gray-700 font-semibold mb-1">Theme</h1>

                            <div onChange={handleTileSelect} className="flex flex-row space-x-4">
                                {
                                    props.availableTileSets.map(tileSet =>
                                        <label className="tileset-select flex-grow" key={tileSet.value} >
                                            <input
                                                type="radio"
                                                name="tileset"
                                                value={tileSet.value}
                                                defaultChecked={props.activeTileSet && tileSet.value === props.activeTileSet.value} />
                                            <img src={tileSet.previewImageUrl} alt={tileSet.name} className="w-full rounded-sm shadow-md" />
                                        </label>
                                    )
                                }
                            </div>
                        </div> : <></>
                }
                {
                    props.onShowOthersChange ?
                        <div className="flex flex-row justify-between items-center mt-3 pt-3 pb-3">
                            <h1 className="text-base text-gray-700 font-semibold">Show others</h1>

                            <Toggle dark={false} value={props.showOthers} onToggle={props.onShowOthersChange ?? (() => {})} />
                        </div> : <></>
                }
                <span className="active-flights">
                    <h1 className="text-sm text-gray-800 -mb-1">Active Flights</h1>
                    <h1 className="text-2xl font-bold text-gray-800 -mb-2">{totalFlights.toString()}</h1>
                </span>
            </div>
        </div>
    );
};

export default MenuPanel;

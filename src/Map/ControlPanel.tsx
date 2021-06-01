import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { IconRoute, IconX, IconPlus, IconMinus } from '@tabler/icons';
import * as L from 'leaflet';
import { MeasureControl } from './MeasureControl';
import '@datenpate/leaflet.polylinemeasure';

export const ControlPanel: React.FC = () => {
    const [units, setUnits] = useState('nm');
    const mapRef = useMap();
    const measureRef = useRef<HTMLElement & any>();

    useEffect(() => {
        const controlPanel = L.DomUtil.get('control-panel');
        if (controlPanel) {
            L.DomEvent.disableClickPropagation(controlPanel);
        }
    }, [mapRef]);

    return (
        <div id="control-panel" className="flex flex-col leaflet-right leaflet-bottom">
            <div className="leaflet-control button-group bg-gray-100 border-2 rounded-sm shadow-md">
                <ControlButton
                    label="Turn on polyline measurements"
                    onClick={() => {
                        if (measureRef.current) {
                            // eslint-disable-next-line
                            measureRef.current._toggleMeasure();
                        }
                    }}
                >
                    <IconRoute size={16} />
                </ControlButton>
                <ControlButton
                    label="Clear polyline measurements"
                    // eslint-disable-next-line
                    onClick={() => {
                        if (measureRef.current) {
                            // eslint-disable-next-line
                            measureRef.current._clearAllMeasurements();
                        }
                    }}
                >
                    <IconX size={16} />
                </ControlButton>
                <ControlButton
                    label="Change Measurement Unit"
                    onClick={() => {
                        if (measureRef.current) {
                            // eslint-disable-next-line
                            measureRef.current._changeUnit();
                            // eslint-disable-next-line
                            setUnits(measureRef.current._unitControl.innerText);
                        }
                    }}
                >
                    {units}
                </ControlButton>

            </div>
            <div className="leaflet-control button-group bg-gray-100 border-2 rounded-sm shadow-md">
                <ControlButton label="Zoom In" onClick={() => mapRef.zoomIn()}>
                    <IconPlus size={16} />
                </ControlButton>
                <ControlButton label="Zoom Out" onClick={() => mapRef.zoomOut()}>
                    <IconMinus size={16} />
                </ControlButton>
            </div>
            <MeasureControl
                ref={measureRef}
                unit="nauticalmiles"
                showBearings
                showUnitControl
                showClearControl
                tempLine={{ color: '#00C2CB', weight: 2 }}
                fixedLine={{ color: '#00C2CB', weight: 2 }}
            />
        </div>
    );
};

type ControlButtonProps = {
    label?: string
    onClick?: () => void
    children?: React.ReactNode

}

const ControlButton: React.FC<ControlButtonProps> = ({ label, onClick, children }) => (
    <button
        type="button"
        className="flex flex-col justify-center items-center hover:bg-gray-200 border-0 pointer focus:outline-none py-2 w-8"
        aria-label={label}
        onClick={onClick}
    >
        {children}
    </button>
);

export default ControlPanel;

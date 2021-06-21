import { createControlComponent } from '@react-leaflet/core';
import * as L from 'leaflet';

type Unit = 'metres' | 'landmiles' | 'nauticalmiles';

type UnitControlTitle = {
    text: string,
    metres: string,
    landmiles: string,
    nauticalmiles: string,
};

type UnitControlLabel = {
    metres: string,
    kilometres: string,
    feet: string,
    landmiles: string,
    nauticalmiles: string
};

type LineStyle = {
    color: string,
    weight: number,
};

type CircleStyle = {
    color: string,
    weight: number,
    fillColor: string,
    fillOpacity: number,
    radius: number,
};

type MeasureControlProps = Partial<{
    position: L.ControlPosition,
    unit: Unit,
    clearMeasurementsOnStop: boolean,
    showBearings: boolean,
    bearingTextIn: string,
    bearingTextOut: string,
    tooltipTextFinish: string,
    tooltipTextDelete: string,
    tooltipTextMove: string,
    tooltipTextResume: string,
    tooltipTextAdd: string,
    measureControlTitleOn: string,
    measureControlTitleOff: string,
    measureControlLabel: string,
    measureControlClasses: string[],
    showClearControl: boolean,
    clearControlTitle: string,
    clearControlLabel: string,
    clearControlClasses: string[],
    showUnitControl: boolean,
    distanceShowSameUnit: boolean,
    unitControlTitle: UnitControlTitle,
    unitControlLabel: UnitControlLabel,
    tempLine: LineStyle,
    fixedLine: LineStyle,
    startCircle: CircleStyle,
    intermedCircle: CircleStyle,
    currentCircle: CircleStyle,
    endCircle: CircleStyle,
}>;

function createMeasureControl(props: MeasureControlProps) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return L.control.polylineMeasure(props);
}

export const MeasureControl = createControlComponent<L.Control, MeasureControlProps>(createMeasureControl);

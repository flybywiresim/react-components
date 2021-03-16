// Generated with util/create-component.js
import React, { useState } from 'react';
import Slider from './Slider';

export default {
    title: 'Slider',
    /* To make a fullscreen component use the layout parameter.
       Also requires 'style={{ width: '100vw', height: '100vh' }}'
       to be present on the component or a wrapper div.

    ,parameters: {
        layout: 'fullscreen'
    } */
};

export const Default = () => {
    const [state, setState] = useState(50);

    return <Slider value={state} onInput={setState} />;
};

export const LightTheme = () => {
    const [state, setState] = useState(50);

    return <Slider dark={false} value={state} onInput={setState} />;
};

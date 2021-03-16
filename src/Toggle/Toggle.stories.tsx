// Generated with util/create-component.js
import React, { useState } from 'react';
import Toggle from './Toggle';

export default {
    title: 'Toggle',
    /* To make a fullscreen component use the layout parameter.
       Also requires 'style={{ width: '100vw', height: '100vh' }}'
       to be present on the component or a wrapper div.

    ,parameters: {
        layout: 'fullscreen'
    } */
};

export const Default = () => {
    const [state, setState] = useState(true);

    return <Toggle value={state} onToggle={(value) => setState(value)} />;
};

export const CustomLightTheme = () => {
    const [state, setState] = useState(true);

    return (
        <Toggle
            dark={false}
            value={state}
            onToggle={(value) => setState(value)}
        />
    );
};

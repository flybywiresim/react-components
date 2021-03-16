// Generated with util/create-component.js
import React from 'react';
import DummyComponent from './DummyComponent';

export default {
    title: 'DummyComponent',
    /* To make a fullscreen component use the layout parameter.
       Also requires 'style={{ width: '100vw', height: '100vh' }}'
       to be present on the component or a wrapper div.

    ,parameters: {
        layout: 'fullscreen'
    } */
};

export const WithBar = () => <DummyComponent foo="bar" />;

export const WithBaz = () => <DummyComponent foo="baz" />;

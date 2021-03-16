// Generated with util/create-component.js
import React from 'react';
import { render } from '@testing-library/react';

import DummyComponent from './DummyComponent';
import { DummyComponentProps } from './DummyComponent.types';

describe('Test Component', () => {
    let props: DummyComponentProps;

    beforeEach(() => {
        props = { foo: 'bar' };
    });

    const renderComponent = () => render(<DummyComponent {...props} />);

    it('should render foo text correctly', () => {
        props.foo = 'harvey was here';
        const { getByTestId } = renderComponent();

        const component = getByTestId('DummyComponent');

        expect(component).toHaveTextContent('harvey was here');
    });
});

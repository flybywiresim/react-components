import React, { useRef } from 'react';

import './styles.scss';

export type SliderProps = { className?: string, value?: number, onInput?: (v: number) => void, dark?: boolean };

export const Slider = ({ className, onInput, value, dark = true }: SliderProps) => {
    const sliderRef = useRef<HTMLInputElement>(null);

    const handleInput = () => {
        const newValue = Number(sliderRef?.current?.value ?? 0);

        if (onInput) {
            onInput(newValue);
        }
    };

    return (
        <input
            value={value}
            ref={sliderRef}
            onChange={handleInput}
            type="range"
            min="1"
            max="100"
            className={`${dark ? 'slider' : 'slider-light'} bg-blue-darker h-1 pb-1 pt-0 rounded-full shadow-inner-sm ${className}`}
        />
    );
};

export default Slider;

import React from 'react';

export type ToggleProps = { value: boolean, onToggle: (value: boolean) => void, dark?: boolean; };

const Toggle: React.FC<ToggleProps> = ({ value, onToggle, dark = true }) => (
    <div
        onClick={() => onToggle(!value)}
        className={`w-12 h-6 px-0.5 ${dark ? 'bg-blue-darker' : 'bg-gray-200'} rounded-full flex flex-row items-center`}
    >
        <div
            className={`w-5 h-5 ${value ? (dark ? 'bg-teal-light-contrast' : 'bg-teal') : 'bg-gray-400'} rounded-full transition-colors transition-transform ${value ? 'transform translate-x-6' : ''}`}
        />
    </div>
);

export default Toggle;

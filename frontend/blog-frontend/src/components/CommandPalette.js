import React from 'react';

const CommandPalette = ({ onSelect = () => {} }) => {
    const options = ['Text', 'Heading', 'Image'];

    return (
        <div className="command-palette">
            {options.map((option, index) => (
                <div key={index} onClick={() => onSelect(option)}>
                    {option}
                </div>
            ))}
        </div>
    );
};

export default CommandPalette;
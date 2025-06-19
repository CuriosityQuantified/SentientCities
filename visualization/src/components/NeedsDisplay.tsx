import React from 'react';

interface NeedsDisplayProps {
  needs: {
    hunger: number;
    thirst: number;
    energy: number;
  };
}

export const NeedsDisplay: React.FC<NeedsDisplayProps> = ({ needs }) => {
  const renderNeedBar = (name: string, value: number) => {
    return (
      <div className="need-bar" key={name}>
        <label>{name}</label>
        <div className="need-bar-bg">
          <div 
            className={`need-bar-fill ${name}`}
            style={{ width: `${value}%` }}
          />
          <span className="need-value">{Math.round(value)}%</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="needs-display">
      {renderNeedBar('hunger', needs.hunger)}
      {renderNeedBar('thirst', needs.thirst)}
      {renderNeedBar('energy', needs.energy)}
    </div>
  );
};
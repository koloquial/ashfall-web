'use client';

import React, { useState } from 'react';

export default function CardGenerator() {
  const [cardType, setCardType] = useState('');
  const [subtype, setSubtype] = useState('');
  const [attack, setAttack] = useState(0);
  const [block, setBlock] = useState(0);
  const [health, setHealth] = useState(1);
  const [abilities, setAbilities] = useState([]);

  const handleAddAbility = (ability) => {
    if (!abilities.includes(ability)) {
      setAbilities([...abilities, ability]);
    }
  };

  return (
    <div className="card-generator">
      <h2>Card Generator</h2>

      {/* Card Type */}
      <div className="form-group">
        <label>Card Type</label>
        <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
          <option value="">-- Please Select --</option>
          <option value="Structure">Structure</option>
          <option value="Unit">Unit</option>
          <option value="Spell">Spell</option>
          <option value="Tactic">Tactic</option>
          <option value="Relic">Relic</option>
        </select>
      </div>

      {/* Subtype */}
      <div className="form-group">
        <label>Subtype</label>
        <select value={subtype} onChange={(e) => setSubtype(e.target.value)}>
          <option value="">-- Please Select --</option>
          <option value="Command">Command</option>
          <option value="Town Hall">Town Hall</option>
          <option value="Resource">Resource</option>
          <option value="Advanced Structure">Advanced Structure</option>
        </select>
      </div>

      {/* Command Structure Abilities & Stats */}
      {cardType === 'Structure' && subtype === 'Command' && (
        <>
          <div className="form-group">
            <label>Abilities</label>
            <button onClick={() => handleAddAbility('Draw')}>
              Add "Draw"
            </button>
            <ul>
              {abilities.map((ab, idx) => (
                <li key={idx}>{ab}</li>
              ))}
            </ul>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Attack</label>
              <input
                type="number"
                value={attack}
                onChange={(e) => setAttack(parseInt(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Block</label>
              <input
                type="number"
                value={block}
                onChange={(e) => setBlock(parseInt(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Health</label>
              <input
                type="number"
                value={health}
                onChange={(e) => setHealth(parseInt(e.target.value))}
              />
            </div>
          </div>
        </>
      )}

      <pre className="preview">
        {JSON.stringify(
          {
            type: cardType,
            subtype,
            attack,
            block,
            health,
            abilities,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}

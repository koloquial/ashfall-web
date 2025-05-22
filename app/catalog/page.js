'use client';
import { useEffect, useState } from 'react';
import './catalog.css';
import {
  FaPlusCircle, FaShieldAlt, FaCrosshairs,
  FaMountain, FaTree, FaCoins, FaDrumstickBite,
  FaHome, FaTools, FaHourglassHalf
} from 'react-icons/fa';

const ICONS = {
  health: <FaPlusCircle style={{ color: 'red' }} title="Health" />,
  block: <FaShieldAlt style={{ color: 'blue' }} title="Block" />,
  attack: <FaCrosshairs style={{ color: 'white' }} title="Attack" />,
  food: <FaDrumstickBite title="Food" />,
  shelter: <FaHome title="Shelter" />,
  wood: <FaTree title="Wood" />,
  stone: <FaMountain title="Stone" />,
  gold: <FaCoins title="Gold" />,
  buildTime: <FaTools title="Build Time" />,
  trainingTime: <FaHourglassHalf title="Training Time" />
};

const renderIconGrid = (obj = {}) =>
  Object.entries(obj).map(([key, val]) =>
    <div key={key} className="icon-box" title={key}>
      {ICONS[key]} {val}
    </div>
  );

export default function CardCatalogPage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.json())
      .then(setCards)
      .catch(console.error);
  }, []);

  console.log('CARDS:', JSON.stringify(cards))

  return (
    <div className="catalog">
      <div className="card-grid">
        {cards.map(card => (
          <div
            key={card.id}
            className="card"
            style={{ backgroundImage: `url(${card.image})` }}
          >
            <div className="card-overlay">
              {/* Header */}
              <div className="card-header-box">
                <div className="card-title">{card.name}</div>
                <div className="card-subtype">{card.type} - {card.subtype}</div>
              </div>

              <div className="card-bottom">
                {(() => {
                  const bars = [];

                  // 1. Resources OR Cost + Build/Train Time
                  bars.push(
                    <div className="card-bar" key="cost-time">
                      {card.type === "Structure" && card.subtype.toLowerCase() === "command" ? (
                        <div className="icon-grid">
                          <span className='card-label'>Resources</span>
                          {renderIconGrid(card.startingResources)}
                        </div>
                      ) : (
                        <>
                          <div className="icon-grid">
                            <span className='card-label'>Cost</span>
                            {renderIconGrid(card.cost)}
                          </div>
                          {card.buildTime && (
                            <div className="icon-box">
                              <span className='card-label'>Build Time</span>
                              {ICONS.buildTime} {card.buildTime}
                            </div>
                          )}
                          {card.trainingTime && (
                            <div className="icon-box">
                              <span className='card-label'>Training Time</span>
                              {ICONS.trainingTime} {card.trainingTime}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );

                  // 2. Upkeep / Requirements (Unit only)
                  if (card.type === "Unit") {
                    bars.push(
                      <div className="card-bar" key="upkeep">
                        <div className="icon-grid">
                          <span className='card-label'>Upkeep</span>
                          {renderIconGrid(card.upkeep)}
                        </div>
                        {card.requiresStructure && (
                          <div className="icon-box">
                            <span className='card-label'>Req</span> {card.requiresStructure}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // 3. Abilities
                  if (card.abilities?.length > 0) {
                    bars.push(
                      <div className="card-bar" key="abilities">
                        <div className="ability-grid">
                          <span className='card-label'>Abilities</span>
{card.abilities.map((a, i) => (
  <div key={i} className='card-ability'>
    {a.keyword}{" "}
    {typeof a.value === 'object'
      ? Object.entries(a.value).map(([k, v]) => `${k}: ${v}`).join(', ')
      : a.value}
  </div>
))}
                        </div>
                      </div>
                    );
                  }

                  // 4. Provides
                  if (card.provides) {
                    bars.push(
                      <div className="card-bar" key="provides">
                        <div className="icon-grid">
                          <span className='card-label'>Provides</span>
                          {renderIconGrid(card.provides)}
                        </div>
                      </div>
                    );
                  }

                  // Padding bars to always have 3 before stats
                  while (bars.length < 3) {
                    bars.push(
                      <div className="card-bar" key={`empty-${bars.length}`}>&nbsp;</div>
                    );
                  }

                  // 5. Final bar: Stats
                  bars.push(
                    <div className="card-bar card-footer" key="stats">
                        <div className="stat">{ICONS.attack} {card.stats?.attack}</div>
                        <div className="stat">{ICONS.block} {card.stats?.block}</div>
                        <div className="stat">{ICONS.health} {card.stats?.health}</div>
                    </div>
                  );

                  return bars;
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

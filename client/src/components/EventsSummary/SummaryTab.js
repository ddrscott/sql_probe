import './SummaryTab.css';
import '../../css/flex.css';
import React, { Component } from 'react';
import { TYPE_SQL } from '../../services/ProbeEvents';

const compareVisibleDuration = (a, b) => b.visibleDuration - a.visibleDuration;
const round = num => ((num * 100.0) | 0) / 100.0;

const sumVisibleDuration = items => {
  let visibleDuration = 0;
  for (let i = 0; i < items.length; i++) {
    visibleDuration += items[i].visibleDuration;
  }
  return visibleDuration;
}

class Aggregate {
  constructor(label, items, color, hoverKey) {
    this.label = label;
    this.items = items;
    this.color = color;
    this.hoverKey = hoverKey;
    this.visibleDuration = sumVisibleDuration(items);
  }

  addItem(item) {
    this.items.push(item);
    this.visibleDuration += item.visibleDuration;
  }
}


const MAX_SQL_STATEMENTS = 5;
const EMPTY = { totalDuration: 0.0, sortedItems: [] };
const bySql = (visibleItems=[]) => {
  if (visibleItems.length === 0) return EMPTY;

  let totalDuration = 0.0;
  const items = [];
  const sqlToEvent = new Map();

  for (let i = 0; i < visibleItems.length; ++i) {
    const item = visibleItems[i];

    if (item.event.type === TYPE_SQL) {
      totalDuration += item.visibleDuration;
      const { event: { sql, sqlHash } } = item;

      if (sqlToEvent.has(sqlHash)) {
        sqlToEvent.get(sqlHash).addItem(item);
      }
      else {
        const agg = new Aggregate(sql, [ item ], item.event.color, sqlHash);
        items.push(agg);
        sqlToEvent.set(sqlHash, agg);
      }
    }
  };

  const sortedItems = items.sort(compareVisibleDuration);
  if (sortedItems.length <= MAX_SQL_STATEMENTS) return { totalDuration, sortedItems };

  const otherAggs = sortedItems.slice(MAX_SQL_STATEMENTS);
  const otherAgg = new Aggregate('Other', otherAggs);

  return { totalDuration, sortedItems: sortedItems.slice(0, MAX_SQL_STATEMENTS).concat(otherAgg) };
}

class Row extends Component {
  onMouseEnterLeave = ({ type }) => {
    const { onHover, hoverKey } = this.props;
    onHover(type === 'mouseenter' ? hoverKey : null);
  }
  render() {
    const { color, count, depth, hoverKey, isExpandable, isExpanded, label,
      onClick, ratio, visibleDuration } = this.props;
    return (
      <div
        className='SummaryTab-row'
        data-hoverkey={hoverKey}
        onClick={onClick}
        onMouseEnter={this.onMouseEnterLeave}
        onMouseLeave={this.onMouseEnterLeave}
      >
        <div className='SummaryTab-cell SummaryTab-cell--duration flex flex--row'>
          <div
            className='SummaryTab-cellPct'
            style={{ transform: `scaleX(${ratio})` }}
          />
          <div className='flex-grow'>
            {round(visibleDuration)} ms
          </div>
          <div className='SummaryTab-cell--durationPct'>
            {round(ratio * 100.0)} %
          </div>
        </div>
        <div className='SummaryTab-cell SummaryTab-cell--count'>
          {count}
        </div>
        <div
          className='SummaryTab-cell SummaryTab-cell--label flex flex--row flex-content-center'
          style={{
            marginLeft: depth * 16 + 2
          }}
        >
          <div
            className={`
              SummaryTab-cellExpander
              ${isExpandable ? 'SummaryTab-cellExpander--expandable' : ''}
              ${isExpanded ? 'is-expanded' : ''}
            `}
          />
          <div className='SummaryTab-cellBox' style={{ color }}></div>
          <div className='flex-grow'>{label}</div>
        </div>
      </div>
    );
  }
}

class AggregateRow extends Component {
  state = {
    isExpanded: false
  }

  toggleExpanded = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const { isExpanded } = this.state;
    const { depth, aggregate, parentDuration, onHoverSql } = this.props;
    const { hoverKey, items, visibleDuration, label, color } = aggregate;
    const ratio = visibleDuration / parentDuration;
    const childDepth = depth + 1;
    return (
      <div>
        <Row
          color={color}
          count={items.length}
          depth={depth}
          hoverKey={hoverKey}
          isExpandable
          isExpanded={isExpanded}
          label={label}
          onClick={this.toggleExpanded}
          onHover={onHoverSql}
          ratio={ratio}
          visibleDuration={visibleDuration}
        />
        {isExpanded && items.sort(compareVisibleDuration).map((childItem, childIndex) =>
          renderRow({
            aggOrItem: childItem,
            depth: childDepth,
            key: childIndex,
            onHoverSql,
            parentDuration: visibleDuration
          })
        )}
      </div>
    );
  }
}

const renderRow = ({ aggOrItem, depth, key, onHoverSql, parentDuration }) => {
  // Aggregates with only one event are a single unexpandable row
  const item = (
    (aggOrItem instanceof Aggregate && aggOrItem.items.length === 1)
      ? aggOrItem.items[0]
      : aggOrItem
  );

  if (item instanceof Aggregate) {
    return (
      <AggregateRow
        aggregate={item}
        depth={depth}
        key={key}
        onHoverSql={onHoverSql}
        parentDuration={parentDuration}
      />
    )
  }

  // Assume item is a VisibleItem
  const { visibleDuration, event: { color, sql, sqlHash } } = item;
  return (
    <Row
      color={color}
      depth={depth}
      hoverKey={sqlHash}
      key={key}
      label={sql}
      onHover={onHoverSql}
      ratio={visibleDuration / parentDuration}
      visibleDuration={visibleDuration}
    />
  );
}

export default class extends Component {
  shouldComponentUpdate({ visibleEvents, hoveredSql, onHoverSql }){
    const { props } = this;
    return (
      visibleEvents !== props.visibleEvents
      || hoveredSql !== props.hoveredSql
      || onHoverSql !== props.onHoverSql
    )
  }

  render() {
    const { visibleEvents, hoveredSql, onHoverSql } = this.props;
    const { totalDuration, sortedItems } = bySql(visibleEvents);
    return (
      <div className='SummaryTab flex'>
        <div className='SummaryTab-row SummaryTab-row--header'>
          <div className='SummaryTab-cell SummaryTab-cell--duration'>
            Time
          </div>
          <div className='SummaryTab-cell SummaryTab-cell--count'>
            Count
          </div>
          <div className='SummaryTab-cell SummaryTab-cell--label'>
            SQL
          </div>
        </div>
        <div className='SummaryTab-rowContainer flex-grow'>
          {sortedItems.map((agg, i) =>
            renderRow({
              key: i,
              aggOrItem: agg,
              parentDuration: totalDuration,
              onHoverSql: onHoverSql,
              depth: 0
            })
          )}
        </div>
        {hoveredSql &&
          <style>{`
            .SummaryTab-row:not([data-hoverkey='${hoveredSql}']):not(.SummaryTab-row--header) {
              opacity: 0.25;
            }
          `}</style>
        }
      </div>
    );
  }
}

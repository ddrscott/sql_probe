import './SummaryTab.css';
import '../../css/flex.css';
import React, { Component } from 'react';
import { TYPE_SQL } from '../../services/ProbeEvents';

const EMPTY = { totalDuration: 0.0, sortedItems: [] };
const FILTERS = new Map([
  ['greater2ms', '> 2ms'],
  ['greater1count', '> 1 count']
]);
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

  add(item) {
    this.items.push(item);
    this.visibleDuration += item.visibleDuration;
  }
}

const aggregateBySql = (visibleItems, filters) => {
  if (visibleItems.length === 0) return EMPTY;

  let totalDuration = 0.0;
  const aggs = [];
  const sqlToEvent = new Map();

  for (let i = 0; i < visibleItems.length; ++i) {
    const item = visibleItems[i];

    if (item.event.type === TYPE_SQL) {
      totalDuration += item.visibleDuration;
      const { event: { sql, sqlHash } } = item;

      if (sqlToEvent.has(sqlHash)) {
        sqlToEvent.get(sqlHash).add(item);
      }
      else {
        const agg = new Aggregate(sql, [ item ], item.event.color, sqlHash);
        aggs.push(agg);
        sqlToEvent.set(sqlHash, agg);
      }
    }
  };

  const sortedItems = (
    aggs
      .filter(agg => !filters.has('greater2ms') || agg.visibleDuration > 2.0)
      .filter(agg => !filters.has('greater1count') || agg.items.length > 1)
      .sort(compareVisibleDuration)
  );
  return { totalDuration, sortedItems };
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

const FilterControls = ({ filters, onFilterChange }) => (
  <div className='SummaryTab-controlBar flex flex--row flex-content-center'>
    <span className='SummaryTab-controlLabel'>
      Filters
    </span>
    {[...FILTERS].map(([name, label], i) =>
      <span key={i} className='SummaryTab-control'>
        <input
          type='checkbox'
          checked={filters.has(name)}
          onChange={onFilterChange}
          data-filter={name}
        /> {label}
      </span>
    )}
  </div>
);

const TableHeader = () => (
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
);

const Table = ({ onHoverSql, visibleEvents, filters }) => {
  const { totalDuration, sortedItems } = aggregateBySql(visibleEvents, filters);
  return (
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
  )
};

export default class extends Component {
  state = {
    filters: new Set(FILTERS.keys())
  }

  onFilterChange = ({ target: { dataset: { filter } }}) => {
    const { filters } = this.state;
    filters[filters.has(filter) ? 'delete' : 'add'](filter);
    this.setState({ filters: new Set(filters) });
  }

  shouldComponentUpdate({ visibleEvents, hoveredSql, onHoverSql }, { filters }){
    const { props, state } = this;
    return (
      visibleEvents !== props.visibleEvents
      || hoveredSql !== props.hoveredSql
      || onHoverSql !== props.onHoverSql
      || filters !== state.filters
    )
  }

  render() {
    const { filters } = this.state;
    const { visibleEvents, hoveredSql, onHoverSql } = this.props;
    return (
      <div className='SummaryTab flex'>
        <FilterControls filters={filters} onFilterChange={this.onFilterChange} />
        <TableHeader />
        <Table onHoverSql={onHoverSql} visibleEvents={visibleEvents} filters={filters} />
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

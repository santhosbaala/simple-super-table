import React from 'react';
import R from 'ramda';

import SortIcon from './svg/sort-icon';

const renderHelpers = {
  // :: fn -> [String] -> String -> Bool -> {k : v} -> ReactElement
  renderHeader: R.curry((onClickHandler, sortableColKeys, sortColKey, sortAscending, column) => {
    const colKey = R.head(R.keys(column));
    const sortable = R.contains(colKey, sortableColKeys) ? 'sortable' : '';
    const sorted = colKey === sortColKey ? `sorted ${sortAscending ? 'asc' : 'desc'}` : '';
    const sortIcon = sortable ? <SortIcon size={12.5} sorted={colKey === sortColKey} ascending={sortAscending} /> : null;

    return (
      <th
        key={colKey}
        className={`col ${colKey} ${sortable} ${sorted}`}
        onClick={onClickHandler}
        data-col-key={colKey}
      >
        <div className="content">
          <div className="header">{column[colKey]}</div>
          <div className="sort-icon-container">{sortIcon}</div>
        </div>
      </th>
    );
  }),

  // :: Object -> String -> fn -> String -> fn -> {k: fn} -> filterText -> ReactElement
  renderCol: R.curry((rowData, primaryKey, onColumnClickHandler, columnClassGetter, columnRenderers, filterText, colKey) => {
    return (
      <td
        key={colKey}
        className={`col ${colKey} ${columnClassGetter(rowData[colKey], rowData, colKey)}`}
        onClick={onColumnClickHandler}
        data-col-key={colKey}
        data-primary-key={primaryKey}
        >{R.has(colKey, columnRenderers) ? columnRenderers[colKey](rowData[colKey], rowData, colKey, filterText) : R.ifElse(R.anyPass([R.isNil, R.isEmpty]), R.always('-'), (_) => _)(rowData[colKey])}</td>
    );
  }),

  // :: ((Object) -> String) -> [String] -> fn -> fn -> fn -> fn -> {k: fn} -> Object -> String -> ReactElement
  renderRow: R.curry((primaryKeyGen, colKeys, onRowClickHandler, onColumnClickHandler, rowClassGetter, columnClassGetter, columnRenderers, filterText, rowData) => {
    return (
      <tr
        key={primaryKeyGen(rowData)}
        className={`row ${rowClassGetter(rowData)}`}
        data-primary-key={primaryKeyGen(rowData)}
        onClick={onRowClickHandler}
      >{R.map(renderHelpers.renderCol(
        rowData,
        primaryKeyGen(rowData),
        onColumnClickHandler,
        columnClassGetter,
        columnRenderers,
        filterText
      ))(colKeys)}</tr>
    );
  }),
};

export default renderHelpers;

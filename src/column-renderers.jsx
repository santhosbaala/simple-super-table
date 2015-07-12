import React from 'react';
import R from 'ramda';

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// renderer for highlighting the filter text in the colData
// exposes .filter-highlight CSS class
export function filterTextHighlightRenderer(colData, _, __, filterText) {
  let children = null;
  colData = colData.toString();
  filterText = filterText.toString();

  if (!R.isEmpty(filterText) && filterText.match(new RegExp(escapeRegExp(filterText), 'gi'))) {
    const SENTINEL_BEG = '-|[', SENTINEL_END = ']|-';
    let marked = colData.replace(new RegExp(escapeRegExp(filterText), 'gi'), `${SENTINEL_BEG}$&${SENTINEL_END}`);
    children = [];
    while (marked.indexOf(SENTINEL_BEG) >= 0) {
      const left = marked.substring(0, marked.indexOf(SENTINEL_BEG));
      const mid = marked.substring(marked.indexOf(SENTINEL_BEG) + SENTINEL_BEG.length, marked.indexOf(SENTINEL_END));

      if (!R.isEmpty(left)) {
        children.push(<span key={children.length}>{left}</span>);
      }
      children.push(<span key={children.length} className="highlight">{mid}</span>);
      marked = marked.substring(marked.indexOf(SENTINEL_END) + SENTINEL_END.length);
    }
    if (!R.isEmpty(marked)) {
      children.push(<span key={children.length}>{marked}</span>);
    }
  } else {
    children = colData;
  }

  return <span className="filter-text-highlight">{children}</span>;
};
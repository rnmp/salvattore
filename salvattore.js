/*
Salvattore by @rnmp and @ppold
http://github.com/bandd/salvattore
*/

(function() {
  var addElement, addElements, add_columns, forEach, get_content, grids, media_query_change, media_rule_has_columns_selector, proto, remove_columns, scan_media_queries, slice;

  get_content = function(element) {
    var className, content, matchResult, numberOfColumns;
    content = window.getComputedStyle(element).getPropertyValue('content').slice(1, -1);
    matchResult = content.match(/^\s*(\d+)(?:\s?\.(.+))?\s*$/);
    if (matchResult) {
      numberOfColumns = matchResult[1];
      className = matchResult[2] || 'column';
    } else {
      matchResult = content.match(/^\s*\.(.+)\s+(\d+)\s*$/);
      className = matchResult[1];
      numberOfColumns = matchResult[2];
    }
    return {
      numberOfColumns: +numberOfColumns,
      className: className
    };
  };

  add_columns = function(element) {
    var columnClass, columns, dataColumnsContent, elements, i;
    dataColumnsContent = get_content(element);
    columns = dataColumnsContent.numberOfColumns;
    columnClass = dataColumnsContent.className;
    elements = [];
    i = columns;
    while (i-- !== 0) {
      elements.push(element.querySelectorAll('[data-columns] > *:nth-child(' + columns + 'n-' + i + ')'));
    }
    forEach.call(elements, function(columnElements) {
      var column;
      column = document.createElement('div');
      column.classList.add(columnClass);
      forEach.call(columnElements, function(element) {
        return column.appendChild(element);
      });
      return element.appendChild(column);
    });
    return element.dataset.columns = columns;
  };

  remove_columns = function(element) {
    var children, i, ncol, orderedChildren;
    children = element.children;
    ncol = children.length;
    orderedChildren = new Array(children[0].children.length * element.dataset.columns);
    forEach.call(children, function(child, i) {
      return forEach.call(child.children, function(child, j) {
        return orderedChildren[j * ncol + i] = child;
      });
    });
    orderedChildren.forEach(function(child) {
      if (child != null) {
        return element.appendChild(child);
      }
    });
    i = ncol;
    while (i-- !== 0) {
      element.removeChild(children[0]);
    }
  };

  media_rule_has_columns_selector = function(rules) {
    var i;
    i = rules.length;
    while (i-- !== 0) {
      if (rules[i].selectorText.match(/\[data-columns\]$/)) {
        return true;
      }
    }
    return false;
  };

  media_query_change = function(mql) {
    if (mql.matches) {
      return grids.forEach(function(grid) {
        remove_columns(grid);
        return add_columns(grid);
      });
    }
  };

  scan_media_queries = function() {
    var mediaQueries, stylesheets;
    stylesheets = slice.call(document.querySelectorAll('style[type="text/css"]')).concat(slice.call(document.querySelectorAll('link[rel="stylesheet"]')));
    mediaQueries = [];
    forEach.call(stylesheets, function(stylesheet) {
      return forEach.call(stylesheet.sheet.cssRules, function(rule) {
        if (rule.media && media_rule_has_columns_selector(rule.cssRules)) {
          return mediaQueries.push(window.matchMedia(rule.media.mediaText));
        }
      });
    });
    return mediaQueries.forEach(function(mql) {
      return mql.addListener(media_query_change);
    });
  };

  addElements = function(grid, elements) {
    return elements.forEach(function(element) {
      return addElement(element);
    });
  };

  addElement = function(grid, element) {
    var child, children, currentRowCount, highestRowCount, i, m, _i, _len;
    children = grid.children;
    m = children.length;
    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
      child = children[i];
      currentRowCount = child.children.length;
      if (i !== 0 && highestRowCount > currentRowCount) {
        break;
      } else if (i === (m - 1)) {
        child = children[0];
        break;
      }
      highestRowCount = currentRowCount;
    }
    return child.appendChild(element);
  };

  proto = Array.prototype;

  forEach = proto.forEach;

  slice = proto.slice;

  grids = slice.call(document.querySelectorAll('[data-columns]'));

  grids.forEach(function(grid) {
    return add_columns(grid);
  });

  scan_media_queries();

  window['datacolumns'] = {
    addElement: addElement,
    addElements: addElements
  };

  window['test'] = function() {
    var el;
    el = document.createElement('article');
    el.classList.add('_item');
    el.innerHTML = 'Item #001';
    return window['datacolumns'].addElement(document.querySelectorAll('[data-columns]')[0], el);
  };

}).call(this);
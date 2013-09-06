// Generated by CoffeeScript 1.6.2
/*
 * Salvattore by @rnmp and @ppold
 * http://github.com/bandd/salvattore
*/


(function() {
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define(factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.salvattore = factory();
    }
  })(this, function() {
    var add_columns, add_to_dataset, append_elements, create_list_of_fragments, get_css_rules, get_stylesheets, grids, media_query_change, media_rule_has_columns_selector, next_element_column_index, obtain_grid_settings, prepend_elements, recreate_columns, register_grid, remove_columns, scan_media_queries, setup;

    grids = [];
    add_to_dataset = function(element, key, value) {
      var dataset;

      dataset = element.dataset;
      if (dataset) {
        return dataset[key] = value;
      } else {
        return element.setAttribute("data-" + key, value);
      }
    };
    obtain_grid_settings = function(element) {
      var columnClasses, computedStyle, content, matchResult, numberOfColumns, _ref, _ref1;

      computedStyle = getComputedStyle(element, ':before');
      content = computedStyle.getPropertyValue('content').slice(1, -1);
      matchResult = content.match(/^\s*(\d+)(?:\s?\.(.+))?\s*$/);
      if (matchResult) {
        numberOfColumns = matchResult[1];
        columnClasses = ((_ref = matchResult[2]) != null ? _ref.split('.') : void 0) || ['column'];
      } else {
        matchResult = content.match(/^\s*\.(.+)\s+(\d+)\s*$/);
        columnClasses = matchResult[1];
        numberOfColumns = (_ref1 = matchResult[2]) != null ? _ref1.split('.') : void 0;
      }
      return {
        numberOfColumns: numberOfColumns,
        columnClasses: columnClasses
      };
    };
    add_columns = function(grid, items) {
      var columnClasses, columnsFragment, columnsItems, i, numberOfColumns, selector, _ref;

      _ref = obtain_grid_settings(grid), numberOfColumns = _ref.numberOfColumns, columnClasses = _ref.columnClasses;
      columnsItems = new Array(+numberOfColumns);
      console.log('settings', numberOfColumns, columnClasses);
      i = numberOfColumns;
      while (i-- !== 0) {
        selector = "[data-columns] > *:nth-child(" + numberOfColumns + "n-" + i + ")";
        columnsItems.push(items.querySelectorAll(selector));
      }
      columnsFragment = document.createDocumentFragment();
      columnsItems.forEach(function(rows) {
        var column, rowsFragment;

        column = document.createElement('div');
        column.className = columnClasses.join(' ');
        rowsFragment = document.createDocumentFragment();
        Array.prototype.forEach.call(rows, function(row) {
          return rowsFragment.appendChild(row);
        });
        column.appendChild(rowsFragment);
        return columnsFragment.appendChild(column);
      });
      grid.appendChild(columnsFragment);
      return add_to_dataset(grid, 'columns', numberOfColumns);
    };
    remove_columns = function(grid) {
      var columns, container, numberOfColumns, numberOfRowsInFirstColumn, range, sortedRows;

      range = document.createRange();
      range.selectNodeContents(grid);
      columns = Array.prototype.filter.call(range.extractContents().childNodes, function(node) {
        return node instanceof HTMLElement;
      });
      numberOfColumns = columns.length;
      numberOfRowsInFirstColumn = columns[0].childNodes.length;
      sortedRows = new Array(numberOfRowsInFirstColumn * numberOfColumns);
      Array.prototype.forEach.call(columns, function(column, columnIndex) {
        return Array.prototype.forEach.call(column.children, function(row, rowIndex) {
          return sortedRows[rowIndex * numberOfColumns + columnIndex] = row;
        });
      });
      container = document.createElement('div');
      add_to_dataset(container, 'columns', 0);
      sortedRows.filter(function(child) {
        return child != null;
      }).forEach(function(child) {
        return container.appendChild(child);
      });
      return container;
    };
    recreate_columns = function(grid) {
      return requestAnimationFrame(function() {
        var items;

        items = remove_columns(grid);
        return add_columns(grid, items);
      });
    };
    media_query_change = function(mql) {
      if (mql.matches) {
        return Array.prototype.forEach.call(grids, recreate_columns);
      }
    };
    get_css_rules = function(stylesheet) {
      var cssRules, e;

      try {
        cssRules = stylesheet.sheet.cssRules;
      } catch (_error) {
        e = _error;
        return [];
      }
      if (cssRules) {
        return cssRules;
      } else {
        return [];
      }
    };
    get_stylesheets = function() {
      return Array.prototype.concat.call(Array.prototype.slice.call(document.querySelectorAll('style[type="text/css"]')), Array.prototype.slice.call(document.querySelectorAll('link[rel="stylesheet"]')));
    };
    media_rule_has_columns_selector = function(rules) {
      var i, rule;

      i = rules.length;
      while (i--) {
        rule = rules[i];
        if (rule.selectorText.match(/\[data-columns\](.*)::?before$/)) {
          return true;
        }
      }
      return false;
    };
    scan_media_queries = function() {
      var mediaQueries;

      if (typeof matchMedia === "undefined" || matchMedia === null) {
        return;
      }
      mediaQueries = [];
      get_stylesheets().forEach(function(stylesheet) {
        return Array.prototype.forEach.call(get_css_rules(stylesheet), function(rule) {
          if ((rule.media != null) && media_rule_has_columns_selector(rule.cssRules)) {
            return mediaQueries.push(matchMedia(rule.media.mediaText));
          }
        });
      });
      return mediaQueries.forEach(function(mql) {
        return mql.addListener(media_query_change);
      });
    };
    next_element_column_index = function(grid, element) {
      var child, children, currentRowCount, highestRowCount, i, m, _i, _len;

      children = grid.children;
      m = children.length;
      for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
        child = children[i];
        currentRowCount = child.children.length;
        if (i !== 0 && highestRowCount > currentRowCount) {
          break;
        } else if ((i + 1) === m) {
          i = 0;
          break;
        }
        highestRowCount = currentRowCount;
      }
      return i;
    };
    create_list_of_fragments = function(quantity) {
      var fragments, i;

      fragments = new Array(quantity);
      i = 0;
      while (i !== quantity) {
        fragments[i] = document.createDocumentFragment();
        i++;
      }
      return fragments;
    };
    append_elements = function(grid, elements) {
      var columnIndex, columns, fragments, numberOfColumns;

      columns = grid.children;
      numberOfColumns = columns.length;
      fragments = create_list_of_fragments(numberOfColumns);
      columnIndex = next_element_column_index(grid, elements[0]);
      elements.forEach(function(element) {
        fragments[columnIndex].appendChild(element);
        if (columnIndex === (numberOfColumns - 1)) {
          return columnIndex = 0;
        } else {
          return columnIndex++;
        }
      });
      return Array.prototype.forEach.call(columns, function(column, columnIndex) {
        return column.appendChild(fragments[columnIndex]);
      });
    };
    prepend_elements = function(grid, elements) {
      var columnIndex, columns, fragment, fragments, numberOfColumns, numberOfColumnsToExtract;

      columns = grid.children;
      numberOfColumns = columns.length;
      fragments = create_list_of_fragments(numberOfColumns);
      columnIndex = numberOfColumns - 1;
      elements.forEach(function(element) {
        var fragment;

        fragment = fragments[columnIndex];
        fragment.insertBefore(element, fragment.firstChild);
        if (columnIndex === 0) {
          return columnIndex = numberOfColumns - 1;
        } else {
          return columnIndex--;
        }
      });
      Array.prototype.forEach.call(columns, function(column, columnIndex) {
        return column.insertBefore(fragments[columnIndex], column.firstChild);
      });
      fragment = document.createDocumentFragment();
      numberOfColumnsToExtract = elements.length % numberOfColumns;
      while (numberOfColumnsToExtract-- !== 0) {
        fragment.appendChild(grid.lastChild);
      }
      return grid.insertBefore(fragment, grid.firstChild);
    };
    register_grid = function(grid) {
      var items, range;

      if (getComputedStyle(grid).display === 'none') {
        return;
      }
      range = document.createRange();
      range.selectNodeContents(grid);
      items = document.createElement('div');
      items.appendChild(range.extractContents());
      add_to_dataset(items, 'columns', 0);
      add_columns(grid, items);
      return grids.push(grid);
    };
    setup = function() {
      Array.prototype.forEach.call(document.querySelectorAll('[data-columns]'), register_grid);
      return scan_media_queries();
    };
    setup();
    return {
      append_elements: append_elements,
      prepend_elements: prepend_elements,
      register_grid: register_grid,
      recreate_columns: recreate_columns
    };
  });

}).call(this);

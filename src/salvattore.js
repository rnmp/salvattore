/* jshint laxcomma: true */
var salvattore = (function (global, document, undefined) {
"use strict";

var self = {},
    grids = [],
    mediaRules = [],
    mediaQueries = [],
    balanced = false,
    addToDataset = function(element, key, value) {
      // uses dataset function or a fallback for <ie10
      if (element.dataset) {
        element.dataset[key] = value;
      } else {
        element.setAttribute("data-" + key, value);
      }
      return;
    },
    getFromDataset = function(element, key, value) {
      // uses dataset function or a fallback for <ie10
      if (element.dataset) {
        return element.dataset[key];
      } else {
        return element.setAttribute("data-" + key);
      }
    };


self.obtainGridSettings = function obtainGridSettings(element) {
  // returns the number of columns and the classes a column should have,
  // from computing the style of the ::before pseudo-element of the grid.

  var computedStyle = global.getComputedStyle(element, ":before")
    , content = computedStyle.getPropertyValue("content").slice(1, -1)
    , settingsRegex = /^\s*(\d+)((?:\s*(?:\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*))+)\s*(balanced)?\s*$/
    , matchResult = content.match(settingsRegex)
    , numberOfColumns = '1'
    , columnClasses = []
    , balanced = false
  ;

  if (matchResult) {
    numberOfColumns = matchResult[1];

    columnClasses = matchResult[2].trim();
    columnClasses = columnClasses.split(".");
    // To remove empty first element
    columnClasses.shift();
     // Trim spaces on all
    columnClasses = columnClasses.map(Function.prototype.call, String.prototype.trim);

    if (matchResult[3] && matchResult[3] === "balanced") {
      balanced = true;
    }
  } else {
    columnClasses = ["column"];
  }

  return {
    numberOfColumns: numberOfColumns,
    columnClasses: columnClasses,
    balanced: balanced
  };
};


self.addColumns = function addColumns(grid, items) {
  // from the settings obtained, it creates columns with
  // the configured classes and adds to them a list of items.

  var settings = self.obtainGridSettings(grid)
    , numberOfColumns = settings.numberOfColumns
    , columnClasses = settings.columnClasses
    , columnsItems = new Array(+numberOfColumns)
    , columnsFragment = document.createDocumentFragment()
    , i = numberOfColumns
    , selector
  ;

  self.balanced = settings.balanced;

  if (self.balanced) {
    while (i-- !== 0) {
      var column = document.createElement("div");
      column.className = columnClasses.join(" ");
      columnsFragment.appendChild(column);
    }

    grid.appendChild(columnsFragment);
    self.appendElements(grid, Array.prototype.slice.call(items.children));
  } else { // by order
    while (i-- !== 0) {
      selector = "[data-columns] > *:nth-child(" + numberOfColumns + "n-" + i + ")";
      columnsItems.push(items.querySelectorAll(selector));
    }

    columnsItems.forEach(function appendToGridFragment(rows) {
      var column = document.createElement("div")
        , rowsFragment = document.createDocumentFragment()
      ;

      column.className = columnClasses.join(" ");

      Array.prototype.forEach.call(rows, function appendToColumn(row) {
        rowsFragment.appendChild(row);
      });
      column.appendChild(rowsFragment);
      columnsFragment.appendChild(column);
    });

    grid.appendChild(columnsFragment);
  }

  addToDataset(grid, 'columns', numberOfColumns);
};


self.removeColumns = function removeColumns(grid) {
  // removes all the columns from a grid, and returns a list
  // of items sorted by the ordering of columns.

  var range = document.createRange();
  range.selectNodeContents(grid);

  var columns = Array.prototype.filter.call(range.extractContents().childNodes, function filterElements(node) {
    return node instanceof global.HTMLElement;
  });

  var numberOfColumns = columns.length
    , numberOfRowsInFirstColumn = columns[0].childNodes.length
    , sortedRows = new Array(numberOfRowsInFirstColumn * numberOfColumns)
  ;

  Array.prototype.forEach.call(columns, function iterateColumns(column, columnIndex) {
    Array.prototype.forEach.call(column.children, function iterateRows(row, rowIndex) {
      sortedRows[rowIndex * numberOfColumns + columnIndex] = row;
    });
  });

  var container = document.createElement("div");
  addToDataset(container, 'columns', 0);

  sortedRows.filter(function filterNonNull(child) {
    return !!child;
  }).forEach(function appendRow(child) {
    container.appendChild(child);
  });

  return container;
};


self.recreateColumns = function recreateColumns(grid) {
  // removes all the columns from the grid, and adds them again,
  // it is used when the number of columns change.

  global.requestAnimationFrame(function renderAfterCssMediaQueryChange() {
    self.addColumns(grid, self.removeColumns(grid));
    var columnsChange = new CustomEvent("columnsChange");
    grid.dispatchEvent(columnsChange);
  });
};


self.mediaQueryChange = function mediaQueryChange(mql) {
  // recreates the columns when a media query matches the current state
  // of the browser.

  if (mql.matches) {
    Array.prototype.forEach.call(grids, self.recreateColumns);
  }
};


self.getCSSRules = function getCSSRules(stylesheet) {
  // returns a list of css rules from a stylesheet

  var cssRules;
  try {
    cssRules = stylesheet.sheet.cssRules || stylesheet.sheet.rules;
  } catch (e) {
    return [];
  }

  return cssRules || [];
};


self.getStylesheets = function getStylesheets() {
  // returns a list of all the styles in the document (that are accessible).

  var inlineStyleBlocks = Array.prototype.slice.call(document.querySelectorAll("style"));
  inlineStyleBlocks.forEach(function(stylesheet, idx) {
    if (stylesheet.type !== 'text/css' && stylesheet.type !== '') {
      inlineStyleBlocks.splice(idx, 1);
    }
  });

  return Array.prototype.concat.call(
    inlineStyleBlocks,
    Array.prototype.slice.call(document.querySelectorAll("link[rel='stylesheet']"))
  );
};


self.mediaRuleHasColumnsSelector = function mediaRuleHasColumnsSelector(rules) {
  // checks if a media query css rule has in its contents a selector that
  // styles the grid.

  var i, rule;

  try {
    i = rules.length;
  }
  catch (e) {
    i = 0;
  }

  while (i--) {
    rule = rules[i];
    if (rule.selectorText && rule.selectorText.match(/\[data-columns\](.*)::?before$/)) {
      return true;
    }
  }

  return false;
};


self.scanMediaQueries = function scanMediaQueries() {
  // scans all the stylesheets for selectors that style grids,
  // if the matchMedia API is supported.

  var newMediaRules = [];

  if (!global.matchMedia) {
    return;
  }

  self.getStylesheets().forEach(function extractRules(stylesheet) {
    Array.prototype.forEach.call(self.getCSSRules(stylesheet), function filterByColumnSelector(rule) {
      if (rule.media && rule.cssRules && self.mediaRuleHasColumnsSelector(rule.cssRules)) {
        newMediaRules.push(rule);
      }
    });
  });

  // remove matchMedia listeners from the old rules
  var oldRules = mediaRules.filter(function (el) {
      return newMediaRules.indexOf(el) === -1;
  });
  mediaQueries.filter(function (el) {
    return oldRules.indexOf(el.rule) !== -1;
  }).forEach(function (el) {
      el.mql.removeListener(self.mediaQueryChange);
  });
  mediaQueries = mediaQueries.filter(function (el) {
    return oldRules.indexOf(el.rule) === -1;
  });

  // add matchMedia listeners to the new rules
  newMediaRules.filter(function (el) {
    return mediaRules.indexOf(el) == -1;
  }).forEach(function (rule) {
      var mql = global.matchMedia(rule.media.mediaText);
      mql.addListener(self.mediaQueryChange);
      mediaQueries.push({rule: rule, mql:mql});
  });

  // swap mediaRules with the new set
  mediaRules.length = 0;
  mediaRules = newMediaRules;
};


self.rescanMediaQueries = function rescanMediaQueries() {
    self.scanMediaQueries();
    Array.prototype.forEach.call(grids, self.recreateColumns);
};


self.nextElementColumnIndex = function nextElementColumnIndex(grid, fragments) {
  // returns the index of the column where the given element must be added.

  var children = grid.children
    , m = children.length
    , lowestRowCount = 0
    , child
    , currentRowCount
    , i
    , index = 0
    , colsHeight = []
    , minColHeight
  ;

  var getPossibleHeight = function getPossibleHeight(el) {
    colsHeight[i] += self.getHeightFromElement(el);
  };

  if (self.balanced) {
    for (i = 0; i < m; i++) {
      // get used height
      colsHeight[i] = self.getHeightFromElement(children[i]);
      // get probably used height
      Array.prototype.forEach.call(fragments[i].childNodes, getPossibleHeight);
    }
    minColHeight = Math.min.apply(Math, colsHeight);
    // we assume height were available if we have something
    // so we return the index of the column with the shortest height
    if (minColHeight > 0) {
      return colsHeight.indexOf(minColHeight);
    }
  }

  // Fallback to order or use it by default
  for (i = 0; i < m; i++) {
    child = children[i];
    currentRowCount = child.children.length + (fragments[i].children || fragments[i].childNodes).length;
  if(lowestRowCount === 0) {
    lowestRowCount = currentRowCount;
  }
    if(currentRowCount < lowestRowCount) {
      index = i;
      lowestRowCount = currentRowCount;
    }
  }

  return index;
};


self.createFragmentsList = function createFragmentsList(quantity) {
  // returns a list of fragments

  var fragments = new Array(quantity)
    , i = 0
  ;

  while (i !== quantity) {
    fragments[i] = document.createDocumentFragment();
    i++;
  }

  return fragments;
};


self.appendElements = function appendElements(grid, elements) {
  // adds a list of elements to the end of a grid

  var columns = grid.children
    , numberOfColumns = columns.length
    , fragments = self.createFragmentsList(numberOfColumns)
    , heightContainer = document.createElement("div")
  ;

  if (self.balanced) {
    // Append all items to a column to be able to retrieve proper height
    // (if you try to do that hidden from the screen, you can miss the good DOM/CSS context)
    heightContainer.className = self.obtainGridSettings(grid).columnClasses.join(" ");
    heightContainer.appendChild(self.createFragment(elements));
    grid.appendChild(heightContainer);
    self.saveElementsHeight(elements);
    grid.removeChild(heightContainer);
  }

  Array.prototype.forEach.call(elements, function appendToNextFragment(element) {
    var columnIndex = self.nextElementColumnIndex(grid, fragments);
    fragments[columnIndex].appendChild(element);
  });

  Array.prototype.forEach.call(columns, function insertColumn(column, index) {
    column.appendChild(fragments[index]);
  });
};


self.prependElements = function prependElements(grid, elements) {
  // adds a list of elements to the start of a grid

  var columns = grid.children
    , numberOfColumns = columns.length
    , fragments = self.createFragmentsList(numberOfColumns)
    , columnIndex = numberOfColumns - 1
  ;

  elements.forEach(function appendToNextFragment(element) {
    var fragment = fragments[columnIndex];
    fragment.insertBefore(element, fragment.firstChild);
    if (columnIndex === 0) {
      columnIndex = numberOfColumns - 1;
    } else {
      columnIndex--;
    }
  });

  Array.prototype.forEach.call(columns, function insertColumn(column, index) {
    column.insertBefore(fragments[index], column.firstChild);
  });

  // populates a fragment with n columns till the right
  var fragment = document.createDocumentFragment()
    , numberOfColumnsToExtract = elements.length % numberOfColumns
  ;

  while (numberOfColumnsToExtract-- !== 0) {
    fragment.appendChild(grid.lastChild);
  }

  // adds the fragment to the left
  grid.insertBefore(fragment, grid.firstChild);
};


self.registerGrid = function registerGrid (grid) {
  if (global.getComputedStyle(grid).display === "none") {
    return;
  }

  // retrieve the list of items from the grid itself
  var range = document.createRange();
  range.selectNodeContents(grid);

  var items = document.createElement("div");
  items.appendChild(range.extractContents());

  addToDataset(items, 'columns', 0);
  self.addColumns(grid, items);
  grids.push(grid);
};

self.createFragment = function createFragment (elements) {
  var frag = document.createDocumentFragment();
  Array.prototype.forEach.call(elements, function createFragmentLoop(element) {
    frag.appendChild(element);
  });
  return frag;
};

self.getHeightFromElement = function getHeightFromElement(el) {
  var height = el.getBoundingClientRect().height;
  if (!height) {
    var h = getFromDataset(el, "salvatorreHeight");
    if (h) {
      height = parseInt(h, 10);
    }
  }
  return height;
};

self.saveElementsHeight = function saveElementsHeight (elements) {
  Array.prototype.forEach.call(elements, function saveElementsHeight(el) {
    addToDataset(el, "salvatorreHeight", Math.floor(el.getBoundingClientRect().height));
  });
};

self.init = function init() {
  // adds required CSS rule to hide 'content' based
  // configuration.

  var css = document.createElement("style");
  css.innerHTML = "[data-columns]::before{display:block;visibility:hidden;position:absolute;font-size:1px;}";
  document.head.appendChild(css);

  // scans all the grids in the document and generates
  // columns from their configuration.

  var gridElements = document.querySelectorAll("[data-columns]");
  Array.prototype.forEach.call(gridElements, self.registerGrid);
  self.scanMediaQueries();
};

self.init();

return {
  appendElements: self.appendElements,
  prependElements: self.prependElements,
  registerGrid: self.registerGrid,
  recreateColumns: self.recreateColumns,
  rescanMediaQueries: self.rescanMediaQueries,
  init: self.init,

  // maintains backwards compatibility with underscore style method names
  append_elements: self.appendElements,
  prepend_elements: self.prependElements,
  register_grid: self.registerGrid,
  recreate_columns: self.recreateColumns,
  rescan_media_queries: self.rescanMediaQueries,

  _test: {
    obtainGridSettings: self.obtainGridSettings
  }
};

})(window, window.document);

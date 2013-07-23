###
 * Salvattore by @rnmp and @ppold
 * http://github.com/bandd/salvattore
###

((root, factory) ->
  if typeof define is 'function' and define.amd
    define(factory)
  else if typeof exports is 'object'
    module.exports = factory()
  else
    root.returnExports = factory()
)(this, ->
  add_to_dataset = (element, key, value) ->
    dataset = element.dataset
    if dataset
      return dataset[key] = value
    else
      return element.setAttribute("data-#{key}", value)

  get_from_dataset = (element, key) ->
    dataset = element.dataset
    if dataset
      return dataset[key]
    else
      return element.getAttribute("data-#{key}")

  obtain_grid_settings = (element) ->
    computedStyle = getComputedStyle(element, ':before')
    content = computedStyle.getPropertyValue('content').slice(1, -1)
    matchResult = content.match(/^\s*(\d+)(?:\s?\.(.+))?\s*$/)

    if matchResult
      numberOfColumns = matchResult[1]
      columnClasses = matchResult[2]?.split('.') or ['column']
    else
      matchResult = content.match(/^\s*\.(.+)\s+(\d+)\s*$/)
      columnClasses = matchResult[1]
      numberOfColumns = matchResult[2]?.split('.')

    return { numberOfColumns, columnClasses }

  add_columns = (element, items) ->
    {numberOfColumns, columnClasses} = obtain_grid_settings(element)
    elements = new Array(+numberOfColumns)

    unless items
      # retrieve the list of items from the element itself
      items = element

      range = document.createRange()
      range.selectNodeContents(items)
      items = document.createElement('div')
      items.appendChild(range.extractContents())
      add_to_dataset(items, 'columns', 0)

      columns = Array::filter.call(items.childNodes, (node) ->
        node instanceof HTMLElement
      )

    i = numberOfColumns
    while i-- isnt 0
      selector = "[data-columns] > *:nth-child(#{numberOfColumns}n-#{i})"
      elements.push items.querySelectorAll(selector)

    columnsFragment = document.createDocumentFragment()

    elements.forEach (rows) ->
      column = document.createElement('div')
      column.className = columnClasses.join(' ')

      rowsFragment = document.createDocumentFragment()
      Array::forEach.call(rows, (row) ->
        rowsFragment.appendChild(row)
      )
      column.appendChild(rowsFragment)

      columnsFragment.appendChild(column)

    element.appendChild(columnsFragment)

    add_to_dataset(element, 'columns', numberOfColumns)

  remove_columns = (element) ->
    range = document.createRange()
    range.selectNodeContents(element)
    element = range.extractContents()

    columns = Array::filter.call(element.childNodes, (node) ->
      node instanceof HTMLElement
    )

    numberOfColumns = columns.length
    numberOfRowsInFirstColumn = columns[0].childNodes.length
    sortedRows = new Array(numberOfRowsInFirstColumn*numberOfColumns)

    Array::forEach.call(columns, (column, columnIndex) ->
      Array::forEach.call(column.children, (row, rowIndex) ->
        sortedRows[rowIndex*numberOfColumns+columnIndex] = row
      )
    )

    container = document.createElement('div')
    add_to_dataset(container, 'columns', 0)

    sortedRows.filter((child) -> child?).forEach (child) ->
      container.appendChild(child)

    return container

  recreate_columns = (grid) ->
    add_columns(grid, remove_columns(grid))

  media_query_change = (mql) ->
    if mql.matches
      Array::forEach.call(grids, recreate_columns)

  get_css_rules = (stylesheet) ->
    try
      cssRules = stylesheet.sheet.cssRules
    catch e
      return []

    if cssRules
      return cssRules
    else
      return []

  get_stylesheets = ->
    return Array::concat.call(
      Array::slice.call(document.querySelectorAll('style[type="text/css"]')),
      Array::slice.call(document.querySelectorAll('link[rel="stylesheet"]'))
    )

  media_rule_has_columns_selector = (rules) ->
    i = rules.length
    while i--
      rule = rules[i]
      if rule.selectorText.match(/\[data-columns\](.*)::?before$/)
        return true

    return false

  scan_media_queries = ->
    return unless matchMedia?

    mediaQueries = []
    get_stylesheets().forEach (stylesheet) ->
      Array::forEach.call(get_css_rules(stylesheet), (rule) ->
        if rule.media? and media_rule_has_columns_selector(rule.cssRules)
          mediaQueries.push matchMedia(rule.media.mediaText)
      )

    mediaQueries.forEach (mql) ->
      mql.addListener(media_query_change)

  next_element_column_index = (grid, element) ->
    children = grid.children
    m = children.length

    for own child, i in children
      currentRowCount = child.children.length
      if i isnt 0 and highestRowCount > currentRowCount
        break
      else if (i+1) is m
        i = 0
        break

      highestRowCount = currentRowCount

    return i

  create_list_of_fragments = (quantity) ->
    fragments = new Array(quantity)

    i = 0
    while i isnt quantity
      fragments[i] = document.createDocumentFragment()
      i++

    return fragments

  append_elements = (grid, elements) ->
    columns = grid.children
    numberOfColumns = columns.length
    fragments = create_list_of_fragments(numberOfColumns)

    columnIndex = next_element_column_index(grid, elements[0])
    elements.forEach (element) ->
      fragments[columnIndex].appendChild(element)
      if columnIndex is (numberOfColumns - 1)
        columnIndex = 0
      else
        columnIndex++

    Array::forEach.call(columns, (column, columnIndex) ->
      column.appendChild(fragments[columnIndex])
    )

  prepend_elements = (grid, elements) ->
    columns = grid.children
    numberOfColumns = columns.length
    fragments = create_list_of_fragments(numberOfColumns)

    columnIndex = numberOfColumns - 1
    elements.forEach (element) ->
      fragment = fragments[columnIndex]
      fragment.insertBefore(element, fragment.firstChild)
      if columnIndex is 0
        columnIndex = numberOfColumns - 1
      else
        columnIndex--

    Array::forEach.call(columns, (column, columnIndex) ->
      column.insertBefore(fragments[columnIndex], column.firstChild)
    )

    # populates a fragment with n columns till the right
    fragment = document.createDocumentFragment()
    numberOfColumnsToExtract = elements.length % numberOfColumns
    while numberOfColumnsToExtract-- isnt 0
      fragment.appendChild(grid.lastChild)

    # adds the fragment to the left
    grid.insertBefore(fragment, grid.firstChild)

  grids = null

  setup = ->
    grids = document.querySelectorAll('[data-columns]')
    Array::forEach.call(grids, add_columns)
    scan_media_queries()

  setup()

  return { append_elements, prepend_elements }
)
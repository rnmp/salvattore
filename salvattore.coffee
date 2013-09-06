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
		root.salvattore = factory()
)(this, ->

	grids = []

	add_to_dataset = (element, key, value) ->
		# adds a data attribute using the dataset API,
		# otherwise it adds it using the Element.setAttribute method.

		dataset = element.dataset
		if dataset
			return dataset[key] = value
		else
			return element.setAttribute("data-#{key}", value)

	obtain_grid_settings = (element) ->
		# returns the number of columns and the classes a column should have,
		# from computing the style of the ::before pseudo-element of the grid.

		computedStyle = getComputedStyle(element, ':before')
		content = computedStyle.getPropertyValue('content').slice(1, -1)
		# console.log 'content:', computedStyle.getPropertyValue('content')
		matchResult = content.match(/^\s*(\d+)(?:\s?\.(.+))?\s*$/)

		if matchResult
			numberOfColumns = matchResult[1]
			columnClasses = matchResult[2]?.split('.') or ['column']
		else
			matchResult = content.match(/^\s*\.(.+)\s+(\d+)\s*$/)
			columnClasses = matchResult[1]
			numberOfColumns = matchResult[2]?.split('.')

		return { numberOfColumns, columnClasses }

	add_columns = (grid, items) ->
		# from the settings obtained, it creates columns with
		# the configured classes and adds to them a list of items.

		{numberOfColumns, columnClasses} = obtain_grid_settings(grid)
		columnsItems = new Array(+numberOfColumns)

		console.log 'settings', numberOfColumns, columnClasses

		i = numberOfColumns
		while i-- isnt 0
			selector = "[data-columns] > *:nth-child(#{numberOfColumns}n-#{i})"
			columnsItems.push items.querySelectorAll(selector)

		columnsFragment = document.createDocumentFragment()

		columnsItems.forEach (rows) ->
			column = document.createElement('div')
			column.className = columnClasses.join(' ')

			rowsFragment = document.createDocumentFragment()
			Array::forEach.call(rows, (row) ->
				rowsFragment.appendChild(row)
			)
			column.appendChild(rowsFragment)

			columnsFragment.appendChild(column)

		grid.appendChild(columnsFragment)
		add_to_dataset(grid, 'columns', numberOfColumns)

	remove_columns = (grid) ->
		# removes all the columns from a grid, and returns a list
		# of items sorted by the ordering of columns.

		range = document.createRange()
		range.selectNodeContents(grid)

		columns = Array::filter.call(range.extractContents().childNodes, (node) ->
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
		# removes all the columns from the grid, and adds them again,
		# it is used when the number of columns change.

		requestAnimationFrame(->
			items = remove_columns(grid)
			add_columns(grid, items)
		)

	media_query_change = (mql) ->
		# recreates the columns when a media query matches the current state
		# of the browser.

		if mql.matches
			Array::forEach.call(grids, recreate_columns)

	get_css_rules = (stylesheet) ->
		# returns a list of css rules from a stylesheet

		try
			cssRules = stylesheet.sheet.cssRules
		catch e
			return []

		if cssRules
			return cssRules
		else
			return []

	get_stylesheets = ->
		# returns a list of all the styles in the document (that are accessible).

		return Array::concat.call(
			Array::slice.call(document.querySelectorAll('style[type="text/css"]')),
			Array::slice.call(document.querySelectorAll('link[rel="stylesheet"]'))
		)

	media_rule_has_columns_selector = (rules) ->
		# checks if a media query css rule has in its contents a selector that
		# styles the grid.

		i = rules.length
		while i--
			rule = rules[i]
			if rule.selectorText.match(/\[data-columns\](.*)::?before$/)
				return true

		return false

	scan_media_queries = ->
		# scans all the stylesheets for selectors that style grids,
		# if the matchMedia API is supported.

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
		# returns the index of the column where the given element must be added.

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
		# returns a list of fragments

		fragments = new Array(quantity)

		i = 0
		while i isnt quantity
			fragments[i] = document.createDocumentFragment()
			i++

		return fragments

	append_elements = (grid, elements) ->
		# adds a list of elements to the end of a grid

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
		# adds a list of elements to the start of a grid

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

	register_grid = (grid) ->
		return if getComputedStyle(grid).display is 'none'

		# retrieve the list of items from the grid itself
		range = document.createRange()
		range.selectNodeContents(grid)

		items = document.createElement('div')
		items.appendChild(range.extractContents())

		add_to_dataset(items, 'columns', 0)

		add_columns(grid, items)

		grids.push(grid)

	setup = ->
		# scans all the grids in the document and generates
		# columns from their configuration.
		Array::forEach.call(document.querySelectorAll('[data-columns]'), register_grid)

		scan_media_queries()

	setup()

	return { append_elements, prepend_elements, register_grid }
)

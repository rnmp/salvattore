###
Salvattore by @rnmp and @ppold
http://github.com/bandd/salvattore
###

get_content = (element) ->
	content = window.getComputedStyle(element).getPropertyValue('content').slice(1, -1)
	matchResult = content.match(/^\s*(\d+)(?:\s?\.(.+))?\s*$/)

	if matchResult
		numberOfColumns = matchResult[1]
		className = matchResult[2] or 'column'
	else
		matchResult = content.match(/^\s*\.(.+)\s+(\d+)\s*$/)
		className = matchResult[1]
		numberOfColumns = matchResult[2]

	return numberOfColumns: numberOfColumns, className: className

add_columns = (element) ->
	dataColumnsContent = get_content(element)
	columns = dataColumnsContent.numberOfColumns
	columnClass = dataColumnsContent.className
	elements = new Array(columns)

	i = columns
	while i-- isnt 0
		elements.push element.querySelectorAll('[data-columns] > *:nth-child('+columns+'n-'+i+')')

	forEach.call(elements, (columnElements) ->
		column = document.createElement('div')
		column.classList.add(columnClass)

		forEach.call(columnElements, (element) ->
			column.appendChild(element)
		)

		element.appendChild(column)
	)

	element.dataset.columns = columns

remove_columns = (element) ->
	children = element.children
	ncol = children.length
	orderedChildren = new Array(children[0].children.length*element.dataset.columns)

	forEach.call(children, (child, i) ->
		forEach.call(child.children, (child, j) ->
			orderedChildren[j*ncol+i] = child
		)
	)

	orderedChildren.forEach((child) ->
		if child? then element.appendChild(child)
	)

	i = ncol
	while i-- isnt 0
		element.removeChild(children[0])

	return

media_rule_has_columns_selector = (rules) ->
	i = rules.length
	while i-- isnt 0
		if rules[i].selectorText.match(/\[data-columns\]$/)
			return true

	return false

media_query_change = (mql) ->
	if mql.matches
		grids.forEach((grid) ->
			remove_columns(grid)
			add_columns(grid)
		)

scan_media_queries = ->
	stylesheets = slice.call(
		document.querySelectorAll('style[type="text/css"]')).concat(slice.call(
		document.querySelectorAll('link[rel="stylesheet"]'))
	)
	mediaQueries = []

	forEach.call(stylesheets, (stylesheet) ->
		forEach.call(stylesheet.sheet.cssRules, (rule) ->
			if rule.media and media_rule_has_columns_selector(rule.cssRules)
				mediaQueries.push window.matchMedia(rule.media.mediaText)
		)
	)

	mediaQueries.forEach((mql) ->
		mql.addListener(media_query_change)
	)

addElements = (grid, elements) ->
	elements.forEach((element) ->
		addElement(element)
	)

addElement = (grid, element) ->
	children = grid.children
	m = children.length

	for own child, i in children
		currentRowCount = child.children.length
		if i isnt 0 and highestRowCount > currentRowCount
			break
		else if (i+1) is m
			child = children[0]
			break

		highestRowCount = currentRowCount

	child.appendChild(element)

proto = Array.prototype
forEach = proto.forEach
slice = proto.slice
grids = slice.call document.querySelectorAll('[data-columns]')

grids.forEach((grid) ->
	add_columns(grid)
)

scan_media_queries()

window['salvattore'] =
	addElement: addElement,
	addElements: addElements
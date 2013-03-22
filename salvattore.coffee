###
Salvattore by @rnmp and @ppold
http://github.com/bandd/salvattore
###

nodeList2Array = (nodes) ->
	arr = []

	for own node, i in nodes
		arr[i] = node

	return arr

if typeof document isnt 'undefined' and not ('classList' of document.createElement('a'))
	((view) ->
		'use strict'
		 
		return if not ('HTMLElement' of view) and not ('Element' of view)
		classListProp = 'classList'
		protoProp = 'prototype'
		elemCtrProto = (view.HTMLElement or view.Element)[protoProp]
		objCtr = Object
		strTrim = String[protoProp].trim or ->
			return @replace(/^\s+|\s+$/g, '')
		arrIndexOf = Array[protoProp].indexOf or (item) ->
			i = 0
			len = this.length

			while i < len
				if i of this and this[i] is item
					return i
				i++

			return -1

		# Vendors: please allow content code to instantiate DOMExceptions
		DOMEx = (type, message) ->
			@name = type
			@code = DOMException[type]
			@message = message

		# Most DOMException implementations don't allow calling DOMException's toString()
		# on non-DOMExceptions. Error's toString() is sufficient here.
		DOMEx[protoProp] = Error[protoProp]

		checkTokenAndGetIndex = (classList, token) ->
			if token is ''
				throw new DOMEx('SYNTAX_ERR', 'An invalid or illegal string was specified')

			if /\s/.test(token)
				throw new DOMEx('INVALID_CHARACTER_ERR', 'String contains an invalid character')

			return arrIndexOf.call(classList, token)

		class ClassList extends Array
			constructor: (elem) ->
				trimmedClasses = if elem.className then strTrim.call(elem.className)
				classes = if trimmedClasses then trimmedClasses.split(/\s+/) else []

				for cls in classes
					this.push(cls)

				this._updateClassName = ->
					elem.className = this.toString()

			item: (i) ->
				return this[i] or null

			contains: (token) ->
				token += ''
				return checkTokenAndGetIndex(this, token) isnt -1

			add: ->
				tokens = arguments
				i = 0
				l = tokens.length
				token
				updated = false

				while i < l
					token = tokens[i] + ''
					if checkTokenAndGetIndex(this, token) is -1
						this.push(token)
						updated = true

					i++

				if updated
					this._updateClassName()

			remove: ->
				tokens = arguments
				i = 0
				l = tokens.length
				token
				updated = false

				while i < l
					token = tokens[i] + ''
					index = checkTokenAndGetIndex(this, token)
					if index isnt -1
						this.splice(index, 1)
						updated = true

					i++

				if updated
					this._updateClassName()

			toggle: (token, forse) ->
				token += ''

				result = this.contains(token)

				if result
					method = forse isnt true and 'remove'
				else
					method = forse isnt false and 'add'

				if method
					this[method](token)

				return result

			toString: ->
				return this.join(' ')

		classListGetter = ->
			return new ClassList(@)

		if objCtr.defineProperty
			classListPropDesc =
				get: classListGetter
				, enumerable: true
				, configurable: true

			try
				objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc)
			catch ex # IE 8 doesn't support enumerable:true
				if ex.number is -0x7FF5EC54
					classListPropDesc.enumerable = false
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc)
		else if objCtr[protoProp].__defineGetter__
			elemCtrProto.__defineGetter__(classListProp, classListGetter)
	)(self)

# Production steps of ECMA-262, Edition 5, 15.4.4.18
# Reference: http://es5.github.com/#x15.4.4.18
unless Array.prototype.forEach

	Array.prototype.forEach = (callback, thisArg) ->
		unless @
			throw new TypeError('this is null or not defined')

		# 1. Let O be the result of calling ToObject passing the |this| value as the argument.
		O = Object(@)

		# 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
		# 3. Let len be ToUint32(lenValue).
		len = O.length >>> 0 # Hack to convert O.length to a UInt32

		# 4. If IsCallable(callback) is false, throw a TypeError exception.
		# See: http://es5.github.com/#x9.11
		if  {}.toString.call(callback) isnt '[object Function]'
			throw new TypeError(callback + ' is not a function')

		# 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if thisArg
			T = thisArg

		# 6. Let k be 0
		k = 0

		# 7. Repeat, while k < len
		while k < len
			# a. Let Pk be ToString(k).
			#   This is implicit for LHS operands of the in operator
			# b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
			#   This step can be combined with c
			# c. If kPresent is true, then
			if Object.prototype.hasOwnProperty.call(O, k)

				# i. Let kValue be the result of calling the Get internal method of O with argument Pk.
				kValue = O[k]

				# ii. Call the Call internal method of callback with T as the this value and
				# argument list containing kValue, k, and O.
				callback.call(T, kValue, k, O)
			# d. Increase k by 1.
			k++

		# 8. return undefined

unless window.getComputedStyle
	window.getComputedStyle = (el, pseudo) ->
		@el = el
		@getPropertyValue = (prop) ->
			if prop is 'float' then prop = 'styleFloat'

			# re = /(\-([a-z]){1})/g
			# if re.test(prop)
			# 	prop = prop.replace(re, ->
			# 		return arguments[2].toUpperCase()
			# 	)

			return el.currentStyle[prop] or null

		return @

get_content = (element) ->
	computedStyle = window.getComputedStyle(element, ':before')
	content = (	computedStyle.getPropertyValue('content') or
				computedStyle.getPropertyValue('-ms-content'))
		.slice(1, -1)
	matchResult = content.match(/^\s*(\d+)(?:\s?\.(.+))?\s*$/)

	if matchResult
		numberOfColumns = matchResult[1]
		classes = matchResult[2]?.split('.') or ['column']
	else
		matchResult = content.match(/^\s*\.(.+)\s+(\d+)\s*$/)
		classes = matchResult[1]
		numberOfColumns = matchResult[2]?.split('.')

	return numberOfColumns: numberOfColumns, classes: classes

get_direct_children = (element) ->
	directChildren = element.children
	if directChildren.length isnt 1
		return directChildren

	directChildren = []
	nodes = element.childNodes
	m = nodes.length
	while --m isnt -1
		node = nodes[m]
		if node.nodeType is 1
			directChildren.unshift(node)

	return directChildren

filter_children = (elements, a, b) ->
	b = a - b - 1
	# nth-child(an + b)
	filtered_children = new Array(Math.ceil(elements.length/a))

	j = 0
	for own element, i in elements
		if i % a is b
			filtered_children[j++] = element

	return filtered_children


add_columns = (element) ->
	dataColumnsContent = get_content(element)
	columns = dataColumnsContent.numberOfColumns
	classes = dataColumnsContent.classes
	elements = new Array(+columns)

	i = columns
	while i-- isnt 0
		try
			columnElements = element.querySelectorAll('[data-columns] > *:nth-child('+columns+'n-'+i+')')
		catch error
			columnElements = filter_children(get_direct_children(element), columns, i)

		elements.push(columnElements)

	while element.firstChild
		element.removeChild(element.firstChild)

	forEach.call(elements, (columnElements) ->
		column = document.createElement('div')

		for cls in classes
			column.classList.add(cls)

		forEach.call(columnElements, (element) ->
			column.appendChild(element)
		)

		element.appendChild(column)
	)

	element.setAttribute('data-columns', columns)

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

	while ncol-- isnt 0
		element.removeChild(children[0])

	return

media_rule_has_columns_selector = (rules) ->
	i = rules.length
	while i-- isnt 0
		if rules[i].selectorText.match(/\[data-columns\]::before$/)
			return true

	return false

recreate_columns = (grid) ->
	remove_columns(grid)
	add_columns(grid)

media_query_change = (mql) ->
	if mql.matches then grids.forEach(recreate_columns)

scan_media_queries = ->
	return unless window.matchMedia

	stylesheets = slice.call(
		document.querySelectorAll('style[type="text/css"]')
	).concat(slice.call(
		document.querySelectorAll('link[rel="stylesheet"]')
	))
	mediaQueries = []

	forEach.call(stylesheets, (stylesheet) ->
		cssRules = stylesheet.sheet.cssRules
		return unless cssRules
		forEach.call(cssRules, (rule) ->
			if rule.media and media_rule_has_columns_selector(rule.cssRules)
				mediaQueries.push window.matchMedia(rule.media.mediaText)
		)
	)

	mediaQueries.forEach((mql) ->
		mql.addListener(media_query_change)
	)

addElements = (grid, elements) ->
	elements.forEach(addElement)

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

grids = nodeList2Array document.querySelectorAll('[data-columns]')
grids.forEach(add_columns)

scan_media_queries()

window['salvattore'] =
	addElement: addElement,
	addElements: addElements
'use strict';

describe('Globals', function() {
  before(function () {
    fixture.setBase('tests');
  });

  beforeEach(function () {
    this.result = fixture.load('test1.html');
  });

  afterEach(function(){
    fixture.cleanup()
  });

  it('exposes global', function () {
    expect(salvattore).to.be.a('object');
  });
});

describe('Non-responsive grid / 3 columns', function() {
  var element;

  before(function() {
    fixture.setBase('tests');
  });

  beforeEach(function() {
      this.result = fixture.load('test1.html');
      salvattore.init();
      element = fixture.el.querySelector('#grid');
  });

  afterEach(function(){
    fixture.cleanup();
  });

  it('adds data-columns attribute to grid', function() {
    expect(element.getAttribute('data-columns')).to.be('3');
  });

  it('contains three columns', function() {
    expect(element.querySelectorAll('.column')).to.have.length(3);
  });

  it('contains six items', function() {
    expect(element.querySelectorAll('.column .item')).to.have.length(6);
  });

  it('has class from stylesheet appended to columns', function() {
    var columns = element.querySelectorAll('.column');
    var className = 'size-1of3';

    Array.prototype.forEach.call(columns, function(column) {
      if (column.classList) {
        expect(column.classList.contains(className)).to.be.okay;
      } else {
        expect(new RegExp('(^| )' + className + '( |$)', 'gi').test(column.className)).to.be.okay;
      }
    });
  });

  it('brings two elements into every column', function() {
    var columns = element.querySelectorAll('#grid-1 .column');

    Array.prototype.forEach.call(columns, function(column) {
      expect(column.children).to.have.length(2);
    });
  });
});

describe('Non-responsive grid / 4 columns', function() {
  var element;

  before(function() {
    fixture.setBase('tests');
  });

  beforeEach(function() {
    this.result = fixture.load('test2.html');
    salvattore.init();
    element = fixture.el.querySelector('#grid');
  });

  afterEach(function(){
    fixture.cleanup();
  });

  it('adds data-columns attribute to grid', function() {
    expect(element.getAttribute('data-columns')).to.be('4');
  });

  it('contains four columns', function() {
    expect(element.querySelectorAll('.list')).to.have.length(4);
  });

  it('contains eight items', function() {
    expect(element.querySelectorAll('.list .item')).to.have.length(8);
  });

  it('has class from style appended to columns', function() {
    var columns = element.querySelectorAll('.list');
    var className = 'size-1of4';

    Array.prototype.forEach.call(columns, function(column) {
      if (column.classList) {
        expect(column.classList.contains(className)).to.be.okay;
      } else {
        expect(new RegExp('(^| )' + className + '( |$)', 'gi').test(column.className)).to.be.okay;
      }
    });
  });

  it('brings two elements into every column', function() {
    var columns = element.querySelectorAll('.list');

    Array.prototype.forEach.call(columns, function(column) {
      expect(column.children).to.have.length(2);
    });
  });
});

describe('Non-responsive dynamic grid  / 4 columns', function() {
  var element;

  before(function() {
    fixture.setBase('tests');
  });

  beforeEach(function() {
    this.result = fixture.load('test3.html');
    salvattore.init();
    element = fixture.el.querySelector('#grid');
  });

  afterEach(function(){
    fixture.cleanup();
  });

  it('adds data-columns attribute to grid', function() {
    expect(element.getAttribute('data-columns')).to.be('4');
  });

  it('contains four columns', function() {
    expect(element.querySelectorAll('.column')).to.have.length(4);
  });

  it('has class from stylesheet appended to columns', function() {
    var columns = element.querySelectorAll('.column');
    var className = 'size-1of4';

    Array.prototype.forEach.call(columns, function(column) {
      if (column.classList) {
        expect(column.classList.contains(className)).to.be.okay;
      } else {
        expect(new RegExp('(^| )' + className + '( |$)', 'gi').test(column.className)).to.be.okay;
      }
    });
  });

  it('adds elements', function() {
    var insertCount = 4;
    var columns;

    // Append multiple elements one by one
    var item;
    for (var i = 1; i <= 4; i++) {
      item = document.createElement('div');
      salvattore.appendElements(element, [item]);
      item.outerHTML = '<div class="item">Appended item #'+ i +'</div>';
    }
    expect(element.querySelectorAll('.column .item')).to.have.length(4);

    columns = element.querySelectorAll('.column');
    Array.prototype.forEach.call(columns, function(column) {
      expect(column.children).to.have.length(1);
    });

    // Append multiple elements at once
    var items = [];
    for (var i = 5; i <= 8; i++) {
      var item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = 'Appended item #'+ i;
      items.push(item);
    }
    salvattore.appendElements(element, items);
    expect(element.querySelectorAll('.column .item')).to.have.length(8);

    columns = element.querySelectorAll('.column');
    Array.prototype.forEach.call(columns, function(column) {
      expect(column.children).to.have.length(2);
    });

    // Prepend multiple elements one by one
    var item;
    for (var i = 1; i <= 4; i++) {
      item = document.createElement('div');
      salvattore.prependElements(grid, [item]);
      item.outerHTML = '<div class="item">Prepended item #'+ i +'</div>';
    }
    expect(element.querySelectorAll('.column .item')).to.have.length(12);

    columns = element.querySelectorAll('.column');
    Array.prototype.forEach.call(columns, function(column) {
      expect(column.children).to.have.length(3);
    });

    // Prepend multiple elements at once
    var items = [];
    for (var i = 5; i <= 8; i++) {
      var item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = 'Prepended item #'+ i;
      items.push(item);
    }
    salvattore.prependElements(grid, items);
    expect(element.querySelectorAll('.column .item')).to.have.length(16);

    columns = element.querySelectorAll('.column');
    Array.prototype.forEach.call(columns, function(column) {
      expect(column.children).to.have.length(4);
    });
  });
});

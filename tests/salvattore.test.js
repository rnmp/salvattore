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

describe('Settings', function() {
  before(function() {
    fixture.setBase('tests');
  });

  beforeEach(function() {
      this.result = fixture.load('testSettings.html');
      salvattore.init();
  });

  afterEach(function(){
    fixture.cleanup();
  });

  it('content css values', function() {
    var settings;
    var elem1 = fixture.el.querySelector('#grid1');
    var elem2 = fixture.el.querySelector('#grid2');
    var elem3 = fixture.el.querySelector('#grid3');
    var elem4 = fixture.el.querySelector('#grid4');
    var elem5 = fixture.el.querySelector('#grid5');
    var elem6 = fixture.el.querySelector('#grid6');
    var elem7 = fixture.el.querySelector('#grid7');

    // 2 .column.size-1of2
    settings = salvattore._test.obtainGridSettings(elem1);
    expect(settings.numberOfColumns).to.be('2');
    expect(settings.columnClasses).to.have.length(2);
    expect(settings.columnClasses).to.contain('column');
    expect(settings.columnClasses).to.contain('size-1of2');
    expect(settings.balanced).to.be(false);

    // 4 .column.size-1of4 balanced
    settings = salvattore._test.obtainGridSettings(elem2);
    expect(settings.numberOfColumns).to.be('4');
    expect(settings.columnClasses).to.have.length(2);
    expect(settings.columnClasses).to.contain('column');
    expect(settings.columnClasses).to.contain('size-1of4');
    expect(settings.balanced).to.be(true);

    // 64 .column  .size-1of6 balanced
    settings = salvattore._test.obtainGridSettings(elem3);
    expect(settings.numberOfColumns).to.be('64');
    expect(settings.columnClasses).to.have.length(2);
    expect(settings.columnClasses).to.contain('column');
    expect(settings.columnClasses).to.contain('size-1of6');
    expect(settings.balanced).to.be(true);

    //  4 .list.size-1of4  .balanced balanced
    settings = salvattore._test.obtainGridSettings(elem4);
    expect(settings.numberOfColumns).to.be('4');
    expect(settings.columnClasses).to.have.length(3);
    expect(settings.columnClasses).to.contain('list');
    expect(settings.columnClasses).to.contain('size-1of4');
    expect(settings.columnClasses).to.contain('balanced');
    expect(settings.balanced).to.be(true);

    // 7 .boxes.size-1of7 .balanced
    settings = salvattore._test.obtainGridSettings(elem5);
    expect(settings.numberOfColumns).to.be('7');
    expect(settings.columnClasses).to.have.length(3);
    expect(settings.columnClasses).to.contain('boxes');
    expect(settings.columnClasses).to.contain('size-1of7');
    expect(settings.columnClasses).to.contain('balanced');
    expect(settings.balanced).to.be(false);

    //  1 .column
    settings = salvattore._test.obtainGridSettings(elem6);
    expect(settings.numberOfColumns).to.be('1');
    expect(settings.columnClasses).to.have.length(1);
    expect(settings.columnClasses).to.contain('column');
    expect(settings.balanced).to.be(false);

    //  4
    settings = salvattore._test.obtainGridSettings(elem7);
    expect(settings.numberOfColumns).to.be('1');
    expect(settings.columnClasses).to.have.length(1);
    expect(settings.columnClasses).to.contain('column');
    expect(settings.balanced).to.be(false);
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

  it('optains correct settings internal', function() {
    var settings = salvattore._test.obtainGridSettings(element);
    expect(settings.numberOfColumns).to.be('3');
    expect(settings.columnClasses).to.contain('column');
    expect(settings.columnClasses).to.contain('size-1of3');
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

  it('optains correct settings internal', function() {
    var settings = salvattore._test.obtainGridSettings(element);
    expect(settings.numberOfColumns).to.be('4');
    expect(settings.columnClasses).to.contain('list');
    expect(settings.columnClasses).to.contain('size-1of4');
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

  it('optains correct settings internal', function() {
    var settings = salvattore._test.obtainGridSettings(element);
    expect(settings.numberOfColumns).to.be('4');
    expect(settings.columnClasses).to.contain('column');
    expect(settings.columnClasses).to.contain('size-1of4');
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

"use strict";

describe('Globals', function() {
  it('exposes global', function () {
    expect(window.salvattore).to.be.a('object');
  });
});

describe('Non-responsive grid / 3 columns / inline block css', function() {
  it('adds data-columns attribute to grid', function() {
    expect(document.querySelector('#grid-1').getAttribute('data-columns')).to.be('3');
  });

  it('contains three columns', function() {
    expect(document.querySelectorAll('#grid-1 .column')).to.have.length(3);
  });

  it('contains six items', function() {
    expect(document.querySelectorAll('#grid-1 .column .item')).to.have.length(6);
  });

  it('has class from stylesheet appended to columns', function() {
    var columns = document.querySelectorAll('#grid-1 .column');
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
    var columns = document.querySelectorAll('#grid-1 .column');

    Array.prototype.forEach.call(columns, function(column) {
      expect(column.children).to.have.length(2);
    });
  });
});

describe('Non-responsive grid / 4 columns / external css', function() {
  it('adds data-columns attribute to grid', function() {
    expect(document.querySelector('#grid-2').getAttribute('data-columns')).to.be('4');
  });

  it('contains four columns', function() {
    expect(document.querySelectorAll('#grid-2 .column')).to.have.length(4);
  });

  it('contains eight items', function() {
    expect(document.querySelectorAll('#grid-2 .column .item')).to.have.length(8);
  });

  it('has class from stylesheet appended to columns', function() {
    var columns = document.querySelectorAll('#grid-2 .column');
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
    var columns = document.querySelectorAll('#grid-2 .column');

    Array.prototype.forEach.call(columns, function(column) {
      expect(column.children).to.have.length(2);
    });
  });
});

describe('Non-responsive dynamic grid  / 4 columns / external css', function() {
  it('adds data-columns attribute to grid', function() {
    expect(document.querySelector('#grid-3').getAttribute('data-columns')).to.be('4');
  });

  it('contains four columns', function() {
    expect(document.querySelectorAll('#grid-3 .column')).to.have.length(4);
  });

  it('has class from stylesheet appended to columns', function() {
    var columns = document.querySelectorAll('#grid-3 .column');
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
    var grid = document.querySelector('#grid-3');
    var insertCount = 4;
    var columns;

    // Append multiple elements one by one
    var item;
    for (var i = 1; i <= 4; i++) {
      item = document.createElement('div');
      salvattore.appendElements(grid, [item]);
      item.outerHTML = '<div class="item">Appended item #'+ i +'</div>';
    }
    expect(document.querySelectorAll('#grid-3 .column .item')).to.have.length(4);

    columns = document.querySelectorAll('#grid-3 .column');
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
    salvattore.appendElements(grid, items);
    expect(document.querySelectorAll('#grid-3 .column .item')).to.have.length(8);

    columns = document.querySelectorAll('#grid-3 .column');
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
    expect(document.querySelectorAll('#grid-3 .column .item')).to.have.length(12);

    columns = document.querySelectorAll('#grid-3 .column');
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
    expect(document.querySelectorAll('#grid-3 .column .item')).to.have.length(16);

    columns = document.querySelectorAll('#grid-3 .column');
    Array.prototype.forEach.call(columns, function(column) {
      expect(column.children).to.have.length(4);
    });
  });
});

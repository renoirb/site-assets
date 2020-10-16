/* small monkey patch from other class dependency */
var PARENT = PARENT || { accordionCounter: 0 }

/**
 * Rows calculation memoizer
 *
 * Assuming we know all lists, and we can add, remove, elements from each of them. How to make sure the
 * numerical identifiers stays the lowest.
 *
 * This class uses memoization to save a list of elements and whether they were added, removed, and which
 * identifier to provide if we create a new one. Always favorizing the lowest ID possible.
 *
 * See use case description to get a better idea of the way it is implemented.
 *
 * Reference:
 *   https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array
 *   https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/stringify
 *   http://addyosmani.com/resources/essentialjsdesignpatterns/book/#highlighter_897219
 *
 *
 * Use case:
 *    To test the counter, you can execute this scenario in a Javascript console within your browser
 *
 * Console:
 * PARENT.counter.create('alpha');     // undefined
 * PARENT.counter.newNode('alpha');    // 0
 * PARENT.counter.newNode('alpha');    // 1
 * PARENT.counter.newNode('alpha');    // 2
 * PARENT.counter.newNode('alpha');    // 3
 * PARENT.counter.newNode('alpha');    // 4
 * PARENT.counter.showAll();           // undefined (console > {"alpha":{"count":5,"deleted":[]}})
 * PARENT.counter.remNode('alpha',2);  // undefined
 * PARENT.counter.showAll();           // undefined (console > {"alpha":{"count":4,"deleted":[2]}})
 * PARENT.counter.create('bravo');     // undefined
 * PARENT.counter.remNode('alpha',3);  // undefined
 * PARENT.counter.showAll();           // undefined (console > {"alpha":{"count":3,"deleted":[2,3]},"bravo":{"count":0,"deleted":[]}})
 * PARENT.counter.newNode('bravo');    // 0
 * PARENT.counter.newNode('alpha');    // 2
 * PARENT.counter.newNode('alpha');    // 3
 * PARENT.counter.drop('alpha');       // undefined
 * PARENT.counter.showAll();           // undefined  (console > {"bravo":{"count":1,"deleted":[]}})
 */
PARENT.counter = (function (P) {
  'use strict'

  const module = {
    counterIndexes: {},
  }

  module.drop = function (counterName) {
    if (this.counterIndexes.hasOwnProperty(counterName)) {
      delete this.counterIndexes[counterName]
    }
  }

  module.create = function (counterName) {
    this.counterIndexes[counterName] = { count: 0, deleted: [] }
  }

  module.showAll = function () {
    P.log(JSON.stringify(this.counterIndexes))
  }

  module.remNode = function (counterName, nodeId) {
    const deleted = this.counterIndexes[counterName].deleted
    deleted.push(nodeId)
    deleted.sort()
    this.counterIndexes[counterName].deleted = deleted // Reassigning with pushed and re-sorted array
    this.counterIndexes[counterName].count =
      Number(this.counterIndexes[counterName].count) - 1
    P.log(
      'Removed in ' +
        counterName +
        ', node ' +
        nodeId +
        ', state: ' +
        JSON.stringify(this.counterIndexes[counterName]),
    )
  }

  module.newNode = function (counterName) {
    if (this.counterIndexes[counterName].deleted.length >= 0) {
      var shifted = this.counterIndexes[counterName].deleted.shift()
    }
    const newCount = this.counterIndexes[counterName].count
    this.counterIndexes[counterName].count = Number(newCount) + 1 // Increment AFTER preparing to give out.
    P.log(
      'Added in ' +
        counterName +
        ', state: ' +
        JSON.stringify(this.counterIndexes[counterName]),
    )
    return typeof shifted !== 'undefined' ? shifted : newCount
  }

  module.wrapper = function (clickedElement) {
    if (typeof clickedElement.attr('data-counter-name') === 'undefined') {
      clickedElement.attr('data-counter-name', 'row-' + P.accordionCounter)
      this.create(clickedElement.attr('data-counter-name'))
    }
    return this.newNode(clickedElement.attr('data-counter-name'))
  }

  return module
})(PARENT)

/**
 * Javacript modules transpiled from Typescript may contain
 * `export` and `require` directives, which are no native components
 * in most common browsers.
 *
 *  > Uncaught ReferenceError: exports is not defined
 *  > Uncaught ReferenceError: require is not defined
 *
 * These two instructions create fake 'require' and fake 'export'
 * which should fix these problems.
 *
 * @date 2020-04-01
 **/
// globalThis.exports = globalThis.export = globalThis;
// var exports = (globalThis.export = globalThis);
globalThis.exports = globalThis.exports || {};
// var exports = exports || globalThis.exports || {};
// var exports = exports || {};
var require = (globalThis.require = function (...args) {
  var itemName = args[0];
  // console.log("require", itemName);
  var itemNameStart = itemName.lastIndexOf("/");
  var itemNameEnd = itemName.lastIndexOf(".");
  if (itemNameStart !== -1) {
    if (itemNameEnd < itemNameStart) {
      itemNameEnd = itemName.length;
    }
    if (itemNameEnd > itemNameStart + 1) {
      itemName = itemName.substring(itemNameStart + 1, itemNameEnd);
    }
  }
  if (["three", "OrbitControls", "axios", "AlloyFinger", "alloyfinger-typescript"].indexOf(itemName) !== -1) {
    return globalThis[itemName];
  } else {
    return globalThis;
    // return globalThis[itemName];
  }
});

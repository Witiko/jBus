/**
 * Returns whether or not a value is a string.
 * @param str - The tested value.
 * @return whether or not a value is a string.
 */
function isString(str) {
  return typeof str === "string" ||
                str instanceof String;
};

/**
 * Returns whether or not a value is a regexp.
 * @param rexp - The tested value.
 * @return whether or not a value is a regexp.
 */
function isRegExp(rexp) {
  return rexp instanceof RegExp;
}

/**
 * Returns whether or not a value is a function.
 * @param func - The tested value.
 * @return whether or not a value is a function.
 */
function isFunction(func) {
  return func instanceof Function;
}

/**
 * Returns whether or not a value is an array.
 * @param arr - The tested value.
 * @return whether or not a value is an array.
 */
var isArray = Array.isArray || function(arr) {
  return arr instanceof Array;
};

/**
 * Returns an array copy of the given iterable.
 * @param iter - The given iterable.
 * @return an array copy of the given iterable.
 */
var new$Array = Array.from || function(iter) {
  return Array.prototype.slice.call( iter, 0 );
}

// String-specific functions
var $String = {

  /**
   * Returns a random hash containing [0-9a-z] characters.
   * @return a random hash containing [0-9a-z] characters.
   */
  random: function() {
    return Math.random().toString(36).replace(/0\./, "");
  }
  
};

// Array-specific ECMAv5-inspired functions
var $Array = {

  /**
   * Iterates over the given array calling the given
   * callback function at each defined cell with the
   * following parameters:
   *
   *   value, index, array
   *
   * @param arr - The given array.
   * @param callback - The given callback function.
   */
  forEach: "forEach" in Array.prototype
    ? function(arr, callback) {
        arr.forEach( callback );
      }
    : function(arr, callback) {
      for(var i = 0; i < arr.length; i++) {
        if( arr[i] !== undefined )
          callback( arr[i], i, arr );
      }
    },
  
  /**
   * Iterates over the given array calling the given
   * callback function at each defined cell with the
   * following parameters:
   *
   *   value, index, array
   *
   * If the callback function returns true, the some
   * function stops iterating and immediately returns
   * true. If the end of the array is reached without
   * the callback function returning true, the some
   * function returns false.
   *
   * @param arr - The given array.
   * @param callback - The given callback function.
   * @return whether the predicate of the given callback
   *         function holds for at least one element
   *         of the given array.
   */
  some: "some" in Array.prototype
    ? function(arr, callback) {
        return arr.some( callback );
      }
    : function(arr, callback) {
      for(var i = 0; i < arr.length; i++) {
        if( arr[i] !== undefined ) {
          if( callback( arr[i], i, arr ) ) {
            return true;
          }
        }
      } return false;
    },

  /**
   * Returns the index at which the given array contains the
   * given value. If the array doesn't contain the given value,
   * -1 is returned instead.
   *
   * @param arr - The given array.
   * @param val - The given value.
   * @return the index at which the given array contains the
   *         given value.
   */
  indexOf: "indexOf" in Array.prototype
    ? function(arr, val) {
        return arr.indexOf( val );
      }
    : function(arr, val) {
      for(var i = 0; i < arr.length; i++) {
        if( arr[i] == val ) {
          return i;
        }
      } return -1;
    },
    
  /**
   * Returns whether the given array contains the given value.
   *
   * @param arr - The given array.
   * @param val - The given value.
   * @return whether the given array contains the given value.
   */
  contains: function(arr, val) {
    return $Array.indexOf( arr, val ) !== -1;
  },
  
  /**
   * Adds the given value to the given array
   * if it is not already present.
   *
   * @param arr - The given array.
   * @param val - The given value.
   */
  add: function(arr, val) {
    if( ! $Array.contains( arr, val ) ) {
      arr.push( val );
    }
  },
  
  /**
   * Removes the first occurance of the given value
   * from the given array if it is present.
   *
   * @param arr - The given array.
   * @param val - The given value.
   */
  remove: function(arr, val) {
    var index = $Array.indexOf( arr, val );
    if( index !== -1 ) {
      arr.splice( index, 1 );
    }
  }
  
};
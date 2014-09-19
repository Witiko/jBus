// A test suite for jBus
var tests = {
  "Unit tests": {
    "Object JBus.messages.Collision construction": function(success, failure) {
      /* We construct a message object and check it has been correctly constructed. */
      if( new JBus.messages.Collision().type === 0x00 ) {
        success();
      } else {
        failure();
      }
    }, "Object JBus.messages.Bonjour construction": function(success, failure) {
      /* We construct a message object and check it has been correctly constructed. */
      var options = {
        from: "<name.witiko.jbus.testsuite.from@" + $String.random() + ">",
        description: "<name.witiko.jbus.testsuite.description@" + $String.random() + ">"
      }, msg = new JBus.messages.Bonjour( options );
      
      if( msg.type === 0x01 &&
          msg.from === options.from &&
          msg.description === options.description ) {
        success();
      } else {
        failure();
      }
    }, "Object JBus.messages.Bonjour construction (overload #1)": function(success, failure) {
      /* We construct a message object and check it has been correctly constructed. */
      var from = "<name.witiko.jbus.testsuite.from@" + $String.random() + ">",
          msg = new JBus.messages.Bonjour( from );
      
      if( msg.type === 0x01 &&
          msg.from === from ) {
        success();
      } else {
        failure();
      }
    }, "Object JBus.messages.Ping construction": function(success, failure) {
      /* We construct a message object and check it has been correctly constructed. */
      var options = {
        from: "<name.witiko.jbus.testsuite.from@" + $String.random() + ">"
      }, msg = new JBus.messages.Ping( options );
      
      if( msg.type === 0x02 &&
          msg.from === options.from ) {
        success();
      } else {
        failure();
      }
    }, "Object JBus.messages.Ping construction (overload #1)": function(success, failure) {
      /* We construct a message object and check it has been correctly constructed. */
      var from = "<name.witiko.jbus.testsuite.from@" + $String.random() + ">",
          msg = new JBus.messages.Ping( from );
      
      if( msg.type === 0x02 &&
          msg.from === from ) {
        success();
      } else {
        failure();
      }
    }, "Object JBus.messages.Bye construction": function(success, failure) {
      /* We construct a message object and check it has been correctly constructed. */
      var options = {
        from: "<name.witiko.jbus.testsuite.from@" + $String.random() + ">"
      }, msg = new JBus.messages.Bye( options );
      
      if( msg.type === 0x03 &&
          msg.from === options.from ) {
        success();
      } else {
        failure();
      }
    }, "Object JBus.messages.Bye construction (overload #1)": function(success, failure) {
      /* We construct a message object and check it has been correctly constructed. */
      var from = "<name.witiko.jbus.testsuite.from@" + $String.random() + ">",
          msg = new JBus.messages.Bye( from );
      
      if( msg.type === 0x03 &&
          msg.from === from ) {
        success();
      } else {
        failure();
      }
    }, "Object JBus.messages.Data construction": function(success, failure) {
      /* We construct a message object and check it has been correctly constructed. */
      var options = {
        from: "<name.witiko.jbus.testsuite.from@" + $String.random() + ">",
        name: getRandomName(),
        payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
      }, msg = new JBus.messages.Data( options );
      
      if( msg.type === 0x04 &&
          msg.from === options.from && 
          msg.data &&
          msg.data.name === options.name &&
          msg.data.payload === options.payload ) {
        success();
      } else {
        failure();
      }
    }, "Object JBus.messages.Bonjour construction (omitting the from attribute)": function(success, failure) {
      /* We misconstruct a message object and check that an exception has been raised. */
      try {
        new JBus.messages.Bonjour( {} );
      } catch(e) {
        success();
        failure = function() { };
      } failure();
    }, "Object JBus.messages.Ping construction (omitting the from attribute)": function(success, failure) {
      /* We misconstruct a message object and check that an exception has been raised. */
      try {
        new JBus.messages.Ping( {} );
      } catch(e) {
        success();
        failure = function() { };
      } failure();
    }, "Object JBus.messages.Bye construction (omitting the from attribute)": function(success, failure) {
      /* We misconstruct a message object and check that an exception has been raised. */
      try {
        new JBus.messages.Bye( {} );
      } catch(e) {
        success();
        failure = function() { };
      } failure();
    }, "Object JBus.messages.Data construction (omitting the from attribute)": function(success, failure) {
      /* We misconstruct a message object and check that an exception has been raised. */
      try {
        new JBus.messages.Data( {} );
      } catch(e) {
        success();
        failure = function() { };
      } failure();
    }, "Object JBus.Node construction, attribute name": function(success, failure) {
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName(),
          node = new JBus.Node({
            name: name,
            oninit: function() {
              this.destroy();
            }
          });
      /* We assign the name to a new node and test whether
         it has been adopted by the node. */
      if( node.getName() === name ) {
        success();
      } else {
        failure();
      }
    }, "Object JBus.Node construction, attribute oninit": function(success, failure) {
      /* We construct a new node without dependencies
         and wait for it to autoinitialize. */
      new JBus.Node({
        oninit: function() {
          success();
          this.destroy();
        }
      });
    }, "Object JBus.Node construction, attribute oninit (wrong type)": function(success, failure) {
      /* We construct a new node with a mistyped
         attribute and expect it to fail. */
      try {
        new JBus.Node({
          oninit: "<string>"
        });
      } catch(e) {
        success();
        failure = function() {};
      } failure();
    }, "Object JBus.Node construction, attribute onuninit": function(success, failure) {
      /* We construct a new node without dependencies,
         we destroy it and wait for it to uninitialize. */
      new JBus.Node({
        onuninit: success
      }).destroy();
    }, "Object JBus.Node construction, attribute onuninit (wrong type)": function(success, failure) {
      /* We construct a new node with a mistyped
         attribute and expect it to fail. */
      try {
        new JBus.Node({
          onuninit: "<string>"
        });
      } catch(e) {
        success();
        failure = function() {};
      } failure();
    }, "Object JBus.Node construction, attribute ondestroy": function(success, failure) {
      /* We construct a new node without dependencies,
         we destroy it and wait for it to destroy itself. */
      new JBus.Node({
        ondestroy: success
      }).destroy();
    }, "Object JBus.Node construction, attribute ondestroy (wrong type)": function(success, failure) {
      /* We construct a new node with a mistyped
         attribute and expect it to fail. */
      try {
        new JBus.Node({
          ondestroy: "<string>"
        });
      } catch(e) {
        success();
        failure = function() {};
      } failure();
    }, "Method new JBus.Node().oninit": function(success, failure) {
      /* We construct a new node with a DOM0-like attribute
         and check that it has been added to the node object */
      if( new JBus.Node({
        oninit: init
      }).oninit === init ) {
        success();
      } else {
        failure();
      }
      
      function init() {
        this.destroy();
      }
    }, "Method new JBus.Node().onuninit": function(success, failure) {
      /* We construct a new node with a DOM0-like attribute
         and check that it has been added to the node object */
      if( new JBus.Node({
        oninit: function() {
          this.destroy();
        }, onuninit: uninit
      }).onuninit === uninit ) {
        success();
      } else {
        failure();
      }
      
      function uninit() {  }
    }, "Method new JBus.Node().ondestroy": function(success, failure) {
      /* We construct a new node with a DOM0-like attribute
         and check that it has been added to the node object */
      if( new JBus.Node({
        oninit: function() {
          this.destroy();
        }, ondestroy: destroy
      }).ondestroy === destroy ) {
        success();
      } else {
        failure();
      }
      
      function destroy() {  }
    }, "Object JBus.Node construction, attribute autoinit #1": function(success, failure) {
      /* We construct a new node without auto-initialization
         and we check whether it has been initialized once
         it is done constructing. */
      var node = new JBus.Node({
        oninit: failure,
        autoinit: false
      }); success();
      node.destroy();
    }, "Object JBus.Node construction, attribute autoinit #2": function(success, failure) {
      /* We construct a new node with auto-initialization
         and we check whether it has been initialized once
         it is done constructing. */
      var node = new JBus.Node({
        oninit: function() {
          failure = function() {};
          success();
        }
      }); failure();
      node.destroy();
    }, "Object JBus.Node construction, attribute autoinit (initializes immediately for nodes w/ dependencies?)": function(success, failure) {
      /* We construct a new node with autoinitialization and
         with initialized dependencies. Then we initialize it and we
         check, whether it is immediately initialized. */
      var nodes = [
          new JBus.Node,
          new JBus.Node
        ], node = new JBus.Node({
          requires: [
            nodes[0].getName(),
            nodes[1].getName()
          ], oninit: function() {
            failure = function() {};
            success();
          }
        });
      failure();
      node.destroy();
      nodes[0].destroy();
      nodes[1].destroy();
    }, "Object JBus.Node construction, attribute autoinit (immediately initializes dependent nodes?)": function(success, failure) {
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName();
      /* We construct a new node with autoinitialization and
         with two dependent nodes. We initialize the node and
         immediately check, whether the two nodes were initialized. */
      var nodes = [
            new JBus.Node({
              requires: name,
              oninit: increment
            }), new JBus.Debugger({
              requires: name,
              oninit: increment
            })
          ], count = 0,
          node = new JBus.Node({
            name: name
          });
      if( count === 2 ) {
        success();
      } else {
        failure();
      } node.destroy();
      nodes[0].destroy();
      nodes[1].destroy();      
      
      function increment() {
        ++count;
      }
    }, "Object JBus.Node construction (overload #1)": function(success, failure) {
      /* We create a node using the parameterless constructor
         and we check whether it initializes using another node. */
      var node = new JBus.Node;
      new JBus.Node({
        requires: node.getName(),
        oninit: function() {
          success();
          this.destroy();
          node.destroy();
        }
      });
    }, "Object JBus.Node construction (overload #2)": function(success, failure) {
      // We generate a random node name.
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName(),
          node = new JBus.Node( name );
      /* We assign the name to a new node using the
         shorthand oveload and test whether it has
         been adopted by the node. */
      if(node.getName() === name) {
        success();
      } else {
        failure();
      } node.destroy();
    }, "Method new JBus.Node().getName": new RelativePath( "Object JBus.Node construction, attribute name" ),
    "Method new JBus.Node().init (initializes?)": function(success, failure) {
      /* We construct a new node without autoinitialization,
         then we initialize it and we wait for it to initialize. */
      var node = new JBus.Node({
        autoinit: false,
        oninit: function() {
          success();
          this.destroy();
        }
      }); node.init();
    }, "Method new JBus.Node().init (initializes immediately for nodes w/o dependencies?)": function(success, failure) {
      /* We construct a new node without autoinitialization and
         without any dependencies. Then we initialize it and we
         check, whether it is immediately initialized. */
      var node = new JBus.Node({
        autoinit: false,
        oninit: function() {
          failure = function() {};
          success();
        }
      }); node.init();
      failure();
      node.destroy();
    }, "Method new JBus.Node().init (initializes immediately for nodes w/ dependencies?)": function(success, failure) {
      /* We construct a new node without autoinitialization and
         with initialized dependencies. Then we initialize it and we
         check, whether it is immediately initialized. */
      var nodes = [
          new JBus.Node,
          new JBus.Node
        ], node = new JBus.Node({
          autoinit: false,
          requires: [
            nodes[0].getName(),
            nodes[1].getName()
          ], oninit: function() {
            failure = function() {};
            success();
          }
        });
      node.init();
      failure();
      node.destroy();
      nodes[0].destroy();
      nodes[1].destroy();
    }, "Method new JBus.Node().init (immediately initializes dependent nodes?)": function(success, failure) {
      /* We construct a new node without autoinitialization and
         with two dependent nodes. We initialize the node and
         immediately check, whether the two nodes were initialized. */
      var node = new JBus.Node({
            autoinit: false 
          }), nodes = [
            new JBus.Node({
              requires: node.getName(),
              oninit: increment
            }), new JBus.Node({
              requires: node.getName(),
              oninit: increment
            })
          ], count = 0;
      node.init();
      if( count === 2 ) {
        success();
      } else {
        failure();
      } node.destroy();
      nodes[0].destroy();
      nodes[1].destroy();      
      
      function increment() {
        ++count;
      }
    }, "Method new JBus.Node().destroy (destroys?)": function(success, failure) {
      /* We construct a new node, we destroy it and we wait for it
         to notify us about the event */
      new JBus.Node({
        ondestroy: success
      }).destroy();
    }, "Method new JBus.Node().destroy (destroys immediately?)": function(success, failure) {
      /* We construct a new node, we destroy it and we check,
         whether it is immediately destroyed */
      new JBus.Node({
        ondestroy: function() {
          failure = function() {};
          success();
        }
      }).destroy();
      failure();
    }, "Method new JBus.Node().destroy (immediately uinitializes dependent nodes?)": function(success, failure) {
      /* We construct a new node with autoinitialization and
         with two dependent nodes. We initialize the node and
         immediately check, whether the two nodes were initialized. */
      var node = new JBus.Node,
          nodes = [
            new JBus.Node({
              requires: node.getName(),
              onuninit: increment
            }), new JBus.Node({
              requires: node.getName(),
              onuninit: increment
            })
          ], count = 0;
      node.destroy();
      if( count === 2 ) {
        success();
      } else {
        failure();
      } node.destroy();
      nodes[0].destroy();
      nodes[1].destroy();      
      
      function increment() {
        ++count;
      }
    }, "Method new JBus.Node().toString": function(success, failure) {
      /* We construct a new node and check that the return
         value of the new JBus.Node().toString method is
         a string. */
      var node = new JBus.Node;
      if( isString( node.toString() ) ) {
        success();
      } else {
        failure();
      } node.destroy();
    }, "Object JBus.Debugger construction, attribute oninit": function(success, failure) {
      /* We construct a new node without dependencies
         and wait for it to autoinitialize. */
      new JBus.Debugger({
        oninit: function() {
          success();
          this.destroy();
        },
        autolog: false
      });
    }, "Object JBus.Debugger construction, attribute oninit (wrong type)": function(success, failure) {
      /* We construct a new node with a mistyped
         attribute and expect it to fail. */
      try {
        new JBus.Node({
          oninit: "<string>"
        });
      } catch(e) {
        success();
        failure = function() {};
      } failure();
    }, "Object JBus.Debugger construction, attribute onuninit": function(success, failure) {
      /* We construct a new node without dependencies,
         we destroy it and wait for it to uninitialize. */
      new JBus.Debugger({
        onuninit: success,
        autolog: false
      }).destroy();
    }, "Object JBus.Debugger construction, attribute onuninit (wrong type)": function(success, failure) {
      /* We construct a new node with a mistyped
         attribute and expect it to fail. */
     try {
        new JBus.Node({
          onuninit: "<string>"
        });
      } catch(e) {
        success();
        failure = function() {};
      } failure();
    }, "Object JBus.Debugger construction, attribute ondestroy": function(success, failure) {
      /* We construct a new node without dependencies,
         we destroy it and wait for it to destroy itself. */
      new JBus.Debugger({
        ondestroy: success,
        autolog: false
      }).destroy();
    }, "Object JBus.Debugger construction, attribute ondestroy (wrong type)": function(success, failure) {
      /* We construct a new node with a mistyped
         attribute and expect it to fail. */
      try {
        new JBus.Node({
          ondestroy: "<string>"
        });
      } catch(e) {
        success();
        failure = function() {};
      } failure();
    }, "Object JBus.Debugger construction, attribute autoinit #1": function(success, failure) {
      /* We construct a new node without auto-initialization
         and we check whether it has been initialized once
         it is done constructing. */
      var node = new JBus.Debugger({
        oninit: failure,
        autoinit: false,
        autolog: false
      }); success();
      node.destroy();
    }, "Object JBus.Debugger construction, attribute autoinit #2": function(success, failure) {
      /* We construct a new node with auto-initialization
         and we check whether it has been initialized once
         it is done constructing. */
      var node = new JBus.Debugger({
        oninit: function() {
          failure = function() {};
          success();
        }, autolog: false
      }); failure();
      node.destroy();
    }, "Object JBus.Debugger construction, attribute autoinit (initializes immediately for nodes w/ dependencies?)": function(success, failure) {
      /* We construct a new node with autoinitialization and
         with initialized dependencies. Then we initialize it and we
         check, whether it is immediately initialized. */
      var nodes = [
          new JBus.Node,
          new JBus.Node
        ], node = new JBus.Debugger({
          autolog: false,
          requires: [
            nodes[0].getName(),
            nodes[1].getName()
          ], oninit: function() {
            failure = function() {};
            success();
          }
        });
      failure();
      node.destroy();
      nodes[0].destroy();
      nodes[1].destroy();
    }, "Object JBus.Debugger construction (overload #1)": function(success, failure) {
      /* We create a node using the parameterless constructor
         and we check whether it initializes using another node. */
      var node = new JBus.Debugger;
      new JBus.Node({
        requires: node.getName(),
        oninit: function() {
          success();
          /* We destroy the debugger node to prevent further
             cluttering up of the console. */
          node.destroy();
        }
      });
    }, "Method new JBus.Debugger().init (initializes?)": function(success, failure) {
      /* We construct a new node without autoinitialization,
         then we initialize it and we wait for it to initialize. */
      var node = new JBus.Debugger({
        autoinit: false,
        autolog: false,
        oninit: function() {
          success();
          this.destroy();
        }
      }); node.init();
    }, "Method new JBus.Debugger().init (initializes immediately for nodes w/o dependencies?)": function(success, failure) {
      /* We construct a new node without autoinitialization and
         without any dependencies. Then we initialize it and we
         check, whether it is immediately initialized. */
      var node = new JBus.Debugger({
        autoinit: false,
        autolog: false,
        oninit: function() {
          failure = function() {};
          success();
        }
      }); node.init();
      failure();
      node.destroy();
    }, "Method new JBus.Debugger().init (initializes immediately for nodes w/ dependencies?)": function(success, failure) {
      /* We construct a new node without autoinitialization and
         with initialized dependencies. Then we initialize it and we
         check, whether it is immediately initialized. */
      var nodes = [
          new JBus.Node,
          new JBus.Node
        ], node = new JBus.Debugger({
          autoinit: false,
          autolog: false,
          requires: [
            nodes[0].getName(),
            nodes[1].getName()
          ], oninit: function() {
            failure = function() {};
            success();
          }
        });
      node.init();
      failure();
      node.destroy();
      nodes[0].destroy();
      nodes[1].destroy();
    }, "Method new JBus.Debugger().init (immediately initializes dependent nodes?)": function(success, failure) {
      /* We construct a new node without autoinitialization and
         with two dependent nodes. We initialize the node and
         immediately check, whether the two nodes were initialized. */
      var node = new JBus.Debugger({
            autoinit: false,
            autolog: false
          }), nodes = [
            new JBus.Debugger({
              requires: node.getName(),
              oninit: increment,
              autolog: false
            }), new JBus.Debugger({
              requires: node.getName(),
              oninit: increment,
              autolog: false
            })
          ], count = 0;
      node.init();
      if( count === 2 ) {
        success();
      } else {
        failure();
      } node.destroy();
      nodes[0].destroy();
      nodes[1].destroy();      
      
      function increment() {
        ++count;
      }
    }, "Method new JBus.Debugger().destroy (destroys?)": function(success, failure) {
      /* We construct a new node, we destroy it and we wait for it
         to notify us about the event */
      new JBus.Debugger({
        ondestroy: success,
        autolog: false
      }).destroy();
    }, "Method new JBus.Debugger().destroy (destroys immediately?)": function(success, failure) {
      /* We construct a new node, we destroy it and we check,
         whether it is immediately destroyed */
      new JBus.Debugger({
        ondestroy: function() {
          failure = function() {};
          success();
        }, autolog: false
      }).destroy();
      failure();
    }, "Method new JBus.Debugger().toString": function(success, failure) {
      /* We construct a new node and check that the return
         value of the new JBus.Node().toString method is
         a string. */
      var node = new JBus.Debugger({
        autolog: false
      }); if( isString( node.toString() ) ) {
        success();
      } else {
        failure();
      } node.destroy();
    }, "Function JBus~isString": function(success, failure) {
      /* We check, whether the predicate holds. */
      if( isString(   "<string>"   ) === true  &&
          isString(   /<RegExp>/   ) === false &&
          isString(     12345      ) === false &&
          isString(      true      ) === false &&
          isString( function() { } ) === false &&
          isString( {/* Object */} ) === false &&
          isString( [/* Array  */] ) === false ) {
        success();
      } else {
        failure();
      }
    }, "Function JBus~isRegExp": function(success, failure) {
      /* We check, whether the predicate holds. */
      if( isRegExp(   "<string>"   ) === false &&
          isRegExp(   /<RegExp>/   ) === true  &&
          isRegExp(     12345      ) === false &&
          isRegExp(      true      ) === false &&
          isString( function() { } ) === false &&
          isRegExp( {/* Object */} ) === false &&
          isRegExp( [/* Array  */] ) === false ) {
        success();
      } else {
        failure();
      }
    }, "Function JBus~isFunction": function(success, failure) {
      /* We check, whether the predicate holds. */
      if( isFunction(   "<string>"   ) === false &&
          isFunction(   /<RegExp>/   ) === false &&
          isFunction(     12345      ) === false &&
          isFunction(      true      ) === false &&
          isFunction( function() { } ) === true  &&
          isFunction( {/* Object */} ) === false &&
          isFunction( [/* Array  */] ) === false ) {
        success();
      } else {
        failure();
      }
    }, "Function JBus~isArray": function(success, failure) {
      /* We check, whether the predicate holds. */
      if( isArray(   "<string>"   ) === false &&
          isArray(   /<RegExp>/   ) === false &&
          isArray(     12345      ) === false &&
          isArray(      true      ) === false &&
          isArray( function() { } ) === false &&
          isArray( {/* Object */} ) === false &&
          isArray( [/* Array  */] ) === true  ) {
        success();
      } else {
        failure();
      }
    }, "Function JBus~new$Array (array copy)": function(success, failure) {
      /* We make a copy of an array and check that it is identical */
      var array = [ "1", 2, ,[], 3 ],
          copy = new$Array(array);
      if( array[0] == copy[0] &&
          array[1] == copy[1] &&
          array[2] == copy[2] &&
          array[3] == copy[3] &&
          array[4] == copy[4] ) {
        success();
      } else {
        failure();
      }
    }, "Function JBus~new$Array (converting iterable into array)": function(success, failure) {
      /* We make a copy of an array and check that it is identical */
      var array = [ "1", 2, ,[], 3 ],
          copy = new$Array({
            0: array[0],
            1: array[1],
            2: array[2],
            3: array[3],
            4: array[4],
            length: array.length
          });
      if( array[0] == copy[0] &&
          array[1] == copy[1] &&
          array[2] == copy[2] &&
          array[3] == copy[3] &&
          array[4] == copy[4] ) {
        success();
      } else {
        failure();
      }
    }, "Method JBus~$String.random": function(success, failure) {
      /* We check, whether the predicate holds. */
      if( isString( $String.random() ) ) {
        success();
      } else {
        failure();
      }
    }, "Method JBus~$Array.forEach": function(success, failure) {
      /* We compute a sum of the values in an array * 2 + the amount of
         defined items in the sparse array and check if the result is correct. */
      var sum = 0;
      $Array.forEach( [ 1,, 2, 3, 4,, 5 ], function( value, index, array ) {
        sum += value + array[index] + 1;
      }); if(sum === 35) {
        success();
      } else {
        failure();
      }
    }, "Method JBus~$Array.some #1": function(success, failure) {
      /* We check that the parameters passed to the callback function are correct
         and that undefined items of the sparse array are ignored. */
      var count = 0,
          retVal = $Array.some( [ false,, false, true ], function( value, index, array ) {
            if( !array || value !== array[index] ) {
              failure();
            } ++count;
          });
      if(count === 3) {
        success();
      } else {
        failure();
      }
    }, "Method JBus~$Array.some #2": function(success, failure) {
      /* We try to find a true value in an array. */
      var failString = "<should never get here>",
          retVal = $Array.some( [ false,, false, true, failString ], function( value, index, array ) {
            if( value === failString ) {
              failure();
            } else if( value === true ) {
              return true;
            }
          });
      if( retVal === true ) {
        success();
      } else {
        failure();
      }
    }, "Method JBus~$Array.some #3": function(success, failure) {
      /* We try to find a true value in an array. */
      var retVal = $Array.some( [ false,, false ], function( value, index, array ) {
            if( value === true ) {
              return true;
            }
          });
      if( retVal === true ) {
        failure();
      } else {
        success();
      }
    }, "Method JBus~$Array.filter": function(success, failure) {
      /* We check, whether the filtering works. */
      var result = $Array.filter( [1, 2,, 3,,, 4, 5, 6, 7,,], function(n) {
        return n % 2 === 0;
      }), expected = [2, 4, 6];
      if( result[0] === expected[0] &&
          result[1] === expected[1] &&
          result[2] === expected[2] &&
          result.length === expected.length ) {
        success();
      } else {
        failure();
      }
    }, "Method JBus~$Array.indexOf #1": function(success, failure) {
      /* We check, whether the predicate holds. */
      if( $Array.indexOf( [ 1, 2, 3,, 4 ], 5 ) !== -1 ) {
        failure();
      } else {
        success();
      }
    }, "Method JBus~$Array.indexOf #2": function(success, failure) {
      /* We check, whether the predicate holds. */
      if( $Array.indexOf( [ 1, 2, 3,, 4 ], 4 ) !== 4 ) {
        failure();
      } else {
        success();
      }
    }, "Method JBus~$Array.contains #1": function(success, failure) {
      /* We check, whether the predicate holds. */
      if( $Array.contains( [ 1, 2, 3,, 4 ], 5 ) ) {
        failure();
      } else {
        success();
      }
    }, "Method JBus~$Array.contains #2": function(success, failure) {
      /* We check, whether the predicate holds. */
      if( $Array.contains( [ 1, 2, 3,, 4 ], 1 ) ) {
        success();
      } else {
        failure();
      }
    }, "Method JBus~$Array.add #1": function(success, failure) {
      /* We check, whether the predicate holds. */
      var set = [ 1, 2, 3 ];
      $Array.add( set, 1 );
      if( set.length !== 3 ) {
        failure();
      } else {
        success();
      }
    }, "Method JBus~$Array.add #2": function(success, failure) {
      /* We check, whether the predicate holds. */
      var set = [ 1, 2, 3 ];
      $Array.add( set, 4 );
      if( set.length !== 4 ) {
        failure();
      } else {
        success();
      }
    }, "Method JBus~$Array.remove #1": function(success, failure) {
      /* We check, whether the predicate holds. */
      var set = [ 1, 2, 3 ];
      $Array.remove( set, 1 );
      if( set.length !== 2 ) {
        failure();
      } else {
        success();
      }
    }, "Method JBus~$Array.remove #2": function(success, failure) {
      /* We check, whether the predicate holds. */
      var set = [ 1, 2, 3 ];
      $Array.remove( set, 4 );
      if( set.length !== 3 ) {
        failure();
      } else {
        success();
      }
    }
  },
  "Integration tests": {
    "Method JBus.services.events.send": function(success, failure) {
      // We generate a random name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName(),
          msg = new JBus.messages.Data({
            from: name
          });
      /* We send an event with data and try to capture it */
      var scope = new JBus.Scope,
          eventName = "jBus::broadcast",
          unsubscribe = JBus.services.events.listen( scope, eventName, function(receivedData) {
            if(receivedData === msg) {
              success();
              unsubscribe();              
            }
          });
      JBus.services.events.send( scope, eventName, msg );
    }, "Method JBus.services.events.listen": new RelativePath( "Method JBus.services.events.send" ),
    "Method JBus.services.events.listen (listener unsubscription)": function(success, failure) {
      // We generate a random name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName(),
          msg = new JBus.messages.Data({
            from: name
          });
      /* We send an event with data and try to capture it, then we
         nsubscribe the listener and check that the message has not
         been received. */
      var scope = new JBus.Scope,
          eventName = "jBus::broadcast",
          count = 0,
          unsubscribe = JBus.services.events.listen( scope, eventName, function(receivedData) {
            if( receivedData === msg && ++count === 1 ) {
              success();
              unsubscribe();
              JBus.services.events.send( scope, eventName, msg );              
            } else {
              failure();
            }
          });
      JBus.services.events.send( scope, eventName, msg );
    }, "Method JBus.services.messages.broadcast.send": function(success, failure) {
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName(),
          scope = new JBus.Scope,
          msg = new JBus.messages.Data({
            from: name
          });
      /* We send a message to the broadcast address of the node and try to capture it */
      var unsubscribe = JBus.services.messages.broadcast.listen( scope, function(receivedMsg) {
        if( receivedMsg === msg ) {
          success();
          unsubscribe();
        }
      }); JBus.services.messages.broadcast.send( scope, msg );      
    }, "Method JBus.services.messages.broadcast.listen": new RelativePath( "Method JBus.services.messages.broadcast.send" ),
    "Method JBus.services.messages.broadcast.listen (listener unsubscription)": function(success, failure) {
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName(),
          scope = new JBus.Scope,
          msg = new JBus.messages.Data({
            from: name
          }), count = 0;
      /* We send a message to the broadcast address of the node and try to capture it.
         Then we unsubscribe the listener and check that the message has not been received. */
      var unsubscribe = JBus.services.messages.broadcast.listen( scope, function(receivedMsg) {
        if( receivedMsg === msg ) {
          if( ++count === 1 ) {
            success();
            unsubscribe();
            JBus.services.messages.broadcast.send( scope, msg ); 
          } else {
            failure();
          }
        }
      }); JBus.services.messages.broadcast.send( scope, msg ); 
    }, "Method JBus.services.messages.unicast.send": function(success, failure) {
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName(),
          scope = new JBus.Scope,
          msg = new JBus.messages.Data({
            from: name
          });
      /* We send a message to the unicast address of the node and try to capture it */
      var unsubscribe = JBus.services.messages.unicast.listen( scope, name, function(receivedMsg) {
        if( receivedMsg === msg ) {
          success();
        } else {
          failure();
        } unsubscribe();
      }); JBus.services.messages.unicast.send( scope, name, msg );
    }, "Method JBus.services.messages.unicast.listen": new RelativePath( "Method JBus.services.messages.unicast.send" ),
    "Method JBus.services.messages.unicast.listen (listener unsubscription)": function(success, failure) {
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName(),
          scope = new JBus.Scope,
          msg = new JBus.messages.Data({
            from: name
          }), count = 0;
      /* We send a message to the unicast address of the node and try to capture it */
      var unsubscribe = JBus.services.messages.unicast.listen( scope, name, function(receivedMsg) {
        if( receivedMsg === msg && ++count === 1 ) {
          success();
          unsubscribe();
          JBus.services.messages.unicast.send( scope, name, msg );
        } else {
          failure();
        }
      }); JBus.services.messages.unicast.send( scope, name, msg );
    }, "Object JBus.Scope construction": new RelativePath( "Method JBus.services.events.send" ),
    "Method JBus.Scope": function(success, failure) {
      /* We construct two nodes, one in the default scope and
         the other in the JBus.Scope() scope with one depending
         on the other. The JBus.Scope() and the default scope
         should be the same and the dependent node should initialize. */
      var node = new JBus.Node;
      new JBus.Node({
        scope: JBus.Scope(),
        requires: node.getName(),
        oninit: function() {
          success();
          node.destroy();
          this.destroy();
        }
      });
    }, "Object JBus.Node construction, attribute description": function(success, failure) {
      /* We construct a debugger node and a node with a given description
         and we wait for the debugger node to receive a bonjour message
         from the given node with the given description to see whether
         the description has been adopted by the node. */
      var description = "<name.witiko.jbus.testsuite.description@" + $String.random() + ">";
      var node = new JBus.Node({
        autoinit: false,
        description: description
      }), debug = new JBus.Debugger({
        autolog: false
      }); debug.listen(function(obj) {
        var msg = obj.msg;
        if( msg instanceof JBus.messages.Bonjour &&
            msg.from === node.getName() &&
            msg.description === description ) {
          success();
          debug.destroy();
          node.destroy();
        }
      });
      node.init();
    }, "Object JBus.Node construction, attribute scope (overload #1)": function(success, failure) {
      /* We construct two nodes both in the same synthetic
         scope with the second one depending on the first
         one and wait for the second node to initialize. */
      var scope = document.createTextNode(""),
          node = new JBus.Node({
            scope: scope
          });
      new JBus.Node({
        requires: node.getName(),
        scope: scope,
        oninit: function() {
          success();
          this.destroy();
          node.destroy();
        }
      });
    }, "Object JBus.Node construction, attribute scope (overload #2)": function(success, failure) {
      /* We construct two synthetic scopes and three nodes,
         where the first node is present in the first scope,
         the second node it present in the second scope and
         has the same name as the first node and the third
         node is present in both scopes and has a dependency
         on the name of the first two nodes.
      
         We first wait for the third node to initialize,
         then we destroy the first node and wait for the
         third node to unititialize and reinitialize, then
         we destroy the second node and wait for the third
         node to uninitialize */
      var scopes = [
        document.createTextNode(""),
        document.createTextNode("")
      ], first = new JBus.Node({
        scope: scopes[0]
      }), second = new JBus.Node({        
        name: first.getName(),
        scope: scopes[1]
      }); new JBus.Node({
        scope: scopes,
        requires: first.getName(),
        oninit: function() {
          // We destroy the first node
          this.onuninit = function() {
            this.oninit = function() {
              // We destroy the second node
              this.onuninit = function() {
                success();
                this.destroy();
              };
              second.destroy();
            };          
          };
          first.destroy();
        }
      });
    }, "Object JBus.Node construction, attribute group (overload #1)": function(success, failure) {
      /* We construct five nodes, three of which are listening
         in a multicast group. We then send a message to the broadcast
         group and we check that it has been received exactly three times. */
      var name = getRandomGroupName(),
          count = 0,
          nodes = [
            new JBus.Node,
            new JBus.Node,
            new JBus.Node({ group: name }),
            new JBus.Node({ group: name }),
            new JBus.Node({ group: name })
          ];
          
      $Array.forEach(nodes, function(node) {
        node.listen({
          multicast: function() {
            ++count;
          }
        });
      }); nodes[0].send({
        to: { group: name }
      }); if(count === 3) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(nodes, function(node) {
        node.destroy();
      });
    }, "Object JBus.Node construction, attribute group (overload #2)": function(success, failure) {
      /* We construct five nodes, three of which are listening in multicast
         groups. We then send a message to the broadcast groups and we check
         that it has been received the right amount of times. */
      var names = [
            getRandomGroupName(),
            getRandomGroupName()
          ], count = 0,
          nodes = [
            new JBus.Node,
            new JBus.Node,
            new JBus.Node({ group: names[0] }),
            new JBus.Node({ group: names    }),
            new JBus.Node({ group: names[1] })
          ];
          
      $Array.forEach(nodes, function(node) {
        node.listen({
          multicast: function() {
            ++count;
          }
        });
      }); nodes[0].send({
        to: { group: names }
      }); if(count === 4) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(nodes, function(node) {
        node.destroy();
      });
    }, "Object JBus.Node construction, attribute requires (satisfied, overload #1)": function(success, failure) {
      /* We construct two nodes with the second one
         depending on the first one and wait for the
         second node to initialize. */
      var node = new JBus.Node();
      new JBus.Node({
        requires: node.getName(),
        oninit: function() {
          success();
          node.destroy();
          this.destroy();
        }
      });
    }, "Object JBus.Node construction, attribute requires (satisfied, overload #2)": function(success, failure) {
      /* We construct three nodes with the third one
         depending on the first two and wait for the
         third node to initialize. */
      var nodes = [
        new JBus.Node(),
        new JBus.Node()
      ]; new JBus.Node({
        requires: [
          nodes[0].getName(),
          nodes[1].getName()
        ],
        oninit: function() {
          success();
          this.destroy();
          nodes[0].destroy();
          nodes[1].destroy();
        }
      });
    }, "Object JBus.Node construction, attribute requires (unsatisfied, overload #1)": function(success, failure) {
      /* We construct two nodes with the second one
         depending on the first one and wait for the
         second node to initialize. */
      var node = new JBus.Node();
      node.destroy();
      success();
      new JBus.Node({
        requires: node.getName(),
        oninit: function() {
          failure();
          this.destroy();
        }
      });
    }, "Object JBus.Node construction, attribute requires (unsatisfied, overload #2)": function(success, failure) {
      /* We construct three nodes with the third one
         depending on the first two and wait for the
         third node to initialize. */
      var nodes = [
        new JBus.Node(),
        new JBus.Node()
      ]; success();
      nodes[0].destroy();
      nodes[1].destroy();
      new JBus.Node({
        requires: [
          nodes[0].getName(),
          nodes[1].getName()
        ],
        oninit: function() {
          failure();
          this.destroy();
        }
      });
    }, "Object JBus.Node construction, attribute requires (wrong type, overload #1)": function(success, failure) {
      /* We construct two nodes with the second one
         depending on the first one and wait for the
         second node to initialize. */
      try {
        new JBus.Node({
          requires: /<wrong type>/
        });
      } catch(e) {
        success();
        failure = function() {};
      } failure();
    }, "Object JBus.Node construction, attribute requires (wrong type, overload #2)": function(success, failure) {
      /* We construct two nodes with the second one
         depending on the first one and wait for the
         second node to initialize. */
      try {
        new JBus.Node({
          requires: [ "<correct>", "<also correct>", /<wrong type>/ ]
        });
      } catch(e) {
        success();
        failure = function() {};
      } failure();
    }, "Method new JBus.Node().send (unicast, overload #1)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            unicast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload ) {
                success();
              } else {
                failure();
              } this.destroy();
              sender.destroy();
            }
          });
      sender.send({
        to: {
          node: receiver.getName()
        }, data: data
      });
    }, "Method new JBus.Node().send (unicast, overload #2)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            unicast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload ) {
                success();
              } else {
                failure();
              } this.destroy();
              sender.destroy();
            }
          });
      sender.send({
        to: {
          node: [ receiver.getName() ]
        }, data: data
      });
    }, "Method new JBus.Node().send (multicast, overload #1)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the multicast address of a group the second
         one is listening to and we check that it has been received. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, group = getRandomGroupName(),
          sender = new JBus.Node,
          receiver = new JBus.Node({ group: group });
          receiver.listen({
            multicast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload ) {
                success();
              } else {
                failure();
              } this.destroy();
              sender.destroy();
            }
          });
      sender.send({
        to: {
          group: group
        }, data: data
      });
    }, "Method new JBus.Node().send (multicast, overload #2)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the multicast address of a group the second
         one is listening to and we check that it has been received. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, group = getRandomGroupName(),
          sender = new JBus.Node,
          receiver = new JBus.Node({ group: group });
          receiver.listen({
            multicast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload ) {
                success();
              } else {
                failure();
              } this.destroy();
              sender.destroy();
            }
          });
      sender.send({
        to: {
          group: [ group ]
        }, data: data
      });
    }, "Method new JBus.Node().send (broadcast, overload #1)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the broadcast address and we check that
         it has been received by the second node. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            broadcast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload ) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send({
        data: data
      });
    }, "Method new JBus.Node().send (broadcast, overload #2)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the broadcast address and we check that
         it has been received by the second node. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            broadcast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload ) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send({
        to: { },
        data: data
      });
    }, "Method new JBus.Node().send (overload #1)": function(success, failure) {
      /* We construct two nodes and we send a message using
         the shorthand overload from the first one to the
         unicast address of the second one and we check that
         it has been received. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            broadcast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload ) {
                success();
              } else {
                failure();
              } this.destroy();
              sender.destroy();
            }
          });
      sender.send( data );
    }, "Method new JBus.Node().send (overload #2)": function(success, failure) {
      /* We construct two nodes and we send a message using
         the shorthand overload from the first one to the
         unicast address of the second one and we check that
         it has been received. */
      var payload = "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">",
          sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            broadcast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.payload === payload ) {
                success();
              } else {
                failure();
              } this.destroy();
              sender.destroy();
            }
          });
      sender.send({
        data: payload
      });
    }, "Method new JBus.Node().send (overload #3)": function(success, failure) {
      /* We construct two nodes and we send a message using
         the shorthand overload from the first one to the
         unicast address of the second one and we check that
         it has been received. */
      var payload = "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">",
          sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            broadcast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.payload === payload ) {
                success();
              } else {
                failure();
              } this.destroy();
              sender.destroy();
            }
          });
      sender.send( payload );
    }, "Method new JBus.Node().send (overload #4)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            unicast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload ) {
                success();
              } else {
                failure();
              } this.destroy();
              sender.destroy();
            }
          });
      sender.send({
        to: receiver.getName(),
        data: data
      });
    }, "Method new JBus.Node().listen, attribute broadcast": new RelativePath( "Method new JBus.Node().send (broadcast, overload #1)" ),
    "Method new JBus.Node().listen, attribute multicast": new RelativePath( "Method new JBus.Node().send (multicast, overload #1)" ),
    "Method new JBus.Node().listen, attribute unicast": new RelativePath( "Method new JBus.Node().send (unicast, overload #1)" ),
    "Method new JBus.Node().listen, attribute any": function(success, failure) {
      /* We construct two nodes and we send two messages
         from the first one:
         
          * One to the unicast address of the second one.
          * One to the broadcast address.
         
         Then we check that both has been received by
         the second node. */
      var payload = "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">",
          count = 0,
          sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            any: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.payload === payload ) {
                if(++count === 2) {
                  success();
                  this.destroy();
                  sender.destroy();
                }
              }
            }
          });
      sender.send( payload );
      sender.send({
        to: receiver.getName(),
        data: payload
      });
    }, "Method new JBus.Node().listen (listener unsubscription #1)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. Then
         we subsubscribe the listener, send another message
         and check that it has not been received. */
      var count = 0,
          data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node,
          unsubscribe = receiver.listen({
            unicast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload &&
                  ++count === 1 ) {
                success();
                unsubscribe();
                sender.send({
                  to: receiver.getName(),
                  data: data
                });
              } else {
                failure();
              } sender.destroy();
            }
          });
      sender.send({
        to: receiver.getName(),
        data: data
      });
    }, "Method new JBus.Node().listen (listener unsubscription #2)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. Then
         we subsubscribe the listener, send another message
         and check that it has not been received. */
      var count = 0,
          data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node,
          unsubscribe = receiver.listen({
            broadcast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload ) {
                if( ++count === 1 ) {
                  success();
                  unsubscribe();
                  sender.send({
                    data: data
                  });
                } else {
                  failure();
                } sender.destroy();
              }
            }
          });
      sender.send({
        data: data
      });
    }, "Method new JBus.Node().listen (overload #1)": function(success, failure) {
      /* We construct two nodes and we send two messages
         from the first one:
         
          * One to the unicast address of the second one.
          * One to the broadcast address.
         
         Then we check that both has been received by
         the second node. */
      var payload = "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">",
          count = 0,
          sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen(function(msg) {
            if( msg.from === sender.getName() &&
                msg.data.payload === payload ) {
              if(++count === 2) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send( payload );
      sender.send({
        to: receiver.getName(),
        data: payload
      });
    }, "Method new JBus.Node().listen (attributes filter.*, String)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received despite
         the filters. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            unicast: function() {
              success();
              this.destroy();
              sender.destroy();
            }, filters: {
              from: sender.getName(),
              name: data.name,
              payload: data.payload
            }
          });
      sender.send({
        to: receiver.getName(),
        data: data
      });
    }, "Method new JBus.Node().listen (attributes filter.*, RegExp)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received despite
         the filters. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            unicast: function() {
              success();
              this.destroy();
              sender.destroy();
            }, filters: {
              from: new RegExp( sender.getName() ),
              name: new RegExp( data.name ),
              payload: new RegExp( data.payload )
            }
          });
      sender.send({
        to: receiver.getName(),
        data: data
      });
    }, "Method new JBus.Node().listen (attributes filter.*, Function)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received despite
         the filters. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            unicast: function() {
              success();
              this.destroy();
              sender.destroy();
            }, filters: {
              from: function(str) { return str === sender.getName(); },
              name: function(str) { return str === data.name; },
              payload: function(str) { return str === data.payload; }
            }
          });
      sender.send({
        to: receiver.getName(),
        data: data
      });
    }, "Method new JBus.Node().listen (attributes filter.*, Array)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received despite
         the filters. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          receiver = new JBus.Node;
          receiver.listen({
            unicast: function() {
              success();
              this.destroy();
              sender.destroy();
            }, filters: {
              from: [ "<wrong>", /wrong/ , function(str) { return str === sender.getName(); } ],
              name: [ function(/* <wrong> */) { return false; }, data.name, /<wrong>/ ],
              payload: [ new RegExp( data.payload ), function(/* <wrong> */) { return false; }, "<wrong>" ]
            }
          });
      sender.send({
        to: receiver.getName(),
        data: data
      });
    }, "Object JBus.Debugger construction, attribute scope (overload #1)": function(success, failure) {
      /* We construct two nodes both in the same synthetic
         scope with the second one depending on the first
         one and wait for the second node to initialize. */
      var scope = document.createTextNode(""),
          node = new JBus.Node({
            scope: scope
          });
      new JBus.Debugger({
        requires: node.getName(),
        scope: scope,
        oninit: function() {
          success();
          this.destroy();
          node.destroy();
        }, autolog: false
      });
    }, "Object JBus.Debugger construction, attribute scope (overload #2)": function(success, failure) {
      /* We construct two synthetic scopes and three nodes,
         where the first node is present in the first scope,
         the second node it present in the second scope and
         has the same name as the first node and the third
         node is present in both scopes and has a dependency
         on the name of the first two nodes.
      
         We first wait for the third node to initialize,
         then we destroy the first node and wait for the
         third node to unititialize and reinitialize, then
         we destroy the second node and wait for the third
         node to uninitialize */
      var scopes = [
        document.createTextNode(""),
        document.createTextNode("")
      ], first = new JBus.Node({
        scope: scopes[0]
      }), second = new JBus.Node({        
        name: first.getName(),
        scope: scopes[1]
      }); new JBus.Debugger({
        scope: scopes,
        requires: first.getName(),
        autolog: false,
        oninit: function() {
          // We destroy the first node
          this.onuninit = function() {
            this.oninit = function() {
              // We destroy the second node
              this.onuninit = function() {
                success();
                this.destroy();
              };
              second.destroy();
            };          
          };
          first.destroy();
        }
      });
    }, "Object JBus.Debugger construction, attribute group (overload #1)": function(success, failure) {
      /* We construct five nodes, three of which are listening
         in a multicast group. We then send a message to the broadcast
         group and we check that it has been received exactly three times. */
      var name = getRandomGroupName(),
          count = 0,
          nodes = [
            new JBus.Debugger({ autolog: false }),
            new JBus.Debugger({ autolog: false }),
            new JBus.Debugger({ group: name, autolog: false }),
            new JBus.Debugger({ group: name, autolog: false }),
            new JBus.Debugger({ group: name, autolog: false })
          ];
          
      $Array.forEach(nodes, function(node) {
        node.listen({
          multicast: function() {
            ++count;
          }
        });
      }); nodes[0].send({
        to: { group: name },
        msg: new JBus.messages.Data({
          from: nodes[0].getName()
        }) 
      }); if(count === 3) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(nodes, function(node) {
        node.destroy();
      });
    }, "Object JBus.Debugger construction, attribute group (overload #2)": function(success, failure) {
      /* We construct five nodes, three of which are listening in multicast
         groups. We then send a message to the broadcast groups and we check
         that it has been received the right amount of times. */
      var names = [
            getRandomGroupName(),
            getRandomGroupName()
          ], count = 0,
          nodes = [
            new JBus.Debugger({ autolog: false }),
            new JBus.Debugger({ autolog: false }),
            new JBus.Debugger({ group: names[0], autolog: false }),
            new JBus.Debugger({ group: names   , autolog: false }),
            new JBus.Debugger({ group: names[1], autolog: false })
          ];
          
      $Array.forEach(nodes, function(node) {
        node.listen({
          multicast: function() {
            ++count;
          }
        });
      }); nodes[0].send({
        to: { group: names },
        msg: new JBus.messages.Data({
          from: nodes[0].getName()
        })
      }); if(count === 4) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(nodes, function(node) {
        node.destroy();
      });
    }, "Object JBus.Debugger construction, attribute requires (satisfied, overload #1)": function(success, failure) {
      /* We construct two nodes with the second one
         depending on the first one and wait for the
         second node to initialize. */
      var node = new JBus.Node;
      new JBus.Debugger({
        requires: node.getName(),
        oninit: function() {
          success();
          this.destroy();
          node.destroy();
        }, autolog: false
      });
    }, "Object JBus.Debugger construction, attribute requires (satisfied, overload #2)": function(success, failure) {
      /* We construct three nodes with the third one
         depending on the first two and wait for the
         third node to initialize. */
      var nodes = [
        new JBus.Node(),
        new JBus.Node()
      ]; new JBus.Debugger({
        requires: [
          nodes[0].getName(),
          nodes[1].getName()
        ], oninit: function() {
          success();
          this.destroy();
          nodes[0].destroy();
          nodes[1].destroy();
        }, autolog: false
      });
    }, "Object JBus.Debugger construction, attribute requires (unsatisfied, overload #1)": function(success, failure) {
      /* We construct two nodes with the second one
         depending on the first one and wait for the
         second node to initialize. */
      var node = new JBus.Node;
      node.destroy();
      success();
      new JBus.Debugger({
        requires: node.getName(),
        oninit: function() {
          failure();
          this.destroy();
        }, autolog: false
      });
    }, "Object JBus.Debugger construction, attribute requires (unsatisfied, overload #2)": function(success, failure) {
      /* We construct three nodes with the third one
         depending on the first two and wait for the
         third node to initialize. */
      var nodes = [
        new JBus.Node(),
        new JBus.Node()
      ]; success();
      nodes[0].destroy();
      nodes[1].destroy();
      new JBus.Debugger({
        requires: [
          nodes[0].getName(),
          nodes[1].getName()
        ], oninit: function() {
          failure();
          this.destroy();
        }, autolog: false
      });
    }, "Method new JBus.Debugger().send (unicast, overload #1)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. */
      var sender = new JBus.Debugger({
            autolog: false
          }), msg = new JBus.messages.Data({
            from: sender.getName(),
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }), receiver = new JBus.Debugger({
            autolog: false
          }); receiver.listen({
            unicast: function(obj) {
              if(!obj || !obj.msg || !obj.msg.data) return;
              if( obj.to === receiver.getName() &&
                  obj.msg.from === sender.getName() &&
                  obj.msg.data.name === msg.data.name &&
                  obj.msg.data.payload === msg.data.payload ) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send({
        to: {
          node: receiver.getName()
        }, msg: msg
      });
    }, "Method new JBus.Debugger().send (unicast, overload #2)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. */
      var sender = new JBus.Debugger({
            autolog: false
          }), msg = new JBus.messages.Data({
            from: sender.getName(),
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }), receiver = new JBus.Debugger({
            autolog: false
          }); receiver.listen({
            unicast: function(obj) {
              if(!obj || !obj.msg || !obj.msg.data) return;
              if( obj.to === receiver.getName() &&
                  obj.msg.from === sender.getName() &&
                  obj.msg.data.name === msg.data.name &&
                  obj.msg.data.payload === msg.data.payload ) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send({
        to: {
          node: [ receiver.getName() ]
        }, msg: msg
      });
    }, "Method new JBus.Debugger().send (multicast, overload #1)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. */
      var group = getRandomGroupName(),
          sender = new JBus.Debugger({
            autolog: false
          }), msg = new JBus.messages.Data({
            from: sender.getName(),
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }), receiver = new JBus.Debugger({
            group: group,
            autolog: false
          }); receiver.listen({
            multicast: function(obj) {
              if(!obj || !obj.msg || !obj.msg.data) return;
              if( obj.to === group &&
                  obj.msg.from === sender.getName() &&
                  obj.msg.data.name === msg.data.name &&
                  obj.msg.data.payload === msg.data.payload ) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send({
        to: {
          group: group
        }, msg: msg
      });
    }, "Method new JBus.Debugger().send (multicast, overload #2)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. */
      var group = getRandomGroupName(),
          sender = new JBus.Debugger({
            autolog: false
          }), msg = new JBus.messages.Data({
            from: sender.getName(),
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }), receiver = new JBus.Debugger({
            group: group,
            autolog: false
          }); receiver.listen({
            multicast: function(obj) {
              if(!obj || !obj.msg || !obj.msg.data) return;
              if( obj.to === group &&
                  obj.msg.from === sender.getName() &&
                  obj.msg.data.name === msg.data.name &&
                  obj.msg.data.payload === msg.data.payload ) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send({
        to: {
          group: [ group ]
        }, msg: msg
      });
    }, "Method new JBus.Debugger().send (broadcast, overload #1)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the broadcast address and we check that
         it has been received by the second node. */
      var sender = new JBus.Debugger({
            autolog: false
          }), msg = new JBus.messages.Data({
            from: sender.getName(),
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }), receiver = new JBus.Debugger({
            autolog: false
          }); receiver.listen({
            broadcast: function(obj) {
              if(!obj || !obj.msg || !obj.msg.data) return;
              if( obj.msg.from === sender.getName() &&
                  obj.msg.data.name === msg.data.name &&
                  obj.msg.data.payload === msg.data.payload ) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send({
        msg: msg
      });
    }, "Method new JBus.Debugger().send (broadcast, overload #2)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the broadcast address and we check that
         it has been received by the second node. */
      var sender = new JBus.Debugger({
            autolog: false
          }), msg = new JBus.messages.Data({
            from: sender.getName(),
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }), receiver = new JBus.Debugger({
            autolog: false
          }); receiver.listen({
            broadcast: function(obj) {
              if(!obj || !obj.msg || !obj.msg.data) return;
              if( obj.msg.from === sender.getName() &&
                  obj.msg.data.name === msg.data.name &&
                  obj.msg.data.payload === msg.data.payload ) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send({
        to: { },
        msg: msg
      });
    }, "Method new JBus.Debugger().send (overload #1)": function(success, failure) {
      /* We construct two nodes and we send a message using a
         shorthand overload from the first one to the broadcast
         address and we check that it has been received by
         the second node. */
      var sender = new JBus.Debugger({
            autolog: false
          }), msg = new JBus.messages.Data({
            from: sender.getName(),
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }), receiver = new JBus.Debugger({
            autolog: false
          }); receiver.listen({
            broadcast: function(obj) {
              if(!obj || !obj.msg || !obj.msg.data) return;
              if( obj.msg.from === sender.getName() &&
                  obj.msg.data.name === msg.data.name &&
                  obj.msg.data.payload === msg.data.payload ) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send( msg );
    },"Method new JBus.Debugger().send (overload #2)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. */
      var sender = new JBus.Debugger({
            autolog: false
          }), msg = new JBus.messages.Data({
            from: sender.getName(),
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }), receiver = new JBus.Debugger({
            autolog: false
          }); receiver.listen({
            unicast: function(obj) {
              if(!obj || !obj.msg || !obj.msg.data) return;
              if( obj.to === receiver.getName() &&
                  obj.msg.from === sender.getName() &&
                  obj.msg.data.name === msg.data.name &&
                  obj.msg.data.payload === msg.data.payload ) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      sender.send({
        to: receiver.getName(),
        msg: msg
      });
    }, "Method new JBus.Debugger().listen, attribute broadcast": new RelativePath( "Method new JBus.Debugger().send (broadcast, overload #1)" ),
    "Method new JBus.Debugger().listen, attribute multicast": new RelativePath( "Method new JBus.Debugger().send (multicast, overload #1)" ),
    "Method new JBus.Debugger().listen, attribute unicast": new RelativePath( "Method new JBus.Debugger().send (unicast, overload #1)" ),
    "Method new JBus.Debugger().listen, attribute any": function(success, failure) {
      /* We construct two nodes and we send two messages
         from the first one:
         
          * One to the unicast address of the second one.
          * One to the broadcast address.
         
         Then we check that both has been received by
         the second node. */
      var count = 0,
          sender = new JBus.Debugger({
            autolog: false
          }), msg = new JBus.messages.Data({
            from: sender.getName(),
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }), receiver = new JBus.Debugger({
            autolog: false
          }); receiver.listen({
            any: function(obj) {
              if(!obj || !obj.msg || !obj.msg.data) return;
              if( obj.msg.from === sender.getName() &&
                  obj.msg.data.name === msg.data.name &&
                  obj.msg.data.payload === msg.data.payload ) {
                if(++count === 2) {
                  success();
                  this.destroy();
                  sender.destroy();
                }
              }
            }
          });
      
      sender.send( msg );
      sender.send({
        to: receiver.getName(),
        msg: msg
      });
    }, "Method new JBus.Debugger().listen (listener unsubscription #1)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the unicast address of the second
         one and we check that it has been received. Then
         we subsubscribe the listener, send another message
         and check that it has not been received. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          count = 0,
          receiver = new JBus.Node,
          unsubscribe = receiver.listen({
            unicast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload &&
                  ++count === 1 ) {
                success();
                unsubscribe();
                sender.send({
                  to: receiver.getName(),
                  data: data
                });
              } else {
                failure();
              } sender.destroy();
            }
          });
      sender.send({
        to: receiver.getName(),
        data: data
      });
    }, "Method new JBus.Debugger().listen (listener unsubscription #2)": function(success, failure) {
      /* We construct two nodes and we send a message from the
         first one to the broadcast address and we check that
         it has been received. Then we subsubscribe the listener,
         send another message and check that it has not been received. */
      var data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node,
          count = 0,
          receiver = new JBus.Node,
          unsubscribe = receiver.listen({
            broadcast: function(msg) {
              if( msg.from === sender.getName() &&
                  msg.data.name === data.name &&
                  msg.data.payload === data.payload ) {
                if( ++count === 1 ) {
                  success();
                  unsubscribe();
                  sender.send({
                    data: data
                  });
                } else {
                  failure();
                } sender.destroy();
              }
            }
          });
      sender.send({
        data: data
      });
    }, "Method new JBus.Debugger().listen (overload #1)": function(success, failure) {
      /* We construct two nodes and we send two messages
         from the first one:
         
          * One to the unicast address of the second one.
          * One to the broadcast address.
         
         Then we check that both has been received by
         the second node. */
      var count = 0,
          sender = new JBus.Debugger({
            autolog: false
          }), msg = new JBus.messages.Data({
            from: sender.getName(),
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }), receiver = new JBus.Debugger({
            autolog: false
          }); receiver.listen(function(obj) {
            if(!obj || !obj.msg || !obj.msg.data) return;
            if( obj.msg.from === sender.getName() &&
                obj.msg.data.name === msg.data.name &&
                obj.msg.data.payload === msg.data.payload ) {
              if(++count === 2) {
                success();
                this.destroy();
                sender.destroy();
              }
            }
          });
      
      sender.send( msg );
      sender.send({
        to: receiver.getName(),
        msg: msg
      });
    }
  }, "Protocol adherence tests": {
    "Object JBus.Node protocol adherence (Lifecycle §1)": new AbsolutePath( "Unit tests", "Object JBus.Node construction, attribute autoinit #1" ),
    "Object JBus.Node protocol adherence (Lifecycle §2.1)": new AbsolutePath( "Unit tests", "Method new JBus.Node().init (initializes?)" ),
    "Object JBus.Node protocol adherence (Lifecycle §2.2)": function(success, failure) {
      /* We create a node, we initialize it and we wait for it to
         send a collision message to itself. */
      var scope = new JBus.Scope,
          node = new JBus.Node({
            autoinit: false,
            scope: scope
          }), unsubscribe = JBus.services.messages.unicast.listen( scope, node.getName(), function( msg ) {
            if( msg && msg instanceof JBus.messages.Collision ) {
              success();
            } else {
              failure();
            } unsubscribe();
            node.destroy();
          }); node.init();
    }, "Object JBus.Node protocol adherence (Lifecycle §2.3.1)": function(success, failure) {
      /* We create a node and we send a data message to the broadcast
         address. The node should not react. We then initialize the
         node and repeat the same procedure. The node should now receive
         the message. */
      var counter = 0,
          name = getRandomName(),
          scope = new JBus.Scope,
          node = new JBus.Node({
            scope: scope,
            oninit: function() {
              send();
            }, autoinit: false
          });
      node.listen({
        broadcast: function() {
          ++counter;
        }, filters: {
          name: name
        }
      });
      send();
      node.init();    
      
      function send() {
        JBus.services.messages.broadcast.send( scope, new JBus.messages.Data({
          from: node.getName(),
          name: name
        }));
      }  
      
      if(counter === 1) {
        success();
      } else {
        failure();
      }
      
      node.destroy();
    }, "Object JBus.Node protocol adherence (Lifecycle §2.3.2)": function(success, failure) {
      /* We create a node and we send a data message to the multicast
         address of the groups the node is listening to. The node should
         not react. We then initialize the node and repeat the same
         procedure. The node should now receive the message. */
      var counter = 0,
          groups = [
            getRandomGroupName(),
            getRandomGroupName(),
            getRandomGroupName()
          ], scope = new JBus.Scope,
          node = new JBus.Node({
            scope: scope,
            group: groups,
            oninit: function() {
              send();
            }, autoinit: false
          });
      node.listen({
        multicast: function() {
          ++counter;
        }
      });
      send();
      node.init();    
      
      function send() {
        $Array.forEach(groups, function(group) {
          JBus.services.messages.multicast.send( scope, group, new JBus.messages.Data({
            from: node.getName()
          }));
        });
      }  
      
      if(counter === groups.length) {
        success();
      } else {
        failure();
      }
      
      node.destroy();
    }, "Object JBus.Node protocol adherence (Lifecycle §2.3.3)": function(success, failure) {
      /* We create a node and we send a data message to its unicast address. The
         node should not react. We then initialize the node and repeat
         the same procedure. The node should now receive the message. */
      var counter = 0,
          scope = new JBus.Scope,
          node = new JBus.Node({
            scope: scope,
            oninit: function() {
              send();
            }, autoinit: false
          });
      node.listen({
        unicast: function() {
          ++counter;
        }
      }); send();
      node.init(); 
      
      function send() {
        JBus.services.messages.unicast.send( scope, node.getName(), new JBus.messages.Data({
          from: node.getName()
        }));
      }     
      
      if(counter === 1) {
        success();
      } else {
        failure();
      }
      
      node.destroy();
    }, "Object JBus.Node protocol adherence (Lifecycle §2.4.1)": function(success, failure) {
      /* We create two nodes, each in the same two scopes and a third node, also in
         both scopes, which depends on the two nodes. We then initialize all nodes
         and we wait for it to initialize, having sent 4 ping messages in total. */
      var scopes = [
        new JBus.Scope,
        new JBus.Scope
      ], nodes = [
        new JBus.Node({ scope: scopes }),
        new JBus.Node({ scope: scopes })
      ], node = new JBus.Node({
        scope: scopes,
        requires: [
          nodes[0].getName(),
          nodes[1].getName()
        ], autoinit: false
      }), count = 0;
      
      var unsubscribes = [  ];
      $Array.forEach( scopes, function( scope ) {
        $Array.forEach( nodes, function( node ) {
          unsubscribes.push( JBus.services.messages.unicast.listen( scope, node.getName(), callback ) );
        })
      });
      
      node.init();
      
      function callback(msg) {
        if( msg && msg instanceof JBus.messages.Ping &&
            msg.from === node.getName() &&
            ++count === nodes.length * scopes.length ) {
          success();
          $Array.forEach( unsubscribes, function(unsubscribe) {
            unsubscribe();
          }); node.destroy();
          nodes[0].destroy();
          nodes[1].destroy();
        } else {
          failure();
        }
      }
    }, "Object JBus.Node protocol adherence (Lifecycle §3)": function(success, failure) {
      /* We create two scopes and two nodes, each in the respective scope and
         a third node, which is present in both scopes. We then initialize the
         third node and then the first node. Next, we destroy the first node
         and we initialize the second node. The third node should never become
         initialized. Next, we initialize a node named as the first node in the
         second scope and we wait for the third node to destroy itself. */
      var scopes = [
        new JBus.Scope,
        new JBus.Scope
      ], nodes = [
        new JBus.Node({
          scope: scopes[0],
          autoinit: false
        }), new JBus.Node({
          scope: scopes[1],
          autoinit: false
        })
      ], node = new JBus.Node({
        scope: scopes,
        requires: [
          nodes[0].getName(),
          nodes[1].getName()
        ], oninit: function() {
          failure();
          cleanUp();
        }, autoinit: false
      }); node.init();
      nodes[0].init();
      nodes[0].destroy();
      nodes[1].init();
      nodes[0] = new JBus.Node({
        name: nodes[0].getName(),
        scope: scopes[1],
        autoinit: false
      }); node.oninit = function() {
        success();
        cleanUp();
      }; nodes[0].init();
      
      function cleanUp() {
        node.destroy();
        nodes[0].destroy();
        nodes[1].destroy();
      }
    }, "Object JBus.Node protocol adherence (Lifecycle §4)": function(success, failure) {
      /* We construct two nodes, both with an unfulfilled
         dependency and we send a data message from the
         first one to the unicast address of the second
         one. Next, we satisfy the first dependency and
         resend the data message. Next, we satisfy the
         second dependency and check that the both nodes
         have by now sent a bonjour message and no data
         messages have yet been exchanged. We now resend
         the data message and check that it has been received. */
      var dataMsgCount = 0,
          bonjourMsgCount = 0,
          nodes = [
            new JBus.Node({ autoinit: false }),
            new JBus.Node({ autoinit: false })
          ], data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Node({ requires: nodes[0].getName() }),
          receiver = new JBus.Node({ requires: nodes[1].getName() }),
          unsubscribes = [
            receiver.listen({
              unicast: function(msg) {
                if( msg.from === sender.getName() &&
                    msg.data.name === data.name &&
                    msg.data.payload === data.payload ) {
                  ++dataMsgCount;
                }
              }
            }), JBus.services.messages.broadcast.listen( JBus.Scope(), function(msg) {
              if( msg && msg instanceof JBus.messages.Bonjour && (
                  msg.from === sender.getName() ||
                  msg.from === receiver.getName() )) {
                ++bonjourMsgCount;
              }
            }) ];
      
      sender.send({
        to: receiver.getName(),
        data: data
      }); nodes[0].init();
      sender.send({
        to: receiver.getName(),
        data: data
      }); nodes[1].init();
      sender.send({
        to: receiver.getName(),
        data: data
      });
      
      if( dataMsgCount === 1 &&
          bonjourMsgCount === 2 ) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(unsubscribes, function(unsubscribe) {
        unsubscribe();
      }); sender.destroy();
      receiver.destroy();
      nodes[0].destroy();
      nodes[1].destroy();
    }, "Object JBus.Node protocol adherence (Lifecycle §5.1)": function(success, failure) {
      /* We create a node with multiple scopes and a fulfilled dependency.
         We then destroy the dependency and we make sure that a bye message
         has been sent to all scopes. */
      var scopes = [ new JBus.Scope(), new JBus.Scope(), new JBus.Scope() ],
          dependency = new JBus.Node({ scope: scopes }),
          node = new JBus.Node({ scope: scopes, requires: dependency.getName() }),
          unsubscribes = [], count = 0;
      $Array.forEach( scopes, function(scope) {
        unsubscribes.push( JBus.services.messages.broadcast.listen( scope, function(msg) {
          if( msg instanceof JBus.messages.Bye && msg.from === node.getName() ) {
            ++count;
          }
        }));
      });
      
      dependency.destroy();
      if( count === scopes.length ) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(unsubscribes, function(unsubscribe) {
        unsubscribe();
      }); node.destroy();
    }, "Object JBus.Node protocol adherence (Lifecycle §5.3)": new AbsolutePath( "Integration tests", "Object JBus.Node construction, attribute scope (overload #2)" ),
    "Object JBus.Node protocol adherence (Lifecycle §6)": function(success, failure) {
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName();
      /* We construct several scopes and a recipient node in all
         the scopes. We then send a ping message from each scope
         and make sure that the recipient node responds with a
         bonjour message. */
      var scopes = [ new JBus.Scope(), new JBus.Scope(), new JBus.Scope() ],
          recipient = new JBus.Node({ scope: scopes }), count = 0;
          
      $Array.forEach( scopes, function(scope) {
        var unsubscribe = JBus.services.messages.unicast.listen( scope, name, function( msg ) {
          if( msg instanceof JBus.messages.Bonjour &&
              msg.from === recipient.getName() ) {
            ++count;
          }
        }); JBus.services.messages.unicast.send( scope, recipient.getName(),
          new JBus.messages.Ping({
            from: name
          })
        ); unsubscribe();        
      });
      
      if( count === scopes.length ) {
        success();
      } else {
        failure();
      } recipient.destroy();
      
    }, "Object JBus.Node protocol adherence (Lifecycle §7)": function(success, failure) {
      
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName();
      /* We create and initialize a node in several scopes. We then
         destroy the node and we make sure that the node goes to the
         uninitialized state, then to the destroyed state and that it has
         sent a bye message to the broadcast address in all its scopes.
         Finally, we send a ping message to the destroyed node in all its
         scopes and we don't expect a response. */
      var scopes = [ new JBus.Scope(), new JBus.Scope(), new JBus.Scope() ],
          node = new JBus.Node({
        scope: scopes,
        onuninit: function() {
          ++counts.stateTransitions;
          this.ondestroy = function() {
            ++counts.stateTransitions;
          };
        }
      }), counts = {
        stateTransitions: 0,
        byeMessages: 0,
        bonjourMessages: 0
      }, unsubscribes = [ ];
      
      $Array.forEach( scopes, function(scope) {
        unsubscribes.push( JBus.services.messages.broadcast.listen( scope, function( msg ) {
          if( msg instanceof JBus.messages.Bye &&
              msg.from === node.getName() ) {
            ++counts.byeMessages;
          }
        }) );   
      });
      
      node.destroy();
      
      $Array.forEach( scopes, function(scope) {
        var unsubscribe = JBus.services.messages.unicast.listen( scope, name, function( msg ) {
          if( msg instanceof JBus.messages.Bonjour &&
              msg.from === node.getName() ) {
            ++counts.bonjourMessages;
          }
        }); JBus.services.messages.unicast.send( scope, node.getName(),
          new JBus.messages.Ping({
            from: name
          })
        ); unsubscribe();        
      });
      
      if( counts.stateTransitions === 2 &&
          counts.byeMessages === scopes.length &&
          counts.bonjourMessages === 0 ) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(unsubscribes, function(unsubscribe) {
        unsubscribe();
      }); node.destroy();
      
    }, "Object JBus.Node protocol adherence (Lifecycle §8)": function(success, failure) {
      
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName();
      /* We create and initialize a node in several scopes. We then
         destroy the node by sending a collision message to it and we make
         sure that the node goes to the uninitialized state, then to the
         destroyed state and that it has not sent a bye message to the broadcast
         address in any of its scopes. Finally, we send a ping message to the
         destroyed node in all its scopes and we don't expect a response. */
      var scopes = [ new JBus.Scope(), new JBus.Scope(), new JBus.Scope() ],
          node = new JBus.Node({
        scope: scopes,
        onuninit: function() {
          ++counts.stateTransitions;
          this.ondestroy = function() {
            ++counts.stateTransitions;
          };
        }
      }), counts = {
        stateTransitions: 0,
        byeMessages: 0,
        bonjourMessages: 0
      }, unsubscribes = [ ];
      
      $Array.forEach( scopes, function(scope) {
        unsubscribes.push( JBus.services.messages.broadcast.listen( scope, function( msg ) {
          if( msg instanceof JBus.messages.Bye &&
              msg.from === node.getName() ) {
            ++counts.byeMessages;
          }
        }) );   
      });
      
      JBus.services.messages.unicast.send( scopes[0], node.getName(), new JBus.messages.Collision );
      
      $Array.forEach( scopes, function(scope) {
        var unsubscribe = JBus.services.messages.unicast.listen( scope, name, function( msg ) {
          if( msg instanceof JBus.messages.Bonjour &&
              msg.from === node.getName() ) {
            ++counts.bonjourMessages;
          }
        }); JBus.services.messages.unicast.send( scope, node.getName(),
          new JBus.messages.Ping({
            from: name
          })
        ); unsubscribe();        
      });
      
      if( counts.stateTransitions === 2 &&
          counts.byeMessages === 0 &&
          counts.bonjourMessages === 0 ) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(unsubscribes, function(unsubscribe) {
        unsubscribe();
      }); node.destroy();
      
    },
    
    "Object JBus.Debugger protocol adherence (Lifecycle §1)": new AbsolutePath( "Unit tests", "Object JBus.Debugger construction, attribute autoinit #1" ),
    "Object JBus.Debugger protocol adherence (Lifecycle §2.1)": new AbsolutePath( "Unit tests", "Method new JBus.Debugger().init (initializes?)" ),
    "Object JBus.Debugger protocol adherence (Lifecycle §2.2)": function(success, failure) {
      /* We create a node, we initialize it and we wait for it to
         send a collision message to itself. */
      var scope = new JBus.Scope,
          node = new JBus.Debugger({
            autoinit: false,
            autolog: false,
            scope: scope
          }), unsubscribe = JBus.services.messages.unicast.listen( scope, node.getName(), function( msg ) {
            if( msg && msg instanceof JBus.messages.Collision ) {
              success();
            } else {
              failure();
            } unsubscribe();
            node.destroy();
          }); node.init();
    }, "Object JBus.Debugger protocol adherence (Lifecycle §2.3.1)": function(success, failure) {
      /* We create a node and we send a data message to the broadcast
         address. The node should not react. We then initialize the
         node and repeat the same procedure. The node should now receive
         the message. */
      var counter = 0,
          name = getRandomName(),
          scope = new JBus.Scope,
          node = new JBus.Debugger({
            scope: scope,
            oninit: function() {
              send();
            }, autoinit: false,
            autolog: false
          });
      node.listen({
        broadcast: function(obj) {
          if(obj.msg && obj.msg instanceof JBus.messages.Data &&
             obj.msg.data.name === name) ++counter;
        }
      });
      send();
      node.init();    
      
      function send() {
        JBus.services.messages.broadcast.send( scope, new JBus.messages.Data({
          from: node.getName(),
          name: name
        }));
      }  
      
      if(counter === 1) {
        success();
      } else {
        failure();
      }
      
      node.destroy();
    }, "Object JBus.Debugger protocol adherence (Lifecycle §2.3.2)": function(success, failure) {
      /* We create a node and we send a data message to the multicast
         address of the groups the node is listening to. The node should
         not react. We then initialize the node and repeat the same
         procedure. The node should now receive the message. */
      var counter = 0,
          groups = [
            getRandomGroupName(),
            getRandomGroupName(),
            getRandomGroupName()
          ], scope = new JBus.Scope,
          node = new JBus.Debugger({
            scope: scope,
            group: groups,
            oninit: function() {
              send();
            }, autoinit: false,
            autolog: false
          });
      node.listen({
        multicast: function() {
          ++counter;
        }
      });
      send();
      node.init();    
      
      function send() {
        $Array.forEach(groups, function(group) {
          JBus.services.messages.multicast.send( scope, group, new JBus.messages.Data({
            from: node.getName()
          }));
        });
      }  
      
      if(counter === groups.length) {
        success();
      } else {
        failure();
      }
      
      node.destroy();
    }, "Object JBus.Debugger protocol adherence (Lifecycle §2.3.3)": function(success, failure) {
      /* We create a node and we send a data message to its unicast address. The
         node should not react. We then initialize the node and repeat
         the same procedure. The node should now receive the message. */
      var counter = 0,
          scope = new JBus.Scope,
          node = new JBus.Debugger({
            scope: scope,
            oninit: function() {
              send();
            }, autoinit: false,
            autolog: false
          });
      node.listen({
        unicast: function(obj) {
          if(obj.msg && obj.msg instanceof JBus.messages.Data) ++counter;
        }
      }); send();
      node.init(); 
      
      function send() {
        JBus.services.messages.unicast.send( scope, node.getName(), new JBus.messages.Data({
          from: node.getName()
        }));
      }     
      
      if(counter === 1) {
        success();
      } else {
        failure();
      }
      
      node.destroy();
    }, "Object JBus.Debugger protocol adherence (Lifecycle §2.4.1)": function(success, failure) {
      /* We create two nodes, each in the same two scopes and a third node, also in
         both scopes, which depends on the two nodes. We then initialize the third node
         and we wait for it to initialize, having sent 4 ping messages in total. */
      var scopes = [
        new JBus.Scope,
        new JBus.Scope
      ], nodes = [
        new JBus.Node({ scope: scopes }),
        new JBus.Node({ scope: scopes })
      ], node = new JBus.Debugger({
        scope: scopes,
        requires: [
          nodes[0].getName(),
          nodes[1].getName()
        ], autoinit: false,
        autolog: false
      }), count = 0;
      
      var unsubscribes = [  ];
      $Array.forEach( scopes, function( scope ) {
        $Array.forEach( nodes, function( node ) {
          unsubscribes.push( JBus.services.messages.unicast.listen( scope, node.getName(), callback ) );
        })
      });
      
      node.init();
      
      function callback(msg) {
        if( msg && msg instanceof JBus.messages.Ping &&
            msg.from === node.getName() &&
            ++count === nodes.length * scopes.length ) {
          success();
          $Array.forEach( unsubscribes, function(unsubscribe) {
            unsubscribe();
          }); node.destroy();
          nodes[0].destroy();
          nodes[1].destroy();
        } else {
          failure();
        }
      }
    }, "Object JBus.Debugger protocol adherence (Lifecycle §3)": function(success, failure) {
      /* We create two scopes and two nodes, each in the respective scope and
         a third node, which is present in both scopes. We then initialize the
         third node and then the first node. Next, we destroy the first node
         and we initialize the second node. The third node should never become
         initialized. Next, we initialize a node named as the first node in the
         second scope and we wait for the third node to destroy itself. */
      var scopes = [
        new JBus.Scope,
        new JBus.Scope
      ], nodes = [
        new JBus.Node({
          scope: scopes[0],
          autoinit: false
        }), new JBus.Node({
          scope: scopes[1],
          autoinit: false
        })
      ], node = new JBus.Debugger({
        scope: scopes,
        requires: [
          nodes[0].getName(),
          nodes[1].getName()
        ], oninit: function() {
          failure();
          cleanUp();
        }, autoinit: false,
        autolog: false
      }); node.init();
      nodes[0].init();
      nodes[0].destroy();
      nodes[1].init();
      nodes[0] = new JBus.Node({
        name: nodes[0].getName(),
        scope: scopes[1],
        autoinit: false
      }); node.oninit = function() {
        success();
        cleanUp();
      }; nodes[0].init();
      
      function cleanUp() {
        node.destroy();
        nodes[0].destroy();
        nodes[1].destroy();
      }
    }, "Object JBus.Debugger protocol adherence (Lifecycle §4)": function(success, failure) {
      /* We construct two nodes, both with an unfulfilled
         dependency and we send a data message from the
         first one to the unicast address of the second
         one. Next, we satisfy the first dependency and
         resend the data message. Next, we satisfy the
         second dependency and check that the both nodes
         have by now sent a bonjour message and no data
         messages have yet been exchanged. We now resend
         the data message and check that it has been received. */
      var dataMsgCount = 0,
          bonjourMsgCount = 0,
          nodes = [
            new JBus.Debugger({ autoinit: false, autolog: false }),
            new JBus.Debugger({ autoinit: false, autolog: false })
          ], data = {
            name: getRandomName(),
            payload: "<name.witiko.jbus.testsuite.payload@" + $String.random() + ">"
          }, sender = new JBus.Debugger({ requires: nodes[0].getName(), autolog: false }),
          receiver = new JBus.Debugger({ requires: nodes[1].getName(), autolog: false }),
          unsubscribes = [
            receiver.listen({
              unicast: function( obj ) {
                if( obj && obj.msg && obj.msg.data &&
                    obj.to === receiver.getName() &&
                    obj.msg.from === sender.getName() &&
                    obj.msg.data.name === msg.data.name &&
                    obj.msg.data.payload === msg.data.payload ) {
                  ++dataMsgCount;
                }
              }
            }), JBus.services.messages.broadcast.listen( JBus.Scope(), function( msg ) {
              if( msg && msg instanceof JBus.messages.Bonjour && (
                  msg.from === sender.getName() ||
                  msg.from === receiver.getName() )) {
                ++bonjourMsgCount;
              }
            }) ], msg = new JBus.messages.Data({
              from: sender.getName(),
              name: data.name,
              payload: data.payload
            });
      
      sender.send({
        to: receiver.getName(),
        msg: msg
      }); nodes[0].init();
      sender.send({
        to: receiver.getName(),
        msg: msg
      }); nodes[1].init();
      sender.send({
        to: receiver.getName(),
        msg: msg
      });
      
      if( dataMsgCount === 1 &&
          bonjourMsgCount === 2 ) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(unsubscribes, function(unsubscribe) {
        unsubscribe();
      }); sender.destroy();
      receiver.destroy();
      nodes[0].destroy();
      nodes[1].destroy();
    }, "Object JBus.Debugger protocol adherence (Lifecycle §5.1)": function(success, failure) {
      /* We create a node with multiple scopes and a fulfilled dependency.
         We then destroy the dependency and we make sure that a bye message
         has been sent to all scopes. */
      var scopes = [ new JBus.Scope(), new JBus.Scope(), new JBus.Scope() ],
          dependency = new JBus.Debugger({ scope: scopes, autolog: false }),
          node = new JBus.Debugger({ scope: scopes, requires: dependency.getName(), autolog: false }),
          unsubscribes = [], count = 0;
      $Array.forEach( scopes, function(scope) {
        unsubscribes.push( JBus.services.messages.broadcast.listen( scope, function(msg) {
          if( msg instanceof JBus.messages.Bye && msg.from === node.getName() ) {
            ++count;
          }
        }));
      });
      
      dependency.destroy();
      if( count === scopes.length ) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(unsubscribes, function(unsubscribe) {
        unsubscribe();
      }); node.destroy();
    }, "Object JBus.Debugger protocol adherence (Lifecycle §5.3)": new AbsolutePath( "Integration tests", "Object JBus.Debugger construction, attribute scope (overload #2)" ),
    "Object JBus.Debugger protocol adherence (Lifecycle §6)": function(success, failure) {
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName();
      /* We construct several scopes and a recipient node in all
         the scopes. We then send a ping message from each scope
         and make sure that the recipient node responds with a
         bonjour message. */
      var scopes = [ new JBus.Scope(), new JBus.Scope(), new JBus.Scope() ],
          recipient = new JBus.Debugger({ scope: scopes, autolog: false }), count = 0;
          
      $Array.forEach( scopes, function(scope) {
        var unsubscribe = JBus.services.messages.unicast.listen( scope, name, function( msg ) {
          if( msg instanceof JBus.messages.Bonjour &&
              msg.from === recipient.getName() ) {
            ++count;
          }
        }); JBus.services.messages.unicast.send( scope, recipient.getName(),
          new JBus.messages.Ping({
            from: name
          })
        ); unsubscribe();        
      });
      
      if( count === scopes.length ) {
        success();
      } else {
        failure();
      } recipient.destroy();
      
    }, "Object JBus.Debugger protocol adherence (Lifecycle §7)": function(success, failure) {
      
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName();
      /* We create and initialize a node in several scopes. We then
         destroy the node and we make sure that the node goes to the
         uninitialized state, then to the destroyed state and that it has
         sent a bye message to the broadcast address in all its scopes.
         Finally, we send a ping message to the destroyed node in all its
         scopes and we don't expect a response. */
      var scopes = [ new JBus.Scope(), new JBus.Scope(), new JBus.Scope() ],
          node = new JBus.Debugger({
        autolog: false,
        scope: scopes,
        onuninit: function() {
          ++counts.stateTransitions;
          this.ondestroy = function() {
            ++counts.stateTransitions;
          };
        }
      }), counts = {
        stateTransitions: 0,
        byeMessages: 0,
        bonjourMessages: 0
      }, unsubscribes = [ ];
      
      $Array.forEach( scopes, function(scope) {
        unsubscribes.push( JBus.services.messages.broadcast.listen( scope, function( msg ) {
          if( msg instanceof JBus.messages.Bye &&
              msg.from === node.getName() ) {
            ++counts.byeMessages;
          }
        }) );   
      });
      
      node.destroy();
      
      $Array.forEach( scopes, function(scope) {
        var unsubscribe = JBus.services.messages.unicast.listen( scope, name, function( msg ) {
          if( msg instanceof JBus.messages.Bonjour &&
              msg.from === node.getName() ) {
            ++counts.bonjourMessages;
          }
        }); JBus.services.messages.unicast.send( scope, node.getName(),
          new JBus.messages.Ping({
            from: name
          })
        ); unsubscribe();        
      });
      
      if( counts.stateTransitions === 2 &&
          counts.byeMessages === scopes.length &&
          counts.bonjourMessages === 0 ) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(unsubscribes, function(unsubscribe) {
        unsubscribe();
      }); node.destroy();
      
    }, "Object JBus.Debugger protocol adherence (Lifecycle §8)": function(success, failure) {
      
      // We generate a random node name
      var name = new JBus.Node({
            oninit: function() {
              this.destroy();
            }
          }).getName();
      /* We create and initialize a node in several scopes. We then
         destroy the node by sending a collision message to it and we make
         sure that the node goes to the uninitialized state, then to the
         destroyed state and that it has not sent a bye message to the broadcast
         address in any of its scopes. Finally, we send a ping message to the
         destroyed node in all its scopes and we don't expect a response. */
      var scopes = [ new JBus.Scope(), new JBus.Scope(), new JBus.Scope() ],
          node = new JBus.Debugger({
        autolog: false,
        scope: scopes,
        onuninit: function() {
          ++counts.stateTransitions;
          this.ondestroy = function() {
            ++counts.stateTransitions;
          };
        }
      }), counts = {
        stateTransitions: 0,
        byeMessages: 0,
        bonjourMessages: 0
      }, unsubscribes = [ ];
      
      $Array.forEach( scopes, function(scope) {
        unsubscribes.push( JBus.services.messages.broadcast.listen( scope, function( msg ) {
          if( msg instanceof JBus.messages.Bye &&
              msg.from === node.getName() ) {
            ++counts.byeMessages;
          }
        }) );   
      });
      
      JBus.services.messages.unicast.send( scopes[0], node.getName(), new JBus.messages.Collision );
      
      $Array.forEach( scopes, function(scope) {
        var unsubscribe = JBus.services.messages.unicast.listen( scope, name, function( msg ) {
          if( msg instanceof JBus.messages.Bonjour &&
              msg.from === node.getName() ) {
            ++counts.bonjourMessages;
          }
        }); JBus.services.messages.unicast.send( scope, node.getName(),
          new JBus.messages.Ping({
            from: name
          })
        ); unsubscribe();        
      });
      
      if( counts.stateTransitions === 2 &&
          counts.byeMessages === 0 &&
          counts.bonjourMessages === 0 ) {
        success();
      } else {
        failure();
      }
      
      $Array.forEach(unsubscribes, function(unsubscribe) {
        unsubscribe();
      }); node.destroy();
      
    }
  }
};

/**
 * Returns a random group name.
 * @return a random group name.
 */
function getRandomGroupName() {
  return "name.witiko.jbus.testsuite.group@" + $String.random();
}

/**
 * Returns a random name.
 * @return a random name.
 */
function getRandomName() {
  return "name.witiko.jbus.testsuite.name@" + $String.random();
}
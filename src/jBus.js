var JBus = (function(debug) {

  // # Framework #
  
  // @include framework

  // # Constants #
  var STRINGS = {
    LOGGER: "[JBus@" + $String.random() + "]",
    WARNING: "Warning:",
    DEBUGGER: "A JBus debugger"
  }, PREFIXES = {
    JBUS: "name.witiko.jbus.addresses",
    BROADCAST: "broadcast",
    MULTICAST: "multicast",
    UNICAST: "unicast",
    ANONYMOUS: "name.witiko.jbus.anonymous",
    DEBUGGER: "name.witiko.jbus.debugger"
  }, STATES = {
    ENUMS: {
      UNINITIALIZED: 0,
      INITIALIZING: 1,
      INITIALIZED: 2,
      DESTROYED: 3
    }, STRINGS: {
      0: "Uninitialized",
      1: "Initializing",
      2: "Initialized",
      3: "Destroyed"
    }
  }, MESSAGES = {
    ENUMS: {
      COLLISION: 0,
      BONJOUR: 1,
      PING: 2,
      BYE: 3,
      DATA: 4
    }, STRINGS: {
      0: "Collision",
      1: "Bonjour",
      2: "Ping",
      3: "Bye",
      4: "Data"
    }
  };

  // # Utility functions #

  /** Logs the arguments to the console. */
  var log = window.console && isFunction( window.console.log ) ? function() {
    window.console.log.apply(
      window.console, [ STRINGS.LOGGER ].concat( new$Array( arguments ) ));
  } : function() { };

  // # The JBus object #
  var JBus = {
    Scope:
      // @annotate Method `JBus.Scope`
      function() {
        return this instanceof JBus.Scope ?
          document.createTextNode("") : document ;
      },
    
    Node:
      // @annotate Object `JBus.Node`
      function(options) {

        // Overloading support
        if(!(this instanceof arguments.callee)) {
          return new arguments.callee( options );
        }
        
        options = options || {};

        if(isString(options)) {
          return new JBus.Node({
            name: options
          });
        }
      
        // First, we construct the fresh-created node.
        var status = STATES.ENUMS.UNINITIALIZED;
        var name = "name" in options
          ? options.name
          : PREFIXES.ANONYMOUS + "@" + $String.random();
        var description = options.description || null;

        // This array stores all used scopes.
        var scopes;
        if( isArray( options.scope ) && options.scope.length > 0 ) {
          scopes = new$Array( options.scope );
        } else if( options.scope ) {
          scopes = [ options.scope ];
        } else {
          scopes = [ JBus.Scope() ];
        }
                
        // We check, whether the node's name is a fully qualified domain name.
        if( !isQualified( name ) && $Array.contains( scopes, JBus.Scope() ) ) {
          warn("A node", name, "without a fully qualified domain name has been created in the default scope.");
        }
        
        // This array stores all groups to which we are subscribed
        var groups;
        if( isArray( options.group ) ) {
          groups = options.group;
        } else if( isString( options.group ) ) {
          groups = [ options.group ];
        } else {
          groups = [ ];
        } groups = $Array.filter( groups, isString );
        
        // We check, whether the groups' names are fully qualified domain names.
        if( $Array.contains( scopes, JBus.Scope() ) ) $Array.forEach( groups, function(group) {
          if( !isQualified( group ) ) {
            warn("A node", name, "in the default scope is listening on the " +
              "multicast address of a group", group, "without a fully qualified domain name.");
          }
        });

        // This array stores all required JBus nodes.
        var required;
        if( isString( options.requires ) ) {
          required = [ options.requires ];
        } else if( isArray( options.requires ) && options.requires.length > 0 ) {
          $Array.forEach( options.requires, function( item ) {
            if(!isString(item)) {
              throw new TypeError("The `requires` attribute points to an array, which contains non-string elements.");  
            }          
          }); required = new$Array( options.requires );
        } else if( "requires" in options && options.requires !== undefined &&
                                            options.requires !== null ) {
          throw new TypeError("The `requires` attribute is neither a string nor an array.");
        } else {
          required = [ ];
        }

        // This array stores all remaining required JBus nodes.
        var requiredRemaining = new$Array( required );

        // We typecheck the passed functions
        if( "oninit" in options && !isFunction(options.oninit) ) {
          throw new TypeError("The `oninit` attribute is not a function.");
        } if( "onuninit" in options && !isFunction(options.onuninit) ) {
          throw new TypeError("The `onuninit` attribute is not a function.");
        } if( "ondestroy" in options && !isFunction(options.ondestroy) ) {
          throw new TypeError("The `ondestroy` attribute is not a function.");
        }
        
        this.oninit = options.oninit || function() {};
        this.onuninit = options.onuninit || function() {};
        this.ondestroy = options.ondestroy || function() {};
        var that = this;

        // This array contains all event unsubscription functions for this node.
        var listeners = [ ];

        /** Sends a bonjour control message to all other nodes. */
        function announceInit() {
          $Array.forEach(scopes, function(scope) {
            JBus.services.messages.broadcast.send(scope,
              new JBus.messages.Bonjour( {
                from: name,
                description: description
              }));
          });
        }

        /** Sends a bye control message to all other nodes. */
        function announceUninit() {
          $Array.forEach(scopes, function(scope) {
            JBus.services.messages.broadcast.send(scope,
              new JBus.messages.Bye({ from: name }) );
          });
        }

        /* If the current window is being closed, the node will
           self-destruct and notify other nodes about the event */
        window.addEventListener("unload", function() {
          if(status === STATES.ENUMS.INITIALIZED) {
            that.destroy();
          }
        }, false);

        /* If the window containing any of the scopes is being closed,
           the node sends a Bye message to that scope and unregisters it
           If there are no scopes left, the node destroys itself */
        $Array.forEach(scopes, function(scope) {
          var doc, win;

          // The scope is a window.
          if("window" in scope) {
            win = scope;
          }
          // The scope is a document.
          else if("doctype" in scope) {
            doc = scope;
            if(doc.defaultView) {
              win = doc.defaultView;
            }
          }
          // The scope is a node.
          else {
            doc = scope.ownerDocument;
            if(doc && doc.defaultView) {
              win = doc.defaultView;
            }
          }

          if(win && win !== window) win.addEventListener("unload", function() {
            if(status === STATES.ENUMS.INITIALIZED) {
              JBus.services.messages.broadcast.send( scope, new JBus.messages.Bye({ from: name }) );
            } $Array.remove( scopes, scope );
            if(scopes.length == 0) that.destroy();
          }, false);
        });
        
        // @annotate Method `new JBus.Node().getName`
        this.getName = function() {
          return name;
        };

        // @annotate Method `new JBus.Node().init`
        this.init = function() {
          if(status !== STATES.ENUMS.UNINITIALIZED) return;
          status = STATES.ENUMS.INITIALIZING;

          // First, we send a collision control message to a prospective node bearing our name.
          $Array.forEach(scopes, function(scope) {
            JBus.services.messages.unicast.send(scope, name, new JBus.messages.Collision );
          });

          // Next, we start listening for broadcast, multicast and unicast control messages.
          $Array.forEach(scopes, function(scope) {

            // We store the subscription-cancelling functions.
            listeners.push(
              JBus.services.messages.broadcast.listen( scope, listener ),
              JBus.services.messages.unicast.listen( scope, name, listener )
            ); $Array.forEach(groups, function(group) {
              listeners.push( JBus.services.messages.multicast.listen( scope, group, listener ) );
            });

            function listener(msg) {
              switch(msg.type) {

                // We handle an incoming collision control message.
                case MESSAGES.ENUMS.COLLISION:
                  // We destroy this node.
                  that.destroy();

                // We handle an incoming bonjour control message.
                case MESSAGES.ENUMS.BONJOUR:
                  if( status !== STATES.ENUMS.INITIALIZING
                    || ! $Array.contains( requiredRemaining, msg.from ) ) break;
                  $Array.remove( requiredRemaining, msg.from );
                  /* If the incoming node is required and there are no more
                     required nodes, we declare this node initialized. */
                  if(requiredRemaining.length == 0) {
                    status = STATES.ENUMS.INITIALIZED;
                    announceInit();
                    that.oninit();
                  } break;

                // We handle an incoming ping control message.
                case MESSAGES.ENUMS.PING:
                  if( status !== STATES.ENUMS.INITIALIZED ) break;
                  // We respond by a unicast bonjour control message.
                  JBus.services.messages.unicast.send(scope, msg.from,
                    new JBus.messages.Bonjour( {
                      from: name,
                      description: description
                    }));
                  break;

                // We handle an incoming bye control message.
                case MESSAGES.ENUMS.BYE:
                  if( ! $Array.contains( required, msg.from ) ) break;
                  $Array.add( requiredRemaining, msg.from );
                  // If the destroyed node is required, we unititialize this node.
                  if( status === STATES.ENUMS.INITIALIZED ) {
                    status = STATES.ENUMS.INITIALIZING;
                    announceUninit();
                    that.onuninit();
                    /* If we use several scopes, we send a ping message to
                       try and find the required node in another scope. */
                    if(scopes.length > 1) ping( new$Array(requiredRemaining) );
                  }

              }
            }
          });

          
          // If there are no required nodes, we immediately switch to the initialized state
          if(required.length == 0) {
            status = STATES.ENUMS.INITIALIZED;
            announceInit();
            this.oninit();
          }
          // Otherwise, we send a ping control message to all required nodes.
          else {
            ping( required );          
          }          

          /** Sends a ping control message to all the given nodes. */
          function ping(nodes) {
            $Array.forEach(nodes, function(target) {
              $Array.forEach(scopes, function(scope) {
                JBus.services.messages.unicast.send(scope, target, 
                  new JBus.messages.Ping({ from: name }));
              });
            });
          }

        };

        // @annotate Method `new JBus.Node().destroy`
        this.destroy = function() {

          // First, we handle the current status.
          switch(status) {
            /* If the node is initialized, we notify the application
               that it has been uninitialized first. */
            case STATES.ENUMS.INITIALIZED: 
              that.onuninit();
              break;
            
            /* If the node has not yet been initialized, we dispense
               with the bye message. */
            case STATES.ENUMS.UNINITIALIZED:
              silently = true;           
              break;
              
            /* If the node has already been destroyed, we ignore
               the invocation */
            case STATES.ENUMS.DESTROYED: return;
          }

          status = STATES.ENUMS.DESTROYED;

          // Next, we shut down all message listeners.
          $Array.forEach(listeners, function(unsubscribe) {
            unsubscribe();
          }); listeners = [ ];

          // We send a bye control message to all other nodes.
          announceUninit();

          // Finally, we will notify the user that the node has been destroyed.
          that.ondestroy();

        };

        // @annotate Method `new JBus.Node().send`
        this.send = function(options) {
          if(!options || status !== STATES.ENUMS.INITIALIZED) return;

          // Overloading support
          if( typeof options !== "object" || ( !("data" in options) && !("to" in options) ) ) {
            options = {
              data: options
            };
          }
        
          if( !("data" in options) ) {
            options.data = null;
          }

          if( typeof options.data !== "object" || !options.data || !("name" in options.data)) {
            options.data = {
              name: null,
              payload: options.data
            };
          }
          
          if( isString( options.to ) ) {
            options.to = {
              node: options.to
            };
          }

          // We construct the message.
          var msg = new JBus.messages.Data( {
            from: name,
            name: options.data.name,
            payload: options.data.payload
          });

          // If there is a `to` field, we send unicast / multicast user messages.
          if(options.to && ( "group" in options.to || "node" in options.to )) {
          
            if( "node" in options.to ) {
              $Array.forEach(isArray( options.to.node ) ? options.to.node : [ options.to.node ], function(to) {
                $Array.forEach(scopes, function(scope) {
                  JBus.services.messages.unicast.send( scope, to, msg );
                });
              });
            } if( "group" in options.to ) {
              $Array.forEach(isArray( options.to.group ) ? options.to.group : [ options.to.group ], function(to) {
                $Array.forEach(scopes, function(scope) {
                  JBus.services.messages.multicast.send( scope, to, msg );
                });
              });
            }
            
          }
          // Otherwise, we send a broadcast user message.
          else {
            $Array.forEach(scopes, function(scope) {
              JBus.services.messages.broadcast.send( scope, msg );
            });
          }

        };

        // @annotate Method `new JBus.Node().listen`
        this.listen = function(options) {
          if(!options || status == STATES.ENUMS.DESTROYED) return;

          // Overloading support
          if(isFunction(options)) {
            return this.listen({
              any: options
            });
          }

          if(!("filters" in options)) {
            options.filters = { };
          }

          var any = options.any,
              broadcast = options.broadcast,
              multicast = options.multicast,
              unicast = options.unicast,
              filters = options.filters;

          // We set up the listeners.
          var localListeners = [ ];
          if(isFunction( any )) {
            subscribeBroadcast( any );
            subscribeUnicast( any );
          } if(isFunction( broadcast )) {
            subscribeBroadcast( broadcast );
          } if(isFunction( multicast )) {
            subscribeMulticast( multicast );
          } if(isFunction( unicast )) {
            subscribeUnicast( unicast );
          }

          /** Subscribes the given function as a broadcast listener. */
          function subscribeBroadcast(callback) {
            $Array.forEach(scopes, function(scope) {
              var unsubscribe = JBus.services.messages.broadcast.listen( scope, getListener( scope, callback ) );

              // We store the subscription-cancelling function.
              localListeners.push( unsubscribe );
              listeners.push( unsubscribe );
            });
          }
          
          /** Subscribes the given function as a multicast listener. */
          function subscribeMulticast(callback) {
            $Array.forEach(scopes, function(scope) {
              $Array.forEach(groups, function(name) {
                var unsubscribe = JBus.services.messages.multicast.listen( scope, name, getListener() );

                // We store the subscription-cancelling function.
                localListeners.push( unsubscribe );
                listeners.push( unsubscribe );
                
                function getListener() {
                  return function(msg) {
                    // If the message passes the filters, we return the message to the user.
                    if( msg.type === MESSAGES.ENUMS.DATA && status === STATES.ENUMS.INITIALIZED && testMessage(msg) ) {
                      callback.call( that, {
                        from:  msg.from,
                        to:    name,
                        data:  msg.data,
                        scope: scope
                      } );
                    }
                  };
                }
              });
            });
          }

          /** Subscribes the given function as a unicast listener. */
          function subscribeUnicast(callback) {
            $Array.forEach(scopes, function(scope) {
              var unsubscribe = JBus.services.messages.unicast.listen( scope, name, getListener( scope, callback ) );

              // We store the subscription-cancelling function.
              localListeners.push( unsubscribe );
              listeners.push( unsubscribe );
            });
          }

          function getListener(scope, callback) {
            return function(msg) {
              // If the message passes the filters, we return the message to the user.
              if( msg.type === MESSAGES.ENUMS.DATA && status === STATES.ENUMS.INITIALIZED && testMessage(msg) ) {
                callback.call( that, {
                  from:  msg.from,
                  data:  msg.data,
                  scope: scope
                } );
              }
            };
          }

          /** Tests the received message against the filters. */
          function testMessage(msg) {

            return ( "from"    in filters ? test( filters.from, msg.from )            : true ) &&
                   ( "name"    in filters ? test( filters.name, msg.data.name )       : true ) &&
                   ( "payload" in filters ? test( filters.payload, msg.data.payload ) : true );

            function test(filter, data) {
              if(!filter || !data) return;

              // A string filter
              if(isString( filter )) {
                return data.valueOf() === filter.valueOf();
              }
              // A function filter
              if(isFunction( filter )) {
                return filter( data );
              }
              // A regex filter
              if(isRegExp( filter )) {
                return filter.test( data );
              }
              // An array of filters
              if(isArray( filter )) {
                return $Array.some( filter, function(filter) {
                  return test( filter, data) ;
                });
              }
            }

          }

          /** Unsubscribes the node from further messages. */
          return function() {
            $Array.forEach(localListeners, function(unsubscribe) {
              $Array.remove( listeners, unsubscribe );
              unsubscribe();
            }); localListeners = [ ];
          };

        };

        // @annotate Method `new JBus.Node().toString`
        this.toString = function() {
          return "{Node \"" + name + "\" # " + STATES.STRINGS[status] + "}";
        };

        // We autoinitialize the node unless explicitly stated otherwise.
        if(options.autoinit !== false) {
          this.init();
        }

      },
      
    // Additional services
    services: {
      // Physical layer services (event senders / listeners)
      events: {
      
        send:        
          // @annotate Method `JBus.services.events.send`
          function(scope, eventName, data) {
            var custom = document.createEvent('CustomEvent');
            custom.initCustomEvent(eventName, false, false, data);
            scope.dispatchEvent(custom);
          },
          
        
        listen:
          // @annotate Method `JBus.services.events.listen`
          function(scope, eventName, callback) {
            scope.addEventListener(eventName, listener, false);
            return function() {
              scope.removeEventListener(eventName, listener);
            };

            function listener(e) {
              if(e && "detail" in e) {
                callback( e.detail );
              }
            }
          }
        
      },
      // Network layer services (message senders / listeners)
      messages: {
        broadcast: {
        
          send:          
            // @annotate Method `JBus.services.messages.broadcast.send`
            function(scope, msg) {
              if(debug) {
                log("A broadcast message", msg, "in scope", scope);
              } JBus.services.events.send(scope, PREFIXES.JBUS + "." + PREFIXES.BROADCAST, msg);
            },
            
          listen:
            // @annotate Method `JBus.services.messages.broadcast.listen`
            function(scope, callback) {
              return JBus.services.events.listen(scope, PREFIXES.JBUS + "." + PREFIXES.BROADCAST, function(msg) {
                callback(msg);
              });
            }
          
        }, multicast: {
         
          send:            
            // @annotate Method `JBus.services.messages.multicast.send`
            function(scope, name, msg) {
              if(debug) {
                log("A multicast message", msg, "to", name, "in scope", scope);
              }
              /* We check whether the message is being sent to the multicast
                 address of a group with a fully qualified domain name. */
              if( !isQualified( name ) && scope === JBus.Scope() ) {
                warn("A message is being sent to the multicast address of " +
                  "a group", name, " without a fully qualified domain name in the default scope.");
              } JBus.services.events.send(scope, PREFIXES.JBUS + "." + PREFIXES.MULTICAST + "::" + name, msg);
            },
            
          listen:
            // @annotate Method `JBus.services.messages.multicast.listen`
            function(scope, name, callback) {
              /* We check whether the message listener is being added to the
                 multicast address of a group with a fully qualified domain name. */
              if( !isQualified( name ) && scope === JBus.Scope() ) {
                warn("A message listener is being added to the multicast address of " +
                  "a group", name, "without a fully qualified domain name in the default scope.");
              } return JBus.services.events.listen(scope, PREFIXES.JBUS + "." + PREFIXES.MULTICAST + "::" + name, function(msg) { 
                callback(msg);
              });
            }

        }, unicast: {
         
          send:            
            // @annotate Method `JBus.services.messages.unicast.send`
            function(scope, name, msg) {
              if(debug) {
                log("A unicast message", msg, "to", name, "in scope", scope);
              }
              /* We check whether the message is being sent to the unicast
                 address of a node with a fully qualified domain name. */
              if( !isQualified( name ) && scope === JBus.Scope() ) {
                warn("A message is being sent to the unicast address of " +
                  "a node", name, "without a fully qualified domain name in the default scope.");
              } JBus.services.events.send(scope, PREFIXES.JBUS + "." + PREFIXES.UNICAST + "::" + name, msg);
            },
            
          listen:
            // @annotate Method `JBus.services.messages.unicast.listen`
            function(scope, name, callback) {
              /* We check whether the message listener is being added to the
                 unicast address of a node with a fully qualified domain name. */
              if( !isQualified( name ) && scope === JBus.Scope() ) {
                warn("A message listener is being added to the unicast address of " +
                  "a node", name, "without a fully qualified domain name in the default scope.");
              } return JBus.services.events.listen(scope, PREFIXES.JBUS + "." + PREFIXES.UNICAST + "::" + name, function(msg) {
                callback(msg);
              });
            }

        }
      }
    },
    // JBus message constructors
    messages: {
    
      Collision:
        // @annotate Object `JBus.messages.Collision`
        function() {
        
          // Overloading support
          if(!(this instanceof arguments.callee)) {
            return new arguments.callee();
          }
          
          this.type = MESSAGES.ENUMS.COLLISION;
          
        },
      
      Bonjour:
        // @annotate Object `JBus.messages.Bonjour`
        function( options ) {
        
          // Overloading support
          if(!(this instanceof arguments.callee)) {
            return new arguments.callee( options );
          }
          
          options = options || {};
          
          if( typeof options !== "object" ||
              !("from" in options) ) {
            options = {
              from: options
            };
          }
          
          // Type checking
          if( !isString( options.from ) ) {
            throw new TypeError("The mandatory `from` string attribute was not passed to the constructor.");
          }
          
          // Construction
          this.type = MESSAGES.ENUMS.BONJOUR;
          this.from = options.from;
          this.description = options.description;
          
        },
      
      Ping:
        // @annotate Object `JBus.messages.Ping`
        function( options ) {
        
          // Overloading support
          if(!(this instanceof arguments.callee)) {
            return new arguments.callee( options );
          }
          
          options = options || {};
          
          if( typeof options !== "object" ||
              !("from" in options) ) {
            options = {
              from: options
            };
          }
          
          // Type checking
          if( !isString( options.from ) ) {
            throw new TypeError("The mandatory `from` string attribute was not passed to the constructor.");
          }
          
          // Construction
          this.type = MESSAGES.ENUMS.PING;
          this.from = options.from;
          
        },
      
      Bye:      
        // @annotate Object `JBus.messages.Bye`
        function( options ) {
        
          // Overloading support
          if(!(this instanceof arguments.callee)) {
            return new arguments.callee( options );
          }
          
          options = options || {};
          
          if( typeof options !== "object" ||
              !("from" in options) ) {
            options = {
              from: options
            };
          }
          
          // Type checking
          if( !isString( options.from ) ) {
            throw new TypeError("The mandatory `from` string attribute was not passed to the constructor.");
          }
          
          // Construction
          this.type = MESSAGES.ENUMS.BYE;
          this.from = options.from;
          
        },
      
      Data:
        // @annotate Object `JBus.messages.Data`
        function( options ) {
          
          // Overloading support
          if(!(this instanceof arguments.callee)) {
            return new arguments.callee( options );
          }
          
          options = options || {};
          
          // Type checking
          if( !isString( options.from ) ) {
            throw new TypeError("The mandatory `from` string attribute was not passed to the constructor.");
          }
          
          // Construction
          this.type = MESSAGES.ENUMS.DATA;
          this.from = options.from;
          this.data = {
            name: options.name,
            payload: options.payload
          };
        }
        
    }
    
  };  

  // Setting up the inheritance
  $Array.forEach( [ "Collision", "Bonjour", "Ping", "Bye", "Data" ], function(msgType) {
    JBus.messages[msgType].prototype.toString = msgToString;
  });
    
  /**
   * Returns a textual representation of a JBus message.
   * @return a textual representation of a JBus message.
   */
  function msgToString() {
    return "{" + MESSAGES.STRINGS[this.type] + "}" +
      (this.from ? " from " + this.from : "");
  }
  
  // # Utility function #
  
  /** Logs the arguments to the console as a warning. */
  function warn() {
    log.apply(null, [ STRINGS.WARNING ].concat( new$Array( arguments ) ))
  }
  
  /**
   * Returns whether the given name is a fully qualified domain name.
   * @param name - The given name.
   * @return whether the given name is a fully qualified domain name.
   */
  function isQualified(name) {
    return  /\./.test( name );
  }
  
  return JBus;

})(true);
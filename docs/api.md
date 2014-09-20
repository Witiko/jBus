# API #

All functionality of the library is embedded in the `JBus` object with the `JBus.Node` object, its methods and the `JBus.Scope` method being all a jBus application should ever need. The `JBus.Debugger`, `JBus.services` and `JBus.messages` objects are only present for debugging purposes.

## Method `JBus.Scope` ##

The `JBus.Scope` method acts as either a parameterless constructor of an anonymous private scope, when invoked using the `new` keyword, or as a getter of the default public scope, when invoked as a function:

    var privateScope = new JBus.Scope,
        publicScope = JBus.Scope();

## Object `JBus.Node` ##

The `JBus.Node` method acts as a constructor of a node. Below is the most extensive way of constructing a node:

    new JBus.Node({
      name: ... ,
      description: ... ,
      oninit: ... ,
      onuninit: ... ,
      ondestroy: ... ,
      scope: ... ,
      group: ... ,
      requires: ... ,
      autoinit: ... ,
    });

### Attribute `name` ###

The `name` attribute may contain a reference to a string representing the name of the node. The name should be a fully qualified domain name to prevent collisions. This rule can be relaxed for nodes, which only operate in anonymous private scopes. If the `name` attribute is undefined, a name `name.witiko.jbus.anonymous@` followed by a pseudo-random hash obtained by executing `Math.random().toString(36).replace(/0\./, "")` will be used instead.

### Attribute `description` ###

The `description` attribute may contain a reference to a string with a brief description of the node and its behaviour.

### Attribute `oninit` ###

The `oninit` attribute may contain a reference to a function, which will be called in the context of the node whenever the node becomes initialized. This attribute is also available as `new JBus.Node().oninit` and can be changed during the lifetime of the node, much like a DOM0 event listener.

### Attribute `onuninit` ###

The `onuninit` attribute may contain a reference to a function, which will be called in the context of the node whenever the node becomes uninitialized. This attribute is also available as `new JBus.Node().onuninit` and can be changed during the lifetime of the node, much like a DOM0 event listener.

### Attribute `ondestroy` ###

The `ondestroy` attribute may contain a reference to a function, which will be called in the context of the node, when the node becomes destroyed. This attribute is also available as `new JBus.Node().ondestroyed` and can be changed during the lifetime of the node, much like a DOM0 event listener.

### Attribute `scope` ###

The `scope` attribute may contain a reference to either a scope or an array of scopes. If the `scope` attribute is undefined, the `window.document` object will be used as the node's default scope.

### Attribute `group` ###

The `group` attribute may contain a reference to either a string or to an array of strings representing the name(s) of the group(s), on whose multicast address(es) the node is going to be listening. Each name should be a fully qualified domain name to prevent collisions. This rule can be relaxed for nodes, which only operate in anonymous private scopes.

### Attribute `requires` ###

The `requires` attribute may contain a reference to either a string representing the name of the required node or an array of such strings. If the `requires` attribute is undefined, the node will have no dependencies.

### Attribute `autoinit` ###

The `autoinit` attribute may contain a `false` boolean value, which will prevent the `JBus.Node.prototype.init` method from being called at the end of the node's construction. In any other case, the node will be autoinitialized, once it has been constructed.

If all required nodes of the node have already been initialized, the node is guaranteed to have been initialized immediately after the construction. Other nodes, which depend on the node, are also guaranteed to have been initialized and to have had their prospective `oninit` methods called immediately after the construction. This is enabled by the [`dispatchEvent()`][EventTarget.dispatchEvent] function, which guarantees that by the end of its invocation, all event listeners will have been called.

  [EventTarget.dispatchEvent]: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget-dispatchEvent "DOM 2 Events Specification"

### Overloads ###

The `JBus.Node` constructor supports the following shorthand overloads:

  * `new JBus.Node` is equal to calling `new JBus.Node({})`.
  * `new JBus.Node(name)`, where `name` is a string, is equal to calling `new JBus.Node({ name: name })`.

### Behaviour ###

Aside from the behaviour described in the section describing the lifecycle of a node, a `JBus.Node` object will attach an event listener to the `window` object and will react to an [`unload` event][unload event] by destroying itself. A `JBus.Node` object will also attach an event listener to the prospective owner window of all its scopes and will react to an [`unload` event][unload event] by sending a bye message to the given scope and by removing the scope from its internal array of scopes. If the array becomes empty, the node will destroy itself.

  [unload event]: http://www.w3.org/TR/DOM-Level-3-Events/#event-type-unload "DOM 3 Events Specification"

## Method `new JBus.Node().getName` ##

The `new JBus.Node().getName` returns the name of the node.

## Method `new JBus.Node().init` ##

Once called, the `new JBus.Node().init` will start initializing the uninitialized node as per the section describing the lifecycle of a node. If all required nodes of the node have already been initialized, the node is guaranteed to have been initialized immediately after the call. Other nodes, which depend on the node, are also guaranteed to have been initialized and to have had their prospective `oninit` methods called immediately after the call. This is enabled by the [`dispatchEvent()`][EventTarget.dispatchEvent] function, which guarantees that by the end of its invocation, all event listeners will have been called. The method has no return value.

## Method `new JBus.Node().destroy` ##

Once called, the `new JBus.Node().destroy` method will destroy the non-destroyed node as per the section describing the lifecycle of a node. The node is guaranteed to have been destroyed immediately after the call. Other nodes, which depend on the node, are also guaranteed to have been uninitialized and to have had their prospective `onuninit` methods called immediately after the call. This is enabled by the [`dispatchEvent()`][EventTarget.dispatchEvent] function, which guarantees that by the end of its invocation, all event listeners will have been called. The method has no return value.

## Method `new JBus.Node().send` ##

Once called, the `new JBus.Node().send` method will send a data message with the specified name and payload to either the broadcast address or the unicast addresses of the specified nodes. Below is the most extensive way of calling the method:

    new JBus.Node().send({
      to: {
        node: ... ,
        group: ...
      },
      data: {
        name: ... ,
        payload: ...
      }
    });

The method has no return value.

### Attribute `to`

If the `to` attribute is undefined, or `typeof to !== "string"` and `to` contains neither the `node` nor the `group` attribute, the message will be sent to the broadcast address.

### Attribute `to.node` ###

The `to.node` attribute may contain a reference to either a string or to an array of strings representing the name(s) of the recipient(s).

### Attribute `to.group` ###

The `to.group` attribute may contain a reference to either a string or to an array of strings representing the name(s) of the receiving group(s).

### Attribute `data.name` ###

The `data.name` attribute may contain the name of the data. The name should be a fully qualified domain name to prevent collisions. This rule can be relaxed for nodes, which only operate in anonymous private scopes.

### Attribute `data.payload` ###

The `data.name` attribute may contain the data payload.

### Overloads ###

The `new JBus.Node().send` method supports the following shorthand overloads:

  * `new JBus.Node().send(data)`, where `typeof data !== "object"` or `data` contains neither the `to` or the `data` attribute, is equal to calling:

        new JBus.Node().send({
          data: data
        })

  * `new JBus.Node().send({ ... , data: payload })`, where `typeof payload !== "object"` or `payload` doesn't contain the `name` attribute, is equal to calling:

        new JBus.Node().send({
          ...
          data: {
            payload: payload
          }
        });

  * The abovementioned overloads can be chained meaning that `new JBus.Node().send(payload)`, where `typeof payload !== "object"` or `payload` contains neither the `name`, `to` or the `data` attribute, is equal to calling:

        new JBus.Node().send({
          data: {
            payload: payload
          }
        });
  
  * `new JBus.Node().send({ ... , to: node })`, where `typeof node === "string"` or `node` is an array is equal to calling:
    
        new JBus.Node().send({
          ...
          to: {
            node: node
          }
        });

## Method `new JBus.Node().listen` ##

Once called, the `new JBus.Node().listen` method will add listeners for incoming data messages on either the broadcast address, the node's unicast address, or both. Below is the most extensive way of calling the method:

    new JBus.Node().listen({
      broadcast: ... ,
      multicast: ... ,
      unicast: ... ,
      any: ... ,
      filters: {
        from: ... ,
        name: ... ,
        payload: ... ,
      }
    });

The method returns a function, which will remove the registered listeners.

### Attributes `broadcast`, `multicast`, `unicast` and `any` ###

The `broadcast`, `multicast` and `unicast` attributes may contain a reference to a function, which will be called in the context of the node once a data message has been received on either the broadcast address, one of the node's groups' multicast address, or the node's unicast address, respectively.

The `any` attribute may contain a reference to a function, which will be called in the context of the node once a data message has been received on either the broadcast address, one of the node's groups' multicast address, or the node's unicast address. The functions will be called with one argument of the following form:

    {
      from: ... ,
      to:   ... ,
      data: ... ,
      scope: ...
    }

The `from` attribute will contain the name of the sender, the `data` attribute will contain the data part of the incoming message and the `scope` attribute will contain the scope in which the message was received. The `to` attribute will contain the name of the receiver group, when the message is received on the multicast address.

### Attributes `filters.from`, `filters.name` and `filters.payload` ###

The `filters.from`, `filters.name` and `filters.payload` attributes may contain a reference to either a string, function, regexp or an array. The incoming data messages `msg` are only passed to the listeners, if they pass the filters. The filter attributes correspond to the data message attributes in the following manner:

  * `filters.from` corresponds to `msg.from`
  * `filters.name` corresponds to `msg.data.name`
  * `filters.payload` corresponds to `msg.data.payload`

Below are the conditions for passing a filter for different types of filters:

  * *String* -- `filters[ ... ].valueOf() === msg[ ... ].valueOf()`
  * *Function* -- `!! filters[ ... ]( msg[ ... ] )`
  * *RegExp* -- `filters[ ... ].test( msg[ ... ] )`
  * *Array* -- `msg[ ... ]` must pass all the filters in the array.

### Overloads ###

The `new JBus.Node().listen` method supports the following shorthand overloads:

  * `new JBus.Node().listen(all)`, where `all` is a function, is equal to calling `new JBus.Node().listen({ all: all })`

## Method `new JBus.Node().toString` ##

The `new JBus.Node().toString` method returns a textual representation of the node and its inner state.

## Object `JBus.Debugger` ##

The `JBus.Debugger` method acts as a constructor of a debugger node. A debugger node allows you to send and listen for any types of messages, not just data messages. Below is the most extensive way of constructing a debugger node:

    new JBus.Debugger({
      oninit: ... ,
      onuninit: ... ,
      ondestroy: ... ,
      scope: ... ,
      group: ... ,
      requires: ... ,
      autoinit: ... ,
      autolog: ...
    });

### Attribute `oninit` ###

The `oninit` attribute may contain a reference to a function, which will be called in the context of the node whenever the node becomes initialized. This attribute is also available as `new JBus.Debugger().oninit` and can be changed during the lifetime of the node, much like a DOM0 event listener.

### Attribute `onuninit` ###

The `onuninit` attribute may contain a reference to a function, which will be called in the context of the node whenever the node becomes uninitialized. This attribute is also available as `new JBus.Debugger().onuninit` and can be changed during the lifetime of the node, much like a DOM0 event listener.

### Attribute `ondestroy` ###

The `ondestroy` attribute may contain a reference to a function, which will be called in the context of the node, when the node becomes destroyed. This attribute is also available as `new JBus.Debugger().ondestroy` and can be changed during the lifetime of the node, much like a DOM0 event listener.

### Attribute `scope` ###

The `scope` attribute may contain a reference to either a scope or an array of scopes. If the `scope` attribute is undefined, the `window.document` object will be used as the node's default scope.

### Attribute `group` ###

The `group` attribute may contain a reference to either a string or to an array of strings representing the name(s) of the group(s), on whose multicast address(es) the node is going to be listening. Each name should be a fully qualified domain name to prevent collisions. This rule can be relaxed for nodes, which only operate in anonymous private scopes.

### Attribute `requires` ###

The `requires` attribute may contain a reference to either a string representing the name of the required node or an array of such strings. If the `requires` attribute is undefined, the node will have no dependencies.

### Attribute `autoinit` ###

The `autoinit` attribute may contain a `false` boolean value, which will prevent the `JBus.Node.prototype.init` method from being called at the end of the node's construction. In any other case, the node will be autoinitialized, once it has been constructed.

If all required nodes of the node have already been initialized, the node is guaranteed to have been initialized immediately after the construction. This is enabled by the [`dispatchEvent()`][EventTarget.dispatchEvent] function, which guarantees that by the end of its invocation, all event listeners will have been called.

### Attribute `autolog` ###

The `console` attribute may contain a `false` boolean value, which will prevent the incoming messages from being logged into the console. In any other case, the node will log any incoming messages in the given scopes to the browser console.

### Overloads ###

The `JBus.Debugger` constructor supports the following shorthand overloads:

  * `new JBus.Debugger` is equal to calling `new JBus.Node({})`.

### Behaviour ###

A `JBus.Debugger` node will use a name `name.witiko.jbus.debugger@` followed by a pseudo-random hash obtained by executing `Math.random().toString(36).replace(/0\./, "")`.

A `JBus.Debugger` will initially only listens for incoming messages on the broadcast address and its own unicast address in all its scopes. It will, however, start listening for messages on the unicast address of any node, whose non-bye messages it captures. The debugger node will stop listening for messages on the unicast address of any node, whose bye message it captures.

## Method `new JBus.Debugger().getName` ##

The `new JBus.Debugger().getName` returns the name of the node.

## Method `new JBus.Debugger().init` ##

Once called, the `new JBus.Debugger().init` will start initializing the uninitialized node as per the section describing the lifecycle of a node. If all required nodes of the node have already been initialized, the node is guaranteed to have been initialized immediately after the call. This is enabled by the [`dispatchEvent()`][EventTarget.dispatchEvent] function, which guarantees that by the end of its invocation, all event listeners will have been called. The method has no return value.

## Method `new JBus.Debugger().destroy` ##

Once called, the `new JBus.Debugger().destroy` method will destroy the non-destroyed node as per the section describing the lifecycle of a node. The node is guaranteed to have been destroyed immediately after the call. This is enabled by the [`dispatchEvent()`][EventTarget.dispatchEvent] function, which guarantees that by the end of its invocation, all event listeners will have been called. The method has no return value.

## Method `new JBus.Debugger().send` ##

Once called, the `new JBus.Debugger().send` method will send the specified message to either the broadcast address or the unicast addresses of the specified nodes. Below is the most extensive way of calling the method:

    new JBus.Debugger().send({
      to: ... ,
      msg: ...
    });

The method has no return value.

### Attribute `to`

If the `to` attribute is undefined, or `typeof to !== "string"` and `to` contains neither the `node` nor the `group` attribute, the message will be sent to the broadcast address.

### Attribute `to.node` ###

The `to.node` attribute may contain a reference to either a string representing or to an array of strings representing the name(s) of the recipient(s).

### Attribute `to.group` ###

The `to.group` attribute may contain a reference to either a string or to an array of strings representing the name(s) of the receiving group(s).

### Attribute `msg` ###

The `msg` attribute must contain the outgoing message. If the outgoing message object doesn't contain the `from` parameter, the name of the debugger node will be appended to the message as the value of the `from` parameter.

### Overloads ###

The `new JBus.Debugger().send` method supports the following shorthand overloads:

  * `new JBus.Debugger().send(msg)`, where `typeof msg !== "object"` or `msg` doesn't contain the `msg` attribute, is equal to calling `new JBus.Debugger().send({ msg: msg })`.
  * `new JBus.Debugger().send({ ... , to: node })`, where `typeof node === "string"` or `node` is an array is equal to calling:
    
        new JBus.Node().send({
          ...
          to: {
            node: node
          }
        });


## Method `new JBus.Debugger().listen` ##

Once called, the `new JBus.Debugger().listen` method will add listeners for incoming messages on either the broadcast address, the unicast addresses of all present nodes, or both. Below is the most extensive way of calling the method:

    new JBus.Debugger().listen({
      broadcast: ... ,
      multicast: ... ,
      unicast: ... ,
      any: ...
    });

The method returns a function, which will remove the registered listeners.

### Attributes `broadcast`, `multicast` `unicast` and `any` ###

The `broadcast`, `multicast` and `unicast` attributes may contain a reference to a function, which will be called in the context of the node once a data message has been received on either the broadcast address, one of the node's groups' multicast address, or the node's unicast address, respectively.

The `any` attribute may contain a reference to a function, which will be called in the context of the node once a data message has been received on either the broadcast address, one of the node's groups' multicast address, or the node's unicast address. The functions will be called with one argument of the following form:

    {
      to: ... ,
      msg: ... ,
      scope: ...
    }

The `to` attribute may contain the name of the receiver node or group based on whether the message was received on the unicast or the multicast address, respectively. If the `to` attribute is undefined, the message was received on the broadcast address. The `msg` attribute will contain the incoming message and the `scope` attribute will contain the scope in which the message was received.

### Overloads ###

The `new JBus.Debugger().listen` method supports the following shorthand overloads:

  * `new JBus.Debugger().listen(all)`, where `all` is a function, is equal to calling `new JBus.Debugger().listen({ all: all })`

## Method `new JBus.Debugger().toString` ##

The `new JBus.Debugger().toString` method returns a textual representation of the node and its inner state.

## Method `JBus.services.events.send` ##

The `JBus.services.events.send` method is used by the `JBus.services.messages.unicast.send` and `JBus.services.messages.broadcast.send` methods to send custom events to the given scope. Below is the most extensive way of calling the function:

    JBus.services.events.send( scope, eventName, data );

The `scope` parameter is the scope to which the event is going to be sent, the `eventName` parameter is a reference to a string containing the name of the custom event being sent and `data` is the object encapsulated in the custom event. The method has no return value.

## Method `JBus.services.events.listen` ##

The `JBus.services.events.listen` method is used by the `JBus.services.messages.unicast.listen` and `JBus.services.messages.broadcast.listen` methods to add a listener for the given custom events on the given scope. Below is the most extensive way of calling the function:

    JBus.services.events.send( scope, eventName, callback );

The `scope` parameter is the scope to which the listener is going to be added, the `eventName` parameter is a reference to a string containing the name of the custom events and the `callback` parameter is a reference to a function, which will be called each time a custom event with the given name is captured in the given scope with the object encapsulated in the custom event as the function's first parameter. The method returns a function, which will remove the registered listener.

## Method `JBus.services.messages.broadcast.send` ##

The `JBus.services.messages.broadcast.send` method is used by the `JBus.Node` and `JBus.Debugger` objects to send messages to the broadcast address in the given scope. Below is the most extensive way of calling the function:

    JBus.services.messages.broadcast.send( scope, msg );

The `scope` parameter is the scope in which the message is going to be sent and the `msg` parameter is the message being sent. The method has no return value.

## Method `JBus.services.messages.multicast.send` ##

The `JBus.services.messages.multicast.send` method is used by the `JBus.Node` and `JBus.Debugger` objects to send messages to the multicast address of the given group in the given scope. Below is the most extensive way of calling the function:

    JBus.services.messages.multicast.send( scope, name, msg );

The `scope` parameter is the scope in which the message is going to be sent, the `name` parameter is the name of the receiving group and the `msg` parameter is the message being sent. The method has no return value.

## Method `JBus.services.messages.unicast.send` ##

The `JBus.services.messages.unicast.send` method is used by the `JBus.Node` and `JBus.Debugger` objects to send messages to the unicast address of the given node in the given scope. Below is the most extensive way of calling the function:

    JBus.services.messages.unicast.send( scope, name, msg );

The `scope` parameter is the scope in which the message is going to be sent, the `name` parameter is the name of the recipient and the `msg` parameter is the message being sent. The method has no return value.

## Method `JBus.services.messages.broadcast.listen` ##

The `JBus.services.messages.broadcast.listen` method is used by the `JBus.Node` and `JBus.Debugger` objects to listen for incoming messages on the broadcast address in the given scope. Below is the most extensive way of calling the function:

    JBus.services.messages.broadcast.listen( scope, callback );

The `scope` parameter is the scope to which the listener is going to be added and the `callback` parameter is a reference to a function, which will be called each time a message is received on the broadcast address in the given scope with the message as the function's first parameter. The method returns a function, which will remove the registered listener.

## Method `JBus.services.messages.multicast.listen` ##

The `JBus.services.messages.unicast.listen` method is used by the `JBus.Node` and `JBus.Debugger` objects to listen for incoming messages on the multicast address of the given group in the given scope. Below is the most extensive way of calling the function:

    JBus.services.messages.multicast.listen( scope, name, callback );

The `scope` parameter is the scope to which the listener is going to be added, the `name` parameter is a reference to a string containing the name of the group, on whose multicast address the listener is going to be listening, and the `callback` parameter is a reference to a function, which will be called each time a message is received on the multicast address in the given scope with the message as the function's first parameter. The method returns a function, which will remove the registered listener.

## Method `JBus.services.messages.unicast.listen` ##

The `JBus.services.messages.unicast.listen` method is used by the `JBus.Node` and `JBus.Debugger` objects to listen for incoming messages on the unicast address of the given node in the given scope. Below is the most extensive way of calling the function:

    JBus.services.messages.unicast.listen( scope, name, callback );

The `scope` parameter is the scope to which the listener is going to be added, the `name` parameter is a reference to a string containing the name of the node, on whose unicast address the listener is going to be listening, and the `callback` parameter is a reference to a function, which will be called each time a message is received on the unicast address in the given scope with the message as the function's first parameter. The method returns a function, which will remove the registered listener.

## Object `JBus.messages.Collision` ##

The `JBus.messages.Collision` method acts as a constructor of a collision message object. The constructor is parameterless.

## Object `JBus.messages.Bonjour` ##

The `JBus.messages.Bonjour` method acts as a constructor of a bonjour message object. Below is the most extensive way of constructing a bonjour message:

    new JBus.messages.Bonjour({
      from: ... ,
      description: ...
    });

### Attribute `from` ###

The `from` attribute is a reference to a string containing the name of the sender of the message.

### Attribute `description` ###

The `from` attribute may be a reference to a string containing the description of the sender of the message.

### Overloads ###

The `JBus.messages.Bonjour` constructor supports the following shorthand overloads:

  * `new JBus.messages.Bonjour(from)`, where `typeof from !== "object"` or `from` doesn't contain the `from` attribute, is equal to calling:
  
        new JBus.messages.Bonjour({
          from: from
        });

## Object `JBus.messages.Ping` ##

The `JBus.messages.Ping` method acts as a constructor of a ping message object. Below is the most extensive way of constructing a ping message:

    new JBus.messages.Ping({
      from: ...
    });

### Attribute `from` ###

The `from` attribute is a reference to a string containing the name of the sender of the message.

### Overloads ###

The `JBus.messages.Ping` constructor supports the following shorthand overloads:

  * `new JBus.messages.Ping(from)`, where `typeof from !== "object"` or `from` doesn't contain the `from` attribute, is equal to calling:
  
        new JBus.messages.Ping({
          from: from
        });

## Object `JBus.messages.Bye` ##

The `JBus.messages.Bye` method acts as a constructor of a bye message object. Below is the most extensive way of constructing a bye message:

    new JBus.messages.Bye({
      from: ...
    });

### Attribute `from` ###

The `from` attribute is a reference to a string containing the name of the sender of the message.

### Overloads ###

The `JBus.messages.Bye` constructor supports the following shorthand overloads:

  * `new JBus.messages.Bye(from)`, where `typeof from !== "object"` or `from` doesn't contain the `from` attribute, is equal to calling:
  
        new JBus.messages.Bye({
          from: from
        });

## Object `JBus.messages.Data` ##

The `JBus.messages.Data` method acts as a constructor of a data message object. Below is the most extensive way of constructing a data message:

    new JBus.messages.Data({
      from: ... ,
      name: ... ,
      payload: ... ,
    });

### Attribute `from` ###

The `from` attribute is a reference to a string containing the name of the sender of the message.

### Attribute `name` ###

The `name` attribute may be a reference to a string containing the name of the data in the message. The name should be a fully qualified domain name to prevent collisions. This rule can be relaxed for nodes, which only operate in anonymous private scopes.

### Attribute `payload` ###

The `payload` attribute may be a reference to the data in the data message.

# Unit testing #

By loading the `src/test.html` file in your browser, you can run a suite of tests against the `src/jBus.js` and `src/framework.js` files. You can use this to check, whether:

  * jBus is compatible with a given browser.
  * Your modified version of jBus works as intended.
# Example userscripts #

In the following section, we will go over several example userscripts and explore several patterns that can be used, when developing with the jBus library.

## Beacon ##

The simplest way to use jBus in a userscript is creating a named node:

```js
// ==UserScript==
// @name           An example userscript #1
// @description    A beacon
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

new JBus.Node( "name.witiko.jbus.examples.userscript#1" );
```

This is enough for other nodes to be able react to that node's presence:

```js
// ==UserScript==
// @name           An example userscript #2
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

new JBus.Node({
  requires: "name.witiko.jbus.examples.userscript#1",
  oninit: function() {
    console.log( "The example userscript #1 node has been initialized." );
  }, onuninit: function() {
    console.log( "The example userscript #1 node has been uninitialized." );
  }
});
```

The beacon node can be destroyed and initialized at will and the dependent userscripts will notice right away:

```js
// ==UserScript==
// @name           An example userscript #1
// @description    A beacon
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

var node;

/**
 * Initializes the beacon node.
 */
function init() {
  node = new JBus.Node( "name.witiko.jbus.examples.userscript#1" );
}

/**
 * Destroys the beacon node.
 */
function destroy() {
  node.destroy();
}
```

### Dependencies ###

#### Cascading dependencies ####

We have already seen that when one of the required nodes of a node uninitializes, the node itself unitializes. Imagine the initialized nodes as a directed rooted tree, where the parent nodes are required by the child nodes. Uninitializing a parent node then makes the whole subtree collapse and then reform again as soon as the parent is reinitialized. Suppose the following code:

```js
var a = new JBus.Node({ name: "name.witiko.jbus.examples.root" });
var b = new JBus.Node({ name: "name.witiko.jbus.examples.sub1", requires: "name.witiko.jbus.examples.root" });
var c = new JBus.Node({ name: "name.witiko.jbus.examples.sub2", requires: "name.witiko.jbus.examples.root" });
var d = new JBus.Node({ name: "name.witiko.jbus.examples.sub3", requires: "name.witiko.jbus.examples.root" });
var e = new JBus.Node({ name: "name.witiko.jbus.examples.sub4", requires: "name.witiko.jbus.examples.sub3" });
var f = new JBus.Node({ name: "name.witiko.jbus.examples.sub5", requires: "name.witiko.jbus.examples.sub4" });
```

Now suppose we destroy the root node by executing `a.destroy()`. Below is the output of a debugger node:

    [JBus] A broadcast message {Bye} from name.witiko.jbus.examples.root in scope #document
    [JBus] A broadcast message {Bye} from name.witiko.jbus.examples.sub1 in scope #document
    [JBus] A broadcast message {Bye} from name.witiko.jbus.examples.sub2 in scope #document
    [JBus] A broadcast message {Bye} from name.witiko.jbus.examples.sub3 in scope #document
    [JBus] A broadcast message {Bye} from name.witiko.jbus.examples.sub4 in scope #document
    [JBus] A broadcast message {Bye} from name.witiko.jbus.examples.sub5 in scope #document

If we now create a new root node by running `new JBus.Node("root")`, the rest of the tree reinitializes:

    [JBus] A broadcast message {Bonjour} from name.witiko.jbus.examples.root in scope #document
    [JBus] A unicast message {Collision} to name.witiko.jbus.examples.root in scope #document
    [JBus] A broadcast message {Bonjour} from name.witiko.jbus.examples.sub1 in scope #document
    [JBus] A broadcast message {Bonjour} from name.witiko.jbus.examples.sub2 in scope #document
    [JBus] A broadcast message {Bonjour} from name.witiko.jbus.examples.sub3 in scope #document
    [JBus] A broadcast message {Bonjour} from name.witiko.jbus.examples.sub4 in scope #document
    [JBus] A broadcast message {Bonjour} from name.witiko.jbus.examples.sub5 in scope #document

##### Circular dependencies #####

Since a jBus network is a general graph rather than a tree, it is possible to create circular dependencies, which will never resolve. Suppose the following code:

```js
var a = new JBus.Node({
  name: "name.witiko.jbus.examples.a",
  requires: "name.witiko.jbus.examples.b",
  oninit: function() { console.log("a is initialized!") }
}), b = new JBus.Node({
  name: "name.witiko.jbus.examples.b",
  requires: "name.witiko.jbus.examples.a",
  oninit: function() { console.log("b is initialized!") }
});
```

It can be be observed that upon running the above code, neither of the nodes will ever initialize. As a general rule, no set of nodes, whose dependencies can be portrayed as a directed circular graph, will ever initialize.

## Broadcast service ##

Another way of using jBus in a userscript is for broadcasting data to other userscripts much like with [custom events][CustomEvent]. Suppose you write a parasitic userscript, which detects events in the underlying webpage by, say, monitoring [DOM 2 Mutation events][] and then reacts to them. You may react to them directly:

```js
// ==UserScript==
// @name           An example userscript #3
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

document.querySelector(/* ... */).addEventListener("DOMSubtreeModified", function(e) {
  // We process the event
  // We react to the event
}, false);
```

Or you may decouple the processing of the mutation event and the reaction into two components:

```js
// ==UserScript==
// @name           An example userscript #3
// @description    A broadcast service
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

var node = new JBus.Node( "name.witiko.jbus.examples.userscript#3" );
document.querySelector(/* ... */).addEventListener("DOMSubtreeModified", function(e) {
  // We process the event
  node.send({
    data: // The processed event
  });
}, false);

new JBus.Node().listen({
  broadcast: function(msg) {
    // We react to `msg.data.payload`
  }, filters: {
    from: "name.witiko.jbus.examples.userscript#3"
  }
});
```

This not only makes the maintenance of the separate components of the userscript easier, but it also allows any other userscript to listen for incoming data on the broadcast address and react to them without having to do as much as touch the underlying webpage:

```js
// ==UserScript==
// @name           An example userscript #4
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

new JBus.Node().listen({
  broadcast: function(msg) {
    // We react to `msg.data.payload`
  }, filters: {
    from: "name.witiko.jbus.examples.userscript#3"
  }
});
```

  [CustomEvent]: http://www.w3.org/TR/DOM-Level-3-Events/#interface-CustomEvent "DOM 3 Events Specification"
  [DOM 2 Mutation events]: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mutationevents "Document Object Model Events"

### Scoping ###

If you don't want to broadcast the data globally, but only within your userscript, it is advisable to use an anonymous private scope to prevent the cluttering up of the default public scope like this:

```js
// ==UserScript==
// @name           An example userscript #3
// @description    A broadcast service
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

/* We set up a private scope along with
   the new node. */
var scope = new JBus.Scope,
    node = new JBus.Node({
  name: "name.witiko.jbus.examples.userscript#3",
  scope: scope
});

document.querySelector(/* ... */).addEventListener("DOMSubtreeModified", function(e) {
  // We process the event
  node.send({
    data: // The processed event
  });
}, false);

new JBus.Node({ scope: scope }).listen({
  broadcast: function(msg) {
    // We react to `msg.data.payload`
  }, filters: {
    from: "name.witiko.jbus.examples.userscript#3"
  }
});
```

### Multicasting ###

Multicasting is useful, when you only want to broadcast data to a specific group of listeners:

```js
// ==UserScript==
// @name           An example userscript #3
// @description    A broadcast service
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

var node = new JBus.Node("name.witiko.jbus.examples.userscript#3");

document.querySelector(/* ... */).addEventListener("DOMSubtreeModified", function(e) {
  // We process the event
  node.send({
    to: {
      group: "name.witiko.jbus.examples.group#1"
    }, data: // The processed event
  });
}, false);
```

```js
// ==UserScript==
// @name           An example userscript #4
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

new JBus.Node({
  group: "name.witiko.jbus.examples.group#1"
}).listen({
  multicast: function(msg) {
    // We react to `msg.data.payload`
  }, filters: {
    from: "name.witiko.jbus.examples.userscript#3"
  }
});
```

Multicasting is generally preferred over broadcasting, unless we're operating in an anonymous private scope, where every node is guaranteed to be interested in the broadcasted data.

## Subscription service ##

Sometimes, you want for the userscripts to be able to state the paramers of the data they will receive. That's when the subscription service comes in handy. We will create a userscript, which will keep sending a given string back to the subscriber:

```js
// ==UserScript==
// @name           An example userscript #5
// @description    A subscription service
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

var node = new JBus.Node({
  name: "name.witiko.jbus.examples.userscript#5",
  description: "An echo subscription service",
  autoinit: false
}); node.listen({
  unicast: function(msg) {
    /* An incoming subscription. We create a
       personalised subscription sender node. */
    var subscriber = msg.from,
        string = msg.data.payload,
        interval, sender = new JBus.Node({
      requires: subscriber,
      oninit: function() {
        interval = setInterval(function() {
          /* We will keep sending the given string
             back to the subscriber every 5 seconds. */
          sender.send({
            to: subscriber,
            data: string
          });
        }, 5000);
      }, onuninit: function() {
        /* The node destroys itself, when the
           subscriber uninitializes. */
        this.destroy();
        clearInterval( interval );
      }
    });
  }
}); node.init();
```
```js
// ==UserScript==
// @name           An example userscript #6
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

new JBus.Node({
  requires: "name.witiko.jbus.examples.userscript#5",
  oninit: function() {
    this.send({
      to: "name.witiko.jbus.examples.userscript#5",
      data: "Hello world!"
    });
  }
}).listen({
  unicast: function(msg) {
    console.log( "[", new Date().toString(), "]", msg.data.payload );
  }
});
```

Below is the output of the userscript #6:

    [ Fri Sep 12 2014 15:06:28 GMT+0200 (CEST) ] Hello world!
    [ Fri Sep 12 2014 15:06:33 GMT+0200 (CEST) ] Hello world!
    [ Fri Sep 12 2014 15:06:38 GMT+0200 (CEST) ] Hello world!
    [ Fri Sep 12 2014 15:06:43 GMT+0200 (CEST) ] Hello world!
    [ Fri Sep 12 2014 15:06:48 GMT+0200 (CEST) ] Hello world!

### Data naming ###

Sometimes it makes sense for a node to send several types of data:

```js
// ==UserScript==
// @name           An example userscript #7
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

var node = new JBus.Node({
  name: "name.witiko.jbus.examples.userscript#7",
  autoinit: false
}); node.listen({
  unicast: function(msg) {
    switch( msg.data.name ) {
      case "name.witiko.jbus.examples.messages.greeting":
        console.log( "I received a greeting message:", msg.data.payload ); break;
      case "name.witiko.jbus.examples.messages.farewell":
        console.log( "I received a farewell message:", msg.data.payload ); break;
    }
  }
}); node.init();
```

```js
// ==UserScript==
// @name           An example userscript #8
// @match          *://github.com/witiko/jbus
// @require        http://tiny.cc/jBus
// ==/UserScript==

new JBus.Node({
  requires: "name.witiko.jbus.examples.userscript#7",
  description: "A greeter node",
  oninit: function() {
    this.send({
      to: "name.witiko.jbus.examples.userscript#7",
      data: {
        name: "name.witiko.jbus.examples.messages.greeting",
        payload: "Hey there!"
      }
    }); this.send({
      to: "name.witiko.jbus.examples.userscript#7",
      data: {
        name: "name.witiko.jbus.examples.messages.farewell",
        payload: "Goodbye!"
      }
    });
  }
});
```

Below is the output of the userscript #7:

    I received a greeting message: Hey there!
    I received a farewell message: Goodbye!

## Sky is the limit ##

The examples and patterns above were a mere taste of jBus to whet your appetite. The architecture is general and allows you to implement any kind of bindings between your userscript components or individual userscripts.
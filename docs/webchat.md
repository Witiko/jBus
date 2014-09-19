# Example: Web chat application #

In the following section, we will design a client side of a web chat application showing several jBus development patterns that can be used to decouple individual application components.

## Tight coupling ##

Suppose we have an HTTP server that exchanges messages about chat events with a JavaScript ajax library. Our application works with the following types of chat events:

  * *Status change event* -- A user has gone either online or offline.
  * *Message event* -- A user has sent a chat message.

The communication works both ways -- not only can the server notify the ajax library about the status changes of other users and the incoming messages, but so can the application notify the server about the status changes and outgoing messages of the logged in user.

We will not be concerning ourselves with the implementation of the communication between the ajax library and the server, and we will focus solely on the application instead. The easiest way of setting up the application would be to couple it tightly with the ajax library as shown in the following graph:

  [![A graph of a tightly coupled web chat application][]][1.svg]

## Broadcast service ##

Tight coupling of the application and the ajax library may be the ideal colution for a simple web chat application, but if the application comprises various components, each working with chat events, the maintenance of the current components and the adding of new ones becomes difficult, since the code of the components is intertwined.

To decouple the ajax library from the application components, we can use the *broadcast service* pattern. We create a node with a known name, which represents the ajax library and which sends incoming chat events to the broadcast address and receives outgoing chat events on its unicast address. Each component is then represented by a node, which listens for incoming chat events on the broadcast address and send outgoing chat events to the unicast address of the ajax library node. This is illustrated in the following graph:

  [![A graph of a loosely coupled web chat application using a broadcast service node][]][2.svg]

With the application components and the ajax library decoupled, our web application represents the simplest form of the Model-View-Controller architectural pattern with the components being the view, the ajax library being the controller and the server being the model. The following pseudocode represents our application:

```js
// # The ajax library node #
var ajaxNode = new JBus.Node({
  name: "name.witiko.jbus.examples.webchat.ajax",
  autoinit: false,
}); ajaxNode.listen({
  unicast: function(msg) {
    /* We pass `msg.data.payload` to the ajax
       library as an outgoing chat event. */
    ajax.send( msg.data.payload );
  }
}); ajaxNode.init();

/* We send incoming chat events from the ajax
   library to the broadcast address. */
ajax.onchatevent = function(chatEvent) {
  ajaxNode.send( chatEvent );
};

// # The component nodes #
var compNode = new JBus.Node({
  requires: "name.witiko.jbus.examples.webchat.ajax",
  oninit: function() {
    /* We react to the availability of the 
       ajax library node. */
    // ...
  }, onuninit: function() {
    /* We react to the unavailability of the 
       ajax library node. */
    // ...
  }
}); compNode.listen({
  broadcast: function(msg) {
    /* We react to the incoming chat event. */
    // ...
  }, filters: {
    from: "name.witiko.jbus.examples.webchat.ajax"
    /* We can filter out the incoming chat
       events based on the component's interests. */
  }
}); compNode.init();

/* We send outgoing chat events from the component
   to the unicast address of the ajax library node. */
component.onchatevent = function(chatEvent) {
  compNode.send({
    to: "name.witiko.jbus.examples.webchat.ajax",
    data: chatEvent
  });
};
```

By setting the ajax library node as a dependency of the component nodes, we can destroy and reinitialize the ajax library node as a reaction to connectivity problems and each component can react to that in a meaningful way without any tight coupling between the components and the ajax library.

## Subscription service ##

The broadcast service pattern is robust, but it doesn't scale well, if the requirements of each component are too diverse. Simple message filtering functionality is readily offered by the `new JBus.Node().listen` method, but if each component has a set of more complex requirements (f.ex. the format of the chat events or minimum time intervals at which the events should be delivered), a more complex solution using the *subscription service* pattern is needed.

In the *subscription service* pattern, there is no central ajax library node. Instead, there is a subscription service node with a known name. The component nodes subscribe to the reception of chat events by sending a message with the parameters of the subscription to the subscription service node. The subscription service node then creates a chat event notifications sender node, which then sends incoming chat events to the given component's unicast address and destroys itself, when the component node uninitializes.

The chat event notifications sender nodes are present both in the default public scope and in an anonymous private scope, which they share with the chat events receiver node. This node receives incoming chat events from the ajax library and sends them to the broadcast address in the private scope, where they are retrieved by the chat event notifications sender nodes, processed and then passed to the component nodes in the public scope.

As for the outgoing chat events, there is a chat events sender node with a known name, to whose unicast address the component nodes send outgoing chat events and which passes these outgoing chat events to the ajax library. This is illustrated in the following graph:

  [![A graph of a loosely coupled web chat application using a subscription service node #1][]][3.svg]

As far as the Model-View-Controller architectural pattern goes, we can see that the controller part of our application has become somewhat convulted. In exchange for this complexity increase, each application component can now receive fully personalised chat events. The following pseudocode represents our application:

```js
// # The private and the public scope #
var privateScope = new JBus.Scope,
    publicScope = JBus.Scope();

// # The chat events sender node #
var senderNode = new JBus.Node({
  name: "name.witiko.jbus.examples.webchat.nodes.sender",
  scope: publicScope,
  autoinit: false,
}); senderNode.listen({
  unicast: function(msg) {
    /* We pass `msg.data.payload` to the ajax
       library as an outgoing chat event. */
    ajax.send( msg.data.payload );
  }
}); senderNode.init();

// # The chat events receiver node #
var receiverNode = new JBus.Node({
  scope: privateScope
});

/* We send incoming chat events from the ajax
   library to the broadcast address. */
ajax.onchatevent = function(chatEvent) {
  receiverNode.send( chatEvent );
};

// # The chat event notifications subscription service node #
var subscriptionNode = new JBus.Node({
  name: "name.witiko.jbus.examples.webchat.nodes.subscription",
  scope: publicScope,
  autoinit: false
}); subscriptionNode.listen({
  unicast: function(msg) {
    /* We create a new chat event notifications
       sender node. */
    var subscriber = msg.from,
        node = new JBus.Node({
      scope: [ privateScope, publicScope ],
      requires: subscriber,
      onuninit: function() {
        /* The node destroys itself, when the
           subscribed component node uninitializes. */
        this.destroy();
      }
    }); node.listen({
      broadcast: function(msg) {
        /* We process the incoming chat event according
           to the parameters of the subscription and
           then we send it to the unicast address of
           the subscribed component node. */
        var processed = /* ... */;
        this.send({
          to: subscriber,
          data: {
            name: "name.witiko.jbus.examples.webchat.messages.subscription",
            payload: processed
          }
        });
      }
    }); node.init();
  }
}); subscriptionNode.init();

// # The component nodes #
var compNode = new JBus.Node({
  requires: [
    /* If the component only listens to incoming
       chat events, the dependency on the chat
       events sender node is unnecessary. */
    "name.witiko.jbus.examples.webchat.nodes.sender",
    /* If the component only sends outgoing
       chat events, the dependency on the chat
       event notifications subscription service
       node is unnecessary. */
    "name.witiko.jbus.examples.webchat.nodes.subscription"
  ], oninit: function() {
    /* We react to the availability of the 
       required nodes. */
    // ...
    /* We subscribe to the chat event notifications. */
    var subscriptionParameters = /* ... */;
    this.send({
      to: "name.witiko.jbus.examples.webchat.nodes.subscription",
      data: subscriptionParameters
    });
  }, onuninit: function() {
    /* We react to the unavailability of the 
       required nodes. */
    // ...
  }
}); compNode.listen({
  unicast: function(msg) {
    /* We react to the incoming chat event. */
    // ...
  }, filters: {
    name: "name.witiko.jbus.examples.webchat.messages.subscription"
  }
}); compNode.init();

/* We send outgoing chat events from the component
   to the unicast address of the chat events sender
   node. */
component.onchatevent = function(chatEvent) {
  compNode.send({
    to: "name.witiko.jbus.examples.webchat.nodes.sender",
    data: chatEvent
  });
};
```

The private scope, whose role is to prevent the chat events receiver from cluttering up the default public scope with broadcast messages, can be removed with the help of multicasting. With the private scope removed, we can now merge the chat sender and receiver nodes into a single node representing the ajax library, decreasing the overall architectural complexity of our application:

  [![A graph of a loosely coupled web chat application using a subscription service node #2][]][4.svg]

The following pseudocode represents our application:

```js
// # The chat events handler node #
var ajaxNode = new JBus.Node({
  name: "name.witiko.jbus.examples.webchat.nodes.ajax",
  autoinit: false,
}); ajaxNode.listen({
  unicast: function(msg) {
    /* We pass `msg.data.payload` to the ajax
       library as an outgoing chat event. */
    ajax.send( msg.data.payload );
  }
}); ajaxNode.init();

/* We send incoming chat events from the ajax
   library to the multicast address of the
   group, on which the chat events notification
   sender nodes are listening. */
ajax.onchatevent = function(chatEvent) {
  ajaxNode.send({
    to: {
      group: "name.witiko.jbus.examples.webchat.groups.notificationSenders"
    }, data: chatEvent
  });
};

// # The chat event notifications subscription service node #
var subscriptionNode = new JBus.Node({
  name: "name.witiko.jbus.examples.webchat.nodes.subscription",
  autoinit: false
}); subscriptionNode.listen({
  unicast: function(msg) {
    /* We create a new chat event notifications
       sender node. */
    var subscriber = msg.from,
        node = new JBus.Node({
      requires: subscriber,
      group: "name.witiko.jbus.examples.webchat.groups.notificationSenders",
      onuninit: function() {
        /* The node destroys itself, when the
           subscribed component node uninitializes. */
        this.destroy();
      }
    }); node.listen({
      multicast: function(msg) {
        /* We process the incoming chat event in
           `msg.data.payload` according to the
           parameters of the subscription and
           then we send it to the unicast address of
           the subscribed component node. */
        var processed = /* ... */;
        this.send({
          to: subscriber,
          data: {
            name: "name.witiko.jbus.examples.webchat.messages.subscription",
            payload: processed
          }
        });
      }
    }); node.init();
  }
}); subscriptionNode.init();

// # The component nodes #
var compNode = new JBus.Node({
  requires: [
    /* If the component only listens to incoming
       chat events, the dependency on the chat
       events sender node is unnecessary. */
    "name.witiko.jbus.examples.webchat.nodes.ajax",
    /* If the component only sends outgoing
       chat events, the dependency on the chat
       event notifications subscription service
       node is unnecessary. */
    "name.witiko.jbus.examples.webchat.nodes.subscription"
  ], oninit: function() {
    /* We react to the availability of the 
       required nodes. */
    // ...
    /* We subscribe to the chat event notifications. */
    var subscriptionParameters = /* ... */;
    this.send({
      to: "name.witiko.jbus.examples.webchat.nodes.subscription",
      data: subscriptionParameters
    });
  }, onuninit: function() {
    /* We react to the unavailability of the 
       required nodes. */
    // ...
  }
}); compNode.listen({
  unicast: function(msg) {
    /* We react to the incoming chat event. */
    // ...
  }, filters: {
    name: "name.witiko.jbus.examples.webchat.messages.subscription"
  }
}); compNode.init();

/* We send outgoing chat events from the component
   to the unicast address of the chat events sender
   node. */
component.onchatevent = function(chatEvent) {
  compNode.send({
    to: "name.witiko.jbus.examples.webchat.nodes.ajax",
    data: chatEvent
  });
};
```

The proposed solution is overengineered for the majority of practical purposes, but it shows the various aspects as well as the scalability of the jBus library.

  [A graph of a tightly coupled web chat application]: ../images/1.png
  [A graph of a loosely coupled web chat application using a broadcast service node]: ../images/2.png
  [A graph of a loosely coupled web chat application using a subscription service node #1]: ../images/3.png
  [A graph of a loosely coupled web chat application using a subscription service node #2]: ../images/4.png
  
  [1.svg]: ../images/1.svg
  [2.svg]: ../images/2.svg
  [3.svg]: ../images/3.svg
  [4.svg]: ../images/4.svg

# Architecture #

## Events ##

The physical layer of a jBus network is based on the [`CustomEvent`][CustomEvent] interface, as described in the [DOM 3 Events W3C working draft][DOM 3 Events], which allows the creation of synthetic events via the [`createEvent()`][DocumentEvent.createEvent] method, as described in the [DOM 2 Events W3C recommendation][DOM 2 Events]. These events are then initialized as non-bubbling and non-cancellable and dispatched using the [`dispatchEvent()`][EventTarget.dispatchEvent] method, as described in the [DOM 2 Events W3C recommendation][DOM 2 Events].

This effectively enables transfer of arbitrary data through an unlimited number of separate channels as represented by both the event name and the [event target][EventTarget]. Event names are used as addresses and [event targets][EventTarget] (hereinafter, scopes) represent separate jBus networks. Every jBus node (hereinafter just node) can be assigned to multiple scopes and thus connected to multiple networks. The default scope is the public `window.document` object as described in the [WHATWG HTML specification][Window interface specification].

  [DOM 2 Events]: http://www.w3.org/TR/DOM-Level-2-Events/ "DOM 2 Events Specification"
  [DOM 3 Events]: http://www.w3.org/TR/DOM-Level-3-Events/ "DOM 3 Events Specification"
  [CustomEvent]: http://www.w3.org/TR/DOM-Level-3-Events/#interface-CustomEvent "DOM 3 Events Specification"
  [DocumentEvent.createEvent]: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-DocumentEvent-createEvent "DOM 2 Events Specification"
  [EventTarget.dispatchEvent]: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget-dispatchEvent "DOM 2 Events Specification"
  [EventTarget]: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget "DOM 2 Events Specification"
  [Window interface specification]: http://www.whatwg.org/specs/web-apps/current-work/multipage/browsers.html#the-window-object "HTML Standard"

## Addresses ##

The node addressing scheme differentiates between three types of addresses:

  1. *Broadcast* -- Events named as this address are retrieved by all nodes, which are initializing or initialized.
    * The broadcast address is `name.witiko.jbus.addresses.broadcast` and it addresses all nodes in the scope.
  2. *Multicast* -- Events named as these addresses are retrieved by all subscribed nodes, which are initializing or initialized.
    * Multicast addresses are of the form `name.witiko.jbus.addresses.multicast::<name>`, where `<name>` is a unique string identifier (hereinafter, name) of the subscribed set of notes (hereinafter, group).
  3. *Unicast* -- Events named as these addresses are retrieved by the addressed node, if it's initializing or initialized.
    * Unicast addresses are of the form `name.witiko.jbus.addresses.unicast::<name>`, where `<name>` is a name of the receiving node (hereinafter, recipient).

Hereinafter, *sending a message to an address* means dispatching a custom event named as the address and containing the message object. Hereinafter, *listening for messages on an address* means adding an event listener to an event named as the address.

## Messages ##

jBus uses the following types of messages:

  1. *Collision* -- Informs the receiving node of a name collision.
  2. *Bonjour* -- Informs the receiving node of the sending node's (hereinafter, sender's) existence.
  3. *Ping* -- Requests a bonjour message from the recipient.
  4. *Bye* -- Informs the recipient that the sending node has been uninitialized.
  5. *Data* -- Contains application data from the sender for the recipient.

### Collision message ###

Every node must send this message to its own unicast address during its initialization prior to starting to listen for messages on its own unicast address. This ensures that every other node with the same name receives the message. Every initializing or initialized node must destroy itself once it has received this message. The collision message has the following format:

    {
      type: 0x00,
      from: ... ,
    }

The `from` field contains the sender's name and is optional.

### Bonjour message ###

Every node must send this message to the broadcast address when it is initialized or send it to the unicast address of the sender of a ping message. This allows the nodes to keep track of other initialized nodes in the scope. The bonjour message has the following format:

    {
      type: 0x01,
      from: ... ,
      description: ...
    }

The `from` field contains the sender's name. The `description` field is optional and contains short textual description of the sender for debugging purposes.

### Ping message ###

Every node must respond to this message by sending a unicast bonjour message to the ping message sender. This allows the nodes to keep track of other initialized nodes in the scope. The ping message has the following format:

    {
      type: 0x02,
      from: ...
    }

The `from` field contains the sender's name.

### Bye message ###

Every node must send this message to the broadcast address when it is uninitialized. This allows the nodes to keep track of other initialized nodes in the scope. The bye message has the following format:

    {
      type: 0x03,
      from: ...
    }

The `from` field contains the sender's name.

### Data message ###

Data messages are sent at application's leisure and have the following format:

    {
      type: 0x04,
      from: ... ,
      data: { ... }
    }

The `from` field contains the sender's name. The `data` field contains application data and its format is described in the application section.

## Nodes ##

A node has several properties:

  1. *Name* -- A name used for unicast addressing
    * The name should be a fully qualified domain name to prevent collisions.
    * The rule above can be relaxed for nodes, which only operate in anonymous private scopes.
  1. *Description* -- A short textual description of the node (optional)
  2. *Dependencies* -- A set containing names of required nodes
    * The node can only be initialized when all the required nodes are initialized.
  3. *Scopes* -- A set of scopes in which the node operates
  4. *Groups* -- A set of groups, on whose multicast addresses the node is listening.
    * The group names should be fully qualified domain names to prevent collisions.
    * The rule above can be relaxed for nodes, which only operate in anonymous private scopes.
  5. *State* -- The state of the node; must be one of the following:
    1. *Uninitialized* -- The node has been created, but may neither listen for messages on any address nor send any messages.
    2. *Initializing* -- The node is waiting for all required nodes to be initialized.
    3. *Initialized* -- The node is ready to send and receive application data.
    4. *Destroyed* -- The node has been unitialized and can no longer be used.

### Lifecycle ###

  1. Every node is created unitialized.
  2. The uninitialized node then, either automatically or on an application's request:
    1. Switches to the initializing state.
    2. Sends a collision message to its own unicast address in all its scopes.
    3. Starts listening for messages on:
        1. The broadcast address in all its scopes.
        2. The multicast addresses of all its groups in all its scopes.
        3. Its own unicast address in all its scopes.
    4. If the node has any dependencies, it:
        1. Sends ping message to the unicast addresses of all the required nodes in all its scopes.
        2. Waits until it has received a bonjour message from all the required nodes in any of its scopes.
  3. When the initializing node has received a bye message from any of the required nodes in any of its scopes, the node:
    1. Needs to wait for another bonjour message from the sender in any of its scopes.
  4. When the initializing node has received a bonjour message from all the required nodes in any of its scopes, the node:
    1. Switches to the Initialized state.
    2. Sends a bonjour message to the broadcast address in all its scopes.
    3. Only now may the node send and receive application data.
  5. When the initialized node has received a bye message from any of the required nodes in any of its scopes, the node:
    1. Sends a bye message to the broadcast address in all its scopes.
    2. Switches back to the initializing state and waits for a bonjour message from the required node in any of its scopes.
    3. If the node operates in multiple scopes, it sends a ping message to the unicast addresses of all the remaining required nodes in all its scopes.
  6. When the initialized node has received a ping message in any scope, the node:
    1. Sends a bonjour message to the sender's unicast address in the given scope.
  7. When the applications destroys the initializing or initialized node, or the node has received a collision message in any scope, it:
    1. Sends a bye message to the broadcast address in all its scopes.
    2. Switches to the uninitialized state for the purpose of notifying the application.
    3. Switches to the destroyed state.
    4. Stops listening for any messages in all its scopes.
  8. When the initializing or initialized  in any scope, the node:

## Applications ##

A node notifies the application of the changes of its states. The application can perform any of the following actions with the node:

  1. *Listen for incoming data* -- The initialized node notifies the application of data in the incoming data messages.
  2. *Send data* -- The initialized node sends a data message containing the given data to the given address.
  3. *Initialize the node* -- The uninitalized node initializes itself.
  4. *Destroy the node* -- The non-destroyed node destroys itself.
  
### Data ###

Data are encapsulated in the `data` field of data messages and have the following format:

    {
      name: ... ,
      payload: ...
    }

The `name` field contains the name of the data and the `payload` field contains the data itself. Both the `name` and `payload` fields are optional. When defined, the name should be a fully qualified domain name to prevent collisions. This rule can be relaxed for nodes, which only operate in anonymous private scopes.
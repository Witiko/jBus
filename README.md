# jBus #

## Introduction ##

In standard modern web applications, client-side scripts are either standalone, or tightly coupled with one another. Browser extensions and Greasemonkey userscripts, on the other hand, are running in a sandbox beneath an artificial `window` object and can only be loosely coupled via message-passing by sending custom DOM events, or by using [proprietary APIs][Chrome cross-extension messaging API].

The problem is that tight coupling is often undesirable, proprietary APIs are non-portable and custom events are a very crude means of communication prone to misconfiguration and event name collisions. jBus, on the other hand, is a cross-extension messaging architecture designed with the prevention of naming collisions in mind, which features a simple but expressive API and which enables loose coupling between any two pieces of JavaScript code sharing as little as a DOM [event target][EventTarget].

  [Chrome cross-extension messaging API]: https://developer.chrome.com/extensions/messaging#external "Message Passing - Google Chrome"
  [EventTarget]: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget "DOM 2 Events Specification"

## Documentation ##

  * [Architecture](docs/architecture.md) and [API](docs/api.md)
  * [Example userscripts](docs/examples.md)
  * [An example web application](docs/webchat.md)

## Compatibility ##

jBus is compatible with any browser, which supports [ECMAScript 3+][ECMA-262 3rd edition] including the extensions described in the [WHATWG JavaScript specification][ECMAScript web extensions], the `window.document` object as described in the [WHATWG HTML specification][Window interface specification], DOM 2 Events as described in the [DOM 2 Events W3C recommendation][DOM 2 Events] and the [`CustomEvent`][CustomEvent] interface as described in the [DOM 3 Events W3C working draft][DOM 3 Events]. The list includes:
  
  * Opera 11+
  * Mozilla/Firefox 6+
  * Internet Explorer 9+
  * Webkit 533.3+
    * Safari 5.1+
    * Chrome

[CustomEvent]: http://www.w3.org/TR/DOM-Level-3-Events/#interface-CustomEvent "DOM 3 Events Specification"
[Window interface specification]: http://www.whatwg.org/specs/web-apps/current-work/multipage/browsers.html#the-window-object "HTML Standard"
[DOM 2 Events]: http://www.w3.org/TR/DOM-Level-2-Events/ "DOM 2 Events Specification"
[DOM 3 Events]: http://www.w3.org/TR/DOM-Level-3-Events/ "DOM 3 Events Specification"
[ECMA-262 3rd edition]: http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf "ECMAScript Language Specification"
[ECMAScript web extensions]: http://javascript.spec.whatwg.org/ "JavaScript, aka. Web ECMAScript"

## Compilation ##

### Assembly ###

The assembly of the jBus source files requires a [POSIX.2][]-compliant environment. To begin the assembly, run the `make build` command in the uppermost folder of the project. At the end of the process, the following files will be present in the `build` folder:

  * `jBus.js` -- A static build of jBus, which defines:
    * The `JBus.Node` object constructor.
    * The `JBus.Scope` object constructor and method.
  * `jBus.debug.js` -- A static build of jBus, which defines:
    * Logs any outgoing messages to the console.
    * Defines:
        * The `JBus.Node` object constructor.
        * The `JBus.Scope` object constructor and method.
        * The `JBus.Node.messages.*` object constructors.
        * The `JBus.Node.services.*` methods.

[POSIX.2]: http://pubs.opengroup.org/onlinepubs/009695399/ "The Open Group Base Specifications Issue 6"

### Minification ###

The minification of the jBus source files requires the `closure-compiler` binary of the [Closure Compiler by Google][] to be executable and to reside within one of the directories in the `PATH` environment variable. To begin the minification, run the `make min` command in the uppermost folder of the project. At the end of the process, the following files will be present in the `build` folder:

  * `jBus.min.js` -- A static and minified build of jBus, which defines:
    * The `JBus.Node` object constructor.
    * The `JBus.Scope` object constructor and method.
  * `jBus.min.debug.js` -- A static and minified build of jBus, which:
    * Logs any outgoing messages to the console.
    * Defines:
        * The `JBus.Node` object constructor.
        * The `JBus.Scope` object constructor and method.
        * The `JBus.Node.messages.*` object constructors.
        * The `JBus.Node.services.*` methods.

The latest minified jBus builds are also available online:

  * [`jBus.min.js`](http://tiny.cc/jBus)
  * [`jBus.debug.min.js`](http://tiny.cc/jBusDebug)

Alternatively, you can use any other minification tool or service, as long as the license notice is kept intact.
  
  [Closure Compiler by Google]: https://developers.google.com/closure/compiler/ "Closure Tools -- Google Developers"

## Installation ##

### Userscripts ###

#### Dynamic loading ####

If you wish to dynamically load the latest version of jBus into your userscript, use the [`@require` metadata key][Greasemonkey @require] as follows:

```js
// ==UserScript==
// ...
// @require http://tiny.cc/jBus
// ...
// ==/UserScript==
```

  [Greasemonkey @require]: http://wiki.greasespot.net/Metadata_Block#.40require "Metadata Block - GreaseSpot Wiki"

#### Static embedding ####

If you wish to statically embed jBus into your userscript, include the contents of the jBus build you wish to use directly into your userscript. Make sure you include it before any calls to the library.

#### Best practice ####

If you prefer to dynamically load the latest version of jBus into your userscript, but you want to include a static fallback, then the best practice is the following:

  1. Use the `@require` metadata key to attempt to load the latest version of jBus into your userscript.
  2. Include the contents of the jBus build you wish to use directly into your userscript with the following modification:
    * Replace the initial `var JBus = ` with `var JBus; if(!JBus) JBus = `.

This will allow users, whose script managers don't support the `@require` metadata key, to fall back on the statically embedded jBus library.

### Web pages ###

To be able to use jBus on your web page, input the following code in either the head or the body of the webpage. Make sure you include it before any scripts that use the library:

```html
<script src="jBus.js"></script>
```

Replace `jBus.js` with a pathname to the jBus build you wish to use.

## Unit testing ##

By loading the `src/test.html` file in your browser, you can run a suite of tests against the `src/jBus.js` and `src/framework.js` files. You can use this to check, whether:

  * jBus is compatible with a given browser.
  * Your modified version of jBus works as intended.

If the you only want to check browser compatibility, [the online version](https://dl.dropboxusercontent.com/u/48267088/JBus/test/test.html) of the test suite may be a more convenient route for you.

## FAQ ##

  1. _Isn't this essentially what [custom events][CustomEvent] are for?_
    
    It is. jBus is an [architecture](docs/architecture.md) built on top of custom events, which also allows for [scoping](docs/examples.md#scoping), [dependencies](docs/examples.md#dependencies) and [unicast + multicast messaging](docs/architecture.md#addresses). If global broadcasting of events is all you need, you can equally well use [custom events][CustomEvent] directly.

  2. _Isn't this essentially what [storage events][] are for?_
    
    Not quite. While it is true that you can store data in the [`localStorage`][localStorage] and [`sessionStorage`][sessionStorage] objects and any listener will be notified about your changes, you can only store textual data, whereas a [custom events][CustomEvent]-based architecture (such as jBus) allows you to pass around any kind of data including functions along with their [scope chain][Multiply-nested functions], which doesn't survive serialization to string.

    By the same token, [storage events][] *do* offer functionality, which cannot be achieved using [custom events][CustomEvent]. Since the [`localStorage`][localStorage] object is specific to a protocol and a domain (hereinafter an origin), any change to the object will emit a [storage event][storage events] in any open window / iframe containing the [`localStorage`][localStorage] object of the given origin other than the event  dispatcher.

    This allows for functionality such as pausing music playback in all windows other than the current one (as implemented by [soundcloud.com](http://soundcloud.com)). By contrast, a [custom events][CustomEvent]-based architecture (such as jBus) only allows for event dispatchment within the original window and other windows and iframes, to which there is a reference.

    It should now be clear that [custom events][CustomEvent]-based architectures (such as jBus) and [storage events][]-based architectures (such as [ding][]) each offer capabilities, which are mutually complementary, rather than one being a subset of the other.

[localStorage]: http://www.w3.org/TR/webstorage/#the-localstorage-attribute "Web Storage"
[sessionStorage]: http://www.w3.org/TR/webstorage/#the-sessionstorage-attribute "Web Storage"
[Storage Events]: http://www.w3.org/TR/webstorage/#the-storage-event "Web Storage"
[Multiply-nested functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#Multiply-nested_functions "Functions and function scope - JavaScript | MDN"
[ding]: https://github.com/witiko/ding "Witiko/ding"

## License (MIT) ##

Copyright (c) 2014 Vít Novotný

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
api
===

Collection of utilities for API development

API
===

multiplex(func)
---------------

convert `function (a, b, c...)` into `function([a], b, c...)`

each item in the 1st argument array is passed with the rest of the
arguments to the original function

while iterating, if the original function returns something, it will
break the iteration and the value is propagated as return value of the
multiplexed function

if the 1st argument is not an array it is converted to a new one containing
the argument as single item

if the 1st argument is `undefined` the multiplexed function returns nothing
and avoids the iteration

if the 1st argument is an empty array the multiplexed function returns nothing
and avoids the iteration

chain(api, partials...)
-----------------------

converts a collection of functions into a chainable api

if a function in the collection returns nothing the collection is returned
instead

if a function in the collection returns something the chain is broken

plug(socket, plugins)
---------------------

creates a plugabble api

plugins are chainable and multiplexed

with null data from the socket the plugins are not called but they keep
returning the chain preventing `TypeError` exceptions

```js
dom('#nonexistent').foo().bar().qux();
```

Assuming `foo`, `bar` and `qux` are loaded plugins, the previous code does
nothing but don't crash

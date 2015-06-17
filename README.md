[![Build Status](https://travis-ci.org/rvdkooy/react-testutils-additions.svg?branch=master)](https://travis-ci.org/rvdkooy/react-testutils-additions)
# react-testutils-additions
A module that will extend the default react testutils with extra helpers that will make life easier when testing your react components.

####Features


##### Standard helpers from React Testutils 
The module contains all the existing helper functions that come with [React Testutils](https://facebook.github.io/react/docs/test-utils.html), so you can always fall back to the existing React API to test your components.
``` Javascript
var testUtilsAdditions = require("react-testutils-additions");

var component = testUtilsAdditions.renderIntoDocument(<Component />);
testUtilsAdditions.findRenderedDOMComponentWithClass(component, "myclassname");

```


##### Find API
By using the default React TestUtils API, finding components can be quite verbose, therefore I created a simpler API based on basic CSS selectors to find you components:

``` Javascript
var testUtilsAdditions = require("react-testutils-additions");

var component = testUtilsAdditions.renderIntoDocument(<Component />);

// If you want to find a component based their tag:
testUtilsAdditions.find(component, "div");

// If you want to find a component by their classname:
testUtilsAdditions.find(component, ".myclass");

// If you want to find a component by it's id:
testUtilsAdditions.find(component, "#myid");

// You can even combine the selectors, just like you do with CSS
testUtilsAdditions.find(component, "#myid div .myclassname");

// If you want to find one component by its classname:
testUtilsAdditions.findOne(component, ".myclass"); // If more is found, this will throw!
```


##### findRenderedDOMComponentWithId
The default React Testutils don't support finding components based on its Id, so I extended the TestUtils with a helper for that.

``` Javascript
var testUtilsAdditions = require("react-testutils-additions");

var component = testUtilsAdditions.renderIntoDocument(<Component />);
testUtilsAdditions.findRenderedDOMComponentWithId(component, "myid");

```
There is no scry helper for it, because an Id should always be unique per document.


##### scryRenderedDOMComponentsWithAttributeValue
To look for components based a value of an attribute, use the scryRenderedDOMComponentsWithAttributeValue helper.

``` Javascript
var testUtilsAdditions = require("react-testutils-additions");

var component = testUtilsAdditions.renderIntoDocument(<Component />);
testUtilsAdditions.scryRenderedDOMComponentsWithAttributeValue(component, "role" "myrole");

```

##### unMountFromDocument
React TestUtils comes with a helper to render a component into a document (it actually does not render it into a document, but ok...).
If you want to clean up your tests, use the unMountFromDocument helper:

``` Javascript
var testUtilsAdditions = require("react-testutils-additions");

var component = testUtilsAdditions.renderIntoDocument(<Component />);
testUtilsAdditions.unMountFromDocument(component); // this will remove the component, and call the componentWillUnmount function of your component.
```

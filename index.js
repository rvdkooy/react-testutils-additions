"use strict";
var React = require("react/addons");
var ReactTestUtils = React.addons.TestUtils;
var utils = require('./utils');
var RTA = ReactTestUtils;
var objectAssign = require('object-assign');
var testContainerId = "react-test-additions-testcontainer";

RTA.find = function(root, selector){
    var children = selector.split(" ");
    var lastFound = null;

    for (var i = 0; i < children.length; i++) {

        if(root.length > 0){
            lastFound = [];
            for (var j = 0; j < root.length; j++) {
                lastFound = lastFound.concat(find(root[j], children[i]));
            }
        }
        else {
            lastFound = find(root, children[i]);
        }
        
        root = lastFound;
    }

    return lastFound;
};

function findBasedOnCombinedSelectors(root, combinedSelectors, origSelector) {
    var foundElements = [];

    combinedSelectors.forEach(function(cs) {
        foundElements = foundElements.concat(find(root, cs));
    });
    
    for (var i = 0; i < foundElements.length; i++) {
        if(utils.elementContainsAllSelectors(foundElements[i], combinedSelectors)) {
            return foundElements[i];
        }
    }
    
    throw new Error("Did not find an element based on the selector: " + origSelector);
}

function find(root, selector){

    var combinedSelectors = utils.getCombinedSelectors(selector);
    
    if(combinedSelectors.length > 1) {
        return findBasedOnCombinedSelectors(root, combinedSelectors, selector);
    }

    if(selector.indexOf(".") === 0){ // class selector
        var className = selector.substring(1, selector.length);
        return ReactTestUtils.scryRenderedDOMComponentsWithClass(root, className);
    }
    else if (selector.indexOf("#") === 0 ) { // Id selector
        var id = selector.substring(1, selector.length);
        return ReactTestUtils.findRenderedDOMComponentWithId(root, id);
    }
    else if(selector.length) { // tag selector
        return ReactTestUtils.scryRenderedDOMComponentsWithTag(root, selector);
    }
}

RTA.findOne = function(root, selector){
    var result = this.find(root, selector);

    if(!result){
        throw new Error("find one failed, found: 0");
    } else if(result.length !== undefined && result.length !== 1){
        throw new Error("find one failed, found: " + result.length);
    }

    if(result.length){
        return	result[0];
    }

    return result;
};

RTA.scryRenderedDOMComponentsWithAttributeValue = function(root, propName, propValue) {
    return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
        return ReactTestUtils.isDOMComponent(inst) &&
        inst.props.hasOwnProperty(propName) &&
        inst.props[propName] === propValue;});
};

RTA.findRenderedDOMComponentWithAttributeValue = function(root, propName, propValue) {
    var all = this.scryRenderedDOMComponentsWithAttributeValue(root, propName, propValue);
    if (all.length !== 1) {
        throw new Error('Did not find exactly one match for attribute ' + propName + ' with value ' + propValue);
    }
    
    return all[0];
};

RTA.findRenderedDOMComponentWithId = function(root, propValue) {
    var all = this.scryRenderedDOMComponentsWithAttributeValue(root, "id", propValue);
    
    if (all.length !== 1) {
        throw new Error('Did not find exactly one match for id:' + propValue);
    }
    
    return all[0];
};

RTA.unMountFromDocument = function(root){
    React.unmountComponentAtNode(React.findDOMNode(root).parentNode);
};

RTA.renderIntoTestContainer = function(instance) {
    var TestContainer = React.createClass({
        updateProps: function(props) {
            this.copiedProps = objectAssign(this.copiedProps, props);
            this.forceUpdate();
        },
        componentWillMount: function() {
            this.copiedProps = instance.props;
        },
        render: function() {
            var clonedElement = React.cloneElement(instance, this.copiedProps);
            return React.createElement('div', { id: testContainerId }, clonedElement); 
        }
    });
    
    return ReactTestUtils.renderIntoDocument(React.createElement(TestContainer));
};

module.exports = RTA;
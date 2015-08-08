"use strict";
var React = require("react/addons");
var ReactTestUtils = React.addons.TestUtils;

var RTA = ReactTestUtils;

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

function find(root, selector){

    var combinedSelectors = getCombinedSelectors(selector);
    
    if(combinedSelectors.length > 1) {
        
        var foundElements = [];

        combinedSelectors.forEach(function(cs) {
            foundElements = foundElements.concat(find(root, cs));
        });
        
        for (var i = 0; i < foundElements.length; i++) {
            if(elementContainsAllSelectors(foundElements[i], combinedSelectors)) {
                return foundElements[i];
            }
        }
        
        throw new Error("Did not find an element based on the selector: " + selector);
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

function elementContainsAllSelectors(element, selectors) {
    var domElement = React.findDOMNode(element);

    for (var i = 0; i < selectors.length; i++) {
        var selector = selectors[i];
        var selectorFound = false;

        if(selector.indexOf(".") === 0) {
            var className = selector.substring(1, selector.length);
            if(domElement.className.indexOf(className) > -1) selectorFound = true;
        } else if(selector.indexOf("#") === 0) {
            var id = selector.substring(1, selector.length);
            if(domElement.id === id) selectorFound = true;
        }
        else if(selector.length) {
            if(domElement.tagName === selector.toUpperCase()) selectorFound = true;
        }

        if(!selectorFound){
            return false;
        }
    }

    return true;
}

// this function will return all the segments in a CSS "AND" operator
// example: div#id.myclassname
function getCombinedSelectors(selector) {
    var result = [], string = "", splitterValues = [".", "#"], index = 0;
    
    function containsSplitterValue(char) {
        var result = false;
        splitterValues.forEach(function(x) {
            if(x === char) result = true;
        });
        return result;
    }   

    selector.split('').forEach(function(c) {
            
        if(containsSplitterValue(c)) {
            
            if(string.length) {
                result.push(string);
                string = c;
            } else {
                string += c;
            }
        } else {
            string += c;
        }

        if(index === selector.length -1) result.push(string);
            
        index++;
    });

    return result;
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

module.exports = RTA;
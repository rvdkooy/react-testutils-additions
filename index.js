"use strict";
var React = require("react/addons");
var ReactTestUtils = React.addons.TestUtils;

var RTA = ReactTestUtils;

RTA.find = function(root, selector){
	var segments = selector.split(" ");

	var lastFound = null;
	
	for (var i = 0; i < segments.length; i++) {

		if(root.length > 0){
			lastFound = [];
			
			for (var j = 0; j < root.length; j++) {
				lastFound = lastFound.concat(find(root[j], segments[i]));
			}
		}
		else{
			lastFound = find(root, segments[i]);
			root = lastFound;
		}
	}

	return lastFound;
};

function find(root, selector){
	
	if(selector.indexOf(".") === 0){ // class selector
		var className = selector.substring(1, selector.length); // remove the .
		return ReactTestUtils.scryRenderedDOMComponentsWithClass(root, className);
	}
	else if(selector.indexOf("#") === 0 ){ // Id selector
		var id = selector.substring(1, selector.length); // remove the #
		return ReactTestUtils.findRenderedDOMComponentWithId(root, id);
	}
	else if(selector.length){ // tag selector
		return ReactTestUtils.scryRenderedDOMComponentsWithTag(root, selector);
	}
}

RTA.scryRenderedDOMComponentsWithAttributeValue = function(root, propName, propValue) {
    return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
        return ReactTestUtils.isDOMComponent(inst) &&
                inst.props.hasOwnProperty(propName) &&
                inst.props[propName] === propValue;});
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
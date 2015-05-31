"use strict";
var ReactTestUtils = require("react/addons").addons.TestUtils;
var objectAssign = require('object-assign');
var RTE = function(){

};

RTE.prototype.find = function(){
	return "some result";
};


RTE.prototype.scryRenderedDOMComponentsWithId = function(root, propValue) {
    return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
        return ReactTestUtils.isDOMComponent(inst) &&
                inst.props.id &&
                inst.props.id === propValue;});
};

RTE.prototype.findRenderedDOMComponentWithId = function(root, propValue) {
    var all = this.scryRenderedDOMComponentsWithId(root, propValue);
    if (all.length !== 1) {
        throw new Error('Did not find exactly one match for id:' + propValue);
    }
    return all[0];
};



module.exports = objectAssign(new RTE(), ReactTestUtils);
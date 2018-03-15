var React = require('react');
var ReactTestUtils = require("react-dom/test-utils");
var ReactDOM = require('react-dom');
var RTA = ReactTestUtils;
var sizzle = require("sizzle");
var objectAssign = require('object-assign');
var testContainerId = "react-test-additions-testcontainer";
var createReactClass = require('create-react-class');

RTA.findDOMNode = function(root){
    return ReactDOM.findDOMNode(root);
};

RTA.find = function(root, selector){
    // react always renders the root component in a parent DIV,
    // so using the parentNode should work in most cases
    var domInstance = ReactDOM.findDOMNode(root);
    
    // except when you return null in the render function
    if (!domInstance) {
        throw new Error('Failed to find "' + selector + '", cannot find a dom node for the component');
    }

    var result = sizzle(selector, domInstance.parentNode);
    return result;
};

RTA.findOne = function(root, selector){
    var result = this.find(root, selector);

    if(!result){
        throw new Error("find one failed for '" + selector + "' (found: 0" + ")");
    } else if(result.length !== undefined && result.length !== 1){
        throw new Error("find one failed for '" + selector + "' (found: " + result.length + ")");
    }

    if(result.length){
        return result[0];
    }

    return result;
};

RTA.scryRenderedDOMComponentsWithAttributeValue = function(root, propName, propValue) {
    return ReactTestUtils.findAllInRenderedTree(root, function(inst) {
        return ReactTestUtils.isDOMComponent(inst) && ReactDOM.findDOMNode(inst).getAttribute(propName) === propValue;
    });
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

RTA.unmountFromDocument = function(root) {
    var element = ReactDOM.findDOMNode(root);
    if (!element) {
        throw new Error('Failed to unmount from document, cannot find a dom node for the component.');
    }
    ReactDOM.unmountComponentAtNode(element.parentNode);
};

RTA.renderIntoTestContainer = function(instance) {
    var TestContainer = createReactClass({
        updateProps: function(props) {
            this.copiedProps = objectAssign(this.copiedProps, props);
            this.forceUpdate();
        },
        copyProps: function(props) {
            var newProps = {};
            for(var prop in props) {
                newProps[prop] = props[prop];
            }
            return newProps;
        },
        componentWillMount: function() {
            this.copiedProps = this.copyProps(instance.props);
        },
        render: function() {
            var clonedElement = React.cloneElement(instance, this.copiedProps);
            return React.createElement('div', { id: testContainerId }, clonedElement);
        }
    });

    return ReactTestUtils.renderIntoDocument(React.createElement(TestContainer));
};

module.exports = RTA;

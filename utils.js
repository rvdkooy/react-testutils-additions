var ReactDOM = require('react-dom');

// this function will return all the segments in a CSS "AND" operator
// example: div#id.myclassname
module.exports.getCombinedSelectors = function(selector) {
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
};

// this function will test if an html element contains all css selectors
module.exports.elementContainsAllSelectors = function(element, selectors) {
	var domElement = ReactDOM.findDOMNode(element);

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
var React = require('react');
var rte = require('../index.js');

describe("react-testutils-extended tests", function(){

	it("should expose all the default react testutil props and methods", function(){
		
		expect(rte.renderIntoDocument).toBeDefined();
		
		expect(rte.findRenderedComponentWithType).toBeDefined();
		expect(rte.findRenderedDOMComponentWithClass).toBeDefined();
		expect(rte.findRenderedDOMComponentWithTag).toBeDefined();
		
		expect(rte.scryRenderedComponentsWithType).toBeDefined();
		expect(rte.scryRenderedDOMComponentsWithClass).toBeDefined();
		expect(rte.scryRenderedDOMComponentsWithTag).toBeDefined();
		
		expect(rte.Simulate ).toBeDefined();
		// and more...
	});

	it("should be able to find a component by its id", function(){
		var Component = React.createClass({
			render: function(){ return (<div id="findme"></div>); }
		});

		var doc = rte.renderIntoDocument(<Component />);
		var findResult = rte.findRenderedDOMComponentWithId(doc, "findme");

		expect(findResult).toBeDefined();
	});

	it("should be able to scry for components by its id", function(){
		var Component = React.createClass({
			render: function(){ return (<div id="findme"></div>); }
		});

		var doc = rte.renderIntoDocument(<Component />);
		var findResult = rte.scryRenderedDOMComponentsWithId(doc, "findme");

		expect(findResult.length).toBe(1);
	});
});
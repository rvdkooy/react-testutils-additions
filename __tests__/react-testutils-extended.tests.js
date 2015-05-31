var React = require('react');
var TestUtils = require('../index.js');

describe("react-testutils-additions tests", function(){

	it("it should expose all the default react testutil props and methods", function(){
		
		expect(TestUtils.renderIntoDocument).toBeDefined();
		
		expect(TestUtils.findRenderedComponentWithType).toBeDefined();
		expect(TestUtils.findRenderedDOMComponentWithClass).toBeDefined();
		expect(TestUtils.findRenderedDOMComponentWithTag).toBeDefined();
		
		expect(TestUtils.scryRenderedComponentsWithType).toBeDefined();
		expect(TestUtils.scryRenderedDOMComponentsWithClass).toBeDefined();
		expect(TestUtils.scryRenderedDOMComponentsWithTag).toBeDefined();
		
		expect(TestUtils.Simulate).toBeDefined();
		// and more...
	});

	describe("scry and find helpers", function(){

		it("it should be able to find a component by its id", function(){
			var Component = React.createClass({
				render: function(){ return (<div id="findme"></div>); }
			});

			var doc = TestUtils.renderIntoDocument(<Component />);
			var result = TestUtils.findRenderedDOMComponentWithId(doc, "findme");

			expect(result).toBeDefined();
		});

		it("it should be able to scry for components by their attributes values", function(){
			var Component = React.createClass({
				render: function(){ return (<div role="somevalue"></div>); }
			});

			var doc = TestUtils.renderIntoDocument(<Component />);
			
			var result = TestUtils.scryRenderedDOMComponentsWithAttributeValue(doc, "role", "somevalue");

			expect(result.length).toBe(1);
		})	
	});

		
	it("it should be able to find components with a class selector", function(){
		var Component = React.createClass({
			render: function(){ return (<div className="myclass"></div>); }
		});

		var doc = TestUtils.renderIntoDocument(<Component />);
		
		var result = TestUtils.find(doc, ".myclass");

		expect(result.length).toBe(1);
		expect(React.findDOMNode(result[0]).className).toBe("myclass");
	});

	it("it should be able to find a component with an id selector", function(){
		var Component = React.createClass({
			render: function(){ return (<div id="myid"></div>); }
		});

		var doc = TestUtils.renderIntoDocument(<Component />);
		
		var result = TestUtils.find(doc, "#myid");

		expect(result).toBeDefined();
		expect(React.findDOMNode(result).id).toBe("myid");
	});

	it("it should be able to find components with a tag selector", function(){
		var Component = React.createClass({
			render: function(){ return (<div><span>1</span><span>2</span></div>); }
		});

		var doc = TestUtils.renderIntoDocument(<Component />);
		
		var result = TestUtils.find(doc, "span");

		expect(result.length).toBe(2);
		expect(React.findDOMNode(result[0]).innerHTML).toBe("1");
		expect(React.findDOMNode(result[1]).innerHTML).toBe("2");
	});

	it("it should be able to find components with a combined selector", function(){
		var Component = React.createClass({
			render: function(){ 
				return (
					<div id="myid">
						<article>
							<span className="mytext">Lorem ipsum</span>
						</article>
					</div>); 
			}
		});

		var doc = TestUtils.renderIntoDocument(<Component />);
		
		var result = TestUtils.find(doc, "#myid article .mytext");

		expect(result.length).toBe(1);
		expect(React.findDOMNode(result[0]).innerHTML).toBe("Lorem ipsum");
	});

	it("it should return an empty array when a component by tag could not be found", function(){
		var Component = React.createClass({
			render: function(){ 
				return (
					<div id="myid">
						<article></article>
					</div>); 
			}
		});

		var doc = TestUtils.renderIntoDocument(<Component />);
		
		var result = TestUtils.find(doc, "#myid span");

		expect(result.length).toBe(0);
	});

	it("it should throw an error when a component by its id could not be found", function(){
		var Component = React.createClass({
			render: function(){ 
				return (
					<div id="myid">
						<div id="myseconddiv"></div>
					</div>); 
			}
		});

		var doc = TestUtils.renderIntoDocument(<Component />);
		
		var findAction = function(){
			TestUtils.find(doc, "#myid #myseconddivwithtypo")
		};

		expect(findAction).toThrow();
	});	
});
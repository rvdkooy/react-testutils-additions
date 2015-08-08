var React = require('react');
var TestUtils = require('../index.js');

describe("react-testutils-additions tests", function(){

	describe("default react testutils helpers", function(){

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

		it("it should unmount a component when calling the unMountFromDocument func", function(){
			var wasUnmounted = false;

			var Component = React.createClass({
				componentWillUnmount: function(){ wasUnmounted = true; },
				render: function(){ return (<div></div>); }
			});

			var doc = TestUtils.renderIntoDocument(<Component />);
			TestUtils.unMountFromDocument(doc);

			expect(wasUnmounted).toBe(true);
		});
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

	it("it should be able to find nested components with a selector", function(){
		var Component = React.createClass({
			render: function(){
				return (
					<div id="myid">
						<ul>
							<li className="active">
								<button>active</button>
							</li>
							<li className="notactive">
								<button>notactive</button>
							</li>
						</ul>
					</div>);
			}
		});

		var doc = TestUtils.renderIntoDocument(<Component />);

		var result = TestUtils.find(doc, "#myid .active button");

		expect(result.length).toBe(1);
		expect(React.findDOMNode(result[0]).innerHTML).toBe("active");
	});

	it("it should be able to find multiple nested components with a selector", function(){
		var Component = React.createClass({
			render: function(){
				return (
					<div id="myid">
						<article>
							<span className="mytext">Lorem ipsum 1</span>
						</article>
						<article>
							<span className="mytext">Lorem ipsum 2</span>
						</article>
					</div>);
			}
		});

		var doc = TestUtils.renderIntoDocument(<Component />);

		var result = TestUtils.find(doc, "#myid article .mytext");

		expect(result.length).toBe(2);
		expect(React.findDOMNode(result[0]).innerHTML).toBe("Lorem ipsum 1");
		expect(React.findDOMNode(result[1]).innerHTML).toBe("Lorem ipsum 2");
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

	it("it should be able to findone when there is only one", function(){
		var Component = React.createClass({
			render: function(){ return (<div className="myclass"><div id="myid"></div></div>); }
		});

		var doc = TestUtils.renderIntoDocument(<Component />);

		var classResult = TestUtils.findOne(doc, ".myclass");
		var idResult = TestUtils.findOne(doc, "#myid");

		expect(React.findDOMNode(classResult).className).toBe("myclass");
		expect(React.findDOMNode(idResult).id).toBe("myid");
	});

	it("it should throw when findOne finds more than one", function(){
		var Component = React.createClass({
			render: function(){ return (<div>
											<span className="myclass"></span>
											<span className="myclass"></span>
										</div>); }
		});

		var doc = TestUtils.renderIntoDocument(<Component />);

		var findAction = function(){
			TestUtils.findOne(doc, ".myclass");
		};

		expect(findAction).toThrow();
	});

	it("it should throw when findOne does not find anything", function(){
		var Component = React.createClass({
			render: function(){ return (<div></div>); }
		});

		var doc = TestUtils.renderIntoDocument(<Component />);

		var findAction = function(){
			TestUtils.findOne(doc, ".myclass");
		};

		expect(findAction).toThrow();
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

	it("should be able to find components with multiple classes on the same element", function() {
		var Component = React.createClass({
			render: function(){
				return (
					<div id="myid">
						<ul>
							<li className="item active">
								<button>active</button>
							</li>
							<li className="item not-active">
								<button>notactive</button>
							</li>
						</ul>
					</div>);
			}
		});

		var doc = TestUtils.renderIntoDocument(<Component />);

		var result = TestUtils.find(doc, "#myid .item.active button");

		expect(result.length).toBe(1);
		expect(React.findDOMNode(result[0]).innerHTML).toBe("active");
	});
});
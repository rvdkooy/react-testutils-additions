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

			var RenderedComponent = TestUtils.renderIntoDocument(<Component />);
			TestUtils.unMountFromDocument(RenderedComponent);

			expect(wasUnmounted).toBe(true);
		});
	});

	describe("scry and find helpers", function(){

		it("it should be able to find a component by its id", function(){
			var Component = React.createClass({
				render: function(){ return (<div id="findme"></div>); }
			});

			var RenderedComponent = TestUtils.renderIntoDocument(<Component />);
			var result = TestUtils.findRenderedDOMComponentWithId(RenderedComponent, "findme");

			expect(result).toBeDefined();
			expect(React.findDOMNode(result).id).toBe("findme");
		});

		it("it should be able to scry for components by their attributes values", function(){
			var Component = React.createClass({
				render: function(){ return (<div role="somevalue"></div>); }
			});

			var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

			var result = TestUtils.scryRenderedDOMComponentsWithAttributeValue(RenderedComponent, "role", "somevalue");

			expect(result.length).toBe(1);
			expect(React.findDOMNode(result[0]).getAttribute("role")).toBe("somevalue");
		});

		it("it should be able to find a component by its attribute value", function(){
			var Component = React.createClass({
				render: function(){ return (<div role="somevalue"></div>); }
			});

			var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

			var result = TestUtils.findRenderedDOMComponentWithAttributeValue(RenderedComponent, "role", "somevalue");

			expect(result).toBeDefined();
			expect(React.findDOMNode(result).getAttribute("role")).toBe("somevalue");
		});
	});

	it("it should be able to find components with a class selector", function(){
		var Component = React.createClass({
			render: function(){ return (<div className="myclass"></div>); }
		});

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var result = TestUtils.find(RenderedComponent, ".myclass");

		expect(result.length).toBe(1);
		expect(React.findDOMNode(result[0]).className).toBe("myclass");
	});

	it("it should be able to find a component with an id selector", function(){
		var Component = React.createClass({
			render: function(){ return (<div id="myid"></div>); }
		});

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var result = TestUtils.find(RenderedComponent, "#myid");

		expect(result).toBeDefined();
		expect(React.findDOMNode(result).id).toBe("myid");
	});

	it("it should be able to find components with a tag selector", function(){
		var Component = React.createClass({
			render: function(){ return (<div><span>1</span><span>2</span></div>); }
		});

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var result = TestUtils.find(RenderedComponent, "span");

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

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var result = TestUtils.find(RenderedComponent, "#myid .active button");

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

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var result = TestUtils.find(RenderedComponent, "#myid article .mytext");

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

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var result = TestUtils.find(RenderedComponent, "#myid span");

		expect(result.length).toBe(0);
	});

	it("it should be able to findone when there is only one", function(){
		var Component = React.createClass({
			render: function(){ return (<div className="myclass"><div id="myid"></div></div>); }
		});

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var classResult = TestUtils.findOne(RenderedComponent, ".myclass");
		var idResult = TestUtils.findOne(RenderedComponent, "#myid");

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

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var findAction = function(){
			TestUtils.findOne(RenderedComponent, ".myclass");
		};

		expect(findAction).toThrow();
	});

	it("it should throw when findOne does not find anything", function(){
		var Component = React.createClass({
			render: function(){ return (<div></div>); }
		});

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var findAction = function(){
			TestUtils.findOne(RenderedComponent, ".myclass");
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

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var findAction = function(){
			TestUtils.find(RenderedComponent, "#myid #myseconddivwithtypo")
		};

		expect(findAction).toThrowError("Did not find exactly one match for id:myseconddivwithtypo");
	});

	it("should be able to find components with multiple selectors on the same element", function() {
		var Component = React.createClass({
			render: function(){
				return (
					<div id="myid">
						<ul>
							<li id="first" className="item active">
								<button>active</button>
							</li>
							<li id="second" className="item not-active">
								<button>notactive</button>
							</li>
						</ul>
					</div>);
			}
		});

		var RenderedComponent = TestUtils.renderIntoDocument(<Component />);

		var result = TestUtils.find(RenderedComponent, "#myid li#first.item.active button");

		expect(result.length).toBe(1);
		expect(React.findDOMNode(result[0]).innerHTML).toBe("active");
	});

	describe("Prop helpers", function(){

		var propUpdated = jasmine.createSpy(), updatedProps = {};

		it("it should be able to update the props by using the test container wrapper", function(){
			var Component = React.createClass({
				getDefaultProps: function () {
					return { foo: "foo", bar: "bar" }
				},
				componentWillReceiveProps: function(nextProps) {
					updatedProps = nextProps;
					propUpdated();
				},
				render: function(){ return (<div id="findme"></div>); }
			});

			var WrappedComponent = TestUtils.renderIntoTestContainer(<Component />);
			
			WrappedComponent.updateProps({ foo: "updatedfoo" });

			expect(propUpdated).toHaveBeenCalled();
			expect(updatedProps.foo).toBe("updatedfoo");
			expect(updatedProps.bar).toBe("bar");
		});
	});
});
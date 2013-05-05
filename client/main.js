Template.grapher.logged_in = function() {
	return Meteor.user();
}

Template.grapher.graph_selected = function() {
	return Session.get("current_graph");
}

Template.graphs_page.has_graphs = function() {
	return GraphsModel.find({}).count();
}

Template.graphs_page.graphs = function() {
	return GraphsModel.find({});
}

Template.graphs_page.events({
	"click #new_graph" : function() {
		Grapher.Graphs.create("New Graph (double click to rename)", Meteor.userId());
	},
	"dblclick .graph_title" : function() {
		var new_name = prompt("Please enter the new name", this.name);
		if(new_name) {
			Grapher.Graphs.rename(this._id, new_name);
		}
	},
	"click .delete_graph" : function() {
		if(confirm("Are you sure you want to remove '" + this.name + "'")) {
			Grapher.Graphs.delete(this._id);
		}
	},
	"click .open_graph" : function() {
		Grapher.Graphs.change_current(this);
	}
});

Template.nodes_page.graph_name = function() {
	var graph = Session.get("current_graph");
	return graph.name;
}

Template.nodes_page.events({
	"click #new_node" : function() {
		var graph = Session.get("current_graph");
        Grapher.Nodes.create("New Node", "blue", {x:250, y:250}, graph._id);
	},
	"click .remove_node" : function() {
		Grapher.Nodes.delete(this._id);
	},
	"dblclick .node_text" : function() {
		var text = prompt("Please enter the new text", this.text);
		if(text) {
			Grapher.Nodes.change_text(this._id, text);
		}
	},
	"click #go_back" : function() {
		Session.set("current_graph");
	},
	"click .node" : select_node,
	"click #relationships" : unselect_node,
	"click .color_box" : color_node,
	"mouseover .node" : drag_node,
	"click .node_border" : add_relationship,
	"mousemove #node_area" : draw_line,
	"dblclick .rel_line" : delete_relationship
});

function select_node() {
	Session.set("node_selected", this._id);
}

function unselect_node(e) {
	if(e.target.id == "relationships") {
		Session.set("node_selected");
	}
}

Template.node.selected = function() {
	if(Session.equals("node_selected", this._id)) {
		return "node_selected";
	}
	return "";
}

function color_node (e) {
	var color = $(e.target).attr("color");
	var node = Session.get("node_selected");
	if (color && node) {
		Grapher.Nodes.change_color(node, color);
	}
}

Template.node_section.nodes = function() {
	return NodesModel.find({});
}

function drag_node () {
	var height = $(window).height() - 10;
	var width = $(window).height() - 10;
	$("#" + this._id).draggable({
		handle: ".node_text",
		containment: [10, 190, width, height],
		stop: function(e, u) {
			var node_id = e.target.id;
			Grapher.Nodes.move(node_id, {
				x: u.offset.left,
				y: u.offset.top
			})
		},
		drag: node_moved
	});
}

function add_relationship (e) {
	if ($(e.target).hasClass("node_border")) {
		var node_a = Session.get("started_drag");
		if(!node_a) {
			Session.set("started_drag", this);
		} else {
			Grapher.Relationships.create(node_a._id, this._id);
			Session.set("started_drag");
			d3.select("#mouse_line").attr("stroke-width", 0);
			render_lines();
		}
	}
}

function draw_line (e) {
	var node = Session.get("started_drag");
	if(node) {
		var n = get_node_center($("#" + node._id));
		setup_line(d3.select("#mouse_line"), n, {
			x: e.pageX,
			y: e.pageY
		});
	}
}

function get_node_center (jquery_node) {
	return {
		x: (jquery_node.width() / 2) + jquery_node.offset().left,
		y: (jquery_node.height() / 2) + jquery_node.offset().top
	}
}

function setup_line(d3_line, p1, p2) {
	d3_line.attr("x1", p1.x)
		.attr("y1", p1.y)
		.attr("x2", p2.x)
		.attr("y2", p2.y)
		.attr("stroke-width", 5)
		.attr("stroke", "black");
}

function render_lines() {
	d3.select("#lines").remove();
	d3.select("#relationships").append("svg:svg").attr("id", "lines");
	RelationshipsModel.find({}).forEach(function(rel){
		var n1 = $("#" + rel.node_a);
		var n2 = $("#" + rel.node_b);
		if(n1.length && n2.length) {
			var line = d3.select("#lines").append("svg:line").attr("class", "rel_line").attr("rel_id", rel._id);
			setup_line(line, get_node_center(n1), get_node_center(n2));
		}
	});
}

Template.node_section.rendered = function() {
	var nodes = NodesModel.find({}).fetch();
	var node_ids = new Array();
	for(var k in nodes) {
		node_ids.push(nodes[k]._id);
	}
	Meteor.subscribe("relationships", node_ids, function() {
		render_lines();
	});
}

function delete_relationship (e) {
	Grapher.Relationships.delete($(e.target).attr("rel_id"));
}

function node_moved () {
	render_lines();
}
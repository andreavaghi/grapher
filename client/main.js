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
		Grapher.Graphs.create("New Graph (double click to rename", Meteor.userId());
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
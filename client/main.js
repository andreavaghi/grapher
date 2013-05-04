Template.grapher.logged_in = function() {
	return Meteor.user();
}

Template.grapher.graph_selected = function() {
	return Session.get("current_graph");
}
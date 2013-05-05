Meteor.subscribe("graphs");

Meteor.autorun(function(){
	if(Session.get("current_graph")) {
		Meteor.subscribe("nodes", Session.get("current_graph"));
	}
})
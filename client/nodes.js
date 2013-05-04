Grapher.Nodes = {
	create : function(text, color, position, graph){
		NodesModel.insert({
			"text" 		: text,
			"color" 	: color,
			"position" 	: position,
			"graph" 	: graph
		});
	},

	delete : function(node) {
		NodesModel.remove({ "_id" : node });
	},

	move : function(node, new_position) {
		NodesModel.update({ "_id" : node }, {
			$set : { "position" : new_position }
		});
	},

	change_text : function(node, new_text) {
		NodesModel.update({ "_id" : node }, {
			$set : { "text" : new_text }
		});
	},

	change_color : function(node, new_color) {
		NodesModel.update({ "_id" : node }, {
			$set : { "color" : new_color }
		});
	}
}
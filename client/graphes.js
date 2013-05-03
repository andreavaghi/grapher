Grapher.Graphs = {
    create : function(name, owner){
        GraphsModel.insert({
            “name”  : name,
            “owner” : owner
        }); 
    },
       
    rename : function(graph, new_name){
        GraphsModel.update({“_id” : graph},{
            $set : {“name” : new_name}
        });
    },
       
    delete : function(graph){
        GraphsModel.remove({“_id” : graph});
    },
       
    change_current : function(graph){
        Session.set(“current_graph”, graph);
    }
};
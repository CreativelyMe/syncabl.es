       GraphsModel = new Meteor.Collection("Graphs");
        NodesModel = new Meteor.Collection("Nodes");
RelationshipsModel = new Meteor.Collection("Relationships");

if(Meteor.isServer){
    GraphsModel.allow({
        'insert' : graph_user_match,
        'remove' : graph_user_match,
        'update' : graph_user_match
    });

    function graph_user_match(user, doc){
        if(doc.owner != user){
            return false;
        }
        return true;
    }

    NodesModel.allow({
        'insert' : node_user_match,
        'remove' : node_user_match,
        'update' : node_user_match
    });
	
    function node_user_match(user, doc){
        return graph_user_match(user, GraphsModel.findOne({_id: doc.graph}));
    }

    RelationshipsModel.allow({
        'insert' : rel_user_match,
        'remove' : rel_user_match,
        'update' : rel_user_match
    });
	
    function rel_user_match(user, doc){
        var node_a = node_user_match(user, NodesModel.findOne({_id: doc.node_a}));
        var node_b = node_user_match(user, NodesModel.findOne({_id: doc.node_b}));
        return (node_a && node_b);
    }

}
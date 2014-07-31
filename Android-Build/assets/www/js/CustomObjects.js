/**
 * Created by areynolds on 6/18/2014.
 */


var taskObject = function(){
    this.complete;
    this.listuid;
    this.assigner;
    this.assignee;
    this.description;
    this.title;
    this.state;
    this.boolUnassigned;
};

var party = {
    partyRoleCode: "" ,
    name : "" ,
    memberId : ""
};

var list = function(){
    this.taskList;
    this.name;
};
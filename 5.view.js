// CHAPTER 5
// Views and Templating

// Dynamically Rendering Views

var views = document.getElementById("views");
views.innerHTML = "";   // Empty the element

var container = document.createElement("div");
container.id = "user";

var name = document.createElement("span");
//name.innerHTML = data.name;

//container.appendChild(name);
views.appendChild(container);

// jQuery를 이용한 방법
$("#views").empty();

var container = $("<div />").attr({id: "user"});
//var name      = $("<span />").text(data.name);

$("#views").append(container.append(name));




// Templates

var object = {
  url: "http://example.com",
  getName: function() { return "Trevor"; }
};

var template = '<li><a href="${url}">${getName()}</a></li>';

//var element = jQuery.tmpl(template, object);
// Produces: <li><a href="http://example.com">Trevor</a></li>

//$("body").append(element);



// Binding

var addChange = function(ob){
  ob.change = function(callback){
    if (callback) {
      if ( !this._change ) this._change = [];
      this._change.push(callback);
    } else {
      if ( !this._change ) return;
      for (var i=0; i < this._change.length; i++)
        this._change[i].apply(this);
    }
  };
};

var object = {};
object.name = "Foo";

addChange(object);

object.change(function(){
  console.log("Chnaged!", this);
  // Potentially update view
});

object.change();

object.name = "Bar";
object.change();




// Binding Up Models

var User = function(name){
  this.name = name;
};

User.records = [];

User.bind = function(ev, callback) {
  var calls = this._callbacks || (this._callbacks = {});
  (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
};

User.trigger = function(ev) {
  var lists, calls, i, l;
  if (!(calls = this._callbacks)) return this;
  if (!(list = this._callbacks[ev])) return this;
  jQuery.each(list, function(){ this() } )
};

User.create = function(name){
  this.records.push(new this(name));
  this.grigger("change")
};

jQuery(function($){
  User.bind("change", function(){
    var template = 4("#userTmpl").tmpl(User.records);

    $("#users").empty();
    $("#users").append(template);
  });
});




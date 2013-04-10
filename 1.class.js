// CHAPTER 1. MVC and Classes

var assert = function(value, msg){
  if ( !value )
    throw(msg || (value + " does not equal true"));
};

var assertEqual = function(val1, val2, msg){
  if (val1 !== val2)
    throw(msg || (val1 + " does not equal " + val2));
};

var Class = function(parent){
  var klass = function(){
    this.init.apply(this, arguments);
  };

  // klass�� ������Ÿ���� �ٲ۴�
  if (parent) {
    var subclass = function() { };
    subclass.prototype = parent.prototype;
    klass.prototype = new subclass;
  };

  klass.prototype.init = function(){};

  // ������Ÿ���� ������
  klass.fn = klass.prototype;

  // Ŭ������ ������
  klass.fn.parent = klass;

  klass._super = klass.__proto__;

  // Ŭ���� ������Ƽ �߰�
  klass.extend = function(obj){
    var extended = obj.extended;
    for (var i in obj){
      klass[i] = obj[i];
    }
    if (extended) extended(klass)
  };

  // �ν��Ͻ� ������Ƽ �߰�
  klass.include = function(obj){
    var included = obj.included;
    for (var i in obj){
      klass.fn[i] = obj[i];
    }
    if (included) included(klass)
  };

  // ���Ͻ� �Լ� �߰�
  klass.proxy = function(func){
    var self = this;
    return (function(){
        return func.apply(self, arguments);
    });
  }

  // �ν��Ͻ����� �Լ��� �߰�
  klass.fn.proxy = klass.proxy;

  return klass;
};

var PubSub = {
  subscribe: function(ev, callback) {
    // Create _callbacks object, unless it already exists
    var calls = this._callbacks || (this._callbacks = {});
    
    // Create an array for the given event key, unless it exists, then
    // append the callback to the array
    (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
    return this;
  },

  publish: function() {
    // Turn arguments object into a real array
    var args = Array.prototype.slice.call(arguments, 0);

    // Extract the first argument, the event name
    var ev = args.shift();

    // Return if there isn't a _callbacks object, or
    // if it doesn't contain an array for the given event
    var list, calls, i, l;
    if (!(calls = this._callbacks)) return this;
    if (!(list = this._callbacks[ev])) return this;

    // Invoke the callbacks
    for (i = 0, l = list.length; i < l; i++)
      list[i].apply(this, args);
    return this;
  }
};


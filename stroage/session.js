//这两个函数可以拥有每一页面标识，而且储存的数据可以是基本数据类型加数组和对象。
//临时缓存函数
var SessionS = (function ($) {
    var storage = function (name) {
        this.name = name;
    };
    storage.prototype.set = function (tips,item) {
        $.setItem(this.name+':'+tips,JSON.stringify(item))
    };
    storage.prototype.get = function (tips) {
        return !$.getItem(this.name+':'+tips ) ? null :JSON.parse($.getItem(this.name+':'+tips ));
    };
    storage.prototype.remove = function (tips) {
        $.removeItem(this.name+':'+tips)
    };
    storage.prototype.getAll = function () {
        var params = {};
        for(var i = 0;i<$.length;i++){
            if($.key(i).indexOf(this.name)===0){
                var name = $.key(i).replace(this.name + ":",'');
                var value = $.getItem($.key(i));
                params[name] = value
            }
        }
        return params
    };
    storage.prototype.clear = function () {
        var arr=[];
        var len = $.length;
        for(var i = 0;i<len;i++){
            if($.key(i).indexOf(this.name)===0){
                arr.push($.key(i))
            }
        }
        for(var j = 0;j<len;j++){
            $.removeItem(arr[j])
        }
    };
    return storage
})(window.sessionStorage);

//长时间缓存函数
var LocalS = (function ($) {
    var storage = function (name) {
        this.name = name;
    };
    storage.prototype.set = function (tips,item) {
        $.setItem(this.name+':'+tips,JSON.stringify(item))
    };
    storage.prototype.get = function (tips) {
        return !$.getItem(this.name+':'+tips ) ? null :JSON.parse($.getItem(this.name+':'+tips ));
    };
    storage.prototype.remove = function (tips) {
        $.removeItem(this.name+':'+tips)
    };
    storage.prototype.getAll = function () {
        var params = {};
        for(var i = 0;i<$.length;i++){
            if($.key(i).indexOf(this.name)===0){
                var name = $.key(i).replace(this.name + ":",'');
                var value = $.getItem($.key(i));
                params[name] = value
            }
        }
        return params
    };
    storage.prototype.clear = function () {
        var arr=[];
        var len = $.length;
        for(var i = 0;i<len;i++){
            if($.key(i).indexOf(this.name)===0){
                arr.push($.key(i))
            }
        }
        for(var j = 0;j<len;j++){
            $.removeItem(arr[j])
        }
    };
    return storage
})(window.localStorage);
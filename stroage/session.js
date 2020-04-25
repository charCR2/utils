//这两个函数可以拥有每一页面标识，而且储存的数据可以是基本数据类型加数组和对象。
//临时缓存函数

(function (global) {
    function reg(rege){
        var test = {
            a: /^\w+$/i,
        }
        return test[rege]
    }

    function deepGet(object, path, defaultValue) {
        return (!Array.isArray(path) ? path.replace(/\[/g, '.').replace(/\]/g, '').split('.') : path)
            .reduce((o, k) => (o || {})[k], object) || defaultValue;
    }

    function deepSet(object, path, value) {
        (!Array.isArray(path) ? path.replace(/\[/g, '.').replace(/\]/g, '').split('.') : path)
            .reduce(function (o, k, i, arr){
                if(k === arr[arr.length-1]){
                    o[k] = value
                }
                return o[k]

            } , object)
        return object
    }

    var storage = (function ($) {
        var _ = function (name) {
            if(name){
                reg("a").test(name)
                    ?
                    this.name = name
                    :
                    console.error('this package name must be Obey variable naming rules')
            }else{
                this.name = "A"
            }
        };
        _.prototype.set = function (tips,item) {
            if(/\[|\./g.test(tips)){
                let obj ={}
                let trueObj = tips.split("[")[0].split('.')[0]
                obj[trueObj] = !$.getItem(this.name+':'+trueObj ) ? null :JSON.parse($.getItem(this.name+':'+trueObj ))
                $.setItem(this.name+':'+trueObj,JSON.stringify(
                    deepSet(obj,tips,item)
                ))
            }else{
                $.setItem(this.name+':'+tips,JSON.stringify(item))
            }
        };
        _.prototype.get = function (tips,defaultValue) {
            let trueObj = tips.split("[")[0].split('.')[0]
            if(tips){
                let obj ={}
                obj[trueObj] = !$.getItem(this.name+':'+trueObj ) ? null :JSON.parse($.getItem(this.name+':'+trueObj ))
                defaultValue = defaultValue || null
                return obj ? deepGet(obj,tips,defaultValue) : null
            }
        };
        _.prototype.remove = function (tips,pipe) {
            $.removeItem(this.name+':'+tips)
        };
        _.prototype.getAll = function () {
            var params = {};
            for(var i = 0;i<$.length;i++){
                if($.key(i).indexOf(this.name)===0){
                    var name = $.key(i).replace(this.name + ":",'');
                    var value = $.getItem($.key(i));
                    params[name] = JSON.parse(value)
                }
            }
            return params
        };
        _.prototype.clear = function () {
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
        return _
    })

    return {
        SessionS : storage(global.sessionStorage),
        LocalS : storage(global.localStorage)
    }

})(window)

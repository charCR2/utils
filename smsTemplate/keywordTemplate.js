/**
 * 关键词模板插件
 * 2019.09.09
 * @author carter chen
 * @function constructor 构造器 生成方法 var edit = new AntiTemplate('id')
 *           构造器中的参数用来获取标签，可以理解为一个querySelector
 * @function addKeyword 添加关键词 参数为添加的关键词的一个对象{}，其中必须要有“keyword”属性；其他的自定义,会返回值
 * @function getAllData 获取模板和所有数据
 * @function clear 清除数据
 * @function resetTemplate 初始化添加数据
 */
(function(global, factory){
    "use strict";

    if(typeof module === "object" && typeof module.exports === "object"){
        module.exports =  factory(global);
    }else{
        factory(global);
    }
}(typeof window !== "undefined" ? window : this,
    function(window){
        var Util = function () {};
        Util.prototype = {
            //生成Guid
            guid:function () {
                function S4() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                }
                return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
            },

            getLength :function(str) {
            ///<summary>获得字符串实际长度，中文2，英文1</summary>
            var realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128)
                    realLength += 1;
                else
                    realLength += 2;
            }
            return realLength;

        },
            deepClone:function(data){
                let type = getType(data) , obj;
                if(type === 'Array'){
                    obj = [];
                    data.forEach(item=>obj.push( this.deepClone(item) ))
                }else if(type === 'Object'){
                    obj = {};
                    for(let key in data){
                        obj[key] = this.deepClone(data[key])
                    }
                }else{
                    return data
                }

                function getType(data){
                    return Object.prototype.toString.call(data).slice(8,-1)
                }
                return obj
            }
        };

        var AntiTemplate = function (id) {
            this.obj = document.querySelector(id);
            this.obj.parentNode.replaceChild(
                this.html({
                    class:this.obj.className,
                    id:this.obj.id,
                    contenteditable:true,
                    style:this.obj.style.cssText,

                })
                ,this.obj);
            this.edit = document.querySelector(id);
            this.keywordList=[];
            this.init()
        };

        AntiTemplate.prototype = Object.assign(new Util(),{
            constructor: AntiTemplate,

            init:function () {
                this.editEvent(this.edit,this)
            },
            html:function(attr){
                var element = document.createElement('div');
                for(var key in attr){
                    element.setAttribute(key,attr[key]);
                }
                return element;
            },
            editEvent:function(edit,that){
                // 编辑框点击事件
                edit.onclick = function() {
                    // 获取选定对象
                    var selection = getSelection();
                    // 设置最后光标对象
                    that.lastEditRange = selection.getRangeAt(0);
                }
                // 编辑框按键弹起事件
                edit.onkeyup = function() {
                    // 获取选定对象
                    var selection = getSelection();
                    // 设置最后光标对象
                    that.lastEditRange = selection.getRangeAt(0)
                };
                edit.onpaste = function (e) {
                    var text = document.createTextNode(e.clipboardData.getData('text/plain'));
                    var selection = getSelection()
                    if (this.lastEditRange) {
                        // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
                        selection.removeAllRanges();
                        selection.addRange(this.lastEditRange)
                    }
                    var rang = selection.getRangeAt(0);
                    // 文本节点在光标位置处插入新的表情内容
                    rang.insertNode(text);
                    // 光标移动到到原来的位置加上新内容的长度
                    rang.setStartAfter(text);
                    selection.removeAllRanges();
                    // 插入新的光标对象
                    selection.addRange(rang);
                    // 无论如何都要记录最后光标对象
                    this.lastEditRange = selection.getRangeAt(0);
                    return false
                }
            },

            resetTemplate:function(text,valList){
                var that = this;
                var re = text.split('\n');
                var m = 0;
                var arr = [];

                re.forEach(function (val,i) {
                    var edit = document.createElement('div');
                    var reg = val.split("{{");
                    var c = that.deepClone(valList).splice(m,reg.length-1);
                    var a=[],b=[];
                    m += reg.length - 1;
                    edit.innerHTML=reg[0];
                    reg.shift();
                    reg.forEach(function (item) {
                        var arr = item.split("}}");
                        a.push(arr[1]);
                        b.push(arr[0]);
                    });
                    if(c.length<=0){
                        edit.innerHTML =val
                    }
                    c.forEach(function (item,i) {
                        var myText = document.createTextNode(a[i]);
                        var emojiText = document.createElement('input');
                        item.guid = that.guid();
                        emojiText.setAttribute("data-id",item.guid);
                        emojiText.setAttribute("disabled",false);
                        emojiText.className = "editInput";
                        var len = (22+(that.getLength(b[i])*7)) + 'px';
                        emojiText.style.width =len;
                        // emojiText.value = ;
                        emojiText.setAttribute('value',"{{"+b[i]+"}}") //解决换行value消失问题
                        edit.appendChild(emojiText);
                        edit.appendChild(myText);
                    });
                    arr = arr.concat(c)
                    if(i===0){
                        that.edit.innerHTML = edit.innerHTML
                    }else {
                        that.edit.appendChild(edit)
                    }

                });
            this.keywordList = arr
        },

        // 添加关键词
        addKeyword: function(attr) {
            var that = this;
            var edit = this.edit;
            attr.guid = that.guid();
            this.keywordList.push(attr) ;
             // 编辑框设置焦点
            edit.focus();
            // 获取选定对象
            var selection = getSelection();
            // 判断是否有最后光标对象存在
            var val = "{{"+attr.keyword+"}}";
            var emojiText = document.createElement('input')
                emojiText.setAttribute("data-id",attr.guid);
                emojiText.setAttribute("disabled",false);
                emojiText.className = "editInput";
            var len = (22+(that.getLength(attr.keyword)*7)) + 'px';

            emojiText.style.width =len;
                emojiText.value = val;
                if (this.lastEditRange) {
                    // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
                    selection.removeAllRanges();
                    selection.addRange(this.lastEditRange)
                }
                var rang = selection.getRangeAt(0);
                // 文本节点在光标位置处插入新的表情内容
                rang.insertNode(emojiText);
                // 光标移动到到原来的位置加上新内容的长度
                rang.setStartAfter(emojiText);
                selection.removeAllRanges();
                // 插入新的光标对象
                selection.addRange(rang);
            // 无论如何都要记录最后光标对象
            this.lastEditRange = selection.getRangeAt(0)
        },
        //获取所有数据
        getAllData:function(){
            var obj = this.resetGet(this.edit,'',[],0);
            return this.deepClone({
                text:obj.str,
                data:obj.arr
            })
        },

        resetGet:function(edit,str,arr,m){
            var that = this;
            edit.childNodes.forEach(function(item){
                if(item.nodeName.toLowerCase()==="input"){
                    str += item.value;
                    that.keywordList.forEach(function(val){
                        if(val.guid===item.getAttribute("data-id")){
                            arr.push(val)
                        }
                    });
                    arr[m].index= m++;
                }else if(item.nodeName.toLowerCase()==="div"){
                    str += '\n';
                    var obj = that.resetGet(item,str,arr,m);
                    str=obj.str;
                    arr=obj.arr;
                    m=obj.m
                }else if(item.nodeName.toLowerCase()==="#text"){
                    str += item.nodeValue;
                }
            });
            return {
                str:str,
                arr:arr,
                m:m
            }
        },

        //清除数据
        clear:function () {
            this.keywordList=[];
            this.edit.innerHTML = ""
        },
        disabled:function () {
            this.edit.setAttribute('contenteditable',false);
            this.edit.style.background = '#eee'
        },
        able:function () {
            this.edit.setAttribute('contenteditable',true);
            this.edit.style.background = '#fff'
        },

    });
    //出口
    window.AntiTemplate = AntiTemplate
 }
 ));
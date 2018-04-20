/**
 * Created by TricknessBoy on 2016/11/7.
 */
(function(){
    "use strict";
    var ajax = (function(){
        var json2url = function(json){
            json.t = Math.random();
            var res = [];
            for(var name in json){
                res.push(name + "=" + json[name]);
            }
            return res.join("&");
        };
        var hanlder = function(json){
            json = json || {};
            if(!json.url)
                return;

            json.data = json.data || {};
            json.timeout = json.timeout || 3000;
            json.type = json.type || "GET";

            var timer = null;
            var oAjax = null;
            var formatData = "";

            //创建对象
            try{
                oAjax = new XMLHttpRequest();
            }catch (e){
                oAjax = new ActiveXObject("Microsoft XMLHTTP");
            }

            formatData = json2url(json.data);

            //发送
            switch (json.type.toLowerCase()){
                case "get":
                    oAjax.open("GET", json.url + "?" + formatData, true);
                    oAjax.send();
                    break;
                case "post":
                    oAjax.open("POST", json.url, true);
                    oAjax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                    oAjax.send(formatData);
                    break;
            }

            //成功状态
            oAjax.onreadystatechange = function(){
                if(oAjax.readyState == 4){
                    if(oAjax.status>=200 && oAjax.status<300 || oAjax.status ==304){
                        json.success && json.success(oAjax.responseText);
                    }else{
                        json.error && json.error(oAjax.status);
                    }
                }
            };

            //超时处理
            timer = setTimeout(function(){
                json.error && json.error('网络超时');
                oAjax.onreadystatechange=null;
            },json.timeout);
        };

        return hanlder;
    })();
})();

(function(){
    "use strict";
    var Ajax = function(opt){
        this.opt = opt || {};
        if(!this.opt.url)
            return;
        this.opt.data = this.opt.data || {};
        this.opt.timeout = this.opt.timeout || 3000;
        this.opt.type = this.opt.type || "GET";

        this.xmlHttp = null;
        this.sData = "";
        this.init();
    };
    Ajax.prototype.init = function(){
        //创建xmlHttp对象
        this.createXMLHttp();

        //格式化数据
        this.formatData();

        //发送
        this.sendXMLHttp();

    };
    Ajax.prototype.createXMLHttp = function(){
        try {
            this.xmlHttp = new XMLHttpRequest();// ff opera
        } catch (e) {
            try {
                this.xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");// ie
            } catch (e) {
                try {
                    this.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
            }
        }
        return this;
    };
    Ajax.prototype.setData = function(data){
        this.opt.data = data;
        return this;
    };
    Ajax.prototype.formatData = function(){
        var data = this.opt.data;
        data.t = Math.random();
        var result = [];
        for(var key in data){
            result.push(key + "=" + data[key]);
        }
        this.sData = result.join("&");
        return this;
    };
    Ajax.prototype.sendXMLHttp = function(){
        var type = this.opt.type.toLowerCase();
        switch(type){
            case "get":
                this.xmlHttp.open("GET", this.opt.url + "?" + this.sData, true);
                this.xmlHttp.send();
                break;
            case "post":
                this.xmlHttp.open("POST", this.opt.url, true);
                this.xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                this.xmlHttp.send(this.sData);
                break;
        }
        return this;
    };
    Ajax.prototype.then = function(successFn,failFn){
        var oAjax = this.xmlHttp;
        oAjax.onreadystatechange = function(){
            if(oAjax.readyState == 4){
                if(oAjax.status >= 200 && oAjax.status < 300 || oAjax.status ==304){
                    successFn && successFn(oAjax.responseText);
                }else{
                    failFn && failFn(oAjax.responseText);
                }
            }
        };
        return this;
    };

    //测试
    var ajax = new Ajax({
        url : "../api/login.php",
        data : {name : "Dong",sex : "male"},
        type : "get"
    });
    ajax.then(function(data){
        console.log(data);
    },function(e){
        console.log(e);
    });
    console.log(ajax);
})();


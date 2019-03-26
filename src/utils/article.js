'use strict';


var Hogan = require('hogan.js');
var _article = {
    /*
    *网络请求的模板：
    *后端请求
    */
    request: function (param) {
        let urlinfo = "http://127.0.0.1:5000";
        urlinfo = urlinfo + param.url;
        $.ajax({
            type: param.method || 'post',
            url: urlinfo || '',
            dataType: param.type || 'json',
            data: param.data || '',
            crossDomain: true,
            success: function (res) {
                // ajax请求的回调函数
                var _this = this;
                param.success(res);
            },
            error: function (err) {
                typeof param.error === 'function' && param.error(err.statusText);
            }
        });
    },
    // 获取服务器地址
    getServerUrl: function (path) {
        return conf.serverHost + path;
    },
    // 获取url参数
    getUrlParam: function (name) {
        // 获取当前页面url的参数(name)
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    // 渲染html模板
    renderHtml: function (htmlTemplate, data) {
        var template = Hogan.compile(htmlTemplate);
        var result = template.render(data);
        return result;
    },
    // 成功提示
    successTips: function (msg) {
        alert(msg || '操作成功');
    },
    // 失败提示
    errorTips: function (err) {
        alert(err || '操作失败');
    },
    // 字段验证
    validate: function (value, type) {
        var value = $.trim(value);
        // 非空验证
        if ('require' === type) {
            return !!value;
        }
        // 手机号验证
        if ('phone' === type) {
            return /^1\d{10}$/.test(value);
        }
        // 邮箱格式验证
        if ('email' === type) {
            return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value);
        }
    },
    // 统一登录处理
    dologin: function () {
        //执行登录页面的redirect
        window.location.href = './login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    // 回到主页
    goHome: function () {
        window.location.href = './index.html';
    }
};

module.exports = _article;
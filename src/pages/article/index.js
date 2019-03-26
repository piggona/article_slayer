'use strict'

var _article = require('utils/article.js');
var _content = require('html-loader!./masks/content.html')
require('./index.css');



var _display = {
    query: "",
    from_page: 0,
    page_size: 10,
    results: {},
    init: function () {
        this.init_data();
    },
    onload: function () {
        var keyword = _article.getUrlParam('query');
        //若url中keyword存在，则回填到搜索框上，此步可以放到searchSubmit中作为post解决方案
        if (keyword) {
            this.query = keyword;
            $('#search-input').val(keyword);
        }
    },
    bindEvent: function(){
        let _this = this
        let search_isclick = true;
        let choose_isclick = true;
        let forward_isclick = true;
        let backward_isclick = true;
        $('#search-btn').click(function(){
            if(search_isclick){
                search_isclick = false
                _this.query = $('#simple-search').val()
                _this.get_data();
            }
            setTimeout(function(){ 
                search_isclick = true;
            }, 500);  
        });
        $('#choose-btn').click(function(){
            // _this.searchSubmit();
        });
        $('#forward-btn').click(function(){
            if(forward_isclick){
                forward_isclick = false
                _this.forward();
            }
            setTimeout(function(){ 
                forward_isclick = true;
            }, 500);
        });
        $('#backward-btn').click(function(){
            if(backward_isclick){
                backward_isclick = false
                _this.backward();
            }
            setTimeout(function(){ 
                backward_isclick = true;
            }, 500);
            
        });
        $("body").delegate(".choose-btn","click",function(e){
            if(choose_isclick){
                choose_isclick = false
                _this.clic($(this).attr("id"))
            }
            setTimeout(function(){ 
                choose_isclick = true;
            }, 500);
            
        })
    },
    clic: function(id){
        console.log(this.results[id])
        this.push_data(id)
    },
    forward: function() {
        if(this.from_page === 0){
            this.from_page = 0;
        }else{
            this.from_page -= 1;
        }
        this.get_data();
        // this.bindEvent();
    },
    backward: function() {
        this.from_page += 1;
        this.get_data();
        // this.bindEvent();
    },
    push_data: function(id){
        let result = this.results[id]
        result["title"] = $('input#'+id).val()
        result["summary"] = $('#text'+id).text()
        _article.request({
            //发data到服务器地址
            url: '/api/_push',
            method: 'post',
            data: result,
            success: function (res) {
                print(res)
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    get_data: function() {
        var _this = this;
        var post_item = {"query":"","from":"","size":""}
        post_item["query"] = this.query
        post_item["from"] = this.from_page
        post_item["size"] = this.page_size
        console.log(post_item)
        _article.request({
            //发data到服务器地址
            url: '/api/_search',
            method: 'post',
            data: post_item,
            success: function (res) {
                if (res) {
                    console.log(res)
                    let display = []
                    let hits = res["hits"]["hits"]
                    for(let i=0,l=hits.length;i<l;i++){
                        let item = {"title":"","create_time":"","summary":"","source":"","tags":"","id":"","url":""}
                        let hit = hits[i]["_source"]
                        let extend
                        let newDate = new Date()
                        let info = {"id":"","title":"","tags":""}
                        try{
                            extend = JSON.parse(hits[i]["_source"]["extend"])
                        }
                        catch{
                            extend = {"summary":"","source":""}
                        }    
                        info["id"] = hits[i]["_id"]
                        item["title"] = hit["title"]
                        info["title"] = hit["title"]
                        newDate.setTime(hit["create_time"] * 1000)
                        item["create_time"] = newDate.toJSON()
                        item["summary"] = extend["summary"]
                        item["source"] = extend["source"]
                        item["tags"] = hit["tags"]
                        info["tags"] = hit["tags"]
                        item["url"] = hit["url"]
                        item["id"] = info["id"]
                        display.push(item)
                        _this.results[item["id"]] = item
                    }
                    console.log(display)
                    console.log(_this.results)
                    var content = {"hits":[]}
                    content["hits"] = display
                    // 接收页面信息
                    $('#es-content').html("")
                    $('#es-content').append(_article.renderHtml(_content,content))
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    init_data: function () {
        var submit_data = _article.getUrlParam('query');
        this.query = submit_data
        var _this = this;
        
        _article.request({
            //发data到服务器地址
            url: '/_search?query=' + submit_data,
            method: 'get',
            success: function (res) {
                if (res) {
                    console.log(res)
                    let display = []
                    let hits = res["hits"]["hits"]
                    for(let i=0,l=hits.length;i<l;i++){
                        let item = {"title":"","create_time":"","summary":"","source":"","tags":"","id":"","url":""}
                        let hit = hits[i]["_source"]
                        let extend
                        let info = {"id":"","title":"","tags":""}
                        let newDate = new Date()
                        try{
                            extend = JSON.parse(hits[i]["_source"]["extend"])
                        }
                        catch{
                            extend = {"summary":"","source":""}
                        }
                            
                        info["id"] = hits[i]["_id"]
                        item["title"] = hit["title"]
                        info["title"] = hit["title"]
                        newDate.setTime(hit["create_time"] * 1000)
                        item["create_time"] = newDate.toJSON()
                        item["summary"] = extend["summary"]
                        item["source"] = extend["source"]
                        item["tags"] = hit["tags"]
                        info["tags"] = hit["tags"]
                        item["url"] = hit["url"]
                        item["id"] = info["id"]
                        display.push(item)
                        _this.results[item["id"]] = item
                    }
                    console.log(display)
                    console.log(_this.results)
                    var content = {"hits":[]}
                    content["hits"] = display
                    // 接收页面信息
                    $('#es-content').html("")
                    $('#es-content').append(_article.renderHtml(_content,content))
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
        this.bindEvent();
    }
}
_display.init();
module.exports = _display

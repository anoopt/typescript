/// <reference path="../typings/globals/microsoft.ajax/index.d.ts" />
/// <reference path="../typings/globals/sharepoint/index.d.ts" />
"use strict";
var s43;
(function (s43_1) {
    var NewsItem = (function () {
        function NewsItem() {
            this._listName = "TsNews";
            this._rest = new s43.restUtils();
            this._baseUrl = _spPageContextInfo.webAbsoluteUrl;
            this._listUrl = this._baseUrl + "/_api/web/lists/getByTitle('" + this._listName + "')";
        }
        //#region Properties
        //ES3 doesn't support property getters and setters, must declare methods
        NewsItem.prototype.getTitle = function () {
            return this._title;
        };
        NewsItem.prototype.setTitle = function (value) {
            this._title = value;
        };
        NewsItem.prototype.getBody = function () {
            return this._body;
        };
        NewsItem.prototype.setBody = function (value) {
            this._body = value;
        };
        NewsItem.prototype.getExpiration = function () {
            return this._expiration;
        };
        NewsItem.prototype.setExpiration = function (value) {
            this._expiration = value;
        };
        //#endregion
        NewsItem.prototype.getCurrent = function (callback, fieldNames) {
            var selectString = "";
            if ((typeof fieldNames !== "undefined") && (fieldNames.length > 0)) {
                selectString = "?$select=" + fieldNames.join(",");
            }
            //selectString = 5;
            var url = this._listUrl + "/items" + selectString;
            this._rest.Get(url).then(function (data) {
                if (callback !== undefined) {
                    var retVal = [];
                    for (var i = 0; i < data.d.results.length; i++) {
                        var oneItem = new NewsItem();
                        oneItem.setTitle(data.d.results[i].Title);
                        oneItem.setBody(data.d.results[i].Body);
                        oneItem.setExpiration(data.d.results[i].Expiration);
                        retVal.push(oneItem);
                    }
                    callback(retVal);
                }
            }, function (err) {
                console.log(JSON.stringify(err));
            });
        };
        return NewsItem;
    }());
    s43_1.NewsItem = NewsItem;
})(s43 || (s43 = {}));

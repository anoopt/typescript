Type.registerNamespace("s43");   //necessary if we want to support MDS!


s43.restUtils = function () {
    "use strict";
    //#region private vars

    var _callCount = 0;

    //#endregion private vars

    //#region Private Functions
    function _getPromise(url, headers) {
        
        return _doCall(url, headers, "", "GET");
    }

    function _deletePromise(url, headers, eTag) {
        return _postPromiseInternal(url, headers, "", "DELETE", eTag);
    }

    function _postPromise(url, headers, body) {
        return _postPromiseInternal(url, headers, body);
    }

    function _postPromiseInternal(url, passedHeaders, body, action, eTag) {
        //local variable to store headers passed to actual AJAX call
        var localHeaders = {};

        //Serialize the body so it can be passed to the AJAX call and also so we can set the Content-Length header
        var bodyString = JSON.stringify(body);

        //Get each passed header into localHeaders
        if(passedHeaders){
            for (var key in passedHeaders) {
              if (passedHeaders.hasOwnProperty(key)) {
                localHeaders[key] = passedHeaders[key];
              }
            }
        }


        //Request Digest header
        localHeaders["X-RequestDigest"] = $("#__REQUESTDIGEST").val();

        //#region Content Length header (removed)
        /* Per the XMLHttpRequest spec (http://www.w3.org/TR/XMLHttpRequest/#the-setrequestheader-method),
            Content-Length must not be set in code.  Chrome will record an error if you try to.  IE will not.

        if (body) {
            localHeaders["Content-Length"] = bodyString.length;
        }
        else {
           localHeaders["Content-Length"] = 0;
        }

        //Verb-tunneling for other verbs which may be blocked by firewalls
        if (action && action.length > 0) {
            localHeaders["X-HTTP-Method"] = action;

            //If-Match header, used passed value or default to *
            if (eTag && eTag.length > 0) {
                localHeaders["IF-MATCH"] = eTag;
            }
            else {
                localHeaders["IF-MATCH"] = "*";
            }
        }

        */

        //#endregion

        
        //Make the call
        return _doCall(url, localHeaders, bodyString, "POST");
    }

    function _doCall(url, passedHeaders, bodyString, verb) {
        _callCount = ++_callCount;   //only for performance testing

        //Make sure we have an ACCEPT header, set it if not
        if (!passedHeaders){
            passedHeaders = {};
        }
        if( !passedHeaders.Accept || passedHeaders.Accept.length === 0) {
            passedHeaders["Accept"] = "application/json;odata=verbose";
        }

        var dfd = $.ajax({
            url: encodeURI(url),   //Make sure to encode the URI
            type: verb,
            contentType: "application/json;odata=verbose",
            data: bodyString,
            headers: passedHeaders
        });

        //Everything returns a Promise
        return dfd.promise();
    }

    //Utility function to return a fulfilled promise, used only for testing and prototyping
    function _returnResolvedPromise() {
        var dfd = $.Deferred();
        dfd.resolve();
        return dfd.promise();
    }

    function _getBodyStubToCreateListItem(listName) {
        if(typeof listName !=='undefined' && listName.length !== 0){
            return {"__metadata": { "type": "SP.Data." + listName + "ListItem" }};
        }
        return {};
    }

    function _emptyCallback(){}

    //#endregion Private Functions

    var publics = {
        Get                            : _getPromise,
        Post                           : _postPromise,
        Delete                         : _deletePromise,
        ReturnResolvedPromise          : _returnResolvedPromise,   
        GetCallCount                   : function () { return _callCount; },
        GetBodyStubToCreateListItem    : _getBodyStubToCreateListItem,
        EmptyCallback                  : _emptyCallback
    };

    return publics;

};

s43.rest = new s43.restUtils();

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

/// <reference path="../typings/globals/jquery/index.d.ts" />
/// <reference path="./2-NewsItem.ts" />
function displayItems(items) {
    var results = "";
    for (var i = 0; i < items.length; i++) {
        results += "Title: " + items[i].getTitle() + "<br/>Body: " + items[i].getBody();
    }
    $('#results').append(results);
}
var testItem = new s43.NewsItem();
var fields = ["Title", "Body"];
testItem.getCurrent(displayItems, fields);

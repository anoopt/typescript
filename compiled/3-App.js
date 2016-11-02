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

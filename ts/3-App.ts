/// <reference path="../typings/globals/jquery/index.d.ts" />
/// <reference path="./2-NewsItem.ts" />

function displayItems(items: s43.NewsItem[]) {
    var results: string = "";
    for (var i:number = 0; i < items.length; i++) {
    results += "Title: " + items[i].getTitle() + "<br/>Body is : " + items[i].getBody()
    }
    $('#results').append(results);
}


var testItem: s43.NewsItem = new s43.NewsItem();
var fields: string[] = ["Title", "Body"];

testItem.getCurrent(displayItems, fields);


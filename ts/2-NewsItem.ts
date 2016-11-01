/// <reference path="../typings/globals/microsoft.ajax/index.d.ts" />
/// <reference path="../typings/globals/sharepoint/index.d.ts" />

"use strict";

module s43 {
    declare var s43: any;

    export class NewsItem {

        constructor() {
        }

        private _title: string;
        private _body: string;
        private _expiration: Date;
        private _listName: string = "TsNews";
        private _rest = new s43.restUtils();
        private _baseUrl: string = _spPageContextInfo.webAbsoluteUrl;
        private _listUrl: string = this._baseUrl + "/_api/web/lists/getByTitle('" + this._listName + "')";

        //#region Properties
        //ES3 doesn't support property getters and setters, must declare methods
        public getTitle(): string {
            return this._title;
        }

        public setTitle(value: string) {
            this._title = value;
        }

        public getBody(): string {
            return this._body;
        }

        public setBody(value: string) {
            this._body = value;
        }

        public getExpiration(): Date {
            return this._expiration;
        }

        public setExpiration(value: Date) {
            this._expiration = value;
        }
        //#endregion

        getCurrent(callback: Function, fieldNames: string[]) {

            var selectString: string = "";
            if ((typeof fieldNames !== "undefined") && (fieldNames.length > 0)) {
                selectString = "?$select=" + fieldNames.join(",");
            }
            //selectString = 5;
            var url: string = this._listUrl + "/items" + selectString;
            this._rest.Get(url).then(
                function(data: any) {
                    if (callback !== undefined) {
                       var retVal: NewsItem[] = [];
                       for(var i: number = 0;i<data.d.results.length;i++){
                           var oneItem = new NewsItem();
                           oneItem.setTitle(data.d.results[i].Title);
                           oneItem.setBody(data.d.results[i].Body);
                           oneItem.setExpiration(data.d.results[i].Expiration);
                           retVal.push(oneItem);
                       }
                        callback(retVal);
                }},
                function(err: any) {
                    console.log(JSON.stringify(err));
                }
           );

        }

    }


}

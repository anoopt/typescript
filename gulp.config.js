module.exports = function() {
    var client = './src/client/';
    var compiledfolder = 'compiled/';
    var mergedfolder = 'merged/';
    var uploadfolder = './upload/';

    var config = {
        compiledfolder: 'compiled/',
        mergedfolder: './merged/',
        uploadfolder: './upload/',

        /**
         * Files paths
         */
        alljs:[
            './'+ compiledfolder +'/*.js'
        ],
        allts: [
            'ts/*.ts'
        ],
        mergedjs: mergedfolder + '*.js',
        uploadjs: uploadfolder + '*.js',
        uploadhtml: uploadfolder + '*.html',

        /**
         * File names
         */
        mergedjsfilename: 'all.js',

        /**
         * SharePoint
         */
        creds: {
            username: "user@tenant.onmicrosoft.com",
            password: "password"
        },
        spsiteurl: "https://tenant.sharepoint.com/sites/somesite",
        spsitefolder: "somefolder"
    };

    return config;
};

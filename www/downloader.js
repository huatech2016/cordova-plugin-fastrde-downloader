function createEvent(e,o){o=o||[];var n=document.createEvent("Event");n.initEvent(e),n.name=e,n.data=o;var t=e;return o[0]&&(t+=" : "+o[0]),n}var Downloader={localFolder:null,fileSystemURL:null,fileSystem:null,unzipQueue:[],downloadQueue:[],fileObjects:[],fileObjectInProgress:null,fileObjectInUnzipProgress:null,wifiOnly:!1,autoUnzip:!1,autoRemove:!0,autoCheck:!1,noMedia:!0,loading:!1,unzipping:!1,initialized:!1,transfer:null,retry:3,initialize:function(e){Downloader.setFolder(e.folder),"undefined"!=typeof e.unzip&&Downloader.setAutoUnzip(e.unzip),"undefined"!=typeof e.remove&&Downloader.setRemoveAfterUnzip(e.remove),"undefined"!=typeof e.check&&Downloader.setAutoCheck(e.check),"undefined"!=typeof e.wifiOnly&&Downloader.setWifiOnly(e.wifiOnly),"undefined"!=typeof e.noMedia&&Downloader.setNoMedia(e.noMedia),"undefined"!=typeof e.fileSystem&&(Downloader.fileSystemURL=e.fileSystem),document.addEventListener("DOWNLOADER_downloadError",Downloader.onDownloadError,!1),document.addEventListener("DOWNLOADER_gotFileSystem",Downloader.onGotFileSystem,!1),document.addEventListener("DOWNLOADER_gotFolder",Downloader.onGotFolder,!1),document.addEventListener("DOWNLOADER_downloadSuccess",Downloader.onDownloadSuccess,!1),document.addEventListener("DOWNLOADER_unzipSuccess",Downloader.onUnzipSuccess,!1),document.addEventListener("DOWNLOADER_fileCheckSuccess",Downloader.onCheckSuccess,!1),Downloader.getFilesystem()},load:function(e,o){if(o=o||null,!Downloader.isInitialized())return void document.addEventListener("DOWNLOADER_initialized",function t(n){n.target.removeEventListener("DOWNLOADER_initialized",t,!1),Downloader.load(e,o)},!1);var n={url:e,name:e.replace(/^.*\//,""),md5:o};return Downloader.downloadQueue.push(n),Downloader.isLoading()||Downloader.loadNextInQueue(),n.name},abort:function(){null!==Downloader.transfer&&(Downloader.transfer.abort(),Downloader.transfer=null),Downloader.reset()},unzip:function(e){Downloader.unzipQueue.push(e),Downloader.isUnzipping()||Downloader.unzipNextInQueue()},loadNextInQueue:function(){if(Downloader.downloadQueue.length>0){Downloader.loading=!0;var e=Downloader.downloadQueue.shift();return Downloader.fileObjectInProgress=e,Downloader.transferFile(e),!0}return!1},unzipNextInQueue:function(){if(Downloader.unzipQueue.length>0){Downloader.unzipping=!0;var e=Downloader.unzipQueue.shift();return Downloader.fileObjectInUnzipProgress=e,Downloader._unzip(e),!0}return!1},transferFile:function(e){var o=Downloader.localFolder.toURL()+"/"+e.name;Downloader.transfer=new FileTransfer,Downloader.transfer.onprogress=function(o){if(o.lengthComputable){var n=Math.floor(o.loaded/o.total*100);document.dispatchEvent(createEvent("DOWNLOADER_downloadProgress",[n,e.name]))}},Downloader.transfer.download(e.url,o,function(e){document.dispatchEvent(createEvent("DOWNLOADER_downloadSuccess",[e]))},function(e){document.dispatchEvent(createEvent("DOWNLOADER_downloadError",[e]))})},_unzip:function(e){var o=Downloader.localFolder.toURL();zip.unzip(o+"/"+e,o,function(o){0==o?document.dispatchEvent(createEvent("DOWNLOADER_unzipSuccess",[e])):document.dispatchEvent(createEvent("DOWNLOADER_unzipError",[e]))},function(o){var n=Math.floor(o.loaded/o.total*100);document.dispatchEvent(createEvent("DOWNLOADER_unzipProgress",[n,e]))})},check:function(e,o){var n=Downloader.localFolder;n.getFile(e,{create:!1,exclusive:!1},function(n){md5chksum.file(n,function(n){n==o?document.dispatchEvent(createEvent("DOWNLOADER_fileCheckSuccess",[n,e])):document.dispatchEvent(createEvent("DOWNLOADER_fileCheckFailed",[n,o,e]))},function(e){document.dispatchEvent(createEvent("DOWNLOADER_fileCheckError",[e]))})},function(e){document.dispatchEvent(createEvent("DOWNLOADER_getFileError",[e]))})},removeFile:function(e){var o=Downloader.localFolder;o.getFile(e,{create:!1,exclusive:!1},function(e){e.remove(function(){document.dispatchEvent(createEvent("DOWNLOADER_fileRemoved",[e]))},function(){document.dispatchEvent(createEvent("DOWNLOADER_fileRemoveError",[e]))})},function(e){document.dispatchEvent(createEvent("DOWNLOADER_getFileError",[e]))})},isLoading:function(){return Downloader.loading},isUnzipping:function(){return Downloader.unzipping},isInitialized:function(){return Downloader.initialized},isWifiOnly:function(){return Downloader.wifiOnly},isAutoUnzip:function(){return Downloader.autoUnzip},isAutoRemove:function(){return Downloader.autoRemove},isAutoCheck:function(){return Downloader.autoCheck},isWifiConnection:function(){var e=navigator.connection.type;return e==Connection.WIFI?!0:!1},isZipFile:function(e){return e.match(/\.zip$/)?!0:!1},isNoMedia:function(){return Downloader.noMedia},setFolder:function(e){Downloader.localFolder=e},setWifiOnly:function(e){Downloader.wifiOnly=e},setNoMedia:function(e){Downloader.noMedia=e},setAutoUnzip:function(e){Downloader.autoUnzip=e},setAutoCheck:function(e){Downloader.autoCheck=e},setRemoveAfterUnzip:function(e){Downloader.autoRemove=e},reset:function(){Downloader.downloadQueue=[],Downloader.unzipQueue=[],Downloader.fileObjects=[],Downloader.fileObjectInProgress=null,Downloader.fileObjectInUnzipProgress=null,Downloader.initialized=!1,Downloader.loading=!1,Downloader.unzipping=!1,Downloader.retry=3},getFilesystem:function(){Downloader.fileSystemURL?window.resolveLocalFileSystemURI(Downloader.fileSystemURL,function(e){document.dispatchEvent(createEvent("DOWNLOADER_gotFileSystem",[e]))},function(e){document.dispatchEvent(createEvent("DOWNLOADER_error",[e]))}):(window.requestFileSystem=window.requestFileSystem||window.webkitRequestFileSystem,window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(e){document.dispatchEvent(createEvent("DOWNLOADER_gotFileSystem",[e.root]))},function(e){document.dispatchEvent(createEvent("DOWNLOADER_error",[e]))}))},getFolder:function(e,o){e.getDirectory(o,{create:!0,exclusive:!1},function(e){document.dispatchEvent(createEvent("DOWNLOADER_gotFolder",[e]))},function(e){document.dispatchEvent(createEvent("DOWNLOADER_error",[e]))})},touchNoMedia:function(){var e=Downloader.localFolder;e.getFile(".nomedia",{create:!0,exclusive:!1},function(e){},function(e){document.dispatchEvent(createEvent("DOWNLOADER_getFileError",[e]))})},onDownloadSuccess:function(e){var o=e.data[0];if(Downloader.isAutoCheck()){var n=Downloader.fileObjectInProgress.md5;Downloader.check(o.name,n)}else Downloader.isAutoUnzip()&&Downloader.isZipFile(o.name)&&Downloader.unzip(o.name);Downloader.loadNextInQueue()||(Downloader.loading=!1,Downloader.fileObjectInProgress=null),Downloader.retry=3},onDownloadError:function(e){Downloader.retry>0?(Downloader.transferFile(Downloader.fileObjectInProgress),Downloader.retry--):(Downloader.reset(),document.removeEventListener("DOWNLOADER_onDownloadError",Downloader.onDownloadError,!1),document.removeEventListener("DOWNLOADER_gotFileSystem",Downloader.onGotFileSystem,!1),document.removeEventListener("DOWNLOADER_gotFolder",Downloader.onGotFolder,!1),document.removeEventListener("DOWNLOADER_downloadSuccess",Downloader.onDownloadSuccess,!1),document.removeEventListener("DOWNLOADER_unzipSuccess",Downloader.onUnzipSuccess,!1),document.removeEventListener("DOWNLOADER_fileCheckSuccess",Downloader.onCheckSuccess,!1))},onUnzipSuccess:function(e){var o=e.data[0];Downloader.isAutoRemove()&&Downloader.removeFile(o),Downloader.unzipNextInQueue()||(Downloader.unzipping=!1,Downloader.fileObjectInUnzipProgress=null)},onCheckSuccess:function(e){var o=e.data[1];Downloader.isAutoUnzip()&&Downloader.isZipFile(o)&&Downloader.unzip(o)},onGotFileSystem:function(e){e.target.removeEventListener(e.name,Downloader.onGotFileSystem);var o=e.data[0];Downloader.fileSystem=o,Downloader.getFolder(o,Downloader.localFolder)},onGotFolder:function(e){e.target.removeEventListener(e.name,Downloader.onGotFolder);var o=e.data[0];Downloader.localFolder=o,Downloader.initialized=!0,Downloader.isNoMedia()&&Downloader.touchNoMedia(),document.dispatchEvent(createEvent("DOWNLOADER_initialized"))},"interface":{obj:null,init:function(e){return e.folder?(e=e||{},Downloader.initialize(e),void(Downloader["interface"].obj=Downloader)):void console.error("You have to set a folder to store the downloaded files into.")},get:function(e,o){return e?Downloader.isWifiOnly()&&!Downloader.isWifiConnection()?void document.dispatchEvent(createEvent("DOWNLOADER_noWifiConnection")):Downloader.load(e,o):void console.error("You have to specify a url where the file is located you wanna download")},getMultipleFiles:function(e){if(Downloader.isWifiOnly()&&!Downloader.isWifiConnection())return void document.dispatchEvent(createEvent("DOWNLOADER_noWifiConnection"));for(var o=0;o<e.length;o++){var n=e[o];Downloader.load(n.url,n.md5)}},abort:function(){Downloader.abort()},isInitialized:function(){return Downloader.isInitialized()},setWifiOnly:function(e){Downloader.setWifiOnly(e)},setNoMedia:function(e){Downloader.setNoMedia(e)},setAutoUnzip:function(e){Downloader.setAutoUnzip(e)},setAutoCheck:function(e){Downloader.setAutoCheck(e)},setRemoveAfterUnzip:function(e){Downloader.setRemoveAfterUnzip(e)}}};module.exports=Downloader["interface"];
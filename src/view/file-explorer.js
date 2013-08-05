//////////////////////////////////////////////////
// Silex, live web creation
// http://projects.silexlabs.org/?/silex/
// 
// Copyright (c) 2012 Silex Labs
// http://www.silexlabs.org/
// 
// Silex is available under the GPL license
// http://www.silexlabs.org/silex/silex-licensing/
//////////////////////////////////////////////////

goog.provide('silex.view.FileExplorer');


goog.require('goog.async.Delay');

//////////////////////////////////////////////////////////////////
// FileExplorer class
//////////////////////////////////////////////////////////////////
/**
 * the Silex FileExplorer class
 * @constructor
 * based on http://www.inkfilepicker.com/
 * load the template and make it a FileExplorer
 * this is only the UI part, to let user choose a file in the cloud
 * @see silex.service.CloudStorage 	for the service/network part
 */
silex.view.FileExplorer = function(element, cbk){
	var that = this;
	this.element = element;
	this.element.style.display = 'none';

	if (cbk) {
		new goog.async.Delay(function () {
			cbk();
			that.init();
		}, 10).start();
	}

/*	silex.Helper.loadTemplateFile('templates/fileexplorer.html', element, function(){
		that.init();
		if (cbk) cbk();
	});
*/
}
/**
 * Contant for file picker config
 */
silex.view.FileExplorer.CONTAINER_TYPE = 'modal';
/**
 * Contant for file picker config
 */
silex.view.FileExplorer.SERVICES = ["DROPBOX", "GOOGLE_DRIVE", "EVERNOTE", "FTP"];
/**
 * reference to the filepicker instance
 */
silex.view.FileExplorer.prototype.filePicker;
/**
 * reference to the attached element
 */
silex.view.FileExplorer.prototype.element;
/**
 * callback for FileExplorer events, set by the controller
 *
silex.view.FileExplorer.prototype.onFileExplorerEvent;
/**
 * init file explorer
 */
silex.view.FileExplorer.prototype.init = function(){
	this.filePicker = silex.service.CloudStorage.getInstance().filePicker;
}
/**
 * pick a file
 * @param opt_mimetypes 	optional array of accepted mimetypes, e.g. ['text/html', 'text/plain']
 */
silex.view.FileExplorer.prototype.openDialog = function(cbk, opt_mimetypes){
	// default is image
	if (!opt_mimetypes) opt_mimetypes = ['image/*', 'text/plain'];

	// pick it up
	this.filePicker.pick(
	goog.bind(function(blob){
		// hide dialog
		this.closeEditor();

		// notify controller
		blob.url = blob.url.replace('https://', 'http://');
		// workaround: cloud explorer issue https://github.com/silexlabs/cloud-explorer/issues/2
		new goog.async.Delay(function () {
			if (cbk) cbk(blob);
		}, 10, this).start();
	}, this),
	function(FPError){
		console.error(FPError);
	});
	// show dialog
	this.openEditor();
}
/**
 * save as dialog
 * @param opt_mimetypes 	optional array of accepted mimetypes, e.g. ['text/html', 'text/plain']
 */
silex.view.FileExplorer.prototype.saveAsDialog = function(cbk, opt_mimetypes){
	// default is html
	if (!opt_mimetypes) opt_mimetypes = ['text/html', 'text/plain'];

	// export dummy data
	this.filePicker.exportFile( "http://google.com/", 
	goog.bind(function(blob){

		// hide dialog
		this.closeEditor();

		// notify controller
		blob.url = blob.url.replace('https://', 'http://');
		// workaround: cloud explorer issue https://github.com/silexlabs/cloud-explorer/issues/2
		new goog.async.Delay(function () {
			if (cbk) cbk(blob);
		}, 10, this).start();
	}, this),
	function(FPError){
		console.error(FPError);
	});
	// show dialog
	this.openEditor();
}
/**
 * open editor 
 * this is private method, do not call it
 */
silex.view.FileExplorer.prototype.openEditor = function(){
	// background
	var background = goog.dom.getElementByClass('dialogs-background');
	// show
	goog.style.setStyle(background, 'display', 'inherit');
	this.element.style.display = null;
	// close
	goog.events.listen(background, goog.events.EventType.CLICK, this.closeEditor, true, this);
}
/**
 * close editor 
 * this is private method, do not call it
 */
silex.view.FileExplorer.prototype.closeEditor = function(){
	// background
	var background = goog.dom.getElementByClass('dialogs-background');
	// hide
	goog.style.setStyle(background, 'display', 'none');
	this.element.style.display = 'none';
	// close
	goog.events.unlisten(background, goog.events.EventType.CLICK, this.closeEditor, true, this);
}
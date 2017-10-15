// Requires
const { app, BrowserWindow } = require('electron');
const { dialog } = require('electron');
const lodash = require('lodash');
const eRouter = require('electron-router');
const fs = require('fs');

let dirs = {
	root : __dirname,
	rootApp : __dirname+'/app',
	view : __dirname+'/app/view',
	helper : __dirname+'/app/helper',
	core : __dirname+'/app/core',
	logs : __dirname+'/app/logs',
	model : __dirname+'/app/model',
	controller : __dirname+'/app/controller',
	viewCore : __dirname+'/app/viewCore',
	window : __dirname+'/app/window',
	winMain : __dirname+'/app/window/main',
	assets : __dirname+'/app/assets',
	assetsFont_awesome : __dirname+'/app/assets/font-awesome',
	assetsJs : __dirname+'/app/assets/js',
	assetsCss : __dirname+'/app/assets/css',
	assetsImg : __dirname+'/app/assets/img',
	assetsFonts : __dirname+'/app/assets/fonts'
}

// Router
let mainRouter = eRouter('main');

// Custom events
mainRouter.on('main::killApp', () => {
	app.quit();
});

let Core;
// Requiere Core
app.on('ready', () => {
	Core = require('./app/core/Core.js');
	Core.init (
		app, 
		BrowserWindow, 
		dialog,
		fs,
		lodash,
		eRouter,
		dirs
		);
});

app.on('before-quit', () => {
	if (typeof Core.db == "object") {
		Core.closeDB();
	}
});
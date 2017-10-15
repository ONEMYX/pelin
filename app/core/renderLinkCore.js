window.nodeRequire = require;
delete window.require;
delete window.exports;
delete window.module;
let { remote } = nodeRequire("electron");
let core = remote.getGlobal("renderCore");
console.log(core);
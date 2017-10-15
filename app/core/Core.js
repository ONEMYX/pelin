let _ = null; // lodash

let Core = function () {
    this.console = (v_data) => {
        console.log(v_data)
    };
    this.init = (/*Electron.app*/ app, 
        /*Electron.BrowserWindow*/ BrowserWindow,
        /*Electron.Dialog*/ dialog,
        /* fs */ fs,
        /*_.LoDashStatic*/ lodash,
        /* electron-router */ eRouter,
        /*object dirs*/ dirs) => {

        this.app = app;
        this.BrowserWindow = BrowserWindow;
        this.dialog = dialog;
        this.dirs = dirs;
        this.lodash = _ = lodash;
        this.fs = fs;
        this.eRouter = eRouter;

        // Loader
        this.loader("node", "path", ["path"]);
        this.loader("node", "url", ["url"]);
        this.loader("node", "ejs-electron", ["ejse"]);
        this.loader("node", "ejs", ["ejsRender"]);
        this.loader("node", "sqlite-sync", ["sqlite"]);
        this.loader("node", "squel", ["qb"]); 
        this.loader("node", "request", ["request"]); 

        // queryBuilder
        this.qbSelect = this.qb.select;
        this.qbUpdate = this.qb.update;
        this.qbInsert = this.qb.insert;
        this.qbDelete = this.qb.delete;

        // Router Core
        this.router = eRouter("core");

        // config config.json | app.json
        this.config.init();
        this.config.set("app", {path : dirs});
        this.configData = this.config.get();
        
        this.renderCore = {};
        this.windows = {};

        this.runRoute("core", this.router);

        this.requireController();
        this.requireModel();
        
        this.connectDB();

        this.controller.main.index();

        this.done = false;
        let thisCore = this;
        let callback = function (err, resp, body) {
            thisCore.done = true;
            console.log(body);
        };
        this.webRequest("post", "http://localhost/teste/t3.php", false, {data:"batata"}, callback);
        while(!this.done) {};
        console.log("D");
    };
    this.loader = (type, _name, nameInstance = [], toRenderCore = false) => {
        let _module = [];
        if (_name) {
            let _dir;
            switch (type) {
                case "node":
                    try {
                        _module = require(_name);
                    } catch(e){}
                    break;
                case "controller":
                    _name = _.upperFirst(_name);
                    _dir = `${this.dirs.controller}/${_name}/${_name}Controller.js`;
                    if (this.fs.existsSync(_dir)) {
                        _module = require(_dir);
                    }
                    break;
                case "model":
                    _name = _.upperFirst(_name);
                    _dir = `${this.dirs.model}/${_name}/${_name}Model.js`;
                    if (this.fs.existsSync(_dir)) {
                        _module = require(_dir);
                    }
                    break;
                case "helper":
                    _dir = `${this.dirs.helper}/${_name}/index.js`;
                    if (this.fs.existsSync(_dir)) {
                        _module = require(_dir);
                    }
                    break;
                case "core":
                    _name = _.upperFirst(_name) + ".js";
                    _dir = `${this.dirs.core}/${_name}`;
                    if (this.fs.existsSync(_dir)) {
                        _module = require(_dir);
                    }
                    break;
            }
        }
        if (typeof nameInstance == "object" && nameInstance.length > 0) {
            let thisCore = this;
            let path = "thisCore";
            let pathClone = "thisCore.renderCore";
            _.forEach(nameInstance, function(v, k) {
                if (k == (nameInstance.length - 1)) {
                    path += `["${v}"] = _module`;
                    pathClone += `["${v}"] = _module`;
                    eval(path);
                    if (toRenderCore) {
                        eval(pathClone);
                    }
                } else {
                    path += `["${v}"]`;
                    pathClone += `["${v}"]`;
                    eval(`${path} = ${path} ? ${path} : {}`);
                    if (toRenderCore) {
                        eval(`${pathClone} = ${pathClone} ? ${pathClone} : {}`);
                    }
                } 
            });
        }
        return _module;
    };
    this.runRoute = (type, obj_Route, _name) => {
        let _routes = null;
        let _dir;
        switch (type) {
            case "controller":
                _name = _.upperFirst(_name);
                _dir = `${this.dirs.controller}/${_name}/routes.js`;
                if (this.fs.existsSync(_dir)) {
                    _routes = require(_dir);
                }
                break;
            case "model":
                _name = _.upperFirst(_name);
                _dir = `${this.dirs.model}/${_name}/routes.js`;
                if (this.fs.existsSync(_dir)) {
                    _routes = require(_dir);
                }
                break;
            case "helper":
                _dir = `${this.dirs.helper}/${_name}/routes.js`;
                if (this.fs.existsSync(_dir)) {
                    _routes = require(_dir);
                }
                break;
            case "core":
                _name = "routes.js";
                _dir = `${this.dirs.core}/${_name}`;
                if (this.fs.existsSync(_dir)) {
                    _routes = require(_dir);
                }
                break;
        }       
        if (_routes && obj_Route) {
            let route = new _routes();            
            route.run(obj_Route);
        }
    };
    this.config = {
        init : ()  => {
            this.loader("helper", "Jsonfile", ["jsonF"]);
            this.loader("node", "merge-json", ["mergeJSON"]);
        },
        get : (type = null) => {
            let config;
            let app;
            switch (type) {
                case "config":
                    config = this.jsonF.read(`${this.dirs.root}/config.json`, true);                    
                    break;
                case "app":
                    app = this.jsonF.read(`${this.dirs.root}/app.json`, true);
                    break;
                default:
                    config = this.jsonF.read(`${this.dirs.root}/config.json`, true);
                    app = this.jsonF.read(`${this.dirs.root}/app.json`, true);
                    break;
            }
            let resultConfig = {
                app : app,
                config : config
            }
            if (type) return resultConfig[type];
            else  return resultConfig;
        },
        write : (type, data) => {
            if (typeof data != "object") return false;
            switch (type) {
                case "config":
                    this.jsonF.write(`${this.dirs.root}/config.json`, data);
                    break;
                case "app":
                    this.jsonF.write(`${this.dirs.root}/app.json`, data);
                    break;
            }
        },
        set : (type, data) => {
            if (type == "app" || app == "config") {
                let actData = this.config.get(type);
                let newData = this.mergeJSON.merge(actData, data);
                this.config.write(type, newData);
            }
        },
        del : (type, path) => {
            if ((type == "app" || app == "config") && typeof path == "object" && path.length > 0) {
                let obj;
                let pathDelete = "obj";
                // Get config/app data
                switch (type) {
                    case "config":
                        obj = this.jsonF.read(`${this.dirs.root}/config.json`, true);
                        break;
                    case "app":
                        obj = this.jsonF.read(`${this.dirs.root}/app.json`, true);
                        break;
                }
                // Mount path of object
                _.forEach(path, function(v, k) {
                    if (typeof eval(pathDelete) != "undefined") {
                        pathDelete += `["${v}"]`;
                    }
                });
                if (typeof eval(pathDelete) != "undefined") {
                    eval(`delete ${pathDelete}`); // remove item
                }
                
                // save config/app
                if (typeof obj != "object") return false;
                switch (type) {
                    case "config":
                        this.jsonF.write(`${this.dirs.root}/config.json`, obj);
                        break;
                    case "app":
                        this.jsonF.write(`${this.dirs.root}/app.json`, obj);
                        break;
                }
            }
        }
    };
    this.requireController = () => {
        let configData = this.config.get("config");
        let thisCore = this;
        if (typeof this.configData.config.Controllers == "undefined" || typeof this.configData.config.Controllers != "object" || 
            typeof this.configData.config.Controllers == "object" && this.configData.config.Controllers.length == 0) {
            this.dialog.showMessageBox({
                type : "error",
                title : "Erro interno",
                message : "Erro interno no carregamento das Controllers",
                detail : "Não foi encontrato a lista de Controllers a serem carregadas!"
            });
            this.router.send("main::killApp");
            return;
        }
        _.forEach(this.configData.config.Controllers, function(v, k) {
            thisCore.loader("controller", v[0], ["controller", v[0]], v[1]);
        });
        if (Object.keys(this.controller).length != this.configData.config.Controllers.length) {
            this.dialog.showMessageBox({
                type : "error",
                title : "Erro interno",
                message : "Erro interno no carregamento das Controllers",
                detail : "Não foi carregado todas as Controllers necessárias"
            });
            this.router.send("main::killApp");
            return;
        }
        _.forEach(this.controller, function(v, k) {
            v.init(thisCore);
        });
    };
    this.requireModel = () => {
        let configData = this.config.get("config");
        let thisCore = this;
        if (typeof this.configData.config.Models == "undefined" || typeof this.configData.config.Models != "object" || 
            typeof this.configData.config.Models == "object" && this.configData.config.Models.length == 0) {
            this.dialog.showMessageBox({
                type : "error",
                title : "Erro interno",
                message : "Erro interno no carregamento das Models",
                detail : "Não foi encontrato a lista de Models a serem carregadas!"
            });
            this.router.send("main::killApp");
            return;
        }
        _.forEach(this.configData.config.Models, function(v, k) {
            thisCore.loader("model", v[0], ["model", v[0]], v[1]);
        });
        if (Object.keys(this.model).length != this.configData.config.Models.length) {
            this.dialog.showMessageBox({
                type : "error",
                title : "Erro interno",
                message : "Erro interno no carregamento das Models",
                detail : "Não foi carregado todas as Models necessárias"
            });
            this.router.send("main::killApp");
            return;
        }
        _.forEach(this.model, function(v, k) {
            v.init(thisCore);
        });
    };
    this.window = (_name, act, param) => {
        if (_name && act && typeof param == "object") {
            if (act = "init") {
                if (typeof this.windows[_name] == "undefined") {
                    this.windows[_name] = new this.BrowserWindow(param);
                }
                this.windows[_name].on('closed', () => {
                    delete this.windows[_name];
                });
                return this.windows[_name];
            } else if ("kill") {
                delete this.windows[_name];
            }
        }

    };
    this.cloneCore = () => {
        // functions
        this.renderCore.loader = this.loader,
        this.renderCore.config = {
            get : this.config.get
        };

        // property
        this.renderCore.configData = this.configData;
        this.renderCore.dialog = this.dialog,
        this.renderCore.dirs = this.dirs,
        this.renderCore.lodash = this.lodash,
        this.renderCore.fs = this.fs,
        this.renderCoreeRouter = this.eRouter;
        global.renderCore = this.renderCore;
        return this.renderCore;
    };
    this.connectDB = () => {
        if (typeof this.db == "undefined") {
            let _dir = `${this.dirs.model}/database/${this.configData.config.database.filename}`;
            if (this.fs.existsSync(_dir)) {
                this.db = this.sqlite.connect(_dir);
                return this.db;
            } else {
                return false;
            }
        } else {
            return this.db;
        }
    };
    this.closeDB = () => {
        if (typeof Core.db == "object") {
            this.db.close();
            delete thid.db;
        }
    };
    this.view = (window, file, data) => {
        let _dir = `${this.dirs.window}/${window}/content/${file}.ejs`;
        let contentHTML;
        if (this.fs.existsSync(_dir)) {
            contentHTML = this.fs.readFileSync(_dir, { encoding: 'utf8' });
            try {
                return this.ejsRender.render(contentHTML, data);   
            } catch (error) {
                _dir = `${this.dirs.window}/${window}/common/500.ejs`
                if (this.fs.existsSync(_dir)) {
                    contentHTML = this.fs.readFileSync(_dir, { encoding: 'utf8' });
                    try {
                        return this.ejsRender.render(contentHTML, {
                            dirs: this.dirs,
                            message : "Erro ao carregar página"
                        });   
                    } catch (error) {
                        return "se vira";
                    }
                }
            }
        }
        return "";
    };
    this.webRequest = (method, url, sync, data = {}, callback) => {
        method = _.toLower(method);
        if (url && (method == "get" || method == "post" || method == "put" || method == "delete")) {
            if (sync) {
                let response = this.snQ.addJob(function (url, cb) {
                    this.request[method]({
                       url: url,
                       form : data
                    },
                    function (err, resp, body) {
                       if (err) { cb(err, null) }
                       cb(null, { response : resp, body : body })
                    })
                });
                return response;
            } else {                
                this.request[method]({
                       url: url,
                       form : data
                    },
                    callback
                );
            }
        }
    }
}

module.exports = new Core();

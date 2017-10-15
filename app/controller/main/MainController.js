var Main = function () {
    this.init = (appCore) => {
        this.core = appCore;
        this.router = appCore.eRouter("mainController");
        appCore.runRoute("controller", this.router, "main");
    }
    this.index = () => {
        this.core.ejse.data({
            dirs : this.core.dirs,
            config : this.core.configData.config,
            app : this.core.configData.app
        }).listen();
        let mainWindow = this.core.window("main", "init", {
            width: 1200,
            height: 800,
            show: false
        }); 
        this.core.cloneCore();
        mainWindow.loadURL(this.core.url.format({
            pathname: this.core.path.join(this.core.dirs.window, '/main/index.ejs'),
            protocol: 'file:',
            slashes: true
        }));
        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
        });
    };
    this.pageHome = () => {
        let configList = this.core.model.config.getAll();
        return this.core.view("main", "main", {content:configList});
    }
};


module.exports = new Main();
var About = function () {
    this.init = (appCore) => {
        this.core = appCore;
        this.router = appCore.eRouter("aboutController");
        appCore.runRoute("controller", this.router, "about");
        this.counter = 0;
    }
    this.index = () => {

    };
    this.pageAbout = () => {
        this.counter++;
        return this.core.view("main", "minor", {content:this.counter});
    }
};


module.exports = new About();
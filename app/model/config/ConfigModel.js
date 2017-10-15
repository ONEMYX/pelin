var ConfigModel = function () {
    this.table = "config";

    this.init = (appCore) => {
        this.core = appCore;
        this.router = appCore.eRouter("configModel");
        appCore.runRoute("model", this.router, "config");
        this.db = appCore.connectDB();
    };
    this.getAll = () => {
        let q = this.core.qbSelect()
            .from(this.table)
            .field('*')
            .toString();
        return this.db.run(q);
    };
    this.set = (key, value) => {
        if (key && typeof key == "string" && value && typeof value == "string") {
            let q = this.core.qbInsert()
                .into(this.table)
                .set("key", key)
                .set("value", value)
                .toString();
            let result = this.db.run(q);
            if (result.error) {
               console.log(result.error);
            }
        }
    };
};


module.exports = new ConfigModel();
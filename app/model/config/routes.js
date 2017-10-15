module.exports = function () {
    this.run = (route) => {
        route.on('configModel::console', (data) => {
            console.log(data);
        });
    }
};


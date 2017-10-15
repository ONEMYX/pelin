module.exports = function () {
    this.run = (route) => {
        route.on('core::console', (data) => {
            console.log(data);
        });
    }
};


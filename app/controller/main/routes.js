module.exports = function () {
    this.run = (route) => {
        route.on('mainController::console', (data) => {
            console.log(data);
        });
    }
};


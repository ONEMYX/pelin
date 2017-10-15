module.exports = function () {
    this.run = (route) => {
        route.on('aboutController::console', (data) => {
            console.log(data);
        });
    }
};


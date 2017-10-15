function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
   $urlRouterProvider.otherwise("/index/main");
    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: core.dirs.winMain + "/common/content.ejs",
        })
        .state('index.main', {
            url: "/main",
            template: function() { return core.controller.main.pageHome(); },
            data: { pageTitle: 'Example Main' }
        })
        .state('index.minor', {
            url: "/minor",
            template: function() { return core.controller.about.pageAbout(); },
            data: { pageTitle: 'Example Minor' }
        })
}
angular
    .module(core.configData.app.appModule)
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });

/**
 * Created by Diomede on 09/05/2017.
 */
angular.module('ToDoApp', ['ngRoute', 'RouteControllers','UserService','angular-storage','TodoService','TodoDirective']);

angular.module('ToDoApp').config(function($locationProvider, $routeProvider){

    $locationProvider.html5Mode(true);

    $routeProvider.when('/',{
        templateUrl: 'templates/home.html',
        controller: 'HomeController'

    })
        .when('/accounts/register', {
            templateUrl:'templates/register.html',
            controller:'RegisterController'

        })

        .when('/todo', {

            templateUrl: 'templates/todo.html',
            controller: 'TodoController'
    })

        .when('/todo/edit/:id', {
            templateUrl:'templates/edit-todo.html',
            controller: 'EditTodoController'

    })

    .when('/accounts/login',{

        templateUrl: 'templates/login.html',
        controller: 'LoginController'

    })

});
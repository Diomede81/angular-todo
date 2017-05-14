/**
 * Created by Diomede on 09/05/2017.
 */
angular.module('RouteControllers',[])
.controller('HomeController',function($scope){

    $scope.title = "Welcome To Angular Todo!!";


})

.controller('RegisterController',function($scope, $location, UserAPIService ,store,$window){


    $scope.registrationUser={};


    var URL = "https://morning-castle-91468.herokuapp.com/";


    $scope.login = function(){
        UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results){
            $scope.token = results.data.token;
            console.log($scope.token);
            store.set('username', $scope.registrationUser.username);
            store.set('authToken', $scope.token);

        }).catch(function(err){

            console.log(err.data);
        });
    };

    $scope.refreshRegistration = function(){
        $location.path("/todo");
        $window.location.reload();
    };


    $scope.submitForm = function(){

        if ($scope.registrationForm.$valid){
            $scope.registrationUser.username = $scope.user.username;
            $scope.registrationUser.password = $scope.user.password;

            UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results){
                $scope.data = results.data;
                $location.path("todo");
                alert("You have successfully Registered to Angular ToDo");
                $scope.login();
                $scope.refreshRegistration();
            }).catch(function(err){
                alert("Oops! You must be already registered, please log in instead");
                $location.path("/accounts/login");
                console.log(err);
            });
        }
    };

})

.controller('TodoController',function($scope,$http,$location, TodoAPIService, store, $window) {



        var URL = "https://morning-castle-91468.herokuapp.com/";

        $scope.authToken = store.get('authToken');
        $scope.username = store.get('username');

        if ($scope.authToken !== null ) {

            $scope.todos = [];

            $scope.editTodo = function (id) {
                $location.path("/todo/edit/" + id);
            };

            $scope.deleteTodo = function (id) {
                TodoAPIService.deleteTodo(URL + "todo/" + id, $scope.username, $scope.authToken).then(function (results) {
                    window.location.reload();
                    console.log(results);
                }).catch(function (err) {
                    console.log(err);
                });
            };


            TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function (results) {

                $scope.todos = results.data || [];
                console.log($scope.todos);
            }).catch(function (err) {
                console.log(err);
            });


            $scope.submitForm = function () {
                if ($scope.todoForm.$valid) {
                    $scope.todo.username = $scope.username;
                    $scope.todos.push($scope.todo);

                    TodoAPIService.createTodo(URL + "todo/", $scope.todo, $scope.authToken).then(function (results) {
                        console.log(results);
                        $window.location.reload();
                    }).catch(function (err) {

                        console.log(err);
                    });
                }
            };
        } else {

            $location.path("/accounts/register");
        }
   })

.controller('EditTodoController', function($scope, $location, $routeParams,TodoAPIService,store){

    var id = $routeParams.id;
    var URL = "https://morning-castle-91468.herokuapp.com/";

    TodoAPIService.getTodos(URL + "todo/" +id, $scope.username, store.get('authToken')).then(function(results){

        $scope.todo = results.data
    }).catch(function(err){
        console.log(err);

    });

    $scope.submitForm = function(){
        if ($scope.todoForm.$valid){
            $scope.todo.username = $scope.username;

            TodoAPIService.editTodo(URL + "todo/" + id, $scope.todo, store.get('authToken')).then(function(results){

                $location.path("/todo");
            }).catch(function(err){
                console.log(err);

            })
        }
    }
})

.controller('LoginController', function($scope, $location,store, UserLogin,$window){

    var URL = "https://morning-castle-91468.herokuapp.com/";



    $scope.loginUser = {};

    $scope.refreshLogin = function(){
        $location.path("todo");
        $window.location.reload();
    };

    $scope.submitForm = function(){

        if ($scope.loginForm.$valid){
            $scope.loginUser.username = $scope.user.username;
            $scope.loginUser.password = $scope.user.password;

            UserAPIlogin.authLogin(URL + "accounts/api-token-auth/", $scope.loginUser).then(function(results){
                $scope.data = results.data;
                $scope.token = results.data.token;
                store.set('username', $scope.loginUser.username);
                store.set('authToken', $scope.token);
                $scope.refreshLogin();
                alert("You have successfully Logged-in to Angular ToDo");

            }).catch(function(err){
                alert("Oops! You probably are not registered yet, please register!");
                $location.path("/accounts/register");
                console.log(err);
            });
        }
    };
})

.controller('LogOutController', function($scope, $location,store,$timeout, $window){

    $scope.logOut = store.get('authToken');
    $scope.username = store.get('username');

    $scope.greeting = ("Hello " + $scope.username + "!!!");


    $scope.removeLogin = function(){
        var refresh = function(){$location.path("/"); $window.location.reload();};
        store.remove('username');
        store.remove('authToken');
        $location.path("/accounts/logOut");
        $timeout(refresh,3000);
    }
});
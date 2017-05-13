/**
 * Created by Diomede on 09/05/2017.
 */
angular.module('RouteControllers',[])
.controller('HomeController',function($scope,$window){

    $scope.title = "Welcome To Angular Todo!!";


})

.controller('RegisterController',function($scope, $location, UserAPIService ,store){


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

    $scope.submitForm = function(){

        if ($scope.registrationForm.$valid){
            $scope.registrationUser.username = $scope.user.username;
            $scope.registrationUser.password = $scope.user.password;

            UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results){
                $scope.data = results.data;
                $location.path("/todo");
                console.log($scope.token);
                alert("You have successfully Registered to Angular ToDo");
                $scope.login();
                $scope.logout=true;
            }).catch(function(err){
                alert("Oops! Something Went Wrong!");
                console.log(err);
            });
        }
    };

})

.controller('TodoController',function($scope,$http,$location, TodoAPIService, store) {

        var URL = "https://morning-castle-91468.herokuapp.com/";

        $scope.authToken = store.get('authToken');
        $scope.username = store.get('username');

        $scope.todos = [];

        $scope.editTodo = function (id) {
            $location.path("/todo/edit/" + id);
        };

        $scope.deleteTodo = function (id) {
            TodoAPIService.deleteTodo(URL + "todo/" + id, $scope.username, $scope.authToken).then(function (results) {

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
                    (function () {
                        TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function (results) {
                            $scope.todos = results.data || [];
                            console.log($scope.todos);

                        }).catch(function (err) {
                            console.log(err);
                        })
                    })();

                }).catch(function (err) {

                    console.log(err);
                });
            }
        };
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
        $location.path("/todo");
        /*$window.location.reload();*/
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
                alert("Oops! Something Went Wrong!");
                console.log(err);
            });
        }
    };
})

.controller('LogOutController', function($scope, $location,store,$timeout, $window){

    $scope.logOut = store.get('authToken');

    $scope.removeLogin = function(){
        var refresh = function(){$location.path("/"); $window.location.reload();};
        store.remove('username');
        store.remove('authToken');
        $location.path("/accounts/logOut");
        $timeout(refresh,3000);
    }
});
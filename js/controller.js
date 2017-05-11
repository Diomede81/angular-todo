/**
 * Created by Diomede on 09/05/2017.
 */
angular.module('RouteControllers',[])
.controller('HomeController',function($scope){

    $scope.title = "Welcome To Angular Todo!!";

})

.controller('RegisterController',function($scope, $location, UserAPIService ,store){


    $scope.registrationUser={};

    var authStorage = {

        name:"storageTest"
    };

    var URL = "https://morning-castle-91468.herokuapp.com/";


    $scope.login = function(){
        UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results){
            console.log(results);
            $scope.token = results.data.token;
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
                console.log(results.data);
                alert("You have successfully Registered to Angular ToDo");
                $scope.login();

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

});

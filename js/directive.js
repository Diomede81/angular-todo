/**
 * Created by Diomede on 11/05/2017.
 */
angular.module('TodoDirective',[]).directive('todoTable',function(){

    return{
        restrict:'E',
        templateUrl:'/angular-todo/templates/directives/todo-table.html'
    };

})

.directive ('navbar', function(){

    return{
        restrict:'E',
        templateUrl:'/angular-todo/templates/directives/navbar.html'
    }

});

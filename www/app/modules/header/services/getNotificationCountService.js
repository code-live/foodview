'use strict';
headerModule.service('getNotificationCountService',['serviceFactory','$http','$log','$q','$state','$rootScope',function(serviceFactory,$http,$log,$q,$state,$rootScope) {

        this.serverUrl="getNotificationCount";
        this.httpurl=null;
        this.responseData=null;
        this.notificationCount = 0;
        this.getNotificationCountRequest=function(data)
        {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

          var me=this;
          var deferred = $q.defer();
          this.httpurl=serviceFactory.getUrl(this.serverUrl);
          var url =this.httpurl;

          var request = serviceFactory.getPacket(this.serverUrl,data,'GET');
          var method =  serviceFactory.getMethod();
          this.responseData=null;

          var resource = $http(request);
          resource.then(
            function(response) {
              //Success Callback
              if (typeof response === 'object') {
                var jsondata=me.doConvertJsonData(response);
                me.notificationCount = jsondata.data.Count;
                return deferred.resolve(jsondata);
              } else {
                // invalid response
                return deferred.reject(response);
              }

            },
            function(response) {
              //Failure callback errros.
               $rootScope.spinner.hideSpinner();
              return deferred.reject(response);
            },
            function(updates) {
              deferred.update(updates);
            }
          );

          return deferred.promise;
        };


    this.doConvertJsonData=function(response)
    {
      console.log(response);
      var responseText="";
      var status=response.Status;
      /*var data= {

       "Status":status, //hard coded now
       "PeopleKey":response.PeopleKey
       };

       angular.forEach(response.Details, function(record) {

       responseText=record.ResponseText;

       });*/
      this.responseData=response;
      return this.responseData;
    };

}]);

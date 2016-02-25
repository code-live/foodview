(function() {
  'use strict';

  angular
    .module('foodview')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();

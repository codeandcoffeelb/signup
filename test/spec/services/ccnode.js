'use strict';

describe('Service: CCNode', function () {

  // load the service's module
  beforeEach(module('signupApp'));

  // instantiate service
  var CCNode;
  beforeEach(inject(function (_CCNode_) {
    CCNode = _CCNode_;
  }));

  it('should do something', function () {
    expect(!!CCNode).toBe(true);
  });

});

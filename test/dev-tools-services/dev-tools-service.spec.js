import {spy} from 'sinon';
import {mock} from 'angular';
import {expect} from 'chai';

describe('src/dev-tools-services/DevToolsServiceProvider', function () {
  beforeEach(function () {
    mock.module('ngReduxDevToolsServices', function ($ngReduxProvider) {
      $ngReduxProvider.createStoreWith(spy());
    });

    mock.inject(function ($injector) {
      this.devToolsService = $injector.get('devToolsService');
    });
  });

  describe('#prototype.updateTarget()', function () {
    it('should call target if it is a function', function () {
      // Given
      const target = spy();
      const stateSlice = {};
      const dispatch = spy();

      // When
      this.devToolsService.updateTarget(target, stateSlice, dispatch);

      // Then
      expect(target).to.have.been.calledWith(stateSlice, dispatch);
    });

    it('should assign state and dispatch to target if object', function () {
      // Given
      const target = {};
      const stateSlice = {foo: 'bar'};
      const dispatch = {baz: 'qux'};

      // When
      this.devToolsService.updateTarget(target, stateSlice, dispatch);

      // Then
      expect(target).to.deep.equal({foo: 'bar', baz: 'qux'});
    });
  });
});

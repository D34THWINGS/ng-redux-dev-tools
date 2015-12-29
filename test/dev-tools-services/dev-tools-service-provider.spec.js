import {stub, spy} from 'sinon';
import {mock} from 'angular';
import {expect} from 'chai';

describe('src/dev-tools-services/DevToolsServiceProvider', function () {
  beforeEach(function () {
    mock.module('ngReduxDevToolsServices', devToolsServiceProvider => {
      this.devToolsServiceProvider = devToolsServiceProvider;
    });

    mock.inject(function () {});
  });

  describe('#prototype.registerReducer()', function () {
    it('should add given reducer to internal reducers list', function () {
      // When
      this.devToolsServiceProvider.registerReducer('foo');

      // Then
      expect(this.devToolsServiceProvider.monitorReducers).to.deep.equal(['foo']);
    });
  });

  describe('#prototype.computeNextEntry()', function () {
    it('should return entry with error if present', function () {
      // Given
      const error = {};
      const state = {};

      // When
      const entry = this.devToolsServiceProvider.computeNextEntry({}, {}, state, error);

      // Then
      expect(entry).to.deep.equal({state, error: 'Interrupted by an error up the chain'});
    });

    it('should call the reducer with given state and action', function () {
      // Given
      const reducer = spy();
      const action = {};
      const state = {};

      // When
      this.devToolsServiceProvider.computeNextEntry(reducer, action, state);

      // Then
      expect(reducer).to.have.been.calledWith(state, action);
    });

    it('should return an entry with next state', function () {
      // Given
      const action = {};
      const state = {};

      // When
      const entry = this.devToolsServiceProvider.computeNextEntry(stub().returns(state), action, state);

      // Then
      expect(entry).to.deep.equal({state, error: undefined}); // eslint-disable-line no-undefined
    });
  });

  describe('#prototype.liftReducer()', function () {
    it('should return lifted reducer that call every monitor reducer', function () {
      // Given
      const monitorReducer1 = stub().returns('bar');
      const monitorReducer2 = spy();
      this.devToolsServiceProvider.monitorReducers = [monitorReducer1, monitorReducer2];
      stub(this.devToolsServiceProvider, 'liftReducerWith').callsArgWith(2, 'foo');

      // When
      this.devToolsServiceProvider.liftReducer('hello', 'world');

      // Then
      expect(this.devToolsServiceProvider.liftReducerWith).to.have.been.calledWith('hello', 'world');
      expect(monitorReducer1).to.have.been.calledWith('foo');
      expect(monitorReducer2).to.have.been.calledWith('bar');
    });
  });

  describe('#prototype.instrument()', function () {
    it('should return a store enhancer', function () {
      // Given
      const createStore = spy();
      const reducer = spy();
      stub(this.devToolsServiceProvider, 'liftReducer').returns('foo');
      stub(this.devToolsServiceProvider, 'unliftStore').returns('bar');

      // When
      const enhancer = this.devToolsServiceProvider.instrument();

      // Then
      expect(enhancer).to.be.a('function');
      expect(enhancer(createStore)).to.be.a('function');
      expect(enhancer(createStore)(reducer, {})).to.equal('bar');
      expect(createStore).to.have.been.calledWith('foo');
    });
  });
});

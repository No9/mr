import * as mr from '../index';
import { Flux } from 'flummox';
import FluxComponent from 'flummox/component';
import React from 'react';
import RendererContainer from '../renderer/container';

class QueriesFlux extends Flux {
  constructor() {
    super();

    this.queries = {};
  }

  createQueries(name, klass) {
    this.queries[name] = new klass(this);
  }

  getQueries(name) {
    return this.queries[name];
  }
}

export default class AppFlux extends QueriesFlux {
  constructor() {
    super();

    this.createActions('publication', mr.Publication.Actions);
    this.createQueries('publication', mr.Publication.Queries);
    this.createStore('publication', mr.Publication.Store, this);

    this.createActions('renderer', mr.Renderer.Actions);
    this.createStore('renderer', mr.Renderer.Store, this);
  }
}

const flux = new AppFlux();

let Playground = {
  flux,
  mr,
  loadBook(name) {
    flux.getActions('publication').load(`/books/${name}`);
  },
  loadSpine(index) {
    const spineItem = flux.getStore('publication').spine[index];
    flux.getActions('renderer').setSpineItem(spineItem);
  },
  getPublicationState() {
    return flux.getStore('publication').state;
  },
  getRendererState() {
    return flux.getStore('renderer').state;
  }
};
window.Playground = Playground;

console.log('Welcome to mr playground.');
console.log('https://github.com/dariocravero/mr');
console.log('Playground module', Playground);

Playground.loadBook('xplor8');

React.render(
  <FluxComponent flux={flux}>
    <RendererContainer />
  </FluxComponent>,
  document.getElementById('playground-container')
);

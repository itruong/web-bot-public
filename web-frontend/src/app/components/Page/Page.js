import React from 'react';

export default class Page extends React.Component {
  componentDidMount () {
    document.title = this.props.title ? `autobot | ${this.props.title}` : 'autobot';
  }

  render () {
    return this.props.children;
  }
};
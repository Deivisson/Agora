import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Card, CardActions, CardHeader,
    CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';

import GroupForm from 'components/GroupForm';

import { addGroup } from 'actions/accountPage';

const mapStateToProps = () => ({});

const actionCreators = {
  addGroup
};

class AddGroup extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit({ user, name }) {
    const { addGroup } = this.props;
    addGroup(user, name);
  }

  render() {
    return <GroupForm
      submit={this.submit}
    />;
  }
}

export default connect(mapStateToProps, actionCreators)(AddGroup);

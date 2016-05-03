import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { Card, CardHeader, CardActions, CardTitle, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Divider from 'material-ui/Divider'

import Unimplemented from 'components/Unimplemented'
import ResourceTitle from 'components/ResourceTitle'

const Post = ({ id, title, text, user, dispatch, style, zDepth }) => <Card
    style={style}
    zDepth={zDepth}
>
    <CardHeader
        title={<ResourceTitle
            user={user}
            title={title}
            path={'/posts/' + id}
        />}
        showExpandableButton={true}
    />
    <Divider />
    <CardText actAsExpander={true}>
        {text}
    </CardText>
    <Divider />
    <CardActions expandable={true}>
        <Unimplemented />
    </CardActions>
</Card>

export default connect()(Post)

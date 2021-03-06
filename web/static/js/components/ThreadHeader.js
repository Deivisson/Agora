import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { compose } from 'recompose'

import { grey900 } from 'material-ui/styles/colors'
import Divider from 'material-ui/Divider'
import { Card, CardTitle, CardActions } from 'material-ui/Card'

import Unimplemented from 'components/Unimplemented'
import ThreadActions from 'components/ThreadActions'
import { ThreadIcon, PostIcon } from 'components/icons'
import GroupButton from 'components/GroupButton'
import { checkThreadOwned, requireThread } from 'hocs/resources'
import { getAccountUserIDs } from 'selectors/accountPage'

const actionCreators = {
  push,
}

class ThreadHeader extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { id, push } = this.props
    push(`/threads/${id}`)
  }

  render() {
    const { id, thread, isOwned } = this.props
    const parentID = thread.parent_group_id
    const title = (
      <span
        onClick={this.handleClick}
      >
        <ThreadIcon />
        {`  ${thread.title}  `}
        <PostIcon />
        {`  ${thread.posts}  `}
      </span>
    )
    return (
      <div>
        {
          parentID
          ? <span>
            <GroupButton id={parentID} />
          </span>
          : null
        }
        <Card
          initiallyExpanded={false}
        >
          <CardTitle
            actAsExpander
            showExpandableButton
            title={title}
            subtitle="Thread description"
          />
          <CardActions expandable>
            <ThreadActions id={id} isOwned={isOwned} />
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default compose(requireThread(null, actionCreators), checkThreadOwned)(ThreadHeader)

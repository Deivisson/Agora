import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { grey800, grey700 } from 'material-ui/styles/colors'
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card'
import Divider from 'material-ui/Divider'

import Unimplemented from 'components/Unimplemented'
import WatchlistActions from 'components/WatchlistActions'
import { WatchlistIcon } from 'components/icons/index'
import { requireWatchlist } from 'hocs/resources'

const mapStateToProps = ({ theme, watchlists }, { id }) => {
  return {
    theme,
  }
}

const actionCreators = {
  push,
}

class Watchlist extends Component {
  render() {
    const { id, watchlist, push, zDepth, theme } = this.props
    const title = (<div>
      <WatchlistIcon style={theme.resource.title_icon} color={grey800} />
      {`  ${watchlist.name}  `}
    </div>)
    return (
      <Card
        onTouchTap={() => push(`/watchlists/${id}`)}
        style={theme.resource.root}
        containerStyle={{ padding: 0 }}
        zDepth={zDepth}
      >
        <CardTitle
          title={title} titleStyle={theme.resource.title_text}
          style={theme.resource.title} titleColor={grey800}
        />
        <CardActions expandable>
          <WatchlistActions id={id} />
        </CardActions>
      </Card>
    )
  }
}

export default requireWatchlist(mapStateToProps, actionCreators)(Watchlist)

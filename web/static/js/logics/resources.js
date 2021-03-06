import { createLogic } from 'redux-logic'
import { push } from 'react-router-redux'

import { accountChannel, commonChannel, pushMessage } from 'socket'
import {
  submitGroup, submitThread, submitWebhook, submitWebhookLink,
  deleteWebhook, deleteWebhookLink,
  editThread, editGroup, editWatchlist, editWebhook,
  updateThread, updateGroup, updateWebhook,
  unwatchThread, unwatchGroup, updateWatchlist,
} from 'actions/resources'
import { updateWebhooks } from 'actions/threadPage'
import { updateWebhooks as updateAccountWebhooks } from 'actions/accountPage'

function formatGroupParams(params) {
  const {
    group, user, name, groupLimited, threadLimited, joinLimited,
  } = params
  return {
    parent_group_id: group,
    user_id: user,
    name,
    group_limited: groupLimited,
    thread_limited: threadLimited,
    join_limited: joinLimited,
  }
}

function formatThreadParams(params) {
  const {
    group, user, title, postLimited,
  } = params
  return {
    parent_group_id: group,
    user_id: user,
    title,
    post_limited: postLimited,
  }
}

function formatWatchlistParams(params) {
  const {
    name, user
  } = params
  return {
    name,
    user_id: user
  }
}

function formatWebhookParams(params) {
  const {
    user, url,
  } = params
  return {
    user_id: user,
    url,
  }
}

function formatWebhookLinkParams(params) {
  const {
    user, thread, webhook,
  } = params
  return {
    user_id: user,
    thread_id: thread,
    webhook_user_id: webhook,
  }
}

const addGroupLogic = createLogic({
  type: submitGroup.getType(),
  process({ action }, dispatch) {
    const params = formatGroupParams(action.payload)
    pushMessage(commonChannel, 'groups', 'add', params)
      .then(({ id }) => {
        dispatch(push(`/groups/${id}`))
      })
  },
})

const addThreadLogic = createLogic({
  type: submitThread.getType(),
  process({ action }, dispatch) {
    const params = formatThreadParams(action.payload)
    pushMessage(commonChannel, 'threads', 'add', params)
      .then(({ id }) => {
        dispatch(push(`/threads/${id}`))
      })
  },
})

const addWebhookLogic = createLogic({
  type: submitWebhook.getType(),
  process({ action }, dispatch) {
    const params = formatWebhookParams(action.payload)
    pushMessage(accountChannel, 'webhooks', 'add', params)
      .then(({ id }) => {
        dispatch(push(`/thread-webhooks/${id}`))
      })
  },
})

const addWebhookLinkLogic = createLogic({
  type: submitWebhookLink.getType(),
  process({ action }, dispatch) {
    const params = formatWebhookLinkParams(action.payload)
    pushMessage(accountChannel, 'webhooks', 'link', params)
      .then(({ links }) => {
        dispatch(updateWebhooks(links))
      })
  },
})

const deleteWebhookLogic = createLogic({
  type: deleteWebhook.getType(),
  process({ action }, dispatch) {
    const id = action.payload
    pushMessage(commonChannel, 'webhooks', 'delete', id)
      .then(({ webhooks }) => {
        dispatch(updateWebhooks(webhooks))
      })
  },
})

const deleteWebhookLinkLogic = createLogic({
  type: deleteWebhookLink.getType(),
  process({ action }, dispatch) {
    const { thread, user } = action.payload
    pushMessage(commonChannel, 'webhooks', 'unlink', { thread_id: thread, user_id: user })
      .then(({ links }) => {
        dispatch(updateWebhooks(links))
      })
  },
})

const editGroupLogic = createLogic({
  type: editGroup.getType(),
  process({ action }, dispatch) {
    const { id, params: rawParams } = action.payload
    const params = formatGroupParams(rawParams)
    pushMessage(commonChannel, 'groups', 'edit', { id, params })
      .then(({ group }) => {
        dispatch(updateGroup(group.id, group))
      })
  },
})

const editThreadLogic = createLogic({
  type: editThread.getType(),
  process({ action }, dispatch) {
    const { id, params: rawParams } = action.payload
    const params = formatThreadParams(rawParams)
    pushMessage(commonChannel, 'threads', 'edit', { id, params })
      .then(({ thread }) => {
        dispatch(updateThread(thread.id, thread))
      })
  },
})

const editWatchlistLogic = createLogic({
  type: editWatchlist.getType(),
  process({ action }, dispatch) {
    const { id, params: rawParams } = action.payload
    const params = formatWatchlistParams(rawParams)
    pushMessage(commonChannel, 'watchlists', 'edit', { id, params })
      .then(({ watchlist }) => {
        dispatch(updateWatchlist(watchlist.id, watchlist))
      })
  },
})

const editWebhookLogic = createLogic({
  type: editWebhook.getType(),
  process({ action }, dispatch) {
    const { id, params: rawParams } = action.payload
    const params = formatWebhookParams(rawParams)
    pushMessage(accountChannel, 'webhooks', 'edit', { id, params })
      .then(({ webhook }) => {
        dispatch(updateWebhook(webhook.id, webhook))
      })
  },
})

const unwatchGroupLogic = createLogic({
  type: unwatchGroup.getType(),
  process({ action, getState }, dispatch) {
    const { watchlist, group } = action.payload
    const params = { watchlist_id: watchlist, group_id: group }
    pushMessage(commonChannel, 'watchlists', 'unwatch group', params)
    const newWatchlist = Object.assign({}, getState().watchlists[watchlist])
    newWatchlist.watch_groups = newWatchlist.watch_groups.filter(group_id =>
        group_id != group)
    dispatch(updateWatchlist(watchlist, newWatchlist))
  }
})

const unwatchThreadLogic = createLogic({
  type: unwatchThread.getType(),
  process({ action, getState }, dispatch) {
    const { watchlist, thread } = action.payload
    const params = { watchlist_id: watchlist, thread_id: thread }
    pushMessage(commonChannel, 'watchlists', 'unwatch thread', params)
    const newWatchlist = Object.assign({}, getState().watchlists[watchlist])
    newWatchlist.watch_threads = newWatchlist.watch_threads.filter(thread_id =>
        thread_id != thread)
    dispatch(updateWatchlist(watchlist, newWatchlist))
  }
})

export default [
  addGroupLogic,
  addThreadLogic,
  addWebhookLogic,
  addWebhookLinkLogic,
  deleteWebhookLogic,
  deleteWebhookLinkLogic,
  editGroupLogic,
  editThreadLogic,
  editWatchlistLogic,
  editWebhookLogic,
  unwatchGroupLogic,
  unwatchThreadLogic,
]

/* eslint-disable no-restricted-globals */
const formatBanExpirationDate = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `until ${year}-${month}-${day}`
}

const createEntityBannedBody = ({
  entityType,
  entityName,
  banType,
  banReason,
  expirationDate,
}) => {
  const expirationStr = expirationDate
    ? formatBanExpirationDate(expirationDate)
    : 'permanently'

  const reason =
    banReason === 'Other' || banReason === 'Auto-ban'
      ? ''
      : ` due to ${banReason.toLowerCase()}`

  switch (entityType) {
    case 'user': {
      if (banType === 'Forge') {
        return `You have been banned from creating items ${expirationStr} due to repeated violations of our ToS.`
      }
      return `Your account has been banned ${expirationStr}${reason}.`
    }
    case 'nft': {
      return `Your asset "${entityName}" has been banned${reason}.`
    }
    case 'island': {
      return `Your island "${entityName}" has been banned ${expirationStr}${reason}.`
    }
    default:
      return ``
  }
}

const notificationTypes = {
  BloomsGranted: {
    title: 'Blooms Granted',
    getBody: ({amount, reason}) =>
      `Hooray! You've been granted ${amount} blooms ${
        reason ?? 'from Nifty Island'
      }`,
    getUrl: () => `/`,
    actionText: 'View',
  },
  BuildCompleted: {
    title: 'Build Complete',
    getBody: () => `Asset build complete`,
    getUrl: ({nftId}) => `/create/mint?id=${nftId}`,
    actionText: 'View details',
  },
  ClaimableAssetAvailable: {
    title: 'Claimable Asset Available',
    getBody: () => `You're eligible to claim an asset for free`,
    getUrl: ({chain, contractAddress, tokenId}) =>
      `/item/${chain.toLowerCase()}/${contractAddress.toLowerCase()}/${tokenId}`,
    actionText: 'Claim asset',
  },
  EntityBanned: {
    title: 'Entity Banned',
    getBody: (payload) => createEntityBannedBody(payload),
    getUrl: () => `/`,
    actionText: 'View',
  },
  IslandFavorited: {
    title: 'Island Favorited',
    getBody: ({metadata: {displayName = 'Someone'}}) =>
      `${displayName} favorited your island`,
    getUrl: ({islandId}) => `/islands/${islandId}`,
    actionText: 'View profile',
  },
  NewFollower: {
    title: 'New Follower',
    getBody: ({metadata: {displayName = 'Someone'}}) =>
      `${displayName} started following you`,
    getUrl: ({userId}) => `/profile/${userId}`,
    actionText: 'View profile',
  },
  NewItemOffer: {
    title: 'Offer Received',
    getBody: ({metadata: {assetName}}) => `${assetName} received a new offer`,
    getUrl: ({chain, contractAddress, tokenId}) =>
      `/item/${chain.toLowerCase()}/${contractAddress.toLowerCase()}/${tokenId}`,
    actionText: 'View offer',
  },
  OpenEditionAvailable: {
    title: 'Open Edition Available',
    getBody: () => `You're eligible to mint a new open edition`,
    getUrl: ({chain, contractAddress, tokenId}) =>
      `/item/${chain.toLowerCase()}/${contractAddress.toLowerCase()}/${tokenId}`,
    actionText: 'Mint asset',
  },
  PenaltyReceived: {
    title: 'Penalty Received',
    getBody: ({amount, violationType}) =>
      `You've received a ${violationType} violation. Penalty: ${amount} bloom(s)`,
    getUrl: () => `/`,
    actionText: 'View',
  },
  QuestRewardAvailable: {
    title: 'Quest Reward Available',
    getBody: ({rewardNames}) =>
      `You have ${rewardNames.length} reward${
        rewardNames.length > 1 ? 's' : ''
      } ready to claim`,
    getUrl: ({questId}) => `/quests/${questId}`,
    actionText: 'Claim rewards',
  },
  QuestUserBlacklisted: {
    title: `You've been blacklisted`,
    getBody: () => `You've been blacklisted from a quest`,
    getUrl: () => `/`,
    actionText: 'View',
  },
  SystemMessage: {
    title: 'System Message',
    getBody: ({message}) => message,
    getUrl: () => `/`,
    actionText: 'View',
  },
}

self.addEventListener('push', (event) => {
  const payload = JSON.parse(event.data.text())
  const notification = notificationTypes[payload.type]
  if (!notification) return

  const body = notification.getBody(payload)
  const url = notification.getUrl(payload)
  event.waitUntil(
    self.registration.showNotification(notification.title, {
      body,
      icon: '/assets/pub/favicon/favicon-32x32.png',
      data: {url},
      actions: [{action: 'url', title: notification.actionText}],
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const client of clientList) {
          if (client.url !== '/' && 'focus' in client) {
            client.focus()
            client.navigate(event.notification.data.url)
            return null
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(event.notification.data.url)
        }

        return null
      }),
  )
})

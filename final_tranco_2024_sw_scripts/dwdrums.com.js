/* eslint-disable no-console */

self.addEventListener('message', async (event) => {
  if (event.data.type === 'cognitoToken') {
    const token = event.data.idToken
    const login = event.data.event === 'login'

    try {
      const response = await fetch('/api/generateCustomerAccessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, login }),
      })

      const { shopifySessionToken, userId } = await response.json()

      if (shopifySessionToken) {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'tokenVerification',
              status: 'success',
              shopifyId: login ? undefined : userId,
            })
          })
        })
      } else {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'tokenVerification',
              status: 'failure',
            })
          })
        })
      }
    } catch (error) {
      console.log('err', error)
    }
  }
})

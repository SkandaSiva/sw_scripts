importScripts('https://aswpsdkeu.com/notify/v1/ua-sdk.min.js')

let airshipConfig
function setupUA() {
    uaSetup.worker(self, {
        defaultIcon: 'https://dl.asnapieu.com/binary/public/sSjlNwrORj64LdT6OV2IHw/293a539d\u002D96b9\u002D4baf\u002Daa3f\u002Dd5982437e083',
        defaultTitle: airshipConfig.defaultTitle,
        defaultActionURL: airshipConfig.defaultActionUrl,
        appKey: airshipConfig.appKey,
        token: airshipConfig.token,
        vapidPublicKey: airshipConfig.vapidPublicKey,
        dataCollectionOptInEnabled: true
    })
}
self.addEventListener('message', function(event) {
    airshipConfig = event.data
    setupUA()
})



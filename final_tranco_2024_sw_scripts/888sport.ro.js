importScripts('https://aswpsdkus.com/notify/v1/ua-sdk.min.js');

const getUrlQueryStringObject = function () {
    const urlSearchParams = new URLSearchParams(self.location.search);

    let result = null;

    const urlQueryStringParams = urlSearchParams.get("params");

    if (urlQueryStringParams) {
        try {
            result = JSON.parse(urlQueryStringParams);
        }
        catch (err) {
        }
    }

    return result;
}

const setUrbanAirshipOptions = function () {
    try {
        const queryStringObject = getUrlQueryStringObject();

        if (queryStringObject && queryStringObject.urbanAirshipOptions) {
            if (!!queryStringObject.urbanAirshipOptions.isEnabled) {

                uaSetup.worker(self, queryStringObject.urbanAirshipOptions);

                console.info("Success in configuring Urban Airship", queryStringObject.urbanAirshipOptions);

            } else console.info("Not configuring Urban Airship because it is not enabled", queryStringObject.urbanAirshipOptions);
        } else
            console.error("Fail in configuring Urban Airship because no configuration options");

    } catch (err) {
        console.error("Fail in configuring Urban Airship", err);
    }
}

setUrbanAirshipOptions();
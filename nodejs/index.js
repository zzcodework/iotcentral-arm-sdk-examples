const msRestAzure = require("ms-rest-azure");
const IotCentralClient = require("azure-arm-iotcentral");
msRestAzure.interactiveLogin().then((creds) => {
    const subscriptionId = "FILL IN SUB ID";
    const resourceGroupName = "iotresourcegroup";
    const resourceName = "iot-central-test-app";

    const client = new IotCentralClient(creds, subscriptionId);

    const app = {
        subdomain: resourceName,
        sku: {
            name: 'F1'
        },
        location: 'West Us',
        displayName: resourceName
    };

    return client.apps.checkNameAvailability(resourceName).then((result) => {
        console.log(result);
    });

    return client.apps.createOrUpdate(resourceGroupName, resourceName, app).then((result) => {
        console.log(result);
    });

    return client.apps.get(resourceGroupName, resourceName).then((result) => {
      console.log(result);
    });

    // return client.apps.deleteMethod(resourceGroupName, resourceName).then((result) => {
    //     console.log("The result is:");
    //     console.log(result);
    // });

}).catch((err) => {
    console.log('An error occurred:');
    console.dir(err, {
        depth: null,
        colors: true
    });
});
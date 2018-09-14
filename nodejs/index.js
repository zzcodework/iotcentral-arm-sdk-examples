const msRestAzure = require("ms-rest-azure");
const IotCentralClient = require("azure-arm-iotcentral");

async function run() {
    const creds = await msRestAzure.interactiveLogin();

    const subscriptionId = "FILL IN SUB ID";
    const resourceGroupName = "myResourceGroup";
    const resourceName = "my-app-name";

    const client = new IotCentralClient(creds, subscriptionId);

    const app = {
        subdomain: resourceName,
        sku: {
            name: 'S1'
        },
        location: 'West Us',
        displayName: resourceName
    };

    // Check if a name exists
    let result = await client.apps.checkNameAvailability(resourceName);
    console.log(result);

    // Create a new app
    result = await client.apps.createOrUpdate(resourceGroupName, resourceName, app);
    console.log(result);

    // Retrieve an app
    result = await client.apps.get(resourceGroupName, resourceName);
    console.log(result);

    // Delete the app
    // result = await client.apps.deleteMethod(resourceGroupName, resourceName)
    // console.log(result);
}

run().then(() => {
    console.log('done');
}).catch((err) => {
    console.log('An error occurred:');
    console.dir(err, {
        depth: null,
        colors: true
    });
});

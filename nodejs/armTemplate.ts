import * as msRestAzure from 'ms-rest-azure';
import ResourceManagementClient from 'azure-arm-resource/lib/resource/resourceManagementClient';

const location = `eastus`;
const uniqueIdentifier = Date.now();
const paidAppName = `iotc-arm-paid-${location}-${uniqueIdentifier}`;
const apiVersion = '2018-09-01';

const appTemplates = {
    contoso: 'iotc-demo@1.0.0',
    pnp: 'iotc-pnp-preview@1.0.0'
};

const iotAppPaidArmTemplate = {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.IoTCentral/IoTApps",
            "name": paidAppName,
            "sku": {
                "name": "S1"
            },
            "location": location,
            "apiVersion": apiVersion,
            "properties": {
                "displayName": paidAppName,
                "subdomain": paidAppName,
                "template": `${appTemplates.contoso}`
            }
        }
    ]
}

// microsoft.onmicrosoft.com
const msTenantId = "72f988bf-86f1-41af-91ab-2d7cd011db47";
const rdSubscriptionId = 'c75f6a44-0c50-4e42-b7ec-9ff5590b0944';
const resourceGroupName = 'iotc-arm-template';
const resourceGroupLocation = 'East US';
const deploymentName = `iotc-arm-template-deployment-${uniqueIdentifier}`;
const deployment = {
    properties: {
        mode: 'Incremental',
        template: iotAppPaidArmTemplate
    }
};

async function deploy() {
    const credentials = await msRestAzure.interactiveLogin({ domain: msTenantId });
    console.log(`\nLogged into tenant: ${msTenantId}`);

    const client = new ResourceManagementClient(credentials, rdSubscriptionId);
    console.log(`\nCreated ARM client for subscription: ${rdSubscriptionId}`);

    const isResourceGroupExists = await client.resourceGroups.checkExistence(resourceGroupName);
    if (!isResourceGroupExists) {
        await client.resourceGroups.createOrUpdate(resourceGroupName, { location: resourceGroupLocation });
    }
    console.log(`\nResource group ${resourceGroupName} has been created or already existed in ${resourceGroupLocation}\n`);

    const deploymentExtended = await client.deployments.createOrUpdate(resourceGroupName, deploymentName, deployment);
    console.log(`\nDeployment ${deploymentName} has been submitted\n`);

    return deploymentExtended;
}

deploy().then(extended => console.log(extended));
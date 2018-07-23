using System;
using Microsoft.Azure.Management.IotCentral;
using Microsoft.Azure.Management.IotCentral.Models;
using Microsoft.Rest;

namespace IoTCentralArmSDK
{
    class Program
    {
        static void Main(string[] args)
        {
            // Access token from the azure-cli
            // az account get-access-token
            var token = "";
            var subscriptionId = "";
            var creds = new TokenCredentials(token, "Bearer");

            var client = new IotCentralClient(creds);
            var skuInfo = new AppSkuInfo("S1");
            var app = new App("West Us", skuInfo);
            client.SubscriptionId = subscriptionId;

            var name = "csharp-test-app";
            var resourceGroup = "myResourceGroup";

            app.Location = "West Us";
            app.Subdomain = name;
            app.DisplayName = name;

            Console.WriteLine("Creating app");
            var resultApp = client.Apps.CreateOrUpdate(resourceGroup, name, app);

            Console.WriteLine("Listing apps");
            foreach (var currentApp in client.Apps.ListByResourceGroup(resourceGroup))
            {
                Console.WriteLine($"{currentApp.DisplayName} ({currentApp.Id})");
            }

            Console.WriteLine(Environment.NewLine);
            Console.WriteLine("Removing app");
            client.Apps.Delete(resourceGroup, name);

            Console.WriteLine("Done");
        }
    }
}

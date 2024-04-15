---
outline: deep
---

# Import a JSON file to Orama Cloud

With Orama Cloud, you can upload a JSON file as a data source.
Once you upload it to Orama Cloud, it will be distributed in our Global Search Network, making it available in 300 global locations worldwide.

You can follow along with this guide by downloading the following example JSON file: [example dataset](/cloud/guides/json-file/dog_breeds.json)

## Creating the index

As always, you can create a new Orama Cloud index by going to [https://cloud.oramasearch.com/indexes](https://cloud.oramasearch.com/indexes).

In this page click on the `Add new index` button and choose: `Import Data from files`.

<ZoomImg
  src='/cloud/guides/json-file/1.png'
  alt='Orama cloud indexes page'
/>

Once you clicked on `Import Data from files` you will be presented with the following page:

<ZoomImg
  src='/cloud/guides/json-file/orama-cloud-index-creation.png'
  alt='Create a new JSON File index with Orama Cloud'
/>

Of course, you can choose any name and description you want for your index. In this example, we will use the name `My JSON File Index`.

After selecting "JSON File" as a data source, we can click on the "Create Index" button, and we'll see the following screen:

<ZoomImg
  src='/cloud/guides/json-file/orama-cloud-index-feed.webp'
  alt='Feeding a JSON File index with Orama Cloud'
/>

At this point, we can upload our JSON file by dragging and dropping it into the dedicated area, or by clicking on the "Choose a file" area and selecting the file from our computer.

As soon as we do that, we will see the preview of the JSON file, which will help us write the Orama Schema for our index.

<ZoomImg
  src='/cloud/guides/json-file/orama-cloud-index-json-preview.webp'
  alt='JSON preview of a JSON File index with Orama Cloud'
/>

We can also use the "autodetect" feature, which will automatically generate a schema for us. This is an experimental feature, so please always double check the generated schema.

<ZoomImg
  src='/cloud/guides/json-file/orama-cloud-index-json-autodetect.webp'
  alt='Auto detecting the schema of a JSON File index with Orama Cloud'
/>

Once we are happy with the schema, we can click on the "Save and deploy" button, and our index will be deployed.

<ZoomImg
  src='/cloud/guides/json-file/orama-cloud-index-json-deploy.webp'
  alt='Deploying a JSON File index with Orama Cloud'
/>

## Integrating Orama Cloud into your app

Now that you have your index deployed, you can start using it in your app.

Orama Cloud provides an official SDK for JavaScript that runs on every JavaScript runtime. You can use it to query your data.

To learn more about the SDK, check out the [documentation](/cloud/integrating-orama-cloud/javascript-sdk).

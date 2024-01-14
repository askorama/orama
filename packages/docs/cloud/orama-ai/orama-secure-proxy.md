---
outline: deep
---

# Plugin Secure Proxy

When running a [vector](/open-source/usage/search/vector-search.html) or [hybrid](/open-source/usage/search/hybrid-search.html) search with Orama (or any other vector database), there is a process called **inference**.

This term refers to the process of using a trained machine learning model to make predictions on new, unseen data. In the context of a vector or hybrid search, this could involve using the model to transform raw data into a vector representation that can then be used in the search process.

A very popular model is OpenAI's [`text-embedding-ada-002`](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings). This model takes a string of maximum `8191` tokens, and returns a vector of `1536` elements, to be used to perform vector search.

When running vector or hybrid search on the front-end, you'll encounter a problem: the need to call the OpenAI API, which exposes your API Key to the end user. If a malicious user gets a hold of this information, they could generate their own embeddings, or even use other OpenAI API offerings - all at your expense. It's important to remember that these APIs are not inexpensive!

Because Orama is a vector database that operates client-side, we offer a secure proxy. This allows you to safely and easily call OpenAI, and soon other services, directly from a browser or any other unsecured source.

## Enabling the secure proxy

The **Orama Secure Proxy** is available with the free plan of Orama Cloud. Before you start, make sure to [create a free account](https://cloud.oramasearch.com) (no credit card required).

Navigating to [https://cloud.oramasearch.com/secure-proxy](https://cloud.oramasearch.com/secure-proxy), you will notice that you'll need to import an OpenAI API Key before you start. This is required for other services too (such as the [automatic embeddings generation](/cloud/orama-ai/automatic-embeddings-generation.html)). Orama will encrypt this information in a secure vault and will never be able to retrieve it again in plaintext.

<ZoomImg
  src='/plugins/secure-proxy/initial-screen.png'
  alt='Initial screen of Orama Secure Proxy'
/>

By going to [https://cloud.oramasearch.com/developer-tools](https://cloud.oramasearch.com/developer-tools), you'll be able to insert a new OpenAI API key. Remember, you will never be able to retrieve it again in plaintext.

<ZoomImg
  src='/plugins/secure-proxy/openai-key-popup.png'
  alt='OpenAI API Key popup'
/>

If you go back to [https://cloud.oramasearch.com/secure-proxy](https://cloud.oramasearch.com/secure-proxy), you will see that you can now enable the Orama Secure Proxy.

<ZoomImg
  src='/plugins/secure-proxy/activate.png'
  alt='Enable Orama Secure Proxy'
/>

After activating the Proxy, you will be presented with the following screen. The **Secure Proxy Public Key** is a **public** API key that you can include in any of your public-facing API requests.

For security reasons, you can regenerate it at any moment. If needed, you can always shut down the secure proxy by just switching the "disable secure proxy" switch.

<ZoomImg
  src='/plugins/secure-proxy/proxy-key.png'
  alt='Orama Secure Proxy Key'
/>

## Configuring the secure proxy

Once the Orama Secure Proxy is enabled, you can finally configure it. Configurations are real-time, and any change is propagated immediately.

<ZoomImg
  src='/plugins/secure-proxy/configuration.png'
  alt='Orama Secure Proxy Configuration'
/>

### Authorized domains

Configuring the secure proxy is pretty straightforward. First of all, you have to explicit all the domains that are authorized to perform an API call to the proxy.

For example, if you only want to authorize API calls coming from `https://oramasearch.com`, write `oramasearch.com` and press enter.

Regular expressions are supported, so that you can test the proxy on dynamic environments such as Vercel or Netlify, where URLs are automatically generated based on branch name. Use them wisely!

### User-level rate limiter

After each connection to the secure proxy, Orama will identify the user and will perform rate limiting based on the data you're expressing in the "User rate limit" field.

With the default configuration, users will be able to perform at most 10 requests every 60 seconds. After performing 10 requests, the system will block any further request.

### System-level rate limiter

The Orama Secure Proxy will perform a second type of rate limiting operation, based on the number of total requests from any number of users in a given time window.

With this configuration, you can tell the secure proxy to stop proxying to OpenAI after a given number of requests has occurred within a specific timespan.

With the default configuration, the users can perform at most 100 requests every 60 seconds.

Make sure to configure these limits accordingly to your traffic patterns!

## Performing hybrid and vector search

Once the Orama Secure Proxy is configured, you can finally perform vector and hybrid search from the frontend securely.

If you're using Orama Open Source, install the `@orama/plugin-secure-proxy` and follow the instructions provided in the [official documentation page](/open-source/plugins/plugin-secure-proxy.html).
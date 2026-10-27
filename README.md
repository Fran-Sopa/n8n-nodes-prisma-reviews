# n8n-nodes-prisma-reviews

This is an n8n community node package for the [Prisma Reviews API](https://prismareviews.com). Prisma Reviews gives you one REST API to read the reviews of the businesses and apps you manage on the App Store, Google Play, Judge.me, Trusted Shops, Yelp, Tripadvisor, Booking.com, G2 and more, in one normalized JSON shape, and to reply through each platform's official API where it has one.

The package contains:

- **Prisma Reviews**: an action node for reviews, replies, locations, connections, connect links, platforms, usage and webhooks.
- **Prisma Reviews Trigger**: a trigger node that starts a workflow when a review is created or updated, a reply is published or fails, or a connection changes.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Credentials](#credentials)
- [Operations](#operations)
- [Trigger](#trigger)
- [Example workflow](#example-workflow)
- [Compatibility](#compatibility)
- [Resources](#resources)

## Installation

In n8n, go to **Settings > Community Nodes**, select **Install**, enter `n8n-nodes-prisma-reviews` and confirm.

See the n8n [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) for other ways to install, such as with npm on a self-hosted instance.

## Credentials

The nodes use an API key.

1. Create an account at [app.prismareviews.com](https://app.prismareviews.com/signup) (the free plan is enough to start).
2. Create a key at [app.prismareviews.com/api-keys](https://app.prismareviews.com/api-keys).
3. In n8n, create a **Prisma Reviews API** credential and paste the key in **API Key**.

There are two kinds of keys:

- `pk_live_…` keys work with your real platform accounts.
- `pk_test_…` keys connect any platform with sample locations and reviews, and never publish replies. Use one to build and test a workflow. Test and live data never mix.

n8n tests the credential by calling `GET /v1/usage`.

## Operations

| Resource | Operation | Endpoint |
| --- | --- | --- |
| Review | Get Many: filter by location, platform, date (`since`) and whether it has a reply; **Return All** follows `next_cursor` through every page | `GET /v1/reviews` |
| Review | Get | `GET /v1/reviews/{id}` |
| Reply | Create or Replace, with an optional idempotency key | `POST /v1/reviews/{id}/reply` |
| Reply | Delete | `DELETE /v1/reviews/{id}/reply` |
| Location | Get Many | `GET /v1/locations` |
| Location | Get | `GET /v1/locations/{id}` |
| Location | Refresh: queue a sync to fetch new reviews now | `POST /v1/locations/{id}/refresh` |
| Connection | Create: connect a platform account (OAuth, credentials or listing URL) | `POST /v1/connections` |
| Connection | Get Many | `GET /v1/connections` |
| Connection | Delete | `DELETE /v1/connections/{id}` |
| Connect Link | Create: a hosted link where an account owner connects their own account | `POST /v1/connect_links` |
| Platform | Get Many | `GET /v1/platforms` |
| Platform | Get: how a platform connects, which credentials it needs and whether it supports replies | `GET /v1/platforms/{id}` |
| Usage | Get: plan, requests and replies this month, location usage | `GET /v1/usage` |
| Webhook | Create (the response includes the signing secret, shown only once) | `POST /v1/webhooks` |
| Webhook | Get Many | `GET /v1/webhooks` |
| Webhook | Delete | `DELETE /v1/webhooks/{id}` |

The node can also be used as a tool by n8n AI agents.

Notes:

- Replies are asynchronous. **Reply > Create or Replace** returns the review with the reply queued; listen for `reply.published` or `reply.failed` to know the result.
- Read-only platforms (for example Yelp or Tripadvisor) don't accept replies through the API. **Platform > Get** tells you which ones do.
- Errors are returned in one shape (`type`, `code`, `message`, `retryable`, `request_id`). See the [error codes](https://prismareviews.com/docs/errors).

## Trigger

**Prisma Reviews Trigger** listens to one or more of these events:

| Event | When |
| --- | --- |
| `review.created` | A new review is found on a connected location. |
| `review.updated` | A review's content changed on the platform, or a reply appeared or changed there. |
| `reply.published` | A reply sent through Prisma is live on the platform. |
| `reply.failed` | The platform refused a reply, or every retry failed. |
| `connection.updated` | An OAuth connection became active, or a connection needs to be re-authorized. |

When you activate the workflow (or listen for a test event), the node registers a webhook endpoint with `POST /v1/webhooks` for the events you chose and keeps its signing secret. When you deactivate the workflow, it deletes the endpoint.

Every delivery is checked against the `Prisma-Signature` header (`t=<timestamp>,v1=<HMAC-SHA256>` of `<timestamp>.<raw body>` with the endpoint's secret). Deliveries with a missing or wrong signature, or a timestamp more than 5 minutes away from the server clock, are rejected with `401` and don't start the workflow.

Requirements and behaviour:

- Prisma only delivers to public `https://` URLs. Your n8n instance must be reachable over HTTPS from the internet; a `http://localhost` webhook URL is rejected. On a self-hosted instance, set the `WEBHOOK_URL` environment variable to your public HTTPS address.
- Events carry IDs, not full objects. Add a **Prisma Reviews** node after the trigger (for example **Review > Get** with `{{ $json.data.id }}`) to fetch the current state.
- A delivery can be retried and arrive more than once, with the same event `id`. De-duplicate by `id` if it matters to your workflow.
- Webhook endpoints belong to the workspace, not to the key, and receive events from both test and live data.

## Example workflow

Reply to new reviews from a template:

1. **Prisma Reviews Trigger** with the event `review.created`.
2. **Prisma Reviews**: Review > Get, Review ID `{{ $json.data.id }}`.
3. **If**: `{{ $json.rating }}` is greater than or equal to 4.
4. **Prisma Reviews**: Reply > Create or Replace, Review ID `{{ $json.id }}`, Text `Thank you for your review!`.

Use a `pk_test_…` key while you build it: test connections produce sample reviews and replies are never published.

## Compatibility

Built with `@n8n/node-cli` 0.54 against `n8n-workflow` 2.x (n8n nodes API version 1). Requires an n8n version that supports themed node icons and the `usableAsTool` flag (n8n 1.x from 2025 onwards, or 2.x).

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Prisma Reviews documentation](https://prismareviews.com/docs)
- [API reference](https://prismareviews.com/docs/api-reference)
- [Webhooks](https://prismareviews.com/docs/api-reference/webhooks)
- [OpenAPI specification](https://prismareviews.com/openapi.json)

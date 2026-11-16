# Changelog

## 0.1.4

- Review → Get Many: new filters Search Text (`q`: whole words, any case or accent, commas for OR, e.g. `John,Mary Ann`), Search In, Min Stars, Max Stars and Until; Location IDs takes several ids separated by commas. Results carry `location_name`, `location_url` and, with Search Text, `matched_terms`.

## 0.1.3

- Trigger: new `location.sync_failed` and `location.sync_recovered` events, to tell a location whose checks keep failing apart from one with no new reviews (requested on the n8n community forum).

## 0.1.2

- Trigger: new `reply.unknown` event (a reply was sent but the platform never answered and it can't be read back; Prisma stops without retrying).

## 0.1.1

- Published from GitHub Actions with provenance; no code changes.

## 0.1.0

- First release: Prisma Reviews node (reviews, replies, locations, connections, connect links, platforms, usage, webhooks), Prisma Reviews Trigger node and Prisma Reviews API credentials.

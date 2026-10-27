import { createHmac, timingSafeEqual } from 'crypto';
import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	type IDataObject,
	type IHookFunctions,
	type IHttpRequestMethods,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData,
	type JsonObject,
} from 'n8n-workflow';
import { webhookEventOptions } from '../PrismaReviews/shared/webhookEvents';

const BASE_URL = 'https://api.prismareviews.com';
const SIGNATURE_TOLERANCE_SECONDS = 300;

interface PrismaWebhookEndpoint {
	id: string;
	url: string;
	events: string[];
	secret?: string;
}

async function prismaApiRequest(
	this: IHookFunctions,
	method: IHttpRequestMethods,
	path: string,
	body?: IDataObject,
): Promise<IDataObject> {
	try {
		return (await this.helpers.httpRequestWithAuthentication.call(this, 'prismaReviewsApi', {
			method,
			url: `${BASE_URL}${path}`,
			body,
			json: true,
		})) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/** `Prisma-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>">`, keyed with the endpoint secret. */
export function verifyPrismaSignature(
	rawBody: string,
	header: string,
	secret: string,
	now = Math.floor(Date.now() / 1000),
): boolean {
	const parts: Record<string, string> = {};
	for (const part of header.split(',')) {
		const index = part.indexOf('=');
		if (index > 0) parts[part.slice(0, index).trim()] = part.slice(index + 1).trim();
	}
	const timestamp = Number(parts.t);
	if (!timestamp || !parts.v1 || Math.abs(now - timestamp) > SIGNATURE_TOLERANCE_SECONDS) {
		return false;
	}
	const expected = Buffer.from(
		createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex'),
	);
	const given = Buffer.from(parts.v1);
	return expected.length === given.length && timingSafeEqual(expected, given);
}

export class PrismaReviewsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Prisma Reviews Trigger',
		name: 'prismaReviewsTrigger',
		icon: {
			light: 'file:../../icons/prismaReviews.svg',
			dark: 'file:../../icons/prismaReviews.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description:
			'Starts the workflow when Prisma Reviews finds a new or updated review, a reply is published or fails, or a connection changes',
		defaults: {
			name: 'Prisma Reviews Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'prismaReviewsApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName:
					'Prisma only delivers to public HTTPS URLs. Your n8n instance must be reachable over HTTPS from the internet (a localhost test URL will be rejected).',
				name: 'httpsNotice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				options: webhookEventOptions,
				default: ['review.created'],
				description:
					'The events to listen to. Events carry IDs only: use the Prisma Reviews node (for example Review > Get) to fetch the current object.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				if (staticData.webhookId === undefined || staticData.webhookSecret === undefined) {
					return false;
				}
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const response = await prismaApiRequest.call(this, 'GET', '/v1/webhooks');
				const endpoints = (response.data ?? []) as PrismaWebhookEndpoint[];
				const endpoint = endpoints.find((e) => e.id === staticData.webhookId);
				if (endpoint && endpoint.url === webhookUrl) {
					return true;
				}
				delete staticData.webhookId;
				delete staticData.webhookSecret;
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const events = this.getNodeParameter('events', []) as string[];
				if (!webhookUrl.startsWith('https://')) {
					throw new NodeOperationError(
						this.getNode(),
						`Prisma Reviews only delivers webhooks to HTTPS URLs, and this workflow's webhook URL is ${webhookUrl}`,
						{
							description:
								'Set WEBHOOK_URL on your n8n instance to a public HTTPS address, or use a tunnel, and activate the workflow again.',
						},
					);
				}
				if (events.length === 0) {
					throw new NodeOperationError(this.getNode(), 'Choose at least one event');
				}

				// An endpoint with this URL that this node no longer has the secret for can never be verified: remove it
				// so the workspace does not keep delivering to it twice.
				const existing = await prismaApiRequest.call(this, 'GET', '/v1/webhooks');
				for (const endpoint of (existing.data ?? []) as PrismaWebhookEndpoint[]) {
					if (endpoint.url === webhookUrl) {
						await prismaApiRequest.call(
							this,
							'DELETE',
							`/v1/webhooks/${encodeURIComponent(endpoint.id)}`,
						);
					}
				}

				const created = (await prismaApiRequest.call(this, 'POST', '/v1/webhooks', {
					url: webhookUrl,
					events,
				})) as unknown as PrismaWebhookEndpoint;
				if (!created.id || !created.secret) {
					throw new NodeOperationError(
						this.getNode(),
						'Prisma Reviews did not return a webhook ID and signing secret',
					);
				}
				const staticData = this.getWorkflowStaticData('node');
				staticData.webhookId = created.id;
				staticData.webhookSecret = created.secret;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = this.getWorkflowStaticData('node');
				if (staticData.webhookId !== undefined) {
					try {
						await prismaApiRequest.call(
							this,
							'DELETE',
							`/v1/webhooks/${encodeURIComponent(staticData.webhookId as string)}`,
						);
					} catch (error) {
						// Already deleted on Prisma's side (for example from the dashboard): nothing left to clean up.
						if ((error as NodeApiError).httpCode !== '404') {
							return false;
						}
					}
					delete staticData.webhookId;
					delete staticData.webhookSecret;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const request = this.getRequestObject();
		const staticData = this.getWorkflowStaticData('node');
		const secret = staticData.webhookSecret as string | undefined;
		const header = this.getHeaderData()['prisma-signature'] as string | undefined;
		const rawBody =
			(request as unknown as { rawBody?: Buffer }).rawBody?.toString('utf8') ??
			JSON.stringify(this.getBodyData());

		if (!secret || !header || !verifyPrismaSignature(rawBody, header, secret)) {
			const response = this.getResponseObject();
			response.status(401).send('Invalid Prisma-Signature').end();
			return { noWebhookResponse: true };
		}

		const body = this.getBodyData();
		const events = this.getNodeParameter('events', []) as string[];
		if (typeof body.type === 'string' && !events.includes(body.type)) {
			return { webhookResponse: 'Event ignored' };
		}

		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}

import type { IDataObject, INodeProperties } from 'n8n-workflow';
import { platformOptions, unwrapData } from '../shared/descriptions';

const showForReview = { resource: ['review'] };
const showForGetMany = { resource: ['review'], operation: ['getAll'] };

export const reviewDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showForReview },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a review',
				description: 'Get a single review by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/reviews/{{encodeURIComponent($parameter.reviewId)}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many reviews',
				description: 'List reviews, newest first, with optional filters',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/reviews',
					},
					output: {
						postReceive: [unwrapData],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Review ID',
		name: 'reviewId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'rev_01KJ8Q2M4T7HX3VB9CWD6NRZ5E',
		description: 'The review ID (rev_…)',
		displayOptions: { show: { resource: ['review'], operation: ['get'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: { show: showForGetMany },
		routing: {
			send: {
				paginate: '={{ $value }}',
				type: 'query',
				property: 'limit',
				value: '100',
			},
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						continue: '={{ !!($response.body && $response.body.next_cursor) }}',
						// n8n replaces `qs` as a whole for each page, so keep the filters and limit of the first
						// request ($request) and add the cursor of the previous page, if any.
						request: {
							qs: '={{ Object.assign({}, $request.qs, $response.body && $response.body.next_cursor ? { cursor: $response.body.next_cursor } : {}) }}' as unknown as IDataObject,
						},
					},
				},
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		description: 'Max number of results to return',
		displayOptions: { show: { ...showForGetMany, returnAll: [false] } },
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
			output: {
				maxResults: '={{ $value }}',
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: showForGetMany },
		options: [
			{
				displayName: 'Has Reply',
				name: 'has_reply',
				type: 'options',
				options: [
					{ name: 'With a Reply', value: 'true' },
					{ name: 'Without a Reply', value: 'false' },
				],
				default: 'false',
				description:
					'Whether to return only reviews with a reply (in any status) or only reviews without one',
				routing: { send: { type: 'query', property: 'has_reply' } },
			},
			{
				displayName: 'Location ID',
				name: 'location_id',
				type: 'string',
				default: '',
				placeholder: 'loc_01KJ8P9W2C4D6F8G0H2J4K6M8N',
				description: 'Only reviews of this location (loc_…)',
				routing: { send: { type: 'query', property: 'location_id' } },
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: platformOptions,
				default: 'google',
				description: 'Only reviews from this platform',
				routing: { send: { type: 'query', property: 'platform' } },
			},
			{
				displayName: 'Since',
				name: 'since',
				type: 'dateTime',
				default: '',
				description: 'Only reviews written at or after this time',
				routing: {
					send: {
						type: 'query',
						property: 'since',
						value: '={{ new Date($value).toISOString() }}',
					},
				},
			},
		],
	},
];

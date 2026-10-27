import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PrismaReviewsApi implements ICredentialType {
	name = 'prismaReviewsApi';

	displayName = 'Prisma Reviews API';

	icon: Icon = {
		light: 'file:../icons/prismaReviews.svg',
		dark: 'file:../icons/prismaReviews.dark.svg',
	};

	documentationUrl = 'https://prismareviews.com/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your secret API key from https://app.prismareviews.com/api-keys. Live keys start with pk_live_, test keys (sample data, replies never published) with pk_test_.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.prismareviews.com',
			url: '/v1/usage',
			method: 'GET',
		},
	};
}

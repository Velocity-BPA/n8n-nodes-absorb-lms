import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class AbsorbLmsApi implements ICredentialType {
	name = 'absorbLmsApi';
	displayName = 'Absorb LMS API';
	documentationUrl = 'https://support.absorblms.com/hc/en-us/sections/360008316394-API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.myabsorb.com',
			required: true,
			description: 'The base URL for your Absorb LMS API instance',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your Absorb LMS API private key. Generate this from Admin Portal > Integrations > API Keys.',
		},
	];
}
const CONFIG = {
  client_id: 'dG1t4n4ShjZ5lY33SFWHnlDhhuCwz2P5',
  client_secret:
    'G_Zs7mJzlzBPDXxrJS-un4uzwOINvNSoPSDDQc5vDVoOOkVYT9Q6NzzkF3K14QAS',
  cloud_id: '4ccb1786-ce08-4615-b02d-f3b31b1839a0',
  redirect_uri: `http://localhost:3000/confluence/conf-callback/`,

  api_base_path: `https://api.atlassian.com/ex/confluence/`,
  oauth_url: 'https://auth.atlassian.com/oauth/token',

  spaces_url: '',
  content_url: '',
};

CONFIG.api_base_path = `${CONFIG.api_base_path}${CONFIG.cloud_id}/`;
CONFIG.spaces_url = `${CONFIG.api_base_path}wiki/rest/api/space`;
CONFIG.content_url = `${CONFIG.api_base_path}wiki/rest/api/content`;

export { CONFIG };

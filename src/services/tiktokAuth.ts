/**
 * Mago Post - TikTok OAuth 2.0 Authentication Service
 * Integração oficial com a TikTok Login Kit & Open APIs v2
 * Organização: Casa Kame
 */

export interface TikTokTokenResponse {
  access_token: string;
  expires_in: number;
  open_id: string;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface TikTokAuthError {
  code: string | number;
  message: string;
  log_id?: string;
}

export interface TikTokAuthConfig {
  clientKey?: string;
  clientSecret?: string;
  redirectUri?: string;
  scopes?: string[];
}

/**
 * Obtém variável de ambiente de forma segura tanto em ambiente Vite quanto Node.js
 */
function getEnv(key: string, fallback: string = ''): string {
  // 1. Suporte a Vite (import.meta.env)
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> })?.env;
    if (metaEnv && metaEnv[key]) return metaEnv[key];
    if (metaEnv && metaEnv[`VITE_${key}`]) return metaEnv[`VITE_${key}`];
  } catch {
    // ambiente sem import.meta
  }

  // 2. Suporte a Node.js / process.env
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch {
    // ambiente sem process
  }

  return fallback;
}

export const DEFAULT_TIKTOK_CONFIG: Required<TikTokAuthConfig> = {
  clientKey: getEnv('TIKTOK_CLIENT_KEY', 'sbawin7m1esalypvkn'),
  clientSecret: getEnv('TIKTOK_CLIENT_SECRET', 'djzMU35GddzGzXDCQvJTTsw3bLLEOIEX'),
  redirectUri: getEnv('TIKTOK_REDIRECT_URI', 'https://pg-vendas-mago-gamer.vercel.app/api/auth/tiktok/callback'),
  scopes: getEnv(
    'TIKTOK_SCOPES',
    'user.info.basic,user.info.profile,user.info.stats,video.list,video.upload,video.publish'
  ).split(','),
};

const TIKTOK_AUTH_URL = 'https://www.tiktok.com/v2/auth/authorize/';
const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';

/**
 * Gera uma string aleatória para o parâmetro state (proteção contra CSRF)
 */
export function generateRandomState(length: number = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    return result;
  }
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * a) Gera a URL oficial de autorização do TikTok (OAuth 2.0 Login Kit)
 *
 * @param state Valor único para proteção CSRF (opcional, gerado automaticamente se omitido)
 * @param config Configurações opcionais para sobrepor os padrões (.env)
 * @returns Objeto com a URL de autorização e o state gerado
 */
export function getTikTokAuthUrl(
  state?: string,
  config: TikTokAuthConfig = {}
): { url: string; state: string } {
  const clientKey = config.clientKey || DEFAULT_TIKTOK_CONFIG.clientKey;
  const redirectUri = config.redirectUri || DEFAULT_TIKTOK_CONFIG.redirectUri;
  const scopes = config.scopes || DEFAULT_TIKTOK_CONFIG.scopes;
  const authState = state || generateRandomState();

  const params = new URLSearchParams({
    client_key: clientKey,
    scope: scopes.join(','),
    response_type: 'code',
    redirect_uri: redirectUri,
    state: authState,
  });

  return {
    url: `${TIKTOK_AUTH_URL}?${params.toString()}`,
    state: authState,
  };
}

/**
 * b) Troca o `code` de autorização por `access_token` e `refresh_token`
 *
 * @param code Código de autorização retornado no callback do TikTok
 * @param config Configurações opcionais com clientKey e clientSecret
 * @returns Promise com o token de acesso e refresh token
 */
export async function exchangeCodeForToken(
  code: string,
  config: TikTokAuthConfig = {}
): Promise<TikTokTokenResponse> {
  const clientKey = config.clientKey || DEFAULT_TIKTOK_CONFIG.clientKey;
  const clientSecret = config.clientSecret || DEFAULT_TIKTOK_CONFIG.clientSecret;
  const redirectUri = config.redirectUri || DEFAULT_TIKTOK_CONFIG.redirectUri;

  if (!clientKey || !clientSecret) {
    throw new Error('TikTok Client Key e Client Secret são obrigatórios.');
  }

  const bodyParams = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: bodyParams.toString(),
  });

  const rawJson = await response.json();

  // A API v2 do TikTok pode encapsular os dados dentro de `data`
  const data = rawJson.data || rawJson;

  if (!response.ok || rawJson.error?.code || !data.access_token) {
    const errorMsg =
      rawJson.error?.message ||
      rawJson.message ||
      rawJson.error_description ||
      'Falha na obtenção do token TikTok.';
    throw new Error(`[TikTok OAuth Error] ${errorMsg}`);
  }

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
    open_id: data.open_id,
    refresh_expires_in: data.refresh_expires_in,
    refresh_token: data.refresh_token,
    scope: data.scope,
    token_type: data.token_type || 'Bearer',
  };
}

/**
 * c) Renova um `access_token` expirado utilizando o `refresh_token`
 *
 * @param refreshToken Token de atualização obtido anteriormente
 * @param config Configurações opcionais
 * @returns Promise com o novo par de tokens
 */
export async function refreshAccessToken(
  refreshToken: string,
  config: TikTokAuthConfig = {}
): Promise<TikTokTokenResponse> {
  const clientKey = config.clientKey || DEFAULT_TIKTOK_CONFIG.clientKey;
  const clientSecret = config.clientSecret || DEFAULT_TIKTOK_CONFIG.clientSecret;

  if (!clientKey || !clientSecret) {
    throw new Error('TikTok Client Key e Client Secret são obrigatórios.');
  }

  const bodyParams = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await fetch(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: bodyParams.toString(),
  });

  const rawJson = await response.json();
  const data = rawJson.data || rawJson;

  if (!response.ok || rawJson.error?.code || !data.access_token) {
    const errorMsg =
      rawJson.error?.message ||
      rawJson.message ||
      rawJson.error_description ||
      'Falha na renovação do token TikTok.';
    throw new Error(`[TikTok Refresh Error] ${errorMsg}`);
  }

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
    open_id: data.open_id,
    refresh_expires_in: data.refresh_expires_in,
    refresh_token: data.refresh_token,
    scope: data.scope,
    token_type: data.token_type || 'Bearer',
  };
}

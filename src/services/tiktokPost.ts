/**
 * Mago Post - TikTok Content Posting API Service
 * Integração oficial com a TikTok Direct Post & Upload API v2
 * Organização: Casa Kame
 */

export type TikTokPrivacyLevel =
  | 'PUBLIC_TO_EVERYONE'
  | 'MUTUAL_FOLLOW_FRIENDS'
  | 'FOLLOWER_OF_CREATOR'
  | 'SELF_ONLY';

export interface TikTokVideoMetadata {
  title: string;
  privacy_level?: TikTokPrivacyLevel;
  disable_duet?: boolean;
  disable_stitch?: boolean;
  disable_comment?: boolean;
  video_cover_timestamp_ms?: number;
  video_size: number;
  chunk_size?: number;
  total_chunk_count?: number;
}

export interface TikTokInitPublishResponse {
  publish_id: string;
  upload_url: string;
}

export interface TikTokPublishStatusResponse {
  status:
    | 'PROCESSING_DOWNLOAD'
    | 'PROCESSING_UPLOAD'
    | 'SUCCESS'
    | 'FAILED'
    | 'IN_REVIEW'
    | string;
  fail_reason?: string;
  publicaly_available_post_id?: string[];
}

const TIKTOK_POST_INIT_URL = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
const TIKTOK_POST_STATUS_URL = 'https://open.tiktokapis.com/v2/post/publish/status/fetch/';

/**
 * a) Inicializa o processo de publicação de vídeo na API do TikTok
 *
 * @param accessToken Token de acesso OAuth válido com o escopo video.upload / video.publish
 * @param videoMetadata Metadados do vídeo (título, privacidade, tamanho em bytes)
 * @returns Promise com `publish_id` e a URL pré-assinada `upload_url`
 */
export async function initVideoPublish(
  accessToken: string,
  videoMetadata: TikTokVideoMetadata
): Promise<TikTokInitPublishResponse> {
  if (!accessToken) {
    throw new Error('Access token é obrigatório para inicializar publicação no TikTok.');
  }

  const payload = {
    post_info: {
      title: videoMetadata.title,
      privacy_level: videoMetadata.privacy_level || 'SELF_ONLY',
      disable_duet: videoMetadata.disable_duet ?? false,
      disable_stitch: videoMetadata.disable_stitch ?? false,
      disable_comment: videoMetadata.disable_comment ?? false,
      video_cover_timestamp_ms: videoMetadata.video_cover_timestamp_ms || 1000,
    },
    source_info: {
      source: 'FILE_UPLOAD',
      video_size: videoMetadata.video_size,
      chunk_size: videoMetadata.chunk_size || videoMetadata.video_size,
      total_chunk_count: videoMetadata.total_chunk_count || 1,
    },
  };

  const response = await fetch(TIKTOK_POST_INIT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(payload),
  });

  const rawJson = await response.json();
  const data = rawJson.data || rawJson;

  if (!response.ok || rawJson.error?.code || !data.upload_url) {
    const errorMsg =
      rawJson.error?.message ||
      rawJson.message ||
      'Falha ao inicializar a publicação do vídeo no TikTok.';
    throw new Error(`[TikTok Init Video Error] ${errorMsg}`);
  }

  return {
    publish_id: data.publish_id,
    upload_url: data.upload_url,
  };
}

/**
 * b) Faz o upload binário dos dados do vídeo (completo ou em chunks) para a URL pré-assinada
 *
 * @param uploadUrl URL pré-assinada retornada em `initVideoPublish`
 * @param videoBuffer Buffer, Blob ou ArrayBuffer com os bytes do vídeo
 * @param options Opções de chunk (range de bytes para uploads particionados)
 * @returns Promise com true indicando sucesso no upload
 */
export async function uploadVideoChunks(
  uploadUrl: string,
  videoBuffer: ArrayBuffer | Uint8Array | Blob,
  options?: {
    startByte?: number;
    endByte?: number;
    totalBytes?: number;
    contentType?: string;
  }
): Promise<boolean> {
  if (!uploadUrl) {
    throw new Error('uploadUrl é obrigatória para upload binário.');
  }

  const totalBytes =
    options?.totalBytes ||
    (videoBuffer instanceof Blob
      ? videoBuffer.size
      : (videoBuffer as ArrayBuffer).byteLength || (videoBuffer as Uint8Array).length);

  const startByte = options?.startByte ?? 0;
  const endByte = options?.endByte ?? totalBytes - 1;
  const contentType = options?.contentType || 'video/mp4';

  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'Content-Range': `bytes ${startByte}-${endByte}/${totalBytes}`,
  };

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers,
    body: videoBuffer as BodyInit,
  });

  if (!response.ok && response.status !== 201 && response.status !== 206) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `[TikTok Video Upload Failed] Status: ${response.status} - ${errorText || 'Falha ao transferir bytes do vídeo'}`
    );
  }

  return true;
}

/**
 * c) Consulta o status de processamento e publicação do vídeo
 *
 * @param accessToken Token de acesso OAuth do usuário
 * @param publishId Identificador de publicação recebido em `initVideoPublish`
 * @returns Promise com o status atual e detalhes de publicação
 */
export async function checkPublishStatus(
  accessToken: string,
  publishId: string
): Promise<TikTokPublishStatusResponse> {
  if (!accessToken || !publishId) {
    throw new Error('accessToken e publishId são obrigatórios.');
  }

  const response = await fetch(TIKTOK_POST_STATUS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      publish_id: publishId,
    }),
  });

  const rawJson = await response.json();
  const data = rawJson.data || rawJson;

  if (!response.ok || rawJson.error?.code) {
    const errorMsg =
      rawJson.error?.message ||
      rawJson.message ||
      'Falha ao consultar status de publicação do vídeo.';
    throw new Error(`[TikTok Status Fetch Error] ${errorMsg}`);
  }

  return {
    status: data.status,
    fail_reason: data.fail_reason,
    publicaly_available_post_id: data.publicaly_available_post_id,
  };
}

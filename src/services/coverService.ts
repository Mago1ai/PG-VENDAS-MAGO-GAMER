/**
 * Central de Resolução de Capas, Logos e Boxarts
 * Integração com Libretro Thumbnails & Repositórios Oficiais Gratuitos (xlenore ps2-covers, etc.)
 */

// Mapeamento oficial de plataformas para os nomes de pastas do repositório Libretro
export const LIBRETRO_SYSTEM_MAP: Record<string, string> = {
  // Sony Family
  'PlayStation 2': 'Sony - PlayStation 2',
  'PS2': 'Sony - PlayStation 2',
  'PlayStation': 'Sony - PlayStation',
  'PlayStation 1': 'Sony - PlayStation',
  'PS1': 'Sony - PlayStation',
  'PlayStation 3': 'Sony - PlayStation 3',
  'PS3': 'Sony - PlayStation 3',
  'PlayStation Portable': 'Sony - PlayStation Portable',
  'PSP': 'Sony - PlayStation Portable',
  'PlayStation Vita': 'Sony - PlayStation Vita',
  'PS Vita': 'Sony - PlayStation Vita',
  'PSVita': 'Sony - PlayStation Vita',
  'Sony': 'Sony - PlayStation 2',
  'SONY +': 'Sony - PlayStation Portable',

  // Nintendo Family
  'Super Nintendo': 'Nintendo - Super Nintendo Entertainment System',
  'SNES': 'Nintendo - Super Nintendo Entertainment System',
  'Super Nintendo Entertainment System': 'Nintendo - Super Nintendo Entertainment System',
  'Nintendo 64': 'Nintendo - Nintendo 64',
  'N64': 'Nintendo - Nintendo 64',
  'Game Boy Advance': 'Nintendo - Game Boy Advance',
  'GBA': 'Nintendo - Game Boy Advance',
  'Game Boy Color': 'Nintendo - Game Boy Color',
  'GBC': 'Nintendo - Game Boy Color',
  'Game Boy': 'Nintendo - Game Boy',
  'GB': 'Nintendo - Game Boy',
  'Nintendo Entertainment System': 'Nintendo - Nintendo Entertainment System',
  'NES': 'Nintendo - Nintendo Entertainment System',
  'Famicom': 'Nintendo - Nintendo Entertainment System',
  'Nintendo GameCube': 'Nintendo - GameCube',
  'GameCube': 'Nintendo - GameCube',
  'Game Cube': 'Nintendo - GameCube',
  'Nintendo DS': 'Nintendo - Nintendo DS',
  'NDS': 'Nintendo - Nintendo DS',
  'Nintendo 3DS': 'Nintendo - Nintendo 3DS',
  '3DS': 'Nintendo - Nintendo 3DS',
  'Nintendo Wii': 'Nintendo - Wii',
  'Wii': 'Nintendo - Wii',
  'Nintendo': 'Nintendo - Super Nintendo Entertainment System',

  // Sega Family
  'Mega Drive': 'Sega - Mega Drive - Genesis',
  'Genesis': 'Sega - Mega Drive - Genesis',
  'Sega Mega Drive': 'Sega - Mega Drive - Genesis',
  'Sega Genesis': 'Sega - Mega Drive - Genesis',
  'Sega Dreamcast': 'Sega - Dreamcast',
  'Dreamcast': 'Sega - Dreamcast',
  'Sega Saturn': 'Sega - Saturn',
  'Saturn': 'Sega - Saturn',
  'Sega Master System': 'Sega - Master System - Mark III',
  'Master System': 'Sega - Master System - Mark III',
  'Sega Game Gear': 'Sega - Game Gear',
  'Game Gear': 'Sega - Game Gear',
  'SEGA': 'Sega - Mega Drive - Genesis',

  // SNK & Arcade
  'SNK Neo Geo': 'SNK - Neo Geo',
  'Neo Geo': 'SNK - Neo Geo',
  'NeoGeo': 'SNK - Neo Geo',
  'SNK': 'SNK - Neo Geo',
  'Arcade': 'FBNeo - Arcade Games',
  'MAME': 'MAME',
  'FBNeo': 'FBNeo - Arcade Games',
  'Capcom': 'Capcom - CP System II'
};

/**
 * Higieniza o título do jogo para o padrão do Libretro Thumbnails
 * (Substitui caracteres proibidos em sistemas de arquivos como &, :, /, \, *, ?, ", <, >, |)
 */
export function sanitizeLibretroTitle(rawTitle: string): string {
  if (!rawTitle) return '';
  return rawTitle
    .trim()
    .replace(/[&]/g, '_')
    .replace(/[:/\\*?"<>|]/g, '_')
    .replace(/\s+/g, ' ');
}

/**
 * Normaliza o nome do sistema para a pasta oficial do Libretro
 */
export function resolveLibretroSystem(platformName: string): string {
  if (!platformName) return 'Sony - PlayStation 2';
  const clean = platformName.trim();
  
  if (LIBRETRO_SYSTEM_MAP[clean]) {
    return LIBRETRO_SYSTEM_MAP[clean];
  }

  // Busca parcial insensível a maiúsculas
  const lower = clean.toLowerCase();
  for (const [key, value] of Object.entries(LIBRETRO_SYSTEM_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return value;
    }
  }

  return 'Sony - PlayStation 2';
}

/**
 * Gera URL direta de Boxart no repositório Libretro
 * https://thumbnails.libretro.com/{system}/Named_Boxarts/{title}.png
 */
export function getBoxartUrl(system: string, title: string): string {
  const libSystem = resolveLibretroSystem(system);
  const cleanTitle = sanitizeLibretroTitle(title);
  if (!cleanTitle) return '';
  const encodedTitle = encodeURIComponent(cleanTitle);
  return `https://thumbnails.libretro.com/${encodeURIComponent(libSystem)}/Named_Boxarts/${encodedTitle}.png`;
}

/**
 * Gera URL direta de Logo no repositório Libretro
 * https://thumbnails.libretro.com/{system}/Named_Logos/{title}.png
 */
export function getLogoUrl(system: string, title: string): string {
  const libSystem = resolveLibretroSystem(system);
  const cleanTitle = sanitizeLibretroTitle(title);
  if (!cleanTitle) return '';
  const encodedTitle = encodeURIComponent(cleanTitle);
  return `https://thumbnails.libretro.com/${encodeURIComponent(libSystem)}/Named_Logos/${encodedTitle}.png`;
}

/**
 * Gera URL de Capa 3D Oficial para PlayStation 2 via repositório xlenore
 * https://raw.githubusercontent.com/xlenore/ps2-covers/main/covers/3d/{serial}.png
 */
export function getPS2Cover3D(serialOrId: string): string {
  if (!serialOrId) return '';
  // Normaliza o serial para o formato padrão do repo (ex: SLUS-20062, SCUS-97328, etc)
  const cleanSerial = serialOrId
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/^([A-Z]{4})_?([0-9]{3})\.?([0-9]{2})$/, '$1-$2$3');

  return `https://raw.githubusercontent.com/xlenore/ps2-covers/main/covers/3d/${cleanSerial}.png`;
}

/**
 * Gera URL de Capa 2D Oficial para PlayStation 2 via repositório xlenore
 * https://raw.githubusercontent.com/xlenore/ps2-covers/main/covers/default/{serial}.png
 */
export function getPS2Cover2D(serialOrId: string): string {
  if (!serialOrId) return '';
  const cleanSerial = serialOrId
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/^([A-Z]{4})_?([0-9]{3})\.?([0-9]{2})$/, '$1-$2$3');

  return `https://raw.githubusercontent.com/xlenore/ps2-covers/main/covers/default/${cleanSerial}.png`;
}

/**
 * Detector e resolvedor inteligente de capa automática
 * Retorna uma URL válida de acordo com as informações passadas
 */
export function getAutoCoverUrl(
  platform: string,
  title: string,
  type: 'boxart' | 'logo' | 'ps2_3d' | 'ps2_2d' = 'boxart'
): string {
  const isPs2 = platform?.toLowerCase().includes('ps2') || platform?.toLowerCase().includes('playstation 2');
  
  // Se for PS2 e parecer um serial (ex: SLUS-20062)
  if (isPs2 && /^[A-Z]{4}[-_]?[0-9]{3}\.?[0-9]{2}$/i.test(title.trim())) {
    return type === 'ps2_2d' ? getPS2Cover2D(title) : getPS2Cover3D(title);
  }

  if (type === 'logo') {
    return getLogoUrl(platform, title);
  }

  return getBoxartUrl(platform, title);
}

/**
 * Fallback seguro para imagens com erro
 */
export function getFallbackImage(title: string = 'NO IMAGE'): string {
  const text = encodeURIComponent(title.slice(0, 16).toUpperCase());
  return `https://placehold.co/400x600/050505/0070d1?text=${text}&font=roboto`;
}

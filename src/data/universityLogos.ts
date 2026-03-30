/**
 * University Logo URLs
 * Uses SVG initials avatars — no external dependencies, always loads instantly
 */

export const UNIVERSITY_LOGOS: Record<string, string> = {
  // Slovakia
  'stuba':      '🎓',
  'uniba':      '📚',
  'ukf':        '🏛️',
  'tuke':       '⚙️',
  'upjs':       '🔬',
  'tu-zvolen':  '🌲',
  'uvm':        '🐾',
  'akademia':   '🎭',

  // Czech Republic
  'cuni':       '👑',
  'cvut':       '⚡',
  'vut-brno':   '🔧',
  'muni':       '🎓',
  'czu':        '🌾',
  'upol':       '📖',
  'osu':        '🏭',
  'utb':        '👟',
  'ujep':       '🔬',
  'uwb':        '🎓',

  // Austria
  'univie':     '🏰',
  'tuw':        '⚙️',
  'tu-graz':    '🔩',
  'jku':        '📊',
  'uibk':       '🏔️',
  'sbg':        '🎵',
  'wu-wien':    '💼',
  'mu-wien':    '⚕️',

  // Poland
  'uw':         '📚',
  'pw':         '🔧',
  'uj':         '👑',
  'agh':        '⚒️',
  'put':        '⚙️',
  'amu':        '🎓',
  'uw-edu':     '📖',
  'pwr':        '🔬',
  'ug':         '⚓',
  'pg':         '🏗️',

  // Hungary
  'elte':       '📚',
  'bme':        '⚙️',
  'elte-ik':    '💻',
  'semmelweis': '⚕️',
  'uni-miskolc':'🏭',
  'pte':        '🎓',
  'szte':       '☀️',
  'debrecen':   '🌳',

  // Germany
  'tum':        '🏛️',
  'tum-wsi':    '💼',
  'tu-berlin':  '⚡',
  'rwth':       '🔬',
  'kit':        '🧪',
  'tum-phy':    '⚛️',
  'fub':        '🕊️',
  'hu-berlin':  '🎭',
  'lmu':        '👑',
  'heidelberg': '🏰',

  // Netherlands
  'uva':        '🎓',
  'tue':        '💡',
  'tudelft':    '⚙️',
  'leiden':     '📜',
  'utwente':    '🔧',
  'rug':        '🌟',
  'vu':         '✝️',
  'radboud':    '🎓',
}

/**
 * Get logo URL for a university — returns emoji for now
 * (SVG initials avatars are rendered by UniversityAvatar component)
 */
export function getUniversityLogo(uniId: string): string | null {
  return UNIVERSITY_LOGOS[uniId] || null
}

export const DEFAULT_LOGO = '🎓'

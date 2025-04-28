const buildSuffix = (url?: { query?: any, hash?: string }) => {
  const query = url?.query;
  const hash = url?.hash;

  return `${query ? `?${new URLSearchParams(query)}` : ''}${hash ? `#${hash}` : ''}`;
};

export const pagesPath = {
  'authorize': {
    $url: (url?: { hash?: string }) => ({ pathname: '/authorize' as const, hash: url?.hash, path: `/authorize${buildSuffix(url)}` })
  },
  'login': {
    'register': {
      $url: (url?: { hash?: string }) => ({ pathname: '/login/register' as const, hash: url?.hash, path: `/login/register${buildSuffix(url)}` })
    },
    $url: (url?: { hash?: string }) => ({ pathname: '/login' as const, hash: url?.hash, path: `/login${buildSuffix(url)}` })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash, path: `/${buildSuffix(url)}` })
};

export type PagesPath = typeof pagesPath;

export const staticPath = {
  file_svg: '/file.svg',
  globe_svg: '/globe.svg',
  next_svg: '/next.svg',
  vercel_svg: '/vercel.svg',
  window_svg: '/window.svg'
} as const;

export type StaticPath = typeof staticPath;

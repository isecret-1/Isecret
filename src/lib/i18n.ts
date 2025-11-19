export type Language = 'pt-BR' | 'en' | 'es';

const translations = {
  'pt-BR': {
    welcome: 'Bem-vindo ao iSecret',
    login_anon: 'Entrar Anonimamente',
    login_google: 'Entrar com Google',
    feed: 'Feed',
    explore: 'Explorar',
    profile: 'Perfil',
    create_post: 'Novo Segredo',
    write_secret: 'Conte seu segredo...',
    publish: 'Publicar',
    logout: 'Sair',
    loading: 'Carregando...',
    setup_required: 'Configuração Necessária',
    setup_msg: 'Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu .env',
    likes: 'curtidas',
    comments: 'comentários',
    delete: 'Apagar',
    report: 'Denunciar'
  },
  'en': {
    welcome: 'Welcome to iSecret',
    login_anon: 'Enter Anonymously',
    login_google: 'Login with Google',
    feed: 'Feed',
    explore: 'Explore',
    profile: 'Profile',
    create_post: 'New Secret',
    write_secret: 'Tell your secret...',
    publish: 'Publish',
    logout: 'Logout',
    loading: 'Loading...',
    setup_required: 'Setup Required',
    setup_msg: 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env',
    likes: 'likes',
    comments: 'comments',
    delete: 'Delete',
    report: 'Report'
  },
  'es': {
    welcome: 'Bienvenido a iSecret',
    login_anon: 'Entrar Anónimamente',
    login_google: 'Entrar con Google',
    feed: 'Feed',
    explore: 'Explorar',
    profile: 'Perfil',
    create_post: 'Nuevo Secreto',
    write_secret: 'Cuenta tu secreto...',
    publish: 'Publicar',
    logout: 'Salir',
    loading: 'Cargando...',
    setup_required: 'Configuración Requerida',
    setup_msg: 'Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu .env',
    likes: 'me gusta',
    comments: 'comentarios',
    delete: 'Borrar',
    report: 'Reportar'
  }
};

export function getBrowserLanguage(): Language {
  const lang = navigator.language;
  if (lang.startsWith('pt')) return 'pt-BR';
  if (lang.startsWith('es')) return 'es';
  return 'en';
}

export const t = (key: keyof typeof translations['pt-BR'], lang: Language = 'pt-BR') => {
  return translations[lang][key] || translations['pt-BR'][key];
};
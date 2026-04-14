import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Faltando variáveis de ambiente do Supabase (VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY). ' +
    'O banco de dados não funcionará corretamente. Configure-as no seu provedor de hospedagem.'
  );
}

// Se não houver URL, passamos uma dummy apenas para o createClient não quebrar a página toda (tela branca).
export const supabase = createClient(
  supabaseUrl || 'https://sua-url-aqui.supabase.co',
  supabaseAnonKey || 'sua-chave-aqui'
);

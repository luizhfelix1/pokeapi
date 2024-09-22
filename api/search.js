const { createClient } = require('@supabase/supabase-js');

// Obter as variáveis de ambiente da Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Usando SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    console.log('Recebida requisição em /api/search');

    if (req.method !== 'POST') {
        console.warn(`Método ${req.method} não permitido em /api/search`);
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const body = req.body;
        console.log('Corpo da requisição:', body);

        // Remover JSON.parse e usar req.body diretamente
        const { pokemon_name } = body;

        // Verificação adicional para garantir que 'pokemon_name' está presente e é uma string
        if (!pokemon_name || typeof pokemon_name !== 'string') {
            console.warn('Requisição inválida: pokemon_name ausente ou não é uma string');
            res.status(400).json({ error: 'Invalid request body' });
            return;
        }

        const name = pokemon_name.toLowerCase();
        console.log(`Processando pesquisa para: ${name}`);

        // Verificar se o Pokémon já foi pesquisado
        const { data, error } = await supabase
            .from('searches')
            .select('count')
            .eq('pokemon_name', name)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: Row not found
            console.error('Erro ao consultar Supabase:', error);
            throw error;
        }

        if (data) {
            console.log(`Pokémon ${name} já pesquisado ${data.count} vezes. Atualizando contagem...`);
            // Atualizar a contagem
            const { error: updateError } = await supabase
                .from('searches')
                .update({ count: data.count + 1 })
                .eq('pokemon_name', name);

            if (updateError) {
                console.error('Erro ao atualizar contagem no Supabase:', updateError);
                throw updateError;
            }

            res.status(200).json({ message: 'Search updated' });
        } else {
            console.log(`Pokémon ${name} não encontrado na tabela. Inserindo novo registro...`);
            // Inserir novo registro
            const { error: insertError } = await supabase
                .from('searches')
                .insert([{ pokemon_name: name, count: 1 }]);

            if (insertError) {
                console.error('Erro ao inserir novo registro no Supabase:', insertError);
                throw insertError;
            }

            res.status(200).json({ message: 'Search recorded' });
        }
    } catch (e) {
        console.error('Erro na função /api/search:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

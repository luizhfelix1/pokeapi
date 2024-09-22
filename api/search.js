const { createClient } = require('@supabase/supabase-js');

// Obter as variáveis de ambiente da Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { pokemon_name } = JSON.parse(req.body);
        const name = pokemon_name.toLowerCase();

        // Verificar se o Pokémon já foi pesquisado
        const { data, error } = await supabase
            .from('searches')
            .select('count')
            .eq('pokemon_name', name)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: Row not found
            throw error;
        }

        if (data) {
            // Atualizar a contagem
            const { error: updateError } = await supabase
                .from('searches')
                .update({ count: data.count + 1 })
                .eq('pokemon_name', name);

            if (updateError) throw updateError;

            res.status(200).json({ message: 'Search updated' });
        } else {
            // Inserir novo registro
            const { error: insertError } = await supabase
                .from('searches')
                .insert([{ pokemon_name: name, count: 1 }]);

            if (insertError) throw insertError;

            res.status(200).json({ message: 'Search recorded' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

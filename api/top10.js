const { createClient } = require('@supabase/supabase-js');

// Obter as variáveis de ambiente da Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { data, error } = await supabase
            .from('searches')
            .select('pokemon_name, count')
            .order('count', { ascending: false })
            .limit(10);

        if (error) throw error;

        res.status(200).json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

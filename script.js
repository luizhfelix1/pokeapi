$("#theForm").submit(function(e) {
    e.preventDefault();

    var name = $('#nome').val().toLowerCase();
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + name;

    // Mostrar animação de carregamento
    $('#loading').show();

    $.ajax({
        type: 'GET',
        url: apiUrl,
        success: function(ret) {
            // Esconder animação de carregamento
            $('#loading').hide();

            console.log(ret);

            // Exibir informações básicas
            $('#name').text(ret.name);
            $('#imagem').attr('src', ret.sprites.front_default);
            $('#imagem2').attr('src', ret.sprites.back_default);
            $('#imagem3').attr('src', ret.sprites.front_shiny);
            $('#peso').text(ret.weight + " lbs");
            $('#tipo').text(ret.types.map(function(typeInfo) {
                return typeInfo.type.name;
            }).join(', '));
            $('#held_items').text(ret.held_items.length > 0 ? ret.held_items.map(function(item) {
                return item.item.name;
            }).join(', ') : 'Nenhum');

            // Exibir habilidades
            $('#abilities').text(ret.abilities.map(function(abilityInfo) {
                return abilityInfo.ability.name;
            }).join(', '));

            // Exibir estatísticas usando um gráfico de barras
            var stats = ret.stats.map(function(statInfo) {
                return {
                    label: statInfo.stat.name,
                    value: statInfo.base_stat
                };
            });

            // Atualizar o gráfico
            updateStatsChart(stats);
        },
        error: function() {
            // Esconder animação de carregamento
            $('#loading').hide();

            alert('Pokémon não encontrado! Verifique o nome ou ID e tente novamente.');
        }
    });
});

// Função para atualizar o gráfico de estatísticas
function updateStatsChart(stats) {
    // Limpar o conteúdo anterior
    $('#statsChart').empty();

    // Criar barras de estatísticas
    stats.forEach(function(stat) {
        var statBar = $('<div class="stat-bar"></div>');
        statBar.append('<span class="stat-label">' + stat.label + '</span>');
        var bar = $('<div class="bar"></div>').css('width', stat.value + 'px');
        statBar.append(bar);
        statBar.append('<span class="stat-value">' + stat.value + '</span>');
        $('#statsChart').append(statBar);
    });
}

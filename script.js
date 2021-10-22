$("#theForm").submit(function(e) {
    e.preventDefault();

    var name=document.getElementById('nome').value;
    $.ajax({
        type: 'GET',
        url: 'https://pokeapi.co/api/v2/pokemon/'+name,
        success: function(ret){
            //ret = JSON.parse(ret);
            //var peso = (ret.weight / 2.2) * ret.weight; 


            console.log(ret);
            document.getElementById('name').innerHTML=ret.name;
            document.getElementById('imagem').src=ret.sprites.front_default;
            document.getElementById('imagem2').src=ret.sprites.back_default;
            document.getElementById('imagem3').src=ret.sprites.front_shiny;
            document.getElementById('peso').innerHTML=ret.weight+" lbs";
            document.getElementById('tipo').innerHTML=ret.types[0].type.name;
            document.getElementById('held_items').innerHTML=ret.held_items[0].item.name;
            
        }
    });
});
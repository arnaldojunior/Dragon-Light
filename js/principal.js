$(function () {
    var posicaoX;
    var posicaoY;
    var tileSelecionado; //Armazena a url da imagem de fundo do tile escolhido para compor o cenário.
    var tiles = ["img/tiles/default_cobble.png", "img/tiles/default_desert_cobble.png", "img/tiles/default_desert_sand.png",
        "img/tiles/default_dirt.png", "img/tiles/default_dry_grass.png", "img/tiles/default_gold_block.png", 
        "img/tiles/default_grass.png", "img/tiles/default_gravel.png", "img/tiles/default_ice.png",
        "img/tiles/default_lava.png", "img/tiles/default_lava_flowing_animated.png", "img/tiles/default_meselamp.png", "img/tiles/default_mossycobble.png", "img/tiles/default_river_water.png",
        "img/tiles/default_river_water_flowing_animated.png", "img/tiles/default_sand.png", "img/tiles/default_sandstone.png", "img/tiles/default_sandstone_block.png", "img/tiles/default_snow.png",
        "img/tiles/default_snow_side.png", "img/tiles/default_stone.png", "img/tiles/default_stone_block.png",
    ];

    //Carrega as imagens do Tileset.
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] == "img/tiles/default_lava_flowing_animated.png") {
            $("#tiles").append("<div class='lava-flowing'></div>");
        } else if (tiles[i] == "img/tiles/default_river_water_flowing_animated.png") {
            $("#tiles").append("<div class='water-flowing'></div>");
        } else {
            $("#tiles").append("<div style='background: url(" + tiles[i] + ")'></div>");
        }
    }

    //Preenche o cenário com blocos vazios.
    for (let i = 0; i < 25; i++) {
        $("#cenario").append("<div class='empty-tile'></div>");
    }

    //Seleciona o tile para compor o cenário.
    $("#tiles div").click(function () {
        $("#tiles div").removeClass("selecionado");
        $(this).addClass("selecionado");
        tileSelecionado = $(this);
    });

    //Preenche os tiles do cenário.
    $(".empty-tile, .not-empty").click(function () {
        if (tileSelecionado.hasClass("lava-flowing")) {
            $(this).addClass("lava-flowing");
        } else if (tileSelecionado.hasClass("water-flowing")) {
            $(this).addClass("water-flowing");
        } else {
            $(this).removeClass();
            $(this).css("background", tileSelecionado.css("background-image"));
        }
        $(this).removeClass("empty-tile");
        $(this).addClass("not-empty");
    });

    //Remove todos os tiles do cenário.
    $("#limpar").click(function () {
        $("#cenario div").css("background", "none");
        $("#cenario div").addClass("empty-tile");
        $("#cenario div").removeClass("not-empty fogo");
    });

    //Abre a caixa de seleção de personagem.
    $("#new-personagem").click(function () {
        if ($("#cenario").children().length < 16) {
            alert();
        } else {
            $(".personagem-select").css("display", "block");
            $("body").addClass("select-open");
        }
    });

    //Inicializa o personagem selecionado.
    $(".personagem-face").click(function () {
        $(".personagem").css({
            background: $(this).css("background-image"),
            display: "block" //faz aparecer o personagem
        });
        if ($(this).css("background-size") == "288px") {
            $(".personagem").addClass("dragao-3steps");
        } else {
            $(".personagem").removeClass("dragao-3steps");
            $(".personagem").addClass("dragao");
        }
        $(".personagem-select").css("display", "none"); //fecha a caixa de seleção
        $("body").removeClass("select-open");
    });

    //Funções para mover o personagem através do teclado.
    $(document).keydown(function (e) {
        if (e.which == 37) { //left
            $(".personagem").animate({ left: '-=128px' });
            $(".personagem").css("background-position-y", "-96px");
        } else if (e.which == 38) { //up
            $(".personagem").animate({ top: '-=128px' });
            $(".personagem").css("background-position-y", "-288px");
        } else if (e.which == 39) { //right
            $(".personagem").animate({ left: '+=128px' });
            $(".personagem").css("background-position-y", "-192px");
        } else if (e.which == 40) { //down
            $(".personagem").animate({ top: '+=128px' });
            $(".personagem").css("background-position-y", "0");
        }
    });
});
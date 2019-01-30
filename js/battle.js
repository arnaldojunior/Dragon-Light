class Player {
    constructor(name, life, attack) {
        this.name = name;
        this.life = life;
        this.attack = attack;
    }
}

var players = [
    new Player("Black Dragon", 10, 3),
    new Player("Blue Wings Black Dragon", 12, 2),
    new Player("Blue Green Dragon", 8, 2)
];

$(function () {
    var selectPlayer = null;
    var tiles = ["img/tiles/default_cobble.png", "img/tiles/default_desert_cobble.png", "img/tiles/default_desert_sand.png",
        "img/tiles/default_dirt.png", "img/tiles/default_dry_grass.png", "img/tiles/default_gold_block.png",
        "img/tiles/default_grass.png", "img/tiles/default_gravel.png", "img/tiles/default_ice.png",
        "img/tiles/default_lava.png", "img/tiles/default_lava_flowing_animated.png", "img/tiles/default_meselamp.png", "img/tiles/default_mossycobble.png", "img/tiles/default_river_water.png",
        "img/tiles/default_river_water_flowing_animated.png", "img/tiles/default_sand.png", "img/tiles/default_sandstone.png", "img/tiles/default_sandstone_block.png", "img/tiles/default_snow.png",
        "img/tiles/default_snow_side.png", "img/tiles/default_stone.png", "img/tiles/default_stone_block.png",
    ];


    // FUNÇÕES PARA CONSTRUÇÃO DO CENÁRIO
    var map1 = [21, 21, 21, 10, 10, 10, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 10, 21, 10, 21, 21, 21, 21];
    var map2 = [14, 17, 15, 15, 17, 14, 15, 15, 15, 15, 14, 15, 15, 15, 15, 14, 17, 15, 15, 15, 14, 14, 14, 14, 14];
    var map3 = [3, 3, 3, 17, 3, 3, 17, 3, 3, 3, 3, 3, 17, 3, 3, 3, 3, 17, 3, 17, 3, 3, 3, 3, 3];
    var map4 = [17, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 17, 4, 4, 17, 4, 4, 4, 4, 4, 4, 4, 4];
    var maps = [map1, map2, map3, map4];

    //buildMap(map2);

    //Carrega os ícones que representam o mapa na caixa de seleção.
    for (let i = 0; i < maps.length; i++) {
        $(".map-select").append("<div class='map-icon'><p>" + (i + 1) + "</p></div>");
    }

    //Exibe o mapa referenciado pelo ícone
    $(".map-icon").mouseover(function () {
        let i = $(this).find("p").text();
        clearMap();
        buildMap(maps[i - 1]);
    });

    //Faz aparecer os jogadores e inicializa o jogo.
    $(".map-icon").click(function () {
        $(".player").css("display", "block");
        $(".map-select-box").hide();
    });

    //Limpa o cenário
    function clearMap() {
        $("#cenario").children(".not-empty").remove();
    }

    function buildMap(blocks) {
        for (let i = 0; i < 25; i++) {
            if (tiles[blocks[i]] == "img/tiles/default_lava_flowing_animated.png") {
                $("#cenario").append("<div class='not-empty lava-flowing'></div>");
            } else if (tiles[blocks[i]] == "img/tiles/default_river_water_flowing_animated.png") {
                $("#cenario").append("<div class='not-empty water-flowing'></div>");
            } else {
                $("#cenario").append(
                    "<div class='not-empty' style='background: url(" + tiles[blocks[i]] + ")'></div>");
            }
        }
    }

    //Abre a caixa de seleção de personagem.
    $(".select-player-one").click(function () {
        $(".player-select-box").css("display", "block");
        $("body").addClass("select-open");
        selectPlayer = "one";
    });

    $(".select-player-two").click(function () {
        $(".player-select-box").css("display", "block");
        $("body").addClass("select-open");
        selectPlayer = "two";
    });

    //Inicializa o personagem selecionado.
    $(".player-face").click(function () {
        if (selectPlayer == "one") {
            $(".player-one").css({
                'background-image': $(this).css("background-image"),
                'background-position-y': '-192px'
            });
            //Atribui a animação apropriada.
            if ($(this).css("background-size") == "288px") {
                $(".player-one").addClass("dragao-3steps");
            } else {
                $(".player-one").removeClass("dragao-3steps");
                $(".player-one").addClass("dragao");
            }
            $(".one img").css({
                "background-image": $(this).css("background-image"),
                "background-position-x": $(this).css("background-position-x")
            });
            $(".select-player-one").hide(); //esconde o botão de add personagem
            loadPlayerStatus($(this), "one");
            $(".one").show(); //mostra o status do player selecionado

        } else if (selectPlayer == "two") {
            $(".player-two").css({
                'background-image': $(this).css("background-image"),
                'background-position-y': '-96px'
            });
            //Atribui a animação apropriada.
            if ($(this).css("background-size") == "288px") {
                $(".player-two").addClass("dragao-3steps");
            } else {
                $(".player-two").removeClass("dragao-3steps");
                $(".player-two").addClass("dragao");
            }
            $(".two img").css({
                "background-image": $(this).css("background-image"),
                "background-position-x": $(this).css("background-position-x")
            });
            $(".select-player-two").hide();
            loadPlayerStatus($(this), "two");
            $(".two").show();
        }
        //Fecha a caixa de seleção
        $(".player-select-box").css("display", "none");
        $("body").removeClass("select-open");

        if (playersSelected()) {
            $(".map-select-box").show();
        }
    });

    function playersSelected() {
        if (($(".player-one").css("background-image") != 'none')
            && ($(".player-two").css("background-image") != 'none')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Carrega no status as características do dragão selecionado
     * @param {*} dragon div que representa o dragão selecionado
     * @param {*} player jogador um ou dois
     */
    function loadPlayerStatus(dragon, player) {
        let id = dragon.attr("id");
        $("." + player + " .name").attr("value", players[id].name);
        $("." + player + " .life").attr("value", players[id].life);
        $("." + player + " .attack").attr("value", players[id].attack);
    }

    //Funções para mover o personagem através do teclado.
    $(document).keydown(function (e) {
        //Movimenação do player 1
        if (e.which == 65) { //left
            $(".player-one").animate({ left: '-=128px' });
            $(".player-one").css("background-position-y", "-96px");
        } else if (e.which == 87) { //up
            $(".player-one").animate({ top: '-=128px' });
            $(".player-one").css("background-position-y", "-288px");
        } else if (e.which == 68) { //right
            $(".player-one").animate({ left: '+=128px' });
            $(".player-one").css("background-position-y", "-192px");
        } else if (e.which == 83) { //down
            $(".player-one").animate({ top: '+=128px' });
            $(".player-one").css("background-position-y", "0");
        }
        //Movimentação do player 2
        if (e.which == 37) { //left
            $(".player-two").animate({ left: '-=128px' });
            $(".player-two").css("background-position-y", "-96px");
        } else if (e.which == 38) { //up
            $(".player-two").animate({ top: '-=128px' });
            $(".player-two").css("background-position-y", "-288px");
        } else if (e.which == 39) { //right
            $(".player-two").animate({ left: '+=128px' });
            $(".player-two").css("background-position-y", "-192px");
        } else if (e.which == 40) { //down
            $(".player-two").animate({ top: '+=128px' });
            $(".player-two").css("background-position-y", "0");
        }
    });
});
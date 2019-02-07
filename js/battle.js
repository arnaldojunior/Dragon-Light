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

var playerOne;
var playerTwo;

$(function () {
    var selectPlayer = null;
    var fireballsQuant = 0;
    var playerOneCanShot = true;
    var colisionDetector = setInterval(detectColision, 200);
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

    initTest();

    function initTest() {
        buildMap(maps[0]);
        $(".player-one, .player-two").css({
            'background-image': $("#0").css("background-image"),
            'background-position-y': '-192px',
            display: 'block'
        });
        $(".player-two").css('background-position-y', '-96px');
        $(".player-one, .player-two").addClass("dragao");
    }

    //Carrega os ícones que representam o mapa na caixa de seleção.
    for (let i = 0; i < maps.length; i++) {
        $(".map-select").append("<div class='map-icon'><p>" + (i + 1) + "</p></div>");
    }

    //Exibe o mapa referenciado pelo ícone.
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

    //Constrói o mapa.
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
        $(".player-" + selectPlayer).css({
            'background-image': $(this).css("background-image"),
            'background-position-y': '-192px'
        });
        //Posiciona o player dois na direção correta.
        if (selectPlayer == "two") {
            $(".player-two").css("background-position-y", "-96px");
        }

        //Atribui a animação apropriada.
        if ($(this).css("background-size") == "288px") {
            $(".player-" + selectPlayer).addClass("dragao-3steps");
        } else {
            $(".player-" + selectPlayer).removeClass("dragao-3steps");
            $(".player-" + selectPlayer).addClass("dragao");
        }
        $("." + selectPlayer + " img").css({
            "background-image": $(this).css("background-image"),
            "background-position-x": $(this).css("background-position-x")
        });
        $(".select-player-" + selectPlayer).hide(); //esconde o botão de add personagem
        loadPlayerStatus($(this), selectPlayer);
        $("." + selectPlayer).show(); //mostra o status do player selecionado

        //Fecha a caixa de seleção
        $(".player-select-box").css("display", "none");
        $("body").removeClass("select-open");

        if (playersSelected()) {
            $(".map-select-box").show();
        }
    });

    //Verifica se os dois jogadores foram selecionados.
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

    function fire(player) {
        let player_position_x = parseInt($(player).css("left")) + 16;
        let player_position_y = parseInt($(player).css("top")) + 16;
        let fire_direction;
        let fire_position_x;
        let fire_position_y;

        playerOneCanShot = false;

        //Alinha a direção e posição do fogo com a posição do dragão.
        if ($(player).css("background-position-y") == "0px") { //looking down
            fire_direction = "-384px";
            fire_position_y = player_position_y + 80;
            fire_position_x = player_position_x;
        } else if ($(player).css("background-position-y") == "-96px") { //looking left
            fire_direction = "0px";
            fire_position_y = player_position_y + 16;
            fire_position_x = player_position_x - 90;
        } else if ($(player).css("background-position-y") == "-192px") { //looking right
            fire_direction = "-256px";
            fire_position_y = player_position_y + 16;
            fire_position_x = player_position_x + 90;
        } else { //looking up
            fire_direction = "-128px";
            fire_position_y = player_position_y - 90;
            fire_position_x = player_position_x;
        }

        $("#cenario").append("<div class='fireball " + fireballsQuant + "'></div>")
            .children("." + fireballsQuant).animate({
                top: fire_position_y,
                left: fire_position_x,
                'background-position-y': fire_direction
            }, 0, function () {
                //Encaminha o fogo para uma direção específica.
                if (fire_direction == "0px") { //left
                    $(this).animate({ left: 0 }, 1000, 'linear', function () {
                        playerOneCanShot = true;
                        $(this).remove();
                    }).fadeOut('slow');
                } else if (fire_direction == "-128px") { //top
                    $(this).animate({ top: 0 }, 1000, 'linear', function () {
                        playerOneCanShot = true;
                        $(this).remove();
                    });
                } else if (fire_direction == "-256px") { //right
                    $(this).animate({ left: 576 }, 1000, 'linear', function () {
                        playerOneCanShot = true;
                        $(this).remove();
                    });
                } else { //bottom
                    $(this).animate({ top: 576 }, 1000, 'linear', function () {
                        playerOneCanShot = true;
                        $(this).remove();
                    });
                }
            });
        fireballsQuant++;
    }

    //Verifica se o jogador informado pode se mover para a direção especificada.
    function canMoveTo(player, direction) {
        if (parseInt($(player).css(direction)) >= 128) {
            return true;
        } else { return false };
    }

    //Funções para mover o personagem através do teclado.
    $(document).keydown(function (e) {
        //Movimentação do player 1
        if (e.which == 65) { //left
            if (canMoveTo(".player-one", "left")) {
                $(".player-one").filter(":not(:animated)").animate({ left: '-=128px' }, 600, 'linear');
            }
            $(".player-one").css("background-position-y", "-96px");
        } else if (e.which == 87) { //up
            if (canMoveTo(".player-one", "top")) {
                $(".player-one").filter(":not(:animated)").animate({ top: '-=128px' }, 600, 'linear');
            }
            $(".player-one").css("background-position-y", "-288px");
        } else if (e.which == 68) { //right
            if (canMoveTo(".player-one", "right")) {
                $(".player-one").filter(":not(:animated)").animate({ left: '+=128px' }, 600, 'linear');
            }
            $(".player-one").css("background-position-y", "-192px");
        } else if (e.which == 83) { //down
            if (canMoveTo(".player-one", "bottom")) {
                $(".player-one").filter(":not(:animated)").animate({ top: '+=128px' }, 600, 'linear');
            }
            $(".player-one").css("background-position-y", "0");
        } else if (e.which == 70) { //fireball
            if (playerOneCanShot) {
                fire(".player-one");
            }
            detectColision();
        }
        //Movimentação do player 2
        if (e.which == 37) { //left
            if (canMoveTo(".player-two", "left")) {
                $(".player-two").filter(":not(:animated)").animate({ right: '+=128px' }, 600, 'linear');
            }
            $(".player-two").css("background-position-y", "-96px");
        } else if (e.which == 38) { //up
            if (canMoveTo(".player-two", "top")) {
                $(".player-two").filter(":not(:animated)").animate({ top: '-=128px' }, 600, 'linear');
            }
            $(".player-two").css("background-position-y", "-288px");
        } else if (e.which == 39) { //right
            if (canMoveTo(".player-two", "right")) {
                $(".player-two").filter(":not(:animated)").animate({ right: '-=128px' }, 600, 'linear');
            }
            $(".player-two").css("background-position-y", "-192px");
        } else if (e.which == 40) { //down
            if (canMoveTo(".player-two", "bottom")) {
                $(".player-two").filter(":not(:animated)").animate({ top: '+=128px' }, 600, 'linear');
            }
            $(".player-two").css("background-position-y", "0");
        }
    });

    //Percorre todos os elementos verificando se houve colisão.
    function detectColision() {
        let gameElements = $("#cenario").children(".fireball, .player");
        console.log("Elements: " + gameElements.length);
        for (let i = 0; i < gameElements.length; i++) {
            let element_x = gameElements[i];

            for (let j = i + 1; j < gameElements.length; j++) {
                let element_y = gameElements[j];

                if (colisionDetected($(element_x), $(element_y))) {
                    if ($(element_x).hasClass("fireball")) {
                        explodeFireball($(element_x));
                    }
                    if ($(element_y).hasClass("fireball")) {
                        explodeFireball($(element_y));
                    }
                }
            }
        }
    }

    function explodeFireball(fireball) {
        console.log("fireball");
        $(fireball).stop(true, false).removeClass().fadeIn(0)
            .css("background-position-y", 0).addClass("explosion").fadeOut(1100);
        playerOneCanShot = true;
    }

    //Verifica se houve colisão entre os elementos especificados.
    function colisionDetected(element1, element2) {
        let obj1X = element1.position().left;
        let obj1Y = element1.position().top;
        let obj1Height = element1.outerHeight();
        let obj1Width = element1.outerWidth();
        let obj1FullHeight = obj1Y + obj1Height;
        let obj1FullWidth = obj1X + obj1Width;
        let obj2X = element2.position().left;
        let obj2Y = element2.position().top;
        let obj2Height = element2.outerHeight();
        let obj2Width = element2.outerWidth();
        let obj2FullHeight = obj2Y + obj2Height;
        let obj2FullWidth = obj2X + obj2Width;

        if (obj1FullHeight > obj2Y && obj1Y < obj2FullHeight
            && obj1FullWidth > obj2X && obj1X < obj2FullWidth) {
            console.log("Collision");
            return true;
        }
        return false;
    }
});
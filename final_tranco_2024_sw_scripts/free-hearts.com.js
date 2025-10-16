(global => {
const base = location.href.replace(/[^/]+$/, '');
const hashParam = '_cache';
const cacheName = 'treecardgames-cache';
const CDN_HOSTNAME = 'ajax.googleapis.com';

const _enabled = true;
const _precache = [["game/js/lib/require.js", "b5c80af153"], ["favicon.ico", "3caaed8ced"], ["index.html", "9c3dc79d63"], ["app-ads.txt", "591775819b"], ["game/js/main.js", "262ac994c1"], ["game/style.css", "96f96447e9"], ["manifest.json", "6b207eca65"], ["ads.txt", "591775819b"]];
const _hashes = [["game/img/cards/182x247/flowers_close_ups.png", "658e8dc0bf"], ["game/img/buttons/menu/activate.png", "658e8dc0bf"], ["game/img/cards/182x247/large_print_london.png", "658e8dc0bf"], ["game/img/backs/146x198/classic_green.png", "658e8dc0bf"], ["game/img/players/pn104.png", "658e8dc0bf"], ["game/sounds/game_completed.m4a", "4d605e5fbf"], ["game/img/backs/182x247/pink_daisy.png", "658e8dc0bf"], ["game/img/players/p36.png", "658e8dc0bf"], ["game/img/buttons/menu/help.png", "658e8dc0bf"], ["game/img/backgrounds/thumbnails/blue_rays.jpg", "8f0a27ec8c"], ["game/img/backs/146x198/butterflies.png", "658e8dc0bf"], ["game/img/backs/146x198/cross_green.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/tools/canvg.min.js", "b3b8d33f36"], ["game/js/lang/sv.js", "d106501a89"], ["game/img/backs/182x247/classic_green.png", "658e8dc0bf"], ["game/img/backs/thumbnails/classic_green.png", "658e8dc0bf"], ["game/img/players/pn121.png", "658e8dc0bf"], ["game/templates/menu/buy.html", "a3065c524e"], ["game/js/lang/ru.js", "ff7559fbd2"], ["game/img/players/pn117.png", "658e8dc0bf"], ["game/img/backgrounds/1920x1200/light_wood.jpg", "921908e559"], ["game/img/backs/182x247/lawrence.png", "658e8dc0bf"], ["game/img/backs/182x247/monet.png", "658e8dc0bf"], ["game/templates/menu/themes.html", "0d5bfa4910"], ["game/img/backs/thumbnails/puppy_love.png", "658e8dc0bf"], ["game/img/cards/thumbnails/caricatures.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/svgavatars.core.min.js", "4653263bca"], ["game/img/players/pn308.png", "658e8dc0bf"], ["game/js/lib/ionic/css/ionic.css", "3e08134bae"], ["game/js/lib/jquery-3.5.1.min.js", "095c9fea12"], ["game/img/players/p22.png", "658e8dc0bf"], ["game/js/lang/pl.js", "95a369c724"], ["game/img/icons/icon_96x96.png", "658e8dc0bf"], ["game/img/players/pn106.png", "658e8dc0bf"], ["game/js/Simulator.js", "bb7aa0f054"], ["game/img/players/p24.png", "658e8dc0bf"], ["game/sounds/game_completed.mp3", "b919369956"], ["game/img/players/p20.png", "658e8dc0bf"], ["game/img/players/p34.png", "658e8dc0bf"], ["game/img/backs/thumbnails/rhombus_blue.png", "658e8dc0bf"], ["game/img/players/p13.png", "658e8dc0bf"], ["game/js/lang/da.js", "b8933cbd4d"], ["game/js/win-bg.js", "17cc7b4485"], ["game/templates/menu/options/score.html", "bcfc201144"], ["game/img/players/pn320.png", "658e8dc0bf"], ["game/sounds/queen_spades.m4a", "8b51c885ce"], ["game/img/backgrounds/thumbnails/curious_kittens.jpg", "1f916a909c"], ["game/img/cards/182x247/caricatures.png", "658e8dc0bf"], ["game/img/backs/182x247/puppy_love.png", "658e8dc0bf"], ["game/img/backs/146x198/lawrence.png", "658e8dc0bf"], ["game/templates/menu/license.html", "623be78259"], ["game/img/others/5-stars.png", "658e8dc0bf"], ["game/img/players/pn100.png", "658e8dc0bf"], ["game/js/lang/ja.js", "e36c1073ab"], ["game/templates/menu/options/user_interface.html", "102d5176de"], ["game/img/others/hearts-logo_300x300.png", "658e8dc0bf"], ["game/img/backs/182x247/rhombus_green.png", "658e8dc0bf"], ["game/img/buttons/menu/new_game.png", "658e8dc0bf"], ["game/js/lang/it.js", "20a0f6b1af"], ["game/img/players/pn113.png", "658e8dc0bf"], ["game/img/icons/icon_512x512.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-zh_hant.js", "215f7e8afb"], ["game/img/players/p17.png", "658e8dc0bf"], ["game/img/backs/thumbnails/dog.png", "658e8dc0bf"], ["game/img/themes/flowers.jpg", "9dcbc4ff15"], ["game/sounds/passing_cards.ogg", "9c18d66a7e"], ["game/img/players/pn116.png", "658e8dc0bf"], ["game/img/players/p4.png", "658e8dc0bf"], ["game/img/backs/146x198/puppy_love.png", "658e8dc0bf"], ["game/img/players/p33.png", "658e8dc0bf"], ["game/img/backs/182x247/cross_brown.png", "658e8dc0bf"], ["game/js/lib/ionic/fonts/ionicons.woff", "cbbc32bd92"], ["game/img/others/arrow-up.png", "658e8dc0bf"], ["game/img/icons/icon_152x152.png", "658e8dc0bf"], ["game/img/players/p19.png", "658e8dc0bf"], ["game/sounds/game_won.mp3", "b3e35585f2"], ["game/img/players/pn114.png", "658e8dc0bf"], ["game/img/backgrounds/thumbnails/dark_wood.jpg", "6d4e8813b3"], ["game/img/backs/thumbnails/cross_red.png", "658e8dc0bf"], ["game/sounds/game_won.m4a", "672a0c1f4d"], ["game/img/players/pn300.png", "658e8dc0bf"], ["game/img/players/p11.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/tools/spectrum.min.js", "ee7c7d12d4"], ["game/img/backs/146x198/story_time.png", "658e8dc0bf"], ["game/img/backs/146x198/rhombus_green.png", "658e8dc0bf"], ["game/js/lang/pt.js", "39c9e59729"], ["game/img/players/p28.png", "658e8dc0bf"], ["game/templates/menu/score-menu.html", "579871f810"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-en.js", "75ee822a8c"], ["game/img/players/pn108.png", "658e8dc0bf"], ["game/js/lib/soundjs-0.6.2.min.js", "66f85af66b"], ["game/templates/menu/overall_statistics.html", "904feb6fbb"], ["game/img/backs/thumbnails/rhombus_green.png", "658e8dc0bf"], ["game/img/backs/thumbnails/rhombus_red.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-zh_hans.js", "e281382df5"], ["game/js/lang/nl.js", "86c750bb96"], ["game/img/others/games.jpg", "83f32ebcf8"], ["game/img/cards/146x198/big_ben.png", "658e8dc0bf"], ["game/img/players/pn318.png", "658e8dc0bf"], ["game/sounds/game_completed.ogg", "99c2a95f8e"], ["game/img/backs/182x247/classic_red.png", "658e8dc0bf"], ["game/img/players/pn323.png", "658e8dc0bf"], ["game/img/backs/146x198/classic_brown.png", "658e8dc0bf"], ["game/img/players/pn102.png", "658e8dc0bf"], ["game/img/backs/146x198/pink_daisy.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-es.js", "04c655de90"], ["game/sounds/card_select.m4a", "6930c9fabf"], ["game/js/lib/image-maker/player-image-maker.html", "163f1cb548"], ["game/img/backs/146x198/monet.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-pl.js", "51d92c281f"], ["game/img/cards/thumbnails/flowers_close_ups.png", "658e8dc0bf"], ["game/templates/menu/trial.html", "370c1cb8f2"], ["game/img/players/pn123.png", "658e8dc0bf"], ["game/sounds/queen_spades.mp3", "04a8533d11"], ["game/img/players/pn107.png", "658e8dc0bf"], ["game/img/club.png", "658e8dc0bf"], ["game/img/players/p38.png", "658e8dc0bf"], ["game/sounds/first_hearts.m4a", "c150433308"], ["game/templates/menu/detailed_statistics.html", "a8a1a02a56"], ["game/img/backgrounds/thumbnails/blue_felt.jpg", "6de2172a19"], ["game/js/lang/es.js", "06ddcdccee"], ["game/img/themes/large_print_green.jpg", "e6e89fca27"], ["game/img/backs/thumbnails/butterflies.png", "658e8dc0bf"], ["game/img/players/pn306.png", "658e8dc0bf"], ["game/img/players/pn110.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/jquery-3.4.1.min.js", "220afd743d"], ["game/img/players/p6.png", "658e8dc0bf"], ["game/img/backgrounds/thumbnails/red_felt.jpg", "d978fd0135"], ["game/templates/menu/cardback.html", "9e9df17f73"], ["game/img/backgrounds/1920x1200/green_felt.jpg", "2e9e13c85d"], ["game/img/players/p26.png", "658e8dc0bf"], ["game/img/players/pn302.png", "658e8dc0bf"], ["game/js/McBrain.js", "4f928a96b4"], ["game/templates/menu/players.html", "a368542a06"], ["game/img/cards/182x247/puppies.png", "658e8dc0bf"], ["game/img/backs/146x198/classic_blue.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-nb.js", "2d093faba2"], ["game/templates/menu/appearance.html", "01f966aef8"], ["game/img/others/splash.png", "658e8dc0bf"], ["game/img/backs/146x198/cross_red.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-pt.js", "93ce568bab"], ["game/templates/menu/current_statistics.html", "fb4b7b55a1"], ["game/img/players/pn316.png", "658e8dc0bf"], ["game/img/backs/146x198/rhombus_red.png", "658e8dc0bf"], ["game/templates/menu/options.html", "9b556e7a93"], ["game/img/players/pn112.png", "658e8dc0bf"], ["game/img/players/p40.png", "658e8dc0bf"], ["game/img/players/pn304.png", "658e8dc0bf"], ["game/js/lib/ionic/fonts/ionicons.eot", "e8f3b07679"], ["game/img/cards/182x247/modern.png", "658e8dc0bf"], ["game/sounds/deal_animation.m4a", "4c12c975bb"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-fr.js", "c9d17fc0e1"], ["game/img/players/pn317.png", "658e8dc0bf"], ["game/js/BrainWorker.js", "968114770b"], ["game/img/backs/thumbnails/pink_daisy.png", "658e8dc0bf"], ["game/img/players/pn118.png", "658e8dc0bf"], ["game/js/lang/zh_hans.js", "99ea120d1f"], ["game/img/backs/146x198/rhombus_blue.png", "658e8dc0bf"], ["game/img/cards/146x198/large_print_london.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/svgavatars.tools.js", "9d535f32d8"], ["game/img/backs/thumbnails/rhombus_brown.png", "658e8dc0bf"], ["game/img/themes/caricatures.jpg", "2d84a508b7"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-ja.js", "3c7fe49dc7"], ["game/img/cards/146x198/flowers_close_ups.png", "658e8dc0bf"], ["game/img/players/pn321.png", "658e8dc0bf"], ["game/img/players/p30.png", "658e8dc0bf"], ["game/img/icons/icon_144x144.png", "658e8dc0bf"], ["game/img/backs/182x247/story_time.png", "658e8dc0bf"], ["game/img/buttons/menu/statistics.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-sv.js", "0326db14a3"], ["game/img/backgrounds/1920x1200/field_of_daisies.jpg", "cbbc9d8077"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-nl.js", "7327fe9521"], ["game/img/backs/thumbnails/cross_blue.png", "658e8dc0bf"], ["game/img/buttons/menu/about.png", "658e8dc0bf"], ["game/img/players/p15.png", "658e8dc0bf"], ["game/img/themes/green_felt.jpg", "ad442f3cea"], ["game/img/cards/thumbnails/large_print_modern.png", "658e8dc0bf"], ["game/img/cards/146x198/large_print.png", "658e8dc0bf"], ["game/img/cards/thumbnails/large_print_london.png", "658e8dc0bf"], ["game/img/backs/182x247/renoir.png", "658e8dc0bf"], ["game/img/players/pn305.png", "658e8dc0bf"], ["game/img/cards/146x198/caricatures.png", "658e8dc0bf"], ["game/css/style.css", "99dda216e8"], ["game/js/lib/image-maker/player-image-maker/js/svgavatars.defaults.js", "f06bcc52c9"], ["game/img/players/pn303.png", "658e8dc0bf"], ["game/img/players/pn307.png", "658e8dc0bf"], ["game/img/icons/icon_128x128.png", "658e8dc0bf"], ["game/img/backs/146x198/rose.png", "658e8dc0bf"], ["game/img/cards/thumbnails/large_print.png", "658e8dc0bf"], ["game/sounds/first_hearts.mp3", "1e1d4169eb"], ["game/js/prematureOptimization.js", "2657a88f4d"], ["game/img/players/pn312.png", "658e8dc0bf"], ["game/templates/game-area.html", "75bc2498cc"], ["game/sounds/deal_animation.mp3", "8719a65557"], ["game/img/players/p39.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-de.js", "af28c5cb66"], ["game/img/themes/puppies.jpg", "07e8ba0cae"], ["game/img/players/p9.png", "658e8dc0bf"], ["game/img/players/pn310.png", "658e8dc0bf"], ["game/img/spade.png", "658e8dc0bf"], ["game/img/backs/thumbnails/classic_red.png", "658e8dc0bf"], ["game/sounds/first_hearts.ogg", "4bd5d7fe21"], ["game/img/players/p25.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/json/svgavatars-male-data.json", "6f2e9e041b"], ["game/sounds/card_select.mp3", "082cf19ab0"], ["game/templates/menu/debug.html", "d45d68f4ef"], ["game/sounds/move_card.mp3", "84cab8a160"], ["game/sounds/deal_animation.ogg", "3492b5d2f8"], ["game/img/cards/182x247/kittens.png", "658e8dc0bf"], ["game/img/backs/182x247/dog.png", "658e8dc0bf"], ["game/img/players/pn105.png", "658e8dc0bf"], ["game/img/backgrounds/1920x1200/light_wood_tiles.jpg", "be579b1a5d"], ["game/sounds/move_card.m4a", "cbafbfc039"], ["game/img/players/pn103.png", "658e8dc0bf"], ["game/img/themes/kittens.jpg", "12c79eb621"], ["game/img/backs/146x198/dog.png", "658e8dc0bf"], ["game/img/backgrounds/thumbnails/light_wood.jpg", "3ff1780240"], ["game/img/players/p31.png", "658e8dc0bf"], ["game/img/backgrounds/1920x1200/blue_felt.jpg", "eab37188ce"], ["game/sounds/cards_close_trick.m4a", "8cd8fd80f2"], ["game/js/lib/ionic/js/ionic.bundle.js", "56ad1d31bd"], ["game/js/lib/image-maker/player-image-maker/js/tools/StackBlur.js", "9e431cb8d7"], ["game/img/buttons/menu/appearance.png", "658e8dc0bf"], ["game/img/backs/146x198/cross_brown.png", "658e8dc0bf"], ["game/sounds/collect_cards.m4a", "02b0e172c6"], ["game/img/backs/thumbnails/classic_blue.png", "658e8dc0bf"], ["game/img/backs/thumbnails/white_kitten.png", "658e8dc0bf"], ["game/js/lang/de.js", "25ecbb27b0"], ["game/img/players/p8.png", "658e8dc0bf"], ["game/img/backgrounds/1920x1200/blue_rays.jpg", "a3a50004f9"], ["game/img/backs/thumbnails/monet.png", "658e8dc0bf"], ["game/img/cards/thumbnails/kittens.png", "658e8dc0bf"], ["game/img/backs/146x198/white_kitten.png", "658e8dc0bf"], ["game/img/cards/146x198/puppies.png", "658e8dc0bf"], ["game/img/backs/thumbnails/renoir.png", "658e8dc0bf"], ["game/img/backgrounds/1920x1200/curious_kittens.jpg", "9bd04f194a"], ["game/img/others/hearts_broken.png", "658e8dc0bf"], ["game/js/lib/ionic/fonts/ionicons.svg", "621bd38684"], ["game/img/backgrounds/1920x1200/dark_wood.jpg", "a4f3a1c414"], ["game/img/backs/146x198/renoir.png", "658e8dc0bf"], ["game/sounds/passing_cards.mp3", "5f49d5c256"], ["game/templates/menu/cardsets.html", "e5ab9fed14"], ["game/js/Brain.js", "4b72359851"], ["game/img/backs/182x247/cross_red.png", "658e8dc0bf"], ["game/img/backs/182x247/cross_green.png", "658e8dc0bf"], ["game/img/backs/146x198/rhombus_brown.png", "658e8dc0bf"], ["game/img/backgrounds/thumbnails/puppies.jpg", "5e61cd2867"], ["game/img/cards/146x198/large_print_modern.png", "658e8dc0bf"], ["game/img/icons/icon_192x192.png", "658e8dc0bf"], ["game/img/players/pn309.png", "658e8dc0bf"], ["game/img/others/arrow-down.png", "658e8dc0bf"], ["game/img/others/hearts-logo.png", "658e8dc0bf"], ["game/img/cards/146x198/kittens.png", "658e8dc0bf"], ["game/img/cards/182x247/large_print_modern.png", "658e8dc0bf"], ["game/img/backs/thumbnails/classic_brown.png", "658e8dc0bf"], ["game/sounds/card_select.ogg", "1510f230a4"], ["game/sounds/passing_cards.m4a", "9b0d4603d6"], ["game/img/players/p35.png", "658e8dc0bf"], ["game/img/cards/182x247/big_ben.png", "658e8dc0bf"], ["game/img/backs/146x198/classic_red.png", "658e8dc0bf"], ["game/img/backs/146x198/cross_blue.png", "658e8dc0bf"], ["game/img/backgrounds/thumbnails/light_wood_tiles.jpg", "ea51f9c07f"], ["game/img/players/p37.png", "658e8dc0bf"], ["game/js/lang/nb.js", "99ce3c7ac1"], ["game/img/backs/182x247/butterflies.png", "658e8dc0bf"], ["game/img/players/pn301.png", "658e8dc0bf"], ["game/img/players/p10.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/json/svgavatars-female-data.json", "376293ff5e"], ["game/img/players/pn101.png", "658e8dc0bf"], ["game/img/cards/thumbnails/puppies.png", "658e8dc0bf"], ["game/img/players/pn109.png", "658e8dc0bf"], ["game/img/backs/182x247/rhombus_brown.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-hi.js", "168144222b"], ["game/js/lang/fr.js", "3a1f11a802"], ["game/img/players/p18.png", "658e8dc0bf"], ["game/sounds/game_won.ogg", "53089ac7db"], ["game/templates/menu/activation.html", "8156cc5b10"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-da.js", "76094f72b6"], ["game/sounds/cards_close_trick.mp3", "57747d17ea"], ["game/img/buttons/menu/players.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/tools/rgbcolor.js", "2cae76b250"], ["game/js/lib/image-maker/player-image-maker/js/tools/svg.min.js", "43f2da940a"], ["game/templates/menu/about.html", "6fb192ea06"], ["game/img/backgrounds/thumbnails/parquet.jpg", "f51f90305c"], ["game/img/players/pn122.png", "658e8dc0bf"], ["game/img/cards/thumbnails/big_ben.png", "658e8dc0bf"], ["game/img/players/pn324.png", "658e8dc0bf"], ["game/img/players/pn111.png", "658e8dc0bf"], ["game/js/lang/en.js", "ec5b4ade5a"], ["game/img/players/pn500.png", "658e8dc0bf"], ["game/img/others/arrow-left.png", "658e8dc0bf"], ["game/img/players/p7.png", "658e8dc0bf"], ["game/img/players/pn315.png", "658e8dc0bf"], ["game/img/buttons/menu/buy.png", "658e8dc0bf"], ["game/img/players/pn322.png", "658e8dc0bf"], ["game/img/others/heart_score.png", "658e8dc0bf"], ["game/js/lang/zh_hant.js", "883ea8a154"], ["game/img/players/p1.png", "658e8dc0bf"], ["game/img/themes/light_wood.jpg", "c9462c4795"], ["game/img/players/pn119.png", "658e8dc0bf"], ["game/img/players/p16.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/css/svgavatars.css", "3b32f067b2"], ["game/js/PomDPSimulator.js", "007bbc00fa"], ["game/img/cards/182x247/large_print.png", "658e8dc0bf"], ["game/templates/menu/players_ranking.html", "4bb4ebc010"], ["game/img/players/p27.png", "658e8dc0bf"], ["game/img/players/pn115.png", "658e8dc0bf"], ["game/sounds/collect_cards.ogg", "137e4eb733"], ["game/js/lib/ionic/js/angular/angular-route.js", "bfceed2f80"], ["game/img/players/pn311.png", "658e8dc0bf"], ["game/img/players/pn120.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-it.js", "b2599542bb"], ["game/img/backs/146x198/cat.png", "658e8dc0bf"], ["game/templates/menu/avatar.html", "1c42d4a3a6"], ["game/img/buttons/menu_command.png", "658e8dc0bf"], ["game/img/players/p5.png", "658e8dc0bf"], ["game/sounds/collect_cards.mp3", "32129cf605"], ["game/img/backs/182x247/cross_blue.png", "658e8dc0bf"], ["game/img/players/pn319.png", "658e8dc0bf"], ["game/img/players/p3.png", "658e8dc0bf"], ["game/sounds/queen_spades.ogg", "9f7f995d68"], ["game/img/flip.png", "658e8dc0bf"], ["game/img/players/p14.png", "658e8dc0bf"], ["game/img/backs/thumbnails/cat.png", "658e8dc0bf"], ["game/img/backgrounds/1920x1200/puppies.jpg", "6409cf181d"], ["game/img/heart.png", "658e8dc0bf"], ["game/img/backgrounds/1920x1200/red_felt.jpg", "03db3c0bd2"], ["game/sounds/move_card.ogg", "befdde2195"], ["game/js/lib/image-maker/player-image-maker/css/normalize.css", "93a41d2047"], ["game/templates/menu.html", "80e59291fe"], ["game/img/backs/182x247/rose.png", "658e8dc0bf"], ["game/img/players/p12.png", "658e8dc0bf"], ["game/img/players/pn124.png", "658e8dc0bf"], ["game/img/backs/182x247/cat.png", "658e8dc0bf"], ["game/templates/menu/settings.html", "76d587cbf1"], ["game/img/cards/146x198/modern.png", "658e8dc0bf"], ["game/js/lang/hi.js", "7f1a95cdc8"], ["game/img/players/pn313.png", "658e8dc0bf"], ["game/img/backs/182x247/white_kitten.png", "658e8dc0bf"], ["game/templates/rate-reminder.html", "0ee662df10"], ["game/img/backs/thumbnails/story_time.png", "658e8dc0bf"], ["game/templates/menu/statistics.html", "8f42206fbb"], ["game/img/backgrounds/thumbnails/field_of_daisies.jpg", "0d91d62fd3"], ["game/img/backs/thumbnails/rose.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/css/spectrum.css", "0d1666aba6"], ["game/img/players/p21.png", "658e8dc0bf"], ["game/sounds/cards_close_trick.ogg", "8895dfd2a1"], ["game/img/others/arrow-right.png", "658e8dc0bf"], ["game/img/players/p2.png", "658e8dc0bf"], ["game/license.txt", "97f87eeba9"], ["game/img/backs/thumbnails/cross_green.png", "658e8dc0bf"], ["game/img/diamond.png", "658e8dc0bf"], ["game/js/lib/ionic/fonts/ionicons.ttf", "ea300bee45"], ["game/img/buttons/menu/options.png", "658e8dc0bf"], ["game/img/backs/182x247/classic_brown.png", "658e8dc0bf"], ["game/img/players/p29.png", "658e8dc0bf"], ["game/templates/menu/image-maker.html", "6abaca3a5a"], ["game/js/PomDPBrain.js", "4c10fe4653"], ["game/img/backs/182x247/rhombus_red.png", "658e8dc0bf"], ["game/img/backs/182x247/classic_blue.png", "658e8dc0bf"], ["game/templates/menu/backgrounds.html", "3ede9947f6"], ["game/img/themes/large_print_wood.jpg", "089f823d7e"], ["game/templates/menu/options/game_level.html", "49c03e7f9e"], ["game/img/backs/thumbnails/lawrence.png", "658e8dc0bf"], ["game/img/backs/182x247/rhombus_blue.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/tools/jquery.scrollbar.js", "ddf903f84a"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-ru.js", "01dfdd5dc4"], ["game/img/players/p32.png", "658e8dc0bf"], ["game/img/cards/thumbnails/modern.png", "658e8dc0bf"], ["game/img/backs/thumbnails/cross_brown.png", "658e8dc0bf"], ["game/img/backgrounds/1920x1200/parquet.jpg", "55478e5a71"], ["game/img/themes/red_felt.jpg", "37cbb42de0"], ["game/templates/menu/help.html", "15dfc6e076"], ["game/img/backgrounds/thumbnails/green_felt.jpg", "338d0c7e3d"], ["game/img/players/pn314.png", "658e8dc0bf"], ["game/img/players/p23.png", "658e8dc0bf"]];
const cdnUrls = [
].map(url => [url, url]);

const urlToCacheKey = new Map([..._hashes, ..._precache].map(createCacheKeyPair).concat(cdnUrls));
const precacheUrls = new Map(_precache.map(createCacheKeyPair).concat(cdnUrls));

if (_enabled) {
  global.addEventListener('install', installHandler);
  global.addEventListener('activate', activateHandler);
  global.addEventListener('fetch', fetchHandler);
} else {
  global.addEventListener('install', () => global.skipWaiting());
  global.addEventListener('activate', () => global.clients.claim());
}

function fetchAndCache(cacheKey, cache) {
  return fetch(cacheKey).then(response => {
    if (! response.ok) {
      throw new Error(`Error downloading ${cacheKey}`);
    }

    cache.put(cacheKey, response.clone());
    return response;
  });
}

function installHandler(event) {
  const urlsToCache = Array.from(precacheUrls.values());

  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return getCachedUrls(cache).then(cachedUrs => 
        Promise.all(
          urlsToCache
          .filter(cacheKey => !cachedUrs.has(cacheKey))
          .map(cacheKey => fetchAndCache(cacheKey, cache))
        )
      )
    }).then(() => {
      console.log("INSTALL FINISH");
      return global.skipWaiting();
    })
  )
}

function activateHandler(event) {
  const expectedUrls = new Set(urlToCacheKey.values());

  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.keys().then(requests => {
        return Promise.all(
          requests
          .filter(request => ! expectedUrls.has(request.url))
          .map(request => {
              console.log("[ITEM CHANGED]", request.url);
              return cache.delete(request)
            })
          )
      })
    }).then(() => {
      console.log("ACTIVATE FINISH");
      return global.clients.claim();
    })
  );
}

function fetchHandler(event) {
  const url = new URL(getCacheKey(event.request.url));

  if (url.hostname !== location.hostname && url.hostname !== CDN_HOSTNAME) {
    return;
  }

  if (isMainPage(event.request.url) || isMainPage(url)) {
    const url = new URL(getCacheKey(new URL('index.html', base).toString()));
    return event.respondWith(networkFirst(url));
  }

  return event.respondWith(cacheFirst(url));
}

function createCacheKeyPair([file, hash]) {
  const absoluteUrl = new URL(file, location);
  return [absoluteUrl.toString(), createCacheKey(absoluteUrl, hash)];
}

function createCacheKey(originalUrl, hash) {
  const url = new URL(originalUrl);
  url.search = `?${hashParam}=${hash}`;
  return url.toString();
}

function getCacheKey(url) {
  url = new URL(url)
  url = new URL(url.pathname, url.origin).toString();

  return urlToCacheKey.get(url) || url;
}

function isMainPage(url) {
  const rest = url.toString().replace(base, '');

  return !rest || rest === '/' || /^[^/]+\.html$/.test(rest);
}

function cacheFirst(url) {
  return caches.open(cacheName).then(cache => {
    return cache.match(url).then(response => {
      return response || fetch(url).then(response => {
        cache.put(url, response.clone());
        return response;
      })
    })
  });
}

function networkFirst(url) {
  return caches.open(cacheName).then(cache => {
    return fetch(url).then(response => {
      cache.put(url, response.clone());
      return response;
    }).catch(_ => {
      return cache.match(url);
    })
  })
}

function getCachedUrls(cache) {
  return cache.keys().then(requests => 
    requests.map(request => request.url)
  ).then(urls => new Set(urls));
}

})(self);

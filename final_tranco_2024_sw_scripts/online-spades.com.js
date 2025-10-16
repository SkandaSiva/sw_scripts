(global => {
const base = location.href.replace(/[^/]+$/, '');
const hashParam = '_cache';
const cacheName = 'treecardgames-cache';
const CDN_HOSTNAME = 'ajax.googleapis.com';

const _enabled = true;
const _precache = [["game/js/main.js", "2c63af60ab"], ["game/js/lib/require.js", "b5c80af153"], ["favicon.ico", "be155b8a51"], ["index.html", "2ac794afb1"]];
const _hashes = [["game/assets/images/players/pn305.png", "658e8dc0bf"], ["game/assets/images/backgrounds/1920x1200/field_of_daisies.jpg", "cbbc9d8077"], ["game/assets/images/players/pn121.png", "658e8dc0bf"], ["game/assets/images/players/p27.png", "658e8dc0bf"], ["game/assets/images/players/pn303.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/white_kitten.png", "658e8dc0bf"], ["game/assets/images/players/p2.png", "658e8dc0bf"], ["game/assets/images/backs/182x247/classic_brown.png", "658e8dc0bf"], ["game/assets/images/backgrounds/1920x1200/blue_rays.jpg", "a3a50004f9"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-nb.js", "2d093faba2"], ["game/assets/templates/menu/players.html", "f9c39f8373"], ["game/assets/images/backs/182x247/lawrence.png", "658e8dc0bf"], ["game/assets/templates/menu/activation.html", "8156cc5b10"], ["game/assets/sounds/deal_animation.ogg", "3492b5d2f8"], ["game/assets/sounds/collect_cards.mp3", "32129cf605"], ["game/assets/images/cards/thumbnails/kittens.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/cat.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/classic_red.png", "658e8dc0bf"], ["game/assets/images/players/pn322.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/svgavatars.core.min.js", "4653263bca"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-sv.js", "0326db14a3"], ["game/assets/sounds/game_completed.ogg", "99c2a95f8e"], ["game/assets/images/backgrounds/thumbnails/parquet.jpg", "f51f90305c"], ["game/js/lang/pl.js", "e63d45d52b"], ["game/assets/images/backgrounds/thumbnails/field_of_daisies.jpg", "0d91d62fd3"], ["game/assets/images/players/p38.png", "658e8dc0bf"], ["game/assets/images/diamond.png", "658e8dc0bf"], ["game/js/lang/da.js", "d209edef48"], ["game/assets/images/players/pn316.png", "658e8dc0bf"], ["game/assets/templates/menu/options/user_interface.html", "6ddc20993b"], ["game/assets/images/backs/thumbnails/dog.png", "658e8dc0bf"], ["game/assets/images/cards/146x198/kittens.png", "658e8dc0bf"], ["game/assets/images/cards/146x198/large_print.png", "658e8dc0bf"], ["game/assets/images/players/pn310.png", "658e8dc0bf"], ["game/assets/images/themes/puppies.jpg", "07e8ba0cae"], ["game/assets/images/players/pn109.png", "658e8dc0bf"], ["game/assets/templates/menu/statistics.html", "ca5646cfe7"], ["game/assets/images/players/pn321.png", "658e8dc0bf"], ["game/assets/images/themes/large_print_green.jpg", "e6e89fca27"], ["game/assets/images/backs/146x198/classic_green.png", "658e8dc0bf"], ["game/js/lang/ja.js", "ec74500aa8"], ["game/assets/sounds/passing_cards-old.mp3", "57747d17ea"], ["game/assets/images/backs/thumbnails/rhombus_green.png", "658e8dc0bf"], ["game/js/lang/it.js", "e1746a0282"], ["game/assets/images/cards/182x247/kittens.png", "658e8dc0bf"], ["game/assets/images/cards/thumbnails/modern.png", "658e8dc0bf"], ["game/assets/images/players/pn314.png", "658e8dc0bf"], ["game/assets/images/players/pn308.png", "658e8dc0bf"], ["game/assets/images/players/pn102.png", "658e8dc0bf"], ["game/assets/images/backgrounds/thumbnails/puppies.jpg", "5e61cd2867"], ["game/assets/images/players/p17.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-zh_hant.js", "215f7e8afb"], ["game/assets/images/players/pn306.png", "658e8dc0bf"], ["game/assets/images/players/pn127.png", "658e8dc0bf"], ["game/assets/images/cards/thumbnails/big_ben.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/cross_green.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/classic_blue.png", "658e8dc0bf"], ["game/assets/images/players/p11.png", "658e8dc0bf"], ["game/assets/templates/menu.html", "9dafe85b23"], ["game/assets/images/backs/182x247/cross_brown.png", "658e8dc0bf"], ["game/assets/images/others/splash.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/tools/spectrum.min.js", "ee7c7d12d4"], ["game/js/lang/pt.js", "2169f14e36"], ["game/assets/images/icons/icon_96x96.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/puppy_love.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-en.js", "75ee822a8c"], ["game/assets/images/cards/182x247/large_print_modern.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/rhombus_red.png", "658e8dc0bf"], ["game/js/lib/soundjs-0.6.2.min.js", "256c67bff6"], ["game/assets/images/backs/182x247/rose.png", "658e8dc0bf"], ["game/assets/images/players/pn110.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/classic_red.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/rhombus_green.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-zh_hans.js", "e281382df5"], ["game/assets/images/backs/182x247/rhombus_green.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/tools/canvg.min.js", "b3b8d33f36"], ["game/js/lang/sv.js", "033a8f1c10"], ["game/js/lang/nl.js", "32b4cb073f"], ["game/assets/templates/menu/cardsets.html", "a244ca08cf"], ["game/assets/images/backs/182x247/story_time.png", "658e8dc0bf"], ["game/assets/images/backgrounds/1920x1200/light_wood_tiles.jpg", "be579b1a5d"], ["game/assets/images/players/pn300.png", "658e8dc0bf"], ["game/assets/images/buttons/menu/statistics.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/dog.png", "658e8dc0bf"], ["game/assets/images/players/p4.png", "658e8dc0bf"], ["game/assets/images/players/p31.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-es.js", "04c655de90"], ["game/assets/images/others/arrow-right.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/rhombus_blue.png", "658e8dc0bf"], ["game/assets/images/players/pn327.png", "658e8dc0bf"], ["game/assets/images/buttons/menu_command.png", "658e8dc0bf"], ["game/assets/images/players/pn315.png", "658e8dc0bf"], ["game/assets/images/flip.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/cat.png", "658e8dc0bf"], ["game/assets/images/cards/thumbnails/large_print_london.png", "658e8dc0bf"], ["game/assets/sounds/card_select.ogg", "1510f230a4"], ["game/assets/images/cards/182x247/puppies.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-pl.js", "51d92c281f"], ["game/js/lang/nb.js", "a1337be4d9"], ["game/assets/images/backs/146x198/lawrence.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/json/svgavatars-female-data.json", "376293ff5e"], ["game/assets/images/icons/icon_144x144.png", "658e8dc0bf"], ["game/assets/images/players/pn302.png", "658e8dc0bf"], ["game/assets/images/players/pn312.png", "658e8dc0bf"], ["game/js/lang/es.js", "9279796070"], ["game/js/lib/image-maker/player-image-maker/js/jquery-3.4.1.min.js", "220afd743d"], ["game/assets/images/backgrounds/thumbnails/green_felt.jpg", "338d0c7e3d"], ["game/assets/images/players/pn105.png", "658e8dc0bf"], ["game/assets/sounds/passing_cards-old.m4a", "8cd8fd80f2"], ["game/assets/images/backgrounds/1920x1200/parquet.jpg", "55478e5a71"], ["game/assets/images/backs/thumbnails/cross_green.png", "658e8dc0bf"], ["game/assets/images/players/pn500.png", "658e8dc0bf"], ["game/assets/images/backgrounds/thumbnails/blue_rays.jpg", "8f0a27ec8c"], ["game/assets/images/backs/182x247/renoir.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-pt.js", "93ce568bab"], ["game/assets/templates/menu/options.html", "a420d99122"], ["game/assets/images/backgrounds/thumbnails/light_wood.jpg", "3ff1780240"], ["game/assets/images/cards/182x247/big_ben.png", "658e8dc0bf"], ["game/assets/images/backs/182x247/pink_daisy.png", "658e8dc0bf"], ["game/assets/images/cards/182x247/caricatures.png", "658e8dc0bf"], ["game/assets/images/backgrounds/thumbnails/curious_kittens.jpg", "1f916a909c"], ["game/assets/images/cards/thumbnails/caricatures.png", "658e8dc0bf"], ["game/js/lib/ionic/fonts/ionicons.eot", "e8f3b07679"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-fr.js", "c9d17fc0e1"], ["game/assets/images/players/pn111.png", "658e8dc0bf"], ["game/assets/images/players/p29.png", "658e8dc0bf"], ["game/assets/images/players/p9.png", "658e8dc0bf"], ["game/assets/images/players/pn115.png", "658e8dc0bf"], ["game/js/lang/zh_hans.js", "48886aa839"], ["game/assets/sounds/card_select.mp3", "082cf19ab0"], ["game/assets/images/players/pn117.png", "658e8dc0bf"], ["game/assets/images/players/p21.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/svgavatars.tools.js", "9d535f32d8"], ["game/assets/images/players/p24.png", "658e8dc0bf"], ["game/assets/images/themes/flowers.jpg", "9dcbc4ff15"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-ja.js", "3c7fe49dc7"], ["game/assets/images/others/spades-logo_300x300.png", "658e8dc0bf"], ["game/assets/images/players/pn112.png", "658e8dc0bf"], ["game/assets/images/players/pn106.png", "658e8dc0bf"], ["game/assets/images/backs/182x247/cross_red.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/monet.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/puppy_love.png", "658e8dc0bf"], ["game/assets/images/players/p7.png", "658e8dc0bf"], ["game/assets/images/players/pn100.png", "658e8dc0bf"], ["game/assets/images/others/heart_score.png", "658e8dc0bf"], ["game/assets/images/players/p37.png", "658e8dc0bf"], ["game/js/lib/ionic/css/ionic.css", "3e08134bae"], ["game/assets/images/backs/thumbnails/butterflies.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-nl.js", "7327fe9521"], ["game/assets/images/themes/large_print_wood.jpg", "089f823d7e"], ["game/assets/images/buttons/menu/options.png", "658e8dc0bf"], ["game/assets/images/players/pn318.png", "658e8dc0bf"], ["game/css/style.css", "e9bb88a5ed"], ["game/js/lib/image-maker/player-image-maker/js/svgavatars.defaults.js", "f06bcc52c9"], ["game/assets/images/players/p26.png", "658e8dc0bf"], ["game/assets/images/cards/146x198/big_ben.png", "658e8dc0bf"], ["game/assets/templates/menu/avatar.html", "495a93687f"], ["game/assets/images/backs/thumbnails/white_kitten.png", "658e8dc0bf"], ["game/assets/sounds/deal_animation.mp3", "8719a65557"], ["game/assets/images/players/pn313.png", "658e8dc0bf"], ["game/assets/templates/menu/help.html", "b45f178cd9"], ["game/assets/images/players/p15.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/renoir.png", "658e8dc0bf"], ["game/assets/images/spade.png", "658e8dc0bf"], ["game/assets/images/themes/green_felt.jpg", "ad442f3cea"], ["game/assets/images/players/p35.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-de.js", "af28c5cb66"], ["game/assets/images/players/p18.png", "658e8dc0bf"], ["game/assets/images/cards/182x247/large_print.png", "658e8dc0bf"], ["game/assets/images/players/pn304.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/pink_daisy.png", "658e8dc0bf"], ["game/assets/images/players/p5.png", "658e8dc0bf"], ["game/js/lang/ru.js", "60b595a727"], ["game/assets/images/buttons/menu/appearance.png", "658e8dc0bf"], ["game/assets/images/cards/146x198/puppies.png", "658e8dc0bf"], ["game/js/lib/jquery-3.5.1.min.js", "095c9fea12"], ["game/assets/images/themes/light_wood.jpg", "c9462c4795"], ["game/assets/images/players/pn319.png", "658e8dc0bf"], ["game/assets/sounds/move_card.m4a", "cbafbfc039"], ["game/assets/images/backgrounds/1920x1200/green_felt.jpg", "2e9e13c85d"], ["game/assets/images/cards/thumbnails/flowers_close_ups.png", "658e8dc0bf"], ["game/assets/images/buttons/menu/activate.png", "658e8dc0bf"], ["game/assets/templates/menu/options/game_level.html", "30d3ccc903"], ["game/assets/sounds/game_won.ogg", "53089ac7db"], ["game/assets/sounds/deal_animation.m4a", "4c12c975bb"], ["game/js/lib/ionic/js/ionic.bundle.js", "56ad1d31bd"], ["game/js/lib/image-maker/player-image-maker/js/tools/StackBlur.js", "9e431cb8d7"], ["game/assets/images/players/pn104.png", "658e8dc0bf"], ["game/css/ionic.css", "953edd68f6"], ["game/assets/images/players/pn307.png", "658e8dc0bf"], ["game/assets/images/club.png", "658e8dc0bf"], ["game/assets/images/players/p3.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/cross_blue.png", "658e8dc0bf"], ["game/js/lang/de.js", "8e643912c2"], ["game/assets/images/backs/182x247/butterflies.png", "658e8dc0bf"], ["game/assets/images/players/pn118.png", "658e8dc0bf"], ["game/assets/images/players/pn325.png", "658e8dc0bf"], ["game/assets/images/buttons/menu/help.png", "658e8dc0bf"], ["game/assets/images/others/spades_broken.png", "658e8dc0bf"], ["game/assets/images/players/pn317.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/classic_green.png", "658e8dc0bf"], ["game/assets/images/players/pn122.png", "658e8dc0bf"], ["game/js/win-bg.js", "b19b877679"], ["game/assets/images/buttons/menu/players.png", "658e8dc0bf"], ["game/assets/images/players/p39.png", "658e8dc0bf"], ["game/assets/images/players/p14.png", "658e8dc0bf"], ["game/assets/images/backgrounds/thumbnails/dark_wood.jpg", "6d4e8813b3"], ["game/assets/images/backs/182x247/monet.png", "658e8dc0bf"], ["game/assets/images/players/pn125.png", "658e8dc0bf"], ["game/assets/images/players/pn120.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/cross_blue.png", "658e8dc0bf"], ["ads.txt", "591775819b"], ["game/assets/images/players/p13.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/classic_brown.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/pink_daisy.png", "658e8dc0bf"], ["game/assets/templates/menu/about.html", "471b2d05c5"], ["game/assets/images/backgrounds/1920x1200/light_wood.jpg", "921908e559"], ["game/assets/images/icons/icon_128x128.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker.html", "163f1cb548"], ["game/assets/images/backs/146x198/cross_brown.png", "658e8dc0bf"], ["game/assets/images/backgrounds/1920x1200/curious_kittens.jpg", "9bd04f194a"], ["game/assets/images/cards/146x198/modern.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/cross_red.png", "658e8dc0bf"], ["game/assets/images/players/pn311.png", "658e8dc0bf"], ["game/js/lib/ionic/fonts/ionicons.svg", "621bd38684"], ["game/assets/images/icons/icon_512x512.png", "658e8dc0bf"], ["game/assets/images/players/p16.png", "658e8dc0bf"], ["game/assets/images/cards/thumbnails/puppies.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/rhombus_blue.png", "658e8dc0bf"], ["game/assets/sounds/card_select.m4a", "6930c9fabf"], ["game/assets/sounds/passing_cards.m4a", "9b0d4603d6"], ["game/assets/sounds/passing_cards.mp3", "5f49d5c256"], ["game/assets/images/backs/thumbnails/rose.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/monet.png", "658e8dc0bf"], ["game/assets/images/players/p34.png", "658e8dc0bf"], ["game/assets/images/backgrounds/1920x1200/red_felt.jpg", "03db3c0bd2"], ["game/assets/images/backs/182x247/puppy_love.png", "658e8dc0bf"], ["game/assets/sounds/game_won.m4a", "672a0c1f4d"], ["game/assets/sounds/game_completed.mp3", "b919369956"], ["game/assets/images/themes/red_felt.jpg", "37cbb42de0"], ["game/assets/images/backs/146x198/rhombus_brown.png", "658e8dc0bf"], ["game/assets/images/backgrounds/thumbnails/red_felt.jpg", "d978fd0135"], ["game/assets/images/backs/182x247/cat.png", "658e8dc0bf"], ["game/assets/templates/menu/license.html", "57a7c5dd47"], ["game/assets/sounds/game_completed.m4a", "4d605e5fbf"], ["game/assets/images/others/arrow-up.png", "658e8dc0bf"], ["game/assets/images/cards/146x198/caricatures.png", "658e8dc0bf"], ["game/assets/images/players/pn301.png", "658e8dc0bf"], ["game/assets/images/cards/146x198/flowers_close_ups.png", "658e8dc0bf"], ["game/assets/sounds/passing_cards.ogg", "9c18d66a7e"], ["game/assets/images/cards/182x247/large_print_london.png", "658e8dc0bf"], ["game/assets/templates/menu/options/settings.html", "ead0091eca"], ["game/assets/images/buttons/menu/buy.png", "658e8dc0bf"], ["game/assets/images/players/p22.png", "658e8dc0bf"], ["game/assets/templates/menu/appearance.html", "9414f20696"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-hi.js", "168144222b"], ["game/js/lang/fr.js", "5007302542"], ["game/assets/images/players/pn320.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/cross_red.png", "658e8dc0bf"], ["game/assets/images/cards/182x247/modern.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-da.js", "76094f72b6"], ["game/assets/templates/rate-reminder.html", "45ac492b10"], ["game/assets/images/backs/182x247/classic_red.png", "658e8dc0bf"], ["game/assets/templates/menu/cardback.html", "d29f1e5afb"], ["game/assets/images/backs/146x198/renoir.png", "658e8dc0bf"], ["game/assets/images/players/pn107.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/cross_brown.png", "658e8dc0bf"], ["game/assets/templates/menu/buy.html", "a3065c524e"], ["game/assets/images/others/games.jpg", "83f32ebcf8"], ["game/assets/sounds/move_card.mp3", "84cab8a160"], ["game/js/lib/image-maker/player-image-maker/js/tools/svg.min.js", "43f2da940a"], ["game/assets/images/backgrounds/1920x1200/blue_felt.jpg", "eab37188ce"], ["game/assets/templates/menu/themes.html", "0d5bfa4910"], ["game/assets/images/buttons/menu/about.png", "658e8dc0bf"], ["game/assets/images/backs/182x247/cross_blue.png", "658e8dc0bf"], ["game/assets/images/others/hearts_broken.png", "658e8dc0bf"], ["game/js/lang/en.js", "4c50264e74"], ["game/assets/images/backs/182x247/classic_green.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/tools/rgbcolor.js", "2cae76b250"], ["game/assets/images/cards/146x198/large_print_modern.png", "658e8dc0bf"], ["game/assets/images/backgrounds/thumbnails/light_wood_tiles.jpg", "ea51f9c07f"], ["game/assets/images/cards/182x247/flowers_close_ups.png", "658e8dc0bf"], ["game/assets/images/icons/icon_192x192.png", "658e8dc0bf"], ["game/assets/images/players/pn309.png", "658e8dc0bf"], ["game/js/lang/zh_hant.js", "b681339962"], ["game/assets/images/icons/icon_152x152.png", "658e8dc0bf"], ["game/assets/images/heart.png", "658e8dc0bf"], ["game/assets/images/players/pn119.png", "658e8dc0bf"], ["game/assets/images/players/pn326.png", "658e8dc0bf"], ["game/assets/images/others/5-stars.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/css/svgavatars.css", "3b32f067b2"], ["game/js/lib/ionic/fonts/ionicons.woff", "cbbc32bd92"], ["game/assets/images/players/p33.png", "658e8dc0bf"], ["game/assets/images/backgrounds/thumbnails/blue_felt.jpg", "6de2172a19"], ["manifest.json", "646f95eebc"], ["game/assets/images/players/p12.png", "658e8dc0bf"], ["game/assets/images/players/p8.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/json/svgavatars-male-data.json", "6f2e9e041b"], ["game/assets/images/backs/182x247/dog.png", "658e8dc0bf"], ["game/assets/images/themes/kittens.jpg", "12c79eb621"], ["game/assets/templates/menu/backgrounds.html", "8a749cff66"], ["game/js/lib/ionic/js/angular/angular-route.js", "bfceed2f80"], ["game/assets/images/backgrounds/1920x1200/puppies.jpg", "6409cf181d"], ["game/assets/images/players/pn124.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-it.js", "b2599542bb"], ["game/assets/sounds/game_won.mp3", "b3e35585f2"], ["game/assets/images/players/pn108.png", "658e8dc0bf"], ["game/assets/images/others/arrow-left.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/rhombus_brown.png", "658e8dc0bf"], ["game/assets/images/players/pn324.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/rhombus_red.png", "658e8dc0bf"], ["game/assets/images/players/pn126.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/story_time.png", "658e8dc0bf"], ["game/assets/images/backs/182x247/white_kitten.png", "658e8dc0bf"], ["game/assets/images/players/p10.png", "658e8dc0bf"], ["game/assets/images/players/p6.png", "658e8dc0bf"], ["game/assets/images/players/p23.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/butterflies.png", "658e8dc0bf"], ["game/assets/images/players/p28.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/css/normalize.css", "93a41d2047"], ["game/assets/images/players/pn323.png", "658e8dc0bf"], ["game/assets/images/others/spades-logo.png", "658e8dc0bf"], ["game/assets/images/players/pn116.png", "658e8dc0bf"], ["game/assets/images/backs/146x198/rose.png", "658e8dc0bf"], ["game/assets/license.txt", "97f87eeba9"], ["game/assets/images/players/p40.png", "658e8dc0bf"], ["game/assets/images/players/pn113.png", "658e8dc0bf"], ["game/assets/images/players/p25.png", "658e8dc0bf"], ["game/js/lang/hi.js", "881ee0ffea"], ["game/assets/images/others/arrow-down.png", "658e8dc0bf"], ["game/assets/images/players/p30.png", "658e8dc0bf"], ["game/assets/images/players/p20.png", "658e8dc0bf"], ["game/assets/images/cards/146x198/large_print_london.png", "658e8dc0bf"], ["game/assets/images/buttons/menu/new_game.png", "658e8dc0bf"], ["app-ads.txt", "591775819b"], ["game/assets/sounds/move_card.ogg", "befdde2195"], ["game/assets/images/cards/thumbnails/large_print_modern.png", "658e8dc0bf"], ["game/assets/images/players/pn101.png", "658e8dc0bf"], ["game/js/lib/image-maker/player-image-maker/css/spectrum.css", "0d1666aba6"], ["game/assets/images/players/p36.png", "658e8dc0bf"], ["game/assets/sounds/collect_cards.m4a", "02b0e172c6"], ["game/assets/images/backs/182x247/rhombus_red.png", "658e8dc0bf"], ["game/assets/images/players/pn123.png", "658e8dc0bf"], ["game/assets/images/backs/182x247/classic_blue.png", "658e8dc0bf"], ["game/assets/templates/game-area.html", "75bc2498cc"], ["game/assets/images/backs/182x247/rhombus_blue.png", "658e8dc0bf"], ["game/js/lib/ionic/fonts/ionicons.ttf", "ea300bee45"], ["game/assets/images/backs/182x247/cross_green.png", "658e8dc0bf"], ["game/assets/sounds/passing_cards-old.ogg", "8895dfd2a1"], ["game/assets/images/players/pn114.png", "658e8dc0bf"], ["game/assets/images/backgrounds/1920x1200/dark_wood.jpg", "a4f3a1c414"], ["game/assets/templates/menu/image-maker.html", "6abaca3a5a"], ["game/assets/images/players/p32.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/classic_brown.png", "658e8dc0bf"], ["game/assets/images/cards/thumbnails/large_print.png", "658e8dc0bf"], ["game/assets/images/themes/caricatures.jpg", "2d84a508b7"], ["game/js/lib/image-maker/player-image-maker/js/tools/jquery.scrollbar.js", "ddf903f84a"], ["game/js/lib/image-maker/player-image-maker/js/languages/svgavatars-ru.js", "01dfdd5dc4"], ["game/assets/images/backs/thumbnails/lawrence.png", "658e8dc0bf"], ["game/assets/images/backs/182x247/rhombus_brown.png", "658e8dc0bf"], ["game/assets/images/backs/thumbnails/story_time.png", "658e8dc0bf"], ["game/assets/sounds/collect_cards.ogg", "137e4eb733"], ["game/assets/images/players/p1.png", "658e8dc0bf"], ["game/assets/templates/menu/trial.html", "370c1cb8f2"], ["game/assets/images/backs/146x198/classic_blue.png", "658e8dc0bf"], ["game/assets/images/players/pn103.png", "658e8dc0bf"], ["game/assets/images/players/p19.png", "658e8dc0bf"]];
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

'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"error404.html": "aec1a47c9968a84d82720af4bb864942",
"flutter_bootstrap.js": "595fcee7201fc18a486b764f5da2c86a",
"version.json": "d9f7b7509c6d18a7144dc46d77d368bb",
"favicon.ico": "97d778ddec4bcd2db627e781b0386684",
"index.html": "97222188ae785ff44d8c14733891136c",
"/": "97222188ae785ff44d8c14733891136c",
"styles.css": "2a19e329f1c70d3985b03f90aba885f1",
"main.dart.js": "e263a0e10c79539a74d134718d2aa5a1",
".well-known/apple-app-site-association": "f65fec69b55de672c2c32b16de10b23e",
".well-known/assetlinks.json": "d7b21495d574732964fe1e298694e8d6",
"privacypolicy.txt": "96d41c6df476e35683411bd224c4bafe",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"app-ads.txt": "a30e261ca4ded2f44a5b66da054f08bb",
"img/tablets.png": "39caf1f2fc603fbf85fa10960ad2c17b",
"img/404.svg": "d1ac55f98ddceea306edc5b184f532f9",
"img/socialchess.png": "6e1042f9eb6e9af8f9bdc9bdc8d429a7",
"img/google_play.png": "aae557bdfcd0efd371048dfe318d8882",
"img/app_store.png": "28253ba7e4c32944a3be8e046e31ff9c",
"mobile.html": "c03d3c0f8cef6c32581decda2d2950b4",
"favicon.png": "40063e13182856ac7efbd9552e4aa8ae",
"test.html": "a179636621d2ccf0c9c4c2f01bdcfcdc",
"icons/Icon-192.png": "727d6be167c37830f2566bcb801a20ff",
"icons/Icon-512.png": "b165849bc5ad80a68b2a64bd1e503e95",
"manifest.json": "63e6ada13a94a0ad25b8bc5e12c4274b",
"sitemap.xml": "33a2708db2e1ff787d6d22620ad8c547",
"robots.txt": "f77c87f977e0fcce05a6df46c885a129",
"delete_data_instructions.txt": "f40033e099dcadbaf4f2a8c0fcf07fe3",
"assets/AssetManifest.json": "0a98cb0b9ad9d0a45712b373c95deadf",
"assets/NOTICES": "f5998146f97fc460b67721788741e6c8",
"assets/FontManifest.json": "554a50581ebe96e9a7d58711c344cf75",
"assets/AssetManifest.bin.json": "d6c0e60305a3ca350814732fab480859",
"assets/packages/material_design_icons_flutter/lib/fonts/materialdesignicons-webfont.ttf": "3759b2f7a51e83c64a58cfe07b96a8ee",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/packages/wakelock_plus/assets/no_sleep.js": "7748a45cd593f33280669b29c2c8919a",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "32878fe8f46bd45e0e0a05413de2b1d2",
"assets/fonts/MaterialIcons-Regular.otf": "c02c23bfe3d0e60e0786c71c9839caf7",
"assets/assets/images/board_icon.png": "4700367d264fb527c8508ad119818e70",
"assets/assets/images/spot.png": "e3e4bfd4a9caf733106101956620fad8",
"assets/assets/images/apple_logo.png": "dfa9b04f1354f0686e6050f5b3a6039a",
"assets/assets/images/facebook_logo.png": "93cedb5784a4d7470691643aec9b954e",
"assets/assets/images/decodechess_1024.png": "759475beacad04d1b7a1b2e3b3c775fd",
"assets/assets/images/chess_pieces/realistic_Wht-King.png": "c9cb7db8a53678da5d0c84a2e1cde380",
"assets/assets/images/chess_pieces/modern_Blk-Knight.png": "bf073002d64f4deffaff49a52bddad60",
"assets/assets/images/chess_pieces/modern_Wht-Queen.png": "9ea6b7a6ecf874b0e6d1061f19cc2c2c",
"assets/assets/images/chess_pieces/realistic2_Blk-Queen.png": "be606f29e6f67d3203d3f73c869ba167",
"assets/assets/images/chess_pieces/realistic_Wht-Queen.png": "840194efff61319c995d8503cb6ca095",
"assets/assets/images/chess_pieces/realistic2_Wht-Pawn.png": "e501ce12643fac7e46ba1945eb552054",
"assets/assets/images/chess_pieces/realistic_Blk-Knight.png": "b268c046c002622059c400ea427123e2",
"assets/assets/images/chess_pieces/punk_Wht-Rook.png": "f4787896429aeb7cb33a1187087aef9e",
"assets/assets/images/chess_pieces/plain2_Wht-Pawn.png": "837d8917137b87a0fdeabea6ce60ca7b",
"assets/assets/images/chess_pieces/plain_Wht-Queen.png": "374ffa9b9f84783fe6be6f4c363bbfcd",
"assets/assets/images/chess_pieces/realistic2_Wht-Knight.png": "56519d3056c04934e0864fc6c603603f",
"assets/assets/images/chess_pieces/punk_Wht-Knight.png": "dccb1f4db432bbb4073eaf803243b45e",
"assets/assets/images/chess_pieces/plain2_Blk-Knight.png": "3ed69ac9ce7d6b4300829b0e09d6d638",
"assets/assets/images/chess_pieces/ivory_Blk-Bishop.png": "8bea431ba718710194f70114dc94b8ef",
"assets/assets/images/chess_pieces/ivory_Wht-Pawn.png": "59de2b7e03123a7fa4bdbd0db799bddd",
"assets/assets/images/chess_pieces/plain_Wht-Knight.png": "621a04eeb0fbdf162e56acd1c15634fc",
"assets/assets/images/chess_pieces/plain_Blk-Pawn.png": "63bb00c21b20a37804ab096fb082c4c3",
"assets/assets/images/chess_pieces/realistic_Blk-Rook.png": "810ce6905eb2c5229d6470cc1cee2837",
"assets/assets/images/chess_pieces/punk_Blk-King.png": "d8132a6c20c9b4355722252f2a9ca146",
"assets/assets/images/chess_pieces/modern_Blk-Pawn.png": "af7bac204113a2eef80d7f33bd360ffb",
"assets/assets/images/chess_pieces/punk_Wht-Queen.png": "5d95f00199d0314536b5e02000ab1638",
"assets/assets/images/chess_pieces/plain3_Blk-Knight.png": "41cc5383881a4ca077316bb8d34be187",
"assets/assets/images/chess_pieces/plain3_Wht-Queen.png": "28c8a18e6761c52ffbf705aad480cac7",
"assets/assets/images/chess_pieces/plain3_Wht-Pawn.png": "e7b6148fb7aa787bbf7fbac70f7f9c7d",
"assets/assets/images/chess_pieces/ivory_Blk-Pawn.png": "256693f03fe12a1af903a98596d3cfb8",
"assets/assets/images/chess_pieces/realistic_Wht-Knight.png": "5d3de6a8ba3df130e9325672b3e45bcc",
"assets/assets/images/chess_pieces/plain2_Blk-Pawn.png": "e7397ae9c50b2547e387df49c5f21dd4",
"assets/assets/images/chess_pieces/modern_Wht-Knight.png": "a8511a53087b2e550546756aefe2d88c",
"assets/assets/images/chess_pieces/ivory_Wht-Bishop.png": "c7d1940ce7b230bd499c621c1622fed4",
"assets/assets/images/chess_pieces/plain_Blk-Knight.png": "aa3eaeabd333369bb200663dab76ca0b",
"assets/assets/images/chess_pieces/realistic2_Blk-Pawn.png": "0a3f1d406759a5d1956b7e382ba4a0a0",
"assets/assets/images/chess_pieces/plain2_Blk-Queen.png": "ce5aba8e553ebec8a1b0e902c9afcf18",
"assets/assets/images/chess_pieces/punk_Blk-Rook.png": "a0655e23384f73dbcfdee20b7ffd238f",
"assets/assets/images/chess_pieces/realistic_Blk-King.png": "115d4abb0bf819353d860c88d024632e",
"assets/assets/images/chess_pieces/punk_Blk-Knight.png": "4fc5b094c72b7064f9610e7a85da1859",
"assets/assets/images/chess_pieces/realistic2_Blk-Knight.png": "e1e610b21fbf59f2f3b53db925642ebe",
"assets/assets/images/chess_pieces/plain2_Wht-Knight.png": "2a0681683e2601bcf9a2b6300f816113",
"assets/assets/images/chess_pieces/plain3_Blk-Pawn.png": "07a13fa09a0606dc38eb23ff9533d45e",
"assets/assets/images/chess_pieces/plain3_Wht-Knight.png": "1c8e761298b6d41a1e6af9a1a7c5f41b",
"assets/assets/images/chess_pieces/modern_Wht-Pawn.png": "78cdd3c1a1e6122f6868873ba5a8ec58",
"assets/assets/images/chess_pieces/punk_Wht-King.png": "d599aae34541e0af1f12de2a32df7f74",
"assets/assets/images/chess_pieces/ivory_Wht-Queen.png": "8b9bed1671475264f8955f30998d2ac9",
"assets/assets/images/chess_pieces/realistic_Wht-Rook.png": "503dd8e7517d718a6561b7e3d91b2cc5",
"assets/assets/images/chess_pieces/plain_Wht-Pawn.png": "399653873d47907b3b849094dc9fd36d",
"assets/assets/images/chess_pieces/modern_Blk-Queen.png": "4524b1e823909e5155876e8afc1b9096",
"assets/assets/images/chess_pieces/plain3_Wht-King.png": "7584b7aea6d884d9c061e3f42c57542e",
"assets/assets/images/chess_pieces/plain3_Wht-Bishop.png": "3ad2272eb54e33da8e6c72bae4d9d7c3",
"assets/assets/images/chess_pieces/ivory_Blk-Rook.png": "46871e62990d5e9dfba99512c5d6d8bd",
"assets/assets/images/chess_pieces/realistic_Blk-Queen.png": "c817e4c5cc7724aaa7fe450c798e3dc5",
"assets/assets/images/chess_pieces/realistic2_Wht-Queen.png": "ef3f10934084e1ee4a53684e482b5fa3",
"assets/assets/images/chess_pieces/plain2_Blk-Rook.png": "0379b3928794eb6b344bb57773ec91db",
"assets/assets/images/chess_pieces/plain_Blk-Queen.png": "371e2eb138e3dd92eeca4bcc2328c3a3",
"assets/assets/images/chess_pieces/punk_Blk-Pawn.png": "43d542b81a1a3a91d2f5c2a97d3bf1a7",
"assets/assets/images/chess_pieces/modern_Blk-King.png": "1f175c5d1a971f04abedfe9375d5f39c",
"assets/assets/images/chess_pieces/realistic2_Blk-Rook.png": "d0bd0e2a15d98082d4f532e7a401168d",
"assets/assets/images/chess_pieces/plain_Blk-King.png": "69be00027f1d9ee6baf3c36bd98d05c4",
"assets/assets/images/chess_pieces/realistic_Wht-Bishop.png": "c25e73f4b4ca7f69a23ec3031e81b44a",
"assets/assets/images/chess_pieces/ivory_Wht-King.png": "b45e669fbbcc9aeb659e1675d2ba2799",
"assets/assets/images/chess_pieces/plain3_Blk-Rook.png": "c30fbf5fddbf8d9bdecc6cb1e8ae4de1",
"assets/assets/images/chess_pieces/plain2_Wht-King.png": "5c3e578fe8efa895f74b93a33bc1df20",
"assets/assets/images/chess_pieces/modern_Wht-Bishop.png": "7363806982b0c1adbbc79850dea1fcbe",
"assets/assets/images/chess_pieces/punk_Blk-Queen.png": "797b7d0cbf3548c533a24cde6b09eb30",
"assets/assets/images/chess_pieces/realistic2_Wht-King.png": "c0e63671bc1348c4c281120fb10497d5",
"assets/assets/images/chess_pieces/modern_Wht-Rook.png": "cc7b58c22b3ffb6f288ea62ebead92d7",
"assets/assets/images/chess_pieces/plain_Blk-Bishop.png": "074bf1a6f09f0a37a7cb4b0d6643d1a5",
"assets/assets/images/chess_pieces/ivory_Wht-Knight.png": "f9d940609fe19a55870adfd8a1000d7b",
"assets/assets/images/chess_pieces/plain2_Wht-Bishop.png": "bce6490b11f1f328c54be12d096983a6",
"assets/assets/images/chess_pieces/plain_Wht-Rook.png": "9b9a9b5b981288c488abf28dfe621ad8",
"assets/assets/images/chess_pieces/punk_Blk-Bishop.png": "f18ad7cbcc56aff34959c51db681d400",
"assets/assets/images/chess_pieces/plain3_Blk-Queen.png": "c8ba9a2250699e28ee452563b22ef622",
"assets/assets/images/chess_pieces/realistic2_Blk-Bishop.png": "276ace71a709780198935ed5305f3e56",
"assets/assets/images/chess_pieces/realistic_Wht-Pawn.png": "8e034dc46d1a78ca7902ca04b14f0116",
"assets/assets/images/chess_pieces/plain_Wht-King.png": "7c737b1d0f888cce6f2d46a8764863e3",
"assets/assets/images/chess_pieces/modern_Wht-King.png": "19484bd656926014d3315e9ca479077b",
"assets/assets/images/chess_pieces/punk_Wht-Pawn.png": "b6c992b324931631b9030c1612b1b33f",
"assets/assets/images/chess_pieces/plain3_Blk-Bishop.png": "01070329ecce3d2d1ebfb1be18a62813",
"assets/assets/images/chess_pieces/realistic2_Wht-Rook.png": "4928cacb8b81e5ba3144279bf91ed761",
"assets/assets/images/chess_pieces/plain2_Wht-Rook.png": "eb1f194569c75b603b1fcd3e9ee41cf0",
"assets/assets/images/chess_pieces/plain2_Wht-Queen.png": "ec85bad089a7cb044ce20a4a26ca27d0",
"assets/assets/images/chess_pieces/plain3_Blk-King.png": "b2f0a5dd38492a0b8258d476289e0fcc",
"assets/assets/images/chess_pieces/ivory_Wht-Rook.png": "3aed05536eec1664031c8eccd86cddad",
"assets/assets/images/chess_pieces/realistic_Blk-Pawn.png": "08b5ad925de39103ca287a75a1e1073f",
"assets/assets/images/chess_pieces/plain_Blk-Rook.png": "03f6422fa9b8fe6eff15f7ec3dbfacf2",
"assets/assets/images/chess_pieces/modern_Blk-Bishop.png": "e0dcc25a3923f386e5662eb7a1d5d35b",
"assets/assets/images/chess_pieces/realistic_Blk-Bishop.png": "26a27b88dd551d828e2b813f130da239",
"assets/assets/images/chess_pieces/realistic2_Blk-King.png": "58bbbe6fbe2f5a0229d2a6cca34260c6",
"assets/assets/images/chess_pieces/modern_Blk-Rook.png": "8fbbc6d650bea8126cc8d8827370317f",
"assets/assets/images/chess_pieces/plain2_Blk-Bishop.png": "6fecc14be27bf0b2c2ce02bb8ae081b3",
"assets/assets/images/chess_pieces/realistic2_Wht-Bishop.png": "f679dc6179f2aedba7c5bb7dfb7f6970",
"assets/assets/images/chess_pieces/plain2_Blk-King.png": "16f04554a5a163478d24972b4697c506",
"assets/assets/images/chess_pieces/punk_Wht-Bishop.png": "13c796df93a7bce97c35f0c278c003e7",
"assets/assets/images/chess_pieces/ivory_Blk-King.png": "13804565bec3eabcde3f285f48237752",
"assets/assets/images/chess_pieces/plain_Wht-Bishop.png": "da1815c97ed883e041fa27b8d5a3c49f",
"assets/assets/images/chess_pieces/ivory_Blk-Queen.png": "75ab7832863003d576d42efbf68d5229",
"assets/assets/images/chess_pieces/ivory_Blk-Knight.png": "750475e56d5ad8689aec577f063a854c",
"assets/assets/images/chess_pieces/plain3_Wht-Rook.png": "1ae52ab4acec4f57231dcf3ad881a511",
"assets/assets/images/download_on_google_play.png": "aae557bdfcd0efd371048dfe318d8882",
"assets/assets/images/socialchess.png": "a01e2ab604aa89612e83abf30ed80f5d",
"assets/assets/images/backgrounds/woodGrain.jpg": "a69adbca94ca1744081f7c14b60f8863",
"assets/assets/images/backgrounds/grayTexture.png": "013fd87bd39a1e5e021634bae4e51b62",
"assets/assets/images/backgrounds/grayBoards.jpg": "5bd04d25a11d3f73b4d6c6b4242f9240",
"assets/assets/images/backgrounds/leather.jpg": "af3f53bd8bd6b7884557fc876063a2d6",
"assets/assets/images/google_logo.png": "d5b98d284b0c11eb6aef8f66951ba143",
"assets/assets/images/profile.png": "735187307a5056868dc65ab532ba98b8",
"assets/assets/images/chess_boards/solidRed.jpg": "fc4a327712fe3f209491f91c5043d743",
"assets/assets/images/chess_boards/woodBrown2.jpg": "972d8b8988af4d56a7edfbbc1873c653",
"assets/assets/images/chess_boards/woodGray.jpg": "568806a606da3ab7b7e903880a20cb4d",
"assets/assets/images/chess_boards/woodBrown3.jpg": "881ad011f9be31938a219d7c006de83f",
"assets/assets/images/chess_boards/woodBrown4.jpg": "68e44f31f64cef8be0d62011483c8993",
"assets/assets/images/chess_boards/woodBrown5.jpg": "632d4907f26e3bffda9671bddb6cd6e5",
"assets/assets/images/chess_boards/original.jpg": "d56ed7d310e04b5a12eccff16f4b4fc4",
"assets/assets/images/chess_boards/woodBlue.jpg": "8428817fc8c7528a7dccd7cf12e1ff3e",
"assets/assets/images/chess_boards/woodBrown.jpg": "5d3c7c782ef658fcc2e6be5f4dbfa67f",
"assets/assets/images/chess_boards/woodGray3.jpg": "c405d2a1914cdbe003559f6a354e61f6",
"assets/assets/images/chess_boards/woodGray2.jpg": "20bc78c60a55bdfe2e1628cad538eb30",
"assets/assets/images/chess_boards/solidGreen.jpg": "d3a09fcd941d0f04b7f62492ca106c04",
"assets/assets/images/chess_boards/solidGray.jpg": "0db709074b094d78340c3be5b3f7ce86",
"assets/assets/images/chess_boards/solidBrown.jpg": "088ee424efee3021124a7adccc795ae6",
"assets/assets/images/chess_boards/solidBlue.jpg": "0d3d18a6c37fdc335a883def7e3f6223",
"assets/assets/images/chess_boards/solidGray2.jpg": "a32101fb7cc5e7f465cfc34ee5a03f7c",
"assets/assets/images/chess_boards/solidGray3.jpg": "b26c6c78d9c19cba2b33f1c2e269bcbf",
"assets/assets/images/download_on_the_app_store.png": "b1c5c024037879598560ae7bf0cabfda",
"assets/assets/images/icon_ios_1024.png": "ccc40d05b771b533da0278d12d98f713",
"assets/assets/images/decodechess_screen.png": "44a5b7d06de4cffc749aca53e041ff56",
"assets/assets/localizations/nl.json": "2e6eeaceb0eedf1e0c45d9620177d0f5",
"assets/assets/localizations/de.json": "96afdf7bd2bab33421f2b312abe4490f",
"assets/assets/localizations/ru.json": "b5e33f6563317dbeeb7dabcea5b9d389",
"assets/assets/localizations/pt.json": "86c7c5f6ee8ad6096ffe945c415e7ea1",
"assets/assets/localizations/en.json": "551976dd96556c9439ad83a38fd28456",
"assets/assets/localizations/it.json": "f40171812dcefb51aec8de496f621653",
"assets/assets/localizations/fr.json": "a025cce0773db59b5e5c62605d14c447",
"assets/assets/localizations/hi.json": "41cd4aaf64ffeac1e3da3fe2f83b8262",
"assets/assets/localizations/es.json": "3c6e6e19eede0456bd945c54606a6b52",
"assets/assets/sounds/near_move.mp4": "33635585c965018ff8d4d95f72433f17",
"assets/assets/sounds/beep_echo.mp4": "e8cf3fb6c2ee41ff25c6738f918f8b04",
"assets/assets/sounds/dark_chord.mp4": "3c451be05a6024e837cab9cda4f20030",
"assets/assets/sounds/short_bells.mp4": "047aca7c4f3b9bee02c3eb8e075b96ff",
"assets/assets/sounds/brass_swell.mp4": "eda7a714941c713e68148893f5a1809c",
"assets/assets/sounds/cymbal.mp4": "f77bb7af83cd193060b739f446e769ff",
"assets/assets/sounds/no_sound.mp4": "683a873532b5c4b91ef13e5a362110ff",
"assets/assets/sounds/zap.mp4": "b3f3ff795a1e8e57f53eff8e11e6b5fb",
"assets/assets/sounds/ping.mp4": "71bbc008cccbe0a6af0f23b4635caa65",
"assets/assets/sounds/marimba_ding.mp4": "de22d21839f89301301b0a91ad32c9f1",
"assets/assets/sounds/click_bass.mp4": "e654afff57a9f084360ed5454ba1f38e",
"assets/assets/sounds/taiko_drums.mp4": "94fb53a3106396ac66d688b73a2d9165",
"assets/assets/sounds/money.mp4": "8246e4865eba8693854723aeaa67f051",
"assets/assets/sounds/tap.mp4": "2c9fe76de43da85bc0cb215eb2d0340f",
"assets/assets/sounds/chord_echo.mp4": "f574a301ad0ce6a7b2c79af89bf2ee26",
"assets/assets/sounds/ba_ding.mp4": "6acd02e05df393a307c14771add202fd",
"assets/assets/sounds/space_honk.mp4": "6c1ca543320853647b028da290c82eeb",
"assets/assets/sounds/piano.mp4": "33335cb993f026726a47cc9e578970dd",
"assets/assets/sounds/space_bounce.mp4": "d76f9b9adac40c792568cd0cc214cbd5",
"assets/assets/sounds/far_move.mp4": "01382da0059e2e47f2d2f2093d5e3705",
"assets/assets/sounds/blocks.mp4": "26bd322331da35ad15bbe2df4668cd29",
"assets/assets/sounds/organ.mp4": "219319e4b7f23609cd28561f4af40cd8",
"assets/assets/sounds/ding_ding_ding.mp4": "6c14126a7ae8673e7ec7ca64202e7836",
"assets/assets/fonts/RobotoMono-VariableFont_wght.ttf": "9e06bf8e4155ad3a942a9ff38f59fbc4",
"assets/assets/fonts/chess_piece_icon.ttf": "bdde63035fd045e3cdfe27b2279b8cc7",
"assets/assets/fonts/OpenSans-VariableFont_wdth,wght.ttf": "996d0154a25c63500dee2ae91e4f2ea7",
"assets/assets/fonts/board_icon.ttf": "f0a4d52c4819f87737b6ecc02b56c06a",
"applink/index.html": "0a1c599ddee805538355ada245ec496e",
"canvaskit/skwasm.js": "ac0f73826b925320a1e9b0d3fd7da61c",
"canvaskit/skwasm.js.symbols": "96263e00e3c9bd9cd878ead867c04f3c",
"canvaskit/canvaskit.js.symbols": "efc2cd87d1ff6c586b7d4c7083063a40",
"canvaskit/skwasm.wasm": "828c26a0b1cc8eb1adacbdd0c5e8bcfa",
"canvaskit/chromium/canvaskit.js.symbols": "e115ddcfad5f5b98a90e389433606502",
"canvaskit/chromium/canvaskit.js": "b7ba6d908089f706772b2007c37e6da4",
"canvaskit/chromium/canvaskit.wasm": "ea5ab288728f7200f398f60089048b48",
"canvaskit/canvaskit.js": "26eef3024dbc64886b7f48e1b6fb05cf",
"canvaskit/canvaskit.wasm": "e7602c687313cfac5f495c5eac2fb324",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

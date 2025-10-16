'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {".well-known/apple-app-site-association": "5beda5090c3f3572b18820741278b574",
".well-known/assetlinks.json": "9f3668722670fcf00a48148ba57be432",
"assets/AssetManifest.bin": "913cce4cac51ffacbd765b08b1ad7bb6",
"assets/AssetManifest.bin.json": "c6d4aa4f00abda5f2131034b6c4cb3b2",
"assets/AssetManifest.json": "500afbe1eb4fbc09ca453cbd5ef8f869",
"assets/assets/fonts/Poppins-Bold.ttf": "08c20a487911694291bd8c5de41315ad",
"assets/assets/fonts/Poppins-Medium.ttf": "bf59c687bc6d3a70204d3944082c5cc0",
"assets/assets/fonts/Poppins-Regular.ttf": "093ee89be9ede30383f39a899c485a82",
"assets/assets/fonts/Poppins-Semibold.ttf": "6f1520d107205975713ba09df778f93f",
"assets/assets/fonts/Poppins-Thin.ttf": "9ec263601ee3fcd71763941207c9ad0d",
"assets/assets/images/agents/astra/1.webp": "80154edcef8f97d07744c5404b4b1672",
"assets/assets/images/agents/astra/1IG.png": "f3b50f349168b561773b6cf2a1e69ad7",
"assets/assets/images/agents/astra/2.webp": "79d4a098a650056f26d7c068324079b6",
"assets/assets/images/agents/astra/2IG.png": "48adcac3d9e78b68c39515b79d9a7cd5",
"assets/assets/images/agents/astra/3.webp": "ee6cadbb1dd6536bc596c7f0b01b6437",
"assets/assets/images/agents/astra/3IG.png": "018a4e44471f8a13e6db458a5826983b",
"assets/assets/images/agents/astra/4.webp": "ac63ba2c7b4bef690c982e31d2c87d1c",
"assets/assets/images/agents/astra/astra.webp": "820aeaefcff0682773fbd43bb3055eb5",
"assets/assets/images/agents/astra/astraL.webp": "aca15652e6a46e4c07c1a28b4648e66a",
"assets/assets/images/agents/breach/1.webp": "6eb0a2fe967ba40722d63d06ddc84789",
"assets/assets/images/agents/breach/1IG.png": "fcc2cb98e2bbf53c497cb08ec4819132",
"assets/assets/images/agents/breach/2.webp": "31e22776ceb03acbfa2078c6257137bd",
"assets/assets/images/agents/breach/3.webp": "0318509ba2426d8e4c71227aeae3a7b8",
"assets/assets/images/agents/breach/4.webp": "94d58d09796067a2d43b29df15c2a02a",
"assets/assets/images/agents/breach/breach.webp": "7548902203f8044886b128194fa85c53",
"assets/assets/images/agents/breach/breachL.webp": "a546a8635de77162d8bd3de4d6402be7",
"assets/assets/images/agents/brimstone/1.webp": "4b1ddb102d3457203a08afb67d305970",
"assets/assets/images/agents/brimstone/2.webp": "43f5e563d86f620e8caae7b311ddb066",
"assets/assets/images/agents/brimstone/2IG.png": "d6c69a6204314ed54010703f2b586a00",
"assets/assets/images/agents/brimstone/3.webp": "ae1a4cc4670e40b42f5c8d3b0f6360a8",
"assets/assets/images/agents/brimstone/3IG.png": "bb6a33b8130b38ce7b527c72dce3d1b3",
"assets/assets/images/agents/brimstone/4.webp": "1d1d7669e280962c015dcb93c624ea22",
"assets/assets/images/agents/brimstone/brimstone.webp": "8056a04ab2a837586be3eccea87a7abd",
"assets/assets/images/agents/brimstone/brimstoneL.webp": "1848aa930e0f2d3f56bc1e052ca24fce",
"assets/assets/images/agents/chamber/1.webp": "86ac8707095000e7eab38b605c144128",
"assets/assets/images/agents/chamber/2.webp": "142daaadf511ef1b51a74fdc4bb57d08",
"assets/assets/images/agents/chamber/3.webp": "85867cc219d75ba63b34361167a37811",
"assets/assets/images/agents/chamber/4.webp": "ecfed27be2cfb40a5630a8d9dd508bfc",
"assets/assets/images/agents/chamber/chamber.webp": "7d8fd6b6ebf389ce0af05133296ff87c",
"assets/assets/images/agents/chamber/chamberL.webp": "483e9f7a003b9b5be2493b5ccdc395ea",
"assets/assets/images/agents/clove/1.webp": "52d4a2edc4d07549548d875e32b601d0",
"assets/assets/images/agents/clove/2.webp": "445c6f28ab919c1a8a4f58cca96fd26b",
"assets/assets/images/agents/clove/2IG.webp": "fc4e56978bb176ec32abd3019ffdfc8a",
"assets/assets/images/agents/clove/3.webp": "e325f6edcba2d9f8504d21f67a500513",
"assets/assets/images/agents/clove/3IG.webp": "e2226ac4e4356003d6571fc7906bd184",
"assets/assets/images/agents/clove/4.webp": "eb2e105b0d02048fff6a38520b981fcb",
"assets/assets/images/agents/clove/clove.webp": "ae8a0d1d95c95286649134dddef0e07d",
"assets/assets/images/agents/clove/cloveL.webp": "759b07c3218d67e978e9083b4d8cb1c1",
"assets/assets/images/agents/cypher/1.webp": "664ec59574d60a21dca92ebfc7eeb255",
"assets/assets/images/agents/cypher/2.webp": "593b50036ba4337b988c046cf1f73f65",
"assets/assets/images/agents/cypher/3.webp": "08569f9509542a799d9a5278584b7ee9",
"assets/assets/images/agents/cypher/4.webp": "345c966f41f497b01a1cfbe8a8ecb565",
"assets/assets/images/agents/cypher/cypher.webp": "0761d1b1eedf1ece0c23228a5400b390",
"assets/assets/images/agents/cypher/cypherL.webp": "6793aa1c85aee26c2a444cd1b6c00fb8",
"assets/assets/images/agents/deadlock/1.webp": "e4d68a42837342f82990004223a456dc",
"assets/assets/images/agents/deadlock/1IG.png": "46ab6eb72257ccf880fcf68a1584481a",
"assets/assets/images/agents/deadlock/2.webp": "0ebbaf25555901ffd1b1a45f43aec828",
"assets/assets/images/agents/deadlock/3.webp": "cfb34a1f4c697a19f60ffde8eafddaf9",
"assets/assets/images/agents/deadlock/4.webp": "82c6af80d48d083d7111d67db7b09bd3",
"assets/assets/images/agents/deadlock/deadlock.webp": "ce64cca632ad846f9f4e1351533e113c",
"assets/assets/images/agents/deadlock/deadlockL.webp": "224650819c842843c66355f32a47ccef",
"assets/assets/images/agents/fade/1.webp": "4e563fc78c4c9419e24aea45d029dcbe",
"assets/assets/images/agents/fade/2.webp": "8935077faeff61e80af7ee702119dbce",
"assets/assets/images/agents/fade/3.webp": "d4c6b562447266bee3e3bb422bbf683c",
"assets/assets/images/agents/fade/3IG.png": "a4a4a32ec42783abd86891cc5044cc6d",
"assets/assets/images/agents/fade/4.webp": "674b7d6cd17a128609e596df0f1ed7d2",
"assets/assets/images/agents/fade/fade.webp": "1f50cd176ff1b3cd8e0ac258703592f0",
"assets/assets/images/agents/fade/fadeL.webp": "0fa3aa74092f43cda07360b51f2987e4",
"assets/assets/images/agents/gekko/1.webp": "ad4cbd8bc4154e88731c8b22f3152ea5",
"assets/assets/images/agents/gekko/1IG.png": "3d13df6ab74292394ead04dd8fdcda1f",
"assets/assets/images/agents/gekko/2.webp": "b15c21bd4159c9e253dcc750c28e36a3",
"assets/assets/images/agents/gekko/2IG.png": "e46e9e6b0c149dfc30d003e042d3af49",
"assets/assets/images/agents/gekko/3.webp": "1fa2d8cc7a4eb736f6bb227ed6a1d12f",
"assets/assets/images/agents/gekko/4.webp": "1e2d6d9e34aac0f6c863daae7f4f859f",
"assets/assets/images/agents/gekko/gekko.webp": "84d3643f950e2845befe5a4021d95e52",
"assets/assets/images/agents/gekko/gekkoL.webp": "9672de7706fa2adde2da99665f7ec68b",
"assets/assets/images/agents/harbor/1.webp": "d698b44d2dbcb01298617de24e02cca6",
"assets/assets/images/agents/harbor/2.webp": "108f340bd98f7b94e9ff61f2c5a50cd9",
"assets/assets/images/agents/harbor/2IG.png": "11970f5cfaf32a878765c9c86c9b89d2",
"assets/assets/images/agents/harbor/3.webp": "33c42848909ecfaeba492f6984a8e8ac",
"assets/assets/images/agents/harbor/4.webp": "7db11c3bdcd650f9068f6ef7b745f8e5",
"assets/assets/images/agents/harbor/harbor.webp": "5c16563a0e437878deab7dd31ccd1ac3",
"assets/assets/images/agents/harbor/harborL.webp": "c664df2cae2d8d8dc90f27de1b973e0c",
"assets/assets/images/agents/iso/1.webp": "a46fd3671751f15578cc68d4dead3c7b",
"assets/assets/images/agents/iso/2.webp": "f80e5299be4fdad2c68038ab154fda82",
"assets/assets/images/agents/iso/3.webp": "e625a439fc65781eadf44c9afea9855b",
"assets/assets/images/agents/iso/4.webp": "f866c7c347800e2ca2e178a49773f3ce",
"assets/assets/images/agents/iso/iso.webp": "ef4abf1225dfaa3450e5d6d0801f3c25",
"assets/assets/images/agents/iso/isoL.webp": "5469b12f8cae09c14549fcacda2f3ab3",
"assets/assets/images/agents/jett/1.webp": "41a3bfd853dd2ed69340815e9db7a112",
"assets/assets/images/agents/jett/1IG.png": "5394579d473011a35602c2ede7aec259",
"assets/assets/images/agents/jett/2.webp": "453eaff5bdc3a5d869d034712679fb3d",
"assets/assets/images/agents/jett/3.webp": "0733a95236931642c05b8249c25b07d3",
"assets/assets/images/agents/jett/4.webp": "76ed3606ee0967dfef3fde76ffe58017",
"assets/assets/images/agents/jett/jett.webp": "685ac7598d29436a1816f40887ef9197",
"assets/assets/images/agents/jett/jettL.webp": "630a1a60bb65961c6e9eea6a19ee8616",
"assets/assets/images/agents/kayo/1.webp": "c0fc76bee7b2729bc3bf57bf955345d1",
"assets/assets/images/agents/kayo/1IG.png": "57da4adeb91a9afbaa5022eb4d8270a8",
"assets/assets/images/agents/kayo/2.webp": "c9fb12c75935f35e3d49d3e4d676024d",
"assets/assets/images/agents/kayo/3.webp": "a1c391d9fc10a461f063040c02639eed",
"assets/assets/images/agents/kayo/4.webp": "de69c0391704a8d51cd0e92721c7fc97",
"assets/assets/images/agents/kayo/kayo.webp": "c1952dbcd1dc3a749fe134331d6f109a",
"assets/assets/images/agents/kayo/kayoL.webp": "bf844cd85d0ae151c48e68ef41f698ae",
"assets/assets/images/agents/killjoy/1.webp": "36ef48666ce5b067f7b8e8de8b7bff42",
"assets/assets/images/agents/killjoy/1IG.png": "1d16905df54e97742d7980311a159a2d",
"assets/assets/images/agents/killjoy/2.webp": "dbd8c4b72c0ff38e5a039c0e742f8c7f",
"assets/assets/images/agents/killjoy/2IG.png": "f40b37c4ecdd7bed1e82545396bd8764",
"assets/assets/images/agents/killjoy/3.webp": "60dce54e9943b8432cc74c6f72161de2",
"assets/assets/images/agents/killjoy/3IG.png": "5c342ba15bd72833a9ecb01d923994d5",
"assets/assets/images/agents/killjoy/4.webp": "347353df9154c14b85b55fecfa516f3d",
"assets/assets/images/agents/killjoy/killjoy.webp": "0fde11d84add78444698c8c9171a0817",
"assets/assets/images/agents/killjoy/killjoyL.webp": "86958beca4d6049019b11881c827e606",
"assets/assets/images/agents/neon/1.webp": "4bdcfd857e9c60a4a6a6c218a785259d",
"assets/assets/images/agents/neon/2.webp": "c955de8f9b616e26f848b7285a076080",
"assets/assets/images/agents/neon/3.webp": "8343b111fb52a8944bb204158c969eb6",
"assets/assets/images/agents/neon/4.webp": "89d83910a671902e981e47272b744877",
"assets/assets/images/agents/neon/neon.webp": "623fb75a2bb06ffa6e8ce0262f9c8d4c",
"assets/assets/images/agents/neon/neonL.webp": "6e051fba9ecd2a5d1bbd0c1824ad5fc8",
"assets/assets/images/agents/omen/1.webp": "d5850288ba36d6f5ca0b735b9df74792",
"assets/assets/images/agents/omen/2.webp": "faa934271ed66e74dd0f82b6a036ba2f",
"assets/assets/images/agents/omen/3.webp": "2223860316ecb61445b7e7a1ecd8ef22",
"assets/assets/images/agents/omen/3IG.png": "7280acc8a5239e83f1385d480c85d8a9",
"assets/assets/images/agents/omen/4.webp": "f1d7ad4c5081af2aa6f61a21674f18b4",
"assets/assets/images/agents/omen/omen.webp": "5f4e8a5ab8d02a52ac161fe605bfbbd8",
"assets/assets/images/agents/omen/omenL.webp": "d5d461ecc86871aadaf7f62569aecaa7",
"assets/assets/images/agents/phoenix/1.webp": "1e9faadfe71b14794bc4549054bedc4d",
"assets/assets/images/agents/phoenix/2.webp": "ee5f03c3f4b67f8a36ea77a4e19ec3e2",
"assets/assets/images/agents/phoenix/3.webp": "00693749712a8ff54685a5b24ba3fddf",
"assets/assets/images/agents/phoenix/3IG.png": "a677c806867261091e7ec488340875ad",
"assets/assets/images/agents/phoenix/4.webp": "8cb63283b61219beed9c89892f75f53d",
"assets/assets/images/agents/phoenix/phoenix.webp": "d0d1b3408ea02f534ca071f144ea630d",
"assets/assets/images/agents/phoenix/phoenixL.webp": "857983cf3b40cd02a818580e28178e52",
"assets/assets/images/agents/raze/1.webp": "e2760790296b9372a07d59879fbd30d2",
"assets/assets/images/agents/raze/1IG.png": "1056b05c009706481c9f65f40304c79c",
"assets/assets/images/agents/raze/2.webp": "6ea4e8379ab93f07816811a548cbcf30",
"assets/assets/images/agents/raze/3.webp": "8f46e18f6c4513f32919f60d3cfa2b4f",
"assets/assets/images/agents/raze/4.webp": "87f69114a0b0d45014f0090bc40f2148",
"assets/assets/images/agents/raze/raze.webp": "0ccb755e10fd57e07d2a1914091f4a34",
"assets/assets/images/agents/raze/razeL.webp": "9575d70ad9b8c643b5c5d1da33423200",
"assets/assets/images/agents/reyna/1.webp": "0d78b48025aed73fc8f273c6c9bee4f8",
"assets/assets/images/agents/reyna/1IG.png": "04da7cb5d57000755113540629f4ed50",
"assets/assets/images/agents/reyna/2.webp": "28ba45d831c18693a06eea7b1d9b5ba4",
"assets/assets/images/agents/reyna/3.webp": "3e77ea840c5635869dc30f0a017dd7c9",
"assets/assets/images/agents/reyna/4.webp": "718afa711210e5eba0c40728d69bfff0",
"assets/assets/images/agents/reyna/reyna.webp": "4dcaa1b8d8ba3598c7610920c6ce75f8",
"assets/assets/images/agents/reyna/reynaL.webp": "b22a1f65828de5678f8198c03f8731a5",
"assets/assets/images/agents/sage/1.webp": "6404b0021e1793ff9075d0b6786ee6c7",
"assets/assets/images/agents/sage/1IG.png": "9b7096a7d0ef3371fb2e15c9c3795708",
"assets/assets/images/agents/sage/2.webp": "eb32a434a751fb21d40aae90164a0877",
"assets/assets/images/agents/sage/2IG.png": "9b8418b8921782972b535d673fec4731",
"assets/assets/images/agents/sage/3.webp": "9646d17f9219a104c72cdc4289b41982",
"assets/assets/images/agents/sage/4.webp": "380e24a58e18b5a6c99553f62fcf6929",
"assets/assets/images/agents/sage/sage.webp": "e3f34542e87bb8ec0b6c6860e9ea0f1b",
"assets/assets/images/agents/sage/sageL.webp": "146eeb433119267d57cd44b0172a46b1",
"assets/assets/images/agents/skye/1.webp": "70e79fb31b9ea0f7151349d29f659983",
"assets/assets/images/agents/skye/2.webp": "ac4ebde166333d6e8c4b0971898dd352",
"assets/assets/images/agents/skye/3.webp": "16341af84d2d4bbb54a24e56119bea9c",
"assets/assets/images/agents/skye/4.webp": "e315c5bfd8cb56be2fee10784c80e478",
"assets/assets/images/agents/skye/skye.webp": "db70a6b75e27abe1c19d4aa87ebe9391",
"assets/assets/images/agents/skye/skyeL.webp": "48cd65e9f755d39e047f020f74973001",
"assets/assets/images/agents/sova/1.webp": "f880e0853ed334cad20b5ac54157c947",
"assets/assets/images/agents/sova/2.webp": "57ae4f2ee56c24b4867711c57d13e321",
"assets/assets/images/agents/sova/2IG.png": "1d533028d2b979243dce3232fcc40018",
"assets/assets/images/agents/sova/3.webp": "8551e8e2c42128424b4db7238c80f7c4",
"assets/assets/images/agents/sova/4.webp": "b1ebe9489e6f1e04627b4c98d7e439ee",
"assets/assets/images/agents/sova/sova.webp": "79d14495384c655f922fcc39ca489497",
"assets/assets/images/agents/sova/sovaL.webp": "26e7944207f2b5c6ac9dadd4f6b135a9",
"assets/assets/images/agents/viper/1.webp": "9c820f0289118dc6f0d58675dab1dc70",
"assets/assets/images/agents/viper/1IG.png": "73b7212f111178c2944afa12d07f2983",
"assets/assets/images/agents/viper/2.webp": "fcba1a3cad61208cbd6e98fa6f098068",
"assets/assets/images/agents/viper/2IG.png": "9c184ea7fc1345b6a652ed4d4ededbb8",
"assets/assets/images/agents/viper/3.webp": "ef3070c43d7505d3250830d4f9a6a38b",
"assets/assets/images/agents/viper/4.webp": "fd13c4b88ead7df221034c19f3c5f649",
"assets/assets/images/agents/viper/4IG.png": "ebd1764e8241e3624526ce4f027fe355",
"assets/assets/images/agents/viper/viper.webp": "064e4f89091333f769dbf4013f2c17de",
"assets/assets/images/agents/viper/viperL.webp": "8ea098a17718f19403fbf0594b048f98",
"assets/assets/images/agents/vyse/1.webp": "f60e14fa8d91b79b05646ae662d7e773",
"assets/assets/images/agents/vyse/1IG.webp": "c14a639df5622675d8065f91bb888ab3",
"assets/assets/images/agents/vyse/2.webp": "3c8aa4f2fc2072a55694e8640045a07f",
"assets/assets/images/agents/vyse/3.webp": "1f5897fd8d0361019b0a6c5976a4cc7f",
"assets/assets/images/agents/vyse/4.webp": "0af8321ea55d1bed181e7505f47fc248",
"assets/assets/images/agents/vyse/vyse.webp": "c5902f987d27e6865ef16633d0a1eafa",
"assets/assets/images/agents/vyse/vyseL.webp": "d82596504e6582047f6180c24dd55eca",
"assets/assets/images/agents/yoru/1.webp": "a70b872818aaa04750fa27202751d7d0",
"assets/assets/images/agents/yoru/2.webp": "2a463ed8d625e1fbba7922e0cb2d5dae",
"assets/assets/images/agents/yoru/3.webp": "c606fb6613cff1c51c4044d6601b9089",
"assets/assets/images/agents/yoru/4.webp": "169bf6aad305cb2198ff8476c8448c52",
"assets/assets/images/agents/yoru/yoru.webp": "5ef1c4c3b66c6b0171aa600d82dd960f",
"assets/assets/images/agents/yoru/yoruL.webp": "5afa854c75855e5251fd99649914a291",
"assets/assets/images/agentsMini/astra.png": "201246859bab755fd57a6efccc313b8d",
"assets/assets/images/agentsMini/breach.png": "e7bf646d4aa3630ba1144a2659f07211",
"assets/assets/images/agentsMini/brimstone.png": "9736bd2f559bc97c4a276ae734b9c984",
"assets/assets/images/agentsMini/chamber.png": "93904ae219dc4b17c0eec1012a8205fe",
"assets/assets/images/agentsMini/clove.webp": "59e2171fd256eb4cad4e488fb5634b43",
"assets/assets/images/agentsMini/cypher.png": "0efc95a3368da7dd3e37898245d00c5a",
"assets/assets/images/agentsMini/deadlock.webp": "f4c725534e5acdc7ab5de4cc738189a6",
"assets/assets/images/agentsMini/fade.webp": "2072521bb551a4106fde36aded254eb1",
"assets/assets/images/agentsMini/gekko.webp": "ff9839a2c494c33d3b180da63f479bf9",
"assets/assets/images/agentsMini/harbor.webp": "96fb515ec398063bdc43e802e702c194",
"assets/assets/images/agentsMini/iso.webp": "9f86bf9ae4ff7007cb94bf99a246923c",
"assets/assets/images/agentsMini/jett.png": "938cab180f55c70a69dca7b6bd7c31b9",
"assets/assets/images/agentsMini/kayo.png": "f7cabc79e1c050ece67d80e8a22ec53a",
"assets/assets/images/agentsMini/killjoy.png": "874096eb578d4d306563d5d8b8984b70",
"assets/assets/images/agentsMini/neon.png": "1dce401c9aa0638d1902a4f904bd75bd",
"assets/assets/images/agentsMini/omen.png": "8ffb86ef8600dc7216c4f499f9d70707",
"assets/assets/images/agentsMini/phoenix.png": "9b7040e0a90e9d7fb32b41d753f331fe",
"assets/assets/images/agentsMini/raze.png": "2080a453a838d18a0832f61ec91adec1",
"assets/assets/images/agentsMini/reyna.png": "8ca307d95e1c76f06f0e113ab5de7c21",
"assets/assets/images/agentsMini/sage.png": "37c1eca0eac44975ef171cb1edf08014",
"assets/assets/images/agentsMini/skye.png": "682d96a8c23eef804016ce5a59818728",
"assets/assets/images/agentsMini/sova.png": "2dbddd94052618f002058bb3713d872c",
"assets/assets/images/agentsMini/viper.png": "2f82dda2644a44195bf437019ce30d66",
"assets/assets/images/agentsMini/vyse.webp": "00db00182613bbf2f0905789d878b0c4",
"assets/assets/images/agentsMini/yoru.png": "049cc45c4d486f1f4632d48afc8db4ad",
"assets/assets/images/maps/abyss.webp": "75018849b00db745ca9b114ea2ae23dc",
"assets/assets/images/maps/ascent.webp": "106ca80367bc0ff280b8d6b104192f43",
"assets/assets/images/maps/bind.webp": "d65417bb690e6c4da0ad61f3f0ecc524",
"assets/assets/images/maps/breeze.webp": "8bcd0fdf493abcf02168df621947ffcb",
"assets/assets/images/maps/fracture.webp": "17180f2fcbc2b2c7e8f1660b8d5884b2",
"assets/assets/images/maps/haven.webp": "c107d0bcf3e901cd59b4a26ab22c80f4",
"assets/assets/images/maps/icebox.webp": "53500302b1d8e238b44bd0403d675baf",
"assets/assets/images/maps/lotus.webp": "cfdf5b193cc3646e1bd9abf5ed2e98fe",
"assets/assets/images/maps/pearl.webp": "369d7d9d300f2aa87e53c13893c4c4b8",
"assets/assets/images/maps/split.webp": "324f1111aeef15046c4c86bcf9119ce9",
"assets/assets/images/maps/sunset.webp": "5d9432f27890379d895849eb84f2a60d",
"assets/assets/images/other/csLogo.png": "7457594359b288fec3ee3fb9e34790e1",
"assets/assets/images/other/dart.png": "6f8907d2333c7a3f38f4484c11ff61e4",
"assets/assets/images/other/defuse.webp": "e092dc9a1d04739e2319b55b375fc04c",
"assets/assets/images/other/detonation.webp": "9dc1270790e1eeb8723d1c67e18f36c7",
"assets/assets/images/other/elimination.webp": "af4d3874dbc124070ce16d49ef2e8d69",
"assets/assets/images/other/eraser.png": "95e09ad629eff8fe7ba10b7b6be22021",
"assets/assets/images/other/gears.css": "cb6edabb7aea5ebdd71627b0ca650114",
"assets/assets/images/other/hone_ad.png": "3e4150cbf2f2df3d4363cc00ce096d93",
"assets/assets/images/other/launcherIcon.png": "84c758ec7504d304e3f3ed3698486db2",
"assets/assets/images/other/launcherIconNoBG.png": "d19204cc1df1788f15f49c9b815daa8d",
"assets/assets/images/other/lines/arrow.png": "1cbf2224afdb1b3cee98d3cfc7eaa156",
"assets/assets/images/other/lines/dotted.png": "297aac1c43ed2ea377f85177a4131620",
"assets/assets/images/other/lines/dottedArrow.png": "cd7126a6e21f6876492e34135c5a913d",
"assets/assets/images/other/lines/normal.png": "97d56d080ebd6c289ebc84e7fbd7e9ac",
"assets/assets/images/other/overwolf.png": "2aa78effcfb61c9cfa4d7819cb551699",
"assets/assets/images/other/riot.png": "717f23a9473fb63026376b08007688d5",
"assets/assets/images/other/sadOmen.png": "9bef0056529010421f37ce79bf9c3ead",
"assets/assets/images/other/screenshot.png": "4f249fdcccb47a7ac52933cb5e1eae10",
"assets/assets/images/other/shield.png": "964d0d26b2424eedc456f100215b2f48",
"assets/assets/images/other/spectreLogo.png": "c0570c65ae40f76b892a8772b121130d",
"assets/assets/images/other/surrender.webp": "a636630f9dc26abcef27437d918339ff",
"assets/assets/images/other/sword.png": "4b0e9d039c4ce2a3b077fb2f4d85eee3",
"assets/assets/images/other/tabletScreenshot.jpg": "3124e3b52270b32b2d34e1acd6282e7b",
"assets/assets/images/other/timeout.webp": "5c7abba68e09cd8fc7e912967e70150b",
"assets/assets/images/other/vct.png": "a3831d7b914296621e75c4de606db79d",
"assets/assets/images/other/vpSmall.png": "d46077053078a85ea16b78decd35c742",
"assets/assets/images/other/welcomeScreen.webp": "9d428937dd8e604f5021d21159141179",
"assets/assets/images/other/woohoojin.png": "09232b641719f412d58d0110fea3d058",
"assets/assets/images/team_logos/100t.webp": "88debc7560c0f1a36b3858b52da0522f",
"assets/assets/images/team_logos/bbl.webp": "280c21ec6796d0ee9af8c82afca25605",
"assets/assets/images/team_logos/fnatic.webp": "68d369f1708fd8be2c9fac9b045a10f5",
"assets/assets/images/team_logos/heretics.webp": "dd6c11eae87c777347b8210b16d5f83c",
"assets/assets/images/team_logos/kru.webp": "6ec7e27cacf87d439d353ccc08164558",
"assets/assets/images/team_logos/sen.png": "ca11c6266459a1b9c4e40878013b4c45",
"assets/assets/images/team_logos/zeta.webp": "614d4172fd74e753649aa3a883a38407",
"assets/assets/images/tools/anchor.png": "60397b018c74bd05f1e0d9efc3b58ded",
"assets/assets/images/tools/danger.png": "8fc1db7eedf5f9371d875b1aebe7e60f",
"assets/assets/images/tools/flag.png": "b1ce50c2d8a71a9a75753f933dc47e4d",
"assets/assets/images/tools/pin.png": "40cd0742b83875de9c3b61395622f7b8",
"assets/assets/images/tools/pinIG.png": "5bd15a0009e53d7523753dd764745d9e",
"assets/assets/images/tools/sniper.png": "becac99dc54a8ba3c4a56f82711ce1e3",
"assets/assets/images/tools/spike.png": "cfb7cd84088aa7cd4cc759c0d14bc2b9",
"assets/assets/images/tools/star.png": "e93588262beb5b198b28434c90ed34fa",
"assets/assets/images/tools/visionConeMediumIcon.png": "a6dcc1395db6cb6d9e44ddb1bfe5fffc",
"assets/assets/images/tools/visionConeNarrowIcon.png": "28036d5882c7c01130069949205d9673",
"assets/assets/images/tools/visionConeWideIcon.png": "670c6da6f50d4210f9db89087756db74",
"assets/assets/images/weapons/ares.webp": "110c086d4e0cd8dc623bb97463c42444",
"assets/assets/images/weapons/bucky.webp": "db87c1b24669f742c26bd681cb880035",
"assets/assets/images/weapons/bulldog.webp": "2a680744f73d7d349475b8f2025b16a5",
"assets/assets/images/weapons/classic.webp": "9462db094bea886aeba758bfa0c78b24",
"assets/assets/images/weapons/frenzy.webp": "4e2edf43821c73331ed9f3c9167d29ad",
"assets/assets/images/weapons/ghost.webp": "311d2d665d9a7894e958604585ba483c",
"assets/assets/images/weapons/guardian.webp": "b488ec82ec656f8391e3d1d28a6e15e7",
"assets/assets/images/weapons/judge.webp": "488f334e82b7b92fac1975da5bab6f2b",
"assets/assets/images/weapons/marshal.webp": "2e039474f90ddf33d36e7a61053f52db",
"assets/assets/images/weapons/melee.webp": "5afc3e488d080a4e73aa9339f9be7191",
"assets/assets/images/weapons/odin.webp": "299672ef2a72fb16267592fc412ee48d",
"assets/assets/images/weapons/operator.webp": "91f0b8c60fa50ca28baac94c6a653600",
"assets/assets/images/weapons/outlaw.webp": "fd4e448a39f069559d2e06554c44956c",
"assets/assets/images/weapons/phantom.webp": "01abb399c4c7661b89718b05008c48f3",
"assets/assets/images/weapons/sheriff.webp": "28021d94885b3a9bb912f59dfe57c11d",
"assets/assets/images/weapons/shorty.webp": "83465f3ad9e48975c9c11779eef1c112",
"assets/assets/images/weapons/spectre.webp": "642cbd573d07d11602fa4fa84002db10",
"assets/assets/images/weapons/stinger.webp": "99117c576c2f639b7481924155368f84",
"assets/assets/images/weapons/vandal.webp": "9ea094bda6186aad9ce8ef4119c532c0",
"assets/FontManifest.json": "f9244448af6b245b4969249668de094f",
"assets/fonts/MaterialIcons-Regular.otf": "8ac24294237d2ff87ff6aa898f4d2b9d",
"assets/NOTICES": "0e038e980f2e6932770d2d5bf0675440",
"assets/packages/appflowy_editor/assets/images/case_sensitive.svg": "1f93577f39711359040ffde3d815fdc6",
"assets/packages/appflowy_editor/assets/images/check.svg": "c7b016041b6a5b0ce7cd50b7277364ec",
"assets/packages/appflowy_editor/assets/images/checkmark.svg": "3dc55867deb579484c5702a79054bb0e",
"assets/packages/appflowy_editor/assets/images/clear.svg": "f74736135d3ee5656b916262104469d0",
"assets/packages/appflowy_editor/assets/images/clear_highlight_color.svg": "0b35a31822656c53578fb91acdfacb31",
"assets/packages/appflowy_editor/assets/images/copy.svg": "8aff328e13b4b3667a6fbe1046d691b2",
"assets/packages/appflowy_editor/assets/images/delete.svg": "4a8d17ccc8cd1bd44a472f66ad028a01",
"assets/packages/appflowy_editor/assets/images/image_toolbar/align_center.svg": "e82165a5f6fb20a7ad3a6faf0ab735cc",
"assets/packages/appflowy_editor/assets/images/image_toolbar/align_left.svg": "fcd2f1a9124961798dd7009f27172a64",
"assets/packages/appflowy_editor/assets/images/image_toolbar/align_right.svg": "bf18d4c1654d502abea1d2c8aa010c30",
"assets/packages/appflowy_editor/assets/images/image_toolbar/copy.svg": "8aff328e13b4b3667a6fbe1046d691b2",
"assets/packages/appflowy_editor/assets/images/image_toolbar/delete.svg": "15cbb502f4554ee7a443207099cc839a",
"assets/packages/appflowy_editor/assets/images/image_toolbar/divider.svg": "b7677e94ef1007c39a1853588b177d1e",
"assets/packages/appflowy_editor/assets/images/image_toolbar/share.svg": "42aee34d22fd39e710e4e448bf654e29",
"assets/packages/appflowy_editor/assets/images/link.svg": "d323cd62b3df10a342e8e78ca50bf4e1",
"assets/packages/appflowy_editor/assets/images/point.svg": "50c7d9067a4a84945f1d79640589f501",
"assets/packages/appflowy_editor/assets/images/quote.svg": "ba6e97b8ddde8bf842fe2a56d06003ad",
"assets/packages/appflowy_editor/assets/images/regex.svg": "31424cd1f827bb7f237cd8e56c58f941",
"assets/packages/appflowy_editor/assets/images/reset_text_color.svg": "a9ecce95365f0b4636ad43cc054d87e4",
"assets/packages/appflowy_editor/assets/images/selection_menu/bulleted_list.svg": "7b22749438c843bc176fb559c924ad21",
"assets/packages/appflowy_editor/assets/images/selection_menu/checkbox.svg": "b81c986f918f1bd859fe07717b1e9d59",
"assets/packages/appflowy_editor/assets/images/selection_menu/h1.svg": "8135d2d5883f5cdd8776dca2dddb5f9b",
"assets/packages/appflowy_editor/assets/images/selection_menu/h2.svg": "129cb4e93b4badba4805968b13d52098",
"assets/packages/appflowy_editor/assets/images/selection_menu/h3.svg": "cd75480a77da1cabc7c5c2bf81325322",
"assets/packages/appflowy_editor/assets/images/selection_menu/image.svg": "92468547c1be63604f0820e565a1a6c2",
"assets/packages/appflowy_editor/assets/images/selection_menu/number.svg": "9dad0889a48bb8f0ff288a5c0b711ab4",
"assets/packages/appflowy_editor/assets/images/selection_menu/quote.svg": "f58d378109520a8058edb4fed9d9ddbb",
"assets/packages/appflowy_editor/assets/images/selection_menu/text.svg": "890a3a1b0a674b1fbd769f42520cfef7",
"assets/packages/appflowy_editor/assets/images/toolbar/bold.svg": "51e86ea040233e6a093caf02eea0c5f4",
"assets/packages/appflowy_editor/assets/images/toolbar/bulleted_list.svg": "b9441734387d7df0122b9dc629ca6bbb",
"assets/packages/appflowy_editor/assets/images/toolbar/center.svg": "c44cf79c7fae101e6fb9daa8aaf62a54",
"assets/packages/appflowy_editor/assets/images/toolbar/code.svg": "2d41f509ac1e1b1eb60c9adedc75ce03",
"assets/packages/appflowy_editor/assets/images/toolbar/divider.svg": "b7677e94ef1007c39a1853588b177d1e",
"assets/packages/appflowy_editor/assets/images/toolbar/h1.svg": "735f59f34690e55680453a0d018ada75",
"assets/packages/appflowy_editor/assets/images/toolbar/h2.svg": "bf7b09c579a5db9e6392b01f95909347",
"assets/packages/appflowy_editor/assets/images/toolbar/h3.svg": "30d4699894d5de3b696b11cf678b35a0",
"assets/packages/appflowy_editor/assets/images/toolbar/highlight_color.svg": "f8dd55016252c335c33e97fb39159882",
"assets/packages/appflowy_editor/assets/images/toolbar/italic.svg": "b96a655409eea41190182ae3ab3ed500",
"assets/packages/appflowy_editor/assets/images/toolbar/left.svg": "511106ad3206b6ccbf9702f22b0097db",
"assets/packages/appflowy_editor/assets/images/toolbar/link.svg": "42aee34d22fd39e710e4e448bf654e29",
"assets/packages/appflowy_editor/assets/images/toolbar/numbered_list.svg": "a6072f727ea30c379dd5e0e2909790c4",
"assets/packages/appflowy_editor/assets/images/toolbar/quote.svg": "7d20ee07b7f80cc886294a43a0db0b3d",
"assets/packages/appflowy_editor/assets/images/toolbar/right.svg": "19968f066c5bccae9f3e059f04492850",
"assets/packages/appflowy_editor/assets/images/toolbar/strikethrough.svg": "82564a24aa7e82675d377431ac8fb075",
"assets/packages/appflowy_editor/assets/images/toolbar/text.svg": "2b52bcda2b12945b27e859c414ef43c9",
"assets/packages/appflowy_editor/assets/images/toolbar/text_color.svg": "b912db1bb9568af27b19e2946e38cf38",
"assets/packages/appflowy_editor/assets/images/toolbar/text_direction_auto.svg": "74b07c6cd726be519ea32060d7a4b78c",
"assets/packages/appflowy_editor/assets/images/toolbar/text_direction_ltr.svg": "16a42742a29ea1cf30253cd9429095cd",
"assets/packages/appflowy_editor/assets/images/toolbar/text_direction_rtl.svg": "a994493865a43a16af27155434be4a6c",
"assets/packages/appflowy_editor/assets/images/toolbar/underline.svg": "fc86b2c49c42f5b9322a4ba76d066203",
"assets/packages/appflowy_editor/assets/images/uncheck.svg": "d94aa89207d28adebb0a4e11237f1c57",
"assets/packages/appflowy_editor/assets/images/upload_image.svg": "67fac764479d7cded5e98f6fe58c75ef",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/bold.svg": "7118c4686f95cedaa776faf7924c89a0",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/bulleted_list.svg": "4d7dba759b6073003a84e5938aa043b2",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/checkbox.svg": "eda1fb784a3429e96b42b7f24b7ea4c9",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/close.svg": "aa945f43dcd92bce9b5c810eb33940be",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/code.svg": "02ef07d8ea084d72dc2f4cc74a1b756d",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/color.svg": "d061328f2a2b335e121c44dccff39a43",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/divider.svg": "098194a544d649f3545d35f301b0191f",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/h1.svg": "295c462eeb57150f11a2e747d9220869",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/h2.svg": "88278b54319f416c66c1cf830fcf6c42",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/h3.svg": "ba38c1cdee5d41663df86128b73b835e",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/heading.svg": "8e872c0f97c1740a2f9858523aeb7743",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/italic.svg": "c8585c2f19414f94f26430e8eecc4bb3",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/link.svg": "d7a05e0d3a904118900ca7d8e3cf47b4",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/list.svg": "ed5fb52546835a9865541c1e2c06c20c",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/numbered_list.svg": "1daa60662c6ab43e65ac96e9e930b745",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/quote.svg": "dda6772a0e0d9b40e8aad07ff377ffc1",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/setting.svg": "0cb728ff605b6f7457950f3a47d291f1",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/strikethrough.svg": "c82d154453ef6759daa7cebb397cf58c",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/text_decoration.svg": "e4dd4997dec353c1eb7cdfab039a49ef",
"assets/packages/appflowy_editor/assets/mobile/toolbar_icons/underline.svg": "472439a97df9c883661d818045a40d95",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "565e7f76415e2e3c84a5884a1f54d520",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "f3307f62ddff94d2cd8b103daf8d1b0f",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "04f83c01dded195a11d21c2edf643455",
"assets/packages/youtube_player_iframe/assets/player.html": "663ba81294a9f52b1afe96815bb6ecf9",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "479f036d2a1efc3ff33739320e710ca4",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "15761f2b0a227d851c6f32c201fdfd8c",
"icons/Icon-192.png": "70b21918145a6e6ce0e9fab0fbe50770",
"icons/Icon-512.png": "f8a6a5e54af151beda5d00b00f96e076",
"icons/Icon-maskable-192.png": "cc1033761f79851ffa3b98a4cf61b030",
"icons/Icon-maskable-512.png": "fbf9918a5342bf43f2d82f12ba9aa12e",
"index.html": "1907c375b1ab34f0abfe3b4249223d7e",
"/": "1907c375b1ab34f0abfe3b4249223d7e",
"js/interopMethods.js": "9cfa86b3c4f6f036a7f698cf44de7a9e",
"js/languageSwitch.js": "5028e2edca7683366877b8175a27819f",
"js/owHotkeys.js": "e66aa46057233242edb3e9b4fe7f4b4a",
"js/owHotkeysService.js": "dce334f95af42a92a1ff2035560cb39d",
"js/owSecondScreenService.js": "c64052488223bf8d19894096d0d45762",
"js/owUserService.js": "2f16016f2895028026ba23613faa40ca",
"js/owWindowsService.js": "6b58ed665a0e06f4cf80709eac7ac4df",
"js/toStripeCheckout.js": "161ba2acde91f6a72d7dbb01194e03e3",
"main.dart.js": "01158653aac303d8a63a2209dd701e4c",
"manifest.json": "58623a5d71c592d9289f1bb26ffb284d",
"other/bet_gg_ad.html": "8fae4563eb26c9cab523e3754bae2063",
"robots.txt": "a09479a085f6e9de2e61f96316ccc3b4",
"sitemap.xml": "b8aac20da221c7df603e307054c05e1e",
"version.json": "b65e074fc79f0a5a471ac0c7442353a7"};
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

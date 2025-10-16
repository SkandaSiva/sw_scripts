'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "658dc9edbba6f7f4e6705207b49098f2",
"index.html": "92509f6edbf767c2eed649b35a04678b",
"/": "92509f6edbf767c2eed649b35a04678b",
"firebase-messaging-sw.js": "5b76ca36f72e5082929cb0b4de3b50c2",
"main.dart.js": "6dcc24141d3ff6bdc7764429405946f4",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "b0b32cc0de475a74edb6c02e21c9752d",
"icons/favicon-16x16.png": "9161e9630aab6fefac43899db52c436e",
"icons/favicon.ico": "f8810dddbaf1d7ee748e2e57807632d9",
"icons/apple-icon.png": "d0bb254617de9a60ab08721070b0b7f0",
"icons/apple-icon-144x144.png": "f406934600db6d5947ffe6768f55fe51",
"icons/android-icon-192x192.png": "2c52b406a792ec808cad10682b27c69f",
"icons/apple-icon-precomposed.png": "d0bb254617de9a60ab08721070b0b7f0",
"icons/apple-icon-114x114.png": "8f4b7f0106b76eee7b78476404f78278",
"icons/ms-icon-310x310.png": "8844f234f8cf296e0fed66f4402665c4",
"icons/Icon-192.png": "eb2933f3841adebc2d978d7b19189bf0",
"icons/ms-icon-144x144.png": "f406934600db6d5947ffe6768f55fe51",
"icons/apple-icon-57x57.png": "a153e2bd54b721302d3dae28695c8ccc",
"icons/apple-icon-152x152.png": "a52287ce7a1e6f354acf383f3600e2f4",
"icons/ms-icon-150x150.png": "7eeb183de8ed3451ebf20f8fac53d4a1",
"icons/android-icon-72x72.png": "59505cd9cc31c9f6b08cb2224bc107a3",
"icons/android-icon-96x96.png": "b0b32cc0de475a74edb6c02e21c9752d",
"icons/android-icon-36x36.png": "d95237e81f45f12232442b427aa964a4",
"icons/apple-icon-180x180.png": "e9f83962e4939740b2f9d4e9762601f2",
"icons/favicon-96x96.png": "b0b32cc0de475a74edb6c02e21c9752d",
"icons/manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"icons/android-icon-48x48.png": "97a7de1cb16bcdc0a8fb07fe4e346d3b",
"icons/apple-icon-76x76.png": "da90ab97177d9c2bd83e6226fc6f3c1a",
"icons/apple-icon-60x60.png": "4cfcdf0fd1319c367d9a3e11e2a9585b",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/android-icon-144x144.png": "f406934600db6d5947ffe6768f55fe51",
"icons/apple-icon-72x72.png": "59505cd9cc31c9f6b08cb2224bc107a3",
"icons/apple-icon-120x120.png": "a289bd0b52416da86a5d5a6115b9ad21",
"icons/Icon-512.png": "eb2933f3841adebc2d978d7b19189bf0",
"icons/favicon-32x32.png": "16edd7a12767244e2ba045fe85b89996",
"icons/ms-icon-70x70.png": "d1d8f3292f08c643b6fd33eb1333d68e",
"manifest.json": "7cde4415e3df6d196e2e04d84dc7aca8",
"assets/logo_.png": "6504f049753122a235a3bfc7dba88be7",
"assets/AssetManifest.json": "6abc7a1c00260d309d77f0d7c23840e3",
"assets/logo_catimba.png": "9f5767f206ad13a7182574a76d7414f4",
"assets/NOTICES": "42cb10b4b392ad64f114e6c563ad80ba",
"assets/logo_novo.png": "42c747afe5c731ed4d0005e4c927f968",
"assets/logo.png": "42c747afe5c731ed4d0005e4c927f968",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/packages/flutter_multi_formatter/flags/png/tg.png": "ae49203ef3de781e34c2b1ab072b18bb",
"assets/packages/flutter_multi_formatter/flags/png/me.png": "451723e36ee8fb7052985302601f0ee7",
"assets/packages/flutter_multi_formatter/flags/png/la.png": "8437e3b007e993d0689452dbef8dec5a",
"assets/packages/flutter_multi_formatter/flags/png/mr.png": "c290de341ec04121f81f1d92128f65b3",
"assets/packages/flutter_multi_formatter/flags/png/ni.png": "41e2831687e9997fa4d5f4eb0700cc84",
"assets/packages/flutter_multi_formatter/flags/png/lv.png": "4370f6f09eecc21db000bd09191f3ff3",
"assets/packages/flutter_multi_formatter/flags/png/om.png": "b16ebc34417eb7a6ad7ed0e3c79a71c0",
"assets/packages/flutter_multi_formatter/flags/png/af.png": "aca8b607d5f7f7de283db4a20ca3f845",
"assets/packages/flutter_multi_formatter/flags/png/cy.png": "0a99780a720e253aac2e45e476458ba8",
"assets/packages/flutter_multi_formatter/flags/png/bj.png": "6a699b2a3de19ea9cbe7742a7eb742b6",
"assets/packages/flutter_multi_formatter/flags/png/aq.png": "d18febf275fd13385c1915ab0165af86",
"assets/packages/flutter_multi_formatter/flags/png/cn.png": "9d1e0784dcefa3513fb60071df2e04b8",
"assets/packages/flutter_multi_formatter/flags/png/gb-sct.png": "58267a46e412d0e2e92d76b00f3bddb5",
"assets/packages/flutter_multi_formatter/flags/png/co.png": "1f1228902d0fd2b6fd23d5ead00860d3",
"assets/packages/flutter_multi_formatter/flags/png/cx.png": "d5a6ca51e490d03b06a647d652d3fdb0",
"assets/packages/flutter_multi_formatter/flags/png/ag.png": "62c9310edb9dc04193b3a24b4edce8e2",
"assets/packages/flutter_multi_formatter/flags/png/ms.png": "438b3ae48465543239a679ef915378de",
"assets/packages/flutter_multi_formatter/flags/png/md.png": "d579fff3f3b7644d54cdad3fbcdd501e",
"assets/packages/flutter_multi_formatter/flags/png/zm.png": "7d304f13f136589bd6f825c07237676c",
"assets/packages/flutter_multi_formatter/flags/png/vn.png": "0feb7f0e73d4d3802e45cfb1bb1544c6",
"assets/packages/flutter_multi_formatter/flags/png/tf.png": "5cc7bee04686cd239815544e4c75a254",
"assets/packages/flutter_multi_formatter/flags/png/td.png": "11d75e01b66659fe74372765f7c82521",
"assets/packages/flutter_multi_formatter/flags/png/yt.png": "590296857fc9d61220d0155243075daa",
"assets/packages/flutter_multi_formatter/flags/png/lb.png": "46b6c0d58c4b99070e190ce95a7250eb",
"assets/packages/flutter_multi_formatter/flags/png/mf.png": "590296857fc9d61220d0155243075daa",
"assets/packages/flutter_multi_formatter/flags/png/lu.png": "31349218e6c2a6e900a3a83baa8f61d2",
"assets/packages/flutter_multi_formatter/flags/png/mq.png": "ae9ad4364a913e81c9787560c3b167fd",
"assets/packages/flutter_multi_formatter/flags/png/cz.png": "bbafde1489e7a263006c9c6dbf878743",
"assets/packages/flutter_multi_formatter/flags/png/ae.png": "1439ab85e1ef23242fe7885da8a19091",
"assets/packages/flutter_multi_formatter/flags/png/cm.png": "2f8725d49955a64285d7bbd2bff02e2d",
"assets/packages/flutter_multi_formatter/flags/png/bi.png": "2c1d426f4b941b9638303c34145ba672",
"assets/packages/flutter_multi_formatter/flags/png/ar.png": "0836bad77d30f355fc2064f6df069b8c",
"assets/packages/flutter_multi_formatter/flags/png/as.png": "d3ee7d8aeade5f87a5ab6ea1c53c1181",
"assets/packages/flutter_multi_formatter/flags/png/bh.png": "7533d290739c20bd2d0250414a74c19d",
"assets/packages/flutter_multi_formatter/flags/png/cl.png": "2ed34ecb10a528bffc6908fd65996d2b",
"assets/packages/flutter_multi_formatter/flags/png/ad.png": "77ce19646f93c63a2387f2840bc9686e",
"assets/packages/flutter_multi_formatter/flags/png/mp.png": "895e2aea9e8a9fb4a3db09ba75b2ae11",
"assets/packages/flutter_multi_formatter/flags/png/lt.png": "d79eb564dd857c66ddd65a41f4cdfe4e",
"assets/packages/flutter_multi_formatter/flags/png/mg.png": "4e20926e9ba5478d189f28adc813cd15",
"assets/packages/flutter_multi_formatter/flags/png/lc.png": "32e5433954c7a99cd53c1e67f2ac604a",
"assets/packages/flutter_multi_formatter/flags/png/tr.png": "ea664a8b19fa4bd81145900d57e53fda",
"assets/packages/flutter_multi_formatter/flags/png/ua.png": "2dc383ba79588bd5a15a519a26ef204a",
"assets/packages/flutter_multi_formatter/flags/png/tv.png": "d45cf6c6f6ec53ae9b52f77848dc6bf9",
"assets/packages/flutter_multi_formatter/flags/png/vi.png": "bfe5691810c27983346bf52eb5149bb4",
"assets/packages/flutter_multi_formatter/flags/png/mt.png": "5eecdcd5c105f26d27903fbb2a1d8b36",
"assets/packages/flutter_multi_formatter/flags/png/no.png": "13708df2028ac76d28ec0eb35383ea4f",
"assets/packages/flutter_multi_formatter/flags/png/mc.png": "6375a336b1fd53d0e918ae945523078c",
"assets/packages/flutter_multi_formatter/flags/png/ch.png": "fe8519b23bed3b2e8669dac779c3cb55",
"assets/packages/flutter_multi_formatter/flags/png/bl.png": "072a0baffbf28632650627d339bf9c5b",
"assets/packages/flutter_multi_formatter/flags/png/aw.png": "410a04614d4176ea71f886f823fd35b5",
"assets/packages/flutter_multi_formatter/flags/png/bz.png": "820836c383ff34a06d3ac9f4bff68bd4",
"assets/packages/flutter_multi_formatter/flags/png/bm.png": "c348252e17350e0f8ef4f52e0791ca62",
"assets/packages/flutter_multi_formatter/flags/png/ci.png": "ad0d9306aab54c24a6b2146c3a74b954",
"assets/packages/flutter_multi_formatter/flags/png/mu.png": "ac855f82fe1038c119a25a07998fbb83",
"assets/packages/flutter_multi_formatter/flags/png/us.png": "2171e21640cef63bd1296158f01a70cd",
"assets/packages/flutter_multi_formatter/flags/png/tw.png": "ec53e0e988f816e4841bd1ab3c27ed04",
"assets/packages/flutter_multi_formatter/flags/png/ye.png": "026c7294278c64c3b39dc085e8a96f3c",
"assets/packages/flutter_multi_formatter/flags/png/mw.png": "bbfeb66a5eed87cb6e72ea2686857df1",
"assets/packages/flutter_multi_formatter/flags/png/nl.png": "1cf2f5a0a4421b2f0c8597c91c354d80",
"assets/packages/flutter_multi_formatter/flags/png/ls.png": "ca6e2dfcf32adaea9d5e93d5391fb373",
"assets/packages/flutter_multi_formatter/flags/png/bo.png": "509a86a7d4d578c257766b8a06ef716f",
"assets/packages/flutter_multi_formatter/flags/png/at.png": "8bc220081abdf5fe2139dcf052fb922f",
"assets/packages/flutter_multi_formatter/flags/png/ck.png": "882bc3896cdd040757972bcbbf75e4bb",
"assets/packages/flutter_multi_formatter/flags/png/by.png": "c5d14943250d54b4a630794c5648c687",
"assets/packages/flutter_multi_formatter/flags/png/au.png": "63084e9484c0b6db451a1d68ad5adeb9",
"assets/packages/flutter_multi_formatter/flags/png/bn.png": "1f1c5a29f9a6fd77963f7bb3de5946c2",
"assets/packages/flutter_multi_formatter/flags/png/ma.png": "f60e4b79249dd35e15514d0148182e23",
"assets/packages/flutter_multi_formatter/flags/png/nz.png": "d22c137d0038c20c1fa98ae2ed3729b0",
"assets/packages/flutter_multi_formatter/flags/png/lr.png": "d64e3e67b0c90e2ef83ed9868f7c29b4",
"assets/packages/flutter_multi_formatter/flags/png/mv.png": "018b26f7521c2b3db9624f40e9e1f563",
"assets/packages/flutter_multi_formatter/flags/png/tc.png": "0faabda1411738e572144aaeed24aadd",
"assets/packages/flutter_multi_formatter/flags/png/ug.png": "18981ef65248d3bb97deda3fc30b7030",
"assets/packages/flutter_multi_formatter/flags/png/tt.png": "2633904bd4718afeecfa0503057a7f65",
"assets/packages/flutter_multi_formatter/flags/png/pl.png": "68252741ff7ad66838559050eb9c6b96",
"assets/packages/flutter_multi_formatter/flags/png/rs.png": "b8ef69ae6caf134436c2756f65736433",
"assets/packages/flutter_multi_formatter/flags/png/in.png": "6811ad48652c371323b8a540703ddf39",
"assets/packages/flutter_multi_formatter/flags/png/ge.png": "4ef3f738568d8503bde5f647e77cac2e",
"assets/packages/flutter_multi_formatter/flags/png/gr.png": "efeed503130172fadbace1481caab4bb",
"assets/packages/flutter_multi_formatter/flags/png/gs.png": "42f0c6f9ed997ae6902823a8418ed3b3",
"assets/packages/flutter_multi_formatter/flags/png/gd.png": "7d4b72f73674133acb00c0ea3959e16b",
"assets/packages/flutter_multi_formatter/flags/png/io.png": "d4910e28f0164bc879999c17024d543c",
"assets/packages/flutter_multi_formatter/flags/png/hk.png": "3be1f46b75533ab2d423fe274cc398f0",
"assets/packages/flutter_multi_formatter/flags/png/kp.png": "8fcc8f2fc646b484b4a47cdc0ff21cab",
"assets/packages/flutter_multi_formatter/flags/png/gb-nir.png": "09af1c5f1433c02e97a95286ce24f4d4",
"assets/packages/flutter_multi_formatter/flags/png/kg.png": "660be92bf4794cf3207e33005212f272",
"assets/packages/flutter_multi_formatter/flags/png/pm.png": "590296857fc9d61220d0155243075daa",
"assets/packages/flutter_multi_formatter/flags/png/sv.png": "753e9326b9b68202b481b88dbb14e2d4",
"assets/packages/flutter_multi_formatter/flags/png/re.png": "590296857fc9d61220d0155243075daa",
"assets/packages/flutter_multi_formatter/flags/png/sa.png": "c1bcb7b3a1dbff8f6fffb9929f458ea1",
"assets/packages/flutter_multi_formatter/flags/png/sc.png": "fce9893562cbe99d2e62a46b03e42007",
"assets/packages/flutter_multi_formatter/flags/png/st.png": "5abecf1202ef9f7b33bdb9d0e3913f80",
"assets/packages/flutter_multi_formatter/flags/png/ke.png": "be246664f01fa71c4b8a359305bf6d36",
"assets/packages/flutter_multi_formatter/flags/png/im.png": "df5f4c630542e241989ac64324374e42",
"assets/packages/flutter_multi_formatter/flags/png/kr.png": "938f9cb1029a71863e88011f3e79a00d",
"assets/packages/flutter_multi_formatter/flags/png/gf.png": "91f3e592fea6812f87ca5e5994924230",
"assets/packages/flutter_multi_formatter/flags/png/dj.png": "b3887992b38f208e22159d34b7cb36b5",
"assets/packages/flutter_multi_formatter/flags/png/gq.png": "7ee7587ec0dcf50180ddaad9cbb10cac",
"assets/packages/flutter_multi_formatter/flags/png/gp.png": "590296857fc9d61220d0155243075daa",
"assets/packages/flutter_multi_formatter/flags/png/dk.png": "1c6b350f84ce03775de43f8dadb3dd6f",
"assets/packages/flutter_multi_formatter/flags/png/gg.png": "c9d9c382e727a7a867fa824a0dd74d56",
"assets/packages/flutter_multi_formatter/flags/png/il.png": "5497e2fc32b1174d37f9bbbeacd6265b",
"assets/packages/flutter_multi_formatter/flags/png/pn.png": "20a24767371c336d18ad9800c523c45a",
"assets/packages/flutter_multi_formatter/flags/png/sb.png": "12cccb421defca5c7a4d19661f98f06f",
"assets/packages/flutter_multi_formatter/flags/png/py.png": "4dca66b598604fb3af9dee2fd9622ac4",
"assets/packages/flutter_multi_formatter/flags/png/ru.png": "7eb6cedfbcc7f6448e54850279ff5baf",
"assets/packages/flutter_multi_formatter/flags/png/kw.png": "ff36685c5fa06a2896307a5074e74914",
"assets/packages/flutter_multi_formatter/flags/png/do.png": "a877d29919ed6e1814b07835d7806f61",
"assets/packages/flutter_multi_formatter/flags/png/gt.png": "5b45ad96fdb90c56d2cd39abefd394d0",
"assets/packages/flutter_multi_formatter/flags/png/gb.png": "09af1c5f1433c02e97a95286ce24f4d4",
"assets/packages/flutter_multi_formatter/flags/png/gu.png": "99e5df9e745605fbb1f93155535a2964",
"assets/packages/flutter_multi_formatter/flags/png/je.png": "04ae403448836c13eaddd26fa9e64d55",
"assets/packages/flutter_multi_formatter/flags/png/hm.png": "63084e9484c0b6db451a1d68ad5adeb9",
"assets/packages/flutter_multi_formatter/flags/png/sg.png": "a90e323283257b28b19372e19bda950d",
"assets/packages/flutter_multi_formatter/flags/png/pk.png": "e7bb9a64f3581f8f2d5aa93489009a80",
"assets/packages/flutter_multi_formatter/flags/png/sr.png": "1b7f101242df10cf44ef9b91acd4de97",
"assets/packages/flutter_multi_formatter/flags/png/se.png": "d96d54ba355a0427d2dc84e380c56e2c",
"assets/packages/flutter_multi_formatter/flags/png/jp.png": "d843ce06dae06e8cf9780b71d6e3d43b",
"assets/packages/flutter_multi_formatter/flags/png/gw.png": "806f63c256bddd4f1680529f054f4043",
"assets/packages/flutter_multi_formatter/flags/png/eh.png": "53c935334ea149b54d38341cacb06a17",
"assets/packages/flutter_multi_formatter/flags/png/dz.png": "e8359823a7ce2e1b2d1ef79361bdbebc",
"assets/packages/flutter_multi_formatter/flags/png/ga.png": "7a9bd1b751a4c92c4a00897dbb973214",
"assets/packages/flutter_multi_formatter/flags/png/fr.png": "4d9d99a113066b97f91654f17d671dac",
"assets/packages/flutter_multi_formatter/flags/png/dm.png": "abcbefc6234d640787ef0f0cbfd78c32",
"assets/packages/flutter_multi_formatter/flags/png/hn.png": "5a183482f4faea009e4d524c1e470397",
"assets/packages/flutter_multi_formatter/flags/png/sd.png": "40572a05b7cd8ea53cee59c6be331588",
"assets/packages/flutter_multi_formatter/flags/png/rw.png": "0bd92f502b566eb99a537e88e0c5294f",
"assets/packages/flutter_multi_formatter/flags/png/ph.png": "158bd50b6f2d18f398e8600f6663b488",
"assets/packages/flutter_multi_formatter/flags/png/ss.png": "bfc79aa44e6d2b026717f7aae4431639",
"assets/packages/flutter_multi_formatter/flags/png/qa.png": "db8bdadc6a164ef1e4f1deda1e9fb965",
"assets/packages/flutter_multi_formatter/flags/png/pe.png": "0291aca80c2a0f52d66177d16e0da63c",
"assets/packages/flutter_multi_formatter/flags/png/pr.png": "a55695e2970e758c9b2f468275e548c8",
"assets/packages/flutter_multi_formatter/flags/png/si.png": "9fa57dc95640bcd67051d7ff63caa828",
"assets/packages/flutter_multi_formatter/flags/png/ht.png": "a49a27479ed8be33d962898febc049f1",
"assets/packages/flutter_multi_formatter/flags/png/es.png": "28c7e07bba944889c1870dfc88a4c6a8",
"assets/packages/flutter_multi_formatter/flags/png/gl.png": "c36a016c88239ab5815e8ef2674182fe",
"assets/packages/flutter_multi_formatter/flags/png/gm.png": "fc1129765b7fe093c978e83cbb0f9de1",
"assets/packages/flutter_multi_formatter/flags/png/er.png": "300cbfb7dda5e2eea87e9b03660a6077",
"assets/packages/flutter_multi_formatter/flags/png/fi.png": "b267e5dee2f81cd260b74cd6f4a80921",
"assets/packages/flutter_multi_formatter/flags/png/ee.png": "d2beb66602072a33aa332ac906241838",
"assets/packages/flutter_multi_formatter/flags/png/kn.png": "8b078bf876eca8c26e471dbcd74f4058",
"assets/packages/flutter_multi_formatter/flags/png/hu.png": "ff1d0e2bc549da022f2312c4ac7ca109",
"assets/packages/flutter_multi_formatter/flags/png/iq.png": "9434c17a6d4653df965e3276137764a1",
"assets/packages/flutter_multi_formatter/flags/png/ky.png": "bacc27cd23c1e359244533ecb9043de6",
"assets/packages/flutter_multi_formatter/flags/png/sh.png": "09af1c5f1433c02e97a95286ce24f4d4",
"assets/packages/flutter_multi_formatter/flags/png/ps.png": "e3e006d28f6b72169c717c1dba49b4d5",
"assets/packages/flutter_multi_formatter/flags/png/pf.png": "2bcb58685c72a0ea189ed6f24787fcd8",
"assets/packages/flutter_multi_formatter/flags/png/sj.png": "13708df2028ac76d28ec0eb35383ea4f",
"assets/packages/flutter_multi_formatter/flags/png/id.png": "20a48e5d6a67edfcae769c22cead8b75",
"assets/packages/flutter_multi_formatter/flags/png/is.png": "9fce179e688579504fb8210c51aed66d",
"assets/packages/flutter_multi_formatter/flags/png/eg.png": "f15be21bf64894f0c0db33336558fd64",
"assets/packages/flutter_multi_formatter/flags/png/fk.png": "f6489fb8240437330e0cec337c67ea3e",
"assets/packages/flutter_multi_formatter/flags/png/fj.png": "eab0bde840b3aedac9fade235301123c",
"assets/packages/flutter_multi_formatter/flags/png/gn.png": "3aa100d1196e50836442e4e41f56f866",
"assets/packages/flutter_multi_formatter/flags/png/gy.png": "64f3007da6bdc84a25d8ad6b5d7f3094",
"assets/packages/flutter_multi_formatter/flags/png/ir.png": "a84a156345dadcab5aeda5db9462447c",
"assets/packages/flutter_multi_formatter/flags/png/km.png": "c631326a464f21c51fbfd767be9bcf39",
"assets/packages/flutter_multi_formatter/flags/png/ie.png": "3882cc83555457cd3cdfbf1a285f7d39",
"assets/packages/flutter_multi_formatter/flags/png/kz.png": "caba66830ed539d3f86431ddf4006e72",
"assets/packages/flutter_multi_formatter/flags/png/ro.png": "4fcdf6021d56e82f0067a13e6cbd78a2",
"assets/packages/flutter_multi_formatter/flags/png/sk.png": "12494ad86edebb64916831a7fcdc45e4",
"assets/packages/flutter_multi_formatter/flags/png/pg.png": "96c8233f13b1f4e7200d6ac4173de697",
"assets/packages/flutter_multi_formatter/flags/png/pt.png": "f7c4f806d879f5044fcc700029a20fcb",
"assets/packages/flutter_multi_formatter/flags/png/so.png": "15ce03e7b634c7c93f922ef4553f19ca",
"assets/packages/flutter_multi_formatter/flags/png/sx.png": "195a32986e11f1d0411a5fc20abd0c5e",
"assets/packages/flutter_multi_formatter/flags/png/hr.png": "3175463c3e7e42116d5b59bc1da19a3f",
"assets/packages/flutter_multi_formatter/flags/png/ki.png": "a93bda4f0f004d9c865f93d25c81ce18",
"assets/packages/flutter_multi_formatter/flags/png/jm.png": "87dbf861e528586787fdf8b6617e2f61",
"assets/packages/flutter_multi_formatter/flags/png/eu.png": "2c370e3de950262a37b025374cfaebce",
"assets/packages/flutter_multi_formatter/flags/png/ec.png": "9d139a75b21aaa301124ad846b7390f7",
"assets/packages/flutter_multi_formatter/flags/png/et.png": "7bc0f7bd7b4c252b375fc5bd94fe6a3f",
"assets/packages/flutter_multi_formatter/flags/png/fo.png": "7b2aa7754ea3a43b6372b2c7d93da023",
"assets/packages/flutter_multi_formatter/flags/png/kh.png": "a6ddda12068511bce8e99d2b82c13b49",
"assets/packages/flutter_multi_formatter/flags/png/sy.png": "3b05b2bf6694eadbdd84f89065cbb7f4",
"assets/packages/flutter_multi_formatter/flags/png/sn.png": "abaea692165cc3e890df7b736cf37a76",
"assets/packages/flutter_multi_formatter/flags/png/pw.png": "191c97390c0c0407c99b9d5fb9d98f34",
"assets/packages/flutter_multi_formatter/flags/png/sl.png": "460ba6dfd434d06bfbe2e3bc4944c24c",
"assets/packages/flutter_multi_formatter/flags/png/gb-eng.png": "0d9f2a6775fd52b79e1d78eb1dda10cf",
"assets/packages/flutter_multi_formatter/flags/png/fm.png": "ad0f179f11aabd724f0f00c3ad26ad25",
"assets/packages/flutter_multi_formatter/flags/png/gi.png": "987d065705257febe56bdbe05a294749",
"assets/packages/flutter_multi_formatter/flags/png/de.png": "e2227152ece494eabbb6b184dfb9f9a9",
"assets/packages/flutter_multi_formatter/flags/png/gh.png": "bc7dc85567546d0191df4d4fcc892a8a",
"assets/packages/flutter_multi_formatter/flags/png/jo.png": "79a73b63a1e0d78a08da882b146a2224",
"assets/packages/flutter_multi_formatter/flags/png/it.png": "b8242dd6b72444e3a5b6a9b5e4b95407",
"assets/packages/flutter_multi_formatter/flags/png/pa.png": "0c91186f67333cece25b7b6f114aebce",
"assets/packages/flutter_multi_formatter/flags/png/sz.png": "491394c84dbb654442e0ad63296f3cd2",
"assets/packages/flutter_multi_formatter/flags/png/sm.png": "48e98ad719be013cadf5139a5f2e2d79",
"assets/packages/flutter_multi_formatter/flags/png/tn.png": "e71d23c64e7407651f805fa14262999e",
"assets/packages/flutter_multi_formatter/flags/png/ml.png": "7378ecc1a8b6c91aa5d9a26c982e4f0a",
"assets/packages/flutter_multi_formatter/flags/png/cg.png": "e5a127b0915eff11a439a9757f484dd6",
"assets/packages/flutter_multi_formatter/flags/png/ax.png": "7a8b9f688330386f5437b9e4bdf3c3e2",
"assets/packages/flutter_multi_formatter/flags/png/ao.png": "91660ff95663f3ea8f6ddfc0c97c2ab3",
"assets/packages/flutter_multi_formatter/flags/png/bt.png": "9857d9fa48b572226e9c4275fb0f3804",
"assets/packages/flutter_multi_formatter/flags/png/an.png": "cccd19a062794a67af709a59b91a9ae2",
"assets/packages/flutter_multi_formatter/flags/png/bb.png": "bad762779f71fb00e9dbc0f4a971816f",
"assets/packages/flutter_multi_formatter/flags/png/cf.png": "0da7e59a85d78ca89a3a45f68f967a92",
"assets/packages/flutter_multi_formatter/flags/png/mm.png": "5afdb2c6123f2bec3fdecd638409ab06",
"assets/packages/flutter_multi_formatter/flags/png/li.png": "1abb7f4421487e6f40007c97ccf98c3d",
"assets/packages/flutter_multi_formatter/flags/png/na.png": "67421813025b783b38ce65fb66f330ec",
"assets/packages/flutter_multi_formatter/flags/png/mz.png": "6e98a2bf86f2d8d0f4eaffaf8bd591b7",
"assets/packages/flutter_multi_formatter/flags/png/to.png": "4229da15117671214ec83c6365dce0b5",
"assets/packages/flutter_multi_formatter/flags/png/vg.png": "420edc09fba1878f87336f8ebcdcee66",
"assets/packages/flutter_multi_formatter/flags/png/ve.png": "2e8670420a607b77ebb5df3a6d9ce16a",
"assets/packages/flutter_multi_formatter/flags/png/tz.png": "466bbbf4023c5cb013d202f74f19e743",
"assets/packages/flutter_multi_formatter/flags/png/tm.png": "153c0223e88169e2d988afa1ba74d0b9",
"assets/packages/flutter_multi_formatter/flags/png/mx.png": "0763a52cbbb6f882d1c7b67097bd35ee",
"assets/packages/flutter_multi_formatter/flags/png/nc.png": "b94385d139bf8b82b5b3f20559feece5",
"assets/packages/flutter_multi_formatter/flags/png/mo.png": "6e18ce749771587d8effc18479e000d2",
"assets/packages/flutter_multi_formatter/flags/png/lk.png": "b7ab4259e284bb6f4f30cb8ec5e9b1b6",
"assets/packages/flutter_multi_formatter/flags/png/cd.png": "f0b60b807ec62ebfc391ff50c79ec30e",
"assets/packages/flutter_multi_formatter/flags/png/al.png": "3a69913f1180f063cc70c2d09c43a882",
"assets/packages/flutter_multi_formatter/flags/png/bw.png": "53fede7a11b197c2cf5cc9667544d323",
"assets/packages/flutter_multi_formatter/flags/png/cr.png": "40dc5bc52eb9391bd6d1bf895b107a65",
"assets/packages/flutter_multi_formatter/flags/png/bv.png": "13708df2028ac76d28ec0eb35383ea4f",
"assets/packages/flutter_multi_formatter/flags/png/am.png": "55d71092c291a382a8fb4e0dae4b76a0",
"assets/packages/flutter_multi_formatter/flags/png/az.png": "98833fec449ef8d633ef934e63080891",
"assets/packages/flutter_multi_formatter/flags/png/ba.png": "4b5ad282e533a2e75d8b6ce8cff43db0",
"assets/packages/flutter_multi_formatter/flags/png/mn.png": "3942d1f8bfa86fd13115a70543c6c188",
"assets/packages/flutter_multi_formatter/flags/png/nu.png": "146c66c2ede3bd38ec680f76ef6525a0",
"assets/packages/flutter_multi_formatter/flags/png/my.png": "72f82829eb4588404d519b84bfd5ad58",
"assets/packages/flutter_multi_formatter/flags/png/tl.png": "5519f1e7173e1f345d1580bab1b34d51",
"assets/packages/flutter_multi_formatter/flags/png/ws.png": "d8e4ad3af401330e3f11db4be39dbf32",
"assets/packages/flutter_multi_formatter/flags/png/th.png": "626cf312c47ded97bf5dbb4339e9f02c",
"assets/packages/flutter_multi_formatter/flags/png/xk.png": "df22513149a597035238f0f0c9f06014",
"assets/packages/flutter_multi_formatter/flags/png/nf.png": "3391aec8dc77dd300f835bae7ffccd17",
"assets/packages/flutter_multi_formatter/flags/png/ly.png": "fdb3cba16a701d5471dd3bbcc6a31473",
"assets/packages/flutter_multi_formatter/flags/png/ai.png": "7112379111bbf96dae31e0b13a62b926",
"assets/packages/flutter_multi_formatter/flags/png/br.png": "0a7988dc68c66634f9e95ad0d878f7ba",
"assets/packages/flutter_multi_formatter/flags/png/cv.png": "0be7f55dcf12a903fc49a72a1071b901",
"assets/packages/flutter_multi_formatter/flags/png/be.png": "92d0285f6ed8a74a8fa6ea4b3770daac",
"assets/packages/flutter_multi_formatter/flags/png/ca.png": "e20a51380b2da69353e3755edead340d",
"assets/packages/flutter_multi_formatter/flags/png/bd.png": "0ca802e7f67045161047607b20c6490e",
"assets/packages/flutter_multi_formatter/flags/png/cw.png": "a0fc17a5c96bc82996fa70d50aa9b339",
"assets/packages/flutter_multi_formatter/flags/png/bs.png": "4a88a47c73294f193cf7ad5fabfcb7ea",
"assets/packages/flutter_multi_formatter/flags/png/ng.png": "eeb857562b3dfcd105aef9ec371a916f",
"assets/packages/flutter_multi_formatter/flags/png/mk.png": "644972c75548c32b4b99593b48d32791",
"assets/packages/flutter_multi_formatter/flags/png/np.png": "761c731a0b63ab006273b4a1910ccf86",
"assets/packages/flutter_multi_formatter/flags/png/va.png": "e84a6f9dc08930a11d1e4b9d25b6234f",
"assets/packages/flutter_multi_formatter/flags/png/uz.png": "475189379e4a67b29e9ab9a1d71f3cdd",
"assets/packages/flutter_multi_formatter/flags/png/um.png": "2171e21640cef63bd1296158f01a70cd",
"assets/packages/flutter_multi_formatter/flags/png/tk.png": "fcbceb6da21d71232ad719d05b6bb71b",
"assets/packages/flutter_multi_formatter/flags/png/vc.png": "9ff42949ac191ee0adcab3815779b748",
"assets/packages/flutter_multi_formatter/flags/png/zw.png": "94d25ac1764b0895f20405bc253b3647",
"assets/packages/flutter_multi_formatter/flags/png/nr.png": "09c7da9ea9f49dea55d2bdb853cc543c",
"assets/packages/flutter_multi_formatter/flags/png/ne.png": "f29940c4d22aed2105d362d5c7dc735e",
"assets/packages/flutter_multi_formatter/flags/png/cu.png": "82ec98ab8b9832e6a182367a5dd16f93",
"assets/packages/flutter_multi_formatter/flags/png/bq.png": "1cf2f5a0a4421b2f0c8597c91c354d80",
"assets/packages/flutter_multi_formatter/flags/png/bf.png": "54bb2c64b28b60df100b8abfb4b71777",
"assets/packages/flutter_multi_formatter/flags/png/bg.png": "6b473783a5c5b427e668a2048022663e",
"assets/packages/flutter_multi_formatter/flags/png/cc.png": "5d1c266d4620dc7203023882a7b647e5",
"assets/packages/flutter_multi_formatter/flags/png/gb-wls.png": "eb929cd0fe93fab638ea3f3c4b655593",
"assets/packages/flutter_multi_formatter/flags/png/mh.png": "d5ab4a201a322f99454e184699037506",
"assets/packages/flutter_multi_formatter/flags/png/za.png": "6cd7101a5f0d4b167af862b92ba8e19e",
"assets/packages/flutter_multi_formatter/flags/png/uy.png": "98db711aa764b56a68a37820995a7685",
"assets/packages/flutter_multi_formatter/flags/png/wf.png": "8e40a0c5be4080ffea10070744837d43",
"assets/packages/flutter_multi_formatter/flags/png/vu.png": "043330591a2b97ba1ef46ea08bfbbe24",
"assets/packages/flutter_multi_formatter/flags/png/tj.png": "a9e427318b756c0c03bec3f3ff976fa3",
"assets/packages/flutter_image_compress_web/assets/pica.min.js": "6208ed6419908c4b04382adc8a3053a2",
"assets/packages/flutter_inappwebview/assets/web/web_support.js": "1c365cc5ce2a69c366034266252d2cfa",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/bg_vencedor_splash6.jpeg": "fd5a979816dfb2f42099a338b2941cbf",
"assets/AssetManifest.bin": "601b62146b8f5148a186644cdb302a8d",
"assets/fonts/MaterialIcons-Regular.otf": "d37b1323e2588567976cc6a76f2c5c15",
"assets/assets/images/league_shield.png": "60ed2bdcc7fe94ef278cbd48c179827b",
"assets/assets/images/373.png": "32f6892b3cce946fc3011dc800101acb",
"assets/assets/images/logo_.png": "6504f049753122a235a3bfc7dba88be7",
"assets/assets/images/263.png": "25b28de38b11083b683c34a203555505",
"assets/assets/images/288.png": "c7e3b3002de163d23ecfaf1b2a3ca89b",
"assets/assets/images/276.png": "6dc6faf9ae380d5c6114a5fd3aa0ae26",
"assets/assets/images/262.png": "a81247b102d3f4b5f003592f5f7f0e0a",
"assets/assets/images/275.png": "2e535f583eab8605115b6e34eb43138b",
"assets/assets/images/265.png": "ea5ee3d87d1b0eeabeab0244cbf18268",
"assets/assets/images/bg_vencedor_splash7.png": "fa687b490de3b33796c879419f7122a7",
"assets/assets/images/264.png": "1d155526031e5533add45b346499b2e1",
"assets/assets/images/logo_catimba.png": "9f5767f206ad13a7182574a76d7414f4",
"assets/assets/images/266.png": "edf0accd7b763441d842cc35995a8caa",
"assets/assets/images/267.png": "18015844b594a848ff958166513adf9d",
"assets/assets/images/soccer_field.png": "65007d4a6d8659974580c4b80111d0d7",
"assets/assets/images/280.png": "13c5ed136bcd32a5c32726659d6a15a1",
"assets/assets/images/pin_logo.png": "5c047a36941a4de7582c848e756ef244",
"assets/assets/images/282.png": "cde04f0fb50f96963ff8f4e952d73b96",
"assets/assets/images/283.png": "f85b76eb6dbfd1dfe64d9aff7d724172",
"assets/assets/images/pixbet_logo.png": "526acdf08a07cb705dd419ad66002da4",
"assets/assets/images/logo.png": "42c747afe5c731ed4d0005e4c927f968",
"assets/assets/images/293.png": "dbb9ead25319c0b7ca19befb780fbfea",
"assets/assets/images/287.png": "c124a3ff8e0956647dedfc852b210e41",
"assets/assets/images/286.png": "c779edfa89b142bafac707539c2b0054",
"assets/assets/images/284.png": "045344fa3bc6912d07c08df615739ec9",
"assets/assets/images/285.png": "02357356798ccd1161a7e5b4f36474a4",
"assets/assets/images/356.png": "1a4b13b5bbb51923d3b83aea19561756",
"assets/assets/images/1371.png": "46fd9d69c9fd81e62f7436d8455a647d",
"assets/assets/images/catimba_text.png": "b2870e74b55c210b6ca970accdd34fc3",
"assets/assets/gifs/click_vencedor_capitao.gif": "fc0dc8da9fe3a00f3253aae8f8169f3b",
"assets/assets/icons/Depositar.png": "e397dec593c5c02aa541a7eb55836770",
"assets/assets/icons/fantasyicon.png": "1a3020f6ded2d845a87211fd48ba1110",
"assets/assets/icons/Transferir.png": "7bd79f94ffba179d1848fa352ecf74e1",
"assets/assets/icons/more_icon.png": "9c1a73c6d358c912ff54ba0181caf73e",
"assets/assets/icons/trophy.png": "4e6fecd16a8a61e2d04650345e16f9fc",
"assets/assets/icons/arrow_right.png": "6856e7174fba7db3914e92e4eb7e89ab",
"assets/assets/icons/telegram.png": "bc5e8450adf1130e25fcb17306d0860e",
"assets/assets/icons/trophy_grey.png": "6095330dff66220b0832d8eec08795ce",
"assets/assets/icons/coins_amber.png": "3263cf8a21aa75a2d67ca9684de40534",
"assets/assets/icons/plusicon.png": "dbb7316685fd150767577e7fdc70c395",
"assets/assets/icons/filter2.png": "d987be2253d46398d20b07971633604d",
"assets/assets/icons/lineup_icon.png": "c7f1a3783595fc0cde8db7144500a61d",
"assets/assets/icons/home_icon_grey.png": "d217232a942e806a4430e81d3f5dd654",
"assets/assets/icons/add_button_green.png": "c9799ec84ca529226d72ee0cb9c5143b",
"assets/assets/icons/assistencia.png": "9ebd3f963b634c91e4e94b4a4fb82665",
"assets/assets/icons/details.png": "cbb2f9ac50a0baa7c364a423401b737c",
"assets/assets/icons/google_icon.png": "20dc1cca8ef486d76b5242737c99485d",
"assets/assets/icons/cart2.png": "5b5221bf2228837f3d91ef376e564789",
"assets/assets/icons/stats_player.png": "4e3e17293aba12dc9063544da8fabaa6",
"assets/assets/icons/filter2_selected.png": "1a6c59e992d48f55038bbcb2aa628dee",
"assets/assets/icons/captain_player_false.png": "dbfd3152d6267fe8ea3f55a0a26203ff",
"assets/assets/icons/BRUISED.png": "d0277a9994d092365cfdf750eca56577",
"assets/assets/icons/DOUBT.png": "4067173bea10929215aa0491540f2ef8",
"assets/assets/icons/cart_catimbascores.png": "5b1dc20e49b624ee94ecd1615d29975b",
"assets/assets/icons/pix.png": "33db31cb5039010356ff709412bbcec9",
"assets/assets/icons/green_timer.png": "c47b60a8e4475e901c63f97cf0ed1815",
"assets/assets/icons/qrcode.png": "a4a1d50cf4637bace66b9514cb928e20",
"assets/assets/icons/SUSPENDED.png": "3de2a8d242540796ac3188d621687d3a",
"assets/assets/icons/coins_premio.png": "b89b7671b98981b6f082519d80790817",
"assets/assets/icons/white_arrow_down.png": "99bfdf83c52c2c211c533d85e0e5b7b5",
"assets/assets/icons/dotsmenu.png": "8dca0df9ef79195b5f95f56519718364",
"assets/assets/icons/add_player.png": "28f277fb50a5c17e6866f96869d04c00",
"assets/assets/icons/edit_icon.png": "8186f852ed01ba7cc388d7320a8f1d71",
"assets/assets/icons/my_teams_icon.png": "c32c279436f4f190a32b1ccbf631bc91",
"assets/assets/icons/arrowdown.png": "8ca4cc9f5812a5afc0ccc9e2f576b30e",
"assets/assets/icons/daily.png": "7d08510d4b57eea87a16b4a083541b57",
"assets/assets/icons/captain_player_true.png": "dc7f671ca8e974cbe59ecfa24ec71492",
"assets/assets/icons/Union_2.png": "80b366e379b99a064ef0a74b72ebc8a6",
"assets/assets/icons/peoples_grey.png": "e04c0c1c4cb955b590542f3d8e6ceeb0",
"assets/assets/icons/home_icon.png": "78f9a0bc60c88ca3b991ff34fc5c0319",
"assets/assets/icons/fourquestionsicon.png": "66b0c5ba105654f28234be00e0e8a2dc",
"assets/assets/icons/Union_grey.png": "6bde30dd029cc563e4a7da55861b4588",
"assets/assets/icons/bet_green.png": "177bd766c601ecfd7af512375b56cc6e",
"assets/assets/icons/arrow_back.png": "e1bf423d963b7bf5fd9bedba479c5fe4",
"assets/assets/icons/capitao_2x.png": "42da581c0302e82f024e0211331c175f",
"assets/assets/icons/league_patterns/pattern4.png": "81745b42a964e5724a20541dc5b10aed",
"assets/assets/icons/league_patterns/pattern_base.png": "cf8c72e5784a830dd4123b15d1854955",
"assets/assets/icons/league_patterns/pattern2.png": "4f41b0ae7cad5bc0cc039bc20fb4b614",
"assets/assets/icons/league_patterns/pattern3.png": "f4748bec8ed8f31ba5f62d97c226a03f",
"assets/assets/icons/league_patterns/pattern1.png": "a7ad2aeaf7f919caa093ae38b3688395",
"assets/assets/icons/trophy5.png": "95bf844a160d27c9146b94218bf817c0",
"assets/assets/icons/green_timer2.png": "dad08d73d8a4c9ec8d7a6213e428d0d1",
"assets/assets/icons/peoples_grey2.png": "d1050403a98e75c293e70dabeaca3b70",
"assets/assets/icons/arrowdownblue.png": "53253b0b1e24dacef87fe5c263f866d8",
"assets/assets/icons/green_coins.png": "25e9f7059372d302a6612807efec3e60",
"assets/assets/icons/arrow_white_down.png": "99bfdf83c52c2c211c533d85e0e5b7b5",
"assets/assets/icons/forget_password.png": "e00e42a80fe7fd01e7d3cd78f1cf3ce6",
"assets/assets/icons/edit4.png": "7bc8c881e9c15610949abcbe64dc7e3e",
"assets/assets/icons/copycode.png": "3bf712812c90d2ee4b5276977f3d7297",
"assets/assets/icons/person.png": "da0992925222c0a15928d127cb01cb89",
"assets/assets/icons/league_shields2/brasao4.png": "de78d67404adf3a0bf6ba2fa32a5f519",
"assets/assets/icons/league_shields2/brasao_base1.png": "acd6a61cc9219de58a0de169841eace9",
"assets/assets/icons/league_shields2/brasao1.png": "40ba9544eb5513fc7066eb9858bfb3d9",
"assets/assets/icons/league_shields2/brasao2.png": "b7c8389422a2088ac73be24a1e6edb8c",
"assets/assets/icons/league_shields2/brasao3.png": "9fce971d76c7c8744744330819d2d2dd",
"assets/assets/icons/arrow_thin_right.png": "6b7892c952eafc76f598d6d4cd8bb2a4",
"assets/assets/icons/league_icons/icone0.png": "855aac352f601b28ad8c3577bb03291b",
"assets/assets/icons/league_icons/icone1.png": "1023747e2dc8f1b1a7604024e727b6a1",
"assets/assets/icons/league_icons/icone3.png": "2b400bc8a71b2ba7530f687e9abbd39a",
"assets/assets/icons/league_icons/icone2.png": "b7cb1b42ec5554da75f72e015686c3d4",
"assets/assets/icons/league_icons/icone5.png": "7a0aa7454154508e560d0c0cd41e7d5d",
"assets/assets/icons/league_icons/icone4.png": "ff5e0d83038dd486a4e8c78e2b1bad3f",
"assets/assets/icons/captain.png": "f04735ae25b5a699a1a686596aa4ee8b",
"assets/assets/icons/edit3.png": "5b40378546522ff44f271ba3c9b825f7",
"assets/assets/icons/delete_button_red.png": "7657fe2e553582bc4d221b03ac4201dd",
"assets/assets/icons/atencao.png": "687688902b837c14f33333779fbb90b1",
"assets/assets/icons/leagues_icon.png": "7537a294662d8c767343402d15ba8485",
"assets/assets/icons/fourscoreicon.png": "b624ff6ca29ea47c095b1707d1e6d605",
"assets/assets/icons/person_photo.png": "8ef3aa5f3ff10e44917d02a4708f3fde",
"assets/assets/icons/whatsicon.png": "315acb2ef6449516b9da6f4c3b9cf5e1",
"assets/assets/icons/green_timer2_grey.png": "5af544b72005f8c7d411195af17493f1",
"assets/assets/icons/minus_red.png": "f9498018fe1e7cacced0c9bb3a251e5b",
"assets/assets/icons/no_captain.png": "695f2e7682c79bbbe9f52f133e7d5326",
"assets/assets/icons/cupomicon.png": "abfd92c4a7fda52996d8891a73d5ebb6",
"assets/assets/icons/amarelo.png": "010d6ee18c5d0a454dc503555ec16591",
"assets/assets/icons/bet_red.png": "71b09a1a180608d21fbb447a21cde835",
"assets/assets/icons/saiu.png": "c118ea4364fdd6e42cf07499009b2d55",
"assets/assets/icons/gol.png": "62bb2cd457a14a69d39e206d0f546b2d",
"assets/assets/icons/random.png": "857dab0ecc877bc9cb212f362a35a55b",
"assets/assets/icons/wallet_icon.png": "a92c03dfa5fdb52a397809b1a9a79b83",
"assets/assets/icons/olho.png": "da4e6e0453bf610d332534ab871f5c9f",
"assets/assets/icons/zapicon.png": "11caf8a37f41dd604f263f070fd17039",
"assets/assets/icons/edit_icon2.png": "b633eddcfedb2b8f4bea1988442bccf0",
"assets/assets/icons/filtericon.png": "cc306ee251f369561cf711a7a94fd53b",
"assets/assets/icons/lista_escalacao.png": "17a2145b87a20aac18d0111b85a95d9b",
"assets/assets/icons/gift_grey.png": "2f4f0704a4b2a95dbb533132bd8034c5",
"assets/assets/icons/coins_white.png": "e4fba4615270a0266079ef4aa3ef0911",
"assets/assets/icons/arrowup.png": "d77a751b9e7fe547b4a3950f0d4c3899",
"assets/assets/icons/campinho_escalacao.png": "525db7684b4ff8b6c0362a9ab6e48acf",
"assets/assets/icons/filter.png": "1479f2d84424e2f71ab3737705ed9a66",
"assets/assets/icons/close_pixbet_popup.png": "0dd595e550b5f06a807545fdb43067a8",
"assets/assets/icons/leagues_icon_grey.png": "2b69e648e53fae8b2548d3b0d0aa174a",
"assets/assets/icons/Union_red.png": "dc86d547ada1f90040446d27a0246f58",
"assets/assets/icons/cartolaicon.png": "462925c605abc25aa3c134a0dee355e3",
"assets/assets/icons/support2.png": "426d356fddd924430a59480c15f8a699",
"assets/assets/icons/Retirar.png": "73b3478a8ce8b2220cbf001f675592f0",
"assets/assets/icons/gift.png": "61c298c18cf7997578c7906549192243",
"assets/assets/icons/credential_photo.png": "800522bc509eaea3f7a604ee950bacd2",
"assets/assets/icons/share.png": "0e4eb565834d95f36576a41896b6a51d",
"assets/assets/icons/pattern1.png": "bf481fe571bbcb27377b4499422e99b9",
"assets/assets/icons/whatsapp2.png": "604492238fe4fc8ba9cd16b0f861723f",
"assets/assets/icons/vermelho.png": "d2d44ea9b1aa0e1ddb442d29927b37a1",
"assets/assets/icons/luva.png": "c8c015f4fefb0214df6260c3f931e732",
"assets/assets/icons/validate.png": "2641dc8cd01882b8730e1e35fb119203",
"assets/assets/icons/facebook_icon.png": "89c4b085d2b9bf7c090899b981dd29fd",
"assets/assets/icons/compartilhar.png": "c2c8bfbc9069bd3ecd024035a0e7af0b",
"assets/assets/icons/capitao_1_5x.png": "33aa3b2a1de4b0d2f8e518cb091dea53",
"assets/assets/icons/add_reserve_players.png": "ce55decc07d0b6cd75ccf139197dfed2",
"assets/assets/icons/infoicon.png": "318c00d1c604395b28ab33d76911fd58",
"assets/assets/icons/afiliados.png": "81cf1cf5bd61a7e38bb70a202ae3e228",
"assets/assets/icons/entrou.png": "1503bc19559f0ddd0733409bae7a4880",
"assets/assets/icons/peoples.png": "93a15508f05bc6d08d5632bc2c8ad68f",
"assets/assets/icons/cash.png": "8c1ba0af4cd624ea7df8e273b797d487",
"assets/assets/icons/LIKELY.png": "815d85f2220a88dd93bf94527e8fde98",
"assets/assets/icons/gift_white.png": "cf12543256afcd6e8761eb8a7786a5d8",
"assets/assets/icons/edit.png": "6a1e84f52e103f46cab57175d0e9beef",
"assets/assets/icons/Union_yellow.png": "9ed1739c65b63a22eab6655295db3c82",
"assets/assets/icons/plusicon_white.png": "33be7069dd6dd2fed4d7c266a390c4c6",
"assets/assets/icons/coins_green.png": "ed29fcfda9f9ae2c5036c38f1bf2cd96",
"assets/assets/icons/league_shields/brasao_base.png": "6308078ba5d4dd981976bc56adb7380f",
"assets/assets/icons/league_shields/brasao4.png": "cd0d02a0aa5d4bd90f2390855e4be2a3",
"assets/assets/icons/league_shields/brasao1.png": "1425df388c2c330bebc9d4d5b8e544f6",
"assets/assets/icons/league_shields/brasao2.png": "6ccc2e5f35493b661ba72232243be544",
"assets/assets/icons/league_shields/brasao3.png": "3ed4b8b2e12281bd3b4238e58619b53c",
"assets/assets/icons/paste.png": "30532d22d357a4876ad382aa16c14e54",
"assets/assets/icons/more_icon_grey.png": "0df359dfd5bac32a29e9da4994fb035d",
"assets/assets/icons/Union.png": "b014166d6b3381afe10f903b718bd7d3",
"assets/assets/icons/picpay.png": "f9240c296e5281d9d97750bdb2b97714",
"assets/assets/icons/auto_complete.png": "530255d35463c84f325e99e7d1215bba",
"assets/assets/icons/pixlogo.png": "c52d3f21873b6ab213311deb2c09f72d",
"assets/assets/icons/delete_player.png": "58b581374b33064d35a58fac2afdfbeb",
"assets/assets/icons/arrow_thin_left.png": "c9fb7bfc57c57cf2f5820853cfe71d28",
"assets/assets/icons/coins_premio_white.png": "9d7dc4ec7404744a7ef89b68595568c4",
"assets/assets/icons/reload.png": "fbbeea3ab8be5f396e427304dc8cc106",
"assets/assets/icons/copy.png": "3df5edc9c56966053a40e79241b217d2",
"assets/assets/icons/coins.png": "efda482e2ae46bb982be6e1dfbe093f0",
"assets/assets/icons/olhofechado.png": "d99a539591ea1e2f8a80a4f8312f9cad",
"assets/assets/icons/arrow_white_up.png": "8a68069cc9d2e56a66468e70b116d3cd",
"assets/assets/icons/bet_selected.png": "5144d70840960db3f701f62491bb0ec8",
"assets/assets/icons/wallet_icon_grey.png": "b684a7b43d84c1a5e8efe04adf564938",
"app.js": "7d7b4803f26b2d7918322f2bd54a6a70",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
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

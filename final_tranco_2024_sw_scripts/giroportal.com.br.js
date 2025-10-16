    
    
var versao = '1728476460', cache_prefix = 'sw-cache', cache_total_ativo=true; //defive vers�o, prefixo e se o cache total est� ativo
var testa = /\&v=(\d{1,})/.exec(this.location.href);
if(testa){
    versao = testa[1];
}

var MODO_PWA = !!/\?pwa\=1/.exec(this.location.href);
var MODO_PUSH = !!/\&push\=1/.exec(this.location.href);

//console.log('MODO_PWA', MODO_PWA);
//console.log('MODO_PUSH', MODO_PUSH);

//define quais caches limpar
var CACHE_NAME = cache_prefix+'-v'+versao;
var TELA_APP = 'app/';
var urls_para_cache = [
    'service-worker.js.php?pwa='+((MODO_PWA)?'1':'0')+'&push='+((MODO_PUSH)?'1':'0')+'&v='+versao,
    TELA_APP, 
    'app/app_manifest.json.php?v='+versao,
    'app/estilos.css.php?v='+versao,
    'app/script.js?v='+versao,
    'app/ic.php?tamanho=36&v='+versao,
    'app/ic.php?tamanho=48&v='+versao,
    'app/ic.php?tamanho=72&v='+versao,
    'app/ic.php?tamanho=96&v='+versao,
    'app/ic.php?tamanho=144&v='+versao,
    'app/ic.php?tamanho=192&v='+versao,
    'app/ic.php?tamanho=512&v='+versao,
    
    'app/imagem_erro_conexao.php?v='+versao,
    
    'arquivos_gerais/jquery.min.js?v='+versao,
    'arquivos_personalizados/imagens/logotipo.png?v='+versao
    
];

var cache_total_mimes = ['application/javascript','text/css','image/svg+xml','image/png','image/jpeg','image/gif'];
var cache_total_extensoes = ['woff','woff2','ttf','svg','js','css','jpg','png','gif','webp','jfif'];
var cache_total_regex_ignorar = [ new RegExp("admin"), new RegExp('area-restrita'), new RegExp("^/arquivos_personalizados/uploads/"), new RegExp("^/app/noticias"), new RegExp("^/app/estatisticas") ];


//instala��o e download dos arquivos para cache
self.addEventListener('install', function(event) {
    self.skipWaiting();
    
    if(MODO_PWA){
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function(cache) {
                    return cache.addAll(urls_para_cache);
                })
        );
    }
});

//exclus�o de caches antigos
self.addEventListener('activate', function(event){
    self.skipWaiting();
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    
                    if(!MODO_PWA){
                        return true;
                    }
                    
                    if(cacheName.substr(0, cache_prefix.length) == cache_prefix){
                        if(cacheName != CACHE_NAME){
                            return true;
                        }
                    }
                    return false;
                }).map(function(cacheName){
                    return caches.delete(cacheName);
                })
            );
        })
    );
    
});

fn_add_cache = function(requisicao, resposta){
    caches.open(CACHE_NAME).then(function(cache){
        cache.put(requisicao, resposta);
    });
};

AtualizarNoticiasOffline = function(){
    return new Promise(function(resolve, reject){
        var request = indexedDB.open("not-offline", 1);
        request.onerror = function(){
            reject("Erro no indexedDB");
        };
        request.onupgradeneeded = function(event) { 
            var db = event.target.result;
            db.createObjectStore("noticias", { keyPath: "id" });
            db.createObjectStore("ultima_atualizacao", { keyPath: "data" });
            db.createObjectStore("visualizacoes", { keyPath: "id" });
        };
        var d = new Date(), dd = [d.getFullYear(), d.getMonth()+1, d.getDate()], hoje = dd.join('-')+'-'+versao;
        request.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction(["ultima_atualizacao"], 'readwrite');
            var consulta = transaction.objectStore('ultima_atualizacao').get(hoje);
            consulta.onerror = function(){
                reject("Erro ao verificar noticias offline");
            };
            consulta.onsuccess = function(resposta){
                var resultado = resposta.target.result;
                if(resultado && resultado.data == hoje){
                    //console.log('J� atualizado!');
                    resolve("OK - J� atualizado!");
                }else{
                    console.log("Deve baixar noticias...", hoje);
                    fetch("app/noticias.php?v="+versao).then(function(resposta){
                        return resposta.json();
                    }).then(function(dados){
                        var acoes = [];
                        
                        //cachear as imagens
                        acoes.push( caches.open(CACHE_NAME).then(function(cache) {
                            return cache.addAll(dados.imagens_baixar);
                        }) );
                        
                        //limpar o banco de noticias
                        acoes.push( (function(){
                            return new Promise(function(sim, nao){
                                var s = db.transaction(["noticias"], "readwrite").objectStore("noticias").delete("*");
                                s.onsuccess = function(){
                                    sim();
                                };
                                s.onerror = function(er){
                                    nao(er);
                                };
                            });
                        })());
                        
                        //salvar as novas noticias
                        acoes.push((function(){
                            return new Promise(function(sim, nao){
                                var s = db.transaction(["noticias"], "readwrite").objectStore("noticias");
                                var inserts = [];
                                for(var x in dados.noticias){
                                    var noticia = dados.noticias[x];
                                    inserts.push((function(){
                                        return new Promise(function(sim, nao){
                                            var request = s.put(noticia);
                                            request.onsuccess = function(){
                                                sim();
                                            };
                                            request.onerror = function(){
                                                nao();
                                            };
                                        });
                                    })());
                                }
                                Promise.all(inserts).then(function(){
                                    sim();
                                }).catch(function(er){
                                    nao(er);
                                });
                            });
                        })());
                        //
                        Promise.all(acoes).then(function(){
                            var s = db.transaction(["ultima_atualizacao"], "readwrite").objectStore("ultima_atualizacao");
                            var atualizar = s.put({ data: hoje });
                            atualizar.onerror = function(){
                                reject("Erro ao Salvar Registro de Controle");
                            };
                            atualizar.onsuccess = function(){
                                resolve(true);
                            };
                        }).catch(function(er){
                            reject("Erro ao Salvar Not�cias");
                        });
                    }).catch(function(er){
                        reject("Erro ao Buscar Not�cias");
                    });
                }
            };
        };
    });
};


EnviarVisualizacoesNoticias = function(){
    return new Promise(function(resolve, reject){
        var request = indexedDB.open("not-offline", 1);
        request.onerror = function(){
            reject("Erro no indexedDB");
        };
        request.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction(["visualizacoes"], 'readwrite');
            var consulta = transaction.objectStore('visualizacoes').getAll();
            consulta.onerror = function(){
                reject("Erro ao Buscar Visualiza��es");
            };
            consulta.onsuccess = function(resposta){
                var resultado = resposta.target.result;
                var enviar = {};
                if(typeof resultado == 'object'){
                    for(var x in resultado){
                        enviar[ resultado[x].id ] = resultado[x].contador;
                    }
                }
                if(Object.keys(enviar).length > 0){
                    //
                    var http_vars = Object.keys(enviar).map(function(key){
                        return encodeURIComponent(key) + '=' + encodeURIComponent(enviar[key]);
                    }).join('&');
                    //
                    fetch("app/noticias.php?acao=salvar&v="+versao, {
                        method: "POST",
                        headers: { "Content-Type" : 'application/x-www-form-urlencoded' },
                        body:  http_vars
                    }).then(function(resposta){
                        return resposta.json();
                    }).then(function(dados){
                        if(dados.ok){
                            var transaction = db.transaction(["visualizacoes"], 'readwrite');
                            transaction.objectStore('visualizacoes').clear();
                            resolve(true);
                        }else{
                            reject("Erro ao enviar estatisticas!");
                        }
                    }).catch(function(er){
                        reject("Erro ao enviar estatisticas!");
                    });
                    //
                }
            };
            
        };
    });
};


if(MODO_PWA){
    //processamento do fetch
    self.addEventListener('fetch', function(event) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                        if (response) {
                            return response;
                        }
                        return fetch(event.request).then(function(req_resp){
                            if(cache_total_ativo){
                                if(req_resp.ok && req_resp.status===200 && !req_resp.redirected){
                                    try{
                                        var continuar = true;
                                        for(var i in cache_total_regex_ignorar){
                                            var reg_testar = cache_total_regex_ignorar[i];
                                            if(reg_testar.exec(req_resp.url.toString())){
                                                continuar = false;
                                            }
                                        }
                                        if(continuar){
                                            new Promise(function(sim, nao){
                                                var c_tipe = req_resp.headers.get('Content-Type');
                                                if(typeof c_tipe == 'string' && c_tipe!=''){
                                                    cache_total_mimes.forEach(function(v){
                                                        if(v === c_tipe){
                                                            sim();
                                                        }
                                                    });
                                                }
                                                nao(null);
                                            }).then(function(){
                                                fn_add_cache(event.request, req_resp.clone());
                                            }).catch(function(er){
                                                new Promise(function(sim, nao){
                                                    var url = req_resp.url.toString();
                                                    if(url!=''){
                                                        cache_total_extensoes.forEach(function(ext){
                                                            var reg = new RegExp("(\\."+ext+")$","i");
                                                            if(reg.exec(url)){
                                                                sim();
                                                            }
                                                        });
                                                    }
                                                    nao(null);
                                                }).then(function(){
                                                    fn_add_cache(event.request, req_resp.clone());
                                                }).catch(function(er){
                                                    //n�o faz nada
                                                });
                                            });
                                        }
                                    }catch(er){

                                    }
                                }
                            }
                            return req_resp;
                        }).catch(function(er){
                            return caches.match(TELA_APP);
                        });
                    }
                )
        );
    });


    self.addEventListener('sync', function(event) {
        if(event.tag == 'noticias-offline'){
            event.waitUntil(AtualizarNoticiasOffline());
        }else if(event.tag == 'noticias-visualizacoes'){
            event.waitUntil(EnviarVisualizacoesNoticias());
        }
    });
}


if(MODO_PUSH){
    importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/8.4.2/firebase-messaging.js');
    
    firebase.initializeApp({"apiKey":"AIzaSyDbRQO50qEL_GlZisdV-XHqA8VI1-SFXsw","authDomain":"portal-giro-94357.firebaseapp.com","projectId":"portal-giro-94357","storageBucket":"portal-giro-94357.appspot.com","messagingSenderId":"571233162182","appId":"1:571233162182:web:1c67b784933bd82b7c58c7"});
    messaging = firebase.messaging();
    
    
    var abrir_url = function(url){
        clients.openWindow(url);
    };
    var salvar_clique_notificacao = function(tag, retentativa){
        fetch('arquivos_ajax/website/notificacoes_push.php?acao=salvar_clique', {
            method: 'post',
            body: JSON.stringify({notificacao:tag})
        }).then(function(resposta){
            return resposta.json();
        }).then(function(d){
            if(!d.ok){
                throw new Error("Erro ao salvar clique na notifica��o:", d);
            }
        }).catch(function(er){
            console.log(er);
            if(!retentativa){
                setTimeout(function(){
                    salvar_clique_notificacao(tag, true);
                }, 10000);
            }
        });
    };
    var processar_clique_notificacao = function(config){
        if(config.hasOwnProperty('tipo')){
            if(config.tipo == 'url'){
                abrir_url(config.url);
            }
        }
    };
    
    
    
    messaging.onBackgroundMessage(function(mensagem_back){
        //
        var notificar = Object.assign({}, mensagem_back.notification);
        notificar.data = Object.assign({}, mensagem_back.data);
        notificar.tag = notificar.data.tag;
        notificar.requireInteraction = true;
        notificar.renotify = true;
        self.registration.showNotification(notificar.title, notificar);
        //
    });
    
    self.addEventListener('notificationclick', function(evt){
        
        var notificao = evt.notification;
        var dados = notificao.data;
        var configuracao = ((dados.hasOwnProperty('configuracao'))? dados.configuracao : {} );
        if(typeof configuracao == 'string'){
            var pl = configuracao.substr(0, 1), str_json = (pl == '{' || pl == '[');
            if(!str_json){
                configuracao = atob(configuracao);
            }
            try{
                configuracao = JSON.parse(configuracao);
            }catch(e){
                configuracao = {};
            }
        }
        //
        try{
            salvar_clique_notificacao(dados.tag);
        }catch(er){
            console.log("Erro ao salvar clique em notifica��o:", er);
        }
        //
        try{
            processar_clique_notificacao(configuracao);
        }catch(er){
            console.log("Erro ao processar clique em notifica��o:", er);
        }
        //
        notificao.close();
    });
    
}




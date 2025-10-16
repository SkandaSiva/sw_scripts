'use strict';

/**
 * Service Worker of SuperPWA
 * To learn more and add one to your website, visit - https://superpwa.com
 */
 
const cacheName = 'http://www.rechtslupe.de-superpwa-2.2.32';
const startPage = 'https://www.rechtslupe.de';
const offlinePage = 'https://www.rechtslupe.de/offline';

const filesToCache = [startPage, offlinePage,'https://www.rechtslupe.de/zivilrecht/die-zukunft-des-zivilprozesses-3270386',
'https://www.rechtslupe.de/steuerrecht/erbst/der-erbverzicht-des-sohns-und-der-erbschaftsteuerliche-freibetrag-des-enkels-3270378',
'https://www.rechtslupe.de/arbeitsrecht/die-agg-entschaedigungsklage-eines-benachteiligten-stellenbewerbers-3270369',
'https://www.rechtslupe.de/arbeitsrecht/einheitlicher-streitgegenstand-oder-zwei-streitgegenstaende-oder-die-nicht-beantragte-urteilsergaenzung-3270370',
'https://www.rechtslupe.de/arbeitsrecht/der-benachteiligte-stellenbewerber-und-die-bemessung-seiner-agg-entschaedigung-3270371',
'https://www.rechtslupe.de/zivilrecht/vollstreckung/umsatzsteuerschulden-und-der-insolvenzantrag-des-finanzamts-3270393',
'https://www.rechtslupe.de/arbeitsrecht/fruehere-masterstudiengaenge-an-fachhochschulen-und-die-mittelbare-altersdiskriminierung-ihrer-absolventen-3270372',
'https://www.rechtslupe.de/zivilrecht/der-in-der-waschanlage-abgerissene-spoiler-3270314',
'https://www.rechtslupe.de/sozialrecht/rueckwirkende-kindergeldzahlung-bei-saisonarbeitnehmern-3270304',
'https://www.rechtslupe.de/wirtschaftsrecht/foerderung-kulturell-bedeutender-werke-und-leistungen-aus-den-einnahmen-der-vg-wort-3270318',
'https://www.rechtslupe.de/arbeitsrecht/mutterschutzrechtliche-beschaeftigungsverbote-und-die-urlaubsabgeltung-3270276',
'https://www.rechtslupe.de/steuerrecht/ust/die-jahresuebergreifende-umsatzverlagerung-und-ihre-spaetere-korrektur-3270310',
'https://www.rechtslupe.de/verwaltungsrecht/fluechtlingen-in-italien-gehts-gut-3270327',
'https://www.rechtslupe.de/strafrecht/rechtsbeugung-wegen-corona-3270322',
'https://www.rechtslupe.de/arbeitsrecht/von-der-arbeitsvertraglichen-zur-tariflichen-anspruchsgrundlage-oder-klageaenderung-im-berufungsverfahren-3270269',
'https://www.rechtslupe.de/arbeitsrecht/verschlechterung-der-betrieblichen-altersversorgung-im-konzern-3270274',
'https://www.rechtslupe.de/steuerrecht/einkommensteuer/einkommensteuer-privat/prozesszinsen-in-der-einkommensteuer-3270288',
'https://www.rechtslupe.de/steuerrecht/einkommensteuer/einkommensteuer-privat/vorteilsminderung-bei-der-1-regelung-fuer-dienstwagen-3270282',
'https://www.rechtslupe.de/arbeitsrecht/duales-studium-und-die-rueckzahlung-von-studienkosten-an-den-arbeitgeber-3270268',
'https://www.rechtslupe.de/steuerrecht/einkommensteuer/einkommensteuer-privat/die-dreiteilige-anzugskombination-und-der-werbungskostenabzug-3270285',
'https://www.rechtslupe.de/allgmeines/bestattungskosten-als-nachlassverbindlichkeiten-und-die-vorab-abgetretene-sterbegeldversicherung-3270279',
'https://www.rechtslupe.de/sozialrecht/kurzarbeitergeld-und-der-verspaetete-eingang-der-arbeitgeberanzeige-3270215',
'https://www.rechtslupe.de/arbeitsrecht/das-headset-system-am-arbeitsplatz-als-technische-ueberwachungseinrichtung-3270239',
'https://www.rechtslupe.de/steuerrecht/verbrauchssteuern/grundsteuerwertfeststellung-und-die-aussetzung-ihrer-vollziehung-3270229',
'https://www.rechtslupe.de/verwaltungsrecht/vereinsverbot-fuer-palaestina-solidaritaet-duisburg-3270225',
'https://www.rechtslupe.de/brennpunkt/die-ausspionierte-schul-it-und-der-schulverweis-3270237',
'https://www.rechtslupe.de/sozialrecht/keine-berufsausbildungsbeihilfe-fuer-die-wohnung-im-elternhaushalt-3270219',
'https://www.rechtslupe.de/wirtschaftsrecht/keine-sonntagsoeffnung-fuer-kioske-3270233',
'https://www.rechtslupe.de/sozialrecht/der-autismus-assistenzhund-und-die-gesetzliche-krankenkasse-3270169',
'https://www.rechtslupe.de/verwaltungsrecht/kindernachzug-zum-anerkannten-fluechtling-und-die-visumantragstellungsfrist-3270182',
'https://www.rechtslupe.de/verwaltungsrecht/die-podologin-als-heilpraktikerin-3270179',
'https://www.rechtslupe.de/brennpunkt/allianz-gegen-rechtsextremismus-aber-nicht-in-nuernberg-3270189',
'https://www.rechtslupe.de/verwaltungsrecht/beamtenrecht/der-personalrat-und-das-unangemessen-lange-gerichtsverfahren-3270175',
'https://www.rechtslupe.de/wirtschaftsrecht/schadensersatz-fuer-das-facebook-datenscraping-3270184',
'https://www.rechtslupe.de/strafrecht/die-volksrepublik-donezk-als-auslaendische-terroristische-vereinigung-3270186',
'https://www.rechtslupe.de/arbeitsrecht/kirchliche-arbeitsvertragsordnung-und-die-bezugnahmeklausel-in-kirchlichen-arbeitsvertraegen-3270093',
'https://www.rechtslupe.de/brennpunkt/die-lng-anlage-im-hafen-von-lubmin-3270109',
'https://www.rechtslupe.de/strafrecht/mitgliedschaftliche-beteiligung-an-einer-terroristischen-kriminellen-vereinigung-3270098',
'https://www.rechtslupe.de/verwaltungsrecht/abwasserabgabenpflicht-fuer-abwasserzweckverbaende-und-die-kleineinleitung-3270105',
'https://www.rechtslupe.de/steuerrecht/einkommensteuer/einkommensteuer-privat/besonderes-kirchgeld-in-glaubensverschiedener-ehe-nach-anerkennung-der-gleichgeschlechtlichen-lebenspartnerschaft-3270100',
'https://www.rechtslupe.de/arbeitsrecht/arbeitsgerichte-und-die-vergangenheitsbezogene-elementenfeststellungsklage-3270094',
'https://www.rechtslupe.de/arbeitsrecht/lehrer-im-kirchlichen-dienst-und-ihre-arbeitzeit-3270092',
'https://www.rechtslupe.de/strafrecht/k-o-sind-kein-gefaehrliches-werkzeug-3269979',
'https://www.rechtslupe.de/arbeitsrecht/tarifvertragliche-inflationsausgleichspraemie-und-die-arbeitnehmer-in-der-altersteilzeit-3270006',
'https://www.rechtslupe.de/strafrecht/gesamtstrafenbildung-und-die-fruehere-geldstrafe-wegen-marihuanabesitzes-3269974',
'https://www.rechtslupe.de/arbeitsrecht/arbeitnehmerueberlassung-und-die-grenzen-des-konzernprivilegs-3270004',
'https://www.rechtslupe.de/zivilrecht/flugannullierung-wegen-aussergewoehnlicher-umstaende-und-der-nicht-angebotene-ersatzflug-3269994',
'https://www.rechtslupe.de/arbeitsrecht/tarifvertragliche-ausschlussfristen-und-die-email-3270013',
'https://www.rechtslupe.de/arbeitsrecht/feiertagszuschlag-und-der-regelmaessige-beschaeftigungsort-3270010',
'https://www.rechtslupe.de/wirtschaftsrecht/gesellschaftsrecht/der-fehlerhaft-bestellte-besondere-vertreter-bei-der-aktiengesellschaft-3269878',
'https://www.rechtslupe.de/wirtschaftsrecht/gesellschaftsrecht/der-fehlerhaft-bestellte-besondere-vertreter-und-seine-verguetung-3269880',
'https://www.rechtslupe.de/wirtschaftsrecht/gesellschaftsrecht/der-fehlerhaft-bestellte-besondere-vertreter-einer-aktiengesellschaft-und-seine-haftung-3269885',
'https://www.rechtslupe.de/wirtschaftsrecht/gesellschaftsrecht/unberechtigte-dividendenzahlungen-und-der-geltendmachungsbeschluss-der-hauptversammlung-3269881',
'https://www.rechtslupe.de/zivilrecht/vollstreckung/erstattungsansprueche-aus-einer-krankenversicherung-in-der-insolvenz-3269902',
'https://www.rechtslupe.de/wirtschaftsrecht/gesellschaftsrecht/die-fehlerhafte-bestellung-eines-besonderen-vertreters-und-ihre-beendigung-durch-den-vorstand-3269879',
'https://www.rechtslupe.de/zivilrecht/vollstreckung/die-festsetzung-der-insolvenzverwalterverguetung-und-die-beschwerde-des-anwaltlichen-betreuers-3269905',
'https://www.rechtslupe.de/wirtschaftsrecht/gesellschaftsrecht/das-stimmverbot-des-aktionaers-3269882',
'https://www.rechtslupe.de/wirtschaftsrecht/kapitalanlagerecht/ein-rechtsanwalt-als-gemeinsamer-vertreter-fuer-mehrere-schuldverschreibungsglaeubiger-und-seine-verguetung-3269858',
'https://www.rechtslupe.de/zivilrecht/die-isolierte-drittwiderklage-gegen-eine-klage-aus-abgetretenem-recht-3269884',
'https://www.rechtslupe.de/zivilrecht/die-zeitverguetung-eines-rechtsanwalts-und-seine-darlegungs-und-beweislast-3269886',
'https://www.rechtslupe.de/zivilrecht/parteianhoerung-und-die-ueberzeugung-des-gerichts-3269883',
'https://www.rechtslupe.de/zivilrecht/das-coronabedingte-einreiseverbot-und-der-ruecktritt-vom-reisevertrag-3269860',
'https://www.rechtslupe.de/familienrecht/der-anfechtungsstreit-zwischen-schwiegerkind-und-schwiegervater-3269862',
'https://www.rechtslupe.de/arbeitsrecht/eingruppierung-und-die-unterrichtung-des-betriebsrats-3269835',
'https://www.rechtslupe.de/zivilrecht/zustellung-demnaechst-und-die-verzoegerung-im-zustellungsverfahren-3269841',
'https://www.rechtslupe.de/verwaltungsrecht/nachbesetzung-von-ausschusssitzen-in-der-landschaftsversammlung-rheinland-3269845',
'https://www.rechtslupe.de/wirtschaftsrecht/kapitalanlagerecht/praemiensparvertrag-und-seine-kuendigung-durch-die-sparkasse-2-3269838',
'https://www.rechtslupe.de/zivilrecht/verjaehrung-eines-vob-baulohnanspruchs-3269840',
'https://www.rechtslupe.de/arbeitsrecht/das-guthaben-auf-dem-zeitwertkonto-und-das-beendete-arbeitsverhaeltnis-3269831',
'https://www.rechtslupe.de/arbeitsrecht/die-prozessvollmacht-im-arbeitsgerichtlichen-beschlussverfahren-und-die-einlegung-der-beschwerde-3269833',
'https://www.rechtslupe.de/steuerrecht/verbrauchssteuern/hamburger-zweitwohnungsteuer-und-die-beruflich-unterhaltene-wohnung-3269800',
'https://www.rechtslupe.de/arbeitsrecht/von-der-teilzeit-auf-eine-hoeher-bewertete-vollzeitstelle-im-oeffentlichen-dienst-3269790',
'https://www.rechtslupe.de/arbeitsrecht/klageaentrage-und-ihre-auslegung-oder-feststellungs-statt-leistungsantrag-3269792',
'https://www.rechtslupe.de/arbeitsrecht/die-nicht-beteiligte-gleichstellungsbeauftragte-und-die-abgebrochene-stellenbesetzung-im-oeffentlichen-dienst-3269793',
'https://www.rechtslupe.de/arbeitsrecht/die-klageaenderung-vor-dem-bundesarbeitsgericht-3269791',
'https://www.rechtslupe.de/strafrecht/from-the-river-to-the-sea-als-kennzeichen-einer-terroristischen-organisation-3269803',
'https://www.rechtslupe.de/arbeitsrecht/bewerbungsverfahrensanspruch-im-oeffentlichen-dienst-und-der-schadensersatz-wegen-abbruchs-des-stellenbesetzungsverfahrens-3269789',
'https://www.rechtslupe.de/brennpunkt/cybergefahren-und-die-strategische-inland-ausland-fernmeldeueberwachung-des-bnd-3269730',
'https://www.rechtslupe.de/arbeitsrecht/die-kosten-des-betriebsrats-im-beschlussverfahren-3269711',
'https://www.rechtslupe.de/sozialrecht/die-mitwirkungspflichtverletzung-des-kindergeldempfaengers-und-die-rueckforderung-des-kindergelds-3269722',
'https://www.rechtslupe.de/zivilrecht/vollstreckung/insolvenzanfechtung-der-mietzahlungen-nach-erfolgter-mietvertragskuendigung-3269727',
'https://www.rechtslupe.de/sozialrecht/kindergeldrechtliche-ausschlussfrist-bei-arbeitnehmern-aus-anderen-eu-mitgliedstaaten-3269719',
'https://www.rechtslupe.de/sozialrecht/kindergeld-fuer-das-volljaehrige-behinderte-kind-und-die-behinderungsbedingten-fahrtaufwendungen-3269714',
'https://www.rechtslupe.de/verwaltungsrecht/der-bnd-darf-zur-spionagesoftware-pegasus-schweigen-3269724',
'https://www.rechtslupe.de/verwaltungsrecht/das-wettbuero-und-die-nahegelegene-grundschule-3269665',
'https://www.rechtslupe.de/steuerrecht/der-absendevermerk-der-behoerde-und-der-poststempel-3269675',
'https://www.rechtslupe.de/sozialrecht/kein-freibetrag-fuer-freiwillig-krankenversicherte-betriebsrentner-3269691',
'https://www.rechtslupe.de/wirtschaftsrecht/kapitalanlagerecht/die-kontenkuendigung-der-volksbank-3269694',
'https://www.rechtslupe.de/sozialrecht/volkshochschulen-und-die-sozialversicherungspflicht-von-honorardozenten-3269684',
'https://www.rechtslupe.de/steuerrecht/das-uebergangene-kernvorbringen-eines-beteiligten-3269673',
'https://www.rechtslupe.de/steuerrecht/mehrere-streitgegenstaende-und-der-umfang-des-rechtsmittels-3269674',
'https://www.rechtslupe.de/allgmeines/fuer-den-todesfall-richtig-vorsorgen-3269708',
'https://www.rechtslupe.de/arbeitsrecht/arbeitsvertragliche-bezugnahmeklausel-und-der-zwingende-tarifvertrag-3269634',
'https://www.rechtslupe.de/steuerrecht/einkommensteuer/einkommensteuer-privat/photovoltaikanlage-und-die-rueckgaengigmachung-eines-investitionsabzugsbetrags-3269648',
'https://www.rechtslupe.de/arbeitsrecht/der-wechsel-eines-ehrenamtlichen-richters-vom-arbeits-zum-landesarbeitsgericht-3269647',
'https://www.rechtslupe.de/arbeitsrecht/der-us-arbeitgeber-und-die-kuendigungsfristen-3269638',
'https://www.rechtslupe.de/arbeitsrecht/der-arbeitsvertrag-mit-einem-us-arbeitgeber-und-die-internationale-zustaendigkeit-fuer-die-kuendigungschutzklage-3269641',
'https://www.rechtslupe.de/steuerrecht/selbstaendiges-zwischenverfahren-und-die-anhoerungsruege-3269650',
'https://www.rechtslupe.de/verwaltungsrecht/konkrete-normenkontrolle-und-die-begruendung-der-richtervorlage-3-3269606',
'https://www.rechtslupe.de/verwaltungsrecht/kindergarten-und-der-damit-verbundene-verkehrslaerm-3269552',
'https://www.rechtslupe.de/arbeitsrecht/befristung-eines-arbeitsverhaeltnisses-und-die-beteiligung-der-gleichstellungsbeauftragten-3269615',
'https://www.rechtslupe.de/verwaltungsrecht/verfassungsbeschwerde-und-der-grundsatz-der-subsidiaritaet-nach-einstweiligen-rechtsschutzverfahren-3269612',
'https://www.rechtslupe.de/verwaltungsrecht/hoechstspannungsfreileitung-aber-doch-nicht-bei-uns-3269550',
'https://www.rechtslupe.de/strafrecht/die-gerichtliche-einstellung-eines-owi-verfahrens-und-die-willkuerliche-auslagenentscheidung-3269609',
'https://www.rechtslupe.de/arbeitsrecht/befristete-einstellung-eines-vertretungslehrers-3269616',
'https://www.rechtslupe.de/verwaltungsrecht/planfeststellung-fuer-eine-hoechstspannungsfreileitung-3269547',
'https://www.rechtslupe.de/arbeitsrecht/der-streit-um-die-besoldung-eines-freigestellten-betriebsrats-und-die-feststellungsklage-3269562',
'https://www.rechtslupe.de/arbeitsrecht/das-freigestellte-betriebsratsmitglied-und-sein-anspruch-auf-provision-und-zielerreichungs-bonus-3269563',
'https://www.rechtslupe.de/verwaltungsrecht/rechtliches-gehoer-und-das-erfolglose-akteneinsichtsgesuch-3269555',
'https://www.rechtslupe.de/arbeitsrecht/klage-auf-gutschrift-auf-ein-vom-arbeitgeber-gefuehrtes-konto-und-die-bestimmtheit-des-klageantrags-3269561',
'https://www.rechtslupe.de/verwaltungsrecht/die-uebergangenen-beweisangebote-und-die-aufklaerungsruege-3269556',
'https://www.rechtslupe.de/verwaltungsrecht/der-angebliche-verstoss-des-verwaltungsgerichts-gegen-den-ueberzeugungsgrundsatz-3269554',
'https://www.rechtslupe.de/steuerrecht/einkommensteuer/einkommensteuer-privat/kein-werbungskostenabzug-fuer-ausschliesslich-durch-ein-insolvenzverfahren-verursachte-aufwendungen-und-der-werbungskostenabzug-3269572',
'https://www.rechtslupe.de/arbeitsrecht/die-pause-als-arbeitszeit-und-der-streitgegenstand-3269459',
'https://www.rechtslupe.de/steuerrecht/einkommensteuer/einkommensteuer-privat/anforderung-von-mietvertraegen-durch-das-finanzamt-und-der-mieter-datenschutz-3269467',
'https://www.rechtslupe.de/arbeitsrecht/die-ueberwachung-des-krankgeschriebenen-arbeitnehmers-durch-eine-detektei-3269445',
'https://www.rechtslupe.de/verwaltungsrecht/beamtenrecht/potenzialfeststellung-bei-der-bundeswehr-aber-nur-auf-gesetzlicher-grundlage-3269476',
'https://www.rechtslupe.de/arbeitsrecht/der-streit-um-die-arbeitsunfaehigkeit-und-die-aertzliche-au-bescheinigung-3269446',
'https://www.rechtslupe.de/arbeitsrecht/gesetzliche-ruhepausen-und-ihre-flexible-festlegung-3269458',
'https://www.rechtslupe.de/brennpunkt/die-hoehe-der-bafoeg-grundpauschale-und-keine-handlungspflicht-des-staates-3269472',
'https://www.rechtslupe.de/strafrecht/der-richtige-rechtsbeistand-wie-sie-den-passenden-anwalt-fuer-ihre-strafrechtsangelegenheiten-finden-3269508',
'https://www.rechtslupe.de/steuerrecht/dba/alles-wichtige-zum-thema-steuern-wenn-sie-paletten-innerhalb-der-eu-versenden-3269502',
'https://www.rechtslupe.de/arbeitsrecht/arbeitgeberpflichten-bei-elternzeit-und-mutterschutz-ihre-rechte-im-ueberblick-3269512',
'https://www.rechtslupe.de/zivilrecht/komplexe-mietvertragsklauseln-wie-man-individuelle-anpassungen-rechtssicher-gestaltet-3269505',
'https://www.rechtslupe.de/zivilrecht/rueckgabebedingungen-im-leasingvertrag-welche-rechtlichen-regelungen-gelten-3269510',
'https://www.rechtslupe.de/allgmeines/ein-blick-auf-die-interessantesten-tennis-turniere-im-jahr-2024-3269515',
'https://www.rechtslupe.de/verwaltungsrecht/umweltrecht/fortschreibung-eines-luftreinhalteplans-3269419',
'https://www.rechtslupe.de/steuerrecht/einkommensteuer/einkommensteuer-betrieb/gesonderte-und-einheitliche-feststellung-fuer-eine-beendete-gbr-und-die-klagebefugnis-3269431',
'https://www.rechtslupe.de/zivilrecht/bauliche-veraenderungen-am-gemeinschaftseigentum-zugunsten-einzelner-wohnungseigentuemer-3269407',
'https://www.rechtslupe.de/steuerrecht/einkommensteuer/einkommensteuer-betrieb/die-klage-gegen-einen-gewinnfeststellungsbescheid-und-der-klagegegenstand-3269430',
'https://www.rechtslupe.de/steuerrecht/einkommensteuer/einkommensteuer-betrieb/der-verpachtete-gewerbebetrieb-und-seine-unentgeltliche-uebertragung-unter-niessbrauchsvorbehalt-3269429',
'https://www.rechtslupe.de/zivilrecht/leasingvertrags-mit-kilometerabrechnung-und-das-widerrufsrecht-3269413',
'https://www.rechtslupe.de/arbeitsrecht/die-rechtsbeschwerde-im-ordnungsmittelverfahren-3269436',
'https://www.rechtslupe.de/wirtschaftsrecht/gesellschaftsrecht/die-monistisch-verfasste-se-und-die-rechtsgeschaefte-mit-ihren-geschaeftsfuehrenden-direktoren-3269381',
'https://www.rechtslupe.de/wirtschaftsrecht/fluggastrechte-und-die-flugannullierung-wegen-eines-schneesturms-3269373',
'https://www.rechtslupe.de/zivilrecht/vollstreckung/die-sofortige-beschwerde-im-zwangsversteigerungsverfahren-und-der-zwischenzeitliche-schluss-der-versteigerung-3269387',
'https://www.rechtslupe.de/zivilrecht/vollstreckung/bestimmung-des-zwangsversteigerungstermins-durch-veroeffentlichung-im-internet-3269392',
'https://www.rechtslupe.de/zivilrecht/vollstreckung/einstellung-des-zwangsversteigerungsverfahrens-wegen-gefaehrdung-der-durchfuehrung-des-insolvenzplans-3269389',
'https://www.rechtslupe.de/zivilrecht/revisionszulassung-und-ihre-beschraenkung-in-den-urteilsgruenden-3-3269382',
'https://www.rechtslupe.de/zivilrecht/vollstreckung/zuschlagsbeschwerde-im-zwangsvollstreckungsverfahren-und-die-beschraenkt-zugelassene-rechtsbeschwerde-3269395',
'https://www.rechtslupe.de/verwaltungsrecht/keine-cbd-mundpflegesprays-3269336',
'https://www.rechtslupe.de/verwaltungsrecht/verfassungsbeschwerde-gegen-die-entscheidung-eines-landesverfassungsgerichts-2-3269327',
'https://www.rechtslupe.de/verwaltungsrecht/schmutzwassergebuehren-im-land-brandenburg-3269333',
'https://www.rechtslupe.de/familienrecht/beschwerde-gegen-eine-entscheidung-des-familiengerichts-und-der-beschwerdeantrag-3269339',
'https://www.rechtslupe.de/verwaltungsrecht/ehegattennachzug-bei-subsidiaer-schutzberechtigten-und-keine-verkuerzung-der-trennungszeit-3269331',
'https://www.rechtslupe.de/wirtschaftsrecht/das-von-einer-drohne-fotografierte-kunstwerk-3269319',
'https://www.rechtslupe.de/strafrecht/strafvollstreckungsrecht/verlegung-in-eine-andere-jva-und-die-gerichtliche-eilentscheidung-3269323',
'https://www.rechtslupe.de/wirtschaftsrecht/keine-kostenlosen-stellenanzeigen-im-online-portal-eines-landkreises-3269267',
'https://www.rechtslupe.de/wirtschaftsrecht/kapitalanlagerecht/kapitalanleger-musterverfahren-und-die-feststellungziele-3269242',
'https://www.rechtslupe.de/arbeitsrecht/homeoffice-kurzarbeit-und-die-betriebsratswahl-als-briefwahl-3269259',
];
const neverCacheUrls = [/\/wp-admin/,/\/wp-login/,/preview=true/];

// Install
self.addEventListener('install', function(e) {
	console.log('SuperPWA service worker installation');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('SuperPWA service worker caching dependencies');
			filesToCache.map(function(url) {
				return cache.add(url).catch(function (reason) {
					return console.log('SuperPWA: ' + String(reason) + ' ' + url);
				});
			});
		})
	);
});

// Activate
self.addEventListener('activate', function(e) {
	console.log('SuperPWA service worker activation');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if ( key !== cacheName ) {
					console.log('SuperPWA old cache removed', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

// Range Data Code
var fetchRangeData = function(event){
    var pos = Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
            console.log('Range request for', event.request.url, ', starting position:', pos);
            event.respondWith(
              caches.open(cacheName)
              .then(function(cache) {
                return cache.match(event.request.url);
              }).then(function(res) {
                if (!res) {
                  return fetch(event.request)
                  .then(res => {
                    return res.arrayBuffer();
                  });
                }
                return res.arrayBuffer();
              }).then(function(ab) {
                return new Response(
                  ab.slice(pos),
                  {
                    status: 206,
                    statusText: 'Partial Content',
                    headers: [
                      // ['Content-Type', 'video/webm'],
                      ['Content-Range', 'bytes ' + pos + '-' +
                        (ab.byteLength - 1) + '/' + ab.byteLength]]
                  });
              }));
}

// Fetch
self.addEventListener('fetch', function(e) {
	
	// Return if the current request url is in the never cache list
	if ( ! neverCacheUrls.every(checkNeverCacheList, e.request.url) ) {
	  console.log( 'SuperPWA: Current request is excluded from cache.' );
	  return;
	}
	
	// Return if request url protocal isn't http or https
	if ( ! e.request.url.match(/^(http|https):\/\//i) )
		return;
	
    	// Return if request url is from an external domain.
	if ( new URL(e.request.url).origin !== location.origin )
		return;
    
				
			// For Range Headers
			if (e.request.headers.has('range')) {
				return;
			}
			// Revving strategy
			if ( (e.request.mode === 'navigate' || e.request.mode === 'cors') && navigator.onLine ) {
				e.respondWith(
					fetch(e.request).then(function(response) {
						return caches.open(cacheName).then(function(cache) {
							cache.put(e.request, response.clone());
							return response;
						});  
					}).catch(function(){
						// If the network is unavailable, get
						return cache.match(e.request.url);
					})
				);
				return;
			}

			//strategy_replace_start
			e.respondWith(
				caches.match(e.request).then(function(response) {
					return response || fetch(e.request).then(function(response) {
						return caches.open(cacheName).then(function(cache) {
							cache.put(e.request, response.clone());
							return response; 
						});  
					});
				}).catch(function() {
					return caches.match(offlinePage);
				})
			);
			//strategy_replace_end


});

// Check if current url is in the neverCacheUrls list
function checkNeverCacheList(url) {
	if ( this.match(url) ) {
		return false;
	}
	return true;
}
importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js");
	            if(workbox.googleAnalytics){
                  try{
                    workbox.googleAnalytics.initialize();
                  } catch (e){ console.log(e.message); }
                }
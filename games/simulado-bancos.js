/* Bancos do "Simulado do simulado" (Mônica, 05/11/2026). Uma matéria por chave.
   Cada questão: id, tema, ctx (contexto), p (pergunta), o (5 alternativas), a (índice da certa), w (por quê), f (fonte), net (true = pesquisa na internet, sai com asterisco).
   Opcionais (09/11/2026): af (lista de afirmativas, aparecem numeradas I, II, III...), ar (true = asserção e razão, com PORQUE entre I e II), fixa (true = não embaralha as alternativas).
   Regra do Rafael (05/11): base no material do professor, no que a turma manda e nos simulados anteriores; questão da internet só da matéria, marcada e com fonte. Nada errado. */
const FONTE_AULA1 = 'Slides da aula 1 do Prof. Gustavo Holderbaum (18/08/2026)';
const FONTE_SM1 = 'Tema cobrado no SM1 de 21/09/2026';
const FONTE_ED = 'Estudo dirigido de 28/09/2026 (inervação)';
const WIKI_MAX = 'Wikipédia, "Nervo maxilar" (pt.wikipedia.org/wiki/Nervo_maxilar), lida em 05/11/2026';
const WIKI_MAN = 'Wikipédia, "Nervo mandibular" (pt.wikipedia.org/wiki/Nervo_mandibular), lida em 05/11/2026';
const FONTE_HIST = 'Ficha da lâmina da aula de 26/10/2026 (músculo estriado esquelético) e conhecimento geral de histologia, não veio de slide do professor';
const WIKI_PAR ='Wikipédia, "Ducto parotídeo" (pt.wikipedia.org/wiki/Ducto_parotídeo), lida em 05/11/2026';
const FONTE_ED14 = 'Estudo dirigido do material do professor, caps. 13 e 14 (inervação e anestesia), e quiz da turma de 26/10/2026';
const FONTE_ED_MUSC = 'Estudo dirigido do material do professor, caps. 5 e 6 (músculos da face e da mastigação); resposta conferida pela anatomia padrão';
const FONTE_ED_ART = 'Estudo dirigido do material do professor, cap. 11 (artérias); resposta conferida pela anatomia padrão';
const FONTE_MAND = 'Slides do Prof. Gustavo Holderbaum, Técnicas Anestésicas na Mandíbula (22/10/2026)';
const FONTE_JONAS = 'Revisão de anatomia';
const NET_CRANIO = 'Pesquisa: anatomia padrão do crânio (Wikipédia, "Crânio", pt.wikipedia.org/wiki/Crânio; Kenhub), conferida em 09/11/2026';
const KEN_MAST = 'Kenhub, "Músculos da mastigação" (kenhub.com/pt/library/anatomia/musculos-da-mastigacao), conferido em 09/11/2026';
const NET_FACE = 'Pesquisa: anatomia padrão da face (Kenhub, músculos da expressão facial e glândulas salivares), conferida em 09/11/2026';
const WIKI_ECE = 'Wikipédia, "Artéria carótida externa" (pt.wikipedia.org/wiki/Artéria_carótida_externa), conferida em 09/11/2026';

window.BANCOS = {
  bases: {
    curso: 'Odontologia',
    materia: 'Bases Morfológicas da Odontologia',
    curta: 'Bases',
    codigo: 'ARA4190',
    prof: 'GUSTAVO HOLDERBAUM',
    turma: '3008',
    proxima: 'SM2 foi segunda 09/11. AV segunda 23/11',
    modos: [
      { id: 'completo', nome: 'Simulado completo', sub: '10 questões sorteadas de toda a matéria.', temas: null },
      { id: 'sm1ver', nome: 'Prova do SM1', sub: 'As 10 questões que caíram no SM1, na ordem da prova.', temas: null, sm1todo: true },
      { id: 'inerv', nome: 'Inervação e anestesia', sub: 'Nervo maxilar e mandibular, qual nervo anestesiar e as técnicas na mandíbula.', temas: ['Inervação', 'Anestesia'] },
      { id: 'cranio', nome: 'Crânio, forames e suturas', sub: 'Neurocrânio, esfenoide, mandíbula, suturas e forames.', temas: ['Osteologia'] },
      { id: 'musc', nome: 'Músculos e vascularização', sub: 'Mastigação, mímica, supra-hióideos e carótida externa.', temas: ['Músculos da mastigação', 'Mímica', 'Vascularização'] },
      { id: 'afirm', nome: 'Afirmativas I, II, III', sub: 'Questões no estilo "está correto o que se afirma em" e de asserção e razão.', temas: null, af: true },
      { id: 'erros', nome: 'Revisar meus erros', sub: 'Só as questões que você errou ou deixou em branco aqui.', temas: null, erros: true }
    ],
    revisao: [
      { m: ['completo'], t: 'Terminologia (aula 1)', i: [
        'Posição anatômica: corpo ereto, face para a frente, palmas das mãos para a frente (supinação).',
        'Sagital mediano: direita e esquerda. Coronal: anterior e posterior. Transversal (axial): superior e inferior.',
        'Mesial: face voltada para a linha média do arco. Distal: face voltada para o fundo do arco.',
        'Proximal: perto da origem (raiz) de membros, nervos e vasos. Distal: longe dela.'] },
      { m: ['completo'], t: 'Embriologia (aula 1)', i: [
        'Fecundação: geralmente no terço distal da tuba uterina. Zigoto = célula totipotente.',
        'Dia 4: mórula. Blastocisto: trofoblasto (implantação e placenta) e embrioblasto (embrião).',
        '2ª semana, disco bilaminar: epiblasto (dorsal, células cilíndricas) e hipoblasto (ventral, cuboides).',
        '3ª semana, gastrulação: a linha primitiva origina endoderma, mesoderma e ectoderma.'] },
      { m: ['completo'], t: 'Folhetos e odontologia (aula 1)', i: [
        'Endoderma: epitélio do trato gastrointestinal e respiratório, fígado, pâncreas, tireoide.',
        'Mesoderma: conjuntivos, ossos do corpo, músculos (inclusive mastigação e mímica), sangue.',
        'Ectoderma: sistema nervoso, epiderme, estomodeu e o ESMALTE (único folheto que forma o órgão do esmalte).',
        'Crista neural → ectomesênquima: ossos da face, dentina, polpa, cemento e ligamento periodontal.'] },
      { m: ['completo','sm1','cranio'], t: 'Osteologia do crânio (SM1)', i: [
        'Mandíbula: único osso móvel do crânio; articula com o temporal na ATM.',
        'Canal mandibular: começa no forame mandibular e termina no forame mentual.',
        'Palato duro: processos palatinos da maxila + lâminas horizontais do palatino.',
        'Septo nasal ósseo: lâmina perpendicular do etmoide + vômer.',
        'Arco zigomático: processo temporal do zigomático + processo zigomático do temporal.',
        'Esfenoide: forame redondo (nervo maxilar, V2) e forame oval (nervo mandibular, V3).',
        'Suturas da calvária fundidas = sinostose. No bebê, as áreas não ossificadas = fontículos.'] },
      { m: ['completo','sm1'], t: 'Glândulas e dentina (SM1)', i: [
        'Parótida: a maior glândula salivar; o ducto abre no vestíbulo na altura do 2º molar superior.',
        'Submandibular: segunda em tamanho, faz 60 a 65 % do volume salivar.',
        'Dentina secundária: depois que o forame apical se completa, mais lenta. Terciária: resposta a lesão.'] },
      { m: ['completo','inerv'], t: 'Inervação (estudo dirigido de 28/09)', i: [
        'Nervo maxilar (V2): forame redondo → fossa pterigopalatina → canal infraorbital.',
        'Alveolar superior posterior: molares. Médio: pré-molares (ausente em cerca de 30 %). Anterior: incisivos e caninos.',
        'Infraorbital: pálpebra inferior, nariz, lábio superior e gengiva vestibular de incisivos, caninos e pré-molares superiores.',
        'Nasopalatino: palato de incisivos e caninos. Palatino maior: palato do canino aos molares.',
        'Nervo mandibular (V3): forame oval. Bucal: bochecha. Alveolar inferior: motor e sensitivo, canal mandibular.',
        'Músculos da mastigação: ramos do nervo mandibular.'] },
      { m: ['completo'], t: 'Histologia, músculo estriado esquelético (aula de 26/10)', i: [
        'Fibras longas, cilíndricas e multinucleadas, com núcleos periféricos.',
        'Estriações transversais por causa dos sarcômeros (actina e miosina). Contração voluntária.',
        'Endomísio: cada fibra. Perimísio: cada fascículo. Epimísio: o músculo inteiro.',
        'HE: citoplasma rosa (eosina) e núcleos azulados ou roxos (hematoxilina).'] },
      { m: ['completo','sm1','cranio'], t: 'Crânio: neurocrânio, forames e suturas', i: [
        'Neurocrânio = 8 ossos: frontal, occipital, esfenoide, etmoide, 2 parietais e 2 temporais.',
        'Esfenoide, asa maior: redondo = nervo maxilar (V2); oval = nervo mandibular (V3); espinhoso = artéria meníngea média.',
        'Forame magno: no occipital, ladeado pelos côndilos occipitais (articulam com o atlas).',
        'Suturas: coronal (frontal e parietais), sagital (parietal com parietal), lambdóidea (parietais e occipital).',
        'Mandíbula: forame mandibular (face medial do ramo, com a língula) → canal → forame mentual. Processo coronoide = temporal; fóvea pterigóidea = pterigóideo lateral; linha milo-hióidea = milo-hióideo.',
        'ATM: cabeça da mandíbula na fossa mandibular do TEMPORAL. Processo mastoide e estiloide também são do temporal.',
        'Etmoide: lâmina cribriforme (olfatório) e lâmina perpendicular (septo). Concha nasal inferior = osso próprio. Sela turca no esfenoide.',
        'Maxila: forame infraorbital, fossa canina, tuberosidade (forames alveolares dos nervos alveolares superiores posteriores). Forame incisivo = nasopalatino.',
        'Hioide não se articula com nenhum osso. Maior seio paranasal = maxilar.'] },
      { m: ['completo','inerv'], t: 'Anestesia: qual nervo em cada caso (estudo dirigido, cap. 14)', i: [
        '2º molar inferior: alveolar inferior (dente) + bucal (gengiva vestibular) + lingual (gengiva lingual).',
        '1º pré-molar inferior: alveolar inferior + lingual + mentual (gengiva vestibular).',
        'Canal mentual: mento, lábio inferior do lado e gengiva vestibular da linha mediana até o 2º pré-molar. O lábio continua se mexendo (músculos = nervo facial).',
        'Cálculo no ducto submandibular (soalho da boca): nervo lingual. Canino inferior (dente): só o alveolar inferior.',
        'Apicectomia do 1º pré-molar inferior: alveolar inferior + mentual.',
        '2º molar superior: alveolares superiores posteriores (com o ramo gengival) + palatino maior.',
        'Canino superior: alveolar superior anterior + infraorbital (vestibular) + nasopalatino (palatina).',
        'Lingual: sensibilidade geral dos 2/3 anteriores da língua e do soalho; a gustação e as fibras secretomotoras que ele leva são da corda do tímpano (facial).',
        'Pele: pálpebra inferior = infraorbital; região temporal à frente da orelha = auriculotemporal; ângulo da mandíbula = auricular magno (plexo cervical).'] },
      { m: ['completo','inerv'], t: 'Técnicas anestésicas na mandíbula (slides de 22/10)', i: [
        'Alveolar inferior convencional: boca bem aberta, operador do lado oposto, punção no triângulo retromolar 6 a 10 mm acima do plano oclusal; contato ósseo (20 a 25 mm), recuar 1 mm, aspirar, 1,0 a 1,5 mL. Não pega a vestibular dos molares.',
        'Lingual: no recuo da agulha do alveolar inferior (recuar 1 cm), 0,3 mL.',
        'Bucal: agulha curta na mucosa distal ao último molar inferior, 0,3 a 0,5 mL no vestíbulo.',
        'Gow-Gates: boca bem aberta, punção distal ao 2º molar superior na cúspide mesiopalatina, rumo ao colo do côndilo; 25 a 30 mm, 1,8 mL. Pega todo o nervo mandibular. Indicada quando a convencional falha.',
        'Vazirani-Akinosi: boca FECHADA, agulha longa paralela ao plano oclusal na altura do rebordo alveolar superior; 25 mm, 1,5 a 1,8 mL. Indicada no trismo.',
        'Complicações: falha = localização incorreta; parestesia = nervo lingual ou alveolar inferior; hematoma = lesão vascular; trismo = infiltração no pterigóideo; paralisia facial = injeção no nervo facial.'] },
      { m: ['completo','musc'], t: 'Músculos da mastigação e supra-hióideos', i: [
        'Quatro músculos da mastigação, todos inervados pelo nervo mandibular (V3), nenhum pelo facial.',
        'Elevadores: temporal, masseter e pterigóideo medial. Pterigóideo lateral: protrusão e abertura da boca.',
        'Tipoia (funda) pterigomassetérica: masseter por fora + pterigóideo medial por dentro do ramo.',
        'Masseter: arco zigomático → ângulo e ramo (face lateral). Temporal: fossa temporal → processo coronoide. Pterigóideo lateral: asa maior e processo pterigoide → fóvea pterigóidea.',
        'Palpáveis por fora: masseter e temporal.',
        'Digástrico: ajuda a abaixar e retrair a mandíbula. Milo-hióideo: soalho da boca. Genioglosso: protrusão da língua. Nervo milo-hióideo: milo-hióideo e ventre anterior do digástrico.'] },
      { m: ['completo','musc'], t: 'Mímica facial', i: [
        'Todos os músculos da mímica são inervados pelo nervo facial (VII).',
        'Orbicular da boca: esfíncter dos lábios. Zigomático maior: o do riso. Mentual: eleva o lábio inferior e enruga o queixo.',
        'Levantador do ângulo da boca: nasce na fossa canina.',
        'Bucinador: comprime a bochecha contra os dentes e mantém o alimento sobre as faces oclusais; é da mímica (nervo facial). O nervo bucal (V3) é só sensitivo.'] },
      { m: ['completo','musc'], t: 'Vascularização: carótida externa', i: [
        'A carótida comum se divide na altura da margem superior da cartilagem tireóidea. O vago acompanha a comum e a interna.',
        'A carótida externa penetra na parótida e, no colo da mandíbula, termina em maxilar e temporal superficial.',
        'Colaterais clássicos (6): tireóidea superior, lingual (2º ramo), facial (3º), faríngea ascendente, occipital e auricular posterior. Com os 2 terminais, 8 ramos.',
        'Facial: termina como artéria angular, no ângulo medial do olho.',
        'Maxilar: fossa infratemporal → fossa pterigopalatina (palatina descendente). Dá a alveolar inferior (milo-hióideo, mentual, incisivo), as alveolares superiores posteriores e a infraorbital (alveolares superiores anteriores dentro do canal).'] }
    ],
    q: [
    { id: "s01", sm1: true, tema: "Osteologia", ctx: "O viscerocrânio é constituído por 14 ossos, sendo o predomínio do seu crescimento em relação ao neurocrânio uma característica típica dos primatas.", p: "Qual dos seguintes ossos é o único osso com mobilidade do crânio, servindo de inserção para todos os músculos da mastigação?", o: ["Maxila", "Osso zigomático", "Mandíbula", "Osso esfenoide", "Osso temporal"], a: 2, w: "A mandíbula é o único osso móvel do crânio: articula-se com o temporal na ATM e recebe os músculos da mastigação.", f: "SM1 de Bases Morfológicas, 21/09/2026, Prof. Gustavo Holderbaum (questão original, conferida pela anatomia)", net: false },
    { id: "s02", sm1: true, tema: "Glândulas salivares", ctx: "As glândulas salivares maiores são órgãos exócrinos vitais para a manutenção da saúde da cavidade oral, sendo classificadas em parótida, submandibular e sublingual.", p: "Qual dessas glândulas, apesar de ser a segunda em tamanho, é responsável pela maior parte (60% a 65%) do volume salivar total?", o: ["Glândula parótida.", "Glândula sublingual.", "Glândulas salivares menores do palato.", "Glândula submandibular.", "Glândula tireóide"], a: 3, w: "A parótida é a maior, mas a submandibular produz a maior parte da saliva em repouso (60% a 65%).", f: "SM1 de Bases Morfológicas, 21/09/2026, Prof. Gustavo Holderbaum (questão original, conferida pela anatomia)", net: false },
    { id: "s03", sm1: true, tema: "Osteologia", ctx: "A mandíbula possui um canal interno por onde passam a artéria, as veias e os nervos alveolares inferiores, responsáveis por suprir os dentes e o periodonto mandibulares.", p: "Esse trajeto intraósseo se inicia e termina, respectivamente, em quais forames da mandíbula?", o: ["Forame infraorbital e forame incisivo.", "Forame zigomático-facial e forame mentual.", "Forame cego e forame espinhoso.", "Forame mandibular e forame mentual.", "Forame jugular e forame magno."], a: 3, w: "O canal mandibular começa no forame mandibular, na face medial do ramo, e termina no forame mentual, na face externa do corpo.", f: "SM1 de Bases Morfológicas, 21/09/2026, Prof. Gustavo Holderbaum (questão original, conferida pela anatomia)", net: false },
    { id: "s04", sm1: true, tema: "Osteologia", ctx: "O palato duro é uma estrutura anatômica que forma o teto da cavidade oral e o assoalho da cavidade nasal. Segundo a osteologia do viscerocrânio, ele é formado pelas lâminas horizontais de um par de ossos articuladas com os processos palatinos de outro par de ossos.", p: "Quais são esses ossos?", o: ["Osso nasal e osso vômer", "Mandíbula e osso hióide", "Esfenoide e osso palatino", "Osso zigomático e maxila", "Maxila e osso palatino"], a: 4, w: "Processos palatinos da maxila (parte anterior) + lâminas horizontais do osso palatino (parte posterior).", f: "SM1 de Bases Morfológicas, 21/09/2026, Prof. Gustavo Holderbaum (questão original, conferida pela anatomia)", net: false },
    { id: "s05", sm1: true, tema: "Osteologia", ctx: "O osso occipital compõe o neurocrânio e possui estruturas fundamentais para a articulação da cabeça com a coluna cervical. Localizadas uma de cada lado do forame magno, na face externa do osso, existem superfícies articulares de formato convexo que permitem a execução dos movimentos de flexão e extensão da cabeça.", p: "Como são denominadas essas estruturas?", o: ["Protuberâncias occipitais externas", "Processos mastoides", "Linhas nucais superiores", "Côndilos occipitais", "Processos estiloides"], a: 3, w: "Os côndilos occipitais se articulam com o atlas (articulação atlantoccipital), permitindo flexão e extensão da cabeça.", f: "SM1 de Bases Morfológicas, 21/09/2026, Prof. Gustavo Holderbaum (questão original, conferida pela anatomia)", net: false },
    { id: "s06", sm1: true, tema: "Osteologia", ctx: "A calvária (ou calota craniana) é formada por vários ossos planos que, no início da vida, são articulados por tecido fibroso (suturas) para permitir o crescimento do encéfalo. Com o avanço da idade, a maioria dessas suturas sofre um processo de ossificação natural, fundindo os ossos adjacentes.", p: "Como é denominado o estado ou processo de união óssea completa que substitui essa articulação fibrosa original no crânio?", o: ["Sinostose", "Fontículo", "Diploe", "Pterigóide", "Lâmina Cribiforme"], a: 0, w: "Sinostose é a fusão óssea completa de uma sutura.", f: "SM1 de Bases Morfológicas, 21/09/2026, Prof. Gustavo Holderbaum (questão original, conferida pela anatomia)", net: false },
    { id: "s07", sm1: true, tema: "Osteologia", ctx: "O arco zigomático é uma importante proeminência óssea lateral da face. De acordo com a anatomia do neurocrânio e do viscerocrânio, o arco zigomático é formado pela união de dois processos pertencentes a ossos distintos.", p: "Quais são esses processos e seus respectivos ossos?", o: ["Processo frontal do osso zigomático e processo zigomático do osso frontal.", "Processo temporal do osso zigomático e processo zigomático do osso temporal.", "Processo maxilar do osso zigomático e processo zigomático da maxila.", "Processo mastoide do osso temporal e processo estiloide.", "Processo alveolar da maxila e processo condilar da mandíbula."], a: 1, w: "O arco zigomático = processo temporal do zigomático + processo zigomático do temporal.", f: "SM1 de Bases Morfológicas, 21/09/2026, Prof. Gustavo Holderbaum (questão original, conferida pela anatomia)", net: false },
    { id: "s08", sm1: true, tema: "Osteologia", ctx: "O osso esfenoide, frequentemente descrito como tendo formato de borboleta, é considerado a \"pedra angular\" da base do crânio, articulando-se com todos os outros ossos cranianos. Em sua asa maior, existem forames fundamentais para a passagem de estruturas vasculonervosas.", p: "Qual forame, localizado na asa maior do osso esfenoide, dá passagem estritamente ao nervo maxilar (segunda divisão do nervo trigêmeo)?", o: ["Forame oval", "Forame espinhoso", "Forame redondo", "Forame lácero (rasgado)", "Fissura orbital superior"], a: 2, w: "O nervo maxilar (V2) sai pelo forame redondo. O oval é do V3 e o espinhoso, da artéria meníngea média.", f: "SM1 de Bases Morfológicas, 21/09/2026, Prof. Gustavo Holderbaum (questão original, conferida pela anatomia)", net: false },
    { id: "s09", sm1: true, tema: "Osteologia", ctx: "O septo nasal é a estrutura responsável por dividir a cavidade nasal em metades direita e esquerda. Ele possui uma porção cartilaginosa anterior e uma porção óssea posterior, na qual interagem ossos do neurocrânio e do viscerocrânio.", p: "Quais são os dois ossos (ou partes de ossos) que compõem estruturalmente a parte óssea do septo nasal?", o: ["Lâmina crivosa do etmoide e concha nasal inferior", "Lâmina perpendicular do osso palatino e osso nasal", "Processo palatino da maxila e lâmina horizontal do palatino", "Lâmina perpendicular do osso etmoide e osso vômer", "Osso vômer e lâmina medial do processo pterigoide do esfenoide"], a: 3, w: "A parte óssea do septo nasal = lâmina perpendicular do etmoide + vômer.", f: "SM1 de Bases Morfológicas, 21/09/2026, Prof. Gustavo Holderbaum (questão original, conferida pela anatomia)", net: false },
    { id: "s10", sm1: true, tema: "Dentina", ctx: "A dentina constitui a maior parte da estrutura dentária e pode ser classificada de acordo com sua localização anatômica ou o momento de sua formação.", p: "Assinale a alternativa que descreve corretamente a dentina secundária:", o: ["É a primeira dentina formada, localizada na camada mais externa (do manto).", "É altamente mineralizada e encontra-se exclusivamente no interior da parede dos túbulos dentinários.", "É formada de maneira muito rápida, antes que se complete o forame apical.", "É formada em resposta a uma lesão, apresentando um padrão irregular de túbulos.", "É formada depois que se completa o forame apical, de forma mais lenta, e é menos mineralizada que a dentina primária."], a: 4, w: "Dentina secundária: formada após o fechamento do forame apical, mais lenta. A da lesão é a terciária; a do manto é a primeira formada.", f: "SM1 de Bases Morfológicas, 21/09/2026, Prof. Gustavo Holderbaum (questão original, conferida pela anatomia)", net: false },
      { id: 'b01', tema: 'Terminologia', ctx: 'A descrição anatômica usa uma posição de referência universal, independentemente de o paciente estar deitado na cadeira odontológica.', p: 'Nessa posição anatômica, como ficam as palmas das mãos?', o: ['Voltadas para trás (pronação)', 'Voltadas para a frente (supinação)', 'Voltadas para o tronco', 'Cruzadas sobre o tórax', 'Voltadas para cima'], a: 1, w: 'Na posição anatômica os membros superiores ficam ao longo do tronco com as palmas para a frente, em supinação.', f: FONTE_AULA1 },
      { id: 'b02', tema: 'Terminologia', ctx: 'Para interpretar uma tomografia Cone Beam é preciso dominar as vistas coronais, sagitais e axiais, que correspondem aos planos de secção.', p: 'O plano transversal (axial) divide o corpo em quais porções?', o: ['Direita e esquerda', 'Anterior e posterior', 'Superior (cefálica) e inferior (caudal)', 'Medial e lateral', 'Proximal e distal'], a: 2, w: 'O transversal tem eixo horizontal e separa a porção cefálica da caudal. Direita e esquerda é o sagital; anterior e posterior, o coronal.', f: FONTE_AULA1 },
      { id: 'b03', tema: 'Terminologia', ctx: 'Nos arcos dentários, a linha média que separa os incisivos centrais funciona como o plano sagital.', p: 'Como se chama a face do dente voltada para o fundo do arco, afastando-se da linha média?', o: ['Mesial', 'Vestibular', 'Lingual', 'Distal', 'Oclusal'], a: 3, w: 'Distal é a face que se afasta da linha média; mesial é a que se volta para ela.', f: FONTE_AULA1 },
      { id: 'b04', tema: 'Terminologia', ctx: 'Os termos proximal e distal são usados para descrever membros, nervos e vasos.', p: 'O que indica o termo proximal?', o: ['Afastamento da raiz (origem) da estrutura', 'Proximidade com a raiz (origem) da estrutura', 'Proximidade com o plano sagital mediano', 'Direção ao topo da cabeça', 'Face do dente voltada para a língua'], a: 1, w: 'Proximal indica proximidade com a origem; distal, afastamento. Perto do plano sagital mediano é medial.', f: FONTE_AULA1 },
      { id: 'b05', tema: 'Embriologia', ctx: 'O marco zero do desenvolvimento humano é a fecundação, que forma o zigoto, primeira célula totipotente.', p: 'Onde a fecundação geralmente ocorre?', o: ['No endométrio do útero', 'No terço distal da tuba uterina', 'No ovário', 'No colo do útero', 'Na cavidade amniótica'], a: 1, w: 'A aula traz a fecundação geralmente no terço distal da tuba uterina; o blastocisto só depois se implanta no útero.', f: FONTE_AULA1 },
      { id: 'b06', tema: 'Embriologia', ctx: 'Logo após a fecundação começa a clivagem rápida, com multiplicação celular sem aumento do volume total.', p: 'Em que dia se forma a mórula, massa celular sólida semelhante a uma amora?', o: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 7'], a: 3, w: 'Dia 1 zigoto, dia 2 blastômeros, dia 3 multiplicação rápida, dia 4 mórula.', f: FONTE_AULA1 },
      { id: 'b07', tema: 'Embriologia', ctx: 'Quando fluidos penetram na mórula, forma-se o blastocisto, com duas partes de destinos diferentes.', p: 'Qual parte do blastocisto é responsável pela implantação e origina anexos embrionários como a placenta?', o: ['Embrioblasto', 'Trofoblasto', 'Epiblasto', 'Hipoblasto', 'Linha primitiva'], a: 1, w: 'O trofoblasto é a camada externa: faz a implantação e origina os anexos. O embrioblasto origina o embrião.', f: FONTE_AULA1 },
      { id: 'b08', tema: 'Embriologia', ctx: 'Na segunda semana, a massa celular interna se reorganiza, achata-se e forma o disco bilaminar.', p: 'Como se chama a camada superior (dorsal) desse disco, constituída por células cilíndricas?', o: ['Hipoblasto', 'Trofoblasto', 'Epiblasto', 'Endoderma', 'Mesoderma'], a: 2, w: 'Epiblasto é a camada dorsal de células cilíndricas; o hipoblasto é a ventral, de células cuboides pequenas.', f: FONTE_AULA1 },
      { id: 'b09', tema: 'Embriologia', ctx: 'A gastrulação, na terceira semana, começa com um espessamento linear na superfície do epiblasto que define a simetria bilateral e o eixo crânio-caudal.', p: 'Como se chama essa estrutura?', o: ['Tubo neural', 'Crista neural', 'Linha primitiva', 'Notocorda', 'Saco vitelínico'], a: 2, w: 'A linha primitiva funciona como sulco de migração: por ela as células do epiblasto formam os três folhetos.', f: FONTE_AULA1 },
      { id: 'b10', tema: 'Folhetos', ctx: 'Cada folheto germinativo tem destinos teciduais específicos.', p: 'Qual folheto origina o epitélio do trato gastrointestinal, o parênquima do fígado e do pâncreas e o tecido funcional da tireoide?', o: ['Ectoderma', 'Mesoderma', 'Endoderma', 'Crista neural', 'Trofoblasto'], a: 2, w: 'Esses são derivados do endoderma, o folheto mais interno.', f: FONTE_AULA1 },
      { id: 'b11', tema: 'Folhetos', ctx: 'O esmalte dental é o tecido mais duro do corpo humano.', p: 'Segundo a aula, qual é o único folheto germinativo capaz de formar o órgão do esmalte?', o: ['Mesoderma', 'Endoderma', 'Ectomesênquima', 'Ectoderma', 'Hipoblasto'], a: 3, w: 'O ectoderma forma o órgão do esmalte. A dentina vem do ectomesênquima (crista neural).', f: FONTE_AULA1 },
      { id: 'b12', tema: 'Folhetos', ctx: 'No tronco e nos membros, os tecidos de sustentação vêm do mesoderma, mas a face foge dessa regra.', p: 'Grande parte dos ossos da face, a dentina, a polpa, o cemento e o ligamento periodontal derivam de qual tecido embrionário?', o: ['Mesoderma paraxial', 'Endoderma', 'Ectomesênquima, derivado da crista neural', 'Trofoblasto', 'Epiderme'], a: 2, w: 'As células da crista neural migram para a face e formam o ectomesênquima, origem desses tecidos.', f: FONTE_AULA1 },
      { id: 'b13', tema: 'Folhetos', ctx: 'O mesoderma é a matriz dos sistemas de sustentação, contração e transporte.', p: 'Na odontologia, segundo o resumo da aula, o mesoderma origina:', o: ['O esmalte dental', 'A musculatura da mastigação e da mímica facial', 'A dentina e a polpa', 'O revestimento do estomodeu', 'Os melanócitos'], a: 1, w: 'A musculatura da mastigação e da mímica e os vasos da polpa vêm do mesoderma. Esmalte e estomodeu são ectoderma; dentina e polpa, ectomesênquima.', f: FONTE_AULA1 },
      { id: 'b14', tema: 'Osteologia', ctx: 'A asa maior do esfenoide tem forames para a passagem de estruturas vasculonervosas.', p: 'Por qual forame o nervo mandibular, terceira divisão do trigêmeo, sai do crânio?', o: ['Forame redondo', 'Forame espinhoso', 'Forame oval', 'Forame jugular', 'Forame magno'], a: 2, w: 'O nervo mandibular sai pelo forame oval. Pelo forame redondo sai o nervo maxilar.', f: FONTE_SM1 + '; ' + WIKI_MAN },
      { id: 'b15', tema: 'Osteologia', ctx: 'A mandíbula é o único osso móvel do crânio e recebe a inserção dos músculos da mastigação.', p: 'Com qual osso a mandíbula se articula na articulação temporomandibular?', o: ['Maxila', 'Osso temporal', 'Esfenoide', 'Osso zigomático', 'Occipital'], a: 1, w: 'A ATM une a cabeça da mandíbula ao osso temporal, como o próprio nome diz.', f: FONTE_SM1 },
      { id: 'b16', sm1par: true, tema: 'Osteologia', ctx: 'O canal mandibular conduz o feixe vasculonervoso alveolar inferior e termina na face externa do corpo da mandíbula.', p: 'Qual nervo sai pelo forame mentual?', o: ['Nervo lingual', 'Nervo bucal', 'Nervo mentual', 'Nervo milo-hióideo', 'Nervo auriculotemporal'], a: 2, w: 'O canal começa no forame mandibular e termina no forame mentual, por onde sai o nervo mentual.', f: FONTE_SM1 },
      { id: 'b17', sm1par: true, tema: 'Osteologia', ctx: 'O palato duro forma o teto da cavidade oral e o assoalho da cavidade nasal.', p: 'Os processos palatinos que formam a parte anterior do palato duro pertencem a qual osso?', o: ['Palatino', 'Maxila', 'Vômer', 'Esfenoide', 'Etmoide'], a: 1, w: 'Processos palatinos da maxila na frente e lâminas horizontais do palatino atrás.', f: FONTE_SM1 },
      { id: 'b18', sm1par: true, tema: 'Osteologia', ctx: 'O septo nasal tem uma porção cartilaginosa anterior e uma porção óssea posterior, formada por dois elementos.', p: 'A lâmina perpendicular que forma parte do septo ósseo pertence a qual osso?', o: ['Palatino', 'Esfenoide', 'Etmoide', 'Nasal', 'Vômer'], a: 2, w: 'O septo ósseo é a lâmina perpendicular do etmoide mais o vômer; o vômer é um osso próprio, sem lâmina perpendicular.', f: FONTE_SM1 },
      { id: 'b19', sm1par: true, tema: 'Osteologia', ctx: 'O arco zigomático é uma proeminência lateral da face formada pela união de dois processos.', p: 'No arco zigomático, o processo temporal do osso zigomático se une ao processo zigomático de qual osso?', o: ['Maxila', 'Frontal', 'Temporal', 'Esfenoide', 'Occipital'], a: 2, w: 'Processo temporal do zigomático + processo zigomático do temporal formam o arco.', f: FONTE_SM1 },
      { id: 'b20', sm1par: true, tema: 'Osteologia', ctx: 'As suturas da calvária permitem o crescimento do encéfalo e, com a idade, se fundem.', p: 'No bebê, as áreas membranosas amplas onde várias suturas se encontram, ainda sem ossificar, são chamadas de:', o: ['Sinostoses', 'Fontículos (fontanelas)', 'Díploe', 'Côndilos', 'Forames'], a: 1, w: 'Fontículos são as áreas membranosas ainda não ossificadas. Sinostose é a fusão óssea completa da sutura.', f: FONTE_SM1 },
      { id: 'b21', sm1par: true, tema: 'Osteologia', ctx: 'O osso occipital compõe o neurocrânio e tem, de cada lado do forame magno, os côndilos occipitais.', p: 'Com qual estrutura os côndilos occipitais se articulam?', o: ['Com a mandíbula', 'Com a primeira vértebra cervical (atlas)', 'Com o osso temporal', 'Com o esfenoide', 'Com o osso hioide'], a: 1, w: 'Os côndilos occipitais articulam com o atlas e permitem a flexão e a extensão da cabeça.', f: FONTE_SM1 },
      { id: 'b22', tema: 'Osteologia', ctx: 'O nervo maxilar, segunda divisão do trigêmeo, sai do crânio pelo forame redondo.', p: 'A qual fossa ele chega depois do forame redondo, antes de entrar no canal infraorbital?', o: ['Fossa temporal', 'Fossa pterigopalatina', 'Fossa mandibular', 'Fossa hipofisária', 'Fossa canina'], a: 1, w: 'O trajeto é fossa média do crânio, forame redondo, fossa pterigopalatina e canal infraorbital.', f: FONTE_ED + '; ' + WIKI_MAX, net: true },
      { id: 'b23', tema: 'Glândulas salivares', ctx: 'As glândulas salivares maiores são a parótida, a submandibular e a sublingual.', p: 'Qual delas é a maior em tamanho?', o: ['Submandibular', 'Sublingual', 'Parótida', 'Glândulas menores do palato', 'Glândulas labiais'], a: 2, w: 'A parótida é a maior. A submandibular é a segunda em tamanho, mas faz a maior parte do volume salivar.', f: FONTE_SM1 },
      { id: 'b24', tema: 'Glândulas salivares', ctx: 'A saliva da parótida chega à boca por um ducto que se abre no vestíbulo da cavidade oral.', p: 'Na altura de qual dente o ducto parotídeo se abre?', o: ['Primeiro pré-molar inferior', 'Incisivo central superior', 'Segundo molar superior', 'Terceiro molar inferior', 'Canino superior'], a: 2, w: 'O ducto parotídeo se abre no vestíbulo, na altura do colo do 2º molar superior.', f: WIKI_PAR, net: true },
      { id: 'b25', sm1par: true, tema: 'Dentina', ctx: 'A dentina pode ser classificada pelo momento e pelo motivo da sua formação.', p: 'Como se chama a dentina formada em resposta a uma lesão, como cárie ou desgaste, com padrão irregular de túbulos?', o: ['Dentina primária', 'Dentina secundária', 'Dentina terciária', 'Dentina do manto', 'Dentina peritubular'], a: 2, w: 'A terciária (reacionária ou reparadora) responde à lesão. A secundária se forma depois que o forame apical se completa.', f: FONTE_SM1 },
      { id: 'b26', tema: 'Inervação', ctx: 'Numa cirurgia na gengiva vestibular dos dentes anteriores e pré-molares superiores, é preciso anestesiar o nervo que inerva essa gengiva.', p: 'Qual nervo inerva a gengiva vestibular de incisivos, caninos e pré-molares superiores?', o: ['Nervo nasopalatino', 'Nervo palatino maior', 'Nervo infraorbital', 'Nervo bucal', 'Nervo lingual'], a: 2, w: 'O estudo dirigido lembra: a gengiva vestibular de incisivos, caninos e pré-molares superiores é inervada pelo infraorbital.', f: FONTE_ED },
      { id: 'b27', tema: 'Inervação', ctx: 'Uma punção no forame palatino maior em que a agulha percorre todo o canal palatino maior e o anestésico é depositado no alto da fossa pterigopalatina.', p: 'Qual nervo será anestesiado nessa técnica?', o: ['Somente o nervo palatino maior', 'O nervo maxilar (bloqueio troncular)', 'O nervo alveolar inferior', 'Somente o nervo nasopalatino', 'Somente o nervo infraorbital'], a: 1, w: 'No alto da fossa pterigopalatina está o tronco do nervo maxilar: é uma das técnicas de anestesia troncular dele.', f: FONTE_ED },
      { id: 'b28', tema: 'Inervação', ctx: 'O toro palatino mediano fica preferencialmente no centro do palato duro.', p: 'Para removê-lo cirurgicamente, quais nervos devem ser bloqueados antes?', o: ['Infraorbital e alveolar superior anterior', 'Nasopalatinos e palatinos maiores', 'Alveolares inferiores e linguais', 'Bucal e mentual', 'Somente o nasopalatino'], a: 1, w: 'O centro do palato recebe os nasopalatinos na frente e os palatinos maiores atrás: os dois precisam ser bloqueados.', f: FONTE_ED },
      { id: 'b29', tema: 'Inervação', ctx: 'Numa apicectomia da raiz vestibular do primeiro pré-molar superior, o nervo infraorbital é anestesiado para a mucosa e a gengiva vestibular.', p: 'Qual é o nervo do próprio dente, que também precisa ser anestesiado?', o: ['Alveolar superior posterior', 'Alveolar superior médio', 'Alveolar superior anterior', 'Nasopalatino', 'Palatino maior'], a: 1, w: 'Os pré-molares superiores são inervados pelo alveolar superior médio.', f: FONTE_ED },
      { id: 'b30', tema: 'Inervação', ctx: 'O nervo alveolar superior médio normalmente é ramo do infraorbital, mas apresenta variação anatômica importante.', p: 'Segundo o estudo dirigido, em cerca de quantos por cento dos casos ele está ausente?', o: ['5 %', '10 %', '30 %', '50 %', '80 %'], a: 2, w: 'O estudo dirigido traz: ausente em 30 % dos casos e ramo direto do nervo maxilar em 10 %.', f: FONTE_ED },
      { id: 'b31', tema: 'Inervação', ctx: 'Os nervos alveolares superiores são ramos do nervo maxilar e inervam os dentes superiores com seu periodonto e gengiva.', p: 'Qual ramo inerva os molares superiores?', o: ['Alveolar superior anterior', 'Alveolar superior médio', 'Infraorbital', 'Alveolar superior posterior', 'Nasopalatino'], a: 3, w: 'Posterior: molares. Médio: pré-molares e raiz mesiovestibular do 1º molar. Anterior: incisivos e caninos.', f: WIKI_MAX, net: true },
      { id: 'b32', tema: 'Inervação', ctx: 'O nervo nasopalatino é ramo do nervo maxilar e inerva parte do palato duro.', p: 'Qual região do palato ele inerva?', o: ['Do canino aos molares', 'A região de incisivos e caninos', 'A gengiva vestibular dos molares', 'O lábio superior', 'O palato mole'], a: 1, w: 'Nasopalatino: palato na região de incisivos e caninos. Palatino maior: do canino aos molares.', f: WIKI_MAX, net: true },
      { id: 'b33', tema: 'Inervação', ctx: 'O nervo palatino maior chega ao palato duro pelo forame palatino maior.', p: 'Qual região ele inerva?', o: ['O palato duro, do canino aos molares', 'O palato duro, na região de incisivos e caninos', 'A gengiva vestibular dos incisivos', 'A língua', 'O lábio inferior'], a: 0, w: 'O palatino maior cobre o palato duro do canino aos molares; a região anterior é do nasopalatino.', f: WIKI_MAX, net: true },
      { id: 'b34', tema: 'Inervação', ctx: 'O nervo massetérico, os nervos temporais profundos e os ramos para os pterigóideos são motores.', p: 'De qual nervo vêm esses ramos para os músculos da mastigação?', o: ['Nervo facial (VII)', 'Nervo mandibular (V3)', 'Nervo maxilar (V2)', 'Nervo glossofaríngeo (IX)', 'Nervo hipoglosso (XII)'], a: 1, w: 'Todos são ramos do nervo mandibular. O facial é o nervo da mímica, não da mastigação.', f: WIKI_MAN, net: true },
      { id: 'b35', tema: 'Inervação', ctx: 'O nervo bucal é um ramo sensitivo da divisão anterior do nervo mandibular.', p: 'Que região ele inerva?', o: ['A bochecha', 'O palato duro', 'A polpa dos incisivos inferiores', 'O lábio superior', 'A pálpebra inferior'], a: 0, w: 'O nervo bucal é sensitivo para a bochecha. Lábio superior e pálpebra inferior são do infraorbital.', f: WIKI_MAN, net: true },
      { id: 'b36', tema: 'Inervação', ctx: 'Na divisão posterior do nervo mandibular há um ramo que entra no forame mandibular e percorre o canal mandibular.', p: 'Qual é esse ramo, que é ao mesmo tempo motor e sensitivo?', o: ['Nervo lingual', 'Nervo bucal', 'Nervo alveolar inferior', 'Nervo auriculotemporal', 'Nervo massetérico'], a: 2, w: 'O alveolar inferior é motor e sensitivo e percorre o canal mandibular. Lingual, bucal e auriculotemporal são sensitivos.', f: WIKI_MAN, net: true },
      { id: 'b37', tema: 'Inervação', ctx: 'O nervo infraorbital emite ramos palpebrais inferiores, nasais e labiais superiores.', p: 'Os ramos labiais superiores do infraorbital inervam qual estrutura?', o: ['O lábio superior', 'O lábio inferior', 'O palato duro', 'A língua', 'O mento'], a: 0, w: 'Os labiais superiores vão para o lábio superior. Lábio inferior e mento são do nervo mentual.', f: WIKI_MAX, net: true },
      { id: 'b38', tema: 'Histologia', ctx: 'Na aula de 26/10 a turma descreveu uma lâmina de músculo estriado esquelético.', p: 'Como são as células desse tecido?', o: ['Longas, cilíndricas e multinucleadas', 'Curtas, fusiformes e com um núcleo central', 'Ramificadas e unidas por discos intercalares', 'Achatadas, unidas, com superfície livre', 'Estreladas, com prolongamentos'], a: 0, w: 'Cada fibra do músculo estriado esquelético é uma célula longa, cilíndrica e com vários núcleos.', f: FONTE_HIST, net: true },
      { id: 'b39', tema: 'Histologia', ctx: 'Uma forma rápida de diferenciar o músculo estriado esquelético do músculo liso na lâmina é olhar os núcleos.', p: 'Onde ficam os núcleos das fibras do músculo estriado esquelético?', o: ['No centro da célula, um por célula', 'Na periferia, junto à membrana, vários por fibra', 'Soltos na matriz extracelular', 'Agrupados nos discos intercalares', 'A fibra não tem núcleo'], a: 1, w: 'São periféricos e numerosos. No músculo liso o núcleo é único e central.', f: FONTE_HIST, net: true },
      { id: 'b40', tema: 'Histologia', ctx: 'O músculo estriado esquelético é organizado por envoltórios de tecido conjuntivo em três níveis.', p: 'Qual envoltório envolve cada fibra muscular individualmente?', o: ['Epimísio', 'Perimísio', 'Endomísio', 'Periósteo', 'Pericôndrio'], a: 2, w: 'Endomísio envolve cada fibra, perimísio cada fascículo e epimísio o músculo inteiro.', f: FONTE_HIST, net: true },
      { id: 'b41', tema: 'Histologia', ctx: 'A lâmina de músculo estriado esquelético foi corada em hematoxilina e eosina (HE).', p: 'Como aparecem as fibras e os núcleos nessa coloração?', o: ['Fibras rosas e núcleos azulados ou roxos', 'Fibras azuis e núcleos rosas', 'Tudo rosa, sem diferença', 'Tudo azul, sem diferença', 'Fibras verdes e núcleos pretos'], a: 0, w: 'A eosina cora o citoplasma de rosa e a hematoxilina cora os núcleos de azul ou roxo.', f: FONTE_HIST, net: true },
      /* ===== 09/11/2026: ampliação para o SM2 ===== */
      { id: 'b42', tema: 'Osteologia', ctx: 'O crânio se divide em neurocrânio, que envolve e protege o encéfalo, e viscerocrânio, que forma o esqueleto da face.', p: 'Quantos ossos compõem o neurocrânio?', o: ['6', '7', '8', '10', '14'], a: 2, w: 'Frontal, occipital, esfenoide, etmoide, dois parietais e dois temporais: 8 ossos.', f: FONTE_JONAS + '; ' + NET_CRANIO, net: true },
      { id: 'b43', tema: 'Osteologia', ctx: 'Entre os 8 ossos do neurocrânio há ossos ímpares, na linha mediana, e ossos pares, um de cada lado.', p: 'Qual destes ossos do neurocrânio é PAR?', o: ['Frontal', 'Occipital', 'Esfenoide', 'Temporal', 'Etmoide'], a: 3, w: 'Parietal e temporal são pares. Frontal, occipital, esfenoide e etmoide são ímpares.', f: NET_CRANIO, net: true },
      { id: 'b44', sm1par: true, tema: 'Osteologia', ctx: 'Na asa maior do esfenoide ficam, de frente para trás, o forame redondo, o forame oval e o forame espinhoso.', p: 'Qual estrutura passa pelo forame redondo?', o: ['Nervo mandibular (V3)', 'Artéria meníngea média', 'Nervo óptico', 'Nervo facial', 'Nervo maxilar (V2)'], a: 4, w: 'Redondo: nervo maxilar (V2). Oval: nervo mandibular (V3). Espinhoso: artéria meníngea média.', f: FONTE_SM1 + '; ' + FONTE_JONAS },
      { id: 'b45', tema: 'Osteologia', ctx: 'O forame espinhoso fica logo atrás do forame oval, na asa maior do esfenoide.', p: 'Qual estrutura atravessa o forame espinhoso?', o: ['Artéria meníngea média', 'Nervo maxilar', 'Nervo mandibular', 'Artéria carótida interna', 'Nervo hipoglosso'], a: 0, w: 'Pelo forame espinhoso passa a artéria meníngea média, ramo da artéria maxilar.', f: NET_CRANIO, net: true },
      { id: 'b46', tema: 'Osteologia', ctx: 'O forame magno é a maior abertura da base do crânio e dá passagem à continuação do tronco encefálico com a medula espinal.', p: 'Em qual osso fica o forame magno?', o: ['Esfenoide', 'Occipital', 'Temporal', 'Parietal', 'Etmoide'], a: 1, w: 'Fica no occipital, com os côndilos occipitais de cada lado.', f: NET_CRANIO, net: true },
      { id: 'b47', tema: 'Osteologia', ctx: 'As suturas da calvária recebem o nome conforme a posição e os ossos que unem.', p: 'Qual sutura une o osso frontal aos dois parietais?', o: ['Sagital', 'Lambdóidea', 'Coronal', 'Escamosa', 'Frontonasal'], a: 2, w: 'Coronal: frontal e parietais. Sagital: parietal com parietal. Lambdóidea: parietais e occipital.', f: NET_CRANIO, net: true },
      { id: 'b48', tema: 'Osteologia', ctx: 'A sutura sagital percorre o topo da calvária, na linha mediana, de frente para trás.', p: 'Quais ossos ela une?', o: ['Frontal e parietais', 'Parietais e occipital', 'Temporal e parietal', 'Os dois parietais', 'Frontal e esfenoide'], a: 3, w: 'A sagital une os dois parietais, um ao outro.', f: NET_CRANIO, net: true },
      { id: 'b49', tema: 'Osteologia', ctx: 'A sutura lambdóidea tem a forma da letra grega lambda e fica na parte posterior da calvária.', p: 'Quais ossos ela une?', o: ['Os dois parietais', 'Frontal e parietais', 'Temporal e esfenoide', 'Maxila e zigomático', 'Parietais e occipital'], a: 4, w: 'A lambdóidea une os parietais ao occipital.', f: NET_CRANIO, net: true },
      { id: 'b50', sm1par: true, tema: 'Osteologia', ctx: 'Os ossos do crânio são unidos por suturas e praticamente não se movem, com uma exceção, que recebe os músculos da mastigação.', p: 'Qual é o único osso móvel do crânio?', o: ['Mandíbula', 'Maxila', 'Zigomático', 'Etmoide', 'Hioide'], a: 0, w: 'A mandíbula é o único osso móvel do crânio. O hioide é móvel, mas fica no pescoço e não faz parte do crânio.', f: FONTE_SM1 + '; ' + FONTE_JONAS },
      { id: 'b51', sm1par: true, tema: 'Osteologia', ctx: 'Na face medial do ramo da mandíbula há uma abertura protegida por uma pequena lâmina óssea, a língula.', p: 'Como se chama essa abertura, onde começa o canal mandibular?', o: ['Forame mentual', 'Forame mandibular', 'Forame incisivo', 'Forame oval', 'Forame palatino maior'], a: 1, w: 'O canal mandibular começa no forame mandibular (face medial do ramo) e termina no forame mentual.', f: FONTE_SM1 },
      { id: 'b52', tema: 'Osteologia', ctx: 'O ramo da mandíbula termina em cima em dois processos separados pela incisura da mandíbula: o condilar, atrás, e o coronoide, na frente.', p: 'Qual músculo se insere no processo coronoide?', o: ['Masseter', 'Pterigóideo lateral', 'Temporal', 'Digástrico', 'Bucinador'], a: 2, w: 'O temporal se insere no processo coronoide (face medial e bordas).', f: FONTE_ED_MUSC },
      { id: 'b53', tema: 'Osteologia', ctx: 'No colo da mandíbula, logo abaixo da cabeça (côndilo), existe uma pequena depressão chamada fóvea pterigóidea.', p: 'Qual músculo se insere nela?', o: ['Pterigóideo medial', 'Masseter', 'Temporal', 'Pterigóideo lateral', 'Milo-hióideo'], a: 3, w: 'A fóvea pterigóidea recebe o pterigóideo lateral. O pterigóideo medial nasce na FOSSA pterigóidea do esfenoide e se insere no ângulo.', f: FONTE_ED_MUSC },
      { id: 'b54', tema: 'Osteologia', ctx: 'Na articulação temporomandibular, a cabeça da mandíbula se aloja numa depressão da base do crânio.', p: 'Em qual osso fica a fossa mandibular?', o: ['Esfenoide', 'Zigomático', 'Occipital', 'Maxila', 'Temporal'], a: 4, w: 'A fossa mandibular é do osso temporal, por isso a articulação se chama temporomandibular.', f: FONTE_SM1 + '; ' + NET_CRANIO, net: true },
      { id: 'b55', tema: 'Osteologia', ctx: 'O teto da cavidade nasal tem uma lâmina cheia de pequenos furos por onde passam os filetes do nervo olfatório.', p: 'Essa lâmina cribriforme pertence a qual osso?', o: ['Etmoide', 'Esfenoide', 'Frontal', 'Vômer', 'Nasal'], a: 0, w: 'A lâmina cribriforme é do etmoide, o mesmo osso que dá a lâmina perpendicular do septo nasal.', f: NET_CRANIO, net: true },
      { id: 'b56', tema: 'Osteologia', ctx: 'Na parede lateral da cavidade nasal há três conchas nasais: superior, média e inferior.', p: 'Qual delas é um osso independente?', o: ['Concha nasal superior', 'Concha nasal inferior', 'Concha nasal média', 'Todas pertencem ao etmoide', 'Todas pertencem à maxila'], a: 1, w: 'As conchas superior e média são partes do etmoide; a concha nasal inferior é um osso próprio.', f: NET_CRANIO, net: true },
      { id: 'b57', tema: 'Osteologia', ctx: 'No corpo do esfenoide há uma depressão em forma de sela que aloja a hipófise.', p: 'Como se chama essa depressão?', o: ['Fossa pterigóidea', 'Fossa mandibular', 'Sela turca (fossa hipofisária)', 'Fossa canina', 'Fossa temporal'], a: 2, w: 'A sela turca, com a fossa hipofisária, fica no corpo do esfenoide.', f: NET_CRANIO, net: true },
      { id: 'b58', tema: 'Osteologia', ctx: 'Atrás do meato acústico externo há uma saliência que se palpa atrás da orelha e onde se insere o esternocleidomastóideo.', p: 'Esse processo mastoide pertence a qual osso?', o: ['Occipital', 'Parietal', 'Esfenoide', 'Temporal', 'Zigomático'], a: 3, w: 'O processo mastoide é do temporal, assim como o processo estiloide e a fossa mandibular.', f: NET_CRANIO, net: true },
      { id: 'b59', tema: 'Osteologia', ctx: 'Abaixo da margem infraorbital sai o feixe vasculonervoso infraorbital, que inerva a pálpebra inferior, o nariz e o lábio superior.', p: 'Em qual osso fica o forame infraorbital?', o: ['Zigomático', 'Frontal', 'Nasal', 'Palatino', 'Maxila'], a: 4, w: 'O forame infraorbital fica na face anterior do corpo da maxila.', f: FONTE_ED14 },
      { id: 'b60', tema: 'Inervação', ctx: 'Na linha mediana do palato duro, logo atrás dos incisivos centrais superiores, existe o forame incisivo.', p: 'Qual nervo chega ao palato por esse forame?', o: ['Nervo nasopalatino', 'Nervo palatino maior', 'Nervo infraorbital', 'Nervo alveolar superior anterior', 'Nervo lingual'], a: 0, w: 'O nasopalatino sai pelo forame incisivo e inerva o palato na região de incisivos e caninos. O palatino maior sai pelo forame palatino maior, lá atrás.', f: FONTE_ED14 },
      { id: 'b61', tema: 'Inervação', ctx: 'Os nervos alveolares superiores posteriores inervam os molares e entram na maxila por dois ou três pequenos forames alveolares.', p: 'Onde ficam esses forames?', o: ['Na fossa canina', 'Na tuberosidade da maxila', 'No palato duro, junto aos incisivos', 'No processo frontal da maxila', 'No assoalho da órbita'], a: 1, w: 'Os forames alveolares ficam na tuberosidade da maxila.', f: FONTE_ED14 },
      { id: 'b62', tema: 'Osteologia', ctx: 'O osso hioide fica no pescoço, abaixo da mandíbula, e serve de apoio para a língua e para os músculos supra e infra-hióideos.', p: 'Com qual osso o hioide se articula?', o: ['Com a mandíbula', 'Com o temporal, pelo processo estiloide', 'Com nenhum osso', 'Com a primeira vértebra cervical', 'Com o esterno'], a: 2, w: 'O hioide não se articula com nenhum osso; fica suspenso por músculos e ligamentos.', f: NET_CRANIO, net: true },
      { id: 'b63', tema: 'Osteologia', ctx: 'Os seios paranasais são cavidades cheias de ar dentro de ossos do crânio e da face.', p: 'Qual é o maior seio paranasal, que tem relação íntima com as raízes dos dentes posteriores superiores?', o: ['Seio frontal', 'Seio esfenoidal', 'Células etmoidais', 'Seio maxilar', 'Seio sagital'], a: 3, w: 'O seio maxilar é o maior e fica logo acima das raízes de pré-molares e molares superiores.', f: NET_CRANIO, net: true },
      { id: 'b64', tema: 'Osteologia', ctx: 'Na face interna do corpo da mandíbula há uma crista oblíqua, a linha milo-hióidea.', p: 'Qual músculo se insere nela e forma o soalho da boca?', o: ['Genioglosso', 'Digástrico', 'Bucinador', 'Pterigóideo medial', 'Milo-hióideo'], a: 4, w: 'O milo-hióideo nasce na linha milo-hióidea e, unido ao do outro lado numa rafe, forma o soalho da boca.', f: FONTE_ED_MUSC },
      { id: 'b65', tema: 'Glândulas salivares', ctx: 'O ducto da glândula submandibular corre no soalho da boca e se abre perto do freio da língua.', p: 'Onde ele se abre?', o: ['Na carúncula sublingual', 'No vestíbulo, junto ao 2º molar superior', 'No palato mole', 'Na papila incisiva', 'No vestíbulo inferior, junto ao canino'], a: 0, w: 'O ducto submandibular abre na carúncula sublingual, ao lado do freio da língua. Junto ao 2º molar superior abre o ducto parotídeo.', f: NET_FACE, net: true },
      { id: 'b66', tema: 'Glândulas salivares', ctx: 'Das três glândulas salivares maiores, a parótida é a maior em tamanho e a submandibular faz a maior parte do volume de saliva.', p: 'Qual é a menor das três glândulas salivares maiores?', o: ['Parótida', 'Sublingual', 'Submandibular', 'Glândula lacrimal', 'Tireoide'], a: 1, w: 'A sublingual é a menor das três maiores.', f: NET_FACE, net: true },
      { id: 'b67', tema: 'Inervação', ctx: 'O nervo lingual leva fibras que não são dele: a gustação dos dois terços anteriores da língua e fibras secretomotoras para as glândulas submandibular e sublingual.', p: 'Funcionalmente, essas fibras pertencem a qual nervo?', o: ['Glossofaríngeo', 'Hipoglosso', 'Corda do tímpano, do nervo facial-intermédio', 'Nervo bucal', 'Nervo alveolar inferior'], a: 2, w: 'São fibras da corda do tímpano (nervo facial-intermédio) que viajam junto com o lingual.', f: FONTE_ED14 },
      { id: 'b68', tema: 'Dentina', ctx: 'A dentina se classifica pelo momento e pelo motivo da sua formação.', p: 'Como se chama a dentina formada até que o forame apical se complete?', o: ['Terciária', 'Secundária', 'Reparadora', 'Primária', 'Esclerótica'], a: 3, w: 'Primária: até completar o forame apical. Secundária: depois disso, mais lenta. Terciária: resposta a lesão.', f: FONTE_SM1 },
      { id: 'b69', tema: 'Anestesia', ctx: 'Para extrair um segundo molar inferior, é preciso bloquear o nervo que leva os ramos dentais e a maioria dos peridentais aos molares inferiores.', p: 'Qual é esse nervo?', o: ['Nervo bucal', 'Nervo lingual', 'Nervo mentual', 'Nervo milo-hióideo', 'Nervo alveolar inferior'], a: 4, w: 'O alveolar inferior inerva os dentes inferiores; bucal e lingual cuidam da gengiva.', f: FONTE_ED14 },
      { id: 'b70', tema: 'Anestesia', ctx: 'Na extração do segundo molar inferior também se corta a gengiva ao redor do dente (sindesmotomia), e ela tem inervação própria.', p: 'Quais nervos inervam a gengiva vestibular e a lingual desse molar?', o: ['Bucal (vestibular) e lingual (lingual)', 'Mentual (vestibular) e lingual (lingual)', 'Infraorbital e palatino maior', 'Bucal e milo-hióideo', 'Facial e hipoglosso'], a: 0, w: 'Na região dos molares inferiores, a gengiva vestibular é do bucal e a lingual, do lingual.', f: FONTE_ED14 },
      { id: 'b71', tema: 'Anestesia', ctx: 'A extração agora é do primeiro pré-molar inferior, um dente mais anterior no arco.', p: 'Quais nervos precisam ser anestesiados?', o: ['Só o alveolar inferior', 'Alveolar inferior, lingual e mentual', 'Alveolar inferior, bucal e lingual', 'Mentual e bucal', 'Lingual e milo-hióideo'], a: 1, w: 'Alveolar inferior para o dente, lingual para a gengiva lingual e mentual para a gengiva vestibular, que nessa altura já é do mentual.', f: FONTE_ED14 },
      { id: 'b72', tema: 'Anestesia', ctx: 'Uma agulha é introduzida no canal mentual e o anestésico é injetado ali.', p: 'O que fica insensível?', o: ['Toda a hemiarcada inferior e a língua', 'Só a gengiva lingual dos incisivos', 'Mento, lábio inferior do lado e gengiva vestibular da linha mediana até a área do 2º pré-molar', 'A bochecha e a gengiva vestibular dos molares', 'O palato duro anterior'], a: 2, w: 'Fica anestesiado todo o território do nervo mentual: mento, lábio inferior e gengiva vestibular até o 2º pré-molar.', f: FONTE_ED14 },
      { id: 'b73', tema: 'Anestesia', ctx: 'Depois da anestesia do nervo mentual, o paciente pergunta se vai conseguir mexer o lábio.', p: 'Qual é a resposta certa?', o: ['Não, porque o mentual é o nervo motor do lábio', 'Não, porque o anestésico paralisa o orbicular da boca', 'Só depois de quatro horas', 'Sim, porque os músculos do lábio são inervados pelo nervo facial, que não foi anestesiado', 'Sim, porque o lábio é inervado pelo hipoglosso'], a: 3, w: 'O mentual é sensitivo. O movimento do lábio depende dos músculos da mímica, inervados pelo nervo facial.', f: FONTE_ED14 },
      { id: 'b74', tema: 'Anestesia', ctx: 'Um cálculo salivar está preso no ducto da glândula submandibular, no soalho da boca, e precisa ser removido.', p: 'Qual nervo deve ser anestesiado?', o: ['Bucal', 'Alveolar inferior', 'Mentual', 'Milo-hióideo', 'Lingual'], a: 4, w: 'O lingual inerva o soalho da boca, as glândulas submandibular e sublingual, seus ductos e a gengiva lingual.', f: FONTE_ED14 },
      { id: 'b75', tema: 'Anestesia', ctx: 'Para um preparo cavitário em dente vital no canino inferior, só o nervo do próprio dente precisa ser atingido.', p: 'Segundo o estudo dirigido, qual é esse nervo?', o: ['Alveolar inferior', 'Mentual', 'Lingual', 'Bucal', 'Alveolar superior anterior'], a: 0, w: 'Só o alveolar inferior inerva o dente. Mentual e lingual inervam tecidos de suporte, não o dente.', f: FONTE_ED14 },
      { id: 'b76', tema: 'Anestesia', ctx: 'Numa apicectomia da raiz do primeiro pré-molar inferior, é preciso anestesiar o dente e a mucosa vestibular onde será feita a incisão.', p: 'Quais nervos não podem faltar?', o: ['Bucal e lingual', 'Alveolar inferior e mentual', 'Lingual e milo-hióideo', 'Somente o bucal', 'Infraorbital e mentual'], a: 1, w: 'Alveolar inferior (dente) e mentual (mucosa vestibular dessa região). O bucal fica de fora: é da região dos molares.', f: FONTE_ED14 },
      { id: 'b77', tema: 'Anestesia', ctx: 'Para extrair o segundo molar superior, anestesiam-se o dente e a gengiva vestibular e palatina.', p: 'Quais nervos entram nessa anestesia?', o: ['Alveolar superior anterior e nasopalatino', 'Alveolar superior médio e infraorbital', 'Alveolares superiores posteriores (com o ramo gengival) e palatino maior', 'Alveolar inferior e lingual', 'Infraorbital e nasopalatino'], a: 2, w: 'Alveolares superiores posteriores para o dente e a gengiva vestibular, palatino maior para a gengiva palatina.', f: FONTE_ED14 },
      { id: 'b78', tema: 'Anestesia', ctx: 'Para extrair um canino superior, anestesia-se o nervo alveolar superior anterior, que inerva o dente, mas a gengiva vestibular e a palatina também precisam de anestesia.', p: 'Quais outros nervos entram?', o: ['Palatino maior e bucal', 'Alveolar superior posterior e palatino maior', 'Mentual e lingual', 'Infraorbital (vestibular) e nasopalatino (palatina)', 'Somente o palatino maior'], a: 3, w: 'A gengiva vestibular do canino superior é do infraorbital; a palatina, do nasopalatino.', f: FONTE_ED14 },
      { id: 'b79', tema: 'Inervação', ctx: 'O nervo alveolar superior anterior normalmente é ramo do infraorbital e inerva os dentes da frente do arco superior.', p: 'Quais dentes ele inerva?', o: ['Molares', 'Pré-molares', 'Só os incisivos centrais', 'Terceiros molares', 'Incisivos e caninos'], a: 4, w: 'Anterior: incisivos e caninos. Médio: pré-molares. Posterior: molares.', f: FONTE_ED14 + '; ' + WIKI_MAX },
      { id: 'b80', tema: 'Inervação', ctx: 'O nervo mandibular tem um ramo sensitivo que sobe à frente da orelha junto com a artéria temporal superficial.', p: 'Qual ramo do nervo mandibular inerva a pele da região temporal, à frente da orelha?', o: ['Auriculotemporal', 'Bucal', 'Lingual', 'Mentual', 'Alveolar inferior'], a: 0, w: 'O auriculotemporal inerva a pele da região temporal e à frente da orelha.', f: FONTE_ED14 + '; ' + WIKI_MAN },
      { id: 'b81', tema: 'Inervação', ctx: 'A sensibilidade da pele da pálpebra inferior chega por ramos palpebrais inferiores.', p: 'De qual nervo vêm esses ramos?', o: ['Nervo bucal', 'Nervo infraorbital', 'Nervo facial', 'Nervo mentual', 'Nervo lingual'], a: 1, w: 'O infraorbital emite ramos palpebrais inferiores, nasais e labiais superiores.', f: FONTE_ED14 + '; ' + WIKI_MAX },
      { id: 'b82', tema: 'Inervação', ctx: 'A pele do ângulo da mandíbula é uma das poucas regiões da face que não é inervada pelo trigêmeo.', p: 'Qual nervo capta a sensibilidade dessa região?', o: ['Nervo bucal', 'Nervo alveolar inferior', 'Nervo auricular magno (plexo cervical)', 'Nervo facial', 'Nervo mentual'], a: 2, w: 'O ângulo da mandíbula é inervado pelo auricular magno, do plexo cervical.', f: FONTE_ED14 + '; anatomia padrão (Kenhub, plexo cervical)', net: true },
      { id: 'b83', tema: 'Inervação', ctx: 'O nervo lingual é ramo da divisão posterior do nervo mandibular e passa pelo soalho da boca.', p: 'Que território recebe a sensibilidade geral dele?', o: ['Terço posterior da língua', 'Palato mole', 'Gengiva vestibular dos molares', 'Mucosa dos dois terços anteriores da língua e soalho da boca', 'Lábio inferior e mento'], a: 3, w: 'Sensibilidade geral dos dois terços anteriores da língua, do soalho da boca e da gengiva lingual.', f: FONTE_ED14 },
      { id: 'b84', tema: 'Inervação', ctx: 'Antes de entrar no forame mandibular, o nervo alveolar inferior emite um ramo motor que corre no sulco milo-hióideo.', p: 'Quais músculos esse nervo milo-hióideo inerva?', o: ['Masseter e temporal', 'Genioglosso e hioglosso', 'Bucinador e orbicular da boca', 'Ventre posterior do digástrico e estilo-hióideo', 'Milo-hióideo e ventre anterior do digástrico'], a: 4, w: 'Milo-hióideo e ventre anterior do digástrico. O ventre posterior e o estilo-hióideo são do nervo facial.', f: WIKI_MAN, net: true },
      { id: 'b85', tema: 'Anestesia', ctx: 'No bloqueio convencional do nervo alveolar inferior, o paciente fica de boca bem aberta e o operador se posiciona do lado oposto.', p: 'Onde é feita a punção?', o: ['No triângulo retromolar, 6 a 10 mm acima do plano oclusal, entre o ramo e a linha oblíqua interna', 'Distal ao segundo molar superior, na cúspide mesiopalatina', 'No vestíbulo, na altura do 1º pré-molar', 'No forame mentual', 'Com a boca fechada, paralela ao plano oclusal'], a: 0, w: 'Triângulo retromolar, 6 a 10 mm acima do plano oclusal. A cúspide do 2º molar superior é a Gow-Gates; boca fechada é a Vazirani-Akinosi.', f: FONTE_MAND },
      { id: 'b86', tema: 'Anestesia', ctx: 'No bloqueio convencional do alveolar inferior, a agulha longa avança até tocar o osso, a cerca de 20 a 25 mm.', p: 'Qual é a conduta depois do contato ósseo?', o: ['Injetar 3,6 mL de uma vez', 'Recuar cerca de 1 mm, aspirar e injetar 1,0 a 1,5 mL lentamente', 'Avançar mais 10 mm e injetar', 'Retirar a agulha sem injetar', 'Injetar 0,3 mL e terminar'], a: 1, w: 'Recuar 1 mm, aspirar e injetar 1,0 a 1,5 mL devagar.', f: FONTE_MAND },
      { id: 'b87', tema: 'Anestesia', ctx: 'O bloqueio convencional do alveolar inferior anestesia os dentes de um lado da mandíbula e os tecidos moles do hemiarco.', p: 'Qual região NÃO fica anestesiada por essa técnica?', o: ['Os incisivos do mesmo lado', 'O lábio inferior do mesmo lado', 'A mucosa e a gengiva vestibular dos molares', 'Os pré-molares do mesmo lado', 'O mento do mesmo lado'], a: 2, w: 'A vestibular dos molares é do nervo bucal, que precisa de anestesia à parte.', f: FONTE_MAND },
      { id: 'b88', tema: 'Anestesia', ctx: 'O nervo lingual costuma ser anestesiado aproveitando a mesma punção do alveolar inferior.', p: 'Como isso é feito?', o: ['Com nova punção no soalho da boca', 'Avançando a agulha mais 1 cm', 'Com a boca fechada', 'No recuo da agulha, recuando cerca de 1 cm', 'Com infiltração no vestíbulo'], a: 3, w: 'Ao recuar a agulha cerca de 1 cm, deposita-se o anestésico do lingual (0,3 mL).', f: FONTE_MAND },
      { id: 'b89', tema: 'Anestesia', ctx: 'O nervo bucal precisa de anestesia própria para a mucosa e a gengiva vestibular dos molares inferiores.', p: 'Como é feita essa técnica?', o: ['Agulha longa no triângulo retromolar, 1,8 mL', 'Boca fechada, agulha paralela ao plano oclusal', 'Punção distal ao 2º molar superior', 'No recuo da agulha do alveolar inferior', 'Agulha curta na mucosa distal ao último molar inferior, 0,3 a 0,5 mL no vestíbulo'], a: 4, w: 'Agulha curta, mucosa distal ao último molar, pouco volume (0,3 a 0,5 mL).', f: FONTE_MAND },
      { id: 'b90', tema: 'Anestesia', ctx: 'A técnica de Gow-Gates deposita o anestésico mais alto, perto do colo do côndilo.', p: 'Quais nervos ela alcança?', o: ['Todo o nervo mandibular: alveolar inferior, lingual, bucal, auriculotemporal e milo-hióideo', 'Só o alveolar inferior', 'Só o lingual e o bucal', 'Os alveolares superiores posteriores', 'Só o mentual e o incisivo'], a: 0, w: 'A Gow-Gates pega todo o ramo mandibular de uma vez.', f: FONTE_MAND },
      { id: 'b91', tema: 'Anestesia', ctx: 'Na Gow-Gates, o paciente fica de boca bem aberta e a agulha é direcionada ao colo do côndilo.', p: 'Onde fica o ponto de punção?', o: ['No triângulo retromolar, 6 a 10 mm acima do plano oclusal', 'Distal ao segundo molar superior, na altura da cúspide mesiopalatina', 'No vestíbulo do 1º molar inferior', 'Na rafe pterigomandibular, com a boca fechada', 'No forame mentual'], a: 1, w: 'Punção distal ao 2º molar superior, na altura da cúspide mesiopalatina; 25 a 30 mm e 1,8 mL.', f: FONTE_MAND },
      { id: 'b92', tema: 'Anestesia', ctx: 'Um paciente tem trismo e não consegue abrir a boca o suficiente para o bloqueio convencional do alveolar inferior.', p: 'Qual técnica é indicada?', o: ['Gow-Gates', 'Bloqueio do nervo bucal', 'Vazirani-Akinosi', 'Infiltrativa no mentual', 'Bloqueio do nervo lingual isolado'], a: 2, w: 'A Vazirani-Akinosi é feita de boca fechada, por isso serve no trismo.', f: FONTE_MAND },
      { id: 'b93', tema: 'Anestesia', ctx: 'A técnica de Vazirani-Akinosi é feita com os dentes em oclusão (boca fechada).', p: 'Como a agulha é posicionada?', o: ['Perpendicular ao ramo, no triângulo retromolar', 'Na cúspide mesiopalatina do 2º molar superior', 'No forame mentual', 'Agulha longa paralela ao plano oclusal, na altura do rebordo alveolar superior', 'Agulha curta no vestíbulo dos molares'], a: 3, w: 'Agulha longa paralela ao plano oclusal, na altura do rebordo alveolar superior; 25 mm até o espaço pterigomandibular.', f: FONTE_MAND },
      { id: 'b94', tema: 'Anestesia', ctx: 'O bloqueio convencional do alveolar inferior falhou e o paciente ainda sente dor.', p: 'Qual técnica é indicada como alternativa?', o: ['Infiltrativa no vestíbulo', 'Nervo bucal', 'Nervo lingual', 'Mentual', 'Gow-Gates'], a: 4, w: 'Quando o bloqueio convencional falha, a indicação é a Gow-Gates.', f: FONTE_MAND },
      { id: 'b95', tema: 'Anestesia', ctx: 'Depois de um bloqueio do alveolar inferior, o paciente fica com a metade do rosto sem movimento por algumas horas.', p: 'Qual é a causa dessa paralisia facial transitória?', o: ['Injeção inadvertida no nervo facial', 'Lesão do nervo lingual', 'Infiltração no músculo pterigóideo', 'Lesão de um vaso', 'Anestésico no nervo bucal'], a: 0, w: 'Paralisia facial transitória = anestésico atingiu o nervo facial por engano.', f: FONTE_MAND },
      { id: 'b96', tema: 'Anestesia', ctx: 'Uma complicação do bloqueio do alveolar inferior é a dificuldade de abrir a boca nos dias seguintes.', p: 'Qual é a causa desse trismo?', o: ['Lesão vascular', 'Infiltração no músculo pterigóideo', 'Injeção no nervo facial', 'Localização incorreta da agulha', 'Lesão do nervo lingual'], a: 1, w: 'Trismo = infiltração no músculo pterigóideo.', f: FONTE_MAND },
      { id: 'b97', tema: 'Anestesia', ctx: 'Logo após a anestesia aparece um inchaço arroxeado na região da punção.', p: 'Qual é a causa desse hematoma?', o: ['Injeção no nervo facial', 'Infiltração no pterigóideo', 'Lesão vascular', 'Volume pequeno de anestésico', 'Lesão do nervo bucal'], a: 2, w: 'Hematoma = lesão de um vaso pela agulha.', f: FONTE_MAND },
      { id: 'b98', tema: 'Anestesia', ctx: 'O paciente continua com formigamento na língua ou no lábio dias depois da anestesia.', p: 'Essa parestesia transitória está ligada a qual estrutura?', o: ['Músculo masseter', 'Artéria alveolar inferior', 'Nervo facial', 'Nervo lingual ou alveolar inferior', 'Glândula parótida'], a: 3, w: 'Parestesia = lesão do nervo lingual ou do alveolar inferior.', f: FONTE_MAND },
      { id: 'b99', tema: 'Músculos da mastigação', ctx: 'O ramo da mandíbula fica entre dois músculos elevadores, um por fora e outro por dentro, que juntos formam uma alça.', p: 'Quais músculos formam a tipoia (funda) pterigomassetérica?', o: ['Masseter e temporal', 'Pterigóideo lateral e masseter', 'Temporal e pterigóideo medial', 'Bucinador e masseter', 'Masseter e pterigóideo medial'], a: 4, w: 'Masseter por fora e pterigóideo medial por dentro do ramo, os dois inseridos perto do ângulo.', f: FONTE_JONAS + '; ' + KEN_MAST, net: true },
      { id: 'b100', tema: 'Músculos da mastigação', ctx: 'Dos quatro músculos da mastigação, três elevam a mandíbula e fecham a boca.', p: 'Qual músculo da mastigação faz a protrusão e participa da abertura da boca?', o: ['Pterigóideo lateral', 'Masseter', 'Temporal', 'Pterigóideo medial', 'Bucinador'], a: 0, w: 'O pterigóideo lateral é o protrusor e o único da mastigação que ajuda a abrir a boca.', f: FONTE_ED_MUSC + '; ' + FONTE_JONAS },
      { id: 'b101', tema: 'Músculos da mastigação', ctx: 'O estudo dirigido classifica os músculos da mastigação pela função.', p: 'Quais são os três elevadores da mandíbula?', o: ['Masseter, bucinador e temporal', 'Temporal, masseter e pterigóideo medial', 'Pterigóideo lateral, masseter e digástrico', 'Temporal, pterigóideo lateral e milo-hióideo', 'Masseter, pterigóideo lateral e pterigóideo medial'], a: 1, w: 'Elevadores: temporal, masseter e pterigóideo medial. O pterigóideo lateral é protrusor.', f: FONTE_ED_MUSC },
      { id: 'b102', tema: 'Músculos da mastigação', ctx: 'Ao pedir que o paciente aperte os dentes, alguns músculos da mastigação podem ser palpados pela pele.', p: 'Quais deles se palpam por fora?', o: ['Os quatro', 'Pterigóideos medial e lateral', 'Masseter e temporal', 'Só o pterigóideo lateral', 'Temporal e pterigóideo medial'], a: 2, w: 'Só masseter e temporal são superficiais o bastante para a palpação extraoral; os pterigóideos ficam por dentro do ramo.', f: FONTE_ED_MUSC },
      { id: 'b103', tema: 'Músculos da mastigação', ctx: 'O masseter tem uma parte superficial e uma profunda e nasce no arco zigomático.', p: 'Onde ele se insere?', o: ['No processo coronoide', 'Na fóvea pterigóidea', 'No hioide', 'No ângulo e no ramo da mandíbula, face lateral', 'Na linha milo-hióidea'], a: 3, w: 'O masseter se insere no ângulo e na face lateral do ramo e eleva a mandíbula.', f: FONTE_ED_MUSC },
      { id: 'b104', tema: 'Músculos da mastigação', ctx: 'O pterigóideo medial é chamado de "masseter de dentro", porque tem forma, direção e inserção parecidas.', p: 'Qual é a ação dele?', o: ['Abaixar a mandíbula', 'Retrair a língua', 'Comprimir a bochecha', 'Elevar o lábio inferior', 'Elevar a mandíbula'], a: 4, w: 'Como o masseter, o pterigóideo medial eleva a mandíbula.', f: FONTE_ED_MUSC },
      { id: 'b105', tema: 'Músculos da mastigação', ctx: 'O pterigóideo lateral tem dois feixes e é o músculo da mastigação que mais apresenta espasmo.', p: 'Onde ele se origina?', o: ['Na asa maior e no processo pterigoide do esfenoide', 'No arco zigomático', 'Na fossa temporal', 'Na linha milo-hióidea', 'No processo mastoide'], a: 0, w: 'Origem na asa maior e na lâmina lateral do processo pterigoide do esfenoide; inserção na fóvea pterigóidea e na ATM.', f: FONTE_ED_MUSC },
      { id: 'b106', tema: 'Músculos da mastigação', ctx: 'O temporal é um músculo em leque na lateral do crânio.', p: 'De onde ele se origina?', o: ['Do arco zigomático', 'Da fossa temporal (linha temporal) e da face profunda da fáscia temporal', 'Do processo pterigoide', 'Do processo mastoide', 'Da maxila, na fossa canina'], a: 1, w: 'Origem na fossa temporal e na fáscia temporal; inserção no processo coronoide.', f: FONTE_ED_MUSC },
      { id: 'b107', tema: 'Músculos da mastigação', ctx: 'O digástrico é um músculo supra-hióideo com dois ventres unidos por um tendão intermédio preso ao hioide.', p: 'Qual é a ação dele sobre a mandíbula?', o: ['Eleva a mandíbula', 'Faz a protrusão', 'Ajuda a abaixar e retrair a mandíbula', 'Comprime a bochecha', 'Eleva o lábio superior'], a: 2, w: 'Com o hioide fixo, o digástrico retrai e ajuda a abaixar a mandíbula.', f: FONTE_ED_MUSC },
      { id: 'b108', tema: 'Músculos da mastigação', ctx: 'O genioglosso é um músculo extrínseco da língua que nasce nas espinhas genianas, na face interna da mandíbula.', p: 'Qual é a ação principal dele?', o: ['Elevar a língua contra o palato', 'Retrair a língua para trás', 'Encurtar a língua', 'Projetar a língua para a frente (protrusão)', 'Fechar a boca'], a: 3, w: 'O genioglosso puxa a língua para a frente (protrusão) e a abaixa.', f: FONTE_ED_MUSC },
      { id: 'b109', tema: 'Mímica', ctx: 'Os músculos da expressão facial ficam na tela subcutânea e movem a pele do rosto.', p: 'Qual nervo inerva esses músculos?', o: ['Nervo mandibular (V3)', 'Nervo maxilar (V2)', 'Nervo hipoglosso', 'Nervo glossofaríngeo', 'Nervo facial (VII)'], a: 4, w: 'Toda a mímica é do nervo facial. O trigêmeo é sensitivo da face e motor da mastigação.', f: FONTE_ED_MUSC },
      { id: 'b110', tema: 'Mímica', ctx: 'Um músculo ímpar circunda a rima da boca e funciona como esfíncter, usado para assobiar, sugar e beijar.', p: 'Qual é esse músculo?', o: ['Orbicular da boca', 'Bucinador', 'Mentual', 'Zigomático maior', 'Risório'], a: 0, w: 'O orbicular da boca é o esfíncter dos lábios.', f: FONTE_ED_MUSC },
      { id: 'b111', tema: 'Mímica', ctx: 'Ao sorrir, o ângulo da boca é puxado para cima e para fora.', p: 'Qual músculo é conhecido como o músculo do riso por fazer esse movimento?', o: ['Corrugador do supercílio', 'Zigomático maior', 'Mentual', 'Abaixador do ângulo da boca', 'Orbicular do olho'], a: 1, w: 'O zigomático maior puxa o ângulo da boca para cima e para fora no sorriso.', f: FONTE_ED_MUSC },
      { id: 'b112', tema: 'Mímica', ctx: 'O músculo mentual fica no queixo, profundo ao lábio inferior.', p: 'Qual é a ação dele?', o: ['Abaixar o lábio inferior', 'Retrair o ângulo da boca', 'Elevar e projetar o lábio inferior, enrugando o queixo', 'Fechar as pálpebras', 'Comprimir a bochecha'], a: 2, w: 'O mentual eleva (e projeta) o lábio inferior e enruga a pele do queixo.', f: FONTE_ED_MUSC },
      { id: 'b113', tema: 'Mímica', ctx: 'O bucinador forma a parede da bochecha e nasce nos processos alveolares da maxila e da mandíbula e na rafe pterigomandibular.', p: 'Qual é a principal função dele?', o: ['Elevar a mandíbula', 'Abrir a boca', 'Elevar o lábio superior', 'Comprimir a bochecha contra os dentes, mantendo o alimento sobre as faces oclusais', 'Fechar os olhos'], a: 3, w: 'O bucinador comprime a bochecha e devolve o alimento para entre os dentes durante a mastigação.', f: FONTE_ED_MUSC + '; ' + FONTE_JONAS + '; ' + NET_FACE, net: true },
      { id: 'b114', tema: 'Mímica', ctx: 'Apesar de ajudar na mastigação, o bucinador é um músculo da mímica facial.', p: 'Qual nervo faz a inervação motora do bucinador?', o: ['Nervo bucal (do V3)', 'Nervo mandibular', 'Nervo lingual', 'Nervo hipoglosso', 'Nervo facial (VII)'], a: 4, w: 'O motor é o nervo facial. Pegadinha: o nervo bucal do V3 só leva sensibilidade da bochecha.', f: NET_FACE + '; ' + WIKI_MAN, net: true },
      { id: 'b115', tema: 'Mímica', ctx: 'Na face anterior da maxila, abaixo do forame infraorbital, há uma depressão chamada fossa canina.', p: 'Qual músculo da mímica nasce na fossa canina?', o: ['Levantador do ângulo da boca', 'Levantador do lábio superior', 'Zigomático maior', 'Orbicular do olho', 'Mentual'], a: 0, w: 'O levantador do ângulo da boca nasce na fossa canina; o levantador do lábio superior nasce acima do forame infraorbital.', f: FONTE_ED_MUSC },
      { id: 'b116', tema: 'Vascularização', ctx: 'A artéria carótida externa sobe pelo pescoço, penetra na glândula parótida e, na altura do colo da mandíbula, se divide em dois ramos terminais.', p: 'Quais são esses dois ramos terminais?', o: ['Facial e lingual', 'Maxilar e temporal superficial', 'Occipital e auricular posterior', 'Tireóidea superior e faríngea ascendente', 'Carótida interna e vertebral'], a: 1, w: 'Os terminais são a artéria maxilar e a temporal superficial.', f: FONTE_ED_ART },
      { id: 'b117', tema: 'Vascularização', ctx: 'A carótida externa emite ramos colaterais ao longo do trajeto e termina em dois ramos terminais, maxilar e temporal superficial.', p: 'Quantos ramos colaterais ela emite, na contagem clássica?', o: ['4', '5', '6', '8', '10'], a: 2, w: 'Seis colaterais: tireóidea superior, lingual, facial, faríngea ascendente, occipital e auricular posterior. Somando os 2 terminais, são 8 ramos no total (cuidado com essa pegadinha).', f: FONTE_JONAS + '; ' + WIKI_ECE, net: true },
      { id: 'b118', tema: 'Vascularização', ctx: 'Antes de se dividir nos ramos terminais, a carótida externa atravessa uma glândula salivar.', p: 'Qual glândula?', o: ['Submandibular', 'Sublingual', 'Tireoide', 'Parótida', 'Glândulas palatinas'], a: 3, w: 'A carótida externa penetra na parótida e se divide dentro dela, no colo da mandíbula.', f: FONTE_ED_ART },
      { id: 'b119', tema: 'Vascularização', ctx: 'A artéria carótida comum se divide em carótida interna e carótida externa.', p: 'Em que altura ocorre essa divisão?', o: ['No ângulo da mandíbula', 'No arco zigomático', 'No forame magno', 'Na base do crânio', 'Na altura da margem superior da cartilagem tireóidea'], a: 4, w: 'A carótida externa nasce na altura da margem superior da cartilagem tireóidea, não do ângulo da mandíbula.', f: FONTE_ED_ART },
      { id: 'b120', tema: 'Vascularização', ctx: 'Os primeiros ramos anteriores da carótida externa saem em sequência: a tireóidea superior é o primeiro.', p: 'Qual é o segundo ramo, que vai para a língua?', o: ['Artéria lingual', 'Artéria facial', 'Artéria maxilar', 'Artéria occipital', 'Artéria temporal superficial'], a: 0, w: 'Tireóidea superior, lingual (2º) e facial (3º).', f: FONTE_ED_ART },
      { id: 'b121', tema: 'Vascularização', ctx: 'A artéria facial cruza a base da mandíbula na frente do masseter e sobe pelo rosto, ao lado do nariz.', p: 'Como se chama o ramo terminal da facial e onde ele termina?', o: ['Labial superior, no lábio', 'Angular, no ângulo medial do olho', 'Angular, no ângulo da boca', 'Infraorbital, na órbita', 'Nasal lateral, na asa do nariz'], a: 1, w: 'Termina como artéria angular, no ângulo medial do olho. As labiais são ramos colaterais.', f: FONTE_ED_ART },
      { id: 'b122', tema: 'Vascularização', ctx: 'A artéria maxilar nasce atrás do colo da mandíbula e segue para dentro, irrigando dentes, maxilares e palato.', p: 'Por quais fossas ela passa?', o: ['Fossa temporal e fossa canina', 'Fossa mandibular e fossa hipofisária', 'Fossa infratemporal e depois fossa pterigopalatina', 'Fossa digástrica e fossa submandibular', 'Só a fossa pterigopalatina'], a: 2, w: 'Passa pela fossa infratemporal e depois pela pterigopalatina, onde dá a palatina descendente.', f: FONTE_ED_ART },
      { id: 'b123', tema: 'Vascularização', ctx: 'A artéria alveolar inferior é ramo da maxilar e percorre o canal mandibular.', p: 'Além dos ramos dentais e peridentais, quais ramos ela emite?', o: ['Facial e lingual', 'Palatina descendente e esfenopalatina', 'Temporais profundas', 'Milo-hióideo, mentual e incisivo', 'Infraorbital e alveolar superior anterior'], a: 3, w: 'A alveolar inferior também dá os ramos milo-hióideo, mentual e incisivo.', f: FONTE_ED_ART },
      { id: 'b124', tema: 'Vascularização', ctx: 'A artéria infraorbital, ramo da maxilar, percorre o canal infraorbital.', p: 'Que ramos ela emite dentro do canal, para os dentes anteriores superiores?', o: ['Artérias palatinas maiores', 'Artéria alveolar inferior', 'Artéria facial', 'Artérias alveolares superiores posteriores', 'Artérias alveolares superiores anteriores'], a: 4, w: 'Dentro do canal, a infraorbital emite as alveolares superiores anteriores (e a média). As posteriores saem da maxilar antes e entram pela tuberosidade.', f: FONTE_ED_ART },
      { id: 'b125', tema: 'Vascularização', ctx: 'Na fossa pterigopalatina, a artéria maxilar emite um ramo que desce para irrigar o palato.', p: 'Qual é esse ramo?', o: ['Artéria palatina descendente', 'Artéria lingual', 'Artéria facial', 'Artéria meníngea média', 'Artéria occipital'], a: 0, w: 'A palatina descendente desce pelo canal palatino maior e dá a palatina maior.', f: FONTE_ED_ART },
      { id: 'b126', tema: 'Vascularização', ctx: 'No pescoço, um nervo craniano desce dentro da bainha carótica, junto com as artérias.', p: 'Qual nervo acompanha a carótida comum e a carótida interna?', o: ['Nervo facial', 'Nervo vago (X)', 'Nervo hipoglosso', 'Nervo mandibular', 'Nervo lingual'], a: 1, w: 'O vago acompanha a carótida comum e a interna, não a externa.', f: FONTE_ED_ART },
      /* ===== 09/11/2026: questões de AFIRMATIVAS e de ASSERÇÃO E RAZÃO, estilo Estácio/ENADE (af = afirmativas; ar = asserção e razão; fixa = não embaralhar alternativas) ===== */
      {"id": "a01", "tema": "Inervação", "ctx": "Paciente de 38 anos chega ao consultório com dor em vários dentes superiores e precisa de tratamento em mais de uma região do arco. Para planejar a anestesia, o cirurgião-dentista lembra que os dentes superiores são inervados pelos nervos alveolares superiores, ramos do nervo maxilar, e que cada um cobre um grupo de dentes. Considerando o texto, analise as afirmativas a seguir.", "af": ["O nervo alveolar superior posterior inerva os molares superiores.", "O nervo alveolar superior médio inerva os incisivos e os caninos superiores.", "O nervo alveolar superior anterior inerva os incisivos e os caninos superiores."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "III, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 2, "w": "I. Verdadeira: Posterior = molares. II. Falsa: O médio inerva os pré-molares (e a raiz mesiovestibular do 1º molar); incisivos e caninos são do anterior. III. Verdadeira: Anterior = incisivos e caninos.", "f": FONTE_ED14 + "; " + WIKI_MAX, "fixa": true },
      {"id": "a02", "tema": "Inervação", "ctx": "Paciente de 52 anos tem um toro palatino mediano volumoso, bem no centro do palato duro, que impede a adaptação de uma prótese total superior. O cirurgião vai removê-lo e, antes, revisa a inervação do palato: a mucosa palatina recebe nervos que chegam por forames diferentes, um na frente e outros atrás. Considerando o texto, analise as afirmativas a seguir.", "af": ["O nervo nasopalatino chega ao palato pelo forame incisivo e inerva a região de incisivos e caninos.", "O nervo palatino maior inerva o palato duro do canino aos molares.", "Para remover esse toro, basta bloquear o nervo nasopalatino."], "p": "É correto o que se afirma em", "o": ["II, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 1, "w": "I. Verdadeira: Nasopalatino, forame incisivo, região anterior. II. Verdadeira: Palatino maior, do canino aos molares. III. Falsa: O centro do palato recebe os nasopalatinos na frente e os palatinos maiores atrás: os dois precisam ser bloqueados.", "f": FONTE_ED + "; " + FONTE_ED14, "fixa": true },
      {"id": "a03", "tema": "Inervação", "ctx": "O nervo maxilar é a segunda divisão do nervo trigêmeo (V2) e é puramente sensitivo. Do gânglio trigeminal ele segue para a frente, deixa o crânio por um forame do esfenoide e percorre um trajeto até chegar à face, onde termina com outro nome e se distribui pela pele e pela mucosa. Considerando o texto, analise as afirmativas a seguir.", "af": ["O nervo maxilar sai do crânio pelo forame redondo.", "Depois do forame redondo, o nervo maxilar chega à fossa pterigopalatina.", "O nervo maxilar termina no canal mandibular e sai pelo forame mentual.", "O nervo infraorbital inerva a pálpebra inferior, o nariz e o lábio superior."], "p": "Está correto o que se afirma em", "o": ["IV, apenas.", "I e IV, apenas.", "II e IV, apenas.", "I, II e IV, apenas.", "I, II, III e IV."], "a": 3, "w": "I. Verdadeira: Redondo = V2. II. Verdadeira: O trajeto é forame redondo, fossa pterigopalatina e canal infraorbital. III. Falsa: Ele segue para o canal infraorbital; canal mandibular e forame mentual são do alveolar inferior (V3). IV. Verdadeira: Ramos palpebrais inferiores, nasais e labiais superiores.", "f": FONTE_ED + "; " + WIKI_MAX, "net": true, "fixa": true },
      {"id": "a04", "tema": "Inervação", "ctx": "O nervo mandibular (V3) é a única divisão do trigêmeo que tem fibras motoras. Depois de sair do crânio ele se divide em um tronco anterior e um tronco posterior, que dão ramos sensitivos para a face e a boca e ramos motores para os músculos da mastigação. Considerando o texto, analise as afirmativas a seguir.", "af": ["O nervo bucal é sensitivo e inerva a bochecha.", "O nervo alveolar inferior é motor e sensitivo e percorre o canal mandibular.", "O nervo auriculotemporal inerva a pele da região temporal, à frente da orelha."], "p": "É correto o que se afirma em", "o": ["III, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 4, "w": "I. Verdadeira: O bucal só leva sensibilidade da bochecha. II. Verdadeira: Ele dá o ramo motor milo-hióideo e segue sensitivo no canal. III. Verdadeira: Sobe à frente da orelha junto com a artéria temporal superficial.", "f": WIKI_MAN + "; " + FONTE_ED14, "net": true, "fixa": true },
      {"id": "a05", "tema": "Inervação", "ctx": "Após a extração de um terceiro molar inferior, um paciente de 24 anos relata formigamento na metade da língua e diz que \"a comida perdeu o gosto\" daquele lado. O professor usa o caso para lembrar que o nervo lingual, ramo do V3, carrega também fibras que não são dele. Considerando o texto, analise as afirmativas a seguir.", "af": ["O nervo lingual leva a sensibilidade geral dos dois terços anteriores da língua e do soalho da boca.", "A gustação dos dois terços anteriores da língua é função própria do nervo lingual, ramo do trigêmeo.", "As fibras secretomotoras para as glândulas submandibular e sublingual que viajam com o lingual pertencem à corda do tímpano."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "III, apenas.", "I e II, apenas.", "I e III, apenas.", "I, II e III."], "a": 3, "w": "I. Verdadeira: É o território de sensibilidade geral do lingual. II. Falsa: A gustação é da corda do tímpano (nervo facial-intermédio), que só viaja junto com o lingual. III. Verdadeira: São fibras do facial-intermédio, pela corda do tímpano.", "f": FONTE_ED14, "fixa": true },
      {"id": "a06", "tema": "Inervação", "ctx": "Em uma aula prática, o professor pede que os alunos toquem a própria face com um algodão e digam qual nervo leva aquela sensibilidade. Quase toda a pele da face é do trigêmeo, mas existe pelo menos uma região, perto do ângulo da mandíbula, que foge dessa regra. Considerando o texto, analise as afirmativas a seguir.", "af": ["A pele da pálpebra inferior é inervada por ramos do nervo infraorbital.", "A pele do ângulo da mandíbula é inervada pelo nervo auricular magno, do plexo cervical.", "A pele da região temporal, à frente da orelha, é inervada pelo nervo bucal."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "II e III, apenas.", "I, II e III."], "a": 2, "w": "I. Verdadeira: Ramos palpebrais inferiores do infraorbital. II. Verdadeira: Essa é a região que não é do trigêmeo. III. Falsa: Essa região é do auriculotemporal; o bucal é da bochecha.", "f": FONTE_ED14 + "; anatomia padrão (Kenhub, plexo cervical)", "net": true, "fixa": true },
      {"id": "a07", "tema": "Inervação", "ctx": "Antes de entrar no forame mandibular, o nervo alveolar inferior emite um pequeno ramo que desce num sulco da face medial da mandíbula. Esse ramo é motor e explica por que alguns músculos supra-hióideos são inervados pelo trigêmeo e não pelo facial. Considerando o texto, analise as afirmativas a seguir.", "af": ["O nervo milo-hióideo sai do alveolar inferior antes de este entrar no forame mandibular.", "O nervo milo-hióideo inerva o músculo milo-hióideo e o ventre anterior do digástrico.", "O ventre posterior do digástrico também é inervado pelo nervo milo-hióideo."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas."], "a": 2, "w": "I. Verdadeira: Ele nasce antes do forame e corre no sulco milo-hióideo. II. Verdadeira: São os dois músculos dele. III. Falsa: O ventre posterior (e o estilo-hióideo) é do nervo facial.", "f": WIKI_MAN, "net": true, "fixa": true },
      {"id": "a08", "tema": "Inervação", "ctx": "Um paciente de 40 anos recebe anestesia para um pré-molar superior, mas a anestesia não pega bem. O professor explica que o nervo responsável por esses dentes tem variação anatômica frequente, e que os nervos da região posterior da maxila entram no osso por pequenos forames próprios. Considerando o texto, analise as afirmativas a seguir.", "af": ["O nervo alveolar superior médio inerva os pré-molares superiores.", "Segundo o estudo dirigido, o alveolar superior médio está ausente em cerca de 30 % dos casos.", "Os nervos alveolares superiores posteriores entram na maxila por forames alveolares localizados na fossa canina."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "I e III, apenas.", "I, II e III."], "a": 2, "w": "I. Verdadeira: Médio = pré-molares. II. Verdadeira: Ausente em 30 % e ramo direto do maxilar em 10 %. III. Falsa: Os forames alveolares ficam na tuberosidade da maxila.", "f": FONTE_ED + "; " + FONTE_ED14, "fixa": true },
      {"id": "a09", "tema": "Inervação", "ctx": "Um colega de turma, estudando para a prova, escreveu num resumo três frases sobre o nervo mandibular (V3) e pediu que você revisasse. Ele estava com sono e pode ter trocado forames, nervos e funções. Considerando o texto, analise as afirmativas a seguir.", "af": ["O nervo mandibular sai do crânio pelo forame redondo.", "Os músculos da mastigação são inervados pelo nervo facial.", "O nervo bucal é o nervo motor do músculo bucinador."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e III, apenas.", "II e III, apenas.", "Nenhuma das afirmativas está correta."], "a": 4, "w": "I. Falsa: O mandibular sai pelo forame oval; pelo redondo sai o maxilar. II. Falsa: São inervados pelo nervo mandibular (V3); o facial é da mímica. III. Falsa: O bucinador é da mímica, inervado pelo facial; o nervo bucal é só sensitivo.", "f": WIKI_MAN + "; " + NET_FACE, "net": true, "fixa": true },
      {"id": "a12", "tema": "Anestesia", "ctx": "Paciente de 45 anos precisa extrair o segundo molar inferior direito, com cárie extensa e sem possibilidade de restauração. Para a extração é preciso anestesiar o dente e também a gengiva ao redor dele, que será descolada (sindesmotomia) antes da luxação. Considerando o texto, analise as afirmativas a seguir.", "af": ["O nervo alveolar inferior anestesia o dente.", "A gengiva vestibular desse molar é inervada pelo nervo bucal.", "A gengiva lingual desse molar é inervada pelo nervo mentual."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 1, "w": "I. Verdadeira: É o nervo dos dentes inferiores. II. Verdadeira: Na região dos molares a vestibular é do bucal. III. Falsa: A gengiva lingual é do nervo lingual; o mentual é vestibular, da frente até o 2º pré-molar.", "f": FONTE_ED14, "fixa": true },
      {"id": "a13", "tema": "Anestesia", "ctx": "Paciente de 16 anos vai extrair o primeiro pré-molar inferior por indicação ortodôntica. O aluno lembra que, nessa altura do arco, a gengiva vestibular já não pertence ao mesmo nervo que cuida da vestibular dos molares. Considerando o texto, analise as afirmativas a seguir.", "af": ["O nervo alveolar inferior precisa ser anestesiado para o dente.", "O nervo lingual precisa ser anestesiado para a gengiva lingual.", "O nervo mentual precisa ser anestesiado para a gengiva vestibular.", "O nervo bucal precisa ser anestesiado para a gengiva vestibular, como nos molares."], "p": "Está correto o que se afirma em", "o": ["I e III, apenas.", "II e III, apenas.", "I, II e III, apenas.", "II, III e IV, apenas.", "I, II, III e IV."], "a": 2, "w": "I. Verdadeira: O dente é do alveolar inferior. II. Verdadeira: Gengiva lingual = lingual. III. Verdadeira: O mentual cobre a vestibular da linha mediana até o 2º pré-molar. IV. Falsa: O bucal é da região dos molares; aqui a vestibular é do mentual.", "f": FONTE_ED14, "fixa": true },
      {"id": "a14", "tema": "Anestesia", "ctx": "Na mesma tarde, a clínica atende dois pacientes: um vai extrair o segundo molar superior (dente 27) e outro vai extrair o canino superior (dente 13). Em cada caso é preciso anestesiar o dente, a gengiva vestibular e a gengiva palatina. Considerando o texto, analise as afirmativas a seguir.", "af": ["Para o 2º molar superior, anestesiam-se os alveolares superiores posteriores (com o ramo gengival) e o palatino maior.", "Para o canino superior, a gengiva palatina é anestesiada pelo nervo palatino maior.", "Para o canino superior, a gengiva vestibular é inervada pelo nervo infraorbital."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "III, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 2, "w": "I. Verdadeira: Posteriores para dente e vestibular; palatino maior para a palatina. II. Falsa: A palatina do canino é do nasopalatino; o palatino maior vai do canino para trás. III. Verdadeira: Gengiva vestibular de incisivos, caninos e pré-molares superiores = infraorbital.", "f": FONTE_ED14 + "; " + FONTE_ED, "fixa": true },
      {"id": "a15", "tema": "Anestesia", "ctx": "Durante a revisão do estudo dirigido, o professor apresenta três situações rápidas: uma restauração em dente vital no canino inferior, a remoção de um cálculo preso no ducto submandibular e uma apicectomia da raiz do primeiro pré-molar inferior. Para cada uma, os alunos devem dizer qual nervo não pode faltar. Considerando o texto, analise as afirmativas a seguir.", "af": ["Na restauração do canino inferior, basta atingir o nervo alveolar inferior.", "Na remoção do cálculo do ducto submandibular, anestesia-se o nervo lingual.", "Na apicectomia do 1º pré-molar inferior, os nervos que não podem faltar são o bucal e o lingual."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "II e III, apenas.", "I, II e III."], "a": 2, "w": "I. Verdadeira: Só o alveolar inferior inerva o dente. II. Verdadeira: O lingual inerva o soalho da boca e os ductos. III. Falsa: São o alveolar inferior (dente) e o mentual (mucosa vestibular dessa região).", "f": FONTE_ED14, "fixa": true },
      {"id": "a16", "tema": "Anestesia", "ctx": "Um aluno do 2º período vai fazer o primeiro bloqueio do nervo alveolar inferior pela técnica convencional, sob supervisão. O professor pede que ele descreva o passo a passo antes de pegar a seringa: posição do paciente, ponto de punção, profundidade, conduta após tocar o osso e volume. Considerando o texto, analise as afirmativas a seguir.", "af": ["O paciente fica de boca bem aberta e o operador se posiciona do lado oposto ao que será anestesiado.", "A punção é feita no triângulo retromolar, 6 a 10 mm acima do plano oclusal.", "Após o contato ósseo, recua-se cerca de 1 mm, aspira-se e injetam-se 1,0 a 1,5 mL lentamente.", "O nervo lingual é anestesiado avançando a agulha mais 1 cm depois do contato ósseo."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III, apenas.", "I, III e IV, apenas."], "a": 3, "w": "I. Verdadeira: É a posição da técnica convencional. II. Verdadeira: É o ponto de punção dos slides. III. Verdadeira: É a conduta descrita. IV. Falsa: O lingual é anestesiado no RECUO da agulha (recuar cerca de 1 cm), com 0,3 mL.", "f": FONTE_MAND, "fixa": true },
      {"id": "a17", "tema": "Anestesia", "ctx": "Além da técnica convencional, os slides de 22/10 apresentam duas técnicas alternativas para a mandíbula. Uma deposita o anestésico mais alto, perto do colo do côndilo; a outra é feita com o paciente de boca fechada. Cada uma tem ponto de punção e indicação próprios. Considerando o texto, analise as afirmativas a seguir.", "af": ["Na Gow-Gates, a punção é distal ao 2º molar superior, na altura da cúspide mesiopalatina.", "A Vazirani-Akinosi é feita com a boca fechada e é indicada no trismo.", "A Gow-Gates anestesia somente o nervo alveolar inferior."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas."], "a": 2, "w": "I. Verdadeira: É o ponto da Gow-Gates. II. Verdadeira: Por ser de boca fechada, serve quando o paciente não abre a boca. III. Falsa: A Gow-Gates pega todo o nervo mandibular: alveolar inferior, lingual, bucal, auriculotemporal e milo-hióideo.", "f": FONTE_MAND, "fixa": true },
      {"id": "a18", "tema": "Anestesia", "ctx": "Na semana seguinte ao estágio, quatro pacientes voltam à clínica com queixas diferentes depois de um bloqueio do alveolar inferior: um inchaço arroxeado, outro com dificuldade de abrir a boca, outro com metade do rosto sem movimento por algumas horas e outro com formigamento na língua. Considerando o texto, analise as afirmativas a seguir.", "af": ["O hematoma resulta de lesão vascular pela agulha.", "O trismo resulta de infiltração no músculo pterigóideo.", "A paralisia facial transitória resulta de injeção inadvertida no nervo facial.", "A parestesia resulta de lesão do nervo lingual ou do alveolar inferior."], "p": "É correto o que se afirma em", "o": ["I e II, apenas.", "II e IV, apenas.", "I, III e IV, apenas.", "II, III e IV, apenas.", "I, II, III e IV."], "a": 4, "w": "I. Verdadeira: Hematoma = lesão vascular. II. Verdadeira: Trismo = infiltração no pterigóideo. III. Verdadeira: Paralisia facial = anestésico no facial. IV. Verdadeira: Parestesia = lingual ou alveolar inferior.", "f": FONTE_MAND, "fixa": true },
      {"id": "a19", "tema": "Anestesia", "ctx": "Cada técnica anestésica da mandíbula tem um tipo de agulha, uma profundidade e um volume. Trocar esses números é um erro comum de prova e também de consultório: volume demais num ponto pequeno ou agulha errada para a técnica. Considerando o texto, analise as afirmativas a seguir.", "af": ["Na Gow-Gates, a agulha penetra 25 a 30 mm e deposita 1,8 mL.", "Na Vazirani-Akinosi, a agulha longa fica paralela ao plano oclusal, na altura do rebordo alveolar superior.", "O nervo bucal é anestesiado com agulha longa no triângulo retromolar, com 1,8 mL."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "II e III, apenas.", "I, II e III."], "a": 2, "w": "I. Verdadeira: São os números da Gow-Gates. II. Verdadeira: É a posição da Vazirani-Akinosi, de boca fechada. III. Falsa: O bucal usa agulha curta na mucosa distal ao último molar, com 0,3 a 0,5 mL.", "f": FONTE_MAND, "fixa": true },
      {"id": "a23", "tema": "Osteologia", "ctx": "Na base do crânio, a asa maior do esfenoide é atravessada por três forames em sequência, de frente para trás. Por eles passam duas divisões do trigêmeo e um vaso que irriga as meninges, e trocá-los é uma das pegadinhas mais comuns em prova de anatomia. Considerando o texto, analise as afirmativas a seguir.", "af": ["Pelo forame redondo passa o nervo maxilar (V2).", "Pelo forame oval passa o nervo mandibular (V3).", "Pelo forame espinhoso passa a artéria carótida interna."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "I e III, apenas.", "I, II e III."], "a": 2, "w": "I. Verdadeira: Redondo = V2. II. Verdadeira: Oval = V3. III. Falsa: Pelo espinhoso passa a artéria meníngea média.", "f": FONTE_SM1 + "; " + NET_CRANIO, "net": true, "fixa": true },
      {"id": "a24", "tema": "Osteologia", "ctx": "O crânio se divide em neurocrânio, que envolve e protege o encéfalo, e viscerocrânio, que forma o esqueleto da face. No neurocrânio há ossos ímpares, na linha mediana, e ossos pares, um de cada lado, e na sua base fica a maior abertura do crânio. Considerando o texto, analise as afirmativas a seguir.", "af": ["O neurocrânio é formado por 8 ossos.", "Parietal e temporal são ossos pares.", "Esfenoide e etmoide são ossos pares.", "O forame magno fica no osso occipital."], "p": "Está correto o que se afirma em", "o": ["II, apenas.", "I e II, apenas.", "II e IV, apenas.", "I, II e IV, apenas.", "I, II, III e IV."], "a": 3, "w": "I. Verdadeira: Frontal, occipital, esfenoide, etmoide, 2 parietais e 2 temporais. II. Verdadeira: São os dois pares do neurocrânio. III. Falsa: Esfenoide e etmoide são ímpares. IV. Verdadeira: Com os côndilos occipitais de cada lado.", "f": FONTE_JONAS + "; " + NET_CRANIO, "net": true, "fixa": true },
      {"id": "a25", "tema": "Osteologia", "ctx": "Ao examinar um crânio seco de cima, o aluno vê as linhas onde os ossos da calvária se encontram. Essas suturas recebem o nome conforme a posição e os ossos que unem, e uma delas tem a forma da letra grega lambda. Considerando o texto, analise as afirmativas a seguir.", "af": ["A sutura sagital une os dois parietais.", "A sutura coronal une o frontal aos dois parietais.", "A sutura lambdóidea une o frontal ao occipital."], "p": "É correto o que se afirma em", "o": ["II, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 1, "w": "I. Verdadeira: Sagital = parietal com parietal. II. Verdadeira: Coronal = frontal e parietais. III. Falsa: A lambdóidea une os parietais ao occipital; frontal e occipital nem se tocam.", "f": NET_CRANIO, "net": true, "fixa": true },
      {"id": "a26", "tema": "Osteologia", "ctx": "Antes de uma anestesia do alveolar inferior, o professor mostra uma mandíbula seca e pede que os alunos localizem o caminho do feixe vasculonervoso: onde ele entra no osso, por onde corre e onde sai. Lembra também que a mandíbula tem uma característica única entre os ossos do crânio. Considerando o texto, analise as afirmativas a seguir.", "af": ["O canal mandibular começa no forame mentual e termina no forame mandibular.", "A mandíbula é o único osso móvel do crânio e articula com o temporal na ATM.", "O forame mandibular fica na face medial do ramo, protegido pela língula."], "p": "Está correto o que se afirma em", "o": ["II, apenas.", "III, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas."], "a": 4, "w": "I. Falsa: É o contrário: começa no forame mandibular e termina no forame mentual. II. Verdadeira: Único osso móvel; ATM com o temporal. III. Verdadeira: A língula fica na frente do forame mandibular.", "f": FONTE_SM1, "fixa": true },
      {"id": "a27", "tema": "Osteologia", "ctx": "A mandíbula recebe a inserção de vários músculos, e cada acidente ósseo tem o \"seu\" músculo. Saber onde cada um se prende ajuda a entender a função e a evitar estruturas durante cirurgias e anestesias. Considerando o texto, analise as afirmativas a seguir.", "af": ["O processo coronoide recebe a inserção do temporal.", "A fóvea pterigóidea recebe a inserção do pterigóideo medial.", "A linha milo-hióidea recebe o músculo milo-hióideo.", "O ângulo e a face lateral do ramo recebem o masseter."], "p": "É correto o que se afirma em", "o": ["I e III, apenas.", "I e IV, apenas.", "III e IV, apenas.", "I, II e IV, apenas.", "I, III e IV, apenas."], "a": 4, "w": "I. Verdadeira: Temporal = processo coronoide. II. Falsa: A fóvea recebe o pterigóideo LATERAL; o medial se insere no ângulo, face medial. III. Verdadeira: É onde nasce o milo-hióideo. IV. Verdadeira: Inserção do masseter.", "f": FONTE_ED_MUSC, "fixa": true },
      {"id": "a28", "tema": "Osteologia", "ctx": "Algumas estruturas da face são formadas pela união de partes de ossos diferentes, e isso costuma cair em prova. O palato duro, o septo nasal ósseo e o arco zigomático são três exemplos clássicos de estrutura \"montada\" por dois ossos. Considerando o texto, analise as afirmativas a seguir.", "af": ["O palato duro é formado pelos processos palatinos da maxila e pelas lâminas horizontais do palatino.", "O septo nasal ósseo é formado pela lâmina perpendicular do etmoide e pelo vômer.", "O arco zigomático é formado pelo processo temporal do zigomático e pelo processo zigomático do temporal."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "III, apenas.", "I e II, apenas.", "II e III, apenas.", "I, II e III."], "a": 4, "w": "I. Verdadeira: Maxila na frente, palatino atrás. II. Verdadeira: Etmoide e vômer. III. Verdadeira: Os dois processos se unem.", "f": FONTE_SM1, "fixa": true },
      {"id": "a29", "tema": "Osteologia", "ctx": "O osso temporal tem vários acidentes importantes para a odontologia: é nele que a mandíbula se articula, e dele saem processos onde se prendem músculos do pescoço. Um deles se palpa facilmente atrás da orelha. Considerando o texto, analise as afirmativas a seguir.", "af": ["O processo mastoide pertence ao osso occipital.", "A fossa mandibular, que recebe a cabeça da mandíbula, pertence ao temporal.", "O processo estiloide pertence ao temporal."], "p": "É correto o que se afirma em", "o": ["III, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 3, "w": "I. Falsa: O processo mastoide é do temporal. II. Verdadeira: Por isso a articulação é temporomandibular. III. Verdadeira: Estiloide, mastoide e fossa mandibular são do temporal.", "f": NET_CRANIO, "net": true, "fixa": true },
      {"id": "a30", "tema": "Osteologia", "ctx": "A cavidade nasal é cercada por ossos delicados, e alguns deles também formam a base do crânio. No teto do nariz passam os filetes do nervo olfatório; na parede lateral ficam as conchas; e logo atrás, no corpo de outro osso, há uma depressão que aloja a hipófise. Considerando o texto, analise as afirmativas a seguir.", "af": ["A lâmina cribriforme pertence ao esfenoide.", "A concha nasal inferior é um osso independente.", "A sela turca fica no corpo do etmoide."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "II e III, apenas.", "I, II e III."], "a": 1, "w": "I. Falsa: A lâmina cribriforme é do etmoide. II. Verdadeira: As conchas superior e média são do etmoide; a inferior é um osso próprio. III. Falsa: A sela turca fica no corpo do esfenoide.", "f": NET_CRANIO, "net": true, "fixa": true },
      {"id": "a31", "tema": "Osteologia", "ctx": "Na aula de anestesia da maxila, o professor mostra um crânio e aponta os forames e acidentes da maxila que servem de referência para as técnicas. Ele lembra ainda que o maior seio paranasal fica dentro desse osso, logo acima das raízes dos dentes posteriores. Considerando o texto, analise as afirmativas a seguir.", "af": ["O forame infraorbital fica na face anterior do corpo da maxila.", "Os forames alveolares dos nervos alveolares superiores posteriores ficam na tuberosidade da maxila.", "O forame incisivo dá passagem ao nervo palatino maior.", "O seio maxilar é o maior seio paranasal."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "II e IV, apenas.", "I, II e IV, apenas.", "I, III e IV, apenas.", "I, II, III e IV."], "a": 2, "w": "I. Verdadeira: É por onde sai o feixe infraorbital. II. Verdadeira: Na tuberosidade. III. Falsa: Pelo forame incisivo passa o nasopalatino; o palatino maior sai pelo forame palatino maior. IV. Verdadeira: É o maior.", "f": FONTE_ED14 + "; " + NET_CRANIO, "net": true, "fixa": true },
      {"id": "a32", "tema": "Osteologia", "ctx": "Ao examinar o crânio de um bebê, o aluno percebe áreas moles entre os ossos da calvária, que vão desaparecer com o crescimento. No adulto, essas mesmas suturas podem se fundir por completo. Na base do crânio, o occipital também tem superfícies articulares importantes. Considerando o texto, analise as afirmativas a seguir.", "af": ["Sinostose é a fusão óssea completa de uma sutura.", "Fontículos são as áreas membranosas ainda não ossificadas do crânio do bebê.", "Os côndilos occipitais articulam com a mandíbula."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 1, "w": "I. Verdadeira: Sinostose = sutura fundida. II. Verdadeira: As \"moleiras\". III. Falsa: Os côndilos occipitais articulam com o atlas (1ª vértebra cervical).", "f": FONTE_SM1, "fixa": true },
      {"id": "a33", "tema": "Osteologia", "ctx": "O osso hioide fica no pescoço, abaixo da mandíbula, e serve de apoio para a língua e para os músculos supra e infra-hióideos. Ele tem uma particularidade que o diferencia de todos os outros ossos do esqueleto. Considerando o texto, analise as afirmativas a seguir.", "af": ["O hioide se articula com o temporal pelo processo estiloide.", "O hioide não se articula com nenhum osso e fica suspenso por músculos e ligamentos.", "O hioide é o único osso móvel do crânio."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "II e III, apenas.", "I, II e III."], "a": 1, "w": "I. Falsa: O hioide não se articula com nenhum osso. II. Verdadeira: É a particularidade dele. III. Falsa: O único osso móvel do crânio é a mandíbula; o hioide nem faz parte do crânio.", "f": NET_CRANIO, "net": true, "fixa": true },
      {"id": "a36", "tema": "Músculos da mastigação", "ctx": "Paciente de 30 anos com bruxismo relata cansaço na face ao acordar. No exame, o cirurgião-dentista pede que ele aperte os dentes e palpa a musculatura por fora. Para interpretar o exame, é preciso saber a função e a inervação de cada músculo da mastigação. Considerando o texto, analise as afirmativas a seguir.", "af": ["Os quatro músculos da mastigação são inervados pelo nervo mandibular (V3).", "Temporal, masseter e pterigóideo medial elevam a mandíbula.", "O pterigóideo lateral faz a protrusão e participa da abertura da boca.", "Masseter e pterigóideo lateral são os músculos da mastigação palpáveis por fora."], "p": "Está correto o que se afirma em", "o": ["II, apenas.", "I e II, apenas.", "I e III, apenas.", "I, II e III, apenas.", "I, II, III e IV."], "a": 3, "w": "I. Verdadeira: Nenhum é do facial. II. Verdadeira: São os três elevadores. III. Verdadeira: É o protrusor. IV. Falsa: Por fora se palpam masseter e TEMPORAL; os pterigóideos ficam por dentro do ramo.", "f": FONTE_ED_MUSC, "fixa": true },
      {"id": "a37", "tema": "Músculos da mastigação", "ctx": "O ramo da mandíbula fica \"abraçado\" por músculos de um lado e do outro, e o temporal, em leque, cobre a lateral do crânio. Conhecer origem e inserção de cada um ajuda a entender por que a mandíbula fecha com tanta força. Considerando o texto, analise as afirmativas a seguir.", "af": ["A tipoia (funda) pterigomassetérica é formada pelo masseter, por fora, e pelo pterigóideo medial, por dentro do ramo.", "O temporal nasce no arco zigomático e se insere no ângulo da mandíbula.", "O pterigóideo lateral nasce na asa maior e no processo pterigoide do esfenoide."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "III, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 2, "w": "I. Verdadeira: Os dois se inserem perto do ângulo. II. Falsa: O temporal nasce na fossa temporal e se insere no processo coronoide; quem nasce no arco e vai ao ângulo é o masseter. III. Verdadeira: E se insere na fóvea pterigóidea e na ATM.", "f": FONTE_ED_MUSC + "; " + KEN_MAST, "net": true, "fixa": true },
      {"id": "a38", "tema": "Músculos da mastigação", "ctx": "Abaixo da mandíbula, um grupo de músculos liga a mandíbula ao hioide e forma o soalho da boca. Junto deles, os músculos da língua também participam da mastigação e da deglutição. Considerando o texto, analise as afirmativas a seguir.", "af": ["O digástrico ajuda a abaixar e retrair a mandíbula.", "O milo-hióideo forma o soalho da boca.", "O genioglosso retrai a língua para trás."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "II e III, apenas.", "I, II e III."], "a": 2, "w": "I. Verdadeira: Com o hioide fixo. II. Verdadeira: Unido ao do outro lado numa rafe. III. Falsa: O genioglosso faz a protrusão da língua (puxa para a frente).", "f": FONTE_ED_MUSC, "fixa": true },
      {"id": "a39", "tema": "Mímica", "ctx": "Um paciente acorda com metade do rosto \"caída\": não consegue sorrir de um lado, nem fechar os lábios para assobiar. O caso ajuda a lembrar quais músculos movem a face e qual nervo os comanda. Considerando o texto, analise as afirmativas a seguir.", "af": ["Todos os músculos da mímica são inervados pelo nervo facial.", "O bucinador é um músculo da mastigação inervado pelo nervo bucal.", "O zigomático maior puxa o ângulo da boca para cima e para fora no sorriso.", "O orbicular da boca funciona como esfíncter dos lábios."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "IV, apenas.", "III e IV, apenas.", "I, III e IV, apenas.", "I, II, III e IV."], "a": 3, "w": "I. Verdadeira: Toda a mímica é do VII. II. Falsa: O bucinador é da mímica (nervo facial); o nervo bucal é só sensitivo. III. Verdadeira: O músculo do riso. IV. Verdadeira: Usado para assobiar, sugar e beijar.", "f": FONTE_ED_MUSC + "; " + NET_FACE, "net": true, "fixa": true },
      {"id": "a40", "tema": "Mímica", "ctx": "Na aula sobre a face, o professor mostra a fossa canina na maxila e o queixo do modelo, e pergunta quais músculos nascem ou agem ali. Ele lembra que movimento de lábio é sempre do nervo facial, mesmo quando a sensibilidade do lábio é de outro nervo. Considerando o texto, analise as afirmativas a seguir.", "af": ["O músculo mentual abaixa o lábio inferior.", "O levantador do ângulo da boca nasce na fossa canina.", "O orbicular da boca é inervado pelo nervo mentual."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "III, apenas.", "I e II, apenas.", "II e III, apenas."], "a": 1, "w": "I. Falsa: O mentual ELEVA e projeta o lábio inferior e enruga o queixo. II. Verdadeira: É o músculo da fossa canina. III. Falsa: O orbicular é da mímica, nervo facial; o mentual é sensitivo.", "f": FONTE_ED_MUSC, "fixa": true },
      {"id": "a42", "tema": "Vascularização", "ctx": "Num paciente com sangramento após cirurgia na face, é útil saber de onde vem cada artéria. Quase toda a irrigação da face e dos maxilares vem da carótida externa, que nasce no pescoço, sobe, atravessa uma glândula e termina dando dois ramos. Considerando o texto, analise as afirmativas a seguir.", "af": ["A carótida comum se divide na altura da margem superior da cartilagem tireóidea.", "A carótida externa penetra na parótida e termina, no colo da mandíbula, em maxilar e temporal superficial.", "A artéria facial é o primeiro ramo anterior da carótida externa."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "I e III, apenas.", "I, II e III."], "a": 2, "w": "I. Verdadeira: É onde nascem a interna e a externa. II. Verdadeira: São os dois terminais. III. Falsa: O primeiro é a tireóidea superior; depois lingual (2º) e facial (3º).", "f": FONTE_ED_ART, "fixa": true },
      {"id": "a43", "tema": "Vascularização", "ctx": "A artéria maxilar, ramo terminal da carótida externa, é a principal fonte de sangue para os dentes, os maxilares e o palato. Seus ramos acompanham os nervos de mesmo nome. Já a artéria facial sobe pelo rosto e termina perto do olho. Considerando o texto, analise as afirmativas a seguir.", "af": ["A artéria facial termina como artéria angular, no ângulo medial do olho.", "A artéria maxilar passa pela fossa infratemporal e depois pela fossa pterigopalatina.", "A artéria alveolar inferior emite os ramos milo-hióideo, mentual e incisivo.", "As artérias alveolares superiores anteriores saem da infraorbital, dentro do canal infraorbital."], "p": "Está correto o que se afirma em", "o": ["I e III, apenas.", "II e IV, apenas.", "I, II e IV, apenas.", "II, III e IV, apenas.", "I, II, III e IV."], "a": 4, "w": "I. Verdadeira: Angular, no ângulo medial do olho. II. Verdadeira: Nessa ordem. III. Verdadeira: Além dos dentais e peridentais. IV. Verdadeira: As posteriores saem antes, da maxilar.", "f": FONTE_ED_ART, "fixa": true },
      {"id": "a44", "tema": "Vascularização", "ctx": "Em prova, a contagem dos ramos da carótida externa é uma pegadinha conhecida: há quem conte só os colaterais e quem some os terminais. No pescoço, as carótidas também têm companhia de um nervo craniano dentro da bainha carótica. Considerando o texto, analise as afirmativas a seguir.", "af": ["A carótida externa emite 8 ramos colaterais.", "A artéria lingual é o segundo ramo da carótida externa.", "O nervo vago acompanha a carótida comum e a carótida interna."], "p": "É correto o que se afirma em", "o": ["II, apenas.", "III, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 3, "w": "I. Falsa: São 6 colaterais; somando os 2 terminais é que dá 8 ramos. II. Verdadeira: Tireóidea superior, lingual, facial. III. Verdadeira: Não acompanha a externa.", "f": FONTE_ED_ART + "; " + WIKI_ECE, "net": true, "fixa": true },
      {"id": "a46", "tema": "Folhetos", "ctx": "O dente é um órgão \"misto\": tecidos diferentes de um mesmo dente vêm de origens embrionárias diferentes. A aula 1 mostrou que a face também foge da regra do resto do corpo, porque boa parte dela vem de células que migram da crista neural. Considerando o texto, analise as afirmativas a seguir.", "af": ["O esmalte deriva do ectoderma.", "A dentina, a polpa e o cemento derivam do ectomesênquima, vindo da crista neural.", "A musculatura da mastigação e da mímica deriva do endoderma."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas.", "I, II e III."], "a": 1, "w": "I. Verdadeira: O ectoderma forma o órgão do esmalte. II. Verdadeira: É o ectomesênquima. III. Falsa: A musculatura da mastigação e da mímica vem do mesoderma.", "f": FONTE_AULA1, "fixa": true },
      {"id": "a47", "tema": "Embriologia", "ctx": "Uma paciente gestante pergunta ao cirurgião-dentista, durante a consulta, quando o bebê \"começa a se formar\". Ele aproveita para lembrar as primeiras semanas do desenvolvimento, da fecundação até a formação dos três folhetos germinativos. Considerando o texto, analise as afirmativas a seguir.", "af": ["A fecundação geralmente ocorre no terço distal da tuba uterina.", "A mórula se forma por volta do dia 4.", "O embrioblasto faz a implantação e origina a placenta.", "Na 3ª semana, pela linha primitiva, formam-se os três folhetos germinativos."], "p": "É correto o que se afirma em", "o": ["I e II, apenas.", "II e IV, apenas.", "I, II e III, apenas.", "I, II e IV, apenas.", "I, II, III e IV."], "a": 3, "w": "I. Verdadeira: Como na aula 1. II. Verdadeira: Dia 4 = mórula. III. Falsa: Quem faz a implantação e origina os anexos é o trofoblasto; o embrioblasto origina o embrião. IV. Verdadeira: É a gastrulação.", "f": FONTE_AULA1, "fixa": true },
      {"id": "a48", "tema": "Glândulas salivares", "ctx": "Paciente de 60 anos reclama de boca seca depois de começar um remédio novo. Ao examinar a saída da saliva na bochecha e no soalho da boca, o cirurgião-dentista revisa as glândulas salivares maiores e, de passagem, o que acontece com a dentina ao longo da vida. Considerando o texto, analise as afirmativas a seguir.", "af": ["A parótida é a maior glândula salivar.", "O ducto parotídeo se abre no vestíbulo na altura do 2º molar superior.", "A submandibular produz cerca de 60 a 65 % do volume salivar.", "A dentina secundária é a que se forma em resposta a uma lesão, como a cárie."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "III, apenas.", "I e II, apenas.", "I, II e III, apenas.", "I, II, III e IV."], "a": 3, "w": "I. Verdadeira: Maior em tamanho. II. Verdadeira: Na altura do colo do 2º molar superior. III. Verdadeira: É a segunda em tamanho e a que mais produz. IV. Falsa: Essa é a terciária; a secundária se forma depois que o forame apical se completa, mais lenta.", "f": FONTE_SM1 + "; " + WIKI_PAR, "net": true, "fixa": true },
      {"id": "a49", "tema": "Histologia", "ctx": "Na aula prática de 26/10, a turma observou ao microscópio uma lâmina de músculo estriado esquelético corada em HE. Para descrever a lâmina, é preciso falar da forma das fibras, da posição dos núcleos e dos envoltórios de tecido conjuntivo. Considerando o texto, analise as afirmativas a seguir.", "af": ["As fibras são longas, cilíndricas e multinucleadas.", "Os núcleos ficam no centro da fibra, um por célula.", "O endomísio envolve cada fibra e o perimísio envolve cada fascículo."], "p": "É correto o que se afirma em", "o": ["I, apenas.", "III, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas."], "a": 3, "w": "I. Verdadeira: Cada fibra é uma célula longa com vários núcleos. II. Falsa: Os núcleos são periféricos e numerosos; núcleo único e central é do músculo liso. III. Verdadeira: E o epimísio envolve o músculo inteiro.", "f": FONTE_HIST, "net": true, "fixa": true },
      {"id": "a50", "tema": "Terminologia", "ctx": "Para interpretar uma tomografia Cone Beam e para descrever as faces dos dentes no prontuário, o cirurgião-dentista precisa dominar os planos de secção do corpo e os termos de posição usados nos arcos dentários. Considerando o texto, analise as afirmativas a seguir.", "af": ["O plano sagital mediano divide o corpo em direita e esquerda.", "O plano coronal divide o corpo em anterior e posterior.", "Distal é a face do dente voltada para a linha média do arco."], "p": "Está correto o que se afirma em", "o": ["I, apenas.", "II, apenas.", "I e II, apenas.", "I e III, apenas.", "II e III, apenas."], "a": 2, "w": "I. Verdadeira: Sagital = direita e esquerda. II. Verdadeira: Coronal = anterior e posterior. III. Falsa: Voltada para a linha média é a MESIAL; distal se afasta dela.", "f": FONTE_AULA1, "fixa": true },
      {"id": "a10", "tema": "Anestesia", "ctx": "Paciente de 35 anos recebe anestesia do nervo mentual para uma cirurgia na gengiva vestibular dos incisivos inferiores. Já com o lábio dormente, ele pergunta, preocupado, se vai conseguir mexer a boca para falar até o fim do procedimento. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.", "af": ["A anestesia do nervo mentual deixa insensíveis o mento, o lábio inferior do lado e a gengiva vestibular da linha mediana até o 2º pré-molar.", "O nervo mentual é o nervo motor dos músculos do lábio inferior."], "ar": true, "p": "A respeito dessas asserções, assinale a opção correta.", "o": ["As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.", "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.", "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.", "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.", "As asserções I e II são proposições falsas."], "a": 2, "w": "I é verdadeira: é todo o território do mentual. II é falsa: o mentual é sensitivo; os músculos do lábio são da mímica, inervados pelo nervo facial, por isso o paciente continua mexendo o lábio.", "f": FONTE_ED14, "fixa": true },
      {"id": "a11", "tema": "Anestesia", "ctx": "Paciente de 50 anos vai extrair o primeiro molar inferior. O aluno faz o bloqueio convencional do alveolar inferior e do lingual, mas, ao descolar a gengiva vestibular do molar, o paciente reclama de dor. O professor diz que faltou uma anestesia. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.", "af": ["Para a extração de um molar inferior, o nervo bucal precisa ser anestesiado à parte.", "O bloqueio convencional do alveolar inferior não anestesia a mucosa e a gengiva vestibular dos molares, que são território do nervo bucal."], "ar": true, "p": "A respeito dessas asserções, assinale a opção correta.", "o": ["As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.", "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.", "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.", "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.", "As asserções I e II são proposições falsas."], "a": 0, "w": "As duas são verdadeiras e a II explica a I: como a vestibular dos molares é do bucal e o bloqueio convencional não a alcança, o bucal precisa de anestesia própria.", "f": FONTE_MAND + "; " + FONTE_ED14, "fixa": true },
      {"id": "a20", "tema": "Anestesia", "ctx": "Paciente de 28 anos chega com pericoronarite no terceiro molar inferior e mal consegue abrir a boca. O aluno pensa em fazer o bloqueio convencional do alveolar inferior, mas o professor sugere outra técnica. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.", "af": ["A técnica de Vazirani-Akinosi é indicada para o paciente com trismo.", "A Vazirani-Akinosi é feita com a boca fechada, com a agulha paralela ao plano oclusal, na altura do rebordo alveolar superior."], "ar": true, "p": "A respeito dessas asserções, assinale a opção correta.", "o": ["As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.", "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.", "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.", "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.", "As asserções I e II são proposições falsas."], "a": 0, "w": "As duas são verdadeiras e a II justifica a I: por ser feita de boca fechada, a técnica funciona em quem não consegue abrir a boca.", "f": FONTE_MAND, "fixa": true },
      {"id": "a21", "tema": "Anestesia", "ctx": "O bloqueio convencional do alveolar inferior falhou duas vezes num paciente de 33 anos. O professor indica a técnica de Gow-Gates e explica onde a agulha é posicionada e o que ela alcança. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.", "af": ["Na Gow-Gates, um único depósito anestesia os nervos alveolar inferior, lingual, bucal, auriculotemporal e milo-hióideo.", "Na Gow-Gates, o anestésico é depositado no triângulo retromolar, 6 a 10 mm acima do plano oclusal."], "ar": true, "p": "A respeito dessas asserções, assinale a opção correta.", "o": ["As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.", "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.", "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.", "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.", "As asserções I e II são proposições falsas."], "a": 2, "w": "I é verdadeira: a Gow-Gates pega todo o nervo mandibular. II é falsa: o triângulo retromolar, 6 a 10 mm acima do plano oclusal, é a punção da técnica convencional; na Gow-Gates a punção é distal ao 2º molar superior e a agulha vai ao colo do côndilo.", "f": FONTE_MAND, "fixa": true },
      {"id": "a22", "tema": "Anestesia", "ctx": "Paciente de 42 anos vai restaurar uma cárie profunda no canino inferior, com o dente vital. Um aluno propõe anestesiar só o nervo mentual, \"porque ele inerva a frente da mandíbula\". Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.", "af": ["O canino inferior, como dente, é anestesiado pelo nervo mentual.", "O nervo mentual inerva a gengiva vestibular da linha mediana até a área do 2º pré-molar."], "ar": true, "p": "A respeito dessas asserções, assinale a opção correta.", "o": ["As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.", "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.", "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.", "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.", "As asserções I e II são proposições falsas."], "a": 3, "w": "I é falsa: o dente é inervado só pelo alveolar inferior; o mentual cuida de tecidos de suporte, não do dente. II é verdadeira: esse é o território gengival do mentual.", "f": FONTE_ED14, "fixa": true },
      {"id": "a34", "tema": "Osteologia", "ctx": "Paciente de 27 anos procura o consultório com estalo e dor na frente da orelha ao mastigar. Ao explicar a queixa, o cirurgião-dentista mostra no crânio onde a mandíbula se encaixa e por que a articulação tem esse nome. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.", "af": ["A articulação entre a mandíbula e o crânio se chama temporomandibular.", "A cabeça da mandíbula se aloja na fossa mandibular do osso temporal."], "ar": true, "p": "A respeito dessas asserções, assinale a opção correta.", "o": ["As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.", "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.", "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.", "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.", "As asserções I e II são proposições falsas."], "a": 0, "w": "As duas são verdadeiras e a II justifica a I: o nome vem dos dois ossos que se articulam, temporal e mandíbula.", "f": FONTE_SM1 + "; " + NET_CRANIO, "net": true, "fixa": true },
      {"id": "a35", "tema": "Osteologia", "ctx": "No SM1, os forames do esfenoide confundiram muita gente. O professor pede que os alunos relacionem cada divisão do trigêmeo ao forame por onde ela sai e ao osso onde esse forame fica. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.", "af": ["O nervo mandibular (V3) sai do crânio pelo forame oval.", "O forame oval fica no osso occipital, ao lado do forame magno."], "ar": true, "p": "A respeito dessas asserções, assinale a opção correta.", "o": ["As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.", "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.", "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.", "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.", "As asserções I e II são proposições falsas."], "a": 2, "w": "I é verdadeira: oval = V3. II é falsa: o forame oval fica na asa maior do esfenoide; o forame magno é do occipital.", "f": FONTE_SM1 + "; " + WIKI_MAN, "net": true, "fixa": true },
      {"id": "a41", "tema": "Mímica", "ctx": "Durante a mastigação, o alimento tende a escorregar para o vestíbulo, entre os dentes e a bochecha. Um músculo da parede da bochecha devolve o alimento para cima dos dentes, e muitos alunos acham que ele é da mastigação. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.", "af": ["O bucinador é inervado pelo nervo facial.", "O bucinador comprime a bochecha contra os dentes e mantém o alimento sobre as faces oclusais."], "ar": true, "p": "A respeito dessas asserções, assinale a opção correta.", "o": ["As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.", "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.", "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.", "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.", "As asserções I e II são proposições falsas."], "a": 1, "w": "As duas são verdadeiras, mas a II não justifica a I: a inervação pelo facial vem de o bucinador ser músculo da mímica, não da função que ele tem na mastigação.", "f": FONTE_ED_MUSC + "; " + NET_FACE, "net": true, "fixa": true },
      {"id": "a45", "tema": "Vascularização", "ctx": "Num livro de anatomia, um aluno lê que a carótida externa \"some\" dentro de uma glândula da face. O professor explica que é ali que ela termina, dando seus dois ramos terminais. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.", "af": ["A carótida externa termina dividindo-se em artéria facial e artéria lingual.", "A carótida externa se divide nos seus ramos terminais dentro da glândula parótida, na altura do colo da mandíbula."], "ar": true, "p": "A respeito dessas asserções, assinale a opção correta.", "o": ["As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.", "As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.", "A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.", "A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.", "As asserções I e II são proposições falsas."], "a": 3, "w": "I é falsa: os ramos terminais são a maxilar e a temporal superficial; facial e lingual são colaterais. II é verdadeira.", "f": FONTE_ED_ART, "fixa": true }
    ]
  },
  carie: {
 "curso": "Odontologia",
 "materia": "Fundamentos Microbiológicos e Clínicos da Cárie",
 "curta": "Cárie",
 "codigo": "ARA4340",
 "prof": "SEBASTIÃO MAGNO",
 "turma": "3008",
 "proxima": "SM2 terça 10/11, na sala, no horário da aula. AV terça 24/11",
 "modos": [
  {
   "id": "completo",
   "nome": "Simulado completo",
   "sub": "10 questões sorteadas de toda a matéria.",
   "temas": null
  },
  {
   "id": "sm1ver",
   "nome": "Prova do SM1",
   "sub": "As 10 questões que caíram no SM1, na ordem da prova.",
   "temas": null,
   "sm1todo": true,
   "prefixo": "sa"
  },
  {
   "id": "t-etiologia",
   "nome": "Etiologia",
   "sub": "",
   "temas": [
    "Etiologia"
   ]
  },
  {
   "id": "t-desmineralização",
   "nome": "Desmineralização",
   "sub": "",
   "temas": [
    "Desmineralização"
   ]
  },
  {
   "id": "t-flúor",
   "nome": "Flúor",
   "sub": "",
   "temas": [
    "Flúor"
   ]
  },
  {
   "id": "t-diagnóstico",
   "nome": "Diagnóstico",
   "sub": "",
   "temas": [
    "Diagnóstico"
   ]
  },
  {
   "id": "t-prevenção",
   "nome": "Prevenção",
   "sub": "",
   "temas": [
    "Prevenção"
   ]
  },
  {
   "id": "t-saliva",
   "nome": "Saliva",
   "sub": "",
   "temas": [
    "Saliva"
   ]
  },
  {
   "id": "t-biofilme",
   "nome": "Biofilme",
   "sub": "",
   "temas": [
    "Biofilme"
   ]
  },
  {
   "id": "afirm",
   "nome": "Afirmativas I, II, III",
   "sub": "Questões no estilo \"está correto o que se afirma em\".",
   "temas": null,
   "af": true
  },
  {
   "id": "erros",
   "nome": "Revisar meus erros",
   "sub": "",
   "temas": null,
   "erros": true
  }
 ],
 "revisao": [
  {
   "t": "Cárie, o essencial",
   "i": [
    "Doença biofilme-açúcar dependente: dente + biofilme + açúcar + TEMPO (Keyes + Newbrun).",
    "Streptococcus mutans inicia a lesão em esmalte; lactobacilos aparecem mais na progressão.",
    "Sacarose é o açúcar mais cariogênico (vira glucano, o \"cimento\" do biofilme).",
    "pH crítico do esmalte ≈ 5,5 (fluorapatita ≈ 4,5).",
    "Curva de Stephan: pH cai em minutos e volta em 30 a 40 min. Frequência pesa mais que quantidade.",
    "Saliva: tampão (bicarbonato), cálcio e fosfato, limpeza. Boca seca = mais cárie."
   ]
  },
  {
   "t": "Flúor e lesões",
   "i": [
    "Flúor age principalmente de forma tópica; forma fluorapatita, mais resistente ao ácido.",
    "Excesso de flúor ingerido na formação do esmalte = fluorose.",
    "Mancha branca opaca e rugosa = lesão ativa e reversível. Brilhante, lisa e dura = inativa.",
    "Lesão não cavitada se trata sem broca: biofilme, dieta e flúor.",
    "Fóssulas e fissuras são os locais de maior risco; selante fecha esse nicho."
   ]
  }
 ],
 "q": [
  {
   "id": "c01",
   "tema": "Etiologia",
   "ctx": "A cárie dentária é hoje entendida como uma doença multifatorial, dependente da presença de biofilme e de açúcar na dieta ao longo do tempo.",
   "p": "Qual é o principal microrganismo associado ao início da lesão de cárie em esmalte?",
   "o": [
    "Lactobacillus acidophilus",
    "Streptococcus mutans",
    "Porphyromonas gingivalis",
    "Candida albicans",
    "Actinomyces naeslundii"
   ],
   "a": 1,
   "w": "O Streptococcus mutans é o principal associado ao início da lesão em esmalte: produz ácido a partir do açúcar e tolera pH baixo. Os lactobacilos aparecem mais na progressão (dentina). P. gingivalis é periodontal.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "sm1par": true
  },
  {
   "id": "c02",
   "tema": "Etiologia",
   "ctx": "Paul Keyes descreveu a cárie com três círculos que se sobrepõem. Newbrun depois acrescentou um quarto fator.",
   "p": "Qual fator Newbrun acrescentou aos três de Keyes (hospedeiro, microbiota e dieta)?",
   "o": [
    "Saliva",
    "Flúor",
    "Tempo",
    "Higiene oral",
    "Genética"
   ],
   "a": 2,
   "w": "Keyes: hospedeiro (dente), microbiota e dieta (substrato). Newbrun acrescentou o TEMPO: os três precisam agir juntos por tempo suficiente.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "sm1par": true
  },
  {
   "id": "c03",
   "tema": "Etiologia",
   "ctx": "Os açúcares da dieta são o substrato que as bactérias cariogênicas fermentam para produzir ácidos.",
   "p": "Qual açúcar é considerado o mais cariogênico?",
   "o": [
    "Lactose",
    "Sacarose",
    "Xilitol",
    "Amido cru",
    "Sorbitol"
   ],
   "a": 1,
   "w": "A sacarose é a mais cariogênica: é fermentada rápido e serve para a bactéria formar polissacarídeos extracelulares (glucanos) que dão aderência ao biofilme. Xilitol e sorbitol não são fermentados.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c04",
   "tema": "Etiologia",
   "ctx": "O Streptococcus mutans produz enzimas que usam a sacarose para formar um \"cimento\" que prende o biofilme ao dente.",
   "p": "Qual é esse produto?",
   "o": [
    "Ácido lático",
    "Glucanos (polissacarídeos extracelulares)",
    "Amônia",
    "Proteínas salivares",
    "Hidroxiapatita"
   ],
   "a": 1,
   "w": "As glicosiltransferases transformam sacarose em glucanos insolúveis, que deixam o biofilme mais aderente e espesso. O ácido lático é o que desmineraliza.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c05",
   "tema": "Etiologia",
   "ctx": "A cárie é chamada hoje de doença biofilme-açúcar dependente e não-transmissível.",
   "p": "Isso significa que",
   "o": [
    "basta ter a bactéria para ter cárie.",
    "sem açúcar frequente na dieta o biofilme dificilmente causa lesão.",
    "a cárie passa de pessoa para pessoa como uma gripe.",
    "a cárie não tem relação com a higiene.",
    "o flúor elimina as bactérias da boca."
   ],
   "a": 1,
   "w": "A visão atual: a bactéria está em quase todo mundo; o que desequilibra é a exposição frequente ao açúcar sobre o biofilme. Por isso não é tratada como doença infecciosa transmissível.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "sm1par": true
  },
  {
   "id": "c06",
   "tema": "Desmineralização",
   "ctx": "O esmalte é formado principalmente por cristais de hidroxiapatita, que se dissolvem quando o meio fica ácido.",
   "p": "Abaixo de qual pH, aproximadamente, o esmalte começa a se desmineralizar?",
   "o": [
    "7,0",
    "6,5",
    "5,5",
    "4,0",
    "3,0"
   ],
   "a": 2,
   "w": "O pH crítico do esmalte é cerca de 5,5. Abaixo disso a saliva fica subsaturada de cálcio e fosfato e o esmalte perde mineral. (Para a fluorapatita o pH crítico é mais baixo, cerca de 4,5.)",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "sm1par": true
  },
  {
   "id": "c07",
   "tema": "Desmineralização",
   "ctx": "Depois que a pessoa ingere açúcar, o pH do biofilme cai rapidamente e volta ao normal aos poucos.",
   "p": "Como se chama o gráfico que mostra essa queda e a recuperação do pH?",
   "o": [
    "Curva de Spee",
    "Curva de Stephan",
    "Curva de Wilson",
    "Índice de O'Leary",
    "Triângulo de Keyes"
   ],
   "a": 1,
   "w": "Curva de Stephan: queda do pH em poucos minutos após o açúcar e volta em cerca de 30 a 40 minutos. Spee e Wilson são curvas de oclusão.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "sm1par": true
  },
  {
   "id": "c08",
   "tema": "Desmineralização",
   "ctx": "Uma paciente toma café com açúcar em pequenos goles, várias vezes ao longo do dia, sem aumentar a quantidade total de açúcar.",
   "p": "Pela Curva de Stephan, qual é o efeito disso?",
   "o": [
    "Nenhum, pois a quantidade total de açúcar é a mesma.",
    "O pH fica abaixo do crítico muitas vezes ao dia, aumentando o risco de cárie.",
    "O pH sobe e protege o esmalte.",
    "Aumenta só o risco de doença periodontal.",
    "A saliva neutraliza tudo na hora."
   ],
   "a": 1,
   "w": "O que mais pesa é a FREQUÊNCIA. Cada exposição derruba o pH; com muitas exposições o dente passa mais tempo desmineralizando do que se recuperando.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "sm1par": true
  },
  {
   "id": "c09",
   "tema": "Desmineralização",
   "ctx": "A saliva tem papel importante na proteção do dente contra a cárie.",
   "p": "Qual destes NÃO é um efeito protetor da saliva?",
   "o": [
    "Capacidade tampão (bicarbonato)",
    "Fornecer cálcio e fosfato para remineralizar",
    "Limpar restos de alimento",
    "Diminuir o pH do biofilme",
    "Formar a película adquirida"
   ],
   "a": 3,
   "w": "A saliva SOBE e estabiliza o pH (tampão bicarbonato), repõe cálcio e fosfato e faz limpeza. Diminuir o pH é o efeito do ácido bacteriano, não da saliva.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c10",
   "tema": "Desmineralização",
   "ctx": "Um paciente em tratamento de câncer de cabeça e pescoço passou a ter boca seca (xerostomia) após radioterapia.",
   "p": "Por que o risco de cárie desse paciente aumenta?",
   "o": [
    "Porque a radiação deixa o esmalte mais duro.",
    "Porque com menos saliva há menos tampão, menos limpeza e menos remineralização.",
    "Porque a radiação mata o Streptococcus mutans.",
    "Porque a xerostomia aumenta o pH da boca.",
    "Porque o flúor deixa de funcionar."
   ],
   "a": 1,
   "w": "Sem saliva o pH demora a voltar, o açúcar fica mais tempo no dente e não há cálcio/fosfato para repor. É a chamada cárie de radiação.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c11",
   "tema": "Flúor",
   "ctx": "O flúor é a principal ferramenta de prevenção da cárie.",
   "p": "Qual é o principal mecanismo de ação do flúor?",
   "o": [
    "Matar todas as bactérias da boca",
    "Agir no meio bucal, reduzindo a desmineralização e favorecendo a remineralização",
    "Tornar o esmalte impermeável a qualquer ácido",
    "Aumentar a produção de saliva",
    "Substituir a escovação"
   ],
   "a": 1,
   "w": "O efeito principal é TÓPICO: flúor presente na saliva e no biofilme diminui a perda de mineral na queda de pH e ajuda a repor mineral quando o pH sobe, formando fluorapatita.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c12",
   "tema": "Flúor",
   "ctx": "No esmalte, o flúor pode substituir a hidroxila da hidroxiapatita.",
   "p": "Que composto se forma e qual a vantagem?",
   "o": [
    "Fluorapatita, mais resistente ao ácido",
    "Fluoreto de cálcio, que deixa o dente mais branco",
    "Hidroxiapatita pura, mais dura",
    "Carbonato de cálcio, mais solúvel",
    "Fosfato de flúor, que mata bactérias"
   ],
   "a": 0,
   "w": "Forma fluorapatita (e hidroxiapatita fluoretada), que só se dissolve em pH mais baixo (cerca de 4,5), resistindo mais ao ácido.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "sm1par": true
  },
  {
   "id": "c13",
   "tema": "Flúor",
   "ctx": "A fluoretação da água de abastecimento é uma medida de saúde pública no Brasil.",
   "p": "Essa medida é classificada como",
   "o": [
    "individual e de alto custo",
    "coletiva, de baixo custo e de grande alcance",
    "exclusiva de consultório",
    "tratamento restaurador",
    "medida só para crianças"
   ],
   "a": 1,
   "w": "Água fluoretada atinge toda a população servida, custa pouco e é uma das medidas mais eficazes de prevenção coletiva da cárie.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c14",
   "tema": "Flúor",
   "ctx": "Uma criança de 3 anos engole frequentemente grande quantidade de pasta com flúor durante a formação dos dentes permanentes.",
   "p": "Qual é o risco?",
   "o": [
    "Cárie de mamadeira",
    "Fluorose dentária",
    "Erosão dentária",
    "Hipoplasia por tetraciclina",
    "Amelogênese imperfeita"
   ],
   "a": 1,
   "w": "Excesso de flúor ingerido enquanto o esmalte se forma causa fluorose (manchas brancas a marrons). Por isso, para crianças, quantidade de pasta tipo grão de arroz.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c15",
   "tema": "Diagnóstico",
   "ctx": "Ao secar o dente com ar, o dentista vê uma área branca, opaca e rugosa na cervical de um pré-molar, sem cavidade.",
   "p": "Essa lesão é chamada de",
   "o": [
    "Fluorose",
    "Mancha branca ativa (lesão inicial de cárie)",
    "Cárie de dentina",
    "Abrasão",
    "Mancha extrínseca"
   ],
   "a": 1,
   "w": "Mancha branca opaca e rugosa = lesão inicial ATIVA em esmalte. É reversível (pode paralisar) com controle de biofilme, dieta e flúor.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c16",
   "tema": "Diagnóstico",
   "ctx": "Lesões de cárie podem estar ativas ou inativas (paralisadas).",
   "p": "Qual característica indica lesão INATIVA em esmalte?",
   "o": [
    "Opaca e rugosa",
    "Próxima à margem gengival com biofilme",
    "Brilhante, lisa e dura",
    "Amolecida à sondagem",
    "Com biofilme espesso por cima"
   ],
   "a": 2,
   "w": "Inativa: brilhante, lisa, dura, geralmente longe do acúmulo de placa. Ativa: opaca, rugosa, coberta de biofilme.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c17",
   "tema": "Diagnóstico",
   "ctx": "Na dentina, a cárie progride com mais facilidade que no esmalte.",
   "p": "Qual é o motivo?",
   "o": [
    "A dentina é mais mineralizada que o esmalte.",
    "A dentina tem menos mineral, mais matéria orgânica e túbulos que facilitam o avanço.",
    "A dentina não tem contato com a polpa.",
    "A dentina é formada por ameloblastos.",
    "A dentina não sofre ação de ácidos."
   ],
   "a": 1,
   "w": "Esmalte ~96% mineral; dentina ~70%, com colágeno e túbulos. Por isso a lesão se espalha mais na dentina (forma de triângulo com base na junção amelodentinária em fóssulas).",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c18",
   "tema": "Diagnóstico",
   "ctx": "Em superfícies lisas, a lesão de cárie no esmalte tem forma característica.",
   "p": "Qual é a forma da lesão em superfície lisa no esmalte?",
   "o": [
    "Triângulo com o vértice voltado para a junção amelodentinária",
    "Triângulo com a base voltada para a junção amelodentinária",
    "Círculo perfeito",
    "Linha reta paralela à superfície",
    "Não tem forma definida"
   ],
   "a": 0,
   "w": "Superfície lisa: cone (triângulo) com a BASE na superfície e o VÉRTICE apontando para a junção amelodentinária. Em fóssulas e fissuras é o contrário no esmalte.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c19",
   "tema": "Diagnóstico",
   "ctx": "A cárie tem preferência por locais onde o biofilme fica protegido da escovação e da saliva.",
   "p": "Qual destes é um local de maior risco?",
   "o": [
    "Ponta de cúspide",
    "Fóssulas e fissuras oclusais",
    "Face vestibular dos incisivos inferiores",
    "Borda incisal",
    "Superfície polida de uma coroa"
   ],
   "a": 1,
   "w": "Fóssulas e fissuras retêm biofilme e são difíceis de limpar; por isso são as áreas mais atingidas, principalmente nos molares recém-erupcionados.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c20",
   "tema": "Prevenção",
   "ctx": "Um adolescente com várias manchas brancas ativas pergunta o que fazer.",
   "p": "Qual conduta é a mais adequada para paralisar essas lesões?",
   "o": [
    "Restaurar todas as manchas imediatamente",
    "Controle de biofilme, redução da frequência de açúcar e flúor tópico",
    "Só trocar a escova",
    "Usar apenas enxaguante sem flúor",
    "Extrair os dentes afetados"
   ],
   "a": 1,
   "w": "Lesão não cavitada se trata sem broca: remover a causa (biofilme e açúcar frequente) e usar flúor para remineralizar.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c21",
   "tema": "Prevenção",
   "ctx": "Selantes são usados na prevenção da cárie em dentes posteriores.",
   "p": "Qual é a função do selante?",
   "o": [
    "Clarear o dente",
    "Fechar fóssulas e fissuras, impedindo o acúmulo de biofilme",
    "Substituir o flúor",
    "Tratar cárie de dentina",
    "Aumentar a saliva"
   ],
   "a": 1,
   "w": "O selante preenche fóssulas e fissuras, tirando o nicho onde o biofilme se protege.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "c22",
   "tema": "Prevenção",
   "ctx": "Alguns adoçantes são considerados não cariogênicos.",
   "p": "Qual destes não é fermentado pelas bactérias cariogênicas?",
   "o": [
    "Glicose",
    "Frutose",
    "Sacarose",
    "Xilitol",
    "Maltose"
   ],
   "a": 3,
   "w": "O xilitol não é fermentado pelo S. mutans, então não baixa o pH. Glicose, frutose, sacarose e maltose são fermentáveis.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true
  },
  {
   "id": "a01",
   "tema": "Etiologia",
   "ctx": "Uma criança de 5 anos tem várias cáries. A mãe conta que ela toma suco adoçado na mamadeira várias vezes ao dia e dorme mamando. O dentista explica que a cárie depende da interação entre o dente, o biofilme, o açúcar e o tempo. Considerando o caso, analise as afirmativas a seguir.",
   "p": "Está correto o que se afirma em",
   "o": [
    "I, apenas.",
    "II, apenas.",
    "I e II, apenas.",
    "II e III, apenas.",
    "I, II e III."
   ],
   "a": 2,
   "w": "I. Verdadeira: a frequência derruba o pH muitas vezes. II. Verdadeira: dormindo cai o fluxo de saliva, o açúcar fica mais tempo. III. Falsa: só trocar a escova não resolve; o fator principal aqui é a dieta.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "af": [
    "A alta frequência de ingestão de açúcar mantém o pH do biofilme abaixo do crítico por mais tempo.",
    "Durante o sono o fluxo salivar diminui, reduzindo a proteção contra a queda de pH.",
    "Basta trocar a escova da criança para controlar a doença, sem mudar a dieta."
   ],
   "fixa": true
  },
  {
   "id": "a02",
   "tema": "Flúor",
   "ctx": "Em uma ação de saúde na escola, a equipe orienta sobre o uso do flúor. A dentista lembra que o flúor age principalmente quando está presente na boca no momento do desafio ácido. Considerando o texto, analise as afirmativas a seguir.",
   "p": "Está correto o que se afirma em",
   "o": [
    "I, apenas.",
    "II, apenas.",
    "I e II, apenas.",
    "II e III, apenas.",
    "I, II e III."
   ],
   "a": 4,
   "w": "I. Verdadeira: o efeito principal é tópico. II. Verdadeira: forma fluorapatita, mais resistente. III. Verdadeira: excesso ingerido na formação do esmalte causa fluorose.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "af": [
    "O principal efeito anticárie do flúor é tópico, no meio bucal.",
    "O flúor favorece a formação de fluorapatita, menos solúvel em ácido que a hidroxiapatita.",
    "A ingestão excessiva de flúor durante a formação dos dentes pode causar fluorose."
   ],
   "fixa": true,
   "sm1par": true
  },
  {
   "id": "a03",
   "tema": "Diagnóstico",
   "ctx": "Durante o exame clínico, após secar os dentes, o examinador encontra uma lesão branca opaca e rugosa na cervical de um molar, sem cavidade, coberta por biofilme. Considerando o achado, analise as afirmativas a seguir.",
   "p": "Está correto o que se afirma em",
   "o": [
    "I, apenas.",
    "II, apenas.",
    "I e II, apenas.",
    "II e III, apenas.",
    "I, II e III."
   ],
   "a": 0,
   "w": "I. Verdadeira: opaca, rugosa e com biofilme = ativa. II. Falsa: não cavitada não precisa de broca; trata-se com controle de biofilme, dieta e flúor. III. Falsa: mancha branca ativa pode ser paralisada (é reversível).",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "af": [
    "As características indicam lesão de cárie ativa em esmalte.",
    "A conduta indicada é restaurar imediatamente com resina.",
    "Esse tipo de lesão é irreversível e sempre evolui para cavidade."
   ],
   "fixa": true
  },
  {
   "id": "a04",
   "tema": "Saliva",
   "ctx": "Um paciente usa medicamentos que reduzem a saliva e passou a ter muitas lesões de cárie novas em pouco tempo. O dentista explica a importância da saliva na proteção dos dentes. Considerando o texto, analise as afirmativas a seguir.",
   "p": "Está correto o que se afirma em",
   "o": [
    "I, apenas.",
    "II, apenas.",
    "I e II, apenas.",
    "II e III, apenas.",
    "I, II e III."
   ],
   "a": 2,
   "w": "I. Verdadeira: bicarbonato tampona. II. Verdadeira: cálcio e fosfato da saliva remineralizam. III. Falsa: a saliva eleva o pH, não diminui.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "af": [
    "O bicarbonato da saliva ajuda a neutralizar os ácidos do biofilme.",
    "A saliva fornece cálcio e fosfato para a remineralização do esmalte.",
    "A saliva reduz o pH do biofilme, favorecendo a remineralização."
   ],
   "fixa": true
  },
  {
   "id": "r01",
   "tema": "Desmineralização",
   "ctx": "Uma paciente costuma beliscar doces ao longo de todo o dia, mesmo comendo pouca quantidade de cada vez. Avalie as asserções a seguir e a relação proposta entre elas.",
   "p": "A respeito dessas asserções, assinale a opção correta.",
   "o": [
    "As asserções I e II são verdadeiras, e a II é uma justificativa correta da I.",
    "As asserções I e II são verdadeiras, mas a II não é uma justificativa correta da I.",
    "A asserção I é verdadeira, e a II é falsa.",
    "A asserção I é falsa, e a II é verdadeira.",
    "As asserções I e II são falsas."
   ],
   "a": 0,
   "w": "I verdadeira: muitas exposições aumentam o risco. II verdadeira e justifica: cada exposição derruba o pH abaixo de 5,5 e o tempo de desmineralização soma.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "af": [
    "A frequência de consumo de açúcar é mais importante para a cárie do que a quantidade total consumida.",
    "Cada exposição ao açúcar faz o pH do biofilme cair abaixo do crítico, e com exposições repetidas o dente passa mais tempo desmineralizando do que se remineralizando."
   ],
   "fixa": true,
   "ar": true
  },
  {
   "id": "sa01",
   "sm1": true,
   "tema": "Desmineralização",
   "ctx": "Durante o processo de desenvolvimento da lesão de cárie, a queda do pH do meio bucal favorece inicialmente:",
   "p": "",
   "o": [
    "A reposição de minerais no esmalte.",
    "A dissolução mineral e a desmineralização.",
    "A formação imediata de dentina terciária.",
    "A mineralização completa do biofilme.",
    "A redução da porosidade do esmalte."
   ],
   "a": 1,
   "w": "Abaixo do pH crítico o meio fica subsaturado de cálcio e fosfato e o esmalte perde mineral (desmineralização).",
   "f": "SM1 de Cárie, 22/09/2026, prof. Sebastião Magno, questão 1 (questão original da prova)",
   "net": false
  },
  {
   "id": "sa02",
   "sm1": true,
   "tema": "Etiologia",
   "ctx": "Um paciente apresenta alimentação com elevada frequência de açúcares. Ao longo do dia, seu biofilme sofre repetidas quedas de pH. Com o passar do tempo, aumenta a proporção de microrganismos capazes de produzir e tolerar ambientes ácidos.",
   "p": "Esse quadro caracteriza:",
   "o": [
    "Homeostase.",
    "Disbiose.",
    "Remineralização fisiológica.",
    "Esterilização do biofilme.",
    "Ausência de atividade microbiana."
   ],
   "a": 1,
   "w": "Disbiose: o açúcar frequente seleciona bactérias acidogênicas e acidúricas e o biofilme perde o equilíbrio. Homeostase seria o equilíbrio.",
   "f": "SM1 de Cárie, 22/09/2026, prof. Sebastião Magno, questão 2 (questão original da prova)",
   "net": false
  },
  {
   "id": "sa03",
   "sm1": true,
   "tema": "Flúor",
   "ctx": "A hidroxiapatita presente nos tecidos dentários pode sofrer substituições iônicas. Considerando a substituição dos íons hidroxila por íons fluoreto, qual consequência é esperada?",
   "p": "",
   "o": [
    "Aumento da solubilidade do esmalte em meio ácido.",
    "Redução da estabilidade dos cristais de hidroxiapatita.",
    "Aumento da resistência à ação dos ácidos e redução da suscetibilidade à cárie.",
    "Aumento da concentração de carbonato no cristal.",
    "Facilitação da dissolução mineral durante a queda do pH."
   ],
   "a": 2,
   "w": "Fluoreto no lugar da hidroxila forma fluorapatita, menos solúvel em ácido, então o esmalte resiste mais à cárie.",
   "f": "SM1 de Cárie, 22/09/2026, prof. Sebastião Magno, questão 3 (questão original da prova)",
   "net": false
  },
  {
   "id": "sa04",
   "sm1": true,
   "tema": "Biofilme",
   "ctx": "A formação do biofilme dental ocorre de maneira organizada e envolve diferentes etapas.",
   "p": "Qual alternativa apresenta a sequência correta?",
   "o": [
    "Colonização → película adquirida → maturação → multiplicação → dispersão.",
    "Película adquirida → maturação → colonização → dispersão → multiplicação.",
    "Multiplicação → colonização → película adquirida → maturação → dispersão.",
    "Película adquirida → dispersão → colonização → sucessão → maturação.",
    "Película adquirida → colonização microbiana → multiplicação microbiana → sucessão microbiana → maturação → dispersão."
   ],
   "a": 4,
   "w": "A sequência completa é película adquirida, colonização, multiplicação, sucessão, maturação e dispersão.",
   "f": "SM1 de Cárie, 22/09/2026, prof. Sebastião Magno, questão 4 (questão original da prova)",
   "net": false
  },
  {
   "id": "sa05",
   "sm1": true,
   "tema": "Etiologia",
   "ctx": "Um estudante afirma: “Se identificarmos Streptococcus mutans na saliva de um paciente, podemos afirmar que ele apresenta doença cárie.”",
   "p": "A afirmação está:",
   "o": [
    "Correta, pois S. mutans é a única bactéria relacionada à cárie.",
    "Correta, pois qualquer quantidade de S. mutans provoca desmineralização.",
    "Incorreta, pois a presença de S. mutans isoladamente não significa doença.",
    "Incorreta, pois S. mutans não produz ácidos.",
    "Correta apenas em pacientes adultos."
   ],
   "a": 2,
   "w": "Ter S. mutans não é ter a doença. A cárie depende de açúcar frequente, biofilme e tempo, ou seja, do desequilíbrio.",
   "f": "SM1 de Cárie, 22/09/2026, prof. Sebastião Magno, questão 5 (questão original da prova)",
   "net": false
  },
  {
   "id": "sa06",
   "sm1": true,
   "tema": "Etiologia",
   "ctx": "No modelo ecológico atual que explica a Cárie Dentária, conhecido originalmente através da tríade proposta por Keyes e complementada por Newbrun, o desenvolvimento da doença depende, essencialmente, da sobreposição temporal (Tempo) de quais três fatores principais primários?",
   "p": "",
   "o": [
    "Hospedeiro (dente e saliva), Parasita (vírus e fungos) e Imunidade sistêmica.",
    "Genética individual, Condição socioeconômica e Biofilme dental.",
    "Hospedeiro maduro (idade cronológica), Acidez estomacal e Qualidade de restaurações prévias.",
    "Bactérias proteolíticas específicas, Glicogênio salivar celular e Fator pH inato.",
    "Biofilme bacteriano (microbiota cariogênica), Substrato (dieta rica em carboidratos fermentáveis) e Hospedeiro suscetível (dente)."
   ],
   "a": 4,
   "w": "Keyes: hospedeiro, microbiota e dieta (substrato). Newbrun acrescentou o tempo.",
   "f": "SM1 de Cárie, 22/09/2026, prof. Sebastião Magno, questão 6 (questão original da prova)",
   "net": false
  },
  {
   "id": "sa07",
   "sm1": true,
   "tema": "Desmineralização",
   "ctx": "Um paciente infantil com dieta rica em carboidratos fermentáveis (frequente ingestão de sacarose) apresenta lesões de cárie de mancha branca ativas no esmalte. O biofilme dental do paciente é predominantemente composto por Streptococcus mutans. Sob excesso de carboidratos, essas bactérias realizam fermentação homolática.",
   "p": "Qual a consequência metabólica direta desse processo para o microambiente do esmalte dental?",
   "o": [
    "Consumo de todo o oxigênio local sem produção de ácidos, aumentando o pH do biofilme acima de 7,0.",
    "Conversão da glicose em ácido lático como produto final, promovendo uma rápida queda do pH abaixo do nível crítico 5.0 e a desmineralização da hidroxiapatita.",
    "Oxidação completa da glicose a CO2 e H2O via Ciclo de Krebs, gerando alcalinização salivar.",
    "Produção exclusiva de etanol e gás carbônico, inibindo o crescimento de Lactobacillus.",
    "Síntese de ureia para neutralização dos ácidos formados pelos tecidos pulpares."
   ],
   "a": 1,
   "w": "Fermentação homolática transforma glicose em ácido lático, o pH cai abaixo do crítico e a hidroxiapatita desmineraliza.",
   "f": "SM1 de Cárie, 22/09/2026, prof. Sebastião Magno, questão 7 (questão original da prova)",
   "net": false
  },
  {
   "id": "sa08",
   "sm1": true,
   "tema": "Biofilme",
   "ctx": "formação do biofilme dentário é um processo dinâmico e contínuo que se inicia logo após a profilaxia e escovação. Em relação à fase inicial desse processo e à formação da \"Película Adquirida\", assinale a alternativa correta:",
   "p": "",
   "o": [
    "A película adquirida é formada exclusivamente por bactérias gram-positivas e resíduos alimentares que se depositam sobre o esmalte em até 2 horas após a escovação.",
    "A enzima amilase, proveniente do fluido gengival, é o principal componente estrutural responsável pela carga altamente positiva da película adquirida.",
    "Trata-se de uma biopelícula formada pela adsorção de proteínas e glicoproteínas salivares e do fluido gengival na superfície dentária, sendo normalmente livre de bactérias em sua fase inicial.",
    "A ligação inicial dos microrganismos à película adquirida ocorre exclusivamente através de ligações covalentes irreversíveis propiciadas por mutacinas.",
    "A película adquirida atua como uma barreira física que impede totalmente qualquer troca iônica de desmineralização ou remineralização entre o dente e a saliva."
   ],
   "a": 2,
   "w": "A película adquirida é feita de proteínas e glicoproteínas da saliva e do fluido gengival, e no começo não tem bactéria.",
   "f": "SM1 de Cárie, 22/09/2026, prof. Sebastião Magno, questão 8 (questão original da prova)",
   "net": false
  },
  {
   "id": "sa09",
   "sm1": true,
   "tema": "Biofilme",
   "ctx": "No estudo do comportamento sociológico e funcional do biofilme dentário, os microrganismos utilizam um mecanismo de regulação denominado Quorum Sensing.",
   "p": "Assinale a alternativa que melhor descreve clinicamente esse fenômeno em biofilmes maduros:",
   "o": [
    "Refere-se à capacidade que o esmalte dentário tem de identificar quando as reservas de cálcio estão em falta na estrutura molecular intra-prismática.",
    "É a habilidade mecânica da saliva de diluir ácidos produzidos durante a madrugada, impedindo variações no gradiente de íons do fluido crevicular.",
    "É a morte celular programada de colonizadores primários logo que os carboidratos se esgotam na película adquirida, mediando uma dispersão estéril no biofilme bacteriano.",
    "Trata-se da comunicação interbacteriana dependente da densidade celular, permitindo, através de sinalizadores químicos, que o biofilme atue de modo coordenado, expressando, por exemplo, genes de resistência a antimicrobianos.",
    "Consiste na atração magnética gerada pelas diferenças de valência iônica entre os fluidos sulculares positivos e os polissacarídeos bacterianos negativos, propiciando adesão imediata em toda a mucosa oral."
   ],
   "a": 3,
   "w": "Quorum sensing é a comunicação entre bactérias que depende da densidade, com sinais químicos que coordenam o biofilme.",
   "f": "SM1 de Cárie, 22/09/2026, prof. Sebastião Magno, questão 9 (questão original da prova)",
   "net": false
  },
  {
   "id": "sa10",
   "sm1": true,
   "tema": "Prevenção",
   "ctx": "Competência avaliada (DCN): Tomada de decisões\nEm 2025, a Organização Mundial da Saúde publicou atualização sobre a relação entre consumo de açúcares e cárie dentária. O documento reconheceu os açúcares livres como importante fator dietético relacionado ao desenvolvimento da doença. A OMS também destacou que a cárie ocorre pela interação entre o biofilme dental, os açúcares e a produção de ácidos. Além disso, ressaltou que fatores sociais e comerciais influenciam os padrões de consumo alimentar. Na aula de microbiologia oral, a queda frequente do pH foi apresentada como fator seletivo para microrganismos acidúricos. Em uma escola, a equipe de saúde identifica consumo frequente de bebidas açucaradas durante o período escolar. Os estudantes também apresentam acúmulo de biofilme e relatos de consumo repetido de produtos açucarados ao longo do dia. Diante desse cenário, a equipe precisa selecionar uma intervenção prioritária e fundamentada em evidências.\nFonte: World Health Organization, Sugars and dental caries: WHO technical note, 2025.",
   "p": "Considerando as informações epidemiológicas e microbiológicas apresentadas, qual decisão apresenta maior adequação para reduzir o risco de progressão da cárie nesse grupo?",
   "o": [
    "Substituir todas as ações educativas por aplicação periódica de antimicrobianos, buscando reduzir globalmente a quantidade de bactérias da cavidade oral.",
    "Concentrar a intervenção na remoção profissional do cálculo dental, pois a alteração do pH decorrente do consumo de açúcares possui pouca influência sobre a microbiota.",
    "Orientar exclusivamente a escovação após o consumo de bebidas açucaradas, sem modificar a frequência de exposição aos açúcares.",
    "Reduzir a frequência de exposição aos açúcares, associando a medida ao controle do biofilme e ao acompanhamento das condições de saúde bucal.",
    "Indicar tratamento restaurador preventivo para todos os estudantes, independentemente da presença de lesões ou de fatores de risco individuais."
   ],
   "a": 3,
   "w": "O mais eficaz é diminuir a FREQUÊNCIA de açúcar e controlar o biofilme, com acompanhamento. Escovar sem mudar a dieta não resolve.",
   "f": "SM1 de Cárie, 22/09/2026, prof. Sebastião Magno, questão 10 (questão original da prova)",
   "net": false
  }
 ]
},
  inter: {
 "curso": "Odontologia",
 "materia": "Interações Biológicas e Patológicas",
 "curta": "Interações",
 "codigo": "ARA4380",
 "prof": "SEBASTIÃO MAGNO",
 "turma": "3007",
 "proxima": "SM2 terça 10/11, na sala, no horário da aula. AV terça 24/11",
 "modos": [
  {
   "id": "completo",
   "nome": "Simulado completo",
   "sub": "10 questões sorteadas de toda a matéria.",
   "temas": null
  },
  {
   "id": "sm1ver",
   "nome": "Prova do SM1",
   "sub": "As 10 questões que caíram no SM1, na ordem da prova.",
   "temas": null,
   "sm1todo": true,
   "prefixo": "sb"
  },
  {
   "id": "t-biofilme",
   "nome": "Biofilme",
   "sub": "",
   "temas": [
    "Biofilme"
   ]
  },
  {
   "id": "t-índice-de-placa",
   "nome": "Índice de placa",
   "sub": "",
   "temas": [
    "Índice de placa"
   ]
  },
  {
   "id": "t-glândulas-salivares",
   "nome": "Glândulas salivares",
   "sub": "",
   "temas": [
    "Glândulas salivares"
   ]
  },
  {
   "id": "t-diagnóstico-clínico",
   "nome": "Diagnóstico clínico",
   "sub": "",
   "temas": [
    "Diagnóstico clínico"
   ]
  },
  {
   "id": "t-patologia-geral",
   "nome": "Patologia geral",
   "sub": "",
   "temas": [
    "Patologia geral"
   ]
  },
  {
   "id": "t-lesões-fundamentais",
   "nome": "Lesões fundamentais",
   "sub": "",
   "temas": [
    "Lesões fundamentais"
   ]
  },
  {
   "id": "afirm",
   "nome": "Afirmativas I, II, III",
   "sub": "Questões no estilo \"está correto o que se afirma em\".",
   "temas": null,
   "af": true
  },
  {
   "id": "erros",
   "nome": "Revisar meus erros",
   "sub": "",
   "temas": null,
   "erros": true
  }
 ],
 "revisao": [
  {
   "t": "Interações (prof. Sebastião, 13/10)",
   "i": [
    "Película adquirida → colonizadores iniciais → tardios → biofilme maduro.",
    "Evidenciação de placa: corante em bochecho de ~30 s. Não faz quem tem resina na vestibular dos anteriores ou aparelho.",
    "O'Leary = faces coradas ÷ faces examinadas × 100. Cada dente = 5 faces.",
    "Ideal segundo o professor: 25 a 30%.",
    "Uso: todo paciente de primeira consulta, para ensinar a escovar."
   ]
  },
  {
   "t": "Patologia geral (caiu no SM1)",
   "i": [
    "Agressão → adaptação, lesão reversível ou lesão irreversível (morte).",
    "Hiperplasia = mais células. Hipertrofia = células maiores. Atrofia = menores. Metaplasia = troca de tipo de célula.",
    "Etiologia = causa. Patogênese = mecanismo. Morfologia (anatomia patológica) = alteração da forma. Fisiopatologia = alteração da função.",
    "Semiologia = sinais e sintomas. Propedêutica = diagnóstico por sinais, sintomas e exames.",
    "Lesões fundamentais: mácula (cor, plana), pápula (sólida pequena), nódulo (sólido maior), vesícula (líquido pequena), bolha (líquido maior), erosão, úlcera.",
    "Mucocele: lábio inferior, azulada, flutuante, aumenta e diminui, trauma rompe o ducto e o muco extravasa."
   ]
  }
 ],
 "q": [
  {
   "id": "c23",
   "tema": "Biofilme",
   "ctx": "Após a escovação, forma-se sobre o esmalte uma película de proteínas salivares, onde as primeiras bactérias se prendem.",
   "p": "Como se chama essa camada?",
   "o": [
    "Cálculo dentário",
    "Película adquirida",
    "Cutícula de Nasmyth",
    "Biofilme maduro",
    "Matéria alba"
   ],
   "a": 1,
   "w": "A película adquirida (proteínas da saliva) se forma em minutos. Nela aderem os colonizadores iniciais e, em camadas, o biofilme amadurece.",
   "f": "Pesquisa da Mônica (cariologia básica: Fejerskov & Kidd, Cariologia clínica; Ministério da Saúde, Saúde Bucal no SUS, 2018). Conferir com o material do professor.",
   "net": true,
   "sm1par": true
  },
  {
   "id": "c24",
   "tema": "Biofilme",
   "ctx": "O professor explicou que as bactérias vão se instalando no dente em camadas ao longo do tempo.",
   "p": "Qual a ordem correta?",
   "o": [
    "Biofilme maduro → película → colonizadores iniciais",
    "Película adquirida → colonizadores iniciais → colonizadores tardios → biofilme maduro",
    "Cálculo → película → bactéria",
    "Colonizadores tardios → película → biofilme",
    "Biofilme maduro → cálculo → película"
   ],
   "a": 1,
   "w": "Primeiro a película, depois as bactérias pioneiras (estreptococos), depois as tardias, até o biofilme maduro.",
   "f": "Aula de Interações Biológicas e Patológicas, prof. Sebastião Magno, 13/10/2026 (transcrição da turma)",
   "net": false,
   "sm1par": true
  },
  {
   "id": "c25",
   "tema": "Índice de placa",
   "ctx": "No exame de placa feito em aula, foi usado um corante para tornar o biofilme visível.",
   "p": "Como se chama esse procedimento?",
   "o": [
    "Profilaxia",
    "Evidenciação de placa",
    "Raspagem",
    "Selamento",
    "Fluorterapia"
   ],
   "a": 1,
   "w": "Evidenciação de placa: o corante (bochecho de cerca de 30 segundos) cora o biofilme e mostra ao paciente onde ele está.",
   "f": "Aula de Interações Biológicas e Patológicas, prof. Sebastião Magno, 13/10/2026 (transcrição da turma)",
   "net": false
  },
  {
   "id": "c26",
   "tema": "Índice de placa",
   "ctx": "O índice de O'Leary mede a porcentagem de faces com placa.",
   "p": "Como se calcula?",
   "o": [
    "Dentes cariados ÷ dentes presentes",
    "(Faces coradas ÷ faces examinadas) × 100",
    "Faces coradas × 5",
    "Número de dentes × 100",
    "Faces sem placa ÷ 2"
   ],
   "a": 1,
   "w": "O'Leary = faces coradas ÷ faces examinadas × 100. Cada dente conta 5 faces.",
   "f": "Aula de Interações Biológicas e Patológicas, prof. Sebastião Magno, 13/10/2026 (transcrição da turma)",
   "net": false
  },
  {
   "id": "c27",
   "tema": "Índice de placa",
   "ctx": "Um paciente teve 20 dentes examinados e 30 faces coradas no exame de placa.",
   "p": "Qual é o índice de O'Leary?",
   "o": [
    "15%",
    "20%",
    "30%",
    "60%",
    "150%"
   ],
   "a": 2,
   "w": "20 dentes × 5 faces = 100 faces examinadas. 30 coradas ÷ 100 × 100 = 30%.",
   "f": "Aula de Interações Biológicas e Patológicas, prof. Sebastião Magno, 13/10/2026 (transcrição da turma)",
   "net": false
  },
  {
   "id": "c28",
   "tema": "Índice de placa",
   "ctx": "Na aula prática de evidenciação, nem todo aluno pôde ser paciente.",
   "p": "Quem NÃO deve fazer a evidenciação de placa, segundo o professor?",
   "o": [
    "Quem escovou os dentes antes da aula",
    "Quem tem restauração de resina na vestibular dos anteriores ou usa aparelho",
    "Quem tem mais de 25 anos",
    "Quem não tem cárie",
    "Quem usa fio dental"
   ],
   "a": 1,
   "w": "O corante mancha resina e aparelho. Por isso essas pessoas não fizeram como paciente.",
   "f": "Aula de Interações Biológicas e Patológicas, prof. Sebastião Magno, 13/10/2026 (transcrição da turma)",
   "net": false
  },
  {
   "id": "c29",
   "tema": "Índice de placa",
   "ctx": "O professor Sebastião citou um valor ideal para o índice de O'Leary.",
   "p": "Segundo o professor, o índice ideal fica em torno de",
   "o": [
    "5%",
    "10 a 15%",
    "25 a 30%",
    "50%",
    "acima de 70%"
   ],
   "a": 2,
   "w": "Valor dito pelo professor em aula: 25 a 30%. (Parte da literatura fala em até 20%; na prova vale o do professor.)",
   "f": "Aula de Interações Biológicas e Patológicas, prof. Sebastião Magno, 13/10/2026 (transcrição da turma)",
   "net": false
  },
  {
   "id": "r02",
   "tema": "Índice de placa",
   "ctx": "Na primeira consulta, o dentista faz a evidenciação de placa e calcula o índice de O'Leary do paciente. Avalie as asserções a seguir e a relação proposta entre elas.",
   "p": "A respeito dessas asserções, assinale a opção correta.",
   "o": [
    "As asserções I e II são verdadeiras, e a II é uma justificativa correta da I.",
    "As asserções I e II são verdadeiras, mas a II não é uma justificativa correta da I.",
    "A asserção I é verdadeira, e a II é falsa.",
    "A asserção I é falsa, e a II é verdadeira.",
    "As asserções I e II são falsas."
   ],
   "a": 0,
   "w": "I verdadeira: o professor indicou fazer em todo paciente de primeira vez. II verdadeira e justifica: ver a placa corada ajuda o paciente a entender e a melhorar a escovação.",
   "f": "Aula de Interações Biológicas e Patológicas, prof. Sebastião Magno, 13/10/2026 (transcrição da turma)",
   "net": false,
   "af": [
    "A evidenciação de placa é indicada para pacientes de primeira consulta.",
    "O corante torna o biofilme visível, permitindo mostrar ao paciente onde a escovação está falhando."
   ],
   "fixa": true,
   "ar": true
  },
  {
   "id": "sb01",
   "sm1": true,
   "tema": "Glândulas salivares",
   "ctx": "Um paciente apresenta aumento de volume azulado e flutuante no lábio inferior. Relata que a lesão aumenta e diminui de tamanho e que costuma morder o lábio.",
   "p": "O diagnóstico mais provável é:",
   "o": [
    "adenoma pleomórfico.",
    "carcinoma mucoepidermoide.",
    "fibroma traumático.",
    "granuloma piogênico",
    "mucocele."
   ],
   "a": 4,
   "w": "Mucocele: lesão azulada, flutuante, que aumenta e diminui, em lábio inferior, ligada a trauma (morder o lábio).",
   "f": "SM1 de Interações, 22/09/2026, prof. Sebastião Magno, questão 1 (questão original da prova)",
   "net": false
  },
  {
   "id": "sb02",
   "sm1": true,
   "tema": "Diagnóstico clínico",
   "ctx": "Sobre o diagnóstico clínico, assinale a alternativa CORRETA:",
   "p": "",
   "o": [
    "O diagnóstico deve ser baseado exclusivamente na aparência da lesão.",
    "A anamnese é dispensável quando a lesão é assintomática.",
    "O diagnóstico deve considerar história clínica, características da lesão, localização, tempo de evolução e exame físico.",
    "Exames complementares substituem completamente o exame clínico.",
    "Toda lesão de mucosa deve ser diagnosticada como neoplasia até que se prove o contrário."
   ],
   "a": 2,
   "w": "O diagnóstico junta história, característica da lesão, local, tempo de evolução e exame físico.",
   "f": "SM1 de Interações, 22/09/2026, prof. Sebastião Magno, questão 2 (questão original da prova)",
   "net": false
  },
  {
   "id": "sb03",
   "sm1": true,
   "tema": "Patologia geral",
   "ctx": "A homeostasia celular representa a capacidade da célula de manter suas funções normais diante das condições do meio. Quando ocorre uma agressão, a célula pode apresentar diferentes respostas.",
   "p": "Assinale a alternativa correta:",
   "o": [
    "Toda agressão celular resulta imediatamente em morte celular.",
    "A célula pode adaptar-se ao estímulo, sofrer lesão reversível ou evoluir para lesão irreversível e morte.",
    "A adaptação celular ocorre exclusivamente após a morte celular.",
    "A homeostasia ocorre apenas em células que sofreram uma agressão.",
    "A morte celular sempre representa um processo fisiológico."
   ],
   "a": 1,
   "w": "Diante da agressão a célula pode se adaptar, sofrer lesão reversível ou evoluir para lesão irreversível e morte.",
   "f": "SM1 de Interações, 22/09/2026, prof. Sebastião Magno, questão 3 (questão original da prova)",
   "net": false
  },
  {
   "id": "sb04",
   "sm1": true,
   "tema": "Glândulas salivares",
   "ctx": "A mucocele é uma lesão comum das glândulas salivares menores decorrente de extravasamento de muco.",
   "p": "O seu mecanismo patogênico primário é:",
   "o": [
    "Obstrução do ducto salivar por um cálculo, levando à retenção progressiva de saliva no interior da glândula.",
    "Ruptura ou trauma do ducto de uma glândula salivar, com extravasamento de muco para o tecido conjuntivo adjacente.",
    "Proliferação neoplásica das células epiteliais ductais, provocando produção excessiva e acúmulo de secreção salivar.",
    "Processo inflamatório crônico da glândula salivar, causando destruição dos ácinos e formação de uma cavidade preenchida por muco.",
    "Infecção bacteriana do ducto salivar, levando à obstrução ductal e ao acúmulo de secreção no interior da glândula."
   ],
   "a": 1,
   "w": "Mucocele de extravasamento: o ducto rompe (trauma) e o muco sai para o conjuntivo ao redor.",
   "f": "SM1 de Interações, 22/09/2026, prof. Sebastião Magno, questão 4 (questão original da prova)",
   "net": false
  },
  {
   "id": "sb05",
   "sm1": true,
   "tema": "Patologia geral",
   "ctx": "A hipertrofia e a hiperplasia são alterações adaptativas que podem resultar no aumento do volume ou profliferação celular de um tecido ou órgão.",
   "p": "Sobre esses processos, assinale a alternativa CORRETA:",
   "o": [
    "A hipertrofia corresponde ao aumento do número de células, enquanto a hiperplasia corresponde ao aumento do tamanho das células.",
    "A hipertrofia ocorre exclusivamente em tecidos constituídos por células capazes de sofrer divisão celular.",
    "A hiperplasia caracteriza-se pelo aumento do número de células, enquanto a hipertrofia corresponde ao aumento do tamanho das células.",
    "Hiperplasia e hipertrofia são alterações exclusivamente neoplásicas e apresentam crescimento celular autônomo.",
    "A hipertrofia resulta necessariamente de um processo inflamatório crônico."
   ],
   "a": 2,
   "w": "Hiperplasia = mais células. Hipertrofia = células maiores.",
   "f": "SM1 de Interações, 22/09/2026, prof. Sebastião Magno, questão 5 (questão original da prova)",
   "net": false
  },
  {
   "id": "sb06",
   "sm1": true,
   "tema": "Lesões fundamentais",
   "ctx": "Uma paciente de 24 anos apresenta uma lesão na mucosa labial inferior, de aproximadamente 1,5 cm, elevada, bem delimitada, de consistência flutuante e coloração azulada. A lesão é assintomática e apresenta evolução de 2 meses. Durante a palpação, observa-se conteúdo líquido.",
   "p": "Com base nas características clínicas das lesões fundamentais, assinale a alternativa correta.",
   "o": [
    "A lesão é classificada como pápula, pois apresenta elevação da superfície mucosa.",
    "A lesão é classificada como bolha, pois é elevada, contém líquido e apresenta diâmetro superior a 1 cm.",
    "A lesão é classificada como nódulo, pois toda lesão flutuante é sólida em seu interior.",
    "A lesão é classificada como mácula, pois a coloração azulada é a principal característica clínica.",
    "A lesão é classificada como erosão, pois apresenta conteúdo líquido e superfície elevada."
   ],
   "a": 1,
   "w": "Elevação com conteúdo líquido e maior que o limite da vesícula é bolha.",
   "f": "SM1 de Interações, 22/09/2026, prof. Sebastião Magno, questão 6 (questão original da prova)",
   "net": false
  },
  {
   "id": "sb07",
   "sm1": true,
   "tema": "Patologia geral",
   "ctx": "Durante a avaliação de um paciente com cárie profunda, o cirurgião-dentista identifica que a lesão cariosa foi causada por acúmulo de biofilme e dieta cariogênica, que a produção bacteriana de ácidos desmineralizou o esmalte e a dentina, e que a agressão à polpa resultou em dor. Para compreender integralmente o processo de adoecimento, o profissional precisa reconhecer os quatro pilares da doença.",
   "p": "Nesse contexto, a etiologia, a patogênese, a morfologia e a fisiopatologia correspondem, respectivamente, a:",
   "o": [
    "produção de ácido pelas bactérias; acúmulo de biofilme; dor pulpar; cavitação dentária.",
    "acúmulo de biofilme e dieta cariogênica; produção de ácido pelas bactérias; cavitação dentária; dor pulpar.",
    "dor pulpar; cavitação dentária; produção de ácido; acúmulo de biofilme.",
    "cavitação dentária; dor pulpar; acúmulo de biofilme; produção de ácido.",
    "produção de ácido; cavitação dentária; dor pulpar; acúmulo de biofilme."
   ],
   "a": 1,
   "w": "Etiologia = causa (biofilme e dieta); patogênese = mecanismo (ácido); morfologia = cavitação; fisiopatologia = alteração funcional (dor).",
   "f": "SM1 de Interações, 22/09/2026, prof. Sebastião Magno, questão 7 (questão original da prova)",
   "net": false
  },
  {
   "id": "sb08",
   "sm1": true,
   "tema": "Biofilme",
   "ctx": "Durante uma aula sobre biofilme dental, o professor apresenta aos estudantes uma comunidade formada por diferentes espécies microbianas aderidas a uma superfície e envolvidas por uma matriz extracelular. Dentro dessa comunidade, algumas espécies utilizam produtos metabólicos produzidos por outras, enquanto diferentes populações também competem por nutrientes e locais de adesão.",
   "p": "A situação demonstra que:",
   "o": [
    "biofilmes são constituídos obrigatoriamente por uma única espécie microbiana.",
    "microrganismos presentes em um biofilme não estabelecem interações entre si.",
    "apenas relações de competição são encontradas nas comunidades microbianas.",
    "comunidades microbianas podem apresentar simultaneamente relações de cooperação, dependência metabólica e competição, influenciando a organização e o comportamento do biofilme.",
    "a matriz extracelular impede qualquer comunicação ou interação entre as células microbianas."
   ],
   "a": 3,
   "w": "No biofilme há ao mesmo tempo cooperação, dependência metabólica e competição.",
   "f": "SM1 de Interações, 22/09/2026, prof. Sebastião Magno, questão 8 (questão original da prova)",
   "net": false
  },
  {
   "id": "sb09",
   "sm1": true,
   "tema": "Patologia geral",
   "ctx": "No estudo da patologia, diferentes termos são empregados para descrever os aspectos das doenças. A correta compreensão desses conceitos é essencial para o raciocínio diagnóstico e para a comunicação entre profissionais da saúde.",
   "p": "Analise as afirmativas a seguir:",
   "o": [
    "Apenas as afirmativas I e II estão corretas.",
    "Apenas as afirmativas I, II e III estão corretas.",
    "Apenas as afirmativas II, III e IV estão corretas.",
    "Apenas as afirmativas I, III e IV estão corretas.",
    "Todas as afirmativas estão corretas."
   ],
   "a": 4,
   "w": "As quatro afirmativas trazem os conceitos certos de etiologia, patogênese, anatomia patológica, fisiopatologia, semiologia, propedêutica e lesões letais e não letais.",
   "f": "SM1 de Interações, 22/09/2026, prof. Sebastião Magno, questão 9 (questão original da prova)",
   "net": false,
   "af": [
    "A etiologia é o estudo das causas das doenças, enquanto a patogênese é o estudo dos mecanismos envolvidos no aparecimento das lesões e das doenças.",
    "A anatomia patológica é o estudo das alterações morfológicas em células, tecidos e órgãos, enquanto a fisiopatologia é o estudo das alterações funcionais de órgãos e sistemas causadas pelas doenças.",
    "A semiologia é o estudo dos sinais e sintomas, e a propedêutica corresponde ao diagnóstico das doenças por meio de sinais, sintomas e exames complementares.",
    "As lesões não letais são aquelas em que as células permanecem vivas e podem retornar ao estado de normalidade se a agressão for eliminada, enquanto as lesões letais levam à morte celular."
   ],
   "fixa": true
  },
  {
   "id": "sb10",
   "sm1": true,
   "tema": "Patologia geral",
   "ctx": "A patologia é a ciência que estuda as causas das doenças, os mecanismos que as produzem, os locais onde ocorrem e as alterações moleculares, morfológicas e funcionais que apresentam. No estudo da patologia geral, os conceitos de agressão, defesa, adaptação e lesão são fundamentais para compreender o processo saúde-doença.",
   "p": "Analise as afirmativas a seguir:",
   "o": [
    "Apenas as afirmativas I e II estão corretas.",
    "Apenas as afirmativas I, II e III estão corretas.",
    "Apenas as afirmativas II, III e IV estão corretas.",
    "Apenas as afirmativas III e IV estão corretas.",
    "Todas as afirmativas estão corretas."
   ],
   "a": 1,
   "w": "I, II e III corretas. IV errada, porque lesão também envolve alterações moleculares e funcionais, não só morfológicas.",
   "f": "SM1 de Interações, 22/09/2026, prof. Sebastião Magno, questão 10 (questão original da prova)",
   "net": false,
   "af": [
    "A agressão é qualquer estímulo da natureza ou originado no próprio organismo que, dependendo da intensidade, do tempo de atuação e da capacidade de reação do indivíduo, desencadeia uma resposta do organismo, seja de adaptação ou de defesa.",
    "A adaptação é uma propriedade dos organismos vivos de modificar suas funções para ajustá-las às variações do meio ambiente ou do meio interno, como o aumento do número de hemácias em indivíduos que vivem em grandes altitudes.",
    "A defesa compreende mecanismos que o organismo monta para conter ou eliminar o agente agressor e reparar os danos produzidos, sendo a resposta imunitária adaptativa a mais importante, embora possa também provocar lesões.",
    "A lesão corresponde exclusivamente às alterações morfológicas macroscópicas induzidas pelas agressões, não envolvendo alterações moleculares ou funcionais."
   ],
   "fixa": true
  },
  {
   "id": "p01",
   "tema": "Patologia geral",
   "ctx": "A célula exposta a um estímulo persistente, mas não letal, pode mudar seu tamanho, número ou tipo para continuar funcionando.",
   "p": "Esse conjunto de mudanças é chamado de",
   "o": [
    "necrose.",
    "adaptação celular.",
    "apoptose.",
    "neoplasia.",
    "inflamação aguda."
   ],
   "a": 1,
   "w": "Hipertrofia, hiperplasia, atrofia e metaplasia são adaptações: a célula muda para sobreviver ao estímulo.",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "sm1par": true
  },
  {
   "id": "p02",
   "tema": "Patologia geral",
   "ctx": "Em fumantes, o epitélio cilíndrico ciliado dos brônquios pode ser substituído por epitélio escamoso, mais resistente.",
   "p": "Essa alteração é",
   "o": [
    "hiperplasia.",
    "hipertrofia.",
    "metaplasia.",
    "displasia.",
    "atrofia."
   ],
   "a": 2,
   "w": "Metaplasia é a troca de um tipo de célula adulta por outro mais resistente ao agressor.",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false
  },
  {
   "id": "p03",
   "tema": "Patologia geral",
   "ctx": "Um paciente usou prótese total mal adaptada por anos e a gengiva sob a borda cresceu em pregas, por aumento do número de células.",
   "p": "Essa resposta do tecido é",
   "o": [
    "hiperplasia.",
    "hipertrofia.",
    "atrofia.",
    "metaplasia.",
    "necrose."
   ],
   "a": 0,
   "w": "Aumento do NÚMERO de células = hiperplasia (hiperplasia fibrosa inflamatória por prótese mal adaptada).",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "sm1par": true
  },
  {
   "id": "p04",
   "tema": "Patologia geral",
   "ctx": "Após a extração dos dentes, o osso alveolar perde volume com o tempo, por diminuição do tamanho e do número de células.",
   "p": "Esse processo é",
   "o": [
    "hipertrofia.",
    "hiperplasia.",
    "atrofia.",
    "metaplasia.",
    "displasia."
   ],
   "a": 2,
   "w": "Atrofia é a redução do tamanho da célula ou do órgão por falta de estímulo, nutrição ou uso.",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "sm1par": true
  },
  {
   "id": "p05",
   "tema": "Patologia geral",
   "ctx": "A diferença entre lesão celular reversível e irreversível é importante para entender a evolução da doença.",
   "p": "Assinale a alternativa correta.",
   "o": [
    "Na lesão reversível a célula morre, mas pode ser substituída.",
    "Na lesão reversível, retirada a agressão, a célula volta ao normal; na irreversível ela evolui para morte celular.",
    "Toda lesão irreversível vira adaptação.",
    "A lesão reversível só ocorre em neurônios.",
    "Lesão irreversível é sinônimo de hipertrofia."
   ],
   "a": 1,
   "w": "Reversível: retirou a agressão, a célula se recupera. Irreversível: passa do ponto de não retorno e morre (necrose ou apoptose).",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "sm1par": true
  },
  {
   "id": "p06",
   "tema": "Lesões fundamentais",
   "ctx": "No exame da mucosa, o dentista encontra uma mancha vermelha plana, sem elevação nem depressão, de 8 mm.",
   "p": "Essa lesão fundamental é",
   "o": [
    "pápula",
    "nódulo",
    "mácula",
    "vesícula",
    "úlcera"
   ],
   "a": 2,
   "w": "Mácula = mudança de cor sem elevação nem depressão.",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "sm1par": true
  },
  {
   "id": "p07",
   "tema": "Lesões fundamentais",
   "ctx": "Uma lesão elevada, de conteúdo líquido, com 3 mm, aparece na mucosa labial.",
   "p": "Essa lesão fundamental é",
   "o": [
    "bolha",
    "vesícula",
    "pápula",
    "mácula",
    "nódulo"
   ],
   "a": 1,
   "w": "Elevação com líquido e pequena (até cerca de 3 a 5 mm) é vesícula; maior que isso é bolha.",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "sm1par": true
  },
  {
   "id": "p08",
   "tema": "Lesões fundamentais",
   "ctx": "Na língua, a mucosa perdeu o epitélio em toda a espessura, deixando o conjuntivo exposto, com fundo amarelado.",
   "p": "Essa lesão fundamental é",
   "o": [
    "erosão",
    "úlcera",
    "mácula",
    "placa",
    "pápula"
   ],
   "a": 1,
   "w": "Úlcera = perda do epitélio em toda a espessura, expondo o conjuntivo. Erosão é perda só superficial do epitélio.",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "sm1par": true
  },
  {
   "id": "p09",
   "tema": "Lesões fundamentais",
   "ctx": "Uma lesão sólida, elevada, de 2 cm, aparece na mucosa jugal na linha de oclusão de um paciente que morde a bochecha.",
   "p": "Pela classificação das lesões fundamentais, ela é um",
   "o": [
    "nódulo",
    "vesícula",
    "mácula",
    "bolha",
    "erosão"
   ],
   "a": 0,
   "w": "Lesão SÓLIDA, elevada e maior que cerca de 1 cm é nódulo (aqui, provável fibroma traumático).",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "sm1par": true
  },
  {
   "id": "p10",
   "tema": "Glândulas salivares",
   "ctx": "Lesões de glândula salivar menor por extravasamento de muco são frequentes na mucosa labial.",
   "p": "Qual é o local mais comum da mucocele?",
   "o": [
    "Palato duro",
    "Lábio inferior",
    "Lábio superior",
    "Gengiva inserida",
    "Dorso da língua"
   ],
   "a": 1,
   "w": "A mucocele aparece mais no lábio inferior, onde é comum morder e machucar os ductos.",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "sm1par": true
  },
  {
   "id": "p11",
   "tema": "Patologia geral",
   "ctx": "O professor explicou os quatro pilares da doença usando a periodontite como exemplo.",
   "p": "Analise as afirmativas a seguir:",
   "o": [
    "Apenas as afirmativas I e II estão corretas.",
    "Apenas as afirmativas I, II e III estão corretas.",
    "Apenas as afirmativas II, III e IV estão corretas.",
    "Apenas as afirmativas I, III e IV estão corretas.",
    "Todas as afirmativas estão corretas."
   ],
   "a": 4,
   "w": "Todas corretas: biofilme é a causa (etiologia), a resposta inflamatória destrói o tecido (patogênese), a bolsa é a alteração morfológica e a mobilidade é a alteração funcional.",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "af": [
    "A etiologia da periodontite é o acúmulo de biofilme.",
    "A patogênese envolve a resposta inflamatória do hospedeiro que destrói os tecidos de suporte.",
    "A bolsa periodontal é uma alteração morfológica.",
    "A mobilidade dentária é uma alteração funcional (fisiopatologia)."
   ],
   "fixa": true,
   "sm1par": true
  },
  {
   "id": "p12",
   "tema": "Patologia geral",
   "ctx": "Sobre agressão, defesa e lesão no estudo da patologia geral, considere o que foi visto em aula.",
   "p": "Analise as afirmativas a seguir:",
   "o": [
    "Apenas as afirmativas I e II estão corretas.",
    "Apenas as afirmativas I, II e III estão corretas.",
    "Apenas as afirmativas II, III e IV estão corretas.",
    "Apenas as afirmativas I, III e IV estão corretas.",
    "Todas as afirmativas estão corretas."
   ],
   "a": 0,
   "w": "I e II corretas. III errada: a defesa também pode causar lesão (ex.: inflamação). IV errada: agressão pode ser física, química, biológica ou do próprio organismo.",
   "f": "Questão no estilo do SM1 do prof. Sebastião (patologia geral e lesões fundamentais), feita pela Mônica a partir das questões do SM1.",
   "net": false,
   "af": [
    "A resposta à agressão depende da intensidade, do tempo de atuação e da capacidade de reação do indivíduo.",
    "A inflamação é um mecanismo de defesa.",
    "A defesa nunca provoca lesão nos tecidos do próprio organismo.",
    "Só agentes biológicos, como bactérias, são considerados agressores."
   ],
   "fixa": true,
   "sm1par": true
  }
 ]
}
};

window.MATERIAS = [
  { id: 'bases', nome: 'Bases Morfológicas', pronto: true },
  { id: 'carie', nome: 'Cárie', pronto: true },
  { id: 'inter', nome: 'Interações', pronto: true },
  { id: 'farmaco', nome: 'Farmacologia', pronto: true },
  { id: 'imagino', nome: 'Imaginologia (bônus)', pronto: true, bonus: true }
];
/* Banco de FARMACOLOGIA E ANESTESIOLOGIA do "Simulado do simulado" (Mônica, 11/11/2026).
   Mesmo formato de bancos.js. Fontes: SM1 de Farmaco (prova 0085173, 29/09/2026), slides do prof. Gustavo Holderbaum
   (aula 1, Técnicas Anestésicas Parte 1, Técnicas em Maxila, Técnicas na Mandíbula) e o mapa das técnicas (material adicional de 23/10/2026).
   Dentro de uma função para não colidir com as constantes de bancos.js. */
(function () {
  const SM1 = n => 'SM1 de Farmacologia e Anestesiologia, 29/09/2026, prof. Gustavo Holderbaum, questão ' + n + ' (questão original da prova)';
  const F_SM1 = 'Tema cobrado no SM1 de Farmacologia e Anestesiologia (29/09/2026)';
  const F_A1 = 'Slides da aula 1 do prof. Gustavo Holderbaum (06/08/2026)';
  const F_TP1 = 'Slides do prof. Gustavo Holderbaum, Técnicas Anestésicas - Parte 1';
  const F_MAX = 'Slides do prof. Gustavo Holderbaum, Técnicas Anestésicas em Maxila';
  const F_MAN = 'Slides do prof. Gustavo Holderbaum, Técnicas Anestésicas na Mandíbula (22/10/2026)';
  const F_MAPA = 'Mapa das técnicas anestésicas (material adicional de 23/10/2026)';
  const AR = [
    'As asserções I e II são proposições verdadeiras, e a II é uma justificativa correta da I.',
    'As asserções I e II são proposições verdadeiras, mas a II não é uma justificativa correta da I.',
    'A asserção I é uma proposição verdadeira, e a II é uma proposição falsa.',
    'A asserção I é uma proposição falsa, e a II é uma proposição verdadeira.',
    'As asserções I e II são proposições falsas.'
  ];
  const AF = ['I, apenas.', 'III, apenas.', 'I e II, apenas.', 'I e III, apenas.', 'I, II e III.'];
  const tema = (id, nome, sub, t) => ({ id: id, nome: nome, sub: sub, temas: t });

  window.BANCOS = window.BANCOS || {};
  window.BANCOS.farmaco = {
    curso: 'Odontologia',
    materia: 'Farmacologia e Anestesiologia',
    curta: 'Farmaco',
    codigo: 'ARA4314',
    prof: 'GUSTAVO HOLDERBAUM',
    turma: '3002',
    proxima: 'SM2 quinta 12/11, na sala, no horário da aula',
    modos: [
      { id: 'completo', nome: 'Simulado completo', sub: '10 questões sorteadas de toda a matéria.', temas: null },
      { id: 'sm1ver', nome: 'Prova do SM1', sub: 'As 10 questões que caíram no SM1, na ordem da prova.', temas: null, sm1todo: true, prefixo: 'fa' },
      tema('t-farmaco', 'Farmacocinética e farmacodinâmica', 'ADME, primeira passagem, índice terapêutico, tolerância.', ['Farmacocinética', 'Farmacodinâmica']),
      tema('t-anest', 'Anestésicos locais e vasoconstritores', 'Ésteres e amidas, estrutura química, bupivacaína, vasoconstritor.', ['Anestésicos locais', 'Vasoconstritores']),
      tema('t-sna', 'Sistema nervoso autônomo', 'Simpático, parassimpático e a saliva.', ['Sistema nervoso autônomo']),
      tema('t-maxila', 'Técnicas na maxila', 'Supraperiosteal, PSA, ASM, ASA, infraorbitário, nasopalatino, palatino maior.', ['Técnicas na maxila']),
      tema('t-mand', 'Técnicas na mandíbula', 'Alveolar inferior, lingual, bucal, Gow-Gates, Vazirani-Akinosi.', ['Técnicas na mandíbula']),
      tema('t-esp', 'Técnicas especiais e complicações', 'Tópica, intraligamentar, intraóssea, trismo, hematoma.', ['Técnicas especiais', 'Complicações']),
      { id: 'afirm', nome: 'Afirmativas I, II, III', sub: 'Questões no estilo "está correto o que se afirma em" e de asserção e razão.', temas: null, af: true },
      { id: 'erros', nome: 'Revisar meus erros', sub: 'Só as questões que você errou ou deixou em branco aqui.', temas: null, erros: true }
    ],
    revisao: [
      { t: 'Farmacocinética e farmacodinâmica', i: [
        'Farmacocinética = o que o corpo faz com o fármaco. Farmacodinâmica = o que o fármaco faz no corpo.',
        'ADME: Absorção, Distribuição, Metabolismo (biotransformação, principalmente no fígado) e Excreção (principalmente pelos rins).',
        'Primeira passagem: o fármaco oral passa pelo fígado antes da circulação; chega menos fármaco inalterado.',
        'Farmacodinâmica: mecanismo de ação, receptores, relação dose-resposta (mais dose, mais efeito, até um limite), efeitos desejados e indesejados.',
        'Índice terapêutico = dose tóxica / dose eficaz. Tolerância (taquifilaxia) = resposta cai com o uso repetido.'] },
      { t: 'Anestésicos locais', i: [
        'Anestesia local: interrupção reversível da condução do impulso nervoso, sem perda de consciência.',
        'Ésteres (procaína): pouco usados, maior potencial alergênico. Amidas (lidocaína, articaína, mepivacaína): as mais usadas, mais seguras.',
        'História: óxido nitroso (século XIX), cocaína (muitos efeitos colaterais), procaína e depois as amidas.',
        'Estrutura: grupo aromático lipofílico (atravessa a membrana do nervo), cadeia intermediária (éster ou amida), amina terminal hidrofílica.',
        'Bupivacaína: potente e de longa duração (cirurgias extensas, dor pós-operatória).',
        'Vasoconstritor: absorção mais lenta, menos toxicidade sistêmica, efeito mais longo e profundo, hemostasia. Não acelera o metabolismo.'] },
      { t: 'SNA e saliva', i: [
        'Parassimpático: saliva aquosa e abundante. Simpático: saliva mais viscosa e rica em proteínas.'] },
      { t: 'Técnicas na maxila', i: [
        'Maxila é osso poroso: infiltração supraperiosteal é a mais usada (agulha curta, 2 a 3 mm, 0,6 a 1,0 mL).',
        'PSA: molares superiores (às vezes exceto a raiz MV do 1º molar); acima do 2º molar, para trás, cima e dentro, 45°; 0,9 a 1,2 mL.',
        'ASM: pré-molares + raiz MV do 1º molar. ASA: incisivos e canino, fossa canina, 0,9 mL.',
        'Infraorbitário (ASA + ASM): incisivos a pré-molares + lábio superior, asa do nariz e pálpebra inferior; sobre o 1º pré-molar.',
        'Nasopalatino: papila incisiva, 0,2 a 0,3 mL, palato de canino a canino. Palatino maior: forame palatino maior, 0,25 a 0,5 mL, palato de pré-molares e molares.'] },
      { t: 'Técnicas na mandíbula', i: [
        'Mandíbula é osso denso: bloqueio regional é a regra.',
        'Alveolar inferior: agulha longa, 6 a 10 mm acima do plano oclusal, contato ósseo (~20 a 25 mm), recua 1 mm, aspira, 1,0 a 1,5 mL. Não pega a vestibular dos molares.',
        'Lingual: no recuo da agulha (~1 cm), 0,3 mL; metade anterior da língua, assoalho e gengiva lingual.',
        'Bucal: agulha curta, distal ao último molar, 0,3 a 0,5 mL; mucosa e gengiva vestibular dos molares inferiores.',
        'Gow-Gates: quando o convencional falha; rumo ao colo do côndilo; 1,8 mL; pega alveolar inferior, lingual, bucal, auriculotemporal e milo-hióideo.',
        'Vazirani-Akinosi: boca fechada, agulha paralela ao plano oclusal, 1,5 a 1,8 mL; indicada no trismo.'] },
      { t: 'Técnicas especiais e complicações', i: [
        'Tópica: sem punção, só superfície, ação curta. Intrapapilar 0,2 mL. Intraligamentar 0,2 mL por raiz (unitária). Intrasseptal 0,2 a 0,4 mL.',
        'Intraóssea: perfuração prévia, latência imediata, risco de taquicardia. Intrapulpar: polpa exposta, dói, raramente indicada.',
        'Aspirar sempre. Complicações: falha, parestesia, hematoma, trismo (pterigóideo), paralisia facial transitória (nervo facial).'] }
    ],
    q: [
      /* ===== SM1 (prova 0085173), na ordem da prova ===== */
      { id: 'fa01', sm1: true, tema: 'Farmacodinâmica', ctx: '', p: 'O fenômeno caracterizado pela diminuição gradual da resposta a um fármaco após o seu uso prolongado ou repetido é conhecido na farmacodinâmica como:',
        o: ['Efeito placebo reverso.', 'Saturação de primeira passagem.', 'Inibição do citocromo P450.', 'Taquifilaxia ou tolerância.', 'Depuração renal acelerada.'], a: 3,
        w: 'Tolerância (ou taquifilaxia) é a resposta que diminui com o uso repetido do fármaco. Primeira passagem é do fígado, depuração é eliminação. (gabarito conferido pelo conteúdo da questão; os slides lidos não trazem esse termo)', f: SM1(1), net: false },
      { id: 'fa02', sm1: true, tema: 'Farmacocinética', ctx: 'A farmacocinética estuda o caminho que o fármaco percorre no organismo, sendo comumente resumida pelo acrônimo ADME.', p: 'O que significa a letra "M" nesse processo?',
        o: ['Metabolismo (biotransformação química da droga, principalmente no fígado)', 'Movimentação celular ativa contra o gradiente de concentração', 'Membrana de barreira hematoencefálica', 'Mecanismo de ação nos receptores específicos', 'Máxima biodisponibilidade sistêmica'], a: 0,
        w: 'ADME = Absorção, Distribuição, Metabolismo e Excreção. Metabolismo é a biotransformação, principalmente no fígado, para facilitar a eliminação (aula 1). (gabarito conferido pelo material)', f: SM1(2), net: false },
      { id: 'fa03', sm1: true, tema: 'Técnicas na mandíbula', ctx: 'Durante a execução de um bloqueio do nervo alveolar inferior (técnica de escolha para procedimentos em mandíbula), o cirurgião-dentista deve se guiar por estruturas anatômicas precisas na face medial do ramo mandibular.', p: 'O forame mandibular, onde o nervo penetra, é protegido superior e anteriormente por uma proeminência óssea importante chamada de:',
        o: ['Processo coronoide.', 'Fóvea pterigóidea.', 'Tubérculo mentual.', 'Língula (espícula mandibular).', 'Linha oblíqua externa.'], a: 3,
        w: 'A língula, chamada nos slides de espinha de Spix, é a lâmina óssea que protege o forame mandibular. O processo coronoide fica na frente do ramo, longe do forame. (gabarito conferido pelo material: slides da mandíbula citam forame mandibular e espinha de Spix)', f: SM1(3), net: false },
      { id: 'fa04', sm1: true, tema: 'Farmacocinética', ctx: 'O metabolismo de primeira passagem ocorre quando um fármaco administrado por via oral é absorvido no trato gastrointestinal e passa pelo fígado antes de atingir a circulação sistêmica.', p: 'Qual das alternativas descreve corretamente uma consequência desse fenômeno?',
        o: ['Aumento imediato da biodisponibilidade para 100%.', 'Redução da fração do fármaco que alcança a circulação sistêmica inalterada.', 'Eliminação exclusiva do fármaco por via biliar sem metabolização prévia.', 'Conversão imediata de todos os fármacos em metabólitos tóxicos.', 'Impossibilidade total de o fármaco atuar sobre receptores celulares.'], a: 1,
        w: 'O fígado biotransforma parte do fármaco antes de ele chegar à circulação, então chega menos fármaco inalterado. Não zera o efeito nem transforma tudo em tóxico. (gabarito conferido pelo material: metabolismo principalmente no fígado, aula 1)', f: SM1(4), net: false },
      { id: 'fa05', sm1: true, tema: 'Farmacodinâmica', ctx: 'A Farmacodinâmica analisa "o que o fármaco faz no corpo".', p: 'Entre os conceitos fundamentais estudados nessa área, o Índice Terapêutico (IT) é definido como:',
        o: ['A relação entre a dose tóxica e a dose eficaz de um fármaco (IT = Dose Tóxica / Dose Eficaz).', 'O tempo necessário para reduzir a concentração plasmática do fármaco pela metade.', 'O volume teórico de plasma necessário para conter todo o fármaco do organismo.', 'A porcentagem exata de biodisponibilidade após a primeira passagem hepática.', 'A afinidade máxima do fármaco pelas proteínas plasmáticas, como a albumina.'], a: 0,
        w: 'IT = dose tóxica / dose eficaz: quanto maior, maior a margem de segurança. A alternativa B é a meia-vida e a C é o volume de distribuição. (gabarito conferido pelo conteúdo da questão; a própria alternativa traz a fórmula)', f: SM1(5), net: false },
      { id: 'fa06', sm1: true, tema: 'Anestésicos locais', ctx: '', p: 'Dentre os sais anestésicos locais disponíveis na odontologia, a bupivacaína destaca-se clinicamente por apresentar qual característica principal?',
        o: ['Início de ação ultrarrápido (inferior a 30 segundos) e duração curtíssima.', 'Potência anestésica elevada e longa duração de ação (podendo estender-se por várias horas), sendo indicada para cirurgias extensas e controle da dor pós-operatória.', 'Capacidade de ser metabolizada exclusivamente no plasma por colinesterases plasmáticas.', 'Ausência total de toxicidade sistêmica em qualquer faixa etária.', 'Concentração padrão de 4% associada obrigatoriamente à felipressina.'], a: 1,
        w: 'A bupivacaína é a anestésica de longa duração: cirurgias extensas e dor pós-operatória. É uma amida (metabolismo hepático, não plasmático) e nenhum anestésico tem toxicidade zero. (gabarito conferido pelo conteúdo da questão; os slides lidos não detalham a bupivacaína)', f: SM1(6), net: false },
      { id: 'fa07', sm1: true, tema: 'Vasoconstritores', ctx: 'Os vasoconstritores são adicionados às soluções anestésicas locais com diversos objetivos terapêuticos.', p: 'Qual das alternativas abaixo não representa uma função ou benefício direto do uso de vasoconstritores associados aos anestésicos locais?',
        o: ['Diminuição da velocidade de absorção do anestésico para a corrente sanguínea.', 'Redução da toxicidade sistêmica do sal anestésico.', 'Aumento da duração e da profundidade do efeito anestésico.', 'Promoção de hemostasia local no campo operatório.', 'Aceleração do metabolismo hepático do fármaco na primeira passagem.'], a: 4,
        w: 'O vasoconstritor fecha os vasos do local: absorve mais devagar, menos toxicidade, efeito mais longo e menos sangramento. Ele não acelera o metabolismo hepático, e anestésico injetado nem passa pela primeira passagem. (gabarito conferido pelo conteúdo da questão)', f: SM1(7), net: false },
      { id: 'fa08', sm1: true, tema: 'Anestésicos locais', ctx: 'Sobre a estrutura química dos anestésicos locais, eles são compostos por três partes fundamentais: um grupo aromático lipofílico, uma cadeia intermediária (que define se o sal é éster ou amida) e uma amina terminal hidrofílica.', p: 'A importância do grupo aromático lipofílico reside no fato de que ele é responsável por:',
        o: ['Promover a metabolização plasmática rápida por estearases.', 'Garantir a solubilidade do sal em meio aquoso dentro do tubete.', 'Se ligar diretamente aos canais de potássio intracelulares.', 'Permitir a difusão do anestésico através da membrana lipoproteica do nervo.', 'Evitar reações alérgicas sistêmicas em pacientes sensíveis.'], a: 3,
        w: 'Lipofílico = afinidade por gordura: é o que deixa o anestésico atravessar a membrana do nervo. A solubilidade em água vem da amina terminal hidrofílica. (gabarito conferido pelo conteúdo da questão)', f: SM1(8), net: false },
      { id: 'fa09', sm1: true, tema: 'Complicações', ctx: 'Um paciente apresentou, dias após a realização de um bloqueio anestésico regional na mandíbula, extrema dificuldade e limitação para abrir a boca (abertura bucal reduzida).', p: 'Esse quadro clínico caracteriza-se como trismo, que decorre tipicamente de:',
        o: ['Reação alérgica tardia ao conservante metilparabeno.', 'Inflamação ou trauma nos músculos da mastigação (como o pterigóideo medial ou masseter) devido a punções repetidas ou hematoma.', 'Bloqueio acidental do nervo facial que paralisou os músculos da expressão facial.', 'Toxicidade sistêmica aguda por superdosagem de adrenalina.', 'Infecção odontogênica crônica disseminada pelo ducto parotídeo.'], a: 1,
        w: 'Nos slides da mandíbula: trismo = infiltração no músculo pterigóideo. O nervo facial causa paralisia facial transitória, outra complicação. (gabarito conferido pelo material)', f: SM1(9), net: false },
      { id: 'fa10', sm1: true, tema: 'Sistema nervoso autônomo', ctx: 'O Sistema Nervoso Autônomo (SNA) divide-se em simpático e parassimpático, exercendo controle sobre funções viscerais involuntárias.', p: 'Sobre os efeitos do SNA na cavidade oral e glândulas salivares, assinale a alternativa correta:',
        o: ['O estímulo simpático produz uma salivação abundante, aquosa e fluida.', 'O estímulo parassimpático inibe completamente a secreção salivar, causando xerostomia severa.', 'O estímulo parassimpático promove uma secreção salivar aquosa e abundante, enquanto o simpático gera uma secreção mais viscosa e rica em proteínas.', 'O SNA não exerce nenhuma influência sobre o fluxo ou a consistência da saliva.', 'Ambos os sistemas estimulam exclusivamente a vasoconstrição dos ductos parotídeos.'], a: 2,
        w: 'Parassimpático = saliva aquosa e abundante; simpático = saliva mais viscosa e rica em proteínas. A alternativa A inverte os dois. (gabarito conferido pelo conteúdo da questão; os slides lidos não trazem o SNA)', f: SM1(10), net: false },

      /* ===== Questões novas ===== */
      { id: 'f01', sm1par: true, tema: 'Farmacodinâmica', ctx: 'Um paciente conta que usa o mesmo medicamento há meses e sente que ele "faz cada vez menos efeito" na mesma dose.', p: 'Na farmacodinâmica, esse fenômeno recebe o nome de:',
        o: ['Tolerância (taquifilaxia).', 'Biodisponibilidade.', 'Metabolismo de primeira passagem.', 'Excreção renal.', 'Efeito terapêutico.'], a: 0,
        w: 'A resposta que cai com o uso repetido é a tolerância, ou taquifilaxia. Os outros termos são da farmacocinética ou descrevem o efeito desejado.', f: F_SM1, net: false },
      { id: 'f02', sm1par: true, tema: 'Farmacocinética', ctx: 'Depois de chegar à corrente sanguínea, o fármaco precisa ser levado até os tecidos e órgãos-alvo onde vai atuar.', p: 'Na sigla ADME, essa etapa corresponde à letra:',
        o: ['A, de Absorção.', 'D, de Distribuição.', 'M, de Metabolismo.', 'E, de Excreção.', 'M, de Mecanismo de ação.'], a: 1,
        w: 'Distribuição é o transporte pela circulação sistêmica até os tecidos e órgãos-alvo. Absorção é a entrada até o sangue; mecanismo de ação é da farmacodinâmica.', f: F_A1 + '; ' + F_SM1, net: false },
      { id: 'f03', tema: 'Farmacocinética', ctx: 'A última fase da farmacocinética é a eliminação do fármaco e de seus metabólitos do organismo.', p: 'Segundo a aula, essa eliminação acontece principalmente por qual via?',
        o: ['Pela saliva.', 'Pelo suor.', 'Pelos rins (urina).', 'Pelos pulmões.', 'Pelo leite materno.'], a: 2,
        w: 'Excreção: eliminação do fármaco e dos metabólitos, principalmente pelos rins, na urina.', f: F_A1, net: false },
      { id: 'f04', tema: 'Farmacodinâmica', ctx: 'A farmacologia se divide em dois grandes campos, que costumam ser resumidos em frases curtas.', p: 'A frase "o que o corpo faz com o fármaco" define:',
        o: ['A farmacodinâmica.', 'A farmacocinética.', 'A toxicologia.', 'A anestesiologia.', 'A farmacognosia.'], a: 1,
        w: 'Farmacocinética = o que o corpo faz com o fármaco (ADME). Farmacodinâmica = o que o fármaco faz no corpo (mecanismo, receptores, dose-resposta).', f: F_A1, net: false },
      { id: 'f05', tema: 'Farmacodinâmica', ctx: 'A farmacodinâmica estuda os efeitos fisiológicos e bioquímicos dos fármacos e determina seus efeitos terapêuticos e adversos. Considerando o texto, analise as afirmativas a seguir.',
        af: ['Mecanismo de ação é como o fármaco age em nível celular, por exemplo inibindo enzimas ou bloqueando receptores.', 'Na relação dose-resposta, quanto maior a dose, maior o efeito, sem nenhum limite.', 'A farmacodinâmica considera tanto os efeitos desejados quanto os indesejados (colaterais, tóxicos ou adversos).'],
        p: 'Está correto o que se afirma em', o: AF, a: 3, fixa: true,
        w: 'I. Verdadeira. II. Falsa: a aula diz "quanto maior a dose, maior o efeito, ATÉ UM LIMITE". III. Verdadeira.', f: F_A1, net: false },
      { id: 'f06', sm1par: true, tema: 'Farmacocinética', ctx: 'Um mesmo fármaco pode precisar de doses diferentes conforme a via: por via oral, parte dele se perde antes de agir. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.',
        af: ['Um fármaco tomado por via oral chega à circulação sistêmica em fração menor, na forma inalterada, por causa do metabolismo de primeira passagem.', 'Absorvido no trato gastrointestinal, o fármaco passa pelo fígado, principal órgão de biotransformação, antes de chegar à circulação sistêmica.'],
        ar: true, p: 'A respeito dessas asserções, assinale a opção correta.', o: AR, a: 0, fixa: true,
        w: 'As duas são verdadeiras e a II explica a I: é a passagem pelo fígado (onde ocorre o metabolismo) que reduz a fração inalterada.', f: F_SM1 + '; ' + F_A1, net: false },
      { id: 'f07', sm1par: true, tema: 'Farmacodinâmica', ctx: 'O índice terapêutico (IT) é a relação entre a dose tóxica e a dose eficaz de um fármaco. Um fármaco X tem a dose tóxica muito próxima da dose eficaz.', p: 'Sobre o fármaco X, é correto afirmar que ele tem:',
        o: ['IT alto e grande margem de segurança.', 'IT baixo e pequena margem de segurança.', 'IT igual a zero, sem efeito terapêutico.', 'Meia-vida longa, por isso é mais seguro.', 'Biodisponibilidade de 100%.'], a: 1,
        w: 'IT = dose tóxica / dose eficaz. Se as duas doses são próximas, a divisão dá um número pequeno: pouca distância entre tratar e intoxicar.', f: F_SM1, net: false },
      { id: 'f08', tema: 'Anestésicos locais', ctx: 'Os anestésicos locais se dividem em dois grandes grupos químicos: ésteres e amidas.', p: 'Qual dos anestésicos abaixo é um ÉSTER, hoje pouco usado por ter maior potencial alergênico?',
        o: ['Lidocaína.', 'Articaína.', 'Mepivacaína.', 'Procaína.', 'Bupivacaína.'], a: 3,
        w: 'Éster: procaína. Amidas: lidocaína, articaína, mepivacaína (e bupivacaína), as mais usadas, com melhor perfil de segurança.', f: F_A1, net: false },
      { id: 'f09', tema: 'Anestésicos locais', ctx: 'A escolha do anestésico depende do tipo de procedimento, da duração esperada e das condições clínicas do paciente. Considerando a classificação dos anestésicos locais, analise as afirmativas.',
        af: ['As amidas são os anestésicos mais usados atualmente, com melhor perfil de segurança.', 'Os ésteres são pouco usados hoje porque têm maior potencial alergênico.', 'A lidocaína e a articaína pertencem ao grupo dos ésteres.'],
        p: 'Está correto o que se afirma em', o: AF, a: 2, fixa: true,
        w: 'I e II. Verdadeiras. III. Falsa: lidocaína e articaína são amidas; o éster citado na aula é a procaína.', f: F_A1, net: false },
      { id: 'f10', tema: 'Anestésicos locais', ctx: 'No século XIX, a odontologia usou o óxido nitroso (gás hilariante) como anestésico. Depois veio outra substância, com muitos efeitos colaterais, que acabou substituída por derivados mais seguros.', p: 'Que substância foi essa?',
        o: ['Lidocaína.', 'Cocaína.', 'Articaína.', 'Midazolam.', 'Felipressina.'], a: 1,
        w: 'Ordem da aula: óxido nitroso, cocaína (muitos efeitos colaterais), procaína e, depois, as amidas (lidocaína, articaína).', f: F_A1, net: false },
      { id: 'f11', tema: 'Anestésicos locais', ctx: 'A anestesiologia odontológica busca analgesia (ausência de dor) durante os procedimentos, com segurança e conforto.', p: 'Como a aula define a anestesia local?',
        o: ['Perda de consciência controlada para o procedimento.', 'Interrupção definitiva da condução nervosa na região.', 'Interrupção reversível da condução do impulso nervoso em uma região, sem perda de consciência.', 'Bloqueio do sistema nervoso central para tirar a dor do corpo todo.', 'Relaxamento dos músculos da mastigação.'], a: 2,
        w: 'Anestesia local = interrupção REVERSÍVEL da condução do impulso nervoso numa região, SEM perda de consciência; age nos nervos periféricos.', f: F_A1, net: false },
      { id: 'f12', sm1par: true, tema: 'Anestésicos locais', ctx: 'A molécula do anestésico local tem três partes: grupo aromático lipofílico, cadeia intermediária e amina terminal hidrofílica.', p: 'O que a cadeia intermediária define?',
        o: ['Se o sal é éster ou amida.', 'A cor da solução no tubete.', 'A ligação aos canais de potássio.', 'A presença de vasoconstritor.', 'A via de excreção pelos rins.'], a: 0,
        w: 'A cadeia intermediária é o que classifica o anestésico como éster ou amida.', f: F_SM1, net: false },
      { id: 'f13', sm1par: true, tema: 'Anestésicos locais', ctx: 'Na estrutura química do anestésico local, uma parte tem afinidade pela gordura e outra pela água.', p: 'Qual parte é a hidrofílica, ligada à solubilidade do sal em meio aquoso?',
        o: ['O grupo aromático.', 'A cadeia intermediária.', 'A amina terminal.', 'O vasoconstritor.', 'O conservante.'], a: 2,
        w: 'Amina terminal = hidrofílica (água). Grupo aromático = lipofílico, atravessa a membrana do nervo.', f: F_SM1, net: false },
      { id: 'f14', sm1par: true, tema: 'Vasoconstritores', ctx: 'Uma solução anestésica com vasoconstritor foi escolhida para uma exodontia. Considerando o papel do vasoconstritor, analise as afirmativas.',
        af: ['Diminui a velocidade de absorção do anestésico para a corrente sanguínea.', 'Reduz a toxicidade sistêmica do sal anestésico.', 'Acelera o metabolismo hepático do anestésico na primeira passagem.'],
        p: 'Está correto o que se afirma em', o: AF, a: 2, fixa: true,
        w: 'I e II. Verdadeiras: absorção mais lenta = menos anestésico no sangue de uma vez. III. Falsa: o vasoconstritor não acelera o metabolismo hepático.', f: F_SM1, net: false },
      { id: 'f15', sm1par: true, tema: 'Técnicas na mandíbula', ctx: 'Paciente desenvolveu trismo depois de um bloqueio na mandíbula e agora abre muito pouco a boca. Ele precisa de uma nova anestesia do lado inferior.', p: 'Qual técnica é indicada para esse paciente?',
        o: ['Gow-Gates, com a boca bem aberta.', 'Vazirani-Akinosi, com a boca fechada.', 'Bloqueio nasopalatino.', 'Infiltração supraperiosteal na mandíbula.', 'Intrapulpar.'], a: 1,
        w: 'Vazirani-Akinosi: dentes ocluídos, agulha longa paralela ao plano oclusal, 25 mm, 1,5 a 1,8 mL; indicada na limitação de abertura (trismo). A Gow-Gates exige boca bem aberta.', f: F_MAN + '; ' + F_SM1, net: false },
      { id: 'f16', sm1par: true, tema: 'Sistema nervoso autônomo', ctx: 'Antes de uma extração, um paciente muito ansioso relata boca seca e saliva grossa, "pegajosa".', p: 'Essa saliva mais viscosa e rica em proteínas é típica do predomínio de qual divisão do SNA?',
        o: ['Parassimpática.', 'Simpática.', 'Motora somática.', 'Nenhuma: o SNA não atua na saliva.', 'Sistema nervoso central apenas.'], a: 1,
        w: 'Simpático (luta e fuga, ansiedade) = saliva viscosa e rica em proteínas. Parassimpático = saliva aquosa e abundante.', f: F_SM1, net: false },
      { id: 'f17', tema: 'Técnicas na maxila', ctx: 'Para restaurar um único pré-molar superior, o cirurgião-dentista escolhe a infiltração supraperiosteal. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.',
        af: ['Na maxila, a infiltração supraperiosteal é a técnica mais usada para dentes unitários.', 'A maxila é um osso poroso, que permite a difusão da solução anestésica até as terminações nervosas.'],
        ar: true, p: 'A respeito dessas asserções, assinale a opção correta.', o: AR, a: 0, fixa: true,
        w: 'As duas são verdadeiras e a II explica a I. Na mandíbula, osso mais denso, a infiltração é menos eficaz e o bloqueio é a regra.', f: F_TP1 + '; ' + F_MAX, net: false },
      { id: 'f18', tema: 'Técnicas na maxila', ctx: 'Uma cirurgia no palato envolve a mucosa palatina dos pré-molares e molares superiores.', p: 'Qual bloqueio anestesia essa região, com punção próxima ao forame palatino maior?',
        o: ['Nasopalatino.', 'Palatino maior.', 'Infraorbitário.', 'Alveolar superior anterior.', 'Alveolar superior posterior.'], a: 1,
        w: 'Palatino maior: mucosa palatina de pré-molares e molares, perto do forame palatino maior, 0,25 a 0,5 mL. O nasopalatino é de canino a canino.', f: F_TP1, net: false },
      { id: 'f19', tema: 'Técnicas na maxila', ctx: 'Para remover o freio labial superior, é preciso anestesiar o palato anterior, de canino a canino.', p: 'Qual é o ponto de punção do bloqueio do nervo nasopalatino?',
        o: ['Forame infraorbitário.', 'Fossa canina.', 'Papila incisiva.', 'Forame palatino maior.', 'Triângulo retromolar.'], a: 2,
        w: 'Nasopalatino: punção na papila incisiva, 0,2 a 0,3 mL, injetando devagar porque pode doer.', f: F_TP1 + '; ' + F_MAX, net: false },
      { id: 'f20', tema: 'Técnicas na maxila', ctx: 'Para extrair o segundo molar superior, o cirurgião-dentista faz o bloqueio do nervo alveolar superior posterior (PSA). Considerando a técnica dos slides, analise as afirmativas.',
        af: ['O PSA anestesia os molares superiores, às vezes com exceção da raiz mesiovestibular do 1º molar.', 'Usa-se agulha longa, inserida na palatina do segundo molar.', 'A agulha é direcionada para trás, para cima e para dentro, a 45°.'],
        p: 'Está correto o que se afirma em', o: AF, a: 3, fixa: true,
        w: 'I e III. Verdadeiras. II. Falsa: agulha CURTA, calibre 27 ou 30, inserida na VESTIBULAR acima do 2º molar; depósito de 0,9 a 1,2 mL.', f: F_MAX, net: false },
      { id: 'f21', tema: 'Técnicas na maxila', ctx: 'Após um bloqueio infraorbitário para tratar incisivos, canino e pré-molares superiores, o paciente comenta que outras partes do rosto também ficaram dormentes.', p: 'Além dos dentes, essa técnica anestesia:',
        o: ['Lábio inferior e mento.', 'Lábio superior, asa do nariz e pálpebra inferior.', 'Língua e assoalho da boca.', 'Palato mole.', 'Gengiva vestibular dos molares inferiores.'], a: 1,
        w: 'O infraorbitário pega ASA + ASM (incisivos a pré-molares) e também lábio superior, asa do nariz e pálpebra inferior. Punção no fundo de vestíbulo sobre o 1º pré-molar, rumo ao forame palpado.', f: F_MAX, net: false },
      { id: 'f22', tema: 'Técnicas na maxila', ctx: 'Nem sempre o bloqueio PSA anestesia todas as raízes do primeiro molar superior.', p: 'Qual nervo inerva os pré-molares superiores e a raiz mesiovestibular do 1º molar?',
        o: ['Alveolar superior anterior (ASA).', 'Alveolar superior médio (ASM).', 'Nasopalatino.', 'Palatino maior.', 'Bucal.'], a: 1,
        w: 'ASM: pré-molares + raiz MV do 1º molar; punção no fundo de vestíbulo do 2º pré-molar, 0,9 a 1,2 mL. Por isso o PSA pode não pegar essa raiz.', f: F_MAPA + '; ' + F_MAX, net: false },
      { id: 'f23', tema: 'Técnicas na mandíbula', ctx: 'No bloqueio do nervo alveolar inferior, a agulha longa entra no triângulo retromolar, de 6 a 10 mm acima do plano oclusal, e avança até tocar o osso (cerca de 20 a 25 mm).', p: 'Depois do contato ósseo, qual é o passo correto?',
        o: ['Avançar mais 5 mm e injetar rápido.', 'Recuar 1 mm, aspirar e injetar 1,0 a 1,5 mL lentamente.', 'Injetar 3,6 mL sem aspirar.', 'Retirar a agulha e repetir do outro lado.', 'Forçar a agulha até o forame mentual.'], a: 1,
        w: 'Recua 1 mm, aspira e injeta 1,0 a 1,5 mL devagar. Se não houver contato ósseo, não forçar: risco de injetar no músculo pterigóideo medial.', f: F_MAN, net: false },
      { id: 'f24', tema: 'Técnicas na mandíbula', ctx: 'Um paciente vai tratar vários dentes de um lado da mandíbula e recebe o bloqueio do nervo alveolar inferior. Considerando a técnica, analise as afirmativas.',
        af: ['O bloqueio anestesia todos os dentes daquele lado da mandíbula.', 'O bloqueio anestesia todos os tecidos moles do hemiarco, inclusive a vestibular dos molares.', 'O nervo lingual é anestesiado no recuo da agulha, com cerca de 0,3 mL.'],
        p: 'Está correto o que se afirma em', o: AF, a: 3, fixa: true,
        w: 'I e III. Verdadeiras. II. Falsa: a vestibular dos molares fica de fora; para ela se faz o bloqueio do nervo bucal.', f: F_MAN, net: false },
      { id: 'f25', tema: 'Técnicas na mandíbula', ctx: 'Durante a extração de um molar inferior, já com o bloqueio do alveolar inferior e do lingual, o paciente ainda sente dor na gengiva vestibular do molar.', p: 'Qual bloqueio completa a anestesia dessa região?',
        o: ['Mentual.', 'Bucal.', 'Nasopalatino.', 'Infraorbitário.', 'Palatino maior.'], a: 1,
        w: 'Bucal: agulha curta na mucosa distal e vestibular ao último molar, 0,3 a 0,5 mL; anestesia a mucosa e a gengiva vestibular dos molares inferiores.', f: F_MAN, net: false },
      { id: 'f26', tema: 'Técnicas na mandíbula', ctx: 'O bloqueio convencional do alveolar inferior falhou duas vezes, e o cirurgião-dentista pensa em outra técnica de bloqueio mandibular. Considerando o texto, avalie as asserções a seguir e a relação proposta entre elas.',
        af: ['A técnica de Gow-Gates é indicada quando o bloqueio convencional falha.', 'Na Gow-Gates, o paciente fica com os dentes ocluídos e a agulha entra paralela ao plano oclusal.'],
        ar: true, p: 'A respeito dessas asserções, assinale a opção correta.', o: AR, a: 2, fixa: true,
        w: 'I é verdadeira. II é falsa: isso descreve a Vazirani-Akinosi. Na Gow-Gates a boca fica bem aberta e a agulha vai rumo ao colo do côndilo, 1,8 mL.', f: F_MAN, net: false },
      { id: 'f27', tema: 'Técnicas especiais', ctx: 'Uma técnica anestésica precisa de perfuração prévia do osso e tem latência imediata.', p: 'Qual é essa técnica, e qual o risco citado nos slides?',
        o: ['Intrapapilar; risco de necrose da papila.', 'Intraóssea; risco de taquicardia, pelo contato rápido do vasoconstritor com a circulação.', 'Intrapulpar; risco de trismo.', 'Tópica; risco de parestesia.', 'Intrasseptal; risco de paralisia facial.'], a: 1,
        w: 'Intraóssea: perfuração prévia, latência imediata e risco de taquicardia, porque o vasoconstritor cai rápido na circulação.', f: F_TP1, net: false },
      { id: 'f28', tema: 'Técnicas especiais', ctx: 'Além das infiltrações e bloqueios, existem técnicas intrabucais especiais, com volumes pequenos. Considerando os slides, analise as afirmativas.',
        af: ['A intraligamentar é feita no sulco gengival, sob pressão, com 0,2 mL por raiz, para anestesia unitária.', 'A intrapulpar é indolor e indicada na rotina clínica geral.', 'A intrasseptal é feita no osso interproximal, com 0,2 a 0,4 mL, e é útil em cirurgias periodontais.'],
        p: 'Está correto o que se afirma em', o: AF, a: 3, fixa: true,
        w: 'I e III. Verdadeiras. II. Falsa: a intrapulpar é extremamente dolorosa (mas eficaz) e raramente indicada na rotina.', f: F_TP1, net: false },
      { id: 'f29', tema: 'Técnicas especiais', ctx: 'Antes da punção, o cirurgião-dentista aplica anestésico tópico na mucosa do paciente.', p: 'Sobre a anestesia tópica, é correto afirmar que:',
        o: ['Anestesia tecidos profundos e a polpa do dente.', 'É aplicada diretamente na mucosa, sem punção, e faz um bloqueio superficial de ação curta.', 'Substitui o bloqueio do alveolar inferior em exodontias.', 'Tem longa duração, de várias horas.', 'Só pode ser usada no palato.'], a: 1,
        w: 'Tópica: sem punção, bloqueio superficial das terminações nervosas. Limitações: baixa penetração, efeito só na superfície, ação curta. Locais: mucosa jugal, palato, papilas e assoalho.', f: F_TP1, net: false },
      { id: 'f30', tema: 'Complicações', ctx: 'Os slides de técnicas na mandíbula listam cuidados gerais e complicações possíveis da anestesia. Considerando esse material, analise as afirmativas.',
        af: ['A aspiração é obrigatória em todas as técnicas.', 'A paralisia facial transitória pode ocorrer por injeção inadvertida no nervo facial.', 'O hematoma é uma complicação decorrente de lesão vascular.'],
        p: 'Está correto o que se afirma em', o: AF, a: 4, fixa: true,
        w: 'As três são verdadeiras. Outras complicações dos slides: falha anestésica, parestesia transitória (lingual ou alveolar inferior) e trismo (músculo pterigóideo).', f: F_MAN, net: false }
    ]
  };
})();
/* Banco "Imaginologia aplicada à patologia" (palestra da Profa. Mariana, 10/11/2026, 2º período).
   Fonte única: Faculdade\estudo\Radiologia\PALESTRA-IMAGINOLOGIA-2026-11-10.md (slides + fala). Montado em 11/11/2026.
   Mesmo formato de bancos.js: id, tema, ctx, p, o (5), a (índice da certa), w, f; af = afirmativas; ar = asserção e razão; fixa = não embaralha. */
window.BANCOS = window.BANCOS || {};
(function () {
  const F = 'Palestra da Profa. Mariana, Imaginologia aplicada à patologia (10/11/2026)';
  const AR = [
    'As asserções I e II são verdadeiras, e a II é uma justificativa correta da I.',
    'As asserções I e II são verdadeiras, mas a II não é uma justificativa correta da I.',
    'A asserção I é verdadeira, e a II é falsa.',
    'A asserção I é falsa, e a II é verdadeira.',
    'As asserções I e II são falsas.'
  ];
  const ARCTX = ' Avalie as asserções a seguir e a relação proposta entre elas.';
  const ARP = 'A respeito dessas asserções, assinale a opção correta.';
  const AFP = 'Está correto o que se afirma em';

  window.BANCOS.imagino = {
    curso: 'Odontologia',
    materia: 'Imaginologia aplicada à patologia (palestra)',
    curta: 'Imaginologia',
    prof: 'Profa. Mariana',
    turma: '3008',
    proxima: 'Palestra de 10/11. Bônus pra treinar leitura de imagem, não é matéria de prova',
    modos: [
      { id: 'completo', nome: 'Simulado completo', sub: '10 questões sorteadas de toda a palestra.', temas: null },
      { id: 't-leitura', nome: 'Como ler a imagem', sub: 'Densidade, borda, lóculos e efeitos nos vizinhos.', temas: ['Densidade', 'Limites e lóculos', 'Efeitos nos vizinhos'] },
      { id: 't-anatomia', nome: 'Anatomia normal e exames', sub: 'O que é normal na panorâmica, forame mentual e os três exames.', temas: ['Anatomia normal', 'Exames'] },
      { id: 't-localizacao', nome: 'Localização', sub: 'Onde está? A posição já dá pistas.', temas: ['Localização'] },
      { id: 't-analogias', nome: 'Analogias', sub: 'Bolhas de sabão, raquete de tênis, raios de sol...', temas: ['Analogias'] },
      { id: 't-diagnostico', nome: 'Diagnóstico e conduta', sub: 'Quebra-cabeça, paciente, hipóteses, biópsia e conduta.', temas: ['Diagnóstico'] },
      { id: 't-lesoes', nome: 'Lesões da palestra', sub: 'Periapical inflamatória, dentígero, ameloblastoma, odontoma, displasia.', temas: ['Cistos e lesão periapical', 'Ameloblastoma e odontoma', 'Displasia e radiopacidades'] },
      { id: 't-desafios', nome: 'Desafios', sub: 'Os exercícios que ela fez com a turma.', temas: ['Desafios'] },
      { id: 'afirm', nome: 'Afirmativas I, II, III', sub: 'Questões no estilo "está correto o que se afirma em" e de asserção e razão.', temas: null, af: true },
      { id: 'erros', nome: 'Revisar meus erros', sub: 'Só as questões que você errou ou deixou em branco aqui.', temas: null, erros: true }
    ],
    revisao: [
      { t: 'Como ler a imagem', i: [
        'Radiopaco = claro (mais denso, barra o raio X). Radiolúcido = escuro (menos denso, ex.: cisto, interior líquido). Mista = as duas densidades.',
        'As 4 perguntas: onde está? clara ou escura? como é a borda? o que faz com os vizinhos?',
        'Borda: corticalizada (linha branca, cresce devagar) · bem definida (intermediária) · difusa (borrada, sinal de alerta).',
        'Unilocular = uma cavidade. Multilocular = várias, separadas por septos, mesmo incompletos.',
        'Deslocar dentes e abaular a cortical = crescimento lento. Romper a cortical = mais agressivo. Dentes "flutuantes" = maligna.',
        'Abaulamento/rompimento das corticais vestibular e lingual pedem tomografia.'
      ] },
      { t: 'Normal ou lesão?', i: [
        'Radiolúcidos normais: seio maxilar, cavidade nasal, canal mandibular, forame mentual. Radiopacos: palato duro, base da mandíbula, côndilo.',
        'Forame mentual x lesão periapical: variar a angulação HORIZONTAL; se a imagem sai do ápice, é forame. Somar o teste de vitalidade. Na tomografia essa dúvida não existe.',
        'Periapical = detalhe de poucos dentes. Panorâmica = visão geral e triagem (achados incidentais). Tomografia (TCFC) = 3D, quando ainda há dúvida.'
      ] },
      { t: 'Pistas e conduta', i: [
        'Diagnóstico = clínica + imagem + biópsia. Imagem + histopatologia fecham o diagnóstico.',
        'Localização: radicular (ápice de dente sem vitalidade), residual (área de extração), periodontal lateral (ao lado da raiz), dentígero (coroa de dente incluso), de erupção, gengival (tecido mole), ceratocisto (posterior).',
        'Analogias (nenhuma patognomônica): bolhas de sabão = ameloblastoma; raquete de tênis = mixoma; dentículos = odontoma composto; raios de sol = osteossarcoma; roído de traça = lesões agressivas.',
        'Paciente conta: massas radiopacas em vários quadrantes em mulher negra de meia-idade = displasia cemento-óssea florida; em menino de 10 anos = cementoma gigantiforme familiar ou síndrome de Gardner.',
        '"Ouviu cascos, pense em cavalos": primeiro o mais frequente, depois os diferenciais.',
        'Nem toda lesão aparece na imagem. Na dúvida, biópsia. Nenhuma lesão nasce grande.',
        'Conduta: acompanhar (displasia, osteoesclerose idiopática) · tratar a causa (periapical inflamatória) · cirurgia o quanto antes (ameloblastoma, ceratocisto).'
      ] },
      { t: 'Lesões da palestra', i: [
        'Periapical inflamatória: ápice de dente SEM vitalidade (cárie ou trauma), radiolúcida, unilocular, bem definida, lâmina dura interrompida.',
        'Cisto dentígero: coroa de dente incluso (3º molar, canino), radiolúcido unilocular, corticado. Espaço pericoronário de 4 a 6 mm já faz pensar em cisto.',
        'Ameloblastoma: posterior de mandíbula, radiolúcido, multi (ou uni) locular, abaula a cortical, reabsorve raízes. Benigno, mas exige margem.',
        'Odontoma: sobre dente que não erupcionou, radiopaco com halo radiolúcido, pode impedir a erupção.',
        'Displasia cemento-óssea periapical: incisivos inferiores, dentes VITAIS; radiolúcida → mista → radiopaca.',
        'Radiopacidades no ápice: displasia (acompanhar), osteíte condensante (tratar o canal), osteoesclerose idiopática e hipercementose (nada a tratar), cementoblastoma (remover).'
      ] }
    ],
    q: [
      { id: 'im01', tema: 'Diagnóstico',
        ctx: 'Um colega vê uma área radiolúcida bem definida na panorâmica e diz que já pode fechar o diagnóstico só com a imagem. O diagnóstico por imagem pode ser comparado a um quebra-cabeça.',
        p: 'Qual afirmação está correta?',
        o: ['A radiografia sozinha fecha o diagnóstico sempre que a lesão é bem definida.',
            'O diagnóstico vem da união de clínica, imagem e biópsia (histopatológico); nenhuma peça sozinha resolve.',
            'A biópsia dispensa a imagem, porque o patologista só precisa da lâmina.',
            'A clínica sozinha basta quando há aumento de volume.',
            'A tomografia substitui a biópsia nas lesões multiloculares.'],
        a: 1,
        w: 'Slide 4: Clínica + Imagem + Biópsia → Diagnóstico. Ela disse que nenhum dos três resolve sozinho e que o patologista também precisa da imagem e das informações clínicas.',
        f: F + ', slide 4' },

      { id: 'im02', tema: 'Densidade',
        ctx: 'Na radiografia, um cisto aparece escuro (radiolúcido) dentro do osso.',
        p: 'Por que isso acontece?',
        o: ['Porque o cisto é mais mineralizado que o osso e barra o raio X.',
            'Porque o interior do cisto (líquido) é menos mineralizado que o osso e deixa o feixe passar.',
            'Porque o cisto absorve totalmente o raio X.',
            'Porque a radiolucidez depende apenas do tempo de exposição.',
            'Porque todo cisto tem focos calcificados no interior.'],
        a: 1,
        w: 'O mais denso barra o raio X e fica claro; o menos denso deixa passar e fica escuro. Na lesão radiolúcida o osso é substituído por algo menos mineralizado; no cisto o interior é líquido.',
        f: F + ', fala sobre radiopaco x radiolúcido (slides 19 e 20)' },

      { id: 'im03', tema: 'Densidade',
        ctx: 'Uma lesão aparece como uma área escura que contém vários pontos claros no seu interior.',
        p: 'Quanto à densidade, como essa lesão deve ser descrita?',
        o: ['Radiolúcida', 'Radiopaca', 'Mista', 'Corticalizada', 'Difusa'],
        a: 2,
        w: 'Mista = as duas densidades na mesma lesão: radiolúcida com focos radiopacos dentro (slide 19). Corticalizada e difusa descrevem a BORDA, não a densidade.',
        f: F + ', slides 19 e 20' },

      { id: 'im04', tema: 'Densidade',
        ctx: 'Na radiografia, o esmalte aparece como a estrutura mais clara do dente.' + ARCTX,
        p: ARP, o: AR, a: 4, fixa: true, ar: true,
        af: ['O esmalte aparece radiolúcido na radiografia.',
             'Estruturas mais densas deixam o raio X passar e por isso ficam escuras.'],
        w: 'I falsa: o esmalte é radiopaco (claro). II falsa: o mais denso BARRA o raio X e fica claro; o menos denso deixa passar e fica escuro (o ar é o mais escuro).',
        f: F + ', fala sobre radiopaco x radiolúcido' },

      { id: 'im05', tema: 'Anatomia normal',
        ctx: 'Na periapical de um pré-molar inferior aparece uma imagem circular radiolúcida bem perto do ápice. O dente não tem cárie e responde ao teste de vitalidade.',
        p: 'Qual é o raciocínio mais adequado?',
        o: ['Pensar em forame mentual e fazer nova radiografia variando a angulação horizontal: se a imagem sair do ápice, é anatomia.',
            'Indicar tratamento de canal, pois toda imagem radiolúcida no ápice é lesão periapical.',
            'Fazer nova radiografia variando a angulação vertical, que funciona melhor que a horizontal.',
            'Se a imagem continuar presa ao ápice após mudar a angulação, confirma-se o forame mentual.',
            'Indicar biópsia imediata, pois é obrigatoriamente um cisto.'],
        a: 0,
        w: 'Confundir forame mentual com lesão periapical é "um erro muito clássico". Muda-se a angulação HORIZONTAL (melhor que a vertical): se a imagem sai do lugar = forame; se fica presa ao ápice = lesão. Dente vital também aponta para forame.',
        f: F + ', fala sobre forame mentual x lesão periapical' },

      { id: 'im06', tema: 'Anatomia normal',
        ctx: 'A professora explicou como diferenciar o forame mentual de uma lesão periapical inflamatória. Analise as afirmativas.',
        p: AFP,
        o: ['I, apenas.', 'III, apenas.', 'I e II, apenas.', 'I e III, apenas.', 'I, II e III.'],
        a: 2, fixa: true,
        af: ['A dúvida existe porque a radiografia é bidimensional (sobreposição); na tomografia ela não acontece.',
             'Se, ao variar a angulação horizontal, a imagem continuar presa ao ápice, deve-se pensar em lesão daquele dente.',
             'Variar a angulação vertical é mais eficiente do que a horizontal para essa distinção.'],
        w: 'I e II verdadeiras. III falsa: ela disse que variar na HORIZONTAL funciona melhor que na vertical.',
        f: F + ', fala sobre forame mentual x lesão periapical' },

      { id: 'im07', tema: 'Anatomia normal',
        ctx: 'Antes de procurar lesão, é preciso reconhecer as estruturas normais da panorâmica.',
        p: 'Qual alternativa reúne apenas estruturas RADIOPACAS?',
        o: ['Seio maxilar, cavidade nasal e côndilo',
            'Palato duro, base da mandíbula e côndilo',
            'Canal mandibular, forame mentual e palato duro',
            'Cavidade nasal, base da mandíbula e forame mentual',
            'Seio maxilar, canal mandibular e forame mentual'],
        a: 1,
        w: 'Slide 13: radiopacas (claras) = palato duro, base da mandíbula, côndilo. Radiolúcidas (escuras) = seio maxilar, cavidade nasal, canal mandibular, forame mentual.',
        f: F + ', slide 13' },

      { id: 'im08', tema: 'Desafios',
        ctx: 'No desafio da panorâmica com letras, a área "a" era uma imagem radiolúcida entre os incisivos superiores, acima dos ápices.' + ARCTX,
        p: ARP, o: AR, a: 2, fixa: true, ar: true,
        af: ['Essa imagem pode corresponder a uma estrutura anatômica normal da região.',
             'Nessa região não existe estrutura anatômica, então qualquer imagem radiolúcida ali é lesão.'],
        w: 'I verdadeira: ela lembrou que ali existe estrutura anatômica, mas que também pode haver patologia (bordas mais arredondadas = aspecto mais cístico; histopatológico confirma). II falsa: existe estrutura anatômica ali. "Lembrem o que é normal e o que não é."',
        f: F + ', desafio extra (panorâmica de Lopes, Handem, Capelozza, 2016)' },

      { id: 'im09', tema: 'Exames',
        ctx: 'Um paciente sem queixa vai ao consultório só para a limpeza de 6 em 6 meses. Na panorâmica de rotina aparece uma lesão que não dá sintoma.',
        p: 'Como esse achado é chamado e o que ele mostra?',
        o: ['Achado incidental; mostra a importância da panorâmica de triagem.',
            'Erro de técnica; a panorâmica deve ser repetida e o achado, desconsiderado.',
            'Diagnóstico definitivo; dispensa a biópsia.',
            'Achado incidental; prova que lesão sem sintoma não precisa ser investigada.',
            'Artefato; a periapical é que deve ser usada para triagem geral.'],
        a: 0,
        w: 'Ela falou dos achados incidentais: mesmo no paciente que só vem para limpeza, a panorâmica pode achar uma patologia sem sintoma. Por isso a panorâmica de triagem é importante. E a dúvida tem que ser investigada.',
        f: F + ', slide 15 e fala sobre achados incidentais' },

      { id: 'im10', tema: 'Exames',
        ctx: 'Existem três exames de imagem. Analise as afirmativas.',
        p: AFP,
        o: ['I, apenas.', 'II, apenas.', 'I e II, apenas.', 'I e III, apenas.', 'I, II e III.'],
        a: 3, fixa: true,
        af: ['A periapical mostra o detalhe de poucos dentes.',
             'A panorâmica é o exame de escolha para ver o detalhe de um único dente.',
             'A tomografia (TCFC) mostra a imagem em 3D, em cortes, e costuma ser pedida quando ainda há dúvida.'],
        w: 'I verdadeira (slide 15). II falsa: a panorâmica dá a VISÃO GERAL dos maxilares (triagem). III verdadeira: TCFC = 3D, em cortes; ela disse que é o exame pedido depois, quando ainda há dúvida.',
        f: F + ', slide 15' },

      { id: 'im11', tema: 'Exames',
        ctx: 'Uma lesão grande na mandíbula parece estufar o osso e, talvez, romper a cortical lingual. Na panorâmica só se vê parte do contorno.',
        p: 'Qual exame é indicado para avaliar as corticais vestibular e lingual?',
        o: ['Outra panorâmica com mais tempo de exposição',
            'Periapical de um único dente',
            'Tomografia computadorizada de feixe cônico (TCFC)',
            'Nenhum: a panorâmica já mostra as duas corticais',
            'Teste de vitalidade pulpar'],
        a: 2,
        w: 'Slide 26: "Abaulamento e rompimento das corticais vestibular e lingual pedem tomografia; na panorâmica só se vê parte do contorno."',
        f: F + ', slide 26' },

      { id: 'im12', tema: 'Localização',
        ctx: 'A panorâmica mostra uma área radiolúcida, unilocular e corticada envolvendo a coroa de um terceiro molar inferior incluso.',
        p: 'Pela localização, qual é a principal hipótese?',
        o: ['Cisto radicular', 'Cisto residual', 'Cisto dentígero', 'Cisto periodontal lateral', 'Cisto gengival'],
        a: 2,
        w: 'Slide 18: dentígero = coroa de dente incluso. Ela disse que é "uma patologia muito comum associada a dente incluso" (3º molar e canino são os mais encontrados inclusos).',
        f: F + ', slides 18 e 41' },

      { id: 'im13', tema: 'Localização',
        ctx: 'Um paciente teve um dente extraído por causa de uma lesão no ápice (cisto radicular). Anos depois, a radiografia mostra uma área radiolúcida bem definida exatamente na região da extração, onde não há mais dente.',
        p: 'Qual é a hipótese mais coerente?',
        o: ['Cisto dentígero', 'Cisto residual', 'Cisto de erupção', 'Cisto periodontal lateral', 'Odontoma'],
        a: 1,
        w: 'Residual = área de extração. Ela explicou: era um cisto radicular (inflamatório), o dente foi removido e a lesão ficou; "ele não é mais radicular, agora é residual".',
        f: F + ', slide 18 e fala' },

      { id: 'im14', tema: 'Desafios',
        ctx: 'No Desafio 2, a imagem mostrava, no corpo do osso entre dois dentes, uma lesão escura com várias lojas, cada uma com contorno branco. Os dois dentes estavam afastados e inclinados para os lados.',
        p: 'Aplicando as 4 perguntas básicas de leitura da imagem, qual descrição está correta?',
        o: ['Entre os dentes; radiolúcida; multilocular, bem definida e com bordas corticadas; desloca os dentes.',
            'No ápice; radiopaca; unilocular e difusa; reabsorve as raízes.',
            'Entre os dentes; mista; borda difusa; rompe a cortical.',
            'Na coroa de dente incluso; radiolúcida; unilocular; impede a erupção.',
            'Entre os dentes; radiolúcida; unilocular, porque as lojas se tocam; não afeta os vizinhos.'],
        a: 0,
        w: 'Resolução feita em sala: no corpo do osso entre os dentes, escura, bordas corticadas e bem definida, com efeito de deslocamento dos dentes. Várias lojas = multilocular.',
        f: F + ', Desafio 2' },

      { id: 'im15', tema: 'Localização',
        ctx: 'O slide "Onde está? A posição já dá pistas" associou cada cisto a um local. Analise as afirmativas.',
        p: AFP,
        o: ['I, apenas.', 'II, apenas.', 'I e III, apenas.', 'II e III, apenas.', 'I, II e III.'],
        a: 2, fixa: true,
        af: ['Cisto radicular: ápice de dente sem vitalidade.',
             'Cisto residual: em volta da coroa de dente incluso.',
             'Ceratocisto: comum em região posterior.'],
        w: 'I e III verdadeiras (slide 18). II falsa: residual = área de extração; em volta da coroa de dente incluso é o dentígero.',
        f: F + ', slide 18' },

      { id: 'im16', tema: 'Limites e lóculos',
        ctx: 'Duas lesões radiolúcidas de tamanho parecido. A lesão A tem uma linha branca bem marcada em volta. Na lesão B a borda é borrada: não dá pra saber onde ela termina.',
        p: 'Qual interpretação é coerente?',
        o: ['A sugere crescimento lento; B é sinal de alerta para comportamento mais agressivo.',
            'A é sinal de alerta; B sugere crescimento lento.',
            'As duas são igualmente tranquilas, porque ambas são radiolúcidas.',
            'A linha branca de A indica rompimento da cortical.',
            'B é certamente maligna, e por isso dispensa biópsia.'],
        a: 0,
        w: 'Slide 21: corticalizada (linha branca) = cresce devagar; bem definida = intermediária; difusa (borrada) = sinal de alerta. Nem a difusa dispensa biópsia: imagem + histopatologia fecham o diagnóstico.',
        f: F + ', slides 21 e 22' },

      { id: 'im17', tema: 'Limites e lóculos',
        ctx: 'A borda da lesão é uma das 4 perguntas básicas de leitura da imagem.' + ARCTX,
        p: ARP, o: AR, a: 2, fixa: true, ar: true,
        af: ['A borda difusa, borrada, é considerada sinal de alerta.',
             'Lesões de borda difusa crescem devagar, e por isso o osso tem tempo de formar uma linha cortical em volta delas.'],
        w: 'I verdadeira (slide 21). II falsa: quem tem a linha branca (corticalizada) é a lesão que cresce devagar; a difusa não tem linha e é ligada a lesões mais agressivas.',
        f: F + ', slide 21' },

      { id: 'im18', tema: 'Limites e lóculos',
        ctx: 'Uma lesão radiolúcida mostra várias cavidades separadas por septos ósseos. Alguns septos não chegam a separar por completo uma loja da outra.',
        p: 'Como essa lesão deve ser classificada?',
        o: ['Unilocular, porque os septos não separam completamente as lojas.',
            'Multilocular, mesmo com septos incompletos.',
            'Mista, porque os septos são radiopacos.',
            'Difusa, porque não há uma borda única.',
            'Não é possível classificar sem biópsia.'],
        a: 1,
        w: 'Ela explicou que os septos não precisam separar completamente uma loja da outra e mesmo assim já se considera multilocular. "Mista" fala de densidade (focos radiopacos dentro da lesão), não de septos.',
        f: F + ', slide 23 e fala' },

      { id: 'im19', tema: 'Efeitos nos vizinhos',
        ctx: 'Lesão X: empurrou os dentes e estufou o osso, deixando a cortical fina como casca de ovo. Lesão Y: destruiu o osso sem deslocar os dentes, que ficaram como se "flutuassem", e a cortical sumiu.',
        p: 'Qual leitura está correta?',
        o: ['X sugere crescimento lento; Y sugere comportamento mais agressivo, como o descrito para lesões malignas.',
            'X é mais agressiva, porque deslocar dentes exige crescimento rápido.',
            'As duas têm o mesmo comportamento, pois ambas afetam os vizinhos.',
            'Y é tranquila, porque não deslocou os dentes.',
            'X rompeu a cortical; Y apenas a abaulou.'],
        a: 0,
        w: 'Slide 24: deslocar e abaular = crescimento lento ("deu tempo de deslocar"); romper a cortical = mais agressivo. Dentes "flutuantes" (sem suporte, sem deslocamento) foi a característica citada para lesões malignas.',
        f: F + ', slides 24 a 26 e fala' },

      { id: 'im20', tema: 'Efeitos nos vizinhos',
        ctx: 'Analise as afirmativas sobre o que a lesão faz com as estruturas vizinhas.',
        p: AFP,
        o: ['I, apenas.', 'II, apenas.', 'I e II, apenas.', 'II e III, apenas.', 'I, II e III.'],
        a: 4, fixa: true,
        af: ['Raízes que aparecem "cortadas" retas sobre a lesão indicam reabsorção radicular.',
             'Deslocar dentes e abaular a cortical sugerem crescimento lento.',
             'Dentes "flutuantes", sem suporte ósseo, foram citados como característica de lesões malignas.'],
        w: 'Todas verdadeiras: slide 25 (raízes cortadas = reabsorção), slide 24 (deslocar e abaular = crescimento lento) e fala sobre lesões malignas (dentes flutuantes).',
        f: F + ', slides 24 e 25 e fala' },

      { id: 'im21', tema: 'Efeitos nos vizinhos',
        ctx: 'Uma lesão cresceu, empurrou os dentes vizinhos e estufou a cortical.' + ARCTX,
        p: ARP, o: AR, a: 0, fixa: true, ar: true,
        af: ['Deslocamento dentário e abaulamento da cortical indicam crescimento lento.',
             'A lesão cresce devagar o suficiente para empurrar os dentes e estufar o osso, em vez de destruí-lo de imediato.'],
        w: 'As duas verdadeiras e a II justifica a I: ela disse que deslocar e abaular mostram que "deu tempo de deslocar"; a lesão agressiva rompe o osso sem antes afastá-lo.',
        f: F + ', slide 24 e fala' },

      { id: 'im22', tema: 'Analogias',
        ctx: 'Uma lesão multilocular tem septos bem retinhos, lembrando as cordas de uma raquete de tênis.',
        p: 'Pelas analogias clássicas da radiologia, em qual lesão pensar?',
        o: ['Ameloblastoma', 'Mixoma odontogênico', 'Odontoma composto', 'Osteossarcoma', 'Displasia cemento-óssea'],
        a: 1,
        w: 'Slide 28: raquete de tênis = mixoma odontogênico (septos retinhos). Bolhas de sabão = ameloblastoma; dentículos = odontoma composto; raios de sol = osteossarcoma.',
        f: F + ', slide 28' },

      { id: 'im23', tema: 'Analogias',
        ctx: 'Um aluno vê uma lesão multilocular com aspecto de bolhas de sabão e diz: "é ameloblastoma, está fechado".' + ARCTX,
        p: ARP, o: AR, a: 3, fixa: true, ar: true,
        af: ['O aspecto de bolhas de sabão é patognomônico de ameloblastoma.',
             'As analogias descritas na literatura ajudam a levantar hipóteses, mas nenhuma delas fecha sozinha o diagnóstico.'],
        w: 'I falsa: "Nenhuma é patognomônica" e nem toda lesão multilocular é ameloblastoma. II verdadeira: a analogia ajuda a pensar; junta-se com a clínica e o histopatológico.',
        f: F + ', slide 28 e fala' },

      { id: 'im24', tema: 'Analogias',
        ctx: 'Analise as associações entre o aspecto da imagem e a lesão em que se deve pensar.',
        p: AFP,
        o: ['I e II, apenas.', 'I e III, apenas.', 'II e IV, apenas.', 'I, II e IV, apenas.', 'I, II, III e IV.'],
        a: 0, fixa: true,
        af: ['Raios de sol: osteossarcoma.',
             'Roído de traça: lesões agressivas.',
             'Dentículos: ameloblastoma.',
             'Bolhas de sabão: mixoma odontogênico.'],
        w: 'I e II verdadeiras (slide 28). III falsa: dentículos = odontoma composto. IV falsa: bolhas de sabão = ameloblastoma (mixoma = raquete de tênis).',
        f: F + ', slide 28' },

      { id: 'im25', tema: 'Diagnóstico',
        ctx: 'No exame clínico há uma lesão ulcerada na mucosa. A panorâmica do mesmo paciente não mostra nenhuma alteração óssea.',
        p: 'Qual é a conduta adequada?',
        o: ['Tranquilizar o paciente, já que a imagem está normal.',
            'Fazer biópsia: imagem normal não quer dizer lesão menos importante, pode até ser maligna.',
            'Repetir a panorâmica em 6 meses antes de qualquer outra coisa.',
            'Considerar a lesão benigna, porque não atingiu o osso.',
            'Pedir tomografia, que sempre mostra lesões de mucosa.'],
        a: 1,
        w: 'Slide 29: "Imagem normal não quer dizer lesão menos importante: pode até ser maligna." Ela disse: "Nada pra se preocupar? Não, gente: biópsia."',
        f: F + ', slide 29 e fala' },

      { id: 'im26', tema: 'Diagnóstico',
        ctx: 'A radiografia mostra massas radiopacas em vários quadrantes. O paciente é um menino de 10 anos.',
        p: 'Nesse exemplo, em que hipóteses pensar?',
        o: ['Displasia cemento-óssea florida',
            'Cementoma gigantiforme familiar ou síndrome de Gardner (osteomas múltiplos)',
            'Cisto dentígero múltiplo',
            'Ameloblastoma multilocular',
            'Lesões periapicais inflamatórias em todos os dentes'],
        a: 1,
        w: 'Slide 34: a mesma imagem leva a hipóteses diferentes. Mulher negra de meia-idade = displasia cemento-óssea florida; menino de 10 anos = outras hipóteses, como cementoma gigantiforme familiar ou síndrome de Gardner.',
        f: F + ', slide 34' },

      { id: 'im27', tema: 'Diagnóstico',
        ctx: 'Considere o paciente e os exames.' + ARCTX,
        p: ARP, o: AR, a: 1, fixa: true, ar: true,
        af: ['Massas radiopacas em vários quadrantes, numa mulher negra de meia-idade, fazem pensar em displasia cemento-óssea florida.',
             'A periapical mostra o detalhe de poucos dentes, e a panorâmica dá a visão geral dos maxilares.'],
        w: 'As duas são verdadeiras (slides 34 e 15), mas falam de coisas diferentes: a II (tipos de exame) não explica a hipótese da I (que vem dos dados do paciente: idade, sexo, etnia).',
        f: F + ', slides 15 e 34' },

      { id: 'im28', tema: 'Diagnóstico',
        ctx: 'A professora citou uma frase da patologia: "Quando ouvir cascos, pense em cavalos, não em zebras".',
        p: 'O que essa frase orienta na hora de montar as hipóteses?',
        o: ['Pensar primeiro no mais frequente e no mais óbvio, e depois listar os diferenciais.',
            'Descartar sempre as lesões raras.',
            'Começar pelas lesões raras, para não deixar nenhuma passar.',
            'Dispensar a biópsia quando a lesão é comum.',
            'Fechar o diagnóstico pela histologia antes de olhar a imagem.'],
        a: 0,
        w: 'Slide 35: "Pense primeiro no mais frequente e no mais óbvio. Depois liste os diferenciais." O raro não é descartado: pode entrar como diferencial. A biópsia continua confirmando.',
        f: F + ', slide 35' },

      { id: 'im29', tema: 'Diagnóstico',
        ctx: 'O slide "A hipótese diagnóstica define a conduta" separou as lesões em três grupos. Analise as afirmativas.',
        p: AFP,
        o: ['I, apenas.', 'II, apenas.', 'I e II, apenas.', 'II e III, apenas.', 'I, II e III.'],
        a: 3, fixa: true,
        af: ['Displasia cemento-óssea: cirurgia o quanto antes.',
             'Lesão periapical inflamatória: tratar a causa, com tratamento de canal ou extração.',
             'Ameloblastoma e ceratocisto odontogênico: cirurgia o quanto antes, pois são benignos, mas agressivos.'],
        w: 'I falsa: displasia cemento-óssea (e osteoesclerose idiopática) é para ACOMPANHAR com controle clínico e radiográfico. II e III verdadeiras (slide 37).',
        f: F + ', slide 37' },

      { id: 'im30', tema: 'Diagnóstico',
        ctx: 'Uma lesão foi encontrada e o dentista não tem certeza do que se trata.' + ARCTX,
        p: ARP, o: AR, a: 2, fixa: true, ar: true,
        af: ['Na dúvida, a conduta indicada é a biópsia.',
             'Toda lesão encontrada na imagem precisa de tratamento.'],
        w: 'I verdadeira: "Na dúvida, biópsia." II falsa: "Nem toda lesão precisa de tratamento, mas toda lesão precisa de uma hipótese" (algumas só se acompanham).',
        f: F + ', slide 37' },

      { id: 'im31', tema: 'Cistos e lesão periapical',
        ctx: 'Um incisivo central superior SEM cárie tem uma área radiolúcida bem definida no ápice. O paciente conta que levou uma pancada nesse dente há alguns anos.',
        p: 'Qual hipótese e qual passo seguinte estão corretos?',
        o: ['Lesão periapical inflamatória por trauma; fazer o teste de vitalidade pulpar.',
            'Descartar lesão periapical, porque o dente não tem cárie.',
            'Displasia cemento-óssea, porque dente sem cárie sempre tem vitalidade.',
            'Cisto dentígero; acompanhar sem intervir.',
            'Forame mentual; variar a angulação horizontal.'],
        a: 0,
        w: 'Slide 40: lesão periapical inflamatória = ápice de dente SEM vitalidade, por cárie OU trauma ("Dente sem cárie? Pergunte sobre trauma"; "Faça o teste de vitalidade pulpar"). Forame mentual fica na mandíbula, perto dos pré-molares inferiores.',
        f: F + ', slide 40 e fala' },

      { id: 'im32', tema: 'Displasia e radiopacidades',
        ctx: 'Uma periapical mostra áreas radiolúcidas nos ápices dos incisivos inferiores. Os dentes não têm cárie nem história de trauma, e TODOS respondem normalmente ao teste de vitalidade.',
        p: 'Qual é a hipótese mais coerente?',
        o: ['Lesão periapical inflamatória, que se trata com canal',
            'Displasia cemento-óssea periapical na fase inicial',
            'Cisto dentígero',
            'Ameloblastoma multilocular',
            'Odontoma composto'],
        a: 1,
        w: 'Na fase inicial a displasia é "igualzinha" a uma lesão periapical inflamatória; o que orienta é o teste de vitalidade: na displasia os dentes são VITAIS. Local típico: ápices de incisivos inferiores (slide 44).',
        f: F + ', slides 40 e 44 e fala' },

      { id: 'im33', tema: 'Cistos e lesão periapical',
        ctx: 'Em volta da coroa de um terceiro molar incluso existe um espaço radiolúcido (pericoronário) medindo cerca de 5 mm.',
        p: 'Como interpretar esse espaço?',
        o: ['É sempre normal: é o capuz pericoronário de todo dente incluso.',
            'Com 4 a 6 mm já não se considera normal; começa-se a pensar em cisto (dentígero), com o folículo aumentado como diferencial.',
            'Indica odontoma, por estar sobre um dente que não erupcionou.',
            'Indica lesão periapical inflamatória do terceiro molar.',
            'Só tem importância se o espaço for radiopaco.'],
        a: 1,
        w: 'Desafio extra: o espaço pericoronário (folículo) normal existe, mas com uns 4 a 6 mm já não se considera normal e se pensa em cisto. Slide 41: diferenciais do dentígero = folículo aumentado, ceratocisto, ameloblastoma unicístico.',
        f: F + ', desafio extra e slide 41' },

      { id: 'im34', tema: 'Cistos e lesão periapical',
        ctx: 'Analise as afirmativas sobre o cisto dentígero.',
        p: AFP,
        o: ['I, apenas.', 'I e II, apenas.', 'I e III, apenas.', 'II e III, apenas.', 'I, II e III.'],
        a: 4, fixa: true,
        af: ['É radiolúcido, unilocular, bem definido e corticado.',
             'Os dentes mais envolvidos são terceiros molares e caninos inclusos.',
             'Entre os diferenciais estão o ceratocisto odontogênico e o ameloblastoma unicístico.'],
        w: 'Todas verdadeiras (slide 41). Ele ainda pode deslocar o dente incluso e, em alguns casos, ficar grande.',
        f: F + ', slide 41' },

      { id: 'im35', tema: 'Ameloblastoma e odontoma',
        ctx: 'A panorâmica mostra, na região posterior da mandíbula, uma lesão radiolúcida multilocular extensa, com aspecto de bolhas de sabão, abaulando a cortical e reabsorvendo raízes.',
        p: 'Qual é a principal hipótese?',
        o: ['Cisto dentígero', 'Odontoma composto', 'Ameloblastoma', 'Displasia cemento-óssea periapical', 'Cisto radicular'],
        a: 2,
        w: 'Slide 42: ameloblastoma = posterior de mandíbula, radiolúcido, multilocular, abaula a cortical e reabsorve raízes. Ela: "Sempre que a gente vê que abaula muito osso, tem que lembrar de ameloblastoma." Diferenciais: ceratocisto, mixoma, lesão central de células gigantes.',
        f: F + ', slides 28 e 42' },

      { id: 'im36', tema: 'Ameloblastoma e odontoma',
        ctx: 'No caso de antes e depois, o paciente teve parte da mandíbula removida e reconstruída com osso do ilíaco, placa e implantes.' + ARCTX,
        p: ARP, o: AR, a: 0, fixa: true, ar: true,
        af: ['Mesmo sendo benigno, o ameloblastoma pode exigir a ressecção de parte da mandíbula.',
             'É uma lesão que expande muito, e a remoção exige tirar a região com margem de segurança.'],
        w: 'As duas verdadeiras e a II justifica a I (slides 37 e 38): benigno, mas agressivo; cresce e destrói osso; por isso a remoção com margem. Daí a importância do diagnóstico cedo.',
        f: F + ', slides 37 e 38 e fala' },

      { id: 'im37', tema: 'Ameloblastoma e odontoma',
        ctx: 'Um canino permanente não erupcionou. A radiografia mostra, sobre ele, várias estruturas radiopacas parecidas com dentes pequenos, envolvidas por um halo radiolúcido e com limites bem definidos.',
        p: 'Qual é a hipótese e qual efeito ela pode causar?',
        o: ['Odontoma composto; pode impedir a erupção do dente.',
            'Ameloblastoma; reabsorve as raízes vizinhas.',
            'Cisto dentígero; é sempre radiopaco.',
            'Osteossarcoma; aspecto em raios de sol.',
            'Displasia cemento-óssea; acompanhar apenas.'],
        a: 0,
        w: 'Slides 28 e 43: dentículos = odontoma composto; radiopaco com halo radiolúcido, bem definido, sobre dente que não erupcionou, e pode impedir a erupção.',
        f: F + ', slides 28 e 43' },

      { id: 'im38', tema: 'Ameloblastoma e odontoma',
        ctx: 'Analise as afirmativas sobre o odontoma.',
        p: AFP,
        o: ['I, apenas.', 'II, apenas.', 'I e III, apenas.', 'II e III, apenas.', 'I, II e III.'],
        a: 3, fixa: true,
        af: ['É uma imagem radiolúcida pura, sem focos radiopacos.',
             'Localiza-se sobre dente que não erupcionou e pode impedir a sua erupção.',
             'Dente supranumerário e cementoblastoma estão entre os diagnósticos diferenciais.'],
        w: 'I falsa: o odontoma é RADIOPACO, com halo radiolúcido. II e III verdadeiras (slide 43; o terceiro diferencial é o fibro-odontoma ameloblástico).',
        f: F + ', slide 43' },

      { id: 'im39', tema: 'Displasia e radiopacidades',
        ctx: 'Na periapical de incisivos inferiores com vitalidade preservada, as lesões nos ápices aparecem escuras, mas com um centro claro.',
        p: 'Em qual fase da displasia cemento-óssea periapical essa imagem se encaixa?',
        o: ['Inicial (radiolúcida)', 'Intermediária (mista)', 'Madura (radiopaca)', 'Fase de rompimento da cortical', 'Não é displasia, porque a displasia é sempre radiopaca'],
        a: 1,
        w: 'Slide 44: inicial = escura (radiolúcida) → intermediária = escura com centro claro (mista) → madura = clara (radiopaca).',
        f: F + ', slide 44' },

      { id: 'im40', tema: 'Displasia e radiopacidades',
        ctx: 'Um molar com cárie profunda e inflamação apresenta, no ápice, uma radiopacidade difusa.',
        p: 'Segundo o slide das radiopacidades no ápice, qual é a lesão e a conduta?',
        o: ['Displasia cemento-óssea: acompanhar',
            'Osteíte condensante: tratar o canal',
            'Osteoesclerose idiopática: nada a tratar',
            'Hipercementose: nada a tratar',
            'Cementoblastoma: remover cirurgicamente'],
        a: 1,
        w: 'Slide 45: osteíte condensante = dente com cárie/inflamação, radiopacidade difusa → tratar o canal. Displasia e osteoesclerose aparecem em dente vital; hipercementose = raiz engrossada; cementoblastoma = massa fundida à raiz, com halo.',
        f: F + ', slide 45' }
    ]
  };
})();

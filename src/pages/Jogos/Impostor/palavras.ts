export const palavras = {
  frutas: [
    "maçã", "banana", "laranja", "uva", "manga", "abacaxi", "morango", "pera", "melancia", "kiwi",
    "ameixa", "cereja", "damasco", "figo", "goiaba", "jabuticaba", "limão", "mamão", "maracujá", "melão",
    "mexerica", "nectarina", "pêssego", "pitaya", "romã", "tangerina", "amora", "caju", "caqui", "carambola",
    "framboesa", "graviola", "lichia", "mirtilo", "acerola", "pitanga", "siriguela", "tâmara", "atemoia", "cupuaçu"
  ],
  animais: [
    "cachorro", "gato", "elefante", "leão", "tigre", "cavalo", "vaca", "coelho", "pinguim", "golfinho",
    "girafa", "zebra", "urso", "lobo", "raposa", "esquilo", "macaco", "jacaré", "tartaruga", "cobra",
    "tubarão", "baleia", "polvo", "água-viva", "caranguejo", "aranha", "escorpião", "formiga", "abelha", "borboleta",
    "papagaio", "tucano", "coruja", "águia", "falcão", "pombo", "galinha", "pato", "cisne", "pavão",
    "morcego", "hipopótamo", "rinoceronte", "canguru", "coala", "panda", "guaxinim", "lontra", "castor", "hamster"
  ],
  objetos: [
    "cadeira", "mesa", "caneta", "livro", "garrafa", "celular", "teclado", "monitor", "chave", "lanterna",
    "mochila", "reógio", "óculos", "carteira", "fone de ouvido", "controle remoto", "tesoura", "grampeador", "fita adesiva", "calculadora",
    "abajur", "quadro", "espelho", "cortina", "tapete", "almofada", "balde", "vassoura", "pá", "escada",
    "martelo", "parafuso", "prego", "alicate", "furadeira", "pincel", "tinta", "agulha", "linha", "botão",
    "guarda-chuva", "mala", "capacete", "skate", "bicicleta", "violão", "piano", "flauta", "tambor", "microfone"
  ],
  cores: [
    "vermelho","azul","verde","amarelo","roxo",
    "rosa","preto","branco","laranja","cinza"
  ],
 profissoes: [
    "médico", "engenheiro", "professor", "advogado", "arquiteto", "enfermeiro", "piloto", "cozinheiro", "motorista", "jornalista",
    "dentista", "veterinário", "psicólogo", "farmacêutico", "fisioterapeuta", "policial", "bombeiro", "militar", "carpinteiro", "eletricista",
    "encanador", "pedreiro", "pintor", "mecanico", "padeiro", "açougueiro", "garçom", "vendedor", "caixa", "gerente",
    "programador", "designer", "fotógrafo", "cineasta", "ator", "cantor", "dançarino", "escritor", "poeta", "cientista",
    "astronauta", "arqueólogo", "biólogo", "geólogo", "economista", "político", "juiz", "atleta", "treinador", "fazendeiro"
  ],
  esportes: [
    "futebol","basquete","tênis","natação","voleibol",
    "corrida","ginástica","surfe","boxe","ciclismo"
  ],
  lugares: [
    "escola", "hospital", "parque", "cinema", "teatro", "museu", "biblioteca", "estádio", "shopping", "supermercado",
    "restaurante", "cafeteria", "padaria", "farmácia", "banco", "igreja", "templo", "aeroporto", "rodoviária", "estação de trem",
    "praia", "montanha", "floresta", "deserto", "ilha", "rio", "lago", "cachoeira", "caverna", "vulcão",
    "cidade", "vila", "fazenda", "castelo", "palácio", "prisão", "cemitério", "hotel", "academia", "oficina",
    "laboratório", "escritório", "fábrica", "porto", "farol", "zoológico", "aquário", "planetário", "circo", "parquinho"
  ],
  comidas: [
    "pizza", "hambúrguer", "sushi", "lasanha", "churrasco", "feijoada", "strogonoff", "macarronada", "pastel", "coxinha",
    "pão de queijo", "omelete", "salada", "sopa", "risoto", "panqueca", "tapioca", "sanduíche", "hot dog", "nuggets",
    "chocolate", "sorvete", "pudim", "gelatina", "bolo", "torta", "biscoito", "pipoca", "brigadeiro", "paçoca",
    "arroz", "feijão", "batata frita", "ovo frito", "bife", "frango assado", "peixe grelhado", "camarão", "lagosta", "espaguete"
  ],
  paises: [
    "Brasil", "Argentina", "Chile", "Uruguai", "Colômbia", "Equador", "Peru", "Bolívia", "Paraguai", "Venezuela",
    "Estados Unidos", "Canadá", "México", "Cuba", "Jamaica", "Portugal", "Espanha", "França", "Itália", "Alemanha",
    "Inglaterra", "Irlanda", "Escócia", "Holanda", "Bélgica", "Suíça", "Áustria", "Grécia", "Rússia", "Turquia",
    "China", "Japão", "Coreia do Sul", "Índia", "Tailândia", "Egito", "África do Sul", "Nigéria", "Angola", "Austrália"
  ]
} as const

export type Categoria = keyof typeof palavras

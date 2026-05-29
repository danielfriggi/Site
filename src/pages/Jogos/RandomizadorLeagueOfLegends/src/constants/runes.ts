import type { RuneTree } from '../types/randomizer';

export const RUNE_TREES: RuneTree[] = [
  {
    name: 'Precisão',
    primary: [
      { name: 'Pressione o Ataque', img: '/img-lol/pta.png' },
      { name: 'Ritmo Fatal', img: '/img-lol/ritmo.png' },
      { name: 'Pés Ligeiros', img: '/img-lol/pes.png' },
      { name: 'Conquistador', img: '/img-lol/conq.png' }
    ],
    groups: [
      [
        { name: 'Absorção Vital', img: '/img-lol/absorção-vital.png' },
        { name: 'Triunfo', img: '/img-lol/triunfo.png' },
        { name: 'Presença de Espírito', img: '/img-lol/pres.png' }
      ],
      [
        { name: 'Lenda: Espontaneidade', img: '/img-lol/espontaneidade.png' },
        { name: 'Lenda: Absorção', img: '/img-lol/lendaabsorção.png' },
        { name: 'Lenda: Linhagem', img: '/img-lol/lendalinhagem.png' }
      ],
      [
        { name: 'Golpe de Misericórdia', img: '/img-lol/golpe.png' },
        { name: 'Dilacerar', img: '/img-lol/dilacerar.png' },
        { name: 'Até a Morte', img: '/img-lol/ateamorte.png' }
      ]
    ]
  },
  {
    name: 'Dominação',
    primary: [
      { name: 'Eletrocutar', img: '/img-lol/eletrocutar.png' },
      { name: 'Colheita Sombria', img: '/img-lol/colheita.png' },
      { name: 'Chuva de Lâminas', img: '/img-lol/chuvadelamina.png' }
    ],
    groups: [
      [
        { name: 'Golpe Desleal', img: '/img-lol/golpedesleal.png' },
        { name: 'Gosto de Sangue', img: '/img-lol/gostodesangue.png' },
        { name: 'Impacto Repentino', img: '/img-lol/impactorepentino.png' }
      ],
      [
        { name: 'Sexto Sentido', img: '/img-lol/sexto-sentido.png' },
        { name: 'Lembranças Aterrorizantes', img: '/img-lol/lembranças-aterrorizantes.png' },
        { name: 'Sentinela Profunda', img: '/img-lol/sentinela-profunda.png' }
      ],
      [
        { name: 'Caçador de Tesouros', img: '/img-lol/caçador-de-tesouros.png' },
        { name: 'Caça Incansável', img: '/img-lol/caça-incansável.png' },
        { name: 'Caça Suprema', img: '/img-lol/caça-suprema.png' }
      ]
    ]
  },
  {
    name: 'Feitiçaria',
    primary: [
      { name: 'Invocar Aery', img: '/img-lol/aery.png' },
      { name: 'Cometa Arcano', img: '/img-lol/cometa.png' },
      { name: 'Avanço da Tempestade', img: '/img-lol/avanco.png' },
      { name: 'Toque Ígneo', img: '/img-lol/toque.png' }
    ],
    groups: [
      [
        { name: 'Arcanista do Axioma', img: '/img-lol/arcanista-do-axioma.png' },
        { name: 'Faixa de Fluxo de Mana', img: '/img-lol/faixa-de-fluxo-de-mana.png' },
        { name: 'Manto de Nimbus', img: '/img-lol/manto-de-nimbus.png' }
      ],
      [
        { name: 'Transcendência', img: '/img-lol/transcendência.png' },
        { name: 'Celeridade', img: '/img-lol/celeridade.png' },
        { name: 'Foco Absoluto', img: '/img-lol/foco-absoluto.png' }
      ],
      [
        { name: 'Chamuscar', img: '/img-lol/chamuscar.png' },
        { name: 'Caminhar Sobre as Águas', img: '/img-lol/caminhar-sobre-as-aguas.png' },
        { name: 'Tempestade Crescente', img: '/img-lol/tempestade-crescente.png' }
      ]
    ]
  },
  {
    name: 'Determinação',
    primary: [
      { name: 'Aperto dos Mortos-Vivos', img: '/img-lol/apertto.png' },
      { name: 'Pós-Choque', img: '/img-lol/shock.png' },
      { name: 'Guardião', img: '/img-lol/guardian.png' }
    ],
    groups: [
      [
        { name: 'Demolir', img: '/img-lol/demolir.png' },
        { name: 'Fonte da Vida', img: '/img-lol/fonte-da-vida.png' },
        { name: 'Golpe de Escudo', img: '/img-lol/golpe-de-escudo.png' }
      ],
      [
        { name: 'Condicionamento', img: '/img-lol/condicionamento.png' },
        { name: 'Ventos Revigorantes', img: '/img-lol/ventos-revigorantes.png' },
        { name: 'Osso Revestido', img: '/img-lol/osso-revestido.png' }
      ],
      [
        { name: 'Crescimento Excessivo', img: '/img-lol/crescimento-excessivo.png' },
        { name: 'Revitalizar', img: '/img-lol/revitalizar.png' },
        { name: 'Inabalável', img: '/img-lol/inabalável.png' }
      ]
    ]
  },
  {
    name: 'Inspiração',
    primary: [
      { name: 'Aprimoramento Glacial', img: '/img-lol/gelinho.png' },
      { name: 'Livro de Feitiços Deslacrado', img: '/img-lol/feitiço.png' },
      { name: 'Primeiro Ataque', img: '/img-lol/primeiro-ataque.png' }
    ],
    groups: [
      [
        { name: 'Flashtração Hextec', img: '/img-lol/flash-hex.png' },
        { name: 'Calçados Mágicos', img: '/img-lol/sapato.png' },
        { name: 'Reembolso', img: '/img-lol/reembolso.png' }
      ],
      [
        { name: 'Tônico Triplo', img: '/img-lol/tonico-triplo.png' },
        { name: 'Tônico de Distorção no Tempo', img: '/img-lol/tonmico-de-distorção-no-tempo.png' },
        { name: 'Entrega de Biscoitos', img: '/img-lol/entrega-de-biscoitos.png' }
      ],
      [
        { name: 'Perspicácia Cósmica', img: '/img-lol/perspicácia-cósmica.png' },
        { name: 'Velocidade de Aproximação', img: '/img-lol/velocidade-de-aproximação.png' },
        { name: 'Quebra Galho', img: '/img-lol/quebra-galho.png' }
      ]
    ]
  }
];
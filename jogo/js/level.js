// js/level.js
export const LEVELS = [
  {
    id: 1,
    bg: 'img/fundo1.jpg',
    length: 1200,
    finishX: 1100,
    platforms: [
      { x: 0, y: 420, w: 99999 }, // ground
      { x: 300, y: 340, w: 120 },
      { x: 520, y: 300, w: 120 },
      { x: 780, y: 360, w: 120 }
    ],
    items: [ {x:350,y:310,type:'coin'}, {x:540,y:270,type:'coin'}, {x:800,y:330,type:'star'} ]
  },
  {
    id: 2,
    bg: 'img/fundo2.jpg',
    length: 1500,
    finishX: 1400,
    platforms: [
      { x: 0, y: 420, w: 99999 },
      { x: 200, y: 360, w: 100 },
      { x: 420, y: 320, w: 140 },
      { x: 760, y: 360, w: 120 },
      { x: 1120, y: 300, w: 140 }
    ],
    items: [{x:220,y:330,type:'coin'},{x:460,y:290,type:'coin'},{x:1150,y:270,type:'star'}]
  },
  {
    id: 3,
    bg: 'img/fundo3.jpg',
    length: 1700,
    finishX: 1600,
    platforms: [
      { x: 0, y: 420, w: 99999 },
      { x: 320, y: 360, w: 100 },
      { x: 560, y: 320, w: 120 },
      { x: 900, y: 360, w: 100 },
      { x: 1220, y: 340, w: 140 }
    ],
    items: [{x:330,y:330,type:'coin'},{x:580,y:290,type:'coin'},{x:1230,y:310,type:'star'}]
  },
  {
    id: 4,
    bg: 'img/fundo4.jpg',
    length: 2000,
    finishX: 1900,
    platforms: [
      { x: 0, y: 420, w: 99999 },
      { x: 240, y: 360, w: 140 },
      { x: 480, y: 320, w: 120 },
      { x: 840, y: 360, w: 120 },
      { x: 1300, y: 300, w: 120 },
      { x: 1650, y: 340, w: 120 }
    ],
    items: [{x:250,y:330,type:'coin'},{x:1300,y:270,type:'star'},{x:1650,y:310,type:'coin'}]
  },
  {
    id: 5,
    bg: 'img/fundo5.jpg',
    length: 2300,
    finishX: 2200,
    platforms: [
      { x: 0, y: 420, w: 99999 },
      { x: 300, y: 360, w: 160 },
      { x: 600, y: 320, w: 140 },
      { x: 980, y: 360, w: 120 },
      { x: 1350, y: 300, w: 140 },
      { x: 1750, y: 340, w: 160 },
      { x: 2000, y: 320, w: 120 }
    ],
    items: [{x:320,y:330,type:'coin'},{x:980,y:330,type:'coin'},{x:1760,y:310,type:'star'}]
  }
];

export const INITIAL_PLAN = [
    {
        type: 'Colazione',
        days: [
            // Lun
            [{ text: 'Latte 200 ml', category: 'LATTE' }, { text: '5 Biscotti', category: 'CEREALI' }],
            // Mar
            [{ text: 'Yogurt 125 g', category: 'LATTE' }, { text: 'Cereali 50 g', category: 'CEREALI' }],
            // Mer
            [{ text: 'Latte 200 mL', category: 'LATTE' }, { text: '5 Biscotti', category: 'CEREALI' }],
            // Gio
            [{ text: 'Latte 200 mL', category: 'LATTE' }, { text: '5 Biscotti', category: 'CEREALI' }],
            // Ven
            [{ text: 'Latte 200 mL', category: 'LATTE' }, { text: 'Cereali 50 g', category: 'CEREALI' }],
            // Sab
            [{ text: 'Latte 200 mL', category: 'LATTE' }, { text: '5 Biscotti', category: 'CEREALI' }],
            // Dom
            [{ text: 'Latte 200 ml', category: 'LATTE' }, { text: 'Dolce da forno 100 g', category: 'DOLCI' }],
        ]
    },
    {
        type: 'Spuntino',
        days: [
            // Lun
            [{ text: 'Yogurt 125 g', category: 'LATTE' }, { text: 'Frutta fresca 75 g', category: 'FRUTTA' }],
            // Mar
            [{ text: 'Frutta secca 50 g', category: 'FRUTTA' }, { text: 'Dolce da forno 50 g', category: 'DOLCI' }],
            // Mer
            [{ text: 'Dolci a cucchiaio 125 g', category: 'DOLCI' }],
            // Gio
            [{ text: 'Yogurt 125 g', category: 'LATTE' }, { text: 'Frutta fresca 50 g', category: 'FRUTTA' }],
            // Ven
            [{ text: 'Frutta secca 150 g', category: 'FRUTTA' }, { text: 'Dolce da forno 50 g', category: 'DOLCI' }],
            // Sab
            [{ text: 'Yogurt 125 g', category: 'LATTE' }, { text: '5 fette biscottate', category: 'CEREALI' }],
            // Dom
            [{ text: 'Frutta fresca 150 g', category: 'FRUTTA' }, { text: 'Yogurt 125 g', category: 'LATTE' }],
        ]
    },
    {
        type: 'Pranzo',
        days: [
            // Filling just a few for layout check
            [{ text: 'Riso 100 g', category: 'CEREALI' }, { text: 'Pesce 150 g', category: 'PESCE' }, { text: 'Verdure 200g', category: 'FRUTTA' }],
            [], [], [], [], [], []
        ]
    },
    { type: 'Spuntino', days: [[], [], [], [], [], [], []] },
    { type: 'Cena', days: [[], [], [], [], [], [], []] },
];

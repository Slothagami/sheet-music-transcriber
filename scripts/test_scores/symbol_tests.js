const SCORE = [
    {
        treble: [
            {keys: ["c/4","e/4","g/4"], duration: "q"},
            {keys: ["g/4"], duration: "q"},
            {keys: ["e/4"], duration: "q"},
            {keys: ["c/4"], duration: "q"},
        ],
        bass: [
            {keys: ["c/3"], duration: "h"},
            {keys: ["c/3","c/4"], duration: "h"},
        ]
    },{
        treble: [
            {keys: ["c/5"], duration: "q"},
            {keys: ["c/5"], duration: "8"},
            {keys: ["c/5"], duration: "q"},
            {keys: ["c/5"], duration: "8"},
            {keys: ["c/5"], duration: "q"},
        ],
        bass: [
            {keys: ["c/3"], duration: "wr"},
        ]
    },{
        treble: [
            {keys: ["c/5"], duration: "qr"},
            {keys: ["c/5"], duration: "8r"},
            {keys: ["c/5"], duration: "hr"},
            {keys: ["c/5"], duration: "8r"},
        ],
        bass: [
            {keys: ["c/3"], duration: "wr"},
        ]
    },{
        treble: [
            {keys: ["c/4"], duration: "qr"},
            {type: "tuplet", duration: "q", notes: [
                {keys: ["c/4"], duration: "8"},
                {keys: ["e/4"], duration: "8"},
                {keys: ["g/4"], duration: "8"},

            ]},
            {keys: ["c/5"], duration: "qr"},
            {type: "tuplet", duration: "q", notes: [
                {keys: ["c/4"], duration: "8"},
                {keys: ["e/4"], duration: "8"},
                {keys: ["g/4"], duration: "8"},

            ]}
        ],
        bass: [
            {keys: ["c/3"], duration: "wr"},
        ]
    },{
        treble: [
            {keys: ["c/4"], duration: "qr"},
            {type: "tie_group", notes: [
                {keys: ["c/5"], duration: "q"},
                {keys: ["c/5"], duration: "q"},
                {keys: ["c/5"], duration: "q"},
            ]}
        ],
        bass: [
            {keys: ["c/3"], duration: "wr"},
        ]
    },
][4]

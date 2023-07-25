const SCORE = {
    title:    "BRAND NEW WORLD",
    subtitle: "One Piece",
    artist:   "D-51\nSymphoniac\nMagical Piano\nBlake Woolley",
    bpm:      160,
    key:      "Eb",
    time_signature: "none",

    treble: [
        //#region 
        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","g/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "q"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","f/5"], duration: "8"},
        {keys: ["b/4","g/5"], duration: "8"},
        
        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","g/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "q"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","f/5"], duration: "8"},
        {keys: ["b/4","g/5"], duration: "8"},

        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","g/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "q"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","f/5"], duration: "8"},
        {keys: ["b/4","g/5"], duration: "8"},

        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["e/5","g/5","c/6"], duration: "q"},
        {keys: ["b/5"], duration: "8"},
        {keys: ["g/5"], duration: "8"},
        {keys: ["e/5"], duration: "8"},

        //
        {keys: ["c/4", "e/4"], duration: "16"},
        {keys: ["a/3"], duration: "16"},
        {keys: ["e/4"], duration: "16"},
        {keys: ["a/3"], duration: "16"},

        {keys: ["e/4"], duration: "16"},
        {keys: ["a/3"], duration: "16"},
        {keys: ["e/4", "a/4"], duration: "16"},
        {keys: ["c/4"], duration: "16"},

        {keys: ["a/4"], duration: "16"},
        {keys: ["c/4"], duration: "16"},
        {keys: ["a/4"], duration: "16"},
        {keys: ["c/4"], duration: "16"},

        {type: "tuplet", duration: "q", notes: [
            {keys: ["c/5","c/6"], duration: "8"},
            {keys: ["e/5"], duration: "8"},
            {keys: ["a/5"], duration: "8"},
        ]},

        //
        {keys: ["b/4","b/5"], duration: "16"},
        {keys: ["e/5"], duration: "16"},
        {keys: ["b/4","g/5"], duration: "16"},
        {keys: ["e/5"], duration: "16"},

        {keys: ["b/4"], duration: "16"},
        {keys: ["g/4"], duration: "16"},
        {keys: ["e/4","e/5"], duration: "16"},
        {keys: ["b/4"], duration: "16"},        

        {keys: ["e/4"], duration: "16"},
        {keys: ["g/4"], duration: "16"},
        {keys: ["e/4"], duration: "16"},
        {keys: ["b/4"], duration: "16"},

        {keys: ["e/4"], duration: "16"},
        {keys: ["b/4"], duration: "16"},
        {keys: ["e/4"], duration: "16"},
        {keys: ["g/4"], duration: "16"},

        //
        {keys: ["a/4","e/5","a/5"], duration: "8"},
        {keys: ["e/4"], duration: "q"},
        {keys: ["e/4"], duration: "8"},
        {keys: ["e/4"], duration: "q"},
        {keys: ["e/4"], duration: "q"},
        
        //
        {keys: ["e/4", "e/5"], duration: "h"},
        {keys: ["g/4", "b/4", "f/5"], duration: "h"},
        //#endregion
        {keys: ["g/5"], duration: "qr"},
        {keys: ["g/5"], duration: "q"},
        {keys: ["g/5"], duration: "q"},
        {keys: ["f/5"], duration: "8"},
        {keys: ["e/5"], duration: "8"},

        {keys: ["f/5"], duration: "8"},
        {keys: ["g/5"], duration: "8"},
        {keys: ["g/5"], duration: "8r"},
        {keys: ["g/5"], duration: "q"},
        {keys: ["g/5"], duration: "8"},
        {keys: ["f/5"], duration: "8"},
        {keys: ["e/5"], duration: "8"},

        {keys: ["f/5"], duration: "8"},
        {keys: ["g/5"], duration: "8"},
        {keys: ["g/5"], duration: "8r"},
        {keys: ["g/5"], duration: "q"},
        {keys: ["g/5"], duration: "8"},
        {keys: ["f/5"], duration: "8"},
        {keys: ["g/5"], duration: "8"},
        
        {keys: ["f/5"], duration: "8"},
        {keys: ["e/5"], duration: "8"},
        {keys: ["c/5"], duration: "8"},
        {type: "tie_group", notes: [
            {keys: ["e/5"], duration: "8"},
            {keys: ["e/5"], duration: "q"},
        ]},
        {keys: ["e/5"], duration: "qr"},

    ],
    bass: [
        //#region 
        {keys: ["e/2","e/3"], duration: "8"},
        {type: "tie_group", notes: [
            {keys: ["e/2","e/3"], duration: "qd"},
            {keys: ["e/2","e/3"], duration: "qd"},
            {keys: ["e/2","e/3"], duration: "16"},
        ]},
        {keys: ["e/3"], duration: "16r"},

        {keys: ["d/2","d/3"], duration: "8"},
        {type: "tie_group", notes: [
            {keys: ["d/2","d/3"], duration: "qd"},
            {keys: ["d/2","d/3"], duration: "qd"},
            {keys: ["d/2","d/3"], duration: "16"},
        ]},
        {keys: ["d/2"], duration: "16r"},

        {keys: ["c/2","c/3"], duration: "8"},
        {type: "tie_group", notes: [
            {keys: ["c/2","c/3"], duration: "qd"},
            {keys: ["c/2","c/3"], duration: "qd"},
            {keys: ["c/2","c/3"], duration: "16"},
        ]},
        {keys: ["c/2"], duration: "16r"},

        {keys: ["b/1","b/2"], duration: "qd"},
        {type: "tie_group", notes: [
            {keys: ["e/2","b/2"], duration: "8"},
            {keys: ["e/2","b/2"], duration: "h"},
        ]},

        {keys: ["e/2","a/2","e/3"], duration: "q"},
        {keys: ["a/2","e/3","a/3"], duration: "8"},
        {keys: ["e/3","a/3"], duration: "q"},
        {keys: ["a/2"], duration: "8"},
        {keys: ["a/3"], duration: "8"},
        {keys: ["c/3"], duration: "8"},

        {keys: ["g/2","e/3","g/3"], duration: "q"},
        {keys: ["b/3"], duration: "8"},
        {keys: ["b/2","g/3","b/3"], duration: "q"},
        {keys: ["e/3"], duration: "8"},
        {keys: ["g/3"], duration: "8"},
        {keys: ["b/3"], duration: "8"},

        {keys: ["a/2","e/3","a/3"], duration: "q"},
        {keys: ["c/4"], duration: "8"},
        {keys: ["a/3","c/4"], duration: "8"},
        {keys: ["e/3"], duration: "q"},
        {keys: ["a/3","c/4"], duration: "8"},
        {keys: ["e/3","a/3"], duration: "8"},

        {type: "tuplet", duration: "q", notes: [
            {keys: ["a/2","e/3"], duration: "8"},
            {keys: ["e/2"], duration: "8"},
            {keys: ["a/2"], duration: "8"},
        ]},
        {type: "tuplet", duration: "q", notes: [
            {keys: ["b/2"], duration: "8"},
            {keys: ["c/3"], duration: "8"},
            {keys: ["e/3"], duration: "8"},
        ]},
        {type: "tuplet", duration: "q", notes: [
            {keys: ["d/3","f/3","b/3"], duration: "8"},
            {keys: ["b/2"], duration: "8"},
            {keys: ["d/3"], duration: "8"},
        ]},
        {type: "tuplet", duration: "q", notes: [
            {keys: ["e/3"], duration: "8"},
            {keys: ["f/3"], duration: "8"},
            {keys: ["b/3"], duration: "8"},
        ]},
        //#endregion
        {keys: ["e/2"], duration: "8"},
        {keys: ["e/3"], duration: "8"},
        {keys: ["e/2"], duration: "8"},
        {keys: ["e/3"], duration: "8"},
        {keys: ["e/2"], duration: "8"},
        {keys: ["e/3"], duration: "8"},
        {keys: ["e/2"], duration: "8"},
        {keys: ["e/3"], duration: "8"},
        
        {keys: ["d/2"], duration: "8"},
        {keys: ["d/3"], duration: "8"},
        {keys: ["d/2"], duration: "8"},
        {keys: ["d/3"], duration: "8"},
        {keys: ["d/2"], duration: "8"},
        {keys: ["d/3"], duration: "8"},
        {keys: ["d/2"], duration: "8"},
        {keys: ["d/3"], duration: "8"},
        
        {keys: ["c/2"], duration: "8"},
        {keys: ["c/3"], duration: "8"},
        {keys: ["c/2"], duration: "8"},
        {keys: ["c/3"], duration: "8"},
        {keys: ["c/2"], duration: "8"},
        {keys: ["c/3"], duration: "8"},
        {keys: ["c/2"], duration: "8"},
        {keys: ["c/3"], duration: "8"},
        
        {keys: ["c/2"], duration: "8"},
        {keys: ["c/3"], duration: "8"},
        {keys: ["c/2"], duration: "8"},
        {keys: ["c/3"], duration: "8"},
        {keys: ["c/2"], duration: "8"},
        {keys: ["c/3"], duration: "8"},
        {keys: ["c/2"], duration: "8"},
        {keys: ["c/3"], duration: "8"},

    ]
}

var testRLine = {
	
  "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067" : {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
      { "value" : "http://code.rubrick-jetpack.org/vocab/RubricLine", "type" : "uri" }
    ],
    "http://rdfs.org/sioc/ns#name" : [
      { "value" : "grr", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/name" : [
      { "value" : "grr", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/description" : [
      { "value" : "Describe the skills that this line evaluates", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/isPublic" : [
      { "value" : "1", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/order" : [
      { "value" : "0", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/hasLineValue" : [
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v1", "type" : "uri" },
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v2", "type" : "uri" },
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v3", "type" : "uri" },
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v4", "type" : "uri" },
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v5", "type" : "uri" }
    ]
  } 
}


var testRLV = {
  "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v1" : {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
      { "value" : "http://code.rubrick-jetpack.org/vocab/RubricLineValue", "type" : "uri" }
    ],
    "http://code.rubrick-jetpack.org/vocab/description" : [
      { "value" : "Describe the Rubric Value here.", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/score" : [
      { "value" : "5", "type" : "literal" }
    ]
  },

  "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v2" : {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
      { "value" : "http://code.rubrick-jetpack.org/vocab/RubricLineValue", "type" : "uri" }
    ],
    "http://code.rubrick-jetpack.org/vocab/description" : [
      { "value" : "Describe the Rubric Value here.", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/score" : [
      { "value" : "4", "type" : "literal" }
    ]
  },

  "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v3" : {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
      { "value" : "http://code.rubrick-jetpack.org/vocab/RubricLineValue", "type" : "uri" }
    ],
    "http://code.rubrick-jetpack.org/vocab/description" : [
      { "value" : "Describe the Rubric Value here.", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/score" : [
      { "value" : "3", "type" : "literal" }
    ]
  },

  "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v4" : {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
      { "value" : "http://code.rubrick-jetpack.org/vocab/RubricLineValue", "type" : "uri" }
    ],
    "http://code.rubrick-jetpack.org/vocab/description" : [
      { "value" : "Describe the Rubric Value here.", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/score" : [
      { "value" : "2", "type" : "literal" }
    ]
  },

  "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v5" : {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
      { "value" : "http://code.rubrick-jetpack.org/vocab/RubricLineValue", "type" : "uri" }
    ],
    "http://code.rubrick-jetpack.org/vocab/description" : [
      { "value" : "grr", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/score" : [
      { "value" : "1", "type" : "literal" }
    ]
  } 
};


var testR = {
  "http://data.rubrick-jetpack.org/Rubrics/0280bce1098ee66c35f8027d3a200b9f9d6cc90a" : {
    "http://code.rubrick-jetpack.org/vocab/hasLine" : [
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067", "type" : "uri" }
    ],
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
      { "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri" }
    ]
  },

  "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067" : {
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" : [
      { "value" : "http://code.rubrick-jetpack.org/vocab/RubricLine", "type" : "uri" }
    ],
    "http://rdfs.org/sioc/ns#name" : [
      { "value" : "grr", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/name" : [
      { "value" : "grr", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/description" : [
      { "value" : "Describe the skills that this line evaluates", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/isPublic" : [
      { "value" : "1", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/order" : [
      { "value" : "0", "type" : "literal" }
    ],
    "http://code.rubrick-jetpack.org/vocab/hasLineValue" : [
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v1", "type" : "uri" },
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v2", "type" : "uri" },
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v3", "type" : "uri" },
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v4", "type" : "uri" },
      { "value" : "http://data.rubrick-jetpack.org/RubricLines/7669c572411a690b42540ff4ba01394d1e1e4067-v5", "type" : "uri" }
    ]
  } 
};

var rubricsJSON = {
    "http://data.rubrick-jetpack.org/Rubrics/0280bce1098ee66c35f8027d3a200b9f9d6cc90a" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "asdf", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "Rubric Description", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/0d16f131095427d03361d9d4a2097c9e112f8035" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "dd", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "dd", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/d0f7e26129509cd28aa8d2a83313bcdaa025f4c8" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "wootBric", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "woot", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/623f9b0dae0f9858304bd95b67b55a510fd6eefe" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "asdf", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "asdf", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/d99f95d8b10892c000d016b30ee4a2516fcc93eb" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "woot", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "shit", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/567878ebdca4bb42fbe1426c42dc484f0085526a" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "lotsrubrics!", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "adsf", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/6dac5bf85b38c27a2c298dec8bb43a15048edefd" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "grr", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "grr", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/7e5190696da978d46e70806af6856e7737ac852f" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "dd", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "dd", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/f5b4c48064a4d0a8175b7428d0ce63cfea4a7e95" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "grr", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "grrr", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/60155b3e0df305db455694548ad0e951b505992b" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "dd", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "dd", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/bf1504ca3c009bcac8770617a02884533fd49f19" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "asdfas", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "dfasdfasdf", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/0ab20c628992e1600ccebcc80c230f36bdf7d82b" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "newbric", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "newbric", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/5439ba3d23adca8559f64059cfffa968aba3ec81" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "www", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "wwww", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/c7bade0ac44d370303c3fe8c1df5c29cc7fd0e69" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "new", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "new", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/e8b35301ee7356e7327c04ebcb124d0326c9985e" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "wootBrick", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "woot", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/f9bddfc4ef0f9db8713b994bb177e20968587234" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "f", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "f", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/eaeea20e2edb74b9cc25b6c363d894b265b1f8ee" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "newbrick", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "new", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/990c104cf0f5961f087ddf87399a8983bb54ddd5" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "grr", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "grrr", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/e5d2a6004adcf9d0db7dc789ba1235049b1d73b4" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "dd", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "ddd", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/add5db1a034a9255d198299359fd0a6b65217311" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "asfd", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "asdf", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/664bb33148d2f21cf974450936da3c30b21bca86" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "grr", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "grrr", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/4f507e1b19fcc1e211f7a5b32243fa80adbe71eb" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "r2", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "r2desc", "type" : "literal"
        }
        ]
    },
    "http://data.rubrick-jetpack.org/Rubric/39a30f3d9b2e7fb23130310593afe90377569ca8" : {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" :[ {
            "value" : "http://code.rubrick-jetpack.org/vocab/Rubric", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#has_creator" :[ {
            "value" : "http://data.rubrick-jetpack.org/Users/94c75cc3e5bb16ee675aa6cf2a5efc2881d87f17", "type" : "uri"
        }
        ], "http://rdfs.org/sioc/ns#name" :[ {
            "value" : "mybric", "type" : "literal"
        }
        ], "http://code.rubrick-jetpack.org/vocab/description" :[ {
            "value" : "ssssss", "type" : "literal"
        }
        ]
    }
}


import { PokedexObject } from "@site/utils/types";

const pokedex: Array<PokedexObject> = [{
    "id": 1,
    "name": {
      "english": "Bulbasaur",
      "japanese": "フシギダネ",
      "chinese": "妙蛙种子",
      "french": "Bulbizarre"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 45,
      "Attack": 49,
      "Defense": 49,
      "Sp. Attack": 65,
      "Sp. Defense": 65,
      "Speed": 45
    }
  },
  {
    "id": 2,
    "name": {
      "english": "Ivysaur",
      "japanese": "フシギソウ",
      "chinese": "妙蛙草",
      "french": "Herbizarre"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 60,
      "Attack": 62,
      "Defense": 63,
      "Sp. Attack": 80,
      "Sp. Defense": 80,
      "Speed": 60
    }
  },
  {
    "id": 3,
    "name": {
      "english": "Venusaur",
      "japanese": "フシギバナ",
      "chinese": "妙蛙花",
      "french": "Florizarre"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 80,
      "Attack": 82,
      "Defense": 83,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      "Speed": 80
    }
  },
  {
    "id": 4,
    "name": {
      "english": "Charmander",
      "japanese": "ヒトカゲ",
      "chinese": "小火龙",
      "french": "Salamèche"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 39,
      "Attack": 52,
      "Defense": 43,
      "Sp. Attack": 60,
      "Sp. Defense": 50,
      "Speed": 65
    }
  },
  {
    "id": 5,
    "name": {
      "english": "Charmeleon",
      "japanese": "リザード",
      "chinese": "火恐龙",
      "french": "Reptincel"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 58,
      "Attack": 64,
      "Defense": 58,
      "Sp. Attack": 80,
      "Sp. Defense": 65,
      "Speed": 80
    }
  },
  {
    "id": 6,
    "name": {
      "english": "Charizard",
      "japanese": "リザードン",
      "chinese": "喷火龙",
      "french": "Dracaufeu"
    },
    "type": [
      "Fire",
      "Flying"
    ],
    "base": {
      "HP": 78,
      "Attack": 84,
      "Defense": 78,
      "Sp. Attack": 109,
      "Sp. Defense": 85,
      "Speed": 100
    }
  },
  {
    "id": 7,
    "name": {
      "english": "Squirtle",
      "japanese": "ゼニガメ",
      "chinese": "杰尼龟",
      "french": "Carapuce"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 44,
      "Attack": 48,
      "Defense": 65,
      "Sp. Attack": 50,
      "Sp. Defense": 64,
      "Speed": 43
    }
  },
  {
    "id": 8,
    "name": {
      "english": "Wartortle",
      "japanese": "カメール",
      "chinese": "卡咪龟",
      "french": "Carabaffe"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 59,
      "Attack": 63,
      "Defense": 80,
      "Sp. Attack": 65,
      "Sp. Defense": 80,
      "Speed": 58
    }
  },
  {
    "id": 9,
    "name": {
      "english": "Blastoise",
      "japanese": "カメックス",
      "chinese": "水箭龟",
      "french": "Tortank"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 79,
      "Attack": 83,
      "Defense": 100,
      "Sp. Attack": 85,
      "Sp. Defense": 105,
      "Speed": 78
    }
  },
  {
    "id": 10,
    "name": {
      "english": "Caterpie",
      "japanese": "キャタピー",
      "chinese": "绿毛虫",
      "french": "Chenipan"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 45,
      "Attack": 30,
      "Defense": 35,
      "Sp. Attack": 20,
      "Sp. Defense": 20,
      "Speed": 45
    }
  },
  {
    "id": 11,
    "name": {
      "english": "Metapod",
      "japanese": "トランセル",
      "chinese": "铁甲蛹",
      "french": "Chrysacier"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 50,
      "Attack": 20,
      "Defense": 55,
      "Sp. Attack": 25,
      "Sp. Defense": 25,
      "Speed": 30
    }
  },
  {
    "id": 12,
    "name": {
      "english": "Butterfree",
      "japanese": "バタフリー",
      "chinese": "巴大蝶",
      "french": "Papilusion"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 60,
      "Attack": 45,
      "Defense": 50,
      "Sp. Attack": 90,
      "Sp. Defense": 80,
      "Speed": 70
    }
  },
  {
    "id": 13,
    "name": {
      "english": "Weedle",
      "japanese": "ビードル",
      "chinese": "独角虫",
      "french": "Aspicot"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 40,
      "Attack": 35,
      "Defense": 30,
      "Sp. Attack": 20,
      "Sp. Defense": 20,
      "Speed": 50
    }
  },
  {
    "id": 14,
    "name": {
      "english": "Kakuna",
      "japanese": "コクーン",
      "chinese": "铁壳蛹",
      "french": "Coconfort"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 45,
      "Attack": 25,
      "Defense": 50,
      "Sp. Attack": 25,
      "Sp. Defense": 25,
      "Speed": 35
    }
  },
  {
    "id": 15,
    "name": {
      "english": "Beedrill",
      "japanese": "スピアー",
      "chinese": "大针蜂",
      "french": "Dardargnan"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 65,
      "Attack": 90,
      "Defense": 40,
      "Sp. Attack": 45,
      "Sp. Defense": 80,
      "Speed": 75
    }
  },
  {
    "id": 16,
    "name": {
      "english": "Pidgey",
      "japanese": "ポッポ",
      "chinese": "波波",
      "french": "Roucool"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 40,
      "Attack": 45,
      "Defense": 40,
      "Sp. Attack": 35,
      "Sp. Defense": 35,
      "Speed": 56
    }
  },
  {
    "id": 17,
    "name": {
      "english": "Pidgeotto",
      "japanese": "ピジョン",
      "chinese": "比比鸟",
      "french": "Roucoups"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 63,
      "Attack": 60,
      "Defense": 55,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 71
    }
  },
  {
    "id": 18,
    "name": {
      "english": "Pidgeot",
      "japanese": "ピジョット",
      "chinese": "大比鸟",
      "french": "Roucarnage"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 83,
      "Attack": 80,
      "Defense": 75,
      "Sp. Attack": 70,
      "Sp. Defense": 70,
      "Speed": 101
    }
  },
  {
    "id": 19,
    "name": {
      "english": "Rattata",
      "japanese": "コラッタ",
      "chinese": "小拉达",
      "french": "Rattata"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 30,
      "Attack": 56,
      "Defense": 35,
      "Sp. Attack": 25,
      "Sp. Defense": 35,
      "Speed": 72
    }
  },
  {
    "id": 20,
    "name": {
      "english": "Raticate",
      "japanese": "ラッタ",
      "chinese": "拉达",
      "french": "Rattatac"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 55,
      "Attack": 81,
      "Defense": 60,
      "Sp. Attack": 50,
      "Sp. Defense": 70,
      "Speed": 97
    }
  },
  {
    "id": 21,
    "name": {
      "english": "Spearow",
      "japanese": "オニスズメ",
      "chinese": "烈雀",
      "french": "Piafabec"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 40,
      "Attack": 60,
      "Defense": 30,
      "Sp. Attack": 31,
      "Sp. Defense": 31,
      "Speed": 70
    }
  },
  {
    "id": 22,
    "name": {
      "english": "Fearow",
      "japanese": "オニドリル",
      "chinese": "大嘴雀",
      "french": "Rapasdepic"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 65,
      "Attack": 90,
      "Defense": 65,
      "Sp. Attack": 61,
      "Sp. Defense": 61,
      "Speed": 100
    }
  },
  {
    "id": 23,
    "name": {
      "english": "Ekans",
      "japanese": "アーボ",
      "chinese": "阿柏蛇",
      "french": "Abo"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 35,
      "Attack": 60,
      "Defense": 44,
      "Sp. Attack": 40,
      "Sp. Defense": 54,
      "Speed": 55
    }
  },
  {
    "id": 24,
    "name": {
      "english": "Arbok",
      "japanese": "アーボック",
      "chinese": "阿柏怪",
      "french": "Arbok"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 60,
      "Attack": 95,
      "Defense": 69,
      "Sp. Attack": 65,
      "Sp. Defense": 79,
      "Speed": 80
    }
  },
  {
    "id": 25,
    "name": {
      "english": "Pikachu",
      "japanese": "ピカチュウ",
      "chinese": "皮卡丘",
      "french": "Pikachu"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 35,
      "Attack": 55,
      "Defense": 40,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 90
    }
  },
  {
    "id": 26,
    "name": {
      "english": "Raichu",
      "japanese": "ライチュウ",
      "chinese": "雷丘",
      "french": "Raichu"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 60,
      "Attack": 90,
      "Defense": 55,
      "Sp. Attack": 90,
      "Sp. Defense": 80,
      "Speed": 110
    }
  },
  {
    "id": 27,
    "name": {
      "english": "Sandshrew",
      "japanese": "サンド",
      "chinese": "穿山鼠",
      "french": "Sabelette"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 50,
      "Attack": 75,
      "Defense": 85,
      "Sp. Attack": 20,
      "Sp. Defense": 30,
      "Speed": 40
    }
  },
  {
    "id": 28,
    "name": {
      "english": "Sandslash",
      "japanese": "サンドパン",
      "chinese": "穿山王",
      "french": "Sablaireau"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 75,
      "Attack": 100,
      "Defense": 110,
      "Sp. Attack": 45,
      "Sp. Defense": 55,
      "Speed": 65
    }
  },
  {
    "id": 29,
    "name": {
      "english": "Nidoran♀",
      "japanese": "ニドラン♀",
      "chinese": "尼多兰",
      "french": "Nidoran♀"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 55,
      "Attack": 47,
      "Defense": 52,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 41
    }
  },
  {
    "id": 30,
    "name": {
      "english": "Nidorina",
      "japanese": "ニドリーナ",
      "chinese": "尼多娜",
      "french": "Nidorina"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 70,
      "Attack": 62,
      "Defense": 67,
      "Sp. Attack": 55,
      "Sp. Defense": 55,
      "Speed": 56
    }
  },
  {
    "id": 31,
    "name": {
      "english": "Nidoqueen",
      "japanese": "ニドクイン",
      "chinese": "尼多后",
      "french": "Nidoqueen"
    },
    "type": [
      "Poison",
      "Ground"
    ],
    "base": {
      "HP": 90,
      "Attack": 92,
      "Defense": 87,
      "Sp. Attack": 75,
      "Sp. Defense": 85,
      "Speed": 76
    }
  },
  {
    "id": 32,
    "name": {
      "english": "Nidoran♂",
      "japanese": "ニドラン♂",
      "chinese": "尼多朗",
      "french": "Nidoran♂"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 46,
      "Attack": 57,
      "Defense": 40,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 50
    }
  },
  {
    "id": 33,
    "name": {
      "english": "Nidorino",
      "japanese": "ニドリーノ",
      "chinese": "尼多力诺",
      "french": "Nidorino"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 61,
      "Attack": 72,
      "Defense": 57,
      "Sp. Attack": 55,
      "Sp. Defense": 55,
      "Speed": 65
    }
  },
  {
    "id": 34,
    "name": {
      "english": "Nidoking",
      "japanese": "ニドキング",
      "chinese": "尼多王",
      "french": "Nidoking"
    },
    "type": [
      "Poison",
      "Ground"
    ],
    "base": {
      "HP": 81,
      "Attack": 102,
      "Defense": 77,
      "Sp. Attack": 85,
      "Sp. Defense": 75,
      "Speed": 85
    }
  },
  {
    "id": 35,
    "name": {
      "english": "Clefairy",
      "japanese": "ピッピ",
      "chinese": "皮皮",
      "french": "Mélofée"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 70,
      "Attack": 45,
      "Defense": 48,
      "Sp. Attack": 60,
      "Sp. Defense": 65,
      "Speed": 35
    }
  },
  {
    "id": 36,
    "name": {
      "english": "Clefable",
      "japanese": "ピクシー",
      "chinese": "皮可西",
      "french": "Mélodelfe"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 95,
      "Attack": 70,
      "Defense": 73,
      "Sp. Attack": 95,
      "Sp. Defense": 90,
      "Speed": 60
    }
  },
  {
    "id": 37,
    "name": {
      "english": "Vulpix",
      "japanese": "ロコン",
      "chinese": "六尾",
      "french": "Goupix"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 38,
      "Attack": 41,
      "Defense": 40,
      "Sp. Attack": 50,
      "Sp. Defense": 65,
      "Speed": 65
    }
  },
  {
    "id": 38,
    "name": {
      "english": "Ninetales",
      "japanese": "キュウコン",
      "chinese": "九尾",
      "french": "Feunard"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 73,
      "Attack": 76,
      "Defense": 75,
      "Sp. Attack": 81,
      "Sp. Defense": 100,
      "Speed": 100
    }
  },
  {
    "id": 39,
    "name": {
      "english": "Jigglypuff",
      "japanese": "プリン",
      "chinese": "胖丁",
      "french": "Rondoudou"
    },
    "type": [
      "Normal",
      "Fairy"
    ],
    "base": {
      "HP": 115,
      "Attack": 45,
      "Defense": 20,
      "Sp. Attack": 45,
      "Sp. Defense": 25,
      "Speed": 20
    }
  },
  {
    "id": 40,
    "name": {
      "english": "Wigglytuff",
      "japanese": "プクリン",
      "chinese": "胖可丁",
      "french": "Grodoudou"
    },
    "type": [
      "Normal",
      "Fairy"
    ],
    "base": {
      "HP": 140,
      "Attack": 70,
      "Defense": 45,
      "Sp. Attack": 85,
      "Sp. Defense": 50,
      "Speed": 45
    }
  },
  {
    "id": 41,
    "name": {
      "english": "Zubat",
      "japanese": "ズバット",
      "chinese": "超音蝠",
      "french": "Nosferapti"
    },
    "type": [
      "Poison",
      "Flying"
    ],
    "base": {
      "HP": 40,
      "Attack": 45,
      "Defense": 35,
      "Sp. Attack": 30,
      "Sp. Defense": 40,
      "Speed": 55
    }
  },
  {
    "id": 42,
    "name": {
      "english": "Golbat",
      "japanese": "ゴルバット",
      "chinese": "大嘴蝠",
      "french": "Nosferalto"
    },
    "type": [
      "Poison",
      "Flying"
    ],
    "base": {
      "HP": 75,
      "Attack": 80,
      "Defense": 70,
      "Sp. Attack": 65,
      "Sp. Defense": 75,
      "Speed": 90
    }
  },
  {
    "id": 43,
    "name": {
      "english": "Oddish",
      "japanese": "ナゾノクサ",
      "chinese": "走路草",
      "french": "Mystherbe"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 45,
      "Attack": 50,
      "Defense": 55,
      "Sp. Attack": 75,
      "Sp. Defense": 65,
      "Speed": 30
    }
  },
  {
    "id": 44,
    "name": {
      "english": "Gloom",
      "japanese": "クサイハナ",
      "chinese": "臭臭花",
      "french": "Ortide"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 60,
      "Attack": 65,
      "Defense": 70,
      "Sp. Attack": 85,
      "Sp. Defense": 75,
      "Speed": 40
    }
  },
  {
    "id": 45,
    "name": {
      "english": "Vileplume",
      "japanese": "ラフレシア",
      "chinese": "霸王花",
      "french": "Rafflesia"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 75,
      "Attack": 80,
      "Defense": 85,
      "Sp. Attack": 110,
      "Sp. Defense": 90,
      "Speed": 50
    }
  },
  {
    "id": 46,
    "name": {
      "english": "Paras",
      "japanese": "パラス",
      "chinese": "派拉斯",
      "french": "Paras"
    },
    "type": [
      "Bug",
      "Grass"
    ],
    "base": {
      "HP": 35,
      "Attack": 70,
      "Defense": 55,
      "Sp. Attack": 45,
      "Sp. Defense": 55,
      "Speed": 25
    }
  },
  {
    "id": 47,
    "name": {
      "english": "Parasect",
      "japanese": "パラセクト",
      "chinese": "派拉斯特",
      "french": "Parasect"
    },
    "type": [
      "Bug",
      "Grass"
    ],
    "base": {
      "HP": 60,
      "Attack": 95,
      "Defense": 80,
      "Sp. Attack": 60,
      "Sp. Defense": 80,
      "Speed": 30
    }
  },
  {
    "id": 48,
    "name": {
      "english": "Venonat",
      "japanese": "コンパン",
      "chinese": "毛球",
      "french": "Mimitoss"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 60,
      "Attack": 55,
      "Defense": 50,
      "Sp. Attack": 40,
      "Sp. Defense": 55,
      "Speed": 45
    }
  },
  {
    "id": 49,
    "name": {
      "english": "Venomoth",
      "japanese": "モルフォン",
      "chinese": "摩鲁蛾",
      "french": "Aéromite"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 70,
      "Attack": 65,
      "Defense": 60,
      "Sp. Attack": 90,
      "Sp. Defense": 75,
      "Speed": 90
    }
  },
  {
    "id": 50,
    "name": {
      "english": "Diglett",
      "japanese": "ディグダ",
      "chinese": "地鼠",
      "french": "Taupiqueur"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 10,
      "Attack": 55,
      "Defense": 25,
      "Sp. Attack": 35,
      "Sp. Defense": 45,
      "Speed": 95
    }
  },
  {
    "id": 51,
    "name": {
      "english": "Dugtrio",
      "japanese": "ダグトリオ",
      "chinese": "三地鼠",
      "french": "Triopikeur"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 35,
      "Attack": 100,
      "Defense": 50,
      "Sp. Attack": 50,
      "Sp. Defense": 70,
      "Speed": 120
    }
  },
  {
    "id": 52,
    "name": {
      "english": "Meowth",
      "japanese": "ニャース",
      "chinese": "喵喵",
      "french": "Miaouss"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 40,
      "Attack": 45,
      "Defense": 35,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 90
    }
  },
  {
    "id": 53,
    "name": {
      "english": "Persian",
      "japanese": "ペルシアン",
      "chinese": "猫老大",
      "french": "Persian"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 65,
      "Attack": 70,
      "Defense": 60,
      "Sp. Attack": 65,
      "Sp. Defense": 65,
      "Speed": 115
    }
  },
  {
    "id": 54,
    "name": {
      "english": "Psyduck",
      "japanese": "コダック",
      "chinese": "可达鸭",
      "french": "Psykokwak"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 50,
      "Attack": 52,
      "Defense": 48,
      "Sp. Attack": 65,
      "Sp. Defense": 50,
      "Speed": 55
    }
  },
  {
    "id": 55,
    "name": {
      "english": "Golduck",
      "japanese": "ゴルダック",
      "chinese": "哥达鸭",
      "french": "Akwakwak"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 80,
      "Attack": 82,
      "Defense": 78,
      "Sp. Attack": 95,
      "Sp. Defense": 80,
      "Speed": 85
    }
  },
  {
    "id": 56,
    "name": {
      "english": "Mankey",
      "japanese": "マンキー",
      "chinese": "猴怪",
      "french": "Férosinge"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 40,
      "Attack": 80,
      "Defense": 35,
      "Sp. Attack": 35,
      "Sp. Defense": 45,
      "Speed": 70
    }
  },
  {
    "id": 57,
    "name": {
      "english": "Primeape",
      "japanese": "オコリザル",
      "chinese": "火暴猴",
      "french": "Colossinge"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 65,
      "Attack": 105,
      "Defense": 60,
      "Sp. Attack": 60,
      "Sp. Defense": 70,
      "Speed": 95
    }
  },
  {
    "id": 58,
    "name": {
      "english": "Growlithe",
      "japanese": "ガーディ",
      "chinese": "卡蒂狗",
      "french": "Caninos"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 55,
      "Attack": 70,
      "Defense": 45,
      "Sp. Attack": 70,
      "Sp. Defense": 50,
      "Speed": 60
    }
  },
  {
    "id": 59,
    "name": {
      "english": "Arcanine",
      "japanese": "ウインディ",
      "chinese": "风速狗",
      "french": "Arcanin"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 90,
      "Attack": 110,
      "Defense": 80,
      "Sp. Attack": 100,
      "Sp. Defense": 80,
      "Speed": 95
    }
  },
  {
    "id": 60,
    "name": {
      "english": "Poliwag",
      "japanese": "ニョロモ",
      "chinese": "蚊香蝌蚪",
      "french": "Ptitard"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 40,
      "Attack": 50,
      "Defense": 40,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 90
    }
  },
  {
    "id": 61,
    "name": {
      "english": "Poliwhirl",
      "japanese": "ニョロゾ",
      "chinese": "蚊香君",
      "french": "Têtarte"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 65,
      "Attack": 65,
      "Defense": 65,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 90
    }
  },
  {
    "id": 62,
    "name": {
      "english": "Poliwrath",
      "japanese": "ニョロボン",
      "chinese": "蚊香泳士",
      "french": "Tartard"
    },
    "type": [
      "Water",
      "Fighting"
    ],
    "base": {
      "HP": 90,
      "Attack": 95,
      "Defense": 95,
      "Sp. Attack": 70,
      "Sp. Defense": 90,
      "Speed": 70
    }
  },
  {
    "id": 63,
    "name": {
      "english": "Abra",
      "japanese": "ケーシィ",
      "chinese": "凯西",
      "french": "Abra"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 25,
      "Attack": 20,
      "Defense": 15,
      "Sp. Attack": 105,
      "Sp. Defense": 55,
      "Speed": 90
    }
  },
  {
    "id": 64,
    "name": {
      "english": "Kadabra",
      "japanese": "ユンゲラー",
      "chinese": "勇基拉",
      "french": "Kadabra"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 40,
      "Attack": 35,
      "Defense": 30,
      "Sp. Attack": 120,
      "Sp. Defense": 70,
      "Speed": 105
    }
  },
  {
    "id": 65,
    "name": {
      "english": "Alakazam",
      "japanese": "フーディン",
      "chinese": "胡地",
      "french": "Alakazam"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 55,
      "Attack": 50,
      "Defense": 45,
      "Sp. Attack": 135,
      "Sp. Defense": 95,
      "Speed": 120
    }
  },
  {
    "id": 66,
    "name": {
      "english": "Machop",
      "japanese": "ワンリキー",
      "chinese": "腕力",
      "french": "Machoc"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 70,
      "Attack": 80,
      "Defense": 50,
      "Sp. Attack": 35,
      "Sp. Defense": 35,
      "Speed": 35
    }
  },
  {
    "id": 67,
    "name": {
      "english": "Machoke",
      "japanese": "ゴーリキー",
      "chinese": "豪力",
      "french": "Machopeur"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 80,
      "Attack": 100,
      "Defense": 70,
      "Sp. Attack": 50,
      "Sp. Defense": 60,
      "Speed": 45
    }
  },
  {
    "id": 68,
    "name": {
      "english": "Machamp",
      "japanese": "カイリキー",
      "chinese": "怪力",
      "french": "Mackogneur"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 90,
      "Attack": 130,
      "Defense": 80,
      "Sp. Attack": 65,
      "Sp. Defense": 85,
      "Speed": 55
    }
  },
  {
    "id": 69,
    "name": {
      "english": "Bellsprout",
      "japanese": "マダツボミ",
      "chinese": "喇叭芽",
      "french": "Chétiflor"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 50,
      "Attack": 75,
      "Defense": 35,
      "Sp. Attack": 70,
      "Sp. Defense": 30,
      "Speed": 40
    }
  },
  {
    "id": 70,
    "name": {
      "english": "Weepinbell",
      "japanese": "ウツドン",
      "chinese": "口呆花",
      "french": "Boustiflor"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 65,
      "Attack": 90,
      "Defense": 50,
      "Sp. Attack": 85,
      "Sp. Defense": 45,
      "Speed": 55
    }
  },
  {
    "id": 71,
    "name": {
      "english": "Victreebel",
      "japanese": "ウツボット",
      "chinese": "大食花",
      "french": "Empiflor"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 80,
      "Attack": 105,
      "Defense": 65,
      "Sp. Attack": 100,
      "Sp. Defense": 70,
      "Speed": 70
    }
  },
  {
    "id": 72,
    "name": {
      "english": "Tentacool",
      "japanese": "メノクラゲ",
      "chinese": "玛瑙水母",
      "french": "Tentacool"
    },
    "type": [
      "Water",
      "Poison"
    ],
    "base": {
      "HP": 40,
      "Attack": 40,
      "Defense": 35,
      "Sp. Attack": 50,
      "Sp. Defense": 100,
      "Speed": 70
    }
  },
  {
    "id": 73,
    "name": {
      "english": "Tentacruel",
      "japanese": "ドククラゲ",
      "chinese": "毒刺水母",
      "french": "Tentacruel"
    },
    "type": [
      "Water",
      "Poison"
    ],
    "base": {
      "HP": 80,
      "Attack": 70,
      "Defense": 65,
      "Sp. Attack": 80,
      "Sp. Defense": 120,
      "Speed": 100
    }
  },
  {
    "id": 74,
    "name": {
      "english": "Geodude",
      "japanese": "イシツブテ",
      "chinese": "小拳石",
      "french": "Racaillou"
    },
    "type": [
      "Rock",
      "Ground"
    ],
    "base": {
      "HP": 40,
      "Attack": 80,
      "Defense": 100,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 20
    }
  },
  {
    "id": 75,
    "name": {
      "english": "Graveler",
      "japanese": "ゴローン",
      "chinese": "隆隆石",
      "french": "Gravalanch"
    },
    "type": [
      "Rock",
      "Ground"
    ],
    "base": {
      "HP": 55,
      "Attack": 95,
      "Defense": 115,
      "Sp. Attack": 45,
      "Sp. Defense": 45,
      "Speed": 35
    }
  },
  {
    "id": 76,
    "name": {
      "english": "Golem",
      "japanese": "ゴローニャ",
      "chinese": "隆隆岩",
      "french": "Grolem"
    },
    "type": [
      "Rock",
      "Ground"
    ],
    "base": {
      "HP": 80,
      "Attack": 120,
      "Defense": 130,
      "Sp. Attack": 55,
      "Sp. Defense": 65,
      "Speed": 45
    }
  },
  {
    "id": 77,
    "name": {
      "english": "Ponyta",
      "japanese": "ポニータ",
      "chinese": "小火马",
      "french": "Ponyta"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 50,
      "Attack": 85,
      "Defense": 55,
      "Sp. Attack": 65,
      "Sp. Defense": 65,
      "Speed": 90
    }
  },
  {
    "id": 78,
    "name": {
      "english": "Rapidash",
      "japanese": "ギャロップ",
      "chinese": "烈焰马",
      "french": "Galopa"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 65,
      "Attack": 100,
      "Defense": 70,
      "Sp. Attack": 80,
      "Sp. Defense": 80,
      "Speed": 105
    }
  },
  {
    "id": 79,
    "name": {
      "english": "Slowpoke",
      "japanese": "ヤドン",
      "chinese": "呆呆兽",
      "french": "Ramoloss"
    },
    "type": [
      "Water",
      "Psychic"
    ],
    "base": {
      "HP": 90,
      "Attack": 65,
      "Defense": 65,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 15
    }
  },
  {
    "id": 80,
    "name": {
      "english": "Slowbro",
      "japanese": "ヤドラン",
      "chinese": "呆壳兽",
      "french": "Flagadoss"
    },
    "type": [
      "Water",
      "Psychic"
    ],
    "base": {
      "HP": 95,
      "Attack": 75,
      "Defense": 110,
      "Sp. Attack": 100,
      "Sp. Defense": 80,
      "Speed": 30
    }
  },
  {
    "id": 81,
    "name": {
      "english": "Magnemite",
      "japanese": "コイル",
      "chinese": "小磁怪",
      "french": "Magnéti"
    },
    "type": [
      "Electric",
      "Steel"
    ],
    "base": {
      "HP": 25,
      "Attack": 35,
      "Defense": 70,
      "Sp. Attack": 95,
      "Sp. Defense": 55,
      "Speed": 45
    }
  },
  {
    "id": 82,
    "name": {
      "english": "Magneton",
      "japanese": "レアコイル",
      "chinese": "三合一磁怪",
      "french": "Magnéton"
    },
    "type": [
      "Electric",
      "Steel"
    ],
    "base": {
      "HP": 50,
      "Attack": 60,
      "Defense": 95,
      "Sp. Attack": 120,
      "Sp. Defense": 70,
      "Speed": 70
    }
  },
  {
    "id": 83,
    "name": {
      "english": "Farfetch'd",
      "japanese": "カモネギ",
      "chinese": "大葱鸭",
      "french": "Canarticho"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 52,
      "Attack": 90,
      "Defense": 55,
      "Sp. Attack": 58,
      "Sp. Defense": 62,
      "Speed": 60
    }
  },
  {
    "id": 84,
    "name": {
      "english": "Doduo",
      "japanese": "ドードー",
      "chinese": "嘟嘟",
      "french": "Doduo"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 35,
      "Attack": 85,
      "Defense": 45,
      "Sp. Attack": 35,
      "Sp. Defense": 35,
      "Speed": 75
    }
  },
  {
    "id": 85,
    "name": {
      "english": "Dodrio",
      "japanese": "ドードリオ",
      "chinese": "嘟嘟利",
      "french": "Dodrio"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 60,
      "Attack": 110,
      "Defense": 70,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 110
    }
  },
  {
    "id": 86,
    "name": {
      "english": "Seel",
      "japanese": "パウワウ",
      "chinese": "小海狮",
      "french": "Otaria"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 65,
      "Attack": 45,
      "Defense": 55,
      "Sp. Attack": 45,
      "Sp. Defense": 70,
      "Speed": 45
    }
  },
  {
    "id": 87,
    "name": {
      "english": "Dewgong",
      "japanese": "ジュゴン",
      "chinese": "白海狮",
      "french": "Lamantine"
    },
    "type": [
      "Water",
      "Ice"
    ],
    "base": {
      "HP": 90,
      "Attack": 70,
      "Defense": 80,
      "Sp. Attack": 70,
      "Sp. Defense": 95,
      "Speed": 70
    }
  },
  {
    "id": 88,
    "name": {
      "english": "Grimer",
      "japanese": "ベトベター",
      "chinese": "臭泥",
      "french": "Tadmorv"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 80,
      "Attack": 80,
      "Defense": 50,
      "Sp. Attack": 40,
      "Sp. Defense": 50,
      "Speed": 25
    }
  },
  {
    "id": 89,
    "name": {
      "english": "Muk",
      "japanese": "ベトベトン",
      "chinese": "臭臭泥",
      "french": "Grotadmorv"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 105,
      "Attack": 105,
      "Defense": 75,
      "Sp. Attack": 65,
      "Sp. Defense": 100,
      "Speed": 50
    }
  },
  {
    "id": 90,
    "name": {
      "english": "Shellder",
      "japanese": "シェルダー",
      "chinese": "大舌贝",
      "french": "Kokiyas"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 30,
      "Attack": 65,
      "Defense": 100,
      "Sp. Attack": 45,
      "Sp. Defense": 25,
      "Speed": 40
    }
  },
  {
    "id": 91,
    "name": {
      "english": "Cloyster",
      "japanese": "パルシェン",
      "chinese": "刺甲贝",
      "french": "Crustabri"
    },
    "type": [
      "Water",
      "Ice"
    ],
    "base": {
      "HP": 50,
      "Attack": 95,
      "Defense": 180,
      "Sp. Attack": 85,
      "Sp. Defense": 45,
      "Speed": 70
    }
  },
  {
    "id": 92,
    "name": {
      "english": "Gastly",
      "japanese": "ゴース",
      "chinese": "鬼斯",
      "french": "Fantominus"
    },
    "type": [
      "Ghost",
      "Poison"
    ],
    "base": {
      "HP": 30,
      "Attack": 35,
      "Defense": 30,
      "Sp. Attack": 100,
      "Sp. Defense": 35,
      "Speed": 80
    }
  },
  {
    "id": 93,
    "name": {
      "english": "Haunter",
      "japanese": "ゴースト",
      "chinese": "鬼斯通",
      "french": "Spectrum"
    },
    "type": [
      "Ghost",
      "Poison"
    ],
    "base": {
      "HP": 45,
      "Attack": 50,
      "Defense": 45,
      "Sp. Attack": 115,
      "Sp. Defense": 55,
      "Speed": 95
    }
  },
  {
    "id": 94,
    "name": {
      "english": "Gengar",
      "japanese": "ゲンガー",
      "chinese": "耿鬼",
      "french": "Ectoplasma"
    },
    "type": [
      "Ghost",
      "Poison"
    ],
    "base": {
      "HP": 60,
      "Attack": 65,
      "Defense": 60,
      "Sp. Attack": 130,
      "Sp. Defense": 75,
      "Speed": 110
    }
  },
  {
    "id": 95,
    "name": {
      "english": "Onix",
      "japanese": "イワーク",
      "chinese": "大岩蛇",
      "french": "Onix"
    },
    "type": [
      "Rock",
      "Ground"
    ],
    "base": {
      "HP": 35,
      "Attack": 45,
      "Defense": 160,
      "Sp. Attack": 30,
      "Sp. Defense": 45,
      "Speed": 70
    }
  },
  {
    "id": 96,
    "name": {
      "english": "Drowzee",
      "japanese": "スリープ",
      "chinese": "催眠貘",
      "french": "Soporifik"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 60,
      "Attack": 48,
      "Defense": 45,
      "Sp. Attack": 43,
      "Sp. Defense": 90,
      "Speed": 42
    }
  },
  {
    "id": 97,
    "name": {
      "english": "Hypno",
      "japanese": "スリーパー",
      "chinese": "引梦貘人",
      "french": "Hypnomade"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 85,
      "Attack": 73,
      "Defense": 70,
      "Sp. Attack": 73,
      "Sp. Defense": 115,
      "Speed": 67
    }
  },
  {
    "id": 98,
    "name": {
      "english": "Krabby",
      "japanese": "クラブ",
      "chinese": "大钳蟹",
      "french": "Krabby"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 30,
      "Attack": 105,
      "Defense": 90,
      "Sp. Attack": 25,
      "Sp. Defense": 25,
      "Speed": 50
    }
  },
  {
    "id": 99,
    "name": {
      "english": "Kingler",
      "japanese": "キングラー",
      "chinese": "巨钳蟹",
      "french": "Krabboss"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 55,
      "Attack": 130,
      "Defense": 115,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 75
    }
  },
  {
    "id": 100,
    "name": {
      "english": "Voltorb",
      "japanese": "ビリリダマ",
      "chinese": "霹雳电球",
      "french": "Voltorbe"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 40,
      "Attack": 30,
      "Defense": 50,
      "Sp. Attack": 55,
      "Sp. Defense": 55,
      "Speed": 100
    }
  },
  {
    "id": 101,
    "name": {
      "english": "Electrode",
      "japanese": "マルマイン",
      "chinese": "顽皮雷弹",
      "french": "Électrode"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 60,
      "Attack": 50,
      "Defense": 70,
      "Sp. Attack": 80,
      "Sp. Defense": 80,
      "Speed": 150
    }
  },
  {
    "id": 102,
    "name": {
      "english": "Exeggcute",
      "japanese": "タマタマ",
      "chinese": "蛋蛋",
      "french": "Noeunoeuf"
    },
    "type": [
      "Grass",
      "Psychic"
    ],
    "base": {
      "HP": 60,
      "Attack": 40,
      "Defense": 80,
      "Sp. Attack": 60,
      "Sp. Defense": 45,
      "Speed": 40
    }
  },
  {
    "id": 103,
    "name": {
      "english": "Exeggutor",
      "japanese": "ナッシー",
      "chinese": "椰蛋树",
      "french": "Noadkoko"
    },
    "type": [
      "Grass",
      "Psychic"
    ],
    "base": {
      "HP": 95,
      "Attack": 95,
      "Defense": 85,
      "Sp. Attack": 125,
      "Sp. Defense": 75,
      "Speed": 55
    }
  },
  {
    "id": 104,
    "name": {
      "english": "Cubone",
      "japanese": "カラカラ",
      "chinese": "卡拉卡拉",
      "french": "Osselait"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 50,
      "Attack": 50,
      "Defense": 95,
      "Sp. Attack": 40,
      "Sp. Defense": 50,
      "Speed": 35
    }
  },
  {
    "id": 105,
    "name": {
      "english": "Marowak",
      "japanese": "ガラガラ",
      "chinese": "嘎啦嘎啦",
      "french": "Ossatueur"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 60,
      "Attack": 80,
      "Defense": 110,
      "Sp. Attack": 50,
      "Sp. Defense": 80,
      "Speed": 45
    }
  },
  {
    "id": 106,
    "name": {
      "english": "Hitmonlee",
      "japanese": "サワムラー",
      "chinese": "飞腿郎",
      "french": "Kicklee"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 50,
      "Attack": 120,
      "Defense": 53,
      "Sp. Attack": 35,
      "Sp. Defense": 110,
      "Speed": 87
    }
  },
  {
    "id": 107,
    "name": {
      "english": "Hitmonchan",
      "japanese": "エビワラー",
      "chinese": "快拳郎",
      "french": "Tygnon"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 50,
      "Attack": 105,
      "Defense": 79,
      "Sp. Attack": 35,
      "Sp. Defense": 110,
      "Speed": 76
    }
  },
  {
    "id": 108,
    "name": {
      "english": "Lickitung",
      "japanese": "ベロリンガ",
      "chinese": "大舌头",
      "french": "Excelangue"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 90,
      "Attack": 55,
      "Defense": 75,
      "Sp. Attack": 60,
      "Sp. Defense": 75,
      "Speed": 30
    }
  },
  {
    "id": 109,
    "name": {
      "english": "Koffing",
      "japanese": "ドガース",
      "chinese": "瓦斯弹",
      "french": "Smogo"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 40,
      "Attack": 65,
      "Defense": 95,
      "Sp. Attack": 60,
      "Sp. Defense": 45,
      "Speed": 35
    }
  },
  {
    "id": 110,
    "name": {
      "english": "Weezing",
      "japanese": "マタドガス",
      "chinese": "双弹瓦斯",
      "french": "Smogogo"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 65,
      "Attack": 90,
      "Defense": 120,
      "Sp. Attack": 85,
      "Sp. Defense": 70,
      "Speed": 60
    }
  },
  {
    "id": 111,
    "name": {
      "english": "Rhyhorn",
      "japanese": "サイホーン",
      "chinese": "独角犀牛",
      "french": "Rhinocorne"
    },
    "type": [
      "Ground",
      "Rock"
    ],
    "base": {
      "HP": 80,
      "Attack": 85,
      "Defense": 95,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 25
    }
  },
  {
    "id": 112,
    "name": {
      "english": "Rhydon",
      "japanese": "サイドン",
      "chinese": "钻角犀兽",
      "french": "Rhinoféros"
    },
    "type": [
      "Ground",
      "Rock"
    ],
    "base": {
      "HP": 105,
      "Attack": 130,
      "Defense": 120,
      "Sp. Attack": 45,
      "Sp. Defense": 45,
      "Speed": 40
    }
  },
  {
    "id": 113,
    "name": {
      "english": "Chansey",
      "japanese": "ラッキー",
      "chinese": "吉利蛋",
      "french": "Leveinard"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 250,
      "Attack": 5,
      "Defense": 5,
      "Sp. Attack": 35,
      "Sp. Defense": 105,
      "Speed": 50
    }
  },
  {
    "id": 114,
    "name": {
      "english": "Tangela",
      "japanese": "モンジャラ",
      "chinese": "蔓藤怪",
      "french": "Saquedeneu"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 65,
      "Attack": 55,
      "Defense": 115,
      "Sp. Attack": 100,
      "Sp. Defense": 40,
      "Speed": 60
    }
  },
  {
    "id": 115,
    "name": {
      "english": "Kangaskhan",
      "japanese": "ガルーラ",
      "chinese": "袋兽",
      "french": "Kangourex"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 105,
      "Attack": 95,
      "Defense": 80,
      "Sp. Attack": 40,
      "Sp. Defense": 80,
      "Speed": 90
    }
  },
  {
    "id": 116,
    "name": {
      "english": "Horsea",
      "japanese": "タッツー",
      "chinese": "墨海马",
      "french": "Hypotrempe"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 30,
      "Attack": 40,
      "Defense": 70,
      "Sp. Attack": 70,
      "Sp. Defense": 25,
      "Speed": 60
    }
  },
  {
    "id": 117,
    "name": {
      "english": "Seadra",
      "japanese": "シードラ",
      "chinese": "海刺龙",
      "french": "Hypocéan"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 55,
      "Attack": 65,
      "Defense": 95,
      "Sp. Attack": 95,
      "Sp. Defense": 45,
      "Speed": 85
    }
  },
  {
    "id": 118,
    "name": {
      "english": "Goldeen",
      "japanese": "トサキント",
      "chinese": "角金鱼",
      "french": "Poissirène"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 45,
      "Attack": 67,
      "Defense": 60,
      "Sp. Attack": 35,
      "Sp. Defense": 50,
      "Speed": 63
    }
  },
  {
    "id": 119,
    "name": {
      "english": "Seaking",
      "japanese": "アズマオウ",
      "chinese": "金鱼王",
      "french": "Poissoroy"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 80,
      "Attack": 92,
      "Defense": 65,
      "Sp. Attack": 65,
      "Sp. Defense": 80,
      "Speed": 68
    }
  },
  {
    "id": 120,
    "name": {
      "english": "Staryu",
      "japanese": "ヒトデマン",
      "chinese": "海星星",
      "french": "Stari"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 30,
      "Attack": 45,
      "Defense": 55,
      "Sp. Attack": 70,
      "Sp. Defense": 55,
      "Speed": 85
    }
  },
  {
    "id": 121,
    "name": {
      "english": "Starmie",
      "japanese": "スターミー",
      "chinese": "宝石海星",
      "french": "Staross"
    },
    "type": [
      "Water",
      "Psychic"
    ],
    "base": {
      "HP": 60,
      "Attack": 75,
      "Defense": 85,
      "Sp. Attack": 100,
      "Sp. Defense": 85,
      "Speed": 115
    }
  },
  {
    "id": 122,
    "name": {
      "english": "Mr. Mime",
      "japanese": "バリヤード",
      "chinese": "魔墙人偶",
      "french": "M. Mime"
    },
    "type": [
      "Psychic",
      "Fairy"
    ],
    "base": {
      "HP": 40,
      "Attack": 45,
      "Defense": 65,
      "Sp. Attack": 100,
      "Sp. Defense": 120,
      "Speed": 90
    }
  },
  {
    "id": 123,
    "name": {
      "english": "Scyther",
      "japanese": "ストライク",
      "chinese": "飞天螳螂",
      "french": "Insécateur"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 70,
      "Attack": 110,
      "Defense": 80,
      "Sp. Attack": 55,
      "Sp. Defense": 80,
      "Speed": 105
    }
  },
  {
    "id": 124,
    "name": {
      "english": "Jynx",
      "japanese": "ルージュラ",
      "chinese": "迷唇姐",
      "french": "Lippoutou"
    },
    "type": [
      "Ice",
      "Psychic"
    ],
    "base": {
      "HP": 65,
      "Attack": 50,
      "Defense": 35,
      "Sp. Attack": 115,
      "Sp. Defense": 95,
      "Speed": 95
    }
  },
  {
    "id": 125,
    "name": {
      "english": "Electabuzz",
      "japanese": "エレブー",
      "chinese": "电击兽",
      "french": "Élektek"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 65,
      "Attack": 83,
      "Defense": 57,
      "Sp. Attack": 95,
      "Sp. Defense": 85,
      "Speed": 105
    }
  },
  {
    "id": 126,
    "name": {
      "english": "Magmar",
      "japanese": "ブーバー",
      "chinese": "鸭嘴火兽",
      "french": "Magmar"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 65,
      "Attack": 95,
      "Defense": 57,
      "Sp. Attack": 100,
      "Sp. Defense": 85,
      "Speed": 93
    }
  },
  {
    "id": 127,
    "name": {
      "english": "Pinsir",
      "japanese": "カイロス",
      "chinese": "凯罗斯",
      "french": "Scarabrute"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 65,
      "Attack": 125,
      "Defense": 100,
      "Sp. Attack": 55,
      "Sp. Defense": 70,
      "Speed": 85
    }
  },
  {
    "id": 128,
    "name": {
      "english": "Tauros",
      "japanese": "ケンタロス",
      "chinese": "肯泰罗",
      "french": "Tauros"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 75,
      "Attack": 100,
      "Defense": 95,
      "Sp. Attack": 40,
      "Sp. Defense": 70,
      "Speed": 110
    }
  },
  {
    "id": 129,
    "name": {
      "english": "Magikarp",
      "japanese": "コイキング",
      "chinese": "鲤鱼王",
      "french": "Magicarpe"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 20,
      "Attack": 10,
      "Defense": 55,
      "Sp. Attack": 15,
      "Sp. Defense": 20,
      "Speed": 80
    }
  },
  {
    "id": 130,
    "name": {
      "english": "Gyarados",
      "japanese": "ギャラドス",
      "chinese": "暴鲤龙",
      "french": "Léviator"
    },
    "type": [
      "Water",
      "Flying"
    ],
    "base": {
      "HP": 95,
      "Attack": 125,
      "Defense": 79,
      "Sp. Attack": 60,
      "Sp. Defense": 100,
      "Speed": 81
    }
  },
  {
    "id": 131,
    "name": {
      "english": "Lapras",
      "japanese": "ラプラス",
      "chinese": "拉普拉斯",
      "french": "Lokhlass"
    },
    "type": [
      "Water",
      "Ice"
    ],
    "base": {
      "HP": 130,
      "Attack": 85,
      "Defense": 80,
      "Sp. Attack": 85,
      "Sp. Defense": 95,
      "Speed": 60
    }
  },
  {
    "id": 132,
    "name": {
      "english": "Ditto",
      "japanese": "メタモン",
      "chinese": "百变怪",
      "french": "Métamorph"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 48,
      "Attack": 48,
      "Defense": 48,
      "Sp. Attack": 48,
      "Sp. Defense": 48,
      "Speed": 48
    }
  },
  {
    "id": 133,
    "name": {
      "english": "Eevee",
      "japanese": "イーブイ",
      "chinese": "伊布",
      "french": "Évoli"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 55,
      "Attack": 55,
      "Defense": 50,
      "Sp. Attack": 45,
      "Sp. Defense": 65,
      "Speed": 55
    }
  },
  {
    "id": 134,
    "name": {
      "english": "Vaporeon",
      "japanese": "シャワーズ",
      "chinese": "水伊布",
      "french": "Aquali"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 130,
      "Attack": 65,
      "Defense": 60,
      "Sp. Attack": 110,
      "Sp. Defense": 95,
      "Speed": 65
    }
  },
  {
    "id": 135,
    "name": {
      "english": "Jolteon",
      "japanese": "サンダース",
      "chinese": "雷伊布",
      "french": "Voltali"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 65,
      "Attack": 65,
      "Defense": 60,
      "Sp. Attack": 110,
      "Sp. Defense": 95,
      "Speed": 130
    }
  },
  {
    "id": 136,
    "name": {
      "english": "Flareon",
      "japanese": "ブースター",
      "chinese": "火伊布",
      "french": "Pyroli"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 65,
      "Attack": 130,
      "Defense": 60,
      "Sp. Attack": 95,
      "Sp. Defense": 110,
      "Speed": 65
    }
  },
  {
    "id": 137,
    "name": {
      "english": "Porygon",
      "japanese": "ポリゴン",
      "chinese": "多边兽",
      "french": "Porygon"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 65,
      "Attack": 60,
      "Defense": 70,
      "Sp. Attack": 85,
      "Sp. Defense": 75,
      "Speed": 40
    }
  },
  {
    "id": 138,
    "name": {
      "english": "Omanyte",
      "japanese": "オムナイト",
      "chinese": "菊石兽",
      "french": "Amonita"
    },
    "type": [
      "Rock",
      "Water"
    ],
    "base": {
      "HP": 35,
      "Attack": 40,
      "Defense": 100,
      "Sp. Attack": 90,
      "Sp. Defense": 55,
      "Speed": 35
    }
  },
  {
    "id": 139,
    "name": {
      "english": "Omastar",
      "japanese": "オムスター",
      "chinese": "多刺菊石兽",
      "french": "Amonistar"
    },
    "type": [
      "Rock",
      "Water"
    ],
    "base": {
      "HP": 70,
      "Attack": 60,
      "Defense": 125,
      "Sp. Attack": 115,
      "Sp. Defense": 70,
      "Speed": 55
    }
  },
  {
    "id": 140,
    "name": {
      "english": "Kabuto",
      "japanese": "カブト",
      "chinese": "化石盔",
      "french": "Kabuto"
    },
    "type": [
      "Rock",
      "Water"
    ],
    "base": {
      "HP": 30,
      "Attack": 80,
      "Defense": 90,
      "Sp. Attack": 55,
      "Sp. Defense": 45,
      "Speed": 55
    }
  },
  {
    "id": 141,
    "name": {
      "english": "Kabutops",
      "japanese": "カブトプス",
      "chinese": "镰刀盔",
      "french": "Kabutops"
    },
    "type": [
      "Rock",
      "Water"
    ],
    "base": {
      "HP": 60,
      "Attack": 115,
      "Defense": 105,
      "Sp. Attack": 65,
      "Sp. Defense": 70,
      "Speed": 80
    }
  },
  {
    "id": 142,
    "name": {
      "english": "Aerodactyl",
      "japanese": "プテラ",
      "chinese": "化石翼龙",
      "french": "Ptéra"
    },
    "type": [
      "Rock",
      "Flying"
    ],
    "base": {
      "HP": 80,
      "Attack": 105,
      "Defense": 65,
      "Sp. Attack": 60,
      "Sp. Defense": 75,
      "Speed": 130
    }
  },
  {
    "id": 143,
    "name": {
      "english": "Snorlax",
      "japanese": "カビゴン",
      "chinese": "卡比兽",
      "french": "Ronflex"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 160,
      "Attack": 110,
      "Defense": 65,
      "Sp. Attack": 65,
      "Sp. Defense": 110,
      "Speed": 30
    }
  },
  {
    "id": 144,
    "name": {
      "english": "Articuno",
      "japanese": "フリーザー",
      "chinese": "急冻鸟",
      "french": "Artikodin"
    },
    "type": [
      "Ice",
      "Flying"
    ],
    "base": {
      "HP": 90,
      "Attack": 85,
      "Defense": 100,
      "Sp. Attack": 95,
      "Sp. Defense": 125,
      "Speed": 85
    }
  },
  {
    "id": 145,
    "name": {
      "english": "Zapdos",
      "japanese": "サンダー",
      "chinese": "闪电鸟",
      "french": "Électhor"
    },
    "type": [
      "Electric",
      "Flying"
    ],
    "base": {
      "HP": 90,
      "Attack": 90,
      "Defense": 85,
      "Sp. Attack": 125,
      "Sp. Defense": 90,
      "Speed": 100
    }
  },
  {
    "id": 146,
    "name": {
      "english": "Moltres",
      "japanese": "ファイヤー",
      "chinese": "火焰鸟",
      "french": "Sulfura"
    },
    "type": [
      "Fire",
      "Flying"
    ],
    "base": {
      "HP": 90,
      "Attack": 100,
      "Defense": 90,
      "Sp. Attack": 125,
      "Sp. Defense": 85,
      "Speed": 90
    }
  },
  {
    "id": 147,
    "name": {
      "english": "Dratini",
      "japanese": "ミニリュウ",
      "chinese": "迷你龙",
      "french": "Minidraco"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 41,
      "Attack": 64,
      "Defense": 45,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 50
    }
  },
  {
    "id": 148,
    "name": {
      "english": "Dragonair",
      "japanese": "ハクリュー",
      "chinese": "哈克龙",
      "french": "Draco"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 61,
      "Attack": 84,
      "Defense": 65,
      "Sp. Attack": 70,
      "Sp. Defense": 70,
      "Speed": 70
    }
  },
  {
    "id": 149,
    "name": {
      "english": "Dragonite",
      "japanese": "カイリュー",
      "chinese": "快龙",
      "french": "Dracolosse"
    },
    "type": [
      "Dragon",
      "Flying"
    ],
    "base": {
      "HP": 91,
      "Attack": 134,
      "Defense": 95,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      "Speed": 80
    }
  },
  {
    "id": 150,
    "name": {
      "english": "Mewtwo",
      "japanese": "ミュウツー",
      "chinese": "超梦",
      "french": "Mewtwo"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 106,
      "Attack": 110,
      "Defense": 90,
      "Sp. Attack": 154,
      "Sp. Defense": 90,
      "Speed": 130
    }
  },
  {
    "id": 151,
    "name": {
      "english": "Mew",
      "japanese": "ミュウ",
      "chinese": "梦幻",
      "french": "Mew"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 100,
      "Attack": 100,
      "Defense": 100,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      "Speed": 100
    }
  },
  {
    "id": 152,
    "name": {
      "english": "Chikorita",
      "japanese": "チコリータ",
      "chinese": "菊草叶",
      "french": "Germignon"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 45,
      "Attack": 49,
      "Defense": 65,
      "Sp. Attack": 49,
      "Sp. Defense": 65,
      "Speed": 45
    }
  },
  {
    "id": 153,
    "name": {
      "english": "Bayleef",
      "japanese": "ベイリーフ",
      "chinese": "月桂叶",
      "french": "Macronium"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 60,
      "Attack": 62,
      "Defense": 80,
      "Sp. Attack": 63,
      "Sp. Defense": 80,
      "Speed": 60
    }
  },
  {
    "id": 154,
    "name": {
      "english": "Meganium",
      "japanese": "メガニウム",
      "chinese": "大竺葵",
      "french": "Méganium"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 80,
      "Attack": 82,
      "Defense": 100,
      "Sp. Attack": 83,
      "Sp. Defense": 100,
      "Speed": 80
    }
  },
  {
    "id": 155,
    "name": {
      "english": "Cyndaquil",
      "japanese": "ヒノアラシ",
      "chinese": "火球鼠",
      "french": "Héricendre"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 39,
      "Attack": 52,
      "Defense": 43,
      "Sp. Attack": 60,
      "Sp. Defense": 50,
      "Speed": 65
    }
  },
  {
    "id": 156,
    "name": {
      "english": "Quilava",
      "japanese": "マグマラシ",
      "chinese": "火岩鼠",
      "french": "Feurisson"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 58,
      "Attack": 64,
      "Defense": 58,
      "Sp. Attack": 80,
      "Sp. Defense": 65,
      "Speed": 80
    }
  },
  {
    "id": 157,
    "name": {
      "english": "Typhlosion",
      "japanese": "バクフーン",
      "chinese": "火暴兽",
      "french": "Typhlosion"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 78,
      "Attack": 84,
      "Defense": 78,
      "Sp. Attack": 109,
      "Sp. Defense": 85,
      "Speed": 100
    }
  },
  {
    "id": 158,
    "name": {
      "english": "Totodile",
      "japanese": "ワニノコ",
      "chinese": "小锯鳄",
      "french": "Kaiminus"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 50,
      "Attack": 65,
      "Defense": 64,
      "Sp. Attack": 44,
      "Sp. Defense": 48,
      "Speed": 43
    }
  },
  {
    "id": 159,
    "name": {
      "english": "Croconaw",
      "japanese": "アリゲイツ",
      "chinese": "蓝鳄",
      "french": "Crocrodil"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 65,
      "Attack": 80,
      "Defense": 80,
      "Sp. Attack": 59,
      "Sp. Defense": 63,
      "Speed": 58
    }
  },
  {
    "id": 160,
    "name": {
      "english": "Feraligatr",
      "japanese": "オーダイル",
      "chinese": "大力鳄",
      "french": "Aligatueur"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 85,
      "Attack": 105,
      "Defense": 100,
      "Sp. Attack": 79,
      "Sp. Defense": 83,
      "Speed": 78
    }
  },
  {
    "id": 161,
    "name": {
      "english": "Sentret",
      "japanese": "オタチ",
      "chinese": "尾立",
      "french": "Fouinette"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 35,
      "Attack": 46,
      "Defense": 34,
      "Sp. Attack": 35,
      "Sp. Defense": 45,
      "Speed": 20
    }
  },
  {
    "id": 162,
    "name": {
      "english": "Furret",
      "japanese": "オオタチ",
      "chinese": "大尾立",
      "french": "Fouinar"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 85,
      "Attack": 76,
      "Defense": 64,
      "Sp. Attack": 45,
      "Sp. Defense": 55,
      "Speed": 90
    }
  },
  {
    "id": 163,
    "name": {
      "english": "Hoothoot",
      "japanese": "ホーホー",
      "chinese": "咕咕",
      "french": "Hoothoot"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 60,
      "Attack": 30,
      "Defense": 30,
      "Sp. Attack": 36,
      "Sp. Defense": 56,
      "Speed": 50
    }
  },
  {
    "id": 164,
    "name": {
      "english": "Noctowl",
      "japanese": "ヨルノズク",
      "chinese": "猫头夜鹰",
      "french": "Noarfang"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 100,
      "Attack": 50,
      "Defense": 50,
      "Sp. Attack": 86,
      "Sp. Defense": 96,
      "Speed": 70
    }
  },
  {
    "id": 165,
    "name": {
      "english": "Ledyba",
      "japanese": "レディバ",
      "chinese": "芭瓢虫",
      "french": "Coxy"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 40,
      "Attack": 20,
      "Defense": 30,
      "Sp. Attack": 40,
      "Sp. Defense": 80,
      "Speed": 55
    }
  },
  {
    "id": 166,
    "name": {
      "english": "Ledian",
      "japanese": "レディアン",
      "chinese": "安瓢虫",
      "french": "Coxyclaque"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 55,
      "Attack": 35,
      "Defense": 50,
      "Sp. Attack": 55,
      "Sp. Defense": 110,
      "Speed": 85
    }
  },
  {
    "id": 167,
    "name": {
      "english": "Spinarak",
      "japanese": "イトマル",
      "chinese": "圆丝蛛",
      "french": "Mimigal"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 40,
      "Attack": 60,
      "Defense": 40,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 30
    }
  },
  {
    "id": 168,
    "name": {
      "english": "Ariados",
      "japanese": "アリアドス",
      "chinese": "阿利多斯",
      "french": "Migalos"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 70,
      "Attack": 90,
      "Defense": 70,
      "Sp. Attack": 60,
      "Sp. Defense": 70,
      "Speed": 40
    }
  },
  {
    "id": 169,
    "name": {
      "english": "Crobat",
      "japanese": "クロバット",
      "chinese": "叉字蝠",
      "french": "Nostenfer"
    },
    "type": [
      "Poison",
      "Flying"
    ],
    "base": {
      "HP": 85,
      "Attack": 90,
      "Defense": 80,
      "Sp. Attack": 70,
      "Sp. Defense": 80,
      "Speed": 130
    }
  },
  {
    "id": 170,
    "name": {
      "english": "Chinchou",
      "japanese": "チョンチー",
      "chinese": "灯笼鱼",
      "french": "Loupio"
    },
    "type": [
      "Water",
      "Electric"
    ],
    "base": {
      "HP": 75,
      "Attack": 38,
      "Defense": 38,
      "Sp. Attack": 56,
      "Sp. Defense": 56,
      "Speed": 67
    }
  },
  {
    "id": 171,
    "name": {
      "english": "Lanturn",
      "japanese": "ランターン",
      "chinese": "电灯怪",
      "french": "Lanturn"
    },
    "type": [
      "Water",
      "Electric"
    ],
    "base": {
      "HP": 125,
      "Attack": 58,
      "Defense": 58,
      "Sp. Attack": 76,
      "Sp. Defense": 76,
      "Speed": 67
    }
  },
  {
    "id": 172,
    "name": {
      "english": "Pichu",
      "japanese": "ピチュー",
      "chinese": "皮丘",
      "french": "Pichu"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 20,
      "Attack": 40,
      "Defense": 15,
      "Sp. Attack": 35,
      "Sp. Defense": 35,
      "Speed": 60
    }
  },
  {
    "id": 173,
    "name": {
      "english": "Cleffa",
      "japanese": "ピィ",
      "chinese": "皮宝宝",
      "french": "Mélo"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 50,
      "Attack": 25,
      "Defense": 28,
      "Sp. Attack": 45,
      "Sp. Defense": 55,
      "Speed": 15
    }
  },
  {
    "id": 174,
    "name": {
      "english": "Igglybuff",
      "japanese": "ププリン",
      "chinese": "宝宝丁",
      "french": "Toudoudou"
    },
    "type": [
      "Normal",
      "Fairy"
    ],
    "base": {
      "HP": 90,
      "Attack": 30,
      "Defense": 15,
      "Sp. Attack": 40,
      "Sp. Defense": 20,
      "Speed": 15
    }
  },
  {
    "id": 175,
    "name": {
      "english": "Togepi",
      "japanese": "トゲピー",
      "chinese": "波克比",
      "french": "Togepi"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 35,
      "Attack": 20,
      "Defense": 65,
      "Sp. Attack": 40,
      "Sp. Defense": 65,
      "Speed": 20
    }
  },
  {
    "id": 176,
    "name": {
      "english": "Togetic",
      "japanese": "トゲチック",
      "chinese": "波克基古",
      "french": "Togetic"
    },
    "type": [
      "Fairy",
      "Flying"
    ],
    "base": {
      "HP": 55,
      "Attack": 40,
      "Defense": 85,
      "Sp. Attack": 80,
      "Sp. Defense": 105,
      "Speed": 40
    }
  },
  {
    "id": 177,
    "name": {
      "english": "Natu",
      "japanese": "ネイティ",
      "chinese": "天然雀",
      "french": "Natu"
    },
    "type": [
      "Psychic",
      "Flying"
    ],
    "base": {
      "HP": 40,
      "Attack": 50,
      "Defense": 45,
      "Sp. Attack": 70,
      "Sp. Defense": 45,
      "Speed": 70
    }
  },
  {
    "id": 178,
    "name": {
      "english": "Xatu",
      "japanese": "ネイティオ",
      "chinese": "天然鸟",
      "french": "Xatu"
    },
    "type": [
      "Psychic",
      "Flying"
    ],
    "base": {
      "HP": 65,
      "Attack": 75,
      "Defense": 70,
      "Sp. Attack": 95,
      "Sp. Defense": 70,
      "Speed": 95
    }
  },
  {
    "id": 179,
    "name": {
      "english": "Mareep",
      "japanese": "メリープ",
      "chinese": "咩利羊",
      "french": "Wattouat"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 55,
      "Attack": 40,
      "Defense": 40,
      "Sp. Attack": 65,
      "Sp. Defense": 45,
      "Speed": 35
    }
  },
  {
    "id": 180,
    "name": {
      "english": "Flaaffy",
      "japanese": "モココ",
      "chinese": "茸茸羊",
      "french": "Lainergie"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 70,
      "Attack": 55,
      "Defense": 55,
      "Sp. Attack": 80,
      "Sp. Defense": 60,
      "Speed": 45
    }
  },
  {
    "id": 181,
    "name": {
      "english": "Ampharos",
      "japanese": "デンリュウ",
      "chinese": "电龙",
      "french": "Pharamp"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 90,
      "Attack": 75,
      "Defense": 85,
      "Sp. Attack": 115,
      "Sp. Defense": 90,
      "Speed": 55
    }
  },
  {
    "id": 182,
    "name": {
      "english": "Bellossom",
      "japanese": "キレイハナ",
      "chinese": "美丽花",
      "french": "Joliflor"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 75,
      "Attack": 80,
      "Defense": 95,
      "Sp. Attack": 90,
      "Sp. Defense": 100,
      "Speed": 50
    }
  },
  {
    "id": 183,
    "name": {
      "english": "Marill",
      "japanese": "マリル",
      "chinese": "玛力露",
      "french": "Marill"
    },
    "type": [
      "Water",
      "Fairy"
    ],
    "base": {
      "HP": 70,
      "Attack": 20,
      "Defense": 50,
      "Sp. Attack": 20,
      "Sp. Defense": 50,
      "Speed": 40
    }
  },
  {
    "id": 184,
    "name": {
      "english": "Azumarill",
      "japanese": "マリルリ",
      "chinese": "玛力露丽",
      "french": "Azumarill"
    },
    "type": [
      "Water",
      "Fairy"
    ],
    "base": {
      "HP": 100,
      "Attack": 50,
      "Defense": 80,
      "Sp. Attack": 60,
      "Sp. Defense": 80,
      "Speed": 50
    }
  },
  {
    "id": 185,
    "name": {
      "english": "Sudowoodo",
      "japanese": "ウソッキー",
      "chinese": "树才怪‎",
      "french": "Simularbre"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 70,
      "Attack": 100,
      "Defense": 115,
      "Sp. Attack": 30,
      "Sp. Defense": 65,
      "Speed": 30
    }
  },
  {
    "id": 186,
    "name": {
      "english": "Politoed",
      "japanese": "ニョロトノ",
      "chinese": "蚊香蛙皇",
      "french": "Tarpaud"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 90,
      "Attack": 75,
      "Defense": 75,
      "Sp. Attack": 90,
      "Sp. Defense": 100,
      "Speed": 70
    }
  },
  {
    "id": 187,
    "name": {
      "english": "Hoppip",
      "japanese": "ハネッコ",
      "chinese": "毽子草",
      "french": "Granivol"
    },
    "type": [
      "Grass",
      "Flying"
    ],
    "base": {
      "HP": 35,
      "Attack": 35,
      "Defense": 40,
      "Sp. Attack": 35,
      "Sp. Defense": 55,
      "Speed": 50
    }
  },
  {
    "id": 188,
    "name": {
      "english": "Skiploom",
      "japanese": "ポポッコ",
      "chinese": "毽子花",
      "french": "Floravol"
    },
    "type": [
      "Grass",
      "Flying"
    ],
    "base": {
      "HP": 55,
      "Attack": 45,
      "Defense": 50,
      "Sp. Attack": 45,
      "Sp. Defense": 65,
      "Speed": 80
    }
  },
  {
    "id": 189,
    "name": {
      "english": "Jumpluff",
      "japanese": "ワタッコ",
      "chinese": "毽子棉",
      "french": "Cotovol"
    },
    "type": [
      "Grass",
      "Flying"
    ],
    "base": {
      "HP": 75,
      "Attack": 55,
      "Defense": 70,
      "Sp. Attack": 55,
      "Sp. Defense": 95,
      "Speed": 110
    }
  },
  {
    "id": 190,
    "name": {
      "english": "Aipom",
      "japanese": "エイパム",
      "chinese": "长尾怪手",
      "french": "Capumain"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 55,
      "Attack": 70,
      "Defense": 55,
      "Sp. Attack": 40,
      "Sp. Defense": 55,
      "Speed": 85
    }
  },
  {
    "id": 191,
    "name": {
      "english": "Sunkern",
      "japanese": "ヒマナッツ",
      "chinese": "向日种子",
      "french": "Tournegrin"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 30,
      "Attack": 30,
      "Defense": 30,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 30
    }
  },
  {
    "id": 192,
    "name": {
      "english": "Sunflora",
      "japanese": "キマワリ",
      "chinese": "向日花怪",
      "french": "Héliatronc"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 75,
      "Attack": 75,
      "Defense": 55,
      "Sp. Attack": 105,
      "Sp. Defense": 85,
      "Speed": 30
    }
  },
  {
    "id": 193,
    "name": {
      "english": "Yanma",
      "japanese": "ヤンヤンマ",
      "chinese": "蜻蜻蜓",
      "french": "Yanma"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 65,
      "Attack": 65,
      "Defense": 45,
      "Sp. Attack": 75,
      "Sp. Defense": 45,
      "Speed": 95
    }
  },
  {
    "id": 194,
    "name": {
      "english": "Wooper",
      "japanese": "ウパー",
      "chinese": "乌波",
      "french": "Axoloto"
    },
    "type": [
      "Water",
      "Ground"
    ],
    "base": {
      "HP": 55,
      "Attack": 45,
      "Defense": 45,
      "Sp. Attack": 25,
      "Sp. Defense": 25,
      "Speed": 15
    }
  },
  {
    "id": 195,
    "name": {
      "english": "Quagsire",
      "japanese": "ヌオー",
      "chinese": "沼王",
      "french": "Maraiste"
    },
    "type": [
      "Water",
      "Ground"
    ],
    "base": {
      "HP": 95,
      "Attack": 85,
      "Defense": 85,
      "Sp. Attack": 65,
      "Sp. Defense": 65,
      "Speed": 35
    }
  },
  {
    "id": 196,
    "name": {
      "english": "Espeon",
      "japanese": "エーフィ",
      "chinese": "太阳伊布",
      "french": "Mentali"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 65,
      "Attack": 65,
      "Defense": 60,
      "Sp. Attack": 130,
      "Sp. Defense": 95,
      "Speed": 110
    }
  },
  {
    "id": 197,
    "name": {
      "english": "Umbreon",
      "japanese": "ブラッキー",
      "chinese": "月亮伊布",
      "french": "Noctali"
    },
    "type": [
      "Dark"
    ],
    "base": {
      "HP": 95,
      "Attack": 65,
      "Defense": 110,
      "Sp. Attack": 60,
      "Sp. Defense": 130,
      "Speed": 65
    }
  },
  {
    "id": 198,
    "name": {
      "english": "Murkrow",
      "japanese": "ヤミカラス",
      "chinese": "黑暗鸦",
      "french": "Cornèbre"
    },
    "type": [
      "Dark",
      "Flying"
    ],
    "base": {
      "HP": 60,
      "Attack": 85,
      "Defense": 42,
      "Sp. Attack": 85,
      "Sp. Defense": 42,
      "Speed": 91
    }
  },
  {
    "id": 199,
    "name": {
      "english": "Slowking",
      "japanese": "ヤドキング",
      "chinese": "呆呆王",
      "french": "Roigada"
    },
    "type": [
      "Water",
      "Psychic"
    ],
    "base": {
      "HP": 95,
      "Attack": 75,
      "Defense": 80,
      "Sp. Attack": 100,
      "Sp. Defense": 110,
      "Speed": 30
    }
  },
  {
    "id": 200,
    "name": {
      "english": "Misdreavus",
      "japanese": "ムウマ",
      "chinese": "梦妖",
      "french": "Feuforêve"
    },
    "type": [
      "Ghost"
    ],
    "base": {
      "HP": 60,
      "Attack": 60,
      "Defense": 60,
      "Sp. Attack": 85,
      "Sp. Defense": 85,
      "Speed": 85
    }
  },
  {
    "id": 201,
    "name": {
      "english": "Unown",
      "japanese": "アンノーン",
      "chinese": "未知图腾",
      "french": "Zarbi"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 48,
      "Attack": 72,
      "Defense": 48,
      "Sp. Attack": 72,
      "Sp. Defense": 48,
      "Speed": 48
    }
  },
  {
    "id": 202,
    "name": {
      "english": "Wobbuffet",
      "japanese": "ソーナンス",
      "chinese": "果然翁",
      "french": "Qulbutoké"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 190,
      "Attack": 33,
      "Defense": 58,
      "Sp. Attack": 33,
      "Sp. Defense": 58,
      "Speed": 33
    }
  },
  {
    "id": 203,
    "name": {
      "english": "Girafarig",
      "japanese": "キリンリキ",
      "chinese": "麒麟奇",
      "french": "Girafarig"
    },
    "type": [
      "Normal",
      "Psychic"
    ],
    "base": {
      "HP": 70,
      "Attack": 80,
      "Defense": 65,
      "Sp. Attack": 90,
      "Sp. Defense": 65,
      "Speed": 85
    }
  },
  {
    "id": 204,
    "name": {
      "english": "Pineco",
      "japanese": "クヌギダマ",
      "chinese": "榛果球",
      "french": "Pomdepik"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 50,
      "Attack": 65,
      "Defense": 90,
      "Sp. Attack": 35,
      "Sp. Defense": 35,
      "Speed": 15
    }
  },
  {
    "id": 205,
    "name": {
      "english": "Forretress",
      "japanese": "フォレトス",
      "chinese": "佛烈托斯",
      "french": "Foretress"
    },
    "type": [
      "Bug",
      "Steel"
    ],
    "base": {
      "HP": 75,
      "Attack": 90,
      "Defense": 140,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 40
    }
  },
  {
    "id": 206,
    "name": {
      "english": "Dunsparce",
      "japanese": "ノコッチ",
      "chinese": "土龙弟弟",
      "french": "Insolourdo"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 100,
      "Attack": 70,
      "Defense": 70,
      "Sp. Attack": 65,
      "Sp. Defense": 65,
      "Speed": 45
    }
  },
  {
    "id": 207,
    "name": {
      "english": "Gligar",
      "japanese": "グライガー",
      "chinese": "天蝎",
      "french": "Scorplane"
    },
    "type": [
      "Ground",
      "Flying"
    ],
    "base": {
      "HP": 65,
      "Attack": 75,
      "Defense": 105,
      "Sp. Attack": 35,
      "Sp. Defense": 65,
      "Speed": 85
    }
  },
  {
    "id": 208,
    "name": {
      "english": "Steelix",
      "japanese": "ハガネール",
      "chinese": "大钢蛇",
      "french": "Steelix"
    },
    "type": [
      "Steel",
      "Ground"
    ],
    "base": {
      "HP": 75,
      "Attack": 85,
      "Defense": 200,
      "Sp. Attack": 55,
      "Sp. Defense": 65,
      "Speed": 30
    }
  },
  {
    "id": 209,
    "name": {
      "english": "Snubbull",
      "japanese": "ブルー",
      "chinese": "布鲁",
      "french": "Snubbull"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 60,
      "Attack": 80,
      "Defense": 50,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 30
    }
  },
  {
    "id": 210,
    "name": {
      "english": "Granbull",
      "japanese": "グランブル",
      "chinese": "布鲁皇",
      "french": "Granbull"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 90,
      "Attack": 120,
      "Defense": 75,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 45
    }
  },
  {
    "id": 211,
    "name": {
      "english": "Qwilfish",
      "japanese": "ハリーセン",
      "chinese": "千针鱼",
      "french": "Qwilfish"
    },
    "type": [
      "Water",
      "Poison"
    ],
    "base": {
      "HP": 65,
      "Attack": 95,
      "Defense": 85,
      "Sp. Attack": 55,
      "Sp. Defense": 55,
      "Speed": 85
    }
  },
  {
    "id": 212,
    "name": {
      "english": "Scizor",
      "japanese": "ハッサム",
      "chinese": "巨钳螳螂",
      "french": "Cizayox"
    },
    "type": [
      "Bug",
      "Steel"
    ],
    "base": {
      "HP": 70,
      "Attack": 130,
      "Defense": 100,
      "Sp. Attack": 55,
      "Sp. Defense": 80,
      "Speed": 65
    }
  },
  {
    "id": 213,
    "name": {
      "english": "Shuckle",
      "japanese": "ツボツボ",
      "chinese": "壶壶",
      "french": "Caratroc"
    },
    "type": [
      "Bug",
      "Rock"
    ],
    "base": {
      "HP": 20,
      "Attack": 10,
      "Defense": 230,
      "Sp. Attack": 10,
      "Sp. Defense": 230,
      "Speed": 5
    }
  },
  {
    "id": 214,
    "name": {
      "english": "Heracross",
      "japanese": "ヘラクロス",
      "chinese": "赫拉克罗斯",
      "french": "Scarhino"
    },
    "type": [
      "Bug",
      "Fighting"
    ],
    "base": {
      "HP": 80,
      "Attack": 125,
      "Defense": 75,
      "Sp. Attack": 40,
      "Sp. Defense": 95,
      "Speed": 85
    }
  },
  {
    "id": 215,
    "name": {
      "english": "Sneasel",
      "japanese": "ニューラ",
      "chinese": "狃拉",
      "french": "Farfuret"
    },
    "type": [
      "Dark",
      "Ice"
    ],
    "base": {
      "HP": 55,
      "Attack": 95,
      "Defense": 55,
      "Sp. Attack": 35,
      "Sp. Defense": 75,
      "Speed": 115
    }
  },
  {
    "id": 216,
    "name": {
      "english": "Teddiursa",
      "japanese": "ヒメグマ",
      "chinese": "熊宝宝",
      "french": "Teddiursa"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 60,
      "Attack": 80,
      "Defense": 50,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 40
    }
  },
  {
    "id": 217,
    "name": {
      "english": "Ursaring",
      "japanese": "リングマ",
      "chinese": "圈圈熊",
      "french": "Ursaring"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 90,
      "Attack": 130,
      "Defense": 75,
      "Sp. Attack": 75,
      "Sp. Defense": 75,
      "Speed": 55
    }
  },
  {
    "id": 218,
    "name": {
      "english": "Slugma",
      "japanese": "マグマッグ",
      "chinese": "熔岩虫",
      "french": "Limagma"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 40,
      "Attack": 40,
      "Defense": 40,
      "Sp. Attack": 70,
      "Sp. Defense": 40,
      "Speed": 20
    }
  },
  {
    "id": 219,
    "name": {
      "english": "Magcargo",
      "japanese": "マグカルゴ",
      "chinese": "熔岩蜗牛",
      "french": "Volcaropod"
    },
    "type": [
      "Fire",
      "Rock"
    ],
    "base": {
      "HP": 60,
      "Attack": 50,
      "Defense": 120,
      "Sp. Attack": 90,
      "Sp. Defense": 80,
      "Speed": 30
    }
  },
  {
    "id": 220,
    "name": {
      "english": "Swinub",
      "japanese": "ウリムー",
      "chinese": "小山猪",
      "french": "Marcacrin"
    },
    "type": [
      "Ice",
      "Ground"
    ],
    "base": {
      "HP": 50,
      "Attack": 50,
      "Defense": 40,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 50
    }
  },
  {
    "id": 221,
    "name": {
      "english": "Piloswine",
      "japanese": "イノムー",
      "chinese": "长毛猪",
      "french": "Cochignon"
    },
    "type": [
      "Ice",
      "Ground"
    ],
    "base": {
      "HP": 100,
      "Attack": 100,
      "Defense": 80,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 50
    }
  },
  {
    "id": 222,
    "name": {
      "english": "Corsola",
      "japanese": "サニーゴ",
      "chinese": "太阳珊瑚",
      "french": "Corayon"
    },
    "type": [
      "Water",
      "Rock"
    ],
    "base": {
      "HP": 65,
      "Attack": 55,
      "Defense": 95,
      "Sp. Attack": 65,
      "Sp. Defense": 95,
      "Speed": 35
    }
  },
  {
    "id": 223,
    "name": {
      "english": "Remoraid",
      "japanese": "テッポウオ",
      "chinese": "铁炮鱼",
      "french": "Rémoraid"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 35,
      "Attack": 65,
      "Defense": 35,
      "Sp. Attack": 65,
      "Sp. Defense": 35,
      "Speed": 65
    }
  },
  {
    "id": 224,
    "name": {
      "english": "Octillery",
      "japanese": "オクタン",
      "chinese": "章鱼桶",
      "french": "Octillery"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 75,
      "Attack": 105,
      "Defense": 75,
      "Sp. Attack": 105,
      "Sp. Defense": 75,
      "Speed": 45
    }
  },
  {
    "id": 225,
    "name": {
      "english": "Delibird",
      "japanese": "デリバード",
      "chinese": "信使鸟",
      "french": "Cadoizo"
    },
    "type": [
      "Ice",
      "Flying"
    ],
    "base": {
      "HP": 45,
      "Attack": 55,
      "Defense": 45,
      "Sp. Attack": 65,
      "Sp. Defense": 45,
      "Speed": 75
    }
  },
  {
    "id": 226,
    "name": {
      "english": "Mantine",
      "japanese": "マンタイン",
      "chinese": "巨翅飞鱼",
      "french": "Démanta"
    },
    "type": [
      "Water",
      "Flying"
    ],
    "base": {
      "HP": 85,
      "Attack": 40,
      "Defense": 70,
      "Sp. Attack": 80,
      "Sp. Defense": 140,
      "Speed": 70
    }
  },
  {
    "id": 227,
    "name": {
      "english": "Skarmory",
      "japanese": "エアームド",
      "chinese": "盔甲鸟",
      "french": "Airmure"
    },
    "type": [
      "Steel",
      "Flying"
    ],
    "base": {
      "HP": 65,
      "Attack": 80,
      "Defense": 140,
      "Sp. Attack": 40,
      "Sp. Defense": 70,
      "Speed": 70
    }
  },
  {
    "id": 228,
    "name": {
      "english": "Houndour",
      "japanese": "デルビル",
      "chinese": "戴鲁比",
      "french": "Malosse"
    },
    "type": [
      "Dark",
      "Fire"
    ],
    "base": {
      "HP": 45,
      "Attack": 60,
      "Defense": 30,
      "Sp. Attack": 80,
      "Sp. Defense": 50,
      "Speed": 65
    }
  },
  {
    "id": 229,
    "name": {
      "english": "Houndoom",
      "japanese": "ヘルガー",
      "chinese": "黑鲁加",
      "french": "Démolosse"
    },
    "type": [
      "Dark",
      "Fire"
    ],
    "base": {
      "HP": 75,
      "Attack": 90,
      "Defense": 50,
      "Sp. Attack": 110,
      "Sp. Defense": 80,
      "Speed": 95
    }
  },
  {
    "id": 230,
    "name": {
      "english": "Kingdra",
      "japanese": "キングドラ",
      "chinese": "刺龙王",
      "french": "Hyporoi"
    },
    "type": [
      "Water",
      "Dragon"
    ],
    "base": {
      "HP": 75,
      "Attack": 95,
      "Defense": 95,
      "Sp. Attack": 95,
      "Sp. Defense": 95,
      "Speed": 85
    }
  },
  {
    "id": 231,
    "name": {
      "english": "Phanpy",
      "japanese": "ゴマゾウ",
      "chinese": "小小象",
      "french": "Phanpy"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 90,
      "Attack": 60,
      "Defense": 60,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 40
    }
  },
  {
    "id": 232,
    "name": {
      "english": "Donphan",
      "japanese": "ドンファン",
      "chinese": "顿甲",
      "french": "Donphan"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 90,
      "Attack": 120,
      "Defense": 120,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 50
    }
  },
  {
    "id": 233,
    "name": {
      "english": "Porygon2",
      "japanese": "ポリゴン２",
      "chinese": "多边兽Ⅱ",
      "french": "Porygon2"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 85,
      "Attack": 80,
      "Defense": 90,
      "Sp. Attack": 105,
      "Sp. Defense": 95,
      "Speed": 60
    }
  },
  {
    "id": 234,
    "name": {
      "english": "Stantler",
      "japanese": "オドシシ",
      "chinese": "惊角鹿",
      "french": "Cerfrousse"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 73,
      "Attack": 95,
      "Defense": 62,
      "Sp. Attack": 85,
      "Sp. Defense": 65,
      "Speed": 85
    }
  },
  {
    "id": 235,
    "name": {
      "english": "Smeargle",
      "japanese": "ドーブル",
      "chinese": "图图犬",
      "french": "Queulorior"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 55,
      "Attack": 20,
      "Defense": 35,
      "Sp. Attack": 20,
      "Sp. Defense": 45,
      "Speed": 75
    }
  },
  {
    "id": 236,
    "name": {
      "english": "Tyrogue",
      "japanese": "バルキー",
      "chinese": "无畏小子",
      "french": "Debugant"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 35,
      "Attack": 35,
      "Defense": 35,
      "Sp. Attack": 35,
      "Sp. Defense": 35,
      "Speed": 35
    }
  },
  {
    "id": 237,
    "name": {
      "english": "Hitmontop",
      "japanese": "カポエラー",
      "chinese": "战舞郎",
      "french": "Kapoera"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 50,
      "Attack": 95,
      "Defense": 95,
      "Sp. Attack": 35,
      "Sp. Defense": 110,
      "Speed": 70
    }
  },
  {
    "id": 238,
    "name": {
      "english": "Smoochum",
      "japanese": "ムチュール",
      "chinese": "迷唇娃",
      "french": "Lippouti"
    },
    "type": [
      "Ice",
      "Psychic"
    ],
    "base": {
      "HP": 45,
      "Attack": 30,
      "Defense": 15,
      "Sp. Attack": 85,
      "Sp. Defense": 65,
      "Speed": 65
    }
  },
  {
    "id": 239,
    "name": {
      "english": "Elekid",
      "japanese": "エレキッド",
      "chinese": "电击怪",
      "french": "Élekid"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 45,
      "Attack": 63,
      "Defense": 37,
      "Sp. Attack": 65,
      "Sp. Defense": 55,
      "Speed": 95
    }
  },
  {
    "id": 240,
    "name": {
      "english": "Magby",
      "japanese": "ブビィ",
      "chinese": "鸭嘴宝宝",
      "french": "Magby"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 45,
      "Attack": 75,
      "Defense": 37,
      "Sp. Attack": 70,
      "Sp. Defense": 55,
      "Speed": 83
    }
  },
  {
    "id": 241,
    "name": {
      "english": "Miltank",
      "japanese": "ミルタンク",
      "chinese": "大奶罐",
      "french": "Écrémeuh"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 95,
      "Attack": 80,
      "Defense": 105,
      "Sp. Attack": 40,
      "Sp. Defense": 70,
      "Speed": 100
    }
  },
  {
    "id": 242,
    "name": {
      "english": "Blissey",
      "japanese": "ハピナス",
      "chinese": "幸福蛋",
      "french": "Leuphorie"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 255,
      "Attack": 10,
      "Defense": 10,
      "Sp. Attack": 75,
      "Sp. Defense": 135,
      "Speed": 55
    }
  },
  {
    "id": 243,
    "name": {
      "english": "Raikou",
      "japanese": "ライコウ",
      "chinese": "雷公",
      "french": "Raikou"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 90,
      "Attack": 85,
      "Defense": 75,
      "Sp. Attack": 115,
      "Sp. Defense": 100,
      "Speed": 115
    }
  },
  {
    "id": 244,
    "name": {
      "english": "Entei",
      "japanese": "エンテイ",
      "chinese": "炎帝",
      "french": "Entei"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 115,
      "Attack": 115,
      "Defense": 85,
      "Sp. Attack": 90,
      "Sp. Defense": 75,
      "Speed": 100
    }
  },
  {
    "id": 245,
    "name": {
      "english": "Suicune",
      "japanese": "スイクン",
      "chinese": "水君",
      "french": "Suicune"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 100,
      "Attack": 75,
      "Defense": 115,
      "Sp. Attack": 90,
      "Sp. Defense": 115,
      "Speed": 85
    }
  },
  {
    "id": 246,
    "name": {
      "english": "Larvitar",
      "japanese": "ヨーギラス",
      "chinese": "幼基拉斯",
      "french": "Embrylex"
    },
    "type": [
      "Rock",
      "Ground"
    ],
    "base": {
      "HP": 50,
      "Attack": 64,
      "Defense": 50,
      "Sp. Attack": 45,
      "Sp. Defense": 50,
      "Speed": 41
    }
  },
  {
    "id": 247,
    "name": {
      "english": "Pupitar",
      "japanese": "サナギラス",
      "chinese": "沙基拉斯",
      "french": "Ymphect"
    },
    "type": [
      "Rock",
      "Ground"
    ],
    "base": {
      "HP": 70,
      "Attack": 84,
      "Defense": 70,
      "Sp. Attack": 65,
      "Sp. Defense": 70,
      "Speed": 51
    }
  },
  {
    "id": 248,
    "name": {
      "english": "Tyranitar",
      "japanese": "バンギラス",
      "chinese": "班基拉斯",
      "french": "Tyranocif"
    },
    "type": [
      "Rock",
      "Dark"
    ],
    "base": {
      "HP": 100,
      "Attack": 134,
      "Defense": 110,
      "Sp. Attack": 95,
      "Sp. Defense": 100,
      "Speed": 61
    }
  },
  {
    "id": 249,
    "name": {
      "english": "Lugia",
      "japanese": "ルギア",
      "chinese": "洛奇亚",
      "french": "Lugia"
    },
    "type": [
      "Psychic",
      "Flying"
    ],
    "base": {
      "HP": 106,
      "Attack": 90,
      "Defense": 130,
      "Sp. Attack": 90,
      "Sp. Defense": 154,
      "Speed": 110
    }
  },
  {
    "id": 250,
    "name": {
      "english": "Ho-Oh",
      "japanese": "ホウオウ",
      "chinese": "凤王",
      "french": "Ho-Oh"
    },
    "type": [
      "Fire",
      "Flying"
    ],
    "base": {
      "HP": 106,
      "Attack": 130,
      "Defense": 90,
      "Sp. Attack": 110,
      "Sp. Defense": 154,
      "Speed": 90
    }
  },
  {
    "id": 251,
    "name": {
      "english": "Celebi",
      "japanese": "セレビィ",
      "chinese": "时拉比",
      "french": "Celebi"
    },
    "type": [
      "Psychic",
      "Grass"
    ],
    "base": {
      "HP": 100,
      "Attack": 100,
      "Defense": 100,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      "Speed": 100
    }
  },
  {
    "id": 252,
    "name": {
      "english": "Treecko",
      "japanese": "キモリ",
      "chinese": "木守宫",
      "french": "Arcko"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 40,
      "Attack": 45,
      "Defense": 35,
      "Sp. Attack": 65,
      "Sp. Defense": 55,
      "Speed": 70
    }
  },
  {
    "id": 253,
    "name": {
      "english": "Grovyle",
      "japanese": "ジュプトル",
      "chinese": "森林蜥蜴",
      "french": "Massko"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 50,
      "Attack": 65,
      "Defense": 45,
      "Sp. Attack": 85,
      "Sp. Defense": 65,
      "Speed": 95
    }
  },
  {
    "id": 254,
    "name": {
      "english": "Sceptile",
      "japanese": "ジュカイン",
      "chinese": "蜥蜴王",
      "french": "Jungko"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 70,
      "Attack": 85,
      "Defense": 65,
      "Sp. Attack": 105,
      "Sp. Defense": 85,
      "Speed": 120
    }
  },
  {
    "id": 255,
    "name": {
      "english": "Torchic",
      "japanese": "アチャモ",
      "chinese": "火稚鸡",
      "french": "Poussifeu"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 45,
      "Attack": 60,
      "Defense": 40,
      "Sp. Attack": 70,
      "Sp. Defense": 50,
      "Speed": 45
    }
  },
  {
    "id": 256,
    "name": {
      "english": "Combusken",
      "japanese": "ワカシャモ",
      "chinese": "力壮鸡",
      "french": "Galifeu"
    },
    "type": [
      "Fire",
      "Fighting"
    ],
    "base": {
      "HP": 60,
      "Attack": 85,
      "Defense": 60,
      "Sp. Attack": 85,
      "Sp. Defense": 60,
      "Speed": 55
    }
  },
  {
    "id": 257,
    "name": {
      "english": "Blaziken",
      "japanese": "バシャーモ",
      "chinese": "火焰鸡",
      "french": "Braségali"
    },
    "type": [
      "Fire",
      "Fighting"
    ],
    "base": {
      "HP": 80,
      "Attack": 120,
      "Defense": 70,
      "Sp. Attack": 110,
      "Sp. Defense": 70,
      "Speed": 80
    }
  },
  {
    "id": 258,
    "name": {
      "english": "Mudkip",
      "japanese": "ミズゴロウ",
      "chinese": "水跃鱼",
      "french": "Gobou"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 50,
      "Attack": 70,
      "Defense": 50,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 40
    }
  },
  {
    "id": 259,
    "name": {
      "english": "Marshtomp",
      "japanese": "ヌマクロー",
      "chinese": "沼跃鱼",
      "french": "Flobio"
    },
    "type": [
      "Water",
      "Ground"
    ],
    "base": {
      "HP": 70,
      "Attack": 85,
      "Defense": 70,
      "Sp. Attack": 60,
      "Sp. Defense": 70,
      "Speed": 50
    }
  },
  {
    "id": 260,
    "name": {
      "english": "Swampert",
      "japanese": "ラグラージ",
      "chinese": "巨沼怪",
      "french": "Laggron"
    },
    "type": [
      "Water",
      "Ground"
    ],
    "base": {
      "HP": 100,
      "Attack": 110,
      "Defense": 90,
      "Sp. Attack": 85,
      "Sp. Defense": 90,
      "Speed": 60
    }
  },
  {
    "id": 261,
    "name": {
      "english": "Poochyena",
      "japanese": "ポチエナ",
      "chinese": "土狼犬",
      "french": "Medhyèna"
    },
    "type": [
      "Dark"
    ],
    "base": {
      "HP": 35,
      "Attack": 55,
      "Defense": 35,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 35
    }
  },
  {
    "id": 262,
    "name": {
      "english": "Mightyena",
      "japanese": "グラエナ",
      "chinese": "大狼犬",
      "french": "Grahyèna"
    },
    "type": [
      "Dark"
    ],
    "base": {
      "HP": 70,
      "Attack": 90,
      "Defense": 70,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 70
    }
  },
  {
    "id": 263,
    "name": {
      "english": "Zigzagoon",
      "japanese": "ジグザグマ",
      "chinese": "蛇纹熊",
      "french": "Zigzaton"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 38,
      "Attack": 30,
      "Defense": 41,
      "Sp. Attack": 30,
      "Sp. Defense": 41,
      "Speed": 60
    }
  },
  {
    "id": 264,
    "name": {
      "english": "Linoone",
      "japanese": "マッスグマ",
      "chinese": "直冲熊",
      "french": "Linéon"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 78,
      "Attack": 70,
      "Defense": 61,
      "Sp. Attack": 50,
      "Sp. Defense": 61,
      "Speed": 100
    }
  },
  {
    "id": 265,
    "name": {
      "english": "Wurmple",
      "japanese": "ケムッソ",
      "chinese": "刺尾虫",
      "french": "Chenipotte"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 45,
      "Attack": 45,
      "Defense": 35,
      "Sp. Attack": 20,
      "Sp. Defense": 30,
      "Speed": 20
    }
  },
  {
    "id": 266,
    "name": {
      "english": "Silcoon",
      "japanese": "カラサリス",
      "chinese": "甲壳茧",
      "french": "Armulys"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 50,
      "Attack": 35,
      "Defense": 55,
      "Sp. Attack": 25,
      "Sp. Defense": 25,
      "Speed": 15
    }
  },
  {
    "id": 267,
    "name": {
      "english": "Beautifly",
      "japanese": "アゲハント",
      "chinese": "狩猎凤蝶",
      "french": "Charmillon"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 60,
      "Attack": 70,
      "Defense": 50,
      "Sp. Attack": 100,
      "Sp. Defense": 50,
      "Speed": 65
    }
  },
  {
    "id": 268,
    "name": {
      "english": "Cascoon",
      "japanese": "マユルド",
      "chinese": "盾甲茧",
      "french": "Blindalys"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 50,
      "Attack": 35,
      "Defense": 55,
      "Sp. Attack": 25,
      "Sp. Defense": 25,
      "Speed": 15
    }
  },
  {
    "id": 269,
    "name": {
      "english": "Dustox",
      "japanese": "ドクケイル",
      "chinese": "毒粉蛾",
      "french": "Papinox"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 60,
      "Attack": 50,
      "Defense": 70,
      "Sp. Attack": 50,
      "Sp. Defense": 90,
      "Speed": 65
    }
  },
  {
    "id": 270,
    "name": {
      "english": "Lotad",
      "japanese": "ハスボー",
      "chinese": "莲叶童子",
      "french": "Nénupiot"
    },
    "type": [
      "Water",
      "Grass"
    ],
    "base": {
      "HP": 40,
      "Attack": 30,
      "Defense": 30,
      "Sp. Attack": 40,
      "Sp. Defense": 50,
      "Speed": 30
    }
  },
  {
    "id": 271,
    "name": {
      "english": "Lombre",
      "japanese": "ハスブレロ",
      "chinese": "莲帽小童",
      "french": "Lombre"
    },
    "type": [
      "Water",
      "Grass"
    ],
    "base": {
      "HP": 60,
      "Attack": 50,
      "Defense": 50,
      "Sp. Attack": 60,
      "Sp. Defense": 70,
      "Speed": 50
    }
  },
  {
    "id": 272,
    "name": {
      "english": "Ludicolo",
      "japanese": "ルンパッパ",
      "chinese": "乐天河童",
      "french": "Ludicolo"
    },
    "type": [
      "Water",
      "Grass"
    ],
    "base": {
      "HP": 80,
      "Attack": 70,
      "Defense": 70,
      "Sp. Attack": 90,
      "Sp. Defense": 100,
      "Speed": 70
    }
  },
  {
    "id": 273,
    "name": {
      "english": "Seedot",
      "japanese": "タネボー",
      "chinese": "橡实果",
      "french": "Grainipiot"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 40,
      "Attack": 40,
      "Defense": 50,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 30
    }
  },
  {
    "id": 274,
    "name": {
      "english": "Nuzleaf",
      "japanese": "コノハナ",
      "chinese": "长鼻叶",
      "french": "Pifeuil"
    },
    "type": [
      "Grass",
      "Dark"
    ],
    "base": {
      "HP": 70,
      "Attack": 70,
      "Defense": 40,
      "Sp. Attack": 60,
      "Sp. Defense": 40,
      "Speed": 60
    }
  },
  {
    "id": 275,
    "name": {
      "english": "Shiftry",
      "japanese": "ダーテング",
      "chinese": "狡猾天狗",
      "french": "Tengalice"
    },
    "type": [
      "Grass",
      "Dark"
    ],
    "base": {
      "HP": 90,
      "Attack": 100,
      "Defense": 60,
      "Sp. Attack": 90,
      "Sp. Defense": 60,
      "Speed": 80
    }
  },
  {
    "id": 276,
    "name": {
      "english": "Taillow",
      "japanese": "スバメ",
      "chinese": "傲骨燕",
      "french": "Nirondelle"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 40,
      "Attack": 55,
      "Defense": 30,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 85
    }
  },
  {
    "id": 277,
    "name": {
      "english": "Swellow",
      "japanese": "オオスバメ",
      "chinese": "大王燕",
      "french": "Hélédelle"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 60,
      "Attack": 85,
      "Defense": 60,
      "Sp. Attack": 75,
      "Sp. Defense": 50,
      "Speed": 125
    }
  },
  {
    "id": 278,
    "name": {
      "english": "Wingull",
      "japanese": "キャモメ",
      "chinese": "长翅鸥",
      "french": "Goélise"
    },
    "type": [
      "Water",
      "Flying"
    ],
    "base": {
      "HP": 40,
      "Attack": 30,
      "Defense": 30,
      "Sp. Attack": 55,
      "Sp. Defense": 30,
      "Speed": 85
    }
  },
  {
    "id": 279,
    "name": {
      "english": "Pelipper",
      "japanese": "ペリッパー",
      "chinese": "大嘴鸥",
      "french": "Bekipan"
    },
    "type": [
      "Water",
      "Flying"
    ],
    "base": {
      "HP": 60,
      "Attack": 50,
      "Defense": 100,
      "Sp. Attack": 95,
      "Sp. Defense": 70,
      "Speed": 65
    }
  },
  {
    "id": 280,
    "name": {
      "english": "Ralts",
      "japanese": "ラルトス",
      "chinese": "拉鲁拉丝",
      "french": "Tarsal"
    },
    "type": [
      "Psychic",
      "Fairy"
    ],
    "base": {
      "HP": 28,
      "Attack": 25,
      "Defense": 25,
      "Sp. Attack": 45,
      "Sp. Defense": 35,
      "Speed": 40
    }
  },
  {
    "id": 281,
    "name": {
      "english": "Kirlia",
      "japanese": "キルリア",
      "chinese": "奇鲁莉安",
      "french": "Kirlia"
    },
    "type": [
      "Psychic",
      "Fairy"
    ],
    "base": {
      "HP": 38,
      "Attack": 35,
      "Defense": 35,
      "Sp. Attack": 65,
      "Sp. Defense": 55,
      "Speed": 50
    }
  },
  {
    "id": 282,
    "name": {
      "english": "Gardevoir",
      "japanese": "サーナイト",
      "chinese": "沙奈朵",
      "french": "Gardevoir"
    },
    "type": [
      "Psychic",
      "Fairy"
    ],
    "base": {
      "HP": 68,
      "Attack": 65,
      "Defense": 65,
      "Sp. Attack": 125,
      "Sp. Defense": 115,
      "Speed": 80
    }
  },
  {
    "id": 283,
    "name": {
      "english": "Surskit",
      "japanese": "アメタマ",
      "chinese": "溜溜糖球",
      "french": "Arakdo"
    },
    "type": [
      "Bug",
      "Water"
    ],
    "base": {
      "HP": 40,
      "Attack": 30,
      "Defense": 32,
      "Sp. Attack": 50,
      "Sp. Defense": 52,
      "Speed": 65
    }
  },
  {
    "id": 284,
    "name": {
      "english": "Masquerain",
      "japanese": "アメモース",
      "chinese": "雨翅蛾",
      "french": "Maskadra"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 70,
      "Attack": 60,
      "Defense": 62,
      "Sp. Attack": 100,
      "Sp. Defense": 82,
      "Speed": 80
    }
  },
  {
    "id": 285,
    "name": {
      "english": "Shroomish",
      "japanese": "キノココ",
      "chinese": "蘑蘑菇",
      "french": "Balignon"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 60,
      "Attack": 40,
      "Defense": 60,
      "Sp. Attack": 40,
      "Sp. Defense": 60,
      "Speed": 35
    }
  },
  {
    "id": 286,
    "name": {
      "english": "Breloom",
      "japanese": "キノガッサ",
      "chinese": "斗笠菇",
      "french": "Chapignon"
    },
    "type": [
      "Grass",
      "Fighting"
    ],
    "base": {
      "HP": 60,
      "Attack": 130,
      "Defense": 80,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 70
    }
  },
  {
    "id": 287,
    "name": {
      "english": "Slakoth",
      "japanese": "ナマケロ",
      "chinese": "懒人獭",
      "french": "Parecool"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 60,
      "Attack": 60,
      "Defense": 60,
      "Sp. Attack": 35,
      "Sp. Defense": 35,
      "Speed": 30
    }
  },
  {
    "id": 288,
    "name": {
      "english": "Vigoroth",
      "japanese": "ヤルキモノ",
      "chinese": "过动猿",
      "french": "Vigoroth"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 80,
      "Attack": 80,
      "Defense": 80,
      "Sp. Attack": 55,
      "Sp. Defense": 55,
      "Speed": 90
    }
  },
  {
    "id": 289,
    "name": {
      "english": "Slaking",
      "japanese": "ケッキング",
      "chinese": "请假王",
      "french": "Monaflèmit"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 150,
      "Attack": 160,
      "Defense": 100,
      "Sp. Attack": 95,
      "Sp. Defense": 65,
      "Speed": 100
    }
  },
  {
    "id": 290,
    "name": {
      "english": "Nincada",
      "japanese": "ツチニン",
      "chinese": "土居忍士",
      "french": "Ningale"
    },
    "type": [
      "Bug",
      "Ground"
    ],
    "base": {
      "HP": 31,
      "Attack": 45,
      "Defense": 90,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 40
    }
  },
  {
    "id": 291,
    "name": {
      "english": "Ninjask",
      "japanese": "テッカニン",
      "chinese": "铁面忍者",
      "french": "Ninjask"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 61,
      "Attack": 90,
      "Defense": 45,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 160
    }
  },
  {
    "id": 292,
    "name": {
      "english": "Shedinja",
      "japanese": "ヌケニン",
      "chinese": "脱壳忍者",
      "french": "Munja"
    },
    "type": [
      "Bug",
      "Ghost"
    ],
    "base": {
      "HP": 1,
      "Attack": 90,
      "Defense": 45,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 40
    }
  },
  {
    "id": 293,
    "name": {
      "english": "Whismur",
      "japanese": "ゴニョニョ",
      "chinese": "咕妞妞",
      "french": "Chuchmur"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 64,
      "Attack": 51,
      "Defense": 23,
      "Sp. Attack": 51,
      "Sp. Defense": 23,
      "Speed": 28
    }
  },
  {
    "id": 294,
    "name": {
      "english": "Loudred",
      "japanese": "ドゴーム",
      "chinese": "吼爆弹",
      "french": "Ramboum"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 84,
      "Attack": 71,
      "Defense": 43,
      "Sp. Attack": 71,
      "Sp. Defense": 43,
      "Speed": 48
    }
  },
  {
    "id": 295,
    "name": {
      "english": "Exploud",
      "japanese": "バクオング",
      "chinese": "爆音怪",
      "french": "Brouhabam"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 104,
      "Attack": 91,
      "Defense": 63,
      "Sp. Attack": 91,
      "Sp. Defense": 73,
      "Speed": 68
    }
  },
  {
    "id": 296,
    "name": {
      "english": "Makuhita",
      "japanese": "マクノシタ",
      "chinese": "幕下力士",
      "french": "Makuhita"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 72,
      "Attack": 60,
      "Defense": 30,
      "Sp. Attack": 20,
      "Sp. Defense": 30,
      "Speed": 25
    }
  },
  {
    "id": 297,
    "name": {
      "english": "Hariyama",
      "japanese": "ハリテヤマ",
      "chinese": "铁掌力士",
      "french": "Hariyama"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 144,
      "Attack": 120,
      "Defense": 60,
      "Sp. Attack": 40,
      "Sp. Defense": 60,
      "Speed": 50
    }
  },
  {
    "id": 298,
    "name": {
      "english": "Azurill",
      "japanese": "ルリリ",
      "chinese": "露力丽",
      "french": "Azurill"
    },
    "type": [
      "Normal",
      "Fairy"
    ],
    "base": {
      "HP": 50,
      "Attack": 20,
      "Defense": 40,
      "Sp. Attack": 20,
      "Sp. Defense": 40,
      "Speed": 20
    }
  },
  {
    "id": 299,
    "name": {
      "english": "Nosepass",
      "japanese": "ノズパス",
      "chinese": "朝北鼻",
      "french": "Tarinor"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 30,
      "Attack": 45,
      "Defense": 135,
      "Sp. Attack": 45,
      "Sp. Defense": 90,
      "Speed": 30
    }
  },
  {
    "id": 300,
    "name": {
      "english": "Skitty",
      "japanese": "エネコ",
      "chinese": "向尾喵",
      "french": "Skitty"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 50,
      "Attack": 45,
      "Defense": 45,
      "Sp. Attack": 35,
      "Sp. Defense": 35,
      "Speed": 50
    }
  },
  {
    "id": 301,
    "name": {
      "english": "Delcatty",
      "japanese": "エネコロロ",
      "chinese": "优雅猫",
      "french": "Delcatty"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 70,
      "Attack": 65,
      "Defense": 65,
      "Sp. Attack": 55,
      "Sp. Defense": 55,
      "Speed": 90
    }
  },
  {
    "id": 302,
    "name": {
      "english": "Sableye",
      "japanese": "ヤミラミ",
      "chinese": "勾魂眼",
      "french": "Ténéfix"
    },
    "type": [
      "Dark",
      "Ghost"
    ],
    "base": {
      "HP": 50,
      "Attack": 75,
      "Defense": 75,
      "Sp. Attack": 65,
      "Sp. Defense": 65,
      "Speed": 50
    }
  },
  {
    "id": 303,
    "name": {
      "english": "Mawile",
      "japanese": "クチート",
      "chinese": "大嘴娃",
      "french": "Mysdibule"
    },
    "type": [
      "Steel",
      "Fairy"
    ],
    "base": {
      "HP": 50,
      "Attack": 85,
      "Defense": 85,
      "Sp. Attack": 55,
      "Sp. Defense": 55,
      "Speed": 50
    }
  },
  {
    "id": 304,
    "name": {
      "english": "Aron",
      "japanese": "ココドラ",
      "chinese": "可可多拉",
      "french": "Galekid"
    },
    "type": [
      "Steel",
      "Rock"
    ],
    "base": {
      "HP": 50,
      "Attack": 70,
      "Defense": 100,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 30
    }
  },
  {
    "id": 305,
    "name": {
      "english": "Lairon",
      "japanese": "コドラ",
      "chinese": "可多拉",
      "french": "Galegon"
    },
    "type": [
      "Steel",
      "Rock"
    ],
    "base": {
      "HP": 60,
      "Attack": 90,
      "Defense": 140,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 40
    }
  },
  {
    "id": 306,
    "name": {
      "english": "Aggron",
      "japanese": "ボスゴドラ",
      "chinese": "波士可多拉",
      "french": "Galeking"
    },
    "type": [
      "Steel",
      "Rock"
    ],
    "base": {
      "HP": 70,
      "Attack": 110,
      "Defense": 180,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 50
    }
  },
  {
    "id": 307,
    "name": {
      "english": "Meditite",
      "japanese": "アサナン",
      "chinese": "玛沙那",
      "french": "Méditikka"
    },
    "type": [
      "Fighting",
      "Psychic"
    ],
    "base": {
      "HP": 30,
      "Attack": 40,
      "Defense": 55,
      "Sp. Attack": 40,
      "Sp. Defense": 55,
      "Speed": 60
    }
  },
  {
    "id": 308,
    "name": {
      "english": "Medicham",
      "japanese": "チャーレム",
      "chinese": "恰雷姆",
      "french": "Charmina"
    },
    "type": [
      "Fighting",
      "Psychic"
    ],
    "base": {
      "HP": 60,
      "Attack": 60,
      "Defense": 75,
      "Sp. Attack": 60,
      "Sp. Defense": 75,
      "Speed": 80
    }
  },
  {
    "id": 309,
    "name": {
      "english": "Electrike",
      "japanese": "ラクライ",
      "chinese": "落雷兽",
      "french": "Dynavolt"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 40,
      "Attack": 45,
      "Defense": 40,
      "Sp. Attack": 65,
      "Sp. Defense": 40,
      "Speed": 65
    }
  },
  {
    "id": 310,
    "name": {
      "english": "Manectric",
      "japanese": "ライボルト",
      "chinese": "雷电兽",
      "french": "Élecsprint"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 70,
      "Attack": 75,
      "Defense": 60,
      "Sp. Attack": 105,
      "Sp. Defense": 60,
      "Speed": 105
    }
  },
  {
    "id": 311,
    "name": {
      "english": "Plusle",
      "japanese": "プラスル",
      "chinese": "正电拍拍",
      "french": "Posipi"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 60,
      "Attack": 50,
      "Defense": 40,
      "Sp. Attack": 85,
      "Sp. Defense": 75,
      "Speed": 95
    }
  },
  {
    "id": 312,
    "name": {
      "english": "Minun",
      "japanese": "マイナン",
      "chinese": "负电拍拍",
      "french": "Négapi"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 60,
      "Attack": 40,
      "Defense": 50,
      "Sp. Attack": 75,
      "Sp. Defense": 85,
      "Speed": 95
    }
  },
  {
    "id": 313,
    "name": {
      "english": "Volbeat",
      "japanese": "バルビート",
      "chinese": "电萤虫",
      "french": "Muciole"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 65,
      "Attack": 73,
      "Defense": 75,
      "Sp. Attack": 47,
      "Sp. Defense": 85,
      "Speed": 85
    }
  },
  {
    "id": 314,
    "name": {
      "english": "Illumise",
      "japanese": "イルミーゼ",
      "chinese": "甜甜萤",
      "french": "Lumivole"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 65,
      "Attack": 47,
      "Defense": 75,
      "Sp. Attack": 73,
      "Sp. Defense": 85,
      "Speed": 85
    }
  },
  {
    "id": 315,
    "name": {
      "english": "Roselia",
      "japanese": "ロゼリア",
      "chinese": "毒蔷薇",
      "french": "Rosélia"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 50,
      "Attack": 60,
      "Defense": 45,
      "Sp. Attack": 100,
      "Sp. Defense": 80,
      "Speed": 65
    }
  },
  {
    "id": 316,
    "name": {
      "english": "Gulpin",
      "japanese": "ゴクリン",
      "chinese": "溶食兽",
      "french": "Gloupti"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 70,
      "Attack": 43,
      "Defense": 53,
      "Sp. Attack": 43,
      "Sp. Defense": 53,
      "Speed": 40
    }
  },
  {
    "id": 317,
    "name": {
      "english": "Swalot",
      "japanese": "マルノーム",
      "chinese": "吞食兽",
      "french": "Avaltout"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 100,
      "Attack": 73,
      "Defense": 83,
      "Sp. Attack": 73,
      "Sp. Defense": 83,
      "Speed": 55
    }
  },
  {
    "id": 318,
    "name": {
      "english": "Carvanha",
      "japanese": "キバニア",
      "chinese": "利牙鱼",
      "french": "Carvanha"
    },
    "type": [
      "Water",
      "Dark"
    ],
    "base": {
      "HP": 45,
      "Attack": 90,
      "Defense": 20,
      "Sp. Attack": 65,
      "Sp. Defense": 20,
      "Speed": 65
    }
  },
  {
    "id": 319,
    "name": {
      "english": "Sharpedo",
      "japanese": "サメハダー",
      "chinese": "巨牙鲨",
      "french": "Sharpedo"
    },
    "type": [
      "Water",
      "Dark"
    ],
    "base": {
      "HP": 70,
      "Attack": 120,
      "Defense": 40,
      "Sp. Attack": 95,
      "Sp. Defense": 40,
      "Speed": 95
    }
  },
  {
    "id": 320,
    "name": {
      "english": "Wailmer",
      "japanese": "ホエルコ",
      "chinese": "吼吼鲸",
      "french": "Wailmer"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 130,
      "Attack": 70,
      "Defense": 35,
      "Sp. Attack": 70,
      "Sp. Defense": 35,
      "Speed": 60
    }
  },
  {
    "id": 321,
    "name": {
      "english": "Wailord",
      "japanese": "ホエルオー",
      "chinese": "吼鲸王",
      "french": "Wailord"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 170,
      "Attack": 90,
      "Defense": 45,
      "Sp. Attack": 90,
      "Sp. Defense": 45,
      "Speed": 60
    }
  },
  {
    "id": 322,
    "name": {
      "english": "Numel",
      "japanese": "ドンメル",
      "chinese": "呆火驼",
      "french": "Chamallot"
    },
    "type": [
      "Fire",
      "Ground"
    ],
    "base": {
      "HP": 60,
      "Attack": 60,
      "Defense": 40,
      "Sp. Attack": 65,
      "Sp. Defense": 45,
      "Speed": 35
    }
  },
  {
    "id": 323,
    "name": {
      "english": "Camerupt",
      "japanese": "バクーダ",
      "chinese": "喷火驼",
      "french": "Camérupt"
    },
    "type": [
      "Fire",
      "Ground"
    ],
    "base": {
      "HP": 70,
      "Attack": 100,
      "Defense": 70,
      "Sp. Attack": 105,
      "Sp. Defense": 75,
      "Speed": 40
    }
  },
  {
    "id": 324,
    "name": {
      "english": "Torkoal",
      "japanese": "コータス",
      "chinese": "煤炭龟",
      "french": "Chartor"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 70,
      "Attack": 85,
      "Defense": 140,
      "Sp. Attack": 85,
      "Sp. Defense": 70,
      "Speed": 20
    }
  },
  {
    "id": 325,
    "name": {
      "english": "Spoink",
      "japanese": "バネブー",
      "chinese": "跳跳猪",
      "french": "Spoink"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 60,
      "Attack": 25,
      "Defense": 35,
      "Sp. Attack": 70,
      "Sp. Defense": 80,
      "Speed": 60
    }
  },
  {
    "id": 326,
    "name": {
      "english": "Grumpig",
      "japanese": "ブーピッグ",
      "chinese": "噗噗猪",
      "french": "Groret"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 80,
      "Attack": 45,
      "Defense": 65,
      "Sp. Attack": 90,
      "Sp. Defense": 110,
      "Speed": 80
    }
  },
  {
    "id": 327,
    "name": {
      "english": "Spinda",
      "japanese": "パッチール",
      "chinese": "晃晃斑",
      "french": "Spinda"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 60,
      "Attack": 60,
      "Defense": 60,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 60
    }
  },
  {
    "id": 328,
    "name": {
      "english": "Trapinch",
      "japanese": "ナックラー",
      "chinese": "大颚蚁",
      "french": "Kraknoix"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 45,
      "Attack": 100,
      "Defense": 45,
      "Sp. Attack": 45,
      "Sp. Defense": 45,
      "Speed": 10
    }
  },
  {
    "id": 329,
    "name": {
      "english": "Vibrava",
      "japanese": "ビブラーバ",
      "chinese": "超音波幼虫",
      "french": "Vibraninf"
    },
    "type": [
      "Ground",
      "Dragon"
    ],
    "base": {
      "HP": 50,
      "Attack": 70,
      "Defense": 50,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 70
    }
  },
  {
    "id": 330,
    "name": {
      "english": "Flygon",
      "japanese": "フライゴン",
      "chinese": "沙漠蜻蜓",
      "french": "Libégon"
    },
    "type": [
      "Ground",
      "Dragon"
    ],
    "base": {
      "HP": 80,
      "Attack": 100,
      "Defense": 80,
      "Sp. Attack": 80,
      "Sp. Defense": 80,
      "Speed": 100
    }
  },
  {
    "id": 331,
    "name": {
      "english": "Cacnea",
      "japanese": "サボネア",
      "chinese": "刺球仙人掌",
      "french": "Cacnea"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 50,
      "Attack": 85,
      "Defense": 40,
      "Sp. Attack": 85,
      "Sp. Defense": 40,
      "Speed": 35
    }
  },
  {
    "id": 332,
    "name": {
      "english": "Cacturne",
      "japanese": "ノクタス",
      "chinese": "梦歌仙人掌",
      "french": "Cacturne"
    },
    "type": [
      "Grass",
      "Dark"
    ],
    "base": {
      "HP": 70,
      "Attack": 115,
      "Defense": 60,
      "Sp. Attack": 115,
      "Sp. Defense": 60,
      "Speed": 55
    }
  },
  {
    "id": 333,
    "name": {
      "english": "Swablu",
      "japanese": "チルット",
      "chinese": "青绵鸟",
      "french": "Tylton"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 45,
      "Attack": 40,
      "Defense": 60,
      "Sp. Attack": 40,
      "Sp. Defense": 75,
      "Speed": 50
    }
  },
  {
    "id": 334,
    "name": {
      "english": "Altaria",
      "japanese": "チルタリス",
      "chinese": "七夕青鸟",
      "french": "Altaria"
    },
    "type": [
      "Dragon",
      "Flying"
    ],
    "base": {
      "HP": 75,
      "Attack": 70,
      "Defense": 90,
      "Sp. Attack": 70,
      "Sp. Defense": 105,
      "Speed": 80
    }
  },
  {
    "id": 335,
    "name": {
      "english": "Zangoose",
      "japanese": "ザングース",
      "chinese": "猫鼬斩",
      "french": "Mangriff"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 73,
      "Attack": 115,
      "Defense": 60,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 90
    }
  },
  {
    "id": 336,
    "name": {
      "english": "Seviper",
      "japanese": "ハブネーク",
      "chinese": "饭匙蛇",
      "french": "Séviper"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 73,
      "Attack": 100,
      "Defense": 60,
      "Sp. Attack": 100,
      "Sp. Defense": 60,
      "Speed": 65
    }
  },
  {
    "id": 337,
    "name": {
      "english": "Lunatone",
      "japanese": "ルナトーン",
      "chinese": "月石",
      "french": "Séléroc"
    },
    "type": [
      "Rock",
      "Psychic"
    ],
    "base": {
      "HP": 90,
      "Attack": 55,
      "Defense": 65,
      "Sp. Attack": 95,
      "Sp. Defense": 85,
      "Speed": 70
    }
  },
  {
    "id": 338,
    "name": {
      "english": "Solrock",
      "japanese": "ソルロック",
      "chinese": "太阳岩",
      "french": "Solaroc"
    },
    "type": [
      "Rock",
      "Psychic"
    ],
    "base": {
      "HP": 90,
      "Attack": 95,
      "Defense": 85,
      "Sp. Attack": 55,
      "Sp. Defense": 65,
      "Speed": 70
    }
  },
  {
    "id": 339,
    "name": {
      "english": "Barboach",
      "japanese": "ドジョッチ",
      "chinese": "泥泥鳅",
      "french": "Barloche"
    },
    "type": [
      "Water",
      "Ground"
    ],
    "base": {
      "HP": 50,
      "Attack": 48,
      "Defense": 43,
      "Sp. Attack": 46,
      "Sp. Defense": 41,
      "Speed": 60
    }
  },
  {
    "id": 340,
    "name": {
      "english": "Whiscash",
      "japanese": "ナマズン",
      "chinese": "鲶鱼王",
      "french": "Barbicha"
    },
    "type": [
      "Water",
      "Ground"
    ],
    "base": {
      "HP": 110,
      "Attack": 78,
      "Defense": 73,
      "Sp. Attack": 76,
      "Sp. Defense": 71,
      "Speed": 60
    }
  },
  {
    "id": 341,
    "name": {
      "english": "Corphish",
      "japanese": "ヘイガニ",
      "chinese": "龙虾小兵",
      "french": "Écrapince"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 43,
      "Attack": 80,
      "Defense": 65,
      "Sp. Attack": 50,
      "Sp. Defense": 35,
      "Speed": 35
    }
  },
  {
    "id": 342,
    "name": {
      "english": "Crawdaunt",
      "japanese": "シザリガー",
      "chinese": "铁螯龙虾",
      "french": "Colhomard"
    },
    "type": [
      "Water",
      "Dark"
    ],
    "base": {
      "HP": 63,
      "Attack": 120,
      "Defense": 85,
      "Sp. Attack": 90,
      "Sp. Defense": 55,
      "Speed": 55
    }
  },
  {
    "id": 343,
    "name": {
      "english": "Baltoy",
      "japanese": "ヤジロン",
      "chinese": "天秤偶",
      "french": "Balbuto"
    },
    "type": [
      "Ground",
      "Psychic"
    ],
    "base": {
      "HP": 40,
      "Attack": 40,
      "Defense": 55,
      "Sp. Attack": 40,
      "Sp. Defense": 70,
      "Speed": 55
    }
  },
  {
    "id": 344,
    "name": {
      "english": "Claydol",
      "japanese": "ネンドール",
      "chinese": "念力土偶",
      "french": "Kaorine"
    },
    "type": [
      "Ground",
      "Psychic"
    ],
    "base": {
      "HP": 60,
      "Attack": 70,
      "Defense": 105,
      "Sp. Attack": 70,
      "Sp. Defense": 120,
      "Speed": 75
    }
  },
  {
    "id": 345,
    "name": {
      "english": "Lileep",
      "japanese": "リリーラ",
      "chinese": "触手百合",
      "french": "Lilia"
    },
    "type": [
      "Rock",
      "Grass"
    ],
    "base": {
      "HP": 66,
      "Attack": 41,
      "Defense": 77,
      "Sp. Attack": 61,
      "Sp. Defense": 87,
      "Speed": 23
    }
  },
  {
    "id": 346,
    "name": {
      "english": "Cradily",
      "japanese": "ユレイドル",
      "chinese": "摇篮百合",
      "french": "Vacilys"
    },
    "type": [
      "Rock",
      "Grass"
    ],
    "base": {
      "HP": 86,
      "Attack": 81,
      "Defense": 97,
      "Sp. Attack": 81,
      "Sp. Defense": 107,
      "Speed": 43
    }
  },
  {
    "id": 347,
    "name": {
      "english": "Anorith",
      "japanese": "アノプス",
      "chinese": "太古羽虫",
      "french": "Anorith"
    },
    "type": [
      "Rock",
      "Bug"
    ],
    "base": {
      "HP": 45,
      "Attack": 95,
      "Defense": 50,
      "Sp. Attack": 40,
      "Sp. Defense": 50,
      "Speed": 75
    }
  },
  {
    "id": 348,
    "name": {
      "english": "Armaldo",
      "japanese": "アーマルド",
      "chinese": "太古盔甲",
      "french": "Armaldo"
    },
    "type": [
      "Rock",
      "Bug"
    ],
    "base": {
      "HP": 75,
      "Attack": 125,
      "Defense": 100,
      "Sp. Attack": 70,
      "Sp. Defense": 80,
      "Speed": 45
    }
  },
  {
    "id": 349,
    "name": {
      "english": "Feebas",
      "japanese": "ヒンバス",
      "chinese": "丑丑鱼",
      "french": "Barpau"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 20,
      "Attack": 15,
      "Defense": 20,
      "Sp. Attack": 10,
      "Sp. Defense": 55,
      "Speed": 80
    }
  },
  {
    "id": 350,
    "name": {
      "english": "Milotic",
      "japanese": "ミロカロス",
      "chinese": "美纳斯",
      "french": "Milobellus"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 95,
      "Attack": 60,
      "Defense": 79,
      "Sp. Attack": 100,
      "Sp. Defense": 125,
      "Speed": 81
    }
  },
  {
    "id": 351,
    "name": {
      "english": "Castform",
      "japanese": "ポワルン",
      "chinese": "飘浮泡泡",
      "french": "Morphéo"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 70,
      "Attack": 70,
      "Defense": 70,
      "Sp. Attack": 70,
      "Sp. Defense": 70,
      "Speed": 70
    }
  },
  {
    "id": 352,
    "name": {
      "english": "Kecleon",
      "japanese": "カクレオン",
      "chinese": "变隐龙",
      "french": "Kecleon"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 60,
      "Attack": 90,
      "Defense": 70,
      "Sp. Attack": 60,
      "Sp. Defense": 120,
      "Speed": 40
    }
  },
  {
    "id": 353,
    "name": {
      "english": "Shuppet",
      "japanese": "カゲボウズ",
      "chinese": "怨影娃娃",
      "french": "Polichombr"
    },
    "type": [
      "Ghost"
    ],
    "base": {
      "HP": 44,
      "Attack": 75,
      "Defense": 35,
      "Sp. Attack": 63,
      "Sp. Defense": 33,
      "Speed": 45
    }
  },
  {
    "id": 354,
    "name": {
      "english": "Banette",
      "japanese": "ジュペッタ",
      "chinese": "诅咒娃娃",
      "french": "Branette"
    },
    "type": [
      "Ghost"
    ],
    "base": {
      "HP": 64,
      "Attack": 115,
      "Defense": 65,
      "Sp. Attack": 83,
      "Sp. Defense": 63,
      "Speed": 65
    }
  },
  {
    "id": 355,
    "name": {
      "english": "Duskull",
      "japanese": "ヨマワル",
      "chinese": "夜巡灵",
      "french": "Skelénox"
    },
    "type": [
      "Ghost"
    ],
    "base": {
      "HP": 20,
      "Attack": 40,
      "Defense": 90,
      "Sp. Attack": 30,
      "Sp. Defense": 90,
      "Speed": 25
    }
  },
  {
    "id": 356,
    "name": {
      "english": "Dusclops",
      "japanese": "サマヨール",
      "chinese": "彷徨夜灵",
      "french": "Téraclope"
    },
    "type": [
      "Ghost"
    ],
    "base": {
      "HP": 40,
      "Attack": 70,
      "Defense": 130,
      "Sp. Attack": 60,
      "Sp. Defense": 130,
      "Speed": 25
    }
  },
  {
    "id": 357,
    "name": {
      "english": "Tropius",
      "japanese": "トロピウス",
      "chinese": "热带龙",
      "french": "Tropius"
    },
    "type": [
      "Grass",
      "Flying"
    ],
    "base": {
      "HP": 99,
      "Attack": 68,
      "Defense": 83,
      "Sp. Attack": 72,
      "Sp. Defense": 87,
      "Speed": 51
    }
  },
  {
    "id": 358,
    "name": {
      "english": "Chimecho",
      "japanese": "チリーン",
      "chinese": "风铃铃",
      "french": "Éoko"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 75,
      "Attack": 50,
      "Defense": 80,
      "Sp. Attack": 95,
      "Sp. Defense": 90,
      "Speed": 65
    }
  },
  {
    "id": 359,
    "name": {
      "english": "Absol",
      "japanese": "アブソル",
      "chinese": "阿勃梭鲁",
      "french": "Absol"
    },
    "type": [
      "Dark"
    ],
    "base": {
      "HP": 65,
      "Attack": 130,
      "Defense": 60,
      "Sp. Attack": 75,
      "Sp. Defense": 60,
      "Speed": 75
    }
  },
  {
    "id": 360,
    "name": {
      "english": "Wynaut",
      "japanese": "ソーナノ",
      "chinese": "小果然",
      "french": "Okéoké"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 95,
      "Attack": 23,
      "Defense": 48,
      "Sp. Attack": 23,
      "Sp. Defense": 48,
      "Speed": 23
    }
  },
  {
    "id": 361,
    "name": {
      "english": "Snorunt",
      "japanese": "ユキワラシ",
      "chinese": "雪童子",
      "french": "Stalgamin"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 50,
      "Attack": 50,
      "Defense": 50,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 50
    }
  },
  {
    "id": 362,
    "name": {
      "english": "Glalie",
      "japanese": "オニゴーリ",
      "chinese": "冰鬼护",
      "french": "Oniglali"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 80,
      "Attack": 80,
      "Defense": 80,
      "Sp. Attack": 80,
      "Sp. Defense": 80,
      "Speed": 80
    }
  },
  {
    "id": 363,
    "name": {
      "english": "Spheal",
      "japanese": "タマザラシ",
      "chinese": "海豹球",
      "french": "Obalie"
    },
    "type": [
      "Ice",
      "Water"
    ],
    "base": {
      "HP": 70,
      "Attack": 40,
      "Defense": 50,
      "Sp. Attack": 55,
      "Sp. Defense": 50,
      "Speed": 25
    }
  },
  {
    "id": 364,
    "name": {
      "english": "Sealeo",
      "japanese": "トドグラー",
      "chinese": "海魔狮",
      "french": "Phogleur"
    },
    "type": [
      "Ice",
      "Water"
    ],
    "base": {
      "HP": 90,
      "Attack": 60,
      "Defense": 70,
      "Sp. Attack": 75,
      "Sp. Defense": 70,
      "Speed": 45
    }
  },
  {
    "id": 365,
    "name": {
      "english": "Walrein",
      "japanese": "トドゼルガ",
      "chinese": "帝牙海狮",
      "french": "Kaimorse"
    },
    "type": [
      "Ice",
      "Water"
    ],
    "base": {
      "HP": 110,
      "Attack": 80,
      "Defense": 90,
      "Sp. Attack": 95,
      "Sp. Defense": 90,
      "Speed": 65
    }
  },
  {
    "id": 366,
    "name": {
      "english": "Clamperl",
      "japanese": "パールル",
      "chinese": "珍珠贝",
      "french": "Coquiperl"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 35,
      "Attack": 64,
      "Defense": 85,
      "Sp. Attack": 74,
      "Sp. Defense": 55,
      "Speed": 32
    }
  },
  {
    "id": 367,
    "name": {
      "english": "Huntail",
      "japanese": "ハンテール",
      "chinese": "猎斑鱼",
      "french": "Serpang"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 55,
      "Attack": 104,
      "Defense": 105,
      "Sp. Attack": 94,
      "Sp. Defense": 75,
      "Speed": 52
    }
  },
  {
    "id": 368,
    "name": {
      "english": "Gorebyss",
      "japanese": "サクラビス",
      "chinese": "樱花鱼",
      "french": "Rosabyss"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 55,
      "Attack": 84,
      "Defense": 105,
      "Sp. Attack": 114,
      "Sp. Defense": 75,
      "Speed": 52
    }
  },
  {
    "id": 369,
    "name": {
      "english": "Relicanth",
      "japanese": "ジーランス",
      "chinese": "古空棘鱼",
      "french": "Relicanth"
    },
    "type": [
      "Water",
      "Rock"
    ],
    "base": {
      "HP": 100,
      "Attack": 90,
      "Defense": 130,
      "Sp. Attack": 45,
      "Sp. Defense": 65,
      "Speed": 55
    }
  },
  {
    "id": 370,
    "name": {
      "english": "Luvdisc",
      "japanese": "ラブカス",
      "chinese": "爱心鱼",
      "french": "Lovdisc"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 43,
      "Attack": 30,
      "Defense": 55,
      "Sp. Attack": 40,
      "Sp. Defense": 65,
      "Speed": 97
    }
  },
  {
    "id": 371,
    "name": {
      "english": "Bagon",
      "japanese": "タツベイ",
      "chinese": "宝贝龙",
      "french": "Draby"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 45,
      "Attack": 75,
      "Defense": 60,
      "Sp. Attack": 40,
      "Sp. Defense": 30,
      "Speed": 50
    }
  },
  {
    "id": 372,
    "name": {
      "english": "Shelgon",
      "japanese": "コモルー",
      "chinese": "甲壳龙",
      "french": "Drackhaus"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 65,
      "Attack": 95,
      "Defense": 100,
      "Sp. Attack": 60,
      "Sp. Defense": 50,
      "Speed": 50
    }
  },
  {
    "id": 373,
    "name": {
      "english": "Salamence",
      "japanese": "ボーマンダ",
      "chinese": "暴飞龙",
      "french": "Drattak"
    },
    "type": [
      "Dragon",
      "Flying"
    ],
    "base": {
      "HP": 95,
      "Attack": 135,
      "Defense": 80,
      "Sp. Attack": 110,
      "Sp. Defense": 80,
      "Speed": 100
    }
  },
  {
    "id": 374,
    "name": {
      "english": "Beldum",
      "japanese": "ダンバル",
      "chinese": "铁哑铃",
      "french": "Terhal"
    },
    "type": [
      "Steel",
      "Psychic"
    ],
    "base": {
      "HP": 40,
      "Attack": 55,
      "Defense": 80,
      "Sp. Attack": 35,
      "Sp. Defense": 60,
      "Speed": 30
    }
  },
  {
    "id": 375,
    "name": {
      "english": "Metang",
      "japanese": "メタング",
      "chinese": "金属怪",
      "french": "Métang"
    },
    "type": [
      "Steel",
      "Psychic"
    ],
    "base": {
      "HP": 60,
      "Attack": 75,
      "Defense": 100,
      "Sp. Attack": 55,
      "Sp. Defense": 80,
      "Speed": 50
    }
  },
  {
    "id": 376,
    "name": {
      "english": "Metagross",
      "japanese": "メタグロス",
      "chinese": "巨金怪",
      "french": "Métalosse"
    },
    "type": [
      "Steel",
      "Psychic"
    ],
    "base": {
      "HP": 80,
      "Attack": 135,
      "Defense": 130,
      "Sp. Attack": 95,
      "Sp. Defense": 90,
      "Speed": 70
    }
  },
  {
    "id": 377,
    "name": {
      "english": "Regirock",
      "japanese": "レジロック",
      "chinese": "雷吉洛克",
      "french": "Regirock"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 80,
      "Attack": 100,
      "Defense": 200,
      "Sp. Attack": 50,
      "Sp. Defense": 100,
      "Speed": 50
    }
  },
  {
    "id": 378,
    "name": {
      "english": "Regice",
      "japanese": "レジアイス",
      "chinese": "雷吉艾斯",
      "french": "Regice"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 80,
      "Attack": 50,
      "Defense": 100,
      "Sp. Attack": 100,
      "Sp. Defense": 200,
      "Speed": 50
    }
  },
  {
    "id": 379,
    "name": {
      "english": "Registeel",
      "japanese": "レジスチル",
      "chinese": "雷吉斯奇鲁",
      "french": "Registeel"
    },
    "type": [
      "Steel"
    ],
    "base": {
      "HP": 80,
      "Attack": 75,
      "Defense": 150,
      "Sp. Attack": 75,
      "Sp. Defense": 150,
      "Speed": 50
    }
  },
  {
    "id": 380,
    "name": {
      "english": "Latias",
      "japanese": "ラティアス",
      "chinese": "拉帝亚斯",
      "french": "Latias"
    },
    "type": [
      "Dragon",
      "Psychic"
    ],
    "base": {
      "HP": 80,
      "Attack": 80,
      "Defense": 90,
      "Sp. Attack": 110,
      "Sp. Defense": 130,
      "Speed": 110
    }
  },
  {
    "id": 381,
    "name": {
      "english": "Latios",
      "japanese": "ラティオス",
      "chinese": "拉帝欧斯",
      "french": "Latios"
    },
    "type": [
      "Dragon",
      "Psychic"
    ],
    "base": {
      "HP": 80,
      "Attack": 90,
      "Defense": 80,
      "Sp. Attack": 130,
      "Sp. Defense": 110,
      "Speed": 110
    }
  },
  {
    "id": 382,
    "name": {
      "english": "Kyogre",
      "japanese": "カイオーガ",
      "chinese": "盖欧卡",
      "french": "Kyogre"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 100,
      "Attack": 100,
      "Defense": 90,
      "Sp. Attack": 150,
      "Sp. Defense": 140,
      "Speed": 90
    }
  },
  {
    "id": 383,
    "name": {
      "english": "Groudon",
      "japanese": "グラードン",
      "chinese": "固拉多",
      "french": "Groudon"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 100,
      "Attack": 150,
      "Defense": 140,
      "Sp. Attack": 100,
      "Sp. Defense": 90,
      "Speed": 90
    }
  },
  {
    "id": 384,
    "name": {
      "english": "Rayquaza",
      "japanese": "レックウザ",
      "chinese": "烈空坐",
      "french": "Rayquaza"
    },
    "type": [
      "Dragon",
      "Flying"
    ],
    "base": {
      "HP": 105,
      "Attack": 150,
      "Defense": 90,
      "Sp. Attack": 150,
      "Sp. Defense": 90,
      "Speed": 95
    }
  },
  {
    "id": 385,
    "name": {
      "english": "Jirachi",
      "japanese": "ジラーチ",
      "chinese": "基拉祈",
      "french": "Jirachi"
    },
    "type": [
      "Steel",
      "Psychic"
    ],
    "base": {
      "HP": 100,
      "Attack": 100,
      "Defense": 100,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      "Speed": 100
    }
  },
  {
    "id": 386,
    "name": {
      "english": "Deoxys",
      "japanese": "デオキシス",
      "chinese": "代欧奇希斯",
      "french": "Deoxys"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 50,
      "Attack": 150,
      "Defense": 50,
      "Sp. Attack": 150,
      "Sp. Defense": 50,
      "Speed": 150
    }
  },
  {
    "id": 387,
    "name": {
      "english": "Turtwig",
      "japanese": "ナエトル",
      "chinese": "草苗龟",
      "french": "Tortipouss"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 55,
      "Attack": 68,
      "Defense": 64,
      "Sp. Attack": 45,
      "Sp. Defense": 55,
      "Speed": 31
    }
  },
  {
    "id": 388,
    "name": {
      "english": "Grotle",
      "japanese": "ハヤシガメ",
      "chinese": "树林龟",
      "french": "Boskara"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 75,
      "Attack": 89,
      "Defense": 85,
      "Sp. Attack": 55,
      "Sp. Defense": 65,
      "Speed": 36
    }
  },
  {
    "id": 389,
    "name": {
      "english": "Torterra",
      "japanese": "ドダイトス",
      "chinese": "土台龟",
      "french": "Torterra"
    },
    "type": [
      "Grass",
      "Ground"
    ],
    "base": {
      "HP": 95,
      "Attack": 109,
      "Defense": 105,
      "Sp. Attack": 75,
      "Sp. Defense": 85,
      "Speed": 56
    }
  },
  {
    "id": 390,
    "name": {
      "english": "Chimchar",
      "japanese": "ヒコザル",
      "chinese": "小火焰猴",
      "french": "Ouisticram"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 44,
      "Attack": 58,
      "Defense": 44,
      "Sp. Attack": 58,
      "Sp. Defense": 44,
      "Speed": 61
    }
  },
  {
    "id": 391,
    "name": {
      "english": "Monferno",
      "japanese": "モウカザル",
      "chinese": "猛火猴",
      "french": "Chimpenfeu"
    },
    "type": [
      "Fire",
      "Fighting"
    ],
    "base": {
      "HP": 64,
      "Attack": 78,
      "Defense": 52,
      "Sp. Attack": 78,
      "Sp. Defense": 52,
      "Speed": 81
    }
  },
  {
    "id": 392,
    "name": {
      "english": "Infernape",
      "japanese": "ゴウカザル",
      "chinese": "烈焰猴",
      "french": "Simiabraz"
    },
    "type": [
      "Fire",
      "Fighting"
    ],
    "base": {
      "HP": 76,
      "Attack": 104,
      "Defense": 71,
      "Sp. Attack": 104,
      "Sp. Defense": 71,
      "Speed": 108
    }
  },
  {
    "id": 393,
    "name": {
      "english": "Piplup",
      "japanese": "ポッチャマ",
      "chinese": "波加曼",
      "french": "Tiplouf"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 53,
      "Attack": 51,
      "Defense": 53,
      "Sp. Attack": 61,
      "Sp. Defense": 56,
      "Speed": 40
    }
  },
  {
    "id": 394,
    "name": {
      "english": "Prinplup",
      "japanese": "ポッタイシ",
      "chinese": "波皇子",
      "french": "Prinplouf"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 64,
      "Attack": 66,
      "Defense": 68,
      "Sp. Attack": 81,
      "Sp. Defense": 76,
      "Speed": 50
    }
  },
  {
    "id": 395,
    "name": {
      "english": "Empoleon",
      "japanese": "エンペルト",
      "chinese": "帝王拿波",
      "french": "Pingoléon"
    },
    "type": [
      "Water",
      "Steel"
    ],
    "base": {
      "HP": 84,
      "Attack": 86,
      "Defense": 88,
      "Sp. Attack": 111,
      "Sp. Defense": 101,
      "Speed": 60
    }
  },
  {
    "id": 396,
    "name": {
      "english": "Starly",
      "japanese": "ムックル",
      "chinese": "姆克儿",
      "french": "Étourmi"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 40,
      "Attack": 55,
      "Defense": 30,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 60
    }
  },
  {
    "id": 397,
    "name": {
      "english": "Staravia",
      "japanese": "ムクバード",
      "chinese": "姆克鸟",
      "french": "Étourvol"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 55,
      "Attack": 75,
      "Defense": 50,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 80
    }
  },
  {
    "id": 398,
    "name": {
      "english": "Staraptor",
      "japanese": "ムクホーク",
      "chinese": "姆克鹰",
      "french": "Étouraptor"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 85,
      "Attack": 120,
      "Defense": 70,
      "Sp. Attack": 50,
      "Sp. Defense": 60,
      "Speed": 100
    }
  },
  {
    "id": 399,
    "name": {
      "english": "Bidoof",
      "japanese": "ビッパ",
      "chinese": "大牙狸",
      "french": "Keunotor"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 59,
      "Attack": 45,
      "Defense": 40,
      "Sp. Attack": 35,
      "Sp. Defense": 40,
      "Speed": 31
    }
  },
  {
    "id": 400,
    "name": {
      "english": "Bibarel",
      "japanese": "ビーダル",
      "chinese": "大尾狸",
      "french": "Castorno"
    },
    "type": [
      "Normal",
      "Water"
    ],
    "base": {
      "HP": 79,
      "Attack": 85,
      "Defense": 60,
      "Sp. Attack": 55,
      "Sp. Defense": 60,
      "Speed": 71
    }
  },
  {
    "id": 401,
    "name": {
      "english": "Kricketot",
      "japanese": "コロボーシ",
      "chinese": "圆法师",
      "french": "Crikzik"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 37,
      "Attack": 25,
      "Defense": 41,
      "Sp. Attack": 25,
      "Sp. Defense": 41,
      "Speed": 25
    }
  },
  {
    "id": 402,
    "name": {
      "english": "Kricketune",
      "japanese": "コロトック",
      "chinese": "音箱蟀",
      "french": "Mélokrik"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 77,
      "Attack": 85,
      "Defense": 51,
      "Sp. Attack": 55,
      "Sp. Defense": 51,
      "Speed": 65
    }
  },
  {
    "id": 403,
    "name": {
      "english": "Shinx",
      "japanese": "コリンク",
      "chinese": "小猫怪",
      "french": "Lixy"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 45,
      "Attack": 65,
      "Defense": 34,
      "Sp. Attack": 40,
      "Sp. Defense": 34,
      "Speed": 45
    }
  },
  {
    "id": 404,
    "name": {
      "english": "Luxio",
      "japanese": "ルクシオ",
      "chinese": "勒克猫",
      "french": "Luxio"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 60,
      "Attack": 85,
      "Defense": 49,
      "Sp. Attack": 60,
      "Sp. Defense": 49,
      "Speed": 60
    }
  },
  {
    "id": 405,
    "name": {
      "english": "Luxray",
      "japanese": "レントラー",
      "chinese": "伦琴猫",
      "french": "Luxray"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 80,
      "Attack": 120,
      "Defense": 79,
      "Sp. Attack": 95,
      "Sp. Defense": 79,
      "Speed": 70
    }
  },
  {
    "id": 406,
    "name": {
      "english": "Budew",
      "japanese": "スボミー",
      "chinese": "含羞苞",
      "french": "Rozbouton"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 40,
      "Attack": 30,
      "Defense": 35,
      "Sp. Attack": 50,
      "Sp. Defense": 70,
      "Speed": 55
    }
  },
  {
    "id": 407,
    "name": {
      "english": "Roserade",
      "japanese": "ロズレイド",
      "chinese": "罗丝雷朵",
      "french": "Roserade"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 60,
      "Attack": 70,
      "Defense": 65,
      "Sp. Attack": 125,
      "Sp. Defense": 105,
      "Speed": 90
    }
  },
  {
    "id": 408,
    "name": {
      "english": "Cranidos",
      "japanese": "ズガイドス",
      "chinese": "头盖龙",
      "french": "Kranidos"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 67,
      "Attack": 125,
      "Defense": 40,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 58
    }
  },
  {
    "id": 409,
    "name": {
      "english": "Rampardos",
      "japanese": "ラムパルド",
      "chinese": "战槌龙",
      "french": "Charkos"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 97,
      "Attack": 165,
      "Defense": 60,
      "Sp. Attack": 65,
      "Sp. Defense": 50,
      "Speed": 58
    }
  },
  {
    "id": 410,
    "name": {
      "english": "Shieldon",
      "japanese": "タテトプス",
      "chinese": "盾甲龙",
      "french": "Dinoclier"
    },
    "type": [
      "Rock",
      "Steel"
    ],
    "base": {
      "HP": 30,
      "Attack": 42,
      "Defense": 118,
      "Sp. Attack": 42,
      "Sp. Defense": 88,
      "Speed": 30
    }
  },
  {
    "id": 411,
    "name": {
      "english": "Bastiodon",
      "japanese": "トリデプス",
      "chinese": "护城龙",
      "french": "Bastiodon"
    },
    "type": [
      "Rock",
      "Steel"
    ],
    "base": {
      "HP": 60,
      "Attack": 52,
      "Defense": 168,
      "Sp. Attack": 47,
      "Sp. Defense": 138,
      "Speed": 30
    }
  },
  {
    "id": 412,
    "name": {
      "english": "Burmy",
      "japanese": "ミノムッチ",
      "chinese": "结草儿",
      "french": "Cheniti"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 40,
      "Attack": 29,
      "Defense": 45,
      "Sp. Attack": 29,
      "Sp. Defense": 45,
      "Speed": 36
    }
  },
  {
    "id": 413,
    "name": {
      "english": "Wormadam",
      "japanese": "ミノマダム",
      "chinese": "结草贵妇",
      "french": "Cheniselle"
    },
    "type": [
      "Bug",
      "Grass"
    ],
    "base": {
      "HP": 60,
      "Attack": 59,
      "Defense": 85,
      "Sp. Attack": 79,
      "Sp. Defense": 105,
      "Speed": 36
    }
  },
  {
    "id": 414,
    "name": {
      "english": "Mothim",
      "japanese": "ガーメイル",
      "chinese": "绅士蛾",
      "french": "Papilord"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 70,
      "Attack": 94,
      "Defense": 50,
      "Sp. Attack": 94,
      "Sp. Defense": 50,
      "Speed": 66
    }
  },
  {
    "id": 415,
    "name": {
      "english": "Combee",
      "japanese": "ミツハニー",
      "chinese": "三蜜蜂",
      "french": "Apitrini"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 30,
      "Attack": 30,
      "Defense": 42,
      "Sp. Attack": 30,
      "Sp. Defense": 42,
      "Speed": 70
    }
  },
  {
    "id": 416,
    "name": {
      "english": "Vespiquen",
      "japanese": "ビークイン",
      "chinese": "蜂女王",
      "french": "Apireine"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 70,
      "Attack": 80,
      "Defense": 102,
      "Sp. Attack": 80,
      "Sp. Defense": 102,
      "Speed": 40
    }
  },
  {
    "id": 417,
    "name": {
      "english": "Pachirisu",
      "japanese": "パチリス",
      "chinese": "帕奇利兹",
      "french": "Pachirisu"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 60,
      "Attack": 45,
      "Defense": 70,
      "Sp. Attack": 45,
      "Sp. Defense": 90,
      "Speed": 95
    }
  },
  {
    "id": 418,
    "name": {
      "english": "Buizel",
      "japanese": "ブイゼル",
      "chinese": "泳圈鼬",
      "french": "Mustébouée"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 55,
      "Attack": 65,
      "Defense": 35,
      "Sp. Attack": 60,
      "Sp. Defense": 30,
      "Speed": 85
    }
  },
  {
    "id": 419,
    "name": {
      "english": "Floatzel",
      "japanese": "フローゼル",
      "chinese": "浮潜鼬",
      "french": "Mustéflott"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 85,
      "Attack": 105,
      "Defense": 55,
      "Sp. Attack": 85,
      "Sp. Defense": 50,
      "Speed": 115
    }
  },
  {
    "id": 420,
    "name": {
      "english": "Cherubi",
      "japanese": "チェリンボ",
      "chinese": "樱花宝",
      "french": "Ceribou"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 45,
      "Attack": 35,
      "Defense": 45,
      "Sp. Attack": 62,
      "Sp. Defense": 53,
      "Speed": 35
    }
  },
  {
    "id": 421,
    "name": {
      "english": "Cherrim",
      "japanese": "チェリム",
      "chinese": "樱花儿",
      "french": "Ceriflor"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 70,
      "Attack": 60,
      "Defense": 70,
      "Sp. Attack": 87,
      "Sp. Defense": 78,
      "Speed": 85
    }
  },
  {
    "id": 422,
    "name": {
      "english": "Shellos",
      "japanese": "カラナクシ",
      "chinese": "无壳海兔",
      "french": "Sancoki"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 76,
      "Attack": 48,
      "Defense": 48,
      "Sp. Attack": 57,
      "Sp. Defense": 62,
      "Speed": 34
    }
  },
  {
    "id": 423,
    "name": {
      "english": "Gastrodon",
      "japanese": "トリトドン",
      "chinese": "海兔兽",
      "french": "Tritosor"
    },
    "type": [
      "Water",
      "Ground"
    ],
    "base": {
      "HP": 111,
      "Attack": 83,
      "Defense": 68,
      "Sp. Attack": 92,
      "Sp. Defense": 82,
      "Speed": 39
    }
  },
  {
    "id": 424,
    "name": {
      "english": "Ambipom",
      "japanese": "エテボース",
      "chinese": "双尾怪手",
      "french": "Capidextre"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 75,
      "Attack": 100,
      "Defense": 66,
      "Sp. Attack": 60,
      "Sp. Defense": 66,
      "Speed": 115
    }
  },
  {
    "id": 425,
    "name": {
      "english": "Drifloon",
      "japanese": "フワンテ",
      "chinese": "飘飘球",
      "french": "Baudrive"
    },
    "type": [
      "Ghost",
      "Flying"
    ],
    "base": {
      "HP": 90,
      "Attack": 50,
      "Defense": 34,
      "Sp. Attack": 60,
      "Sp. Defense": 44,
      "Speed": 70
    }
  },
  {
    "id": 426,
    "name": {
      "english": "Drifblim",
      "japanese": "フワライド",
      "chinese": "随风球",
      "french": "Grodrive"
    },
    "type": [
      "Ghost",
      "Flying"
    ],
    "base": {
      "HP": 150,
      "Attack": 80,
      "Defense": 44,
      "Sp. Attack": 90,
      "Sp. Defense": 54,
      "Speed": 80
    }
  },
  {
    "id": 427,
    "name": {
      "english": "Buneary",
      "japanese": "ミミロル",
      "chinese": "卷卷耳",
      "french": "Laporeille"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 55,
      "Attack": 66,
      "Defense": 44,
      "Sp. Attack": 44,
      "Sp. Defense": 56,
      "Speed": 85
    }
  },
  {
    "id": 428,
    "name": {
      "english": "Lopunny",
      "japanese": "ミミロップ",
      "chinese": "长耳兔",
      "french": "Lockpin"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 65,
      "Attack": 76,
      "Defense": 84,
      "Sp. Attack": 54,
      "Sp. Defense": 96,
      "Speed": 105
    }
  },
  {
    "id": 429,
    "name": {
      "english": "Mismagius",
      "japanese": "ムウマージ",
      "chinese": "梦妖魔",
      "french": "Magirêve"
    },
    "type": [
      "Ghost"
    ],
    "base": {
      "HP": 60,
      "Attack": 60,
      "Defense": 60,
      "Sp. Attack": 105,
      "Sp. Defense": 105,
      "Speed": 105
    }
  },
  {
    "id": 430,
    "name": {
      "english": "Honchkrow",
      "japanese": "ドンカラス",
      "chinese": "乌鸦头头",
      "french": "Corboss"
    },
    "type": [
      "Dark",
      "Flying"
    ],
    "base": {
      "HP": 100,
      "Attack": 125,
      "Defense": 52,
      "Sp. Attack": 105,
      "Sp. Defense": 52,
      "Speed": 71
    }
  },
  {
    "id": 431,
    "name": {
      "english": "Glameow",
      "japanese": "ニャルマー",
      "chinese": "魅力喵",
      "french": "Chaglam"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 49,
      "Attack": 55,
      "Defense": 42,
      "Sp. Attack": 42,
      "Sp. Defense": 37,
      "Speed": 85
    }
  },
  {
    "id": 432,
    "name": {
      "english": "Purugly",
      "japanese": "ブニャット",
      "chinese": "东施喵",
      "french": "Chaffreux"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 71,
      "Attack": 82,
      "Defense": 64,
      "Sp. Attack": 64,
      "Sp. Defense": 59,
      "Speed": 112
    }
  },
  {
    "id": 433,
    "name": {
      "english": "Chingling",
      "japanese": "リーシャン",
      "chinese": "铃铛响",
      "french": "Korillon"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 45,
      "Attack": 30,
      "Defense": 50,
      "Sp. Attack": 65,
      "Sp. Defense": 50,
      "Speed": 45
    }
  },
  {
    "id": 434,
    "name": {
      "english": "Stunky",
      "japanese": "スカンプー",
      "chinese": "臭鼬噗",
      "french": "Moufouette"
    },
    "type": [
      "Poison",
      "Dark"
    ],
    "base": {
      "HP": 63,
      "Attack": 63,
      "Defense": 47,
      "Sp. Attack": 41,
      "Sp. Defense": 41,
      "Speed": 74
    }
  },
  {
    "id": 435,
    "name": {
      "english": "Skuntank",
      "japanese": "スカタンク",
      "chinese": "坦克臭鼬",
      "french": "Moufflair"
    },
    "type": [
      "Poison",
      "Dark"
    ],
    "base": {
      "HP": 103,
      "Attack": 93,
      "Defense": 67,
      "Sp. Attack": 71,
      "Sp. Defense": 61,
      "Speed": 84
    }
  },
  {
    "id": 436,
    "name": {
      "english": "Bronzor",
      "japanese": "ドーミラー",
      "chinese": "铜镜怪",
      "french": "Archéomire"
    },
    "type": [
      "Steel",
      "Psychic"
    ],
    "base": {
      "HP": 57,
      "Attack": 24,
      "Defense": 86,
      "Sp. Attack": 24,
      "Sp. Defense": 86,
      "Speed": 23
    }
  },
  {
    "id": 437,
    "name": {
      "english": "Bronzong",
      "japanese": "ドータクン",
      "chinese": "青铜钟",
      "french": "Archéodong"
    },
    "type": [
      "Steel",
      "Psychic"
    ],
    "base": {
      "HP": 67,
      "Attack": 89,
      "Defense": 116,
      "Sp. Attack": 79,
      "Sp. Defense": 116,
      "Speed": 33
    }
  },
  {
    "id": 438,
    "name": {
      "english": "Bonsly",
      "japanese": "ウソハチ",
      "chinese": "盆才怪",
      "french": "Manzaï"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 50,
      "Attack": 80,
      "Defense": 95,
      "Sp. Attack": 10,
      "Sp. Defense": 45,
      "Speed": 10
    }
  },
  {
    "id": 439,
    "name": {
      "english": "Mime Jr.",
      "japanese": "マネネ",
      "chinese": "魔尼尼",
      "french": "Mime Jr"
    },
    "type": [
      "Psychic",
      "Fairy"
    ],
    "base": {
      "HP": 20,
      "Attack": 25,
      "Defense": 45,
      "Sp. Attack": 70,
      "Sp. Defense": 90,
      "Speed": 60
    }
  },
  {
    "id": 440,
    "name": {
      "english": "Happiny",
      "japanese": "ピンプク",
      "chinese": "小福蛋",
      "french": "Ptiravi"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 100,
      "Attack": 5,
      "Defense": 5,
      "Sp. Attack": 15,
      "Sp. Defense": 65,
      "Speed": 30
    }
  },
  {
    "id": 441,
    "name": {
      "english": "Chatot",
      "japanese": "ペラップ",
      "chinese": "聒噪鸟",
      "french": "Pijako"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 76,
      "Attack": 65,
      "Defense": 45,
      "Sp. Attack": 92,
      "Sp. Defense": 42,
      "Speed": 91
    }
  },
  {
    "id": 442,
    "name": {
      "english": "Spiritomb",
      "japanese": "ミカルゲ",
      "chinese": "花岩怪",
      "french": "Spiritomb"
    },
    "type": [
      "Ghost",
      "Dark"
    ],
    "base": {
      "HP": 50,
      "Attack": 92,
      "Defense": 108,
      "Sp. Attack": 92,
      "Sp. Defense": 108,
      "Speed": 35
    }
  },
  {
    "id": 443,
    "name": {
      "english": "Gible",
      "japanese": "フカマル",
      "chinese": "圆陆鲨",
      "french": "Griknot"
    },
    "type": [
      "Dragon",
      "Ground"
    ],
    "base": {
      "HP": 58,
      "Attack": 70,
      "Defense": 45,
      "Sp. Attack": 40,
      "Sp. Defense": 45,
      "Speed": 42
    }
  },
  {
    "id": 444,
    "name": {
      "english": "Gabite",
      "japanese": "ガバイト",
      "chinese": "尖牙陆鲨",
      "french": "Carmache"
    },
    "type": [
      "Dragon",
      "Ground"
    ],
    "base": {
      "HP": 68,
      "Attack": 90,
      "Defense": 65,
      "Sp. Attack": 50,
      "Sp. Defense": 55,
      "Speed": 82
    }
  },
  {
    "id": 445,
    "name": {
      "english": "Garchomp",
      "japanese": "ガブリアス",
      "chinese": "烈咬陆鲨",
      "french": "Carchacrok"
    },
    "type": [
      "Dragon",
      "Ground"
    ],
    "base": {
      "HP": 108,
      "Attack": 130,
      "Defense": 95,
      "Sp. Attack": 80,
      "Sp. Defense": 85,
      "Speed": 102
    }
  },
  {
    "id": 446,
    "name": {
      "english": "Munchlax",
      "japanese": "ゴンベ",
      "chinese": "小卡比兽",
      "french": "Goinfrex"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 135,
      "Attack": 85,
      "Defense": 40,
      "Sp. Attack": 40,
      "Sp. Defense": 85,
      "Speed": 5
    }
  },
  {
    "id": 447,
    "name": {
      "english": "Riolu",
      "japanese": "リオル",
      "chinese": "利欧路",
      "french": "Riolu"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 40,
      "Attack": 70,
      "Defense": 40,
      "Sp. Attack": 35,
      "Sp. Defense": 40,
      "Speed": 60
    }
  },
  {
    "id": 448,
    "name": {
      "english": "Lucario",
      "japanese": "ルカリオ",
      "chinese": "路卡利欧",
      "french": "Lucario"
    },
    "type": [
      "Fighting",
      "Steel"
    ],
    "base": {
      "HP": 70,
      "Attack": 110,
      "Defense": 70,
      "Sp. Attack": 115,
      "Sp. Defense": 70,
      "Speed": 90
    }
  },
  {
    "id": 449,
    "name": {
      "english": "Hippopotas",
      "japanese": "ヒポポタス",
      "chinese": "沙河马",
      "french": "Hippopotas"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 68,
      "Attack": 72,
      "Defense": 78,
      "Sp. Attack": 38,
      "Sp. Defense": 42,
      "Speed": 32
    }
  },
  {
    "id": 450,
    "name": {
      "english": "Hippowdon",
      "japanese": "カバルドン",
      "chinese": "河马兽",
      "french": "Hippodocus"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 108,
      "Attack": 112,
      "Defense": 118,
      "Sp. Attack": 68,
      "Sp. Defense": 72,
      "Speed": 47
    }
  },
  {
    "id": 451,
    "name": {
      "english": "Skorupi",
      "japanese": "スコルピ",
      "chinese": "钳尾蝎",
      "french": "Rapion"
    },
    "type": [
      "Poison",
      "Bug"
    ],
    "base": {
      "HP": 40,
      "Attack": 50,
      "Defense": 90,
      "Sp. Attack": 30,
      "Sp. Defense": 55,
      "Speed": 65
    }
  },
  {
    "id": 452,
    "name": {
      "english": "Drapion",
      "japanese": "ドラピオン",
      "chinese": "龙王蝎",
      "french": "Drascore"
    },
    "type": [
      "Poison",
      "Dark"
    ],
    "base": {
      "HP": 70,
      "Attack": 90,
      "Defense": 110,
      "Sp. Attack": 60,
      "Sp. Defense": 75,
      "Speed": 95
    }
  },
  {
    "id": 453,
    "name": {
      "english": "Croagunk",
      "japanese": "グレッグル",
      "chinese": "不良蛙",
      "french": "Cradopaud"
    },
    "type": [
      "Poison",
      "Fighting"
    ],
    "base": {
      "HP": 48,
      "Attack": 61,
      "Defense": 40,
      "Sp. Attack": 61,
      "Sp. Defense": 40,
      "Speed": 50
    }
  },
  {
    "id": 454,
    "name": {
      "english": "Toxicroak",
      "japanese": "ドクロッグ",
      "chinese": "毒骷蛙",
      "french": "Coatox"
    },
    "type": [
      "Poison",
      "Fighting"
    ],
    "base": {
      "HP": 83,
      "Attack": 106,
      "Defense": 65,
      "Sp. Attack": 86,
      "Sp. Defense": 65,
      "Speed": 85
    }
  },
  {
    "id": 455,
    "name": {
      "english": "Carnivine",
      "japanese": "マスキッパ",
      "chinese": "尖牙笼",
      "french": "Vortente"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 74,
      "Attack": 100,
      "Defense": 72,
      "Sp. Attack": 90,
      "Sp. Defense": 72,
      "Speed": 46
    }
  },
  {
    "id": 456,
    "name": {
      "english": "Finneon",
      "japanese": "ケイコウオ",
      "chinese": "荧光鱼",
      "french": "Écayon"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 49,
      "Attack": 49,
      "Defense": 56,
      "Sp. Attack": 49,
      "Sp. Defense": 61,
      "Speed": 66
    }
  },
  {
    "id": 457,
    "name": {
      "english": "Lumineon",
      "japanese": "ネオラント",
      "chinese": "霓虹鱼",
      "french": "Luminéon"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 69,
      "Attack": 69,
      "Defense": 76,
      "Sp. Attack": 69,
      "Sp. Defense": 86,
      "Speed": 91
    }
  },
  {
    "id": 458,
    "name": {
      "english": "Mantyke",
      "japanese": "タマンタ",
      "chinese": "小球飞鱼",
      "french": "Babimanta"
    },
    "type": [
      "Water",
      "Flying"
    ],
    "base": {
      "HP": 45,
      "Attack": 20,
      "Defense": 50,
      "Sp. Attack": 60,
      "Sp. Defense": 120,
      "Speed": 50
    }
  },
  {
    "id": 459,
    "name": {
      "english": "Snover",
      "japanese": "ユキカブリ",
      "chinese": "雪笠怪",
      "french": "Blizzi"
    },
    "type": [
      "Grass",
      "Ice"
    ],
    "base": {
      "HP": 60,
      "Attack": 62,
      "Defense": 50,
      "Sp. Attack": 62,
      "Sp. Defense": 60,
      "Speed": 40
    }
  },
  {
    "id": 460,
    "name": {
      "english": "Abomasnow",
      "japanese": "ユキノオー",
      "chinese": "暴雪王",
      "french": "Blizzaroi"
    },
    "type": [
      "Grass",
      "Ice"
    ],
    "base": {
      "HP": 90,
      "Attack": 92,
      "Defense": 75,
      "Sp. Attack": 92,
      "Sp. Defense": 85,
      "Speed": 60
    }
  },
  {
    "id": 461,
    "name": {
      "english": "Weavile",
      "japanese": "マニューラ",
      "chinese": "玛狃拉",
      "french": "Dimoret"
    },
    "type": [
      "Dark",
      "Ice"
    ],
    "base": {
      "HP": 70,
      "Attack": 120,
      "Defense": 65,
      "Sp. Attack": 45,
      "Sp. Defense": 85,
      "Speed": 125
    }
  },
  {
    "id": 462,
    "name": {
      "english": "Magnezone",
      "japanese": "ジバコイル",
      "chinese": "自爆磁怪",
      "french": "Magnézone"
    },
    "type": [
      "Electric",
      "Steel"
    ],
    "base": {
      "HP": 70,
      "Attack": 70,
      "Defense": 115,
      "Sp. Attack": 130,
      "Sp. Defense": 90,
      "Speed": 60
    }
  },
  {
    "id": 463,
    "name": {
      "english": "Lickilicky",
      "japanese": "ベロベルト",
      "chinese": "大舌舔",
      "french": "Coudlangue"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 110,
      "Attack": 85,
      "Defense": 95,
      "Sp. Attack": 80,
      "Sp. Defense": 95,
      "Speed": 50
    }
  },
  {
    "id": 464,
    "name": {
      "english": "Rhyperior",
      "japanese": "ドサイドン",
      "chinese": "超甲狂犀",
      "french": "Rhinastoc"
    },
    "type": [
      "Ground",
      "Rock"
    ],
    "base": {
      "HP": 115,
      "Attack": 140,
      "Defense": 130,
      "Sp. Attack": 55,
      "Sp. Defense": 55,
      "Speed": 40
    }
  },
  {
    "id": 465,
    "name": {
      "english": "Tangrowth",
      "japanese": "モジャンボ",
      "chinese": "巨蔓藤",
      "french": "Bouldeneu"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 100,
      "Attack": 100,
      "Defense": 125,
      "Sp. Attack": 110,
      "Sp. Defense": 50,
      "Speed": 50
    }
  },
  {
    "id": 466,
    "name": {
      "english": "Electivire",
      "japanese": "エレキブル",
      "chinese": "电击魔兽",
      "french": "Élekable"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 75,
      "Attack": 123,
      "Defense": 67,
      "Sp. Attack": 95,
      "Sp. Defense": 85,
      "Speed": 95
    }
  },
  {
    "id": 467,
    "name": {
      "english": "Magmortar",
      "japanese": "ブーバーン",
      "chinese": "鸭嘴炎兽",
      "french": "Maganon"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 75,
      "Attack": 95,
      "Defense": 67,
      "Sp. Attack": 125,
      "Sp. Defense": 95,
      "Speed": 83
    }
  },
  {
    "id": 468,
    "name": {
      "english": "Togekiss",
      "japanese": "トゲキッス",
      "chinese": "波克基斯",
      "french": "Togekiss"
    },
    "type": [
      "Fairy",
      "Flying"
    ],
    "base": {
      "HP": 85,
      "Attack": 50,
      "Defense": 95,
      "Sp. Attack": 120,
      "Sp. Defense": 115,
      "Speed": 80
    }
  },
  {
    "id": 469,
    "name": {
      "english": "Yanmega",
      "japanese": "メガヤンマ",
      "chinese": "远古巨蜓",
      "french": "Yanmega"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 86,
      "Attack": 76,
      "Defense": 86,
      "Sp. Attack": 116,
      "Sp. Defense": 56,
      "Speed": 95
    }
  },
  {
    "id": 470,
    "name": {
      "english": "Leafeon",
      "japanese": "リーフィア",
      "chinese": "叶伊布",
      "french": "Phyllali"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 65,
      "Attack": 110,
      "Defense": 130,
      "Sp. Attack": 60,
      "Sp. Defense": 65,
      "Speed": 95
    }
  },
  {
    "id": 471,
    "name": {
      "english": "Glaceon",
      "japanese": "グレイシア",
      "chinese": "冰伊布",
      "french": "Givrali"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 65,
      "Attack": 60,
      "Defense": 110,
      "Sp. Attack": 130,
      "Sp. Defense": 95,
      "Speed": 65
    }
  },
  {
    "id": 472,
    "name": {
      "english": "Gliscor",
      "japanese": "グライオン",
      "chinese": "天蝎王",
      "french": "Scorvol"
    },
    "type": [
      "Ground",
      "Flying"
    ],
    "base": {
      "HP": 75,
      "Attack": 95,
      "Defense": 125,
      "Sp. Attack": 45,
      "Sp. Defense": 75,
      "Speed": 95
    }
  },
  {
    "id": 473,
    "name": {
      "english": "Mamoswine",
      "japanese": "マンムー",
      "chinese": "象牙猪",
      "french": "Mammochon"
    },
    "type": [
      "Ice",
      "Ground"
    ],
    "base": {
      "HP": 110,
      "Attack": 130,
      "Defense": 80,
      "Sp. Attack": 70,
      "Sp. Defense": 60,
      "Speed": 80
    }
  },
  {
    "id": 474,
    "name": {
      "english": "Porygon-Z",
      "japanese": "ポリゴンＺ",
      "chinese": "多边兽Ｚ",
      "french": "Porygon-Z"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 85,
      "Attack": 80,
      "Defense": 70,
      "Sp. Attack": 135,
      "Sp. Defense": 75,
      "Speed": 90
    }
  },
  {
    "id": 475,
    "name": {
      "english": "Gallade",
      "japanese": "エルレイド",
      "chinese": "艾路雷朵",
      "french": "Gallame"
    },
    "type": [
      "Psychic",
      "Fighting"
    ],
    "base": {
      "HP": 68,
      "Attack": 125,
      "Defense": 65,
      "Sp. Attack": 65,
      "Sp. Defense": 115,
      "Speed": 80
    }
  },
  {
    "id": 476,
    "name": {
      "english": "Probopass",
      "japanese": "ダイノーズ",
      "chinese": "大朝北鼻",
      "french": "Tarinorme"
    },
    "type": [
      "Rock",
      "Steel"
    ],
    "base": {
      "HP": 60,
      "Attack": 55,
      "Defense": 145,
      "Sp. Attack": 75,
      "Sp. Defense": 150,
      "Speed": 40
    }
  },
  {
    "id": 477,
    "name": {
      "english": "Dusknoir",
      "japanese": "ヨノワール",
      "chinese": "黑夜魔灵",
      "french": "Noctunoir"
    },
    "type": [
      "Ghost"
    ],
    "base": {
      "HP": 45,
      "Attack": 100,
      "Defense": 135,
      "Sp. Attack": 65,
      "Sp. Defense": 135,
      "Speed": 45
    }
  },
  {
    "id": 478,
    "name": {
      "english": "Froslass",
      "japanese": "ユキメノコ",
      "chinese": "雪妖女",
      "french": "Momartik"
    },
    "type": [
      "Ice",
      "Ghost"
    ],
    "base": {
      "HP": 70,
      "Attack": 80,
      "Defense": 70,
      "Sp. Attack": 80,
      "Sp. Defense": 70,
      "Speed": 110
    }
  },
  {
    "id": 479,
    "name": {
      "english": "Rotom",
      "japanese": "ロトム",
      "chinese": "洛托姆",
      "french": "Motisma"
    },
    "type": [
      "Electric",
      "Ghost"
    ],
    "base": {
      "HP": 50,
      "Attack": 50,
      "Defense": 77,
      "Sp. Attack": 95,
      "Sp. Defense": 77,
      "Speed": 91
    }
  },
  {
    "id": 480,
    "name": {
      "english": "Uxie",
      "japanese": "ユクシー",
      "chinese": "由克希",
      "french": "Créhelf"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 75,
      "Attack": 75,
      "Defense": 130,
      "Sp. Attack": 75,
      "Sp. Defense": 130,
      "Speed": 95
    }
  },
  {
    "id": 481,
    "name": {
      "english": "Mesprit",
      "japanese": "エムリット",
      "chinese": "艾姆利多",
      "french": "Créfollet"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 80,
      "Attack": 105,
      "Defense": 105,
      "Sp. Attack": 105,
      "Sp. Defense": 105,
      "Speed": 80
    }
  },
  {
    "id": 482,
    "name": {
      "english": "Azelf",
      "japanese": "アグノム",
      "chinese": "亚克诺姆",
      "french": "Créfadet"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 75,
      "Attack": 125,
      "Defense": 70,
      "Sp. Attack": 125,
      "Sp. Defense": 70,
      "Speed": 115
    }
  },
  {
    "id": 483,
    "name": {
      "english": "Dialga",
      "japanese": "ディアルガ",
      "chinese": "帝牙卢卡",
      "french": "Dialga"
    },
    "type": [
      "Steel",
      "Dragon"
    ],
    "base": {
      "HP": 100,
      "Attack": 120,
      "Defense": 120,
      "Sp. Attack": 150,
      "Sp. Defense": 100,
      "Speed": 90
    }
  },
  {
    "id": 484,
    "name": {
      "english": "Palkia",
      "japanese": "パルキア",
      "chinese": "帕路奇亚",
      "french": "Palkia"
    },
    "type": [
      "Water",
      "Dragon"
    ],
    "base": {
      "HP": 90,
      "Attack": 120,
      "Defense": 100,
      "Sp. Attack": 150,
      "Sp. Defense": 120,
      "Speed": 100
    }
  },
  {
    "id": 485,
    "name": {
      "english": "Heatran",
      "japanese": "ヒードラン",
      "chinese": "席多蓝恩",
      "french": "Heatran"
    },
    "type": [
      "Fire",
      "Steel"
    ],
    "base": {
      "HP": 91,
      "Attack": 90,
      "Defense": 106,
      "Sp. Attack": 130,
      "Sp. Defense": 106,
      "Speed": 77
    }
  },
  {
    "id": 486,
    "name": {
      "english": "Regigigas",
      "japanese": "レジギガス",
      "chinese": "雷吉奇卡斯",
      "french": "Regigigas"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 110,
      "Attack": 160,
      "Defense": 110,
      "Sp. Attack": 80,
      "Sp. Defense": 110,
      "Speed": 100
    }
  },
  {
    "id": 487,
    "name": {
      "english": "Giratina",
      "japanese": "ギラティナ",
      "chinese": "骑拉帝纳",
      "french": "Giratina"
    },
    "type": [
      "Ghost",
      "Dragon"
    ],
    "base": {
      "HP": 150,
      "Attack": 100,
      "Defense": 120,
      "Sp. Attack": 100,
      "Sp. Defense": 120,
      "Speed": 90
    }
  },
  {
    "id": 488,
    "name": {
      "english": "Cresselia",
      "japanese": "クレセリア",
      "chinese": "克雷色利亚",
      "french": "Cresselia"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 120,
      "Attack": 70,
      "Defense": 120,
      "Sp. Attack": 75,
      "Sp. Defense": 130,
      "Speed": 85
    }
  },
  {
    "id": 489,
    "name": {
      "english": "Phione",
      "japanese": "フィオネ",
      "chinese": "霏欧纳",
      "french": "Phione"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 80,
      "Attack": 80,
      "Defense": 80,
      "Sp. Attack": 80,
      "Sp. Defense": 80,
      "Speed": 80
    }
  },
  {
    "id": 490,
    "name": {
      "english": "Manaphy",
      "japanese": "マナフィ",
      "chinese": "玛纳霏",
      "french": "Manaphy"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 100,
      "Attack": 100,
      "Defense": 100,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      "Speed": 100
    }
  },
  {
    "id": 491,
    "name": {
      "english": "Darkrai",
      "japanese": "ダークライ",
      "chinese": "达克莱伊",
      "french": "Darkrai"
    },
    "type": [
      "Dark"
    ],
    "base": {
      "HP": 70,
      "Attack": 90,
      "Defense": 90,
      "Sp. Attack": 135,
      "Sp. Defense": 90,
      "Speed": 125
    }
  },
  {
    "id": 492,
    "name": {
      "english": "Shaymin",
      "japanese": "シェイミ",
      "chinese": "谢米",
      "french": "Shaymin"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 100,
      "Attack": 100,
      "Defense": 100,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      "Speed": 100
    }
  },
  {
    "id": 493,
    "name": {
      "english": "Arceus",
      "japanese": "アルセウス",
      "chinese": "阿尔宙斯",
      "french": "Arceus"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 120,
      "Attack": 120,
      "Defense": 120,
      "Sp. Attack": 120,
      "Sp. Defense": 120,
      "Speed": 120
    }
  },
  {
    "id": 494,
    "name": {
      "english": "Victini",
      "japanese": "ビクティニ",
      "chinese": "比克提尼",
      "french": "Victini"
    },
    "type": [
      "Psychic",
      "Fire"
    ],
    "base": {
      "HP": 100,
      "Attack": 100,
      "Defense": 100,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      "Speed": 100
    }
  },
  {
    "id": 495,
    "name": {
      "english": "Snivy",
      "japanese": "ツタージャ",
      "chinese": "藤藤蛇",
      "french": "Vipélierre"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 45,
      "Attack": 45,
      "Defense": 55,
      "Sp. Attack": 45,
      "Sp. Defense": 55,
      "Speed": 63
    }
  },
  {
    "id": 496,
    "name": {
      "english": "Servine",
      "japanese": "ジャノビー",
      "chinese": "青藤蛇",
      "french": "Lianaja"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 60,
      "Attack": 60,
      "Defense": 75,
      "Sp. Attack": 60,
      "Sp. Defense": 75,
      "Speed": 83
    }
  },
  {
    "id": 497,
    "name": {
      "english": "Serperior",
      "japanese": "ジャローダ",
      "chinese": "君主蛇",
      "french": "Majaspic"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 75,
      "Attack": 75,
      "Defense": 95,
      "Sp. Attack": 75,
      "Sp. Defense": 95,
      "Speed": 113
    }
  },
  {
    "id": 498,
    "name": {
      "english": "Tepig",
      "japanese": "ポカブ",
      "chinese": "暖暖猪",
      "french": "Gruikui"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 65,
      "Attack": 63,
      "Defense": 45,
      "Sp. Attack": 45,
      "Sp. Defense": 45,
      "Speed": 45
    }
  },
  {
    "id": 499,
    "name": {
      "english": "Pignite",
      "japanese": "チャオブー",
      "chinese": "炒炒猪",
      "french": "Grotichon"
    },
    "type": [
      "Fire",
      "Fighting"
    ],
    "base": {
      "HP": 90,
      "Attack": 93,
      "Defense": 55,
      "Sp. Attack": 70,
      "Sp. Defense": 55,
      "Speed": 55
    }
  },
  {
    "id": 500,
    "name": {
      "english": "Emboar",
      "japanese": "エンブオー",
      "chinese": "炎武王",
      "french": "Roitiflam"
    },
    "type": [
      "Fire",
      "Fighting"
    ],
    "base": {
      "HP": 110,
      "Attack": 123,
      "Defense": 65,
      "Sp. Attack": 100,
      "Sp. Defense": 65,
      "Speed": 65
    }
  },
  {
    "id": 501,
    "name": {
      "english": "Oshawott",
      "japanese": "ミジュマル",
      "chinese": "水水獭",
      "french": "Moustillon"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 55,
      "Attack": 55,
      "Defense": 45,
      "Sp. Attack": 63,
      "Sp. Defense": 45,
      "Speed": 45
    }
  },
  {
    "id": 502,
    "name": {
      "english": "Dewott",
      "japanese": "フタチマル",
      "chinese": "双刃丸",
      "french": "Mateloutre"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 75,
      "Attack": 75,
      "Defense": 60,
      "Sp. Attack": 83,
      "Sp. Defense": 60,
      "Speed": 60
    }
  },
  {
    "id": 503,
    "name": {
      "english": "Samurott",
      "japanese": "ダイケンキ",
      "chinese": "大剑鬼",
      "french": "Clamiral"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 95,
      "Attack": 100,
      "Defense": 85,
      "Sp. Attack": 108,
      "Sp. Defense": 70,
      "Speed": 70
    }
  },
  {
    "id": 504,
    "name": {
      "english": "Patrat",
      "japanese": "ミネズミ",
      "chinese": "探探鼠",
      "french": "Ratentif"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 45,
      "Attack": 55,
      "Defense": 39,
      "Sp. Attack": 35,
      "Sp. Defense": 39,
      "Speed": 42
    }
  },
  {
    "id": 505,
    "name": {
      "english": "Watchog",
      "japanese": "ミルホッグ",
      "chinese": "步哨鼠",
      "french": "Miradar"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 60,
      "Attack": 85,
      "Defense": 69,
      "Sp. Attack": 60,
      "Sp. Defense": 69,
      "Speed": 77
    }
  },
  {
    "id": 506,
    "name": {
      "english": "Lillipup",
      "japanese": "ヨーテリー",
      "chinese": "小约克",
      "french": "Ponchiot"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 45,
      "Attack": 60,
      "Defense": 45,
      "Sp. Attack": 25,
      "Sp. Defense": 45,
      "Speed": 55
    }
  },
  {
    "id": 507,
    "name": {
      "english": "Herdier",
      "japanese": "ハーデリア",
      "chinese": "哈约克",
      "french": "Ponchien"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 65,
      "Attack": 80,
      "Defense": 65,
      "Sp. Attack": 35,
      "Sp. Defense": 65,
      "Speed": 60
    }
  },
  {
    "id": 508,
    "name": {
      "english": "Stoutland",
      "japanese": "ムーランド",
      "chinese": "长毛狗",
      "french": "Mastouffe"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 85,
      "Attack": 110,
      "Defense": 90,
      "Sp. Attack": 45,
      "Sp. Defense": 90,
      "Speed": 80
    }
  },
  {
    "id": 509,
    "name": {
      "english": "Purrloin",
      "japanese": "チョロネコ",
      "chinese": "扒手猫",
      "french": "Chacripan"
    },
    "type": [
      "Dark"
    ],
    "base": {
      "HP": 41,
      "Attack": 50,
      "Defense": 37,
      "Sp. Attack": 50,
      "Sp. Defense": 37,
      "Speed": 66
    }
  },
  {
    "id": 510,
    "name": {
      "english": "Liepard",
      "japanese": "レパルダス",
      "chinese": "酷豹",
      "french": "Léopardus"
    },
    "type": [
      "Dark"
    ],
    "base": {
      "HP": 64,
      "Attack": 88,
      "Defense": 50,
      "Sp. Attack": 88,
      "Sp. Defense": 50,
      "Speed": 106
    }
  },
  {
    "id": 511,
    "name": {
      "english": "Pansage",
      "japanese": "ヤナップ",
      "chinese": "花椰猴",
      "french": "Feuillajou"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 50,
      "Attack": 53,
      "Defense": 48,
      "Sp. Attack": 53,
      "Sp. Defense": 48,
      "Speed": 64
    }
  },
  {
    "id": 512,
    "name": {
      "english": "Simisage",
      "japanese": "ヤナッキー",
      "chinese": "花椰猿",
      "french": "Feuiloutan"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 75,
      "Attack": 98,
      "Defense": 63,
      "Sp. Attack": 98,
      "Sp. Defense": 63,
      "Speed": 101
    }
  },
  {
    "id": 513,
    "name": {
      "english": "Pansear",
      "japanese": "バオップ",
      "chinese": "爆香猴",
      "french": "Flamajou"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 50,
      "Attack": 53,
      "Defense": 48,
      "Sp. Attack": 53,
      "Sp. Defense": 48,
      "Speed": 64
    }
  },
  {
    "id": 514,
    "name": {
      "english": "Simisear",
      "japanese": "バオッキー",
      "chinese": "爆香猿",
      "french": "Flamoutan"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 75,
      "Attack": 98,
      "Defense": 63,
      "Sp. Attack": 98,
      "Sp. Defense": 63,
      "Speed": 101
    }
  },
  {
    "id": 515,
    "name": {
      "english": "Panpour",
      "japanese": "ヒヤップ",
      "chinese": "冷水猴",
      "french": "Flotajou"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 50,
      "Attack": 53,
      "Defense": 48,
      "Sp. Attack": 53,
      "Sp. Defense": 48,
      "Speed": 64
    }
  },
  {
    "id": 516,
    "name": {
      "english": "Simipour",
      "japanese": "ヒヤッキー",
      "chinese": "冷水猿",
      "french": "Flotoutan"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 75,
      "Attack": 98,
      "Defense": 63,
      "Sp. Attack": 98,
      "Sp. Defense": 63,
      "Speed": 101
    }
  },
  {
    "id": 517,
    "name": {
      "english": "Munna",
      "japanese": "ムンナ",
      "chinese": "食梦梦",
      "french": "Munna"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 76,
      "Attack": 25,
      "Defense": 45,
      "Sp. Attack": 67,
      "Sp. Defense": 55,
      "Speed": 24
    }
  },
  {
    "id": 518,
    "name": {
      "english": "Musharna",
      "japanese": "ムシャーナ",
      "chinese": "梦梦蚀",
      "french": "Mushana"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 116,
      "Attack": 55,
      "Defense": 85,
      "Sp. Attack": 107,
      "Sp. Defense": 95,
      "Speed": 29
    }
  },
  {
    "id": 519,
    "name": {
      "english": "Pidove",
      "japanese": "マメパト",
      "chinese": "豆豆鸽",
      "french": "Poichigeon"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 50,
      "Attack": 55,
      "Defense": 50,
      "Sp. Attack": 36,
      "Sp. Defense": 30,
      "Speed": 43
    }
  },
  {
    "id": 520,
    "name": {
      "english": "Tranquill",
      "japanese": "ハトーボー",
      "chinese": "咕咕鸽",
      "french": "Colombeau"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 62,
      "Attack": 77,
      "Defense": 62,
      "Sp. Attack": 50,
      "Sp. Defense": 42,
      "Speed": 65
    }
  },
  {
    "id": 521,
    "name": {
      "english": "Unfezant",
      "japanese": "ケンホロウ",
      "chinese": "高傲雉鸡",
      "french": "Déflaisan"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 80,
      "Attack": 115,
      "Defense": 80,
      "Sp. Attack": 65,
      "Sp. Defense": 55,
      "Speed": 93
    }
  },
  {
    "id": 522,
    "name": {
      "english": "Blitzle",
      "japanese": "シママ",
      "chinese": "斑斑马",
      "french": "Zébibron"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 45,
      "Attack": 60,
      "Defense": 32,
      "Sp. Attack": 50,
      "Sp. Defense": 32,
      "Speed": 76
    }
  },
  {
    "id": 523,
    "name": {
      "english": "Zebstrika",
      "japanese": "ゼブライカ",
      "chinese": "雷电斑马",
      "french": "Zéblitz"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 75,
      "Attack": 100,
      "Defense": 63,
      "Sp. Attack": 80,
      "Sp. Defense": 63,
      "Speed": 116
    }
  },
  {
    "id": 524,
    "name": {
      "english": "Roggenrola",
      "japanese": "ダンゴロ",
      "chinese": "石丸子",
      "french": "Nodulithe"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 55,
      "Attack": 75,
      "Defense": 85,
      "Sp. Attack": 25,
      "Sp. Defense": 25,
      "Speed": 15
    }
  },
  {
    "id": 525,
    "name": {
      "english": "Boldore",
      "japanese": "ガントル",
      "chinese": "地幔岩",
      "french": "Géolithe"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 70,
      "Attack": 105,
      "Defense": 105,
      "Sp. Attack": 50,
      "Sp. Defense": 40,
      "Speed": 20
    }
  },
  {
    "id": 526,
    "name": {
      "english": "Gigalith",
      "japanese": "ギガイアス",
      "chinese": "庞岩怪",
      "french": "Gigalithe"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 85,
      "Attack": 135,
      "Defense": 130,
      "Sp. Attack": 60,
      "Sp. Defense": 80,
      "Speed": 25
    }
  },
  {
    "id": 527,
    "name": {
      "english": "Woobat",
      "japanese": "コロモリ",
      "chinese": "滚滚蝙蝠",
      "french": "Chovsourir"
    },
    "type": [
      "Psychic",
      "Flying"
    ],
    "base": {
      "HP": 65,
      "Attack": 45,
      "Defense": 43,
      "Sp. Attack": 55,
      "Sp. Defense": 43,
      "Speed": 72
    }
  },
  {
    "id": 528,
    "name": {
      "english": "Swoobat",
      "japanese": "ココロモリ",
      "chinese": "心蝙蝠",
      "french": "Rhinolove"
    },
    "type": [
      "Psychic",
      "Flying"
    ],
    "base": {
      "HP": 67,
      "Attack": 57,
      "Defense": 55,
      "Sp. Attack": 77,
      "Sp. Defense": 55,
      "Speed": 114
    }
  },
  {
    "id": 529,
    "name": {
      "english": "Drilbur",
      "japanese": "モグリュー",
      "chinese": "螺钉地鼠",
      "french": "Rototaupe"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 60,
      "Attack": 85,
      "Defense": 40,
      "Sp. Attack": 30,
      "Sp. Defense": 45,
      "Speed": 68
    }
  },
  {
    "id": 530,
    "name": {
      "english": "Excadrill",
      "japanese": "ドリュウズ",
      "chinese": "龙头地鼠",
      "french": "Minotaupe"
    },
    "type": [
      "Ground",
      "Steel"
    ],
    "base": {
      "HP": 110,
      "Attack": 135,
      "Defense": 60,
      "Sp. Attack": 50,
      "Sp. Defense": 65,
      "Speed": 88
    }
  },
  {
    "id": 531,
    "name": {
      "english": "Audino",
      "japanese": "タブンネ",
      "chinese": "差不多娃娃",
      "french": "Nanméouïe"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 103,
      "Attack": 60,
      "Defense": 86,
      "Sp. Attack": 60,
      "Sp. Defense": 86,
      "Speed": 50
    }
  },
  {
    "id": 532,
    "name": {
      "english": "Timburr",
      "japanese": "ドッコラー",
      "chinese": "搬运小匠",
      "french": "Charpenti"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 75,
      "Attack": 80,
      "Defense": 55,
      "Sp. Attack": 25,
      "Sp. Defense": 35,
      "Speed": 35
    }
  },
  {
    "id": 533,
    "name": {
      "english": "Gurdurr",
      "japanese": "ドテッコツ",
      "chinese": "铁骨土人",
      "french": "Ouvrifier"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 85,
      "Attack": 105,
      "Defense": 85,
      "Sp. Attack": 40,
      "Sp. Defense": 50,
      "Speed": 40
    }
  },
  {
    "id": 534,
    "name": {
      "english": "Conkeldurr",
      "japanese": "ローブシン",
      "chinese": "修建老匠",
      "french": "Bétochef"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 105,
      "Attack": 140,
      "Defense": 95,
      "Sp. Attack": 55,
      "Sp. Defense": 65,
      "Speed": 45
    }
  },
  {
    "id": 535,
    "name": {
      "english": "Tympole",
      "japanese": "オタマロ",
      "chinese": "圆蝌蚪",
      "french": "Tritonde"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 50,
      "Attack": 50,
      "Defense": 40,
      "Sp. Attack": 50,
      "Sp. Defense": 40,
      "Speed": 64
    }
  },
  {
    "id": 536,
    "name": {
      "english": "Palpitoad",
      "japanese": "ガマガル",
      "chinese": "蓝蟾蜍",
      "french": "Batracné"
    },
    "type": [
      "Water",
      "Ground"
    ],
    "base": {
      "HP": 75,
      "Attack": 65,
      "Defense": 55,
      "Sp. Attack": 65,
      "Sp. Defense": 55,
      "Speed": 69
    }
  },
  {
    "id": 537,
    "name": {
      "english": "Seismitoad",
      "japanese": "ガマゲロゲ",
      "chinese": "蟾蜍王",
      "french": "Crapustule"
    },
    "type": [
      "Water",
      "Ground"
    ],
    "base": {
      "HP": 105,
      "Attack": 95,
      "Defense": 75,
      "Sp. Attack": 85,
      "Sp. Defense": 75,
      "Speed": 74
    }
  },
  {
    "id": 538,
    "name": {
      "english": "Throh",
      "japanese": "ナゲキ",
      "chinese": "投摔鬼",
      "french": "Judokrak"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 120,
      "Attack": 100,
      "Defense": 85,
      "Sp. Attack": 30,
      "Sp. Defense": 85,
      "Speed": 45
    }
  },
  {
    "id": 539,
    "name": {
      "english": "Sawk",
      "japanese": "ダゲキ",
      "chinese": "打击鬼",
      "french": "Karaclée"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 75,
      "Attack": 125,
      "Defense": 75,
      "Sp. Attack": 30,
      "Sp. Defense": 75,
      "Speed": 85
    }
  },
  {
    "id": 540,
    "name": {
      "english": "Sewaddle",
      "japanese": "クルミル",
      "chinese": "虫宝包",
      "french": "Larveyette"
    },
    "type": [
      "Bug",
      "Grass"
    ],
    "base": {
      "HP": 45,
      "Attack": 53,
      "Defense": 70,
      "Sp. Attack": 40,
      "Sp. Defense": 60,
      "Speed": 42
    }
  },
  {
    "id": 541,
    "name": {
      "english": "Swadloon",
      "japanese": "クルマユ",
      "chinese": "宝包茧",
      "french": "Couverdure"
    },
    "type": [
      "Bug",
      "Grass"
    ],
    "base": {
      "HP": 55,
      "Attack": 63,
      "Defense": 90,
      "Sp. Attack": 50,
      "Sp. Defense": 80,
      "Speed": 42
    }
  },
  {
    "id": 542,
    "name": {
      "english": "Leavanny",
      "japanese": "ハハコモリ",
      "chinese": "保姆虫",
      "french": "Manternel"
    },
    "type": [
      "Bug",
      "Grass"
    ],
    "base": {
      "HP": 75,
      "Attack": 103,
      "Defense": 80,
      "Sp. Attack": 70,
      "Sp. Defense": 80,
      "Speed": 92
    }
  },
  {
    "id": 543,
    "name": {
      "english": "Venipede",
      "japanese": "フシデ",
      "chinese": "百足蜈蚣",
      "french": "Venipatte"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 30,
      "Attack": 45,
      "Defense": 59,
      "Sp. Attack": 30,
      "Sp. Defense": 39,
      "Speed": 57
    }
  },
  {
    "id": 544,
    "name": {
      "english": "Whirlipede",
      "japanese": "ホイーガ",
      "chinese": "车轮球",
      "french": "Scobolide"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 40,
      "Attack": 55,
      "Defense": 99,
      "Sp. Attack": 40,
      "Sp. Defense": 79,
      "Speed": 47
    }
  },
  {
    "id": 545,
    "name": {
      "english": "Scolipede",
      "japanese": "ペンドラー",
      "chinese": "蜈蚣王",
      "french": "Brutapode"
    },
    "type": [
      "Bug",
      "Poison"
    ],
    "base": {
      "HP": 60,
      "Attack": 100,
      "Defense": 89,
      "Sp. Attack": 55,
      "Sp. Defense": 69,
      "Speed": 112
    }
  },
  {
    "id": 546,
    "name": {
      "english": "Cottonee",
      "japanese": "モンメン",
      "chinese": "木棉球",
      "french": "Doudouvet"
    },
    "type": [
      "Grass",
      "Fairy"
    ],
    "base": {
      "HP": 40,
      "Attack": 27,
      "Defense": 60,
      "Sp. Attack": 37,
      "Sp. Defense": 50,
      "Speed": 66
    }
  },
  {
    "id": 547,
    "name": {
      "english": "Whimsicott",
      "japanese": "エルフーン",
      "chinese": "风妖精",
      "french": "Farfaduvet"
    },
    "type": [
      "Grass",
      "Fairy"
    ],
    "base": {
      "HP": 60,
      "Attack": 67,
      "Defense": 85,
      "Sp. Attack": 77,
      "Sp. Defense": 75,
      "Speed": 116
    }
  },
  {
    "id": 548,
    "name": {
      "english": "Petilil",
      "japanese": "チュリネ",
      "chinese": "百合根娃娃",
      "french": "Chlorobule"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 45,
      "Attack": 35,
      "Defense": 50,
      "Sp. Attack": 70,
      "Sp. Defense": 50,
      "Speed": 30
    }
  },
  {
    "id": 549,
    "name": {
      "english": "Lilligant",
      "japanese": "ドレディア",
      "chinese": "裙儿小姐",
      "french": "Fragilady"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 70,
      "Attack": 60,
      "Defense": 75,
      "Sp. Attack": 110,
      "Sp. Defense": 75,
      "Speed": 90
    }
  },
  {
    "id": 550,
    "name": {
      "english": "Basculin",
      "japanese": "バスラオ",
      "chinese": "野蛮鲈鱼",
      "french": "Bargantua"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 70,
      "Attack": 92,
      "Defense": 65,
      "Sp. Attack": 80,
      "Sp. Defense": 55,
      "Speed": 98
    }
  },
  {
    "id": 551,
    "name": {
      "english": "Sandile",
      "japanese": "メグロコ",
      "chinese": "黑眼鳄",
      "french": "Mascaïman"
    },
    "type": [
      "Ground",
      "Dark"
    ],
    "base": {
      "HP": 50,
      "Attack": 72,
      "Defense": 35,
      "Sp. Attack": 35,
      "Sp. Defense": 35,
      "Speed": 65
    }
  },
  {
    "id": 552,
    "name": {
      "english": "Krokorok",
      "japanese": "ワルビル",
      "chinese": "混混鳄",
      "french": "Escroco"
    },
    "type": [
      "Ground",
      "Dark"
    ],
    "base": {
      "HP": 60,
      "Attack": 82,
      "Defense": 45,
      "Sp. Attack": 45,
      "Sp. Defense": 45,
      "Speed": 74
    }
  },
  {
    "id": 553,
    "name": {
      "english": "Krookodile",
      "japanese": "ワルビアル",
      "chinese": "流氓鳄",
      "french": "Crocorible"
    },
    "type": [
      "Ground",
      "Dark"
    ],
    "base": {
      "HP": 95,
      "Attack": 117,
      "Defense": 80,
      "Sp. Attack": 65,
      "Sp. Defense": 70,
      "Speed": 92
    }
  },
  {
    "id": 554,
    "name": {
      "english": "Darumaka",
      "japanese": "ダルマッカ",
      "chinese": "火红不倒翁",
      "french": "Darumarond"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 70,
      "Attack": 90,
      "Defense": 45,
      "Sp. Attack": 15,
      "Sp. Defense": 45,
      "Speed": 50
    }
  },
  {
    "id": 555,
    "name": {
      "english": "Darmanitan",
      "japanese": "ヒヒダルマ",
      "chinese": "达摩狒狒",
      "french": "Darumacho"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 105,
      "Attack": 140,
      "Defense": 55,
      "Sp. Attack": 30,
      "Sp. Defense": 55,
      "Speed": 95
    }
  },
  {
    "id": 556,
    "name": {
      "english": "Maractus",
      "japanese": "マラカッチ",
      "chinese": "沙铃仙人掌",
      "french": "Maracachi"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 75,
      "Attack": 86,
      "Defense": 67,
      "Sp. Attack": 106,
      "Sp. Defense": 67,
      "Speed": 60
    }
  },
  {
    "id": 557,
    "name": {
      "english": "Dwebble",
      "japanese": "イシズマイ",
      "chinese": "石居蟹",
      "french": "Crabicoque"
    },
    "type": [
      "Bug",
      "Rock"
    ],
    "base": {
      "HP": 50,
      "Attack": 65,
      "Defense": 85,
      "Sp. Attack": 35,
      "Sp. Defense": 35,
      "Speed": 55
    }
  },
  {
    "id": 558,
    "name": {
      "english": "Crustle",
      "japanese": "イワパレス",
      "chinese": "岩殿居蟹",
      "french": "Crabaraque"
    },
    "type": [
      "Bug",
      "Rock"
    ],
    "base": {
      "HP": 70,
      "Attack": 105,
      "Defense": 125,
      "Sp. Attack": 65,
      "Sp. Defense": 75,
      "Speed": 45
    }
  },
  {
    "id": 559,
    "name": {
      "english": "Scraggy",
      "japanese": "ズルッグ",
      "chinese": "滑滑小子",
      "french": "Baggiguane"
    },
    "type": [
      "Dark",
      "Fighting"
    ],
    "base": {
      "HP": 50,
      "Attack": 75,
      "Defense": 70,
      "Sp. Attack": 35,
      "Sp. Defense": 70,
      "Speed": 48
    }
  },
  {
    "id": 560,
    "name": {
      "english": "Scrafty",
      "japanese": "ズルズキン",
      "chinese": "头巾混混",
      "french": "Baggaïd"
    },
    "type": [
      "Dark",
      "Fighting"
    ],
    "base": {
      "HP": 65,
      "Attack": 90,
      "Defense": 115,
      "Sp. Attack": 45,
      "Sp. Defense": 115,
      "Speed": 58
    }
  },
  {
    "id": 561,
    "name": {
      "english": "Sigilyph",
      "japanese": "シンボラー",
      "chinese": "象征鸟",
      "french": "Cryptéro"
    },
    "type": [
      "Psychic",
      "Flying"
    ],
    "base": {
      "HP": 72,
      "Attack": 58,
      "Defense": 80,
      "Sp. Attack": 103,
      "Sp. Defense": 80,
      "Speed": 97
    }
  },
  {
    "id": 562,
    "name": {
      "english": "Yamask",
      "japanese": "デスマス",
      "chinese": "哭哭面具",
      "french": "Tutafeh"
    },
    "type": [
      "Ghost"
    ],
    "base": {
      "HP": 38,
      "Attack": 30,
      "Defense": 85,
      "Sp. Attack": 55,
      "Sp. Defense": 65,
      "Speed": 30
    }
  },
  {
    "id": 563,
    "name": {
      "english": "Cofagrigus",
      "japanese": "デスカーン",
      "chinese": "死神棺",
      "french": "Tutankafer"
    },
    "type": [
      "Ghost"
    ],
    "base": {
      "HP": 58,
      "Attack": 50,
      "Defense": 145,
      "Sp. Attack": 95,
      "Sp. Defense": 105,
      "Speed": 30
    }
  },
  {
    "id": 564,
    "name": {
      "english": "Tirtouga",
      "japanese": "プロトーガ",
      "chinese": "原盖海龟",
      "french": "Carapagos"
    },
    "type": [
      "Water",
      "Rock"
    ],
    "base": {
      "HP": 54,
      "Attack": 78,
      "Defense": 103,
      "Sp. Attack": 53,
      "Sp. Defense": 45,
      "Speed": 22
    }
  },
  {
    "id": 565,
    "name": {
      "english": "Carracosta",
      "japanese": "アバゴーラ",
      "chinese": "肋骨海龟",
      "french": "Mégapagos"
    },
    "type": [
      "Water",
      "Rock"
    ],
    "base": {
      "HP": 74,
      "Attack": 108,
      "Defense": 133,
      "Sp. Attack": 83,
      "Sp. Defense": 65,
      "Speed": 32
    }
  },
  {
    "id": 566,
    "name": {
      "english": "Archen",
      "japanese": "アーケン",
      "chinese": "始祖小鸟",
      "french": "Arkéapti"
    },
    "type": [
      "Rock",
      "Flying"
    ],
    "base": {
      "HP": 55,
      "Attack": 112,
      "Defense": 45,
      "Sp. Attack": 74,
      "Sp. Defense": 45,
      "Speed": 70
    }
  },
  {
    "id": 567,
    "name": {
      "english": "Archeops",
      "japanese": "アーケオス",
      "chinese": "始祖大鸟",
      "french": "Aéroptéryx"
    },
    "type": [
      "Rock",
      "Flying"
    ],
    "base": {
      "HP": 75,
      "Attack": 140,
      "Defense": 65,
      "Sp. Attack": 112,
      "Sp. Defense": 65,
      "Speed": 110
    }
  },
  {
    "id": 568,
    "name": {
      "english": "Trubbish",
      "japanese": "ヤブクロン",
      "chinese": "破破袋",
      "french": "Miamiasme"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 50,
      "Attack": 50,
      "Defense": 62,
      "Sp. Attack": 40,
      "Sp. Defense": 62,
      "Speed": 65
    }
  },
  {
    "id": 569,
    "name": {
      "english": "Garbodor",
      "japanese": "ダストダス",
      "chinese": "灰尘山",
      "french": "Miasmax"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 80,
      "Attack": 95,
      "Defense": 82,
      "Sp. Attack": 60,
      "Sp. Defense": 82,
      "Speed": 75
    }
  },
  {
    "id": 570,
    "name": {
      "english": "Zorua",
      "japanese": "ゾロア",
      "chinese": "索罗亚",
      "french": "Zorua"
    },
    "type": [
      "Dark"
    ],
    "base": {
      "HP": 40,
      "Attack": 65,
      "Defense": 40,
      "Sp. Attack": 80,
      "Sp. Defense": 40,
      "Speed": 65
    }
  },
  {
    "id": 571,
    "name": {
      "english": "Zoroark",
      "japanese": "ゾロアーク",
      "chinese": "索罗亚克",
      "french": "Zoroark"
    },
    "type": [
      "Dark"
    ],
    "base": {
      "HP": 60,
      "Attack": 105,
      "Defense": 60,
      "Sp. Attack": 120,
      "Sp. Defense": 60,
      "Speed": 105
    }
  },
  {
    "id": 572,
    "name": {
      "english": "Minccino",
      "japanese": "チラーミィ",
      "chinese": "泡沫栗鼠",
      "french": "Chinchidou"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 55,
      "Attack": 50,
      "Defense": 40,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 75
    }
  },
  {
    "id": 573,
    "name": {
      "english": "Cinccino",
      "japanese": "チラチーノ",
      "chinese": "奇诺栗鼠",
      "french": "Pashmilla"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 75,
      "Attack": 95,
      "Defense": 60,
      "Sp. Attack": 65,
      "Sp. Defense": 60,
      "Speed": 115
    }
  },
  {
    "id": 574,
    "name": {
      "english": "Gothita",
      "japanese": "ゴチム",
      "chinese": "哥德宝宝",
      "french": "Scrutella"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 45,
      "Attack": 30,
      "Defense": 50,
      "Sp. Attack": 55,
      "Sp. Defense": 65,
      "Speed": 45
    }
  },
  {
    "id": 575,
    "name": {
      "english": "Gothorita",
      "japanese": "ゴチミル",
      "chinese": "哥德小童",
      "french": "Mesmérella"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 60,
      "Attack": 45,
      "Defense": 70,
      "Sp. Attack": 75,
      "Sp. Defense": 85,
      "Speed": 55
    }
  },
  {
    "id": 576,
    "name": {
      "english": "Gothitelle",
      "japanese": "ゴチルゼル",
      "chinese": "哥德小姐",
      "french": "Sidérella"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 70,
      "Attack": 55,
      "Defense": 95,
      "Sp. Attack": 95,
      "Sp. Defense": 110,
      "Speed": 65
    }
  },
  {
    "id": 577,
    "name": {
      "english": "Solosis",
      "japanese": "ユニラン",
      "chinese": "单卵细胞球",
      "french": "Nucléos"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 45,
      "Attack": 30,
      "Defense": 40,
      "Sp. Attack": 105,
      "Sp. Defense": 50,
      "Speed": 20
    }
  },
  {
    "id": 578,
    "name": {
      "english": "Duosion",
      "japanese": "ダブラン",
      "chinese": "双卵细胞球",
      "french": "Méios"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 65,
      "Attack": 40,
      "Defense": 50,
      "Sp. Attack": 125,
      "Sp. Defense": 60,
      "Speed": 30
    }
  },
  {
    "id": 579,
    "name": {
      "english": "Reuniclus",
      "japanese": "ランクルス",
      "chinese": "人造细胞卵",
      "french": "Symbios"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 110,
      "Attack": 65,
      "Defense": 75,
      "Sp. Attack": 125,
      "Sp. Defense": 85,
      "Speed": 30
    }
  },
  {
    "id": 580,
    "name": {
      "english": "Ducklett",
      "japanese": "コアルヒー",
      "chinese": "鸭宝宝",
      "french": "Couaneton"
    },
    "type": [
      "Water",
      "Flying"
    ],
    "base": {
      "HP": 62,
      "Attack": 44,
      "Defense": 50,
      "Sp. Attack": 44,
      "Sp. Defense": 50,
      "Speed": 55
    }
  },
  {
    "id": 581,
    "name": {
      "english": "Swanna",
      "japanese": "スワンナ",
      "chinese": "舞天鹅",
      "french": "Lakmécygne"
    },
    "type": [
      "Water",
      "Flying"
    ],
    "base": {
      "HP": 75,
      "Attack": 87,
      "Defense": 63,
      "Sp. Attack": 87,
      "Sp. Defense": 63,
      "Speed": 98
    }
  },
  {
    "id": 582,
    "name": {
      "english": "Vanillite",
      "japanese": "バニプッチ",
      "chinese": "迷你冰",
      "french": "Sorbébé"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 36,
      "Attack": 50,
      "Defense": 50,
      "Sp. Attack": 65,
      "Sp. Defense": 60,
      "Speed": 44
    }
  },
  {
    "id": 583,
    "name": {
      "english": "Vanillish",
      "japanese": "バニリッチ",
      "chinese": "多多冰",
      "french": "Sorboul"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 51,
      "Attack": 65,
      "Defense": 65,
      "Sp. Attack": 80,
      "Sp. Defense": 75,
      "Speed": 59
    }
  },
  {
    "id": 584,
    "name": {
      "english": "Vanilluxe",
      "japanese": "バイバニラ",
      "chinese": "双倍多多冰",
      "french": "Sorbouboul"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 71,
      "Attack": 95,
      "Defense": 85,
      "Sp. Attack": 110,
      "Sp. Defense": 95,
      "Speed": 79
    }
  },
  {
    "id": 585,
    "name": {
      "english": "Deerling",
      "japanese": "シキジカ",
      "chinese": "四季鹿",
      "french": "Vivaldaim"
    },
    "type": [
      "Normal",
      "Grass"
    ],
    "base": {
      "HP": 60,
      "Attack": 60,
      "Defense": 50,
      "Sp. Attack": 40,
      "Sp. Defense": 50,
      "Speed": 75
    }
  },
  {
    "id": 586,
    "name": {
      "english": "Sawsbuck",
      "japanese": "メブキジカ",
      "chinese": "萌芽鹿",
      "french": "Haydaim"
    },
    "type": [
      "Normal",
      "Grass"
    ],
    "base": {
      "HP": 80,
      "Attack": 100,
      "Defense": 70,
      "Sp. Attack": 60,
      "Sp. Defense": 70,
      "Speed": 95
    }
  },
  {
    "id": 587,
    "name": {
      "english": "Emolga",
      "japanese": "エモンガ",
      "chinese": "电飞鼠",
      "french": "Emolga"
    },
    "type": [
      "Electric",
      "Flying"
    ],
    "base": {
      "HP": 55,
      "Attack": 75,
      "Defense": 60,
      "Sp. Attack": 75,
      "Sp. Defense": 60,
      "Speed": 103
    }
  },
  {
    "id": 588,
    "name": {
      "english": "Karrablast",
      "japanese": "カブルモ",
      "chinese": "盖盖虫",
      "french": "Carabing"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 50,
      "Attack": 75,
      "Defense": 45,
      "Sp. Attack": 40,
      "Sp. Defense": 45,
      "Speed": 60
    }
  },
  {
    "id": 589,
    "name": {
      "english": "Escavalier",
      "japanese": "シュバルゴ",
      "chinese": "骑士蜗牛",
      "french": "Lançargot"
    },
    "type": [
      "Bug",
      "Steel"
    ],
    "base": {
      "HP": 70,
      "Attack": 135,
      "Defense": 105,
      "Sp. Attack": 60,
      "Sp. Defense": 105,
      "Speed": 20
    }
  },
  {
    "id": 590,
    "name": {
      "english": "Foongus",
      "japanese": "タマゲタケ",
      "chinese": "哎呀球菇",
      "french": "Trompignon"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 69,
      "Attack": 55,
      "Defense": 45,
      "Sp. Attack": 55,
      "Sp. Defense": 55,
      "Speed": 15
    }
  },
  {
    "id": 591,
    "name": {
      "english": "Amoonguss",
      "japanese": "モロバレル",
      "chinese": "败露球菇",
      "french": "Gaulet"
    },
    "type": [
      "Grass",
      "Poison"
    ],
    "base": {
      "HP": 114,
      "Attack": 85,
      "Defense": 70,
      "Sp. Attack": 85,
      "Sp. Defense": 80,
      "Speed": 30
    }
  },
  {
    "id": 592,
    "name": {
      "english": "Frillish",
      "japanese": "プルリル",
      "chinese": "轻飘飘",
      "french": "Viskuse"
    },
    "type": [
      "Water",
      "Ghost"
    ],
    "base": {
      "HP": 55,
      "Attack": 40,
      "Defense": 50,
      "Sp. Attack": 65,
      "Sp. Defense": 85,
      "Speed": 40
    }
  },
  {
    "id": 593,
    "name": {
      "english": "Jellicent",
      "japanese": "ブルンゲル",
      "chinese": "胖嘟嘟",
      "french": "Moyade"
    },
    "type": [
      "Water",
      "Ghost"
    ],
    "base": {
      "HP": 100,
      "Attack": 60,
      "Defense": 70,
      "Sp. Attack": 85,
      "Sp. Defense": 105,
      "Speed": 60
    }
  },
  {
    "id": 594,
    "name": {
      "english": "Alomomola",
      "japanese": "ママンボウ",
      "chinese": "保姆曼波",
      "french": "Mamanbo"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 165,
      "Attack": 75,
      "Defense": 80,
      "Sp. Attack": 40,
      "Sp. Defense": 45,
      "Speed": 65
    }
  },
  {
    "id": 595,
    "name": {
      "english": "Joltik",
      "japanese": "バチュル",
      "chinese": "电电虫",
      "french": "Statitik"
    },
    "type": [
      "Bug",
      "Electric"
    ],
    "base": {
      "HP": 50,
      "Attack": 47,
      "Defense": 50,
      "Sp. Attack": 57,
      "Sp. Defense": 50,
      "Speed": 65
    }
  },
  {
    "id": 596,
    "name": {
      "english": "Galvantula",
      "japanese": "デンチュラ",
      "chinese": "电蜘蛛",
      "french": "Mygavolt"
    },
    "type": [
      "Bug",
      "Electric"
    ],
    "base": {
      "HP": 70,
      "Attack": 77,
      "Defense": 60,
      "Sp. Attack": 97,
      "Sp. Defense": 60,
      "Speed": 108
    }
  },
  {
    "id": 597,
    "name": {
      "english": "Ferroseed",
      "japanese": "テッシード",
      "chinese": "种子铁球",
      "french": "Grindur"
    },
    "type": [
      "Grass",
      "Steel"
    ],
    "base": {
      "HP": 44,
      "Attack": 50,
      "Defense": 91,
      "Sp. Attack": 24,
      "Sp. Defense": 86,
      "Speed": 10
    }
  },
  {
    "id": 598,
    "name": {
      "english": "Ferrothorn",
      "japanese": "ナットレイ",
      "chinese": "坚果哑铃",
      "french": "Noacier"
    },
    "type": [
      "Grass",
      "Steel"
    ],
    "base": {
      "HP": 74,
      "Attack": 94,
      "Defense": 131,
      "Sp. Attack": 54,
      "Sp. Defense": 116,
      "Speed": 20
    }
  },
  {
    "id": 599,
    "name": {
      "english": "Klink",
      "japanese": "ギアル",
      "chinese": "齿轮儿",
      "french": "Tic"
    },
    "type": [
      "Steel"
    ],
    "base": {
      "HP": 40,
      "Attack": 55,
      "Defense": 70,
      "Sp. Attack": 45,
      "Sp. Defense": 60,
      "Speed": 30
    }
  },
  {
    "id": 600,
    "name": {
      "english": "Klang",
      "japanese": "ギギアル",
      "chinese": "齿轮组",
      "french": "Clic"
    },
    "type": [
      "Steel"
    ],
    "base": {
      "HP": 60,
      "Attack": 80,
      "Defense": 95,
      "Sp. Attack": 70,
      "Sp. Defense": 85,
      "Speed": 50
    }
  },
  {
    "id": 601,
    "name": {
      "english": "Klinklang",
      "japanese": "ギギギアル",
      "chinese": "齿轮怪",
      "french": "Cliticlic"
    },
    "type": [
      "Steel"
    ],
    "base": {
      "HP": 60,
      "Attack": 100,
      "Defense": 115,
      "Sp. Attack": 70,
      "Sp. Defense": 85,
      "Speed": 90
    }
  },
  {
    "id": 602,
    "name": {
      "english": "Tynamo",
      "japanese": "シビシラス",
      "chinese": "麻麻小鱼",
      "french": "Anchwatt"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 35,
      "Attack": 55,
      "Defense": 40,
      "Sp. Attack": 45,
      "Sp. Defense": 40,
      "Speed": 60
    }
  },
  {
    "id": 603,
    "name": {
      "english": "Eelektrik",
      "japanese": "シビビール",
      "chinese": "麻麻鳗",
      "french": "Lampéroie"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 65,
      "Attack": 85,
      "Defense": 70,
      "Sp. Attack": 75,
      "Sp. Defense": 70,
      "Speed": 40
    }
  },
  {
    "id": 604,
    "name": {
      "english": "Eelektross",
      "japanese": "シビルドン",
      "chinese": "麻麻鳗鱼王",
      "french": "Ohmassacre"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 85,
      "Attack": 115,
      "Defense": 80,
      "Sp. Attack": 105,
      "Sp. Defense": 80,
      "Speed": 50
    }
  },
  {
    "id": 605,
    "name": {
      "english": "Elgyem",
      "japanese": "リグレー",
      "chinese": "小灰怪",
      "french": "Lewsor"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 55,
      "Attack": 55,
      "Defense": 55,
      "Sp. Attack": 85,
      "Sp. Defense": 55,
      "Speed": 30
    }
  },
  {
    "id": 606,
    "name": {
      "english": "Beheeyem",
      "japanese": "オーベム",
      "chinese": "大宇怪",
      "french": "Neitram"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 75,
      "Attack": 75,
      "Defense": 75,
      "Sp. Attack": 125,
      "Sp. Defense": 95,
      "Speed": 40
    }
  },
  {
    "id": 607,
    "name": {
      "english": "Litwick",
      "japanese": "ヒトモシ",
      "chinese": "烛光灵",
      "french": "Funécire"
    },
    "type": [
      "Ghost",
      "Fire"
    ],
    "base": {
      "HP": 50,
      "Attack": 30,
      "Defense": 55,
      "Sp. Attack": 65,
      "Sp. Defense": 55,
      "Speed": 20
    }
  },
  {
    "id": 608,
    "name": {
      "english": "Lampent",
      "japanese": "ランプラー",
      "chinese": "灯火幽灵",
      "french": "Mélancolux"
    },
    "type": [
      "Ghost",
      "Fire"
    ],
    "base": {
      "HP": 60,
      "Attack": 40,
      "Defense": 60,
      "Sp. Attack": 95,
      "Sp. Defense": 60,
      "Speed": 55
    }
  },
  {
    "id": 609,
    "name": {
      "english": "Chandelure",
      "japanese": "シャンデラ",
      "chinese": "水晶灯火灵",
      "french": "Lugulabre"
    },
    "type": [
      "Ghost",
      "Fire"
    ],
    "base": {
      "HP": 60,
      "Attack": 55,
      "Defense": 90,
      "Sp. Attack": 145,
      "Sp. Defense": 90,
      "Speed": 80
    }
  },
  {
    "id": 610,
    "name": {
      "english": "Axew",
      "japanese": "キバゴ",
      "chinese": "牙牙",
      "french": "Coupenotte"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 46,
      "Attack": 87,
      "Defense": 60,
      "Sp. Attack": 30,
      "Sp. Defense": 40,
      "Speed": 57
    }
  },
  {
    "id": 611,
    "name": {
      "english": "Fraxure",
      "japanese": "オノンド",
      "chinese": "斧牙龙",
      "french": "Incisache"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 66,
      "Attack": 117,
      "Defense": 70,
      "Sp. Attack": 40,
      "Sp. Defense": 50,
      "Speed": 67
    }
  },
  {
    "id": 612,
    "name": {
      "english": "Haxorus",
      "japanese": "オノノクス",
      "chinese": "双斧战龙",
      "french": "Tranchodon"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 76,
      "Attack": 147,
      "Defense": 90,
      "Sp. Attack": 60,
      "Sp. Defense": 70,
      "Speed": 97
    }
  },
  {
    "id": 613,
    "name": {
      "english": "Cubchoo",
      "japanese": "クマシュン",
      "chinese": "喷嚏熊",
      "french": "Polarhume"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 55,
      "Attack": 70,
      "Defense": 40,
      "Sp. Attack": 60,
      "Sp. Defense": 40,
      "Speed": 40
    }
  },
  {
    "id": 614,
    "name": {
      "english": "Beartic",
      "japanese": "ツンベアー",
      "chinese": "冻原熊",
      "french": "Polagriffe"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 95,
      "Attack": 130,
      "Defense": 80,
      "Sp. Attack": 70,
      "Sp. Defense": 80,
      "Speed": 50
    }
  },
  {
    "id": 615,
    "name": {
      "english": "Cryogonal",
      "japanese": "フリージオ",
      "chinese": "几何雪花",
      "french": "Hexagel"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 80,
      "Attack": 50,
      "Defense": 50,
      "Sp. Attack": 95,
      "Sp. Defense": 135,
      "Speed": 105
    }
  },
  {
    "id": 616,
    "name": {
      "english": "Shelmet",
      "japanese": "チョボマキ",
      "chinese": "小嘴蜗",
      "french": "Escargaume"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 50,
      "Attack": 40,
      "Defense": 85,
      "Sp. Attack": 40,
      "Sp. Defense": 65,
      "Speed": 25
    }
  },
  {
    "id": 617,
    "name": {
      "english": "Accelgor",
      "japanese": "アギルダー",
      "chinese": "敏捷虫",
      "french": "Limaspeed"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 80,
      "Attack": 70,
      "Defense": 40,
      "Sp. Attack": 100,
      "Sp. Defense": 60,
      "Speed": 145
    }
  },
  {
    "id": 618,
    "name": {
      "english": "Stunfisk",
      "japanese": "マッギョ",
      "chinese": "泥巴鱼",
      "french": "Limonde"
    },
    "type": [
      "Ground",
      "Electric"
    ],
    "base": {
      "HP": 109,
      "Attack": 66,
      "Defense": 84,
      "Sp. Attack": 81,
      "Sp. Defense": 99,
      "Speed": 32
    }
  },
  {
    "id": 619,
    "name": {
      "english": "Mienfoo",
      "japanese": "コジョフー",
      "chinese": "功夫鼬",
      "french": "Kungfouine"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 45,
      "Attack": 85,
      "Defense": 50,
      "Sp. Attack": 55,
      "Sp. Defense": 50,
      "Speed": 65
    }
  },
  {
    "id": 620,
    "name": {
      "english": "Mienshao",
      "japanese": "コジョンド",
      "chinese": "师父鼬",
      "french": "Shaofouine"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 65,
      "Attack": 125,
      "Defense": 60,
      "Sp. Attack": 95,
      "Sp. Defense": 60,
      "Speed": 105
    }
  },
  {
    "id": 621,
    "name": {
      "english": "Druddigon",
      "japanese": "クリムガン",
      "chinese": "赤面龙",
      "french": "Drakkarmin"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 77,
      "Attack": 120,
      "Defense": 90,
      "Sp. Attack": 60,
      "Sp. Defense": 90,
      "Speed": 48
    }
  },
  {
    "id": 622,
    "name": {
      "english": "Golett",
      "japanese": "ゴビット",
      "chinese": "泥偶小人",
      "french": "Gringolem"
    },
    "type": [
      "Ground",
      "Ghost"
    ],
    "base": {
      "HP": 59,
      "Attack": 74,
      "Defense": 50,
      "Sp. Attack": 35,
      "Sp. Defense": 50,
      "Speed": 35
    }
  },
  {
    "id": 623,
    "name": {
      "english": "Golurk",
      "japanese": "ゴルーグ",
      "chinese": "泥偶巨人",
      "french": "Golemastoc"
    },
    "type": [
      "Ground",
      "Ghost"
    ],
    "base": {
      "HP": 89,
      "Attack": 124,
      "Defense": 80,
      "Sp. Attack": 55,
      "Sp. Defense": 80,
      "Speed": 55
    }
  },
  {
    "id": 624,
    "name": {
      "english": "Pawniard",
      "japanese": "コマタナ",
      "chinese": "驹刀小兵",
      "french": "Scalpion"
    },
    "type": [
      "Dark",
      "Steel"
    ],
    "base": {
      "HP": 45,
      "Attack": 85,
      "Defense": 70,
      "Sp. Attack": 40,
      "Sp. Defense": 40,
      "Speed": 60
    }
  },
  {
    "id": 625,
    "name": {
      "english": "Bisharp",
      "japanese": "キリキザン",
      "chinese": "劈斩司令",
      "french": "Scalproie"
    },
    "type": [
      "Dark",
      "Steel"
    ],
    "base": {
      "HP": 65,
      "Attack": 125,
      "Defense": 100,
      "Sp. Attack": 60,
      "Sp. Defense": 70,
      "Speed": 70
    }
  },
  {
    "id": 626,
    "name": {
      "english": "Bouffalant",
      "japanese": "バッフロン",
      "chinese": "爆炸头水牛",
      "french": "Frison"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 95,
      "Attack": 110,
      "Defense": 95,
      "Sp. Attack": 40,
      "Sp. Defense": 95,
      "Speed": 55
    }
  },
  {
    "id": 627,
    "name": {
      "english": "Rufflet",
      "japanese": "ワシボン",
      "chinese": "毛头小鹰",
      "french": "Furaiglon"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 70,
      "Attack": 83,
      "Defense": 50,
      "Sp. Attack": 37,
      "Sp. Defense": 50,
      "Speed": 60
    }
  },
  {
    "id": 628,
    "name": {
      "english": "Braviary",
      "japanese": "ウォーグル",
      "chinese": "勇士雄鹰",
      "french": "Gueriaigle"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 100,
      "Attack": 123,
      "Defense": 75,
      "Sp. Attack": 57,
      "Sp. Defense": 75,
      "Speed": 80
    }
  },
  {
    "id": 629,
    "name": {
      "english": "Vullaby",
      "japanese": "バルチャイ",
      "chinese": "秃鹰丫头",
      "french": "Vostourno"
    },
    "type": [
      "Dark",
      "Flying"
    ],
    "base": {
      "HP": 70,
      "Attack": 55,
      "Defense": 75,
      "Sp. Attack": 45,
      "Sp. Defense": 65,
      "Speed": 60
    }
  },
  {
    "id": 630,
    "name": {
      "english": "Mandibuzz",
      "japanese": "バルジーナ",
      "chinese": "秃鹰娜",
      "french": "Vaututrice"
    },
    "type": [
      "Dark",
      "Flying"
    ],
    "base": {
      "HP": 110,
      "Attack": 65,
      "Defense": 105,
      "Sp. Attack": 55,
      "Sp. Defense": 95,
      "Speed": 80
    }
  },
  {
    "id": 631,
    "name": {
      "english": "Heatmor",
      "japanese": "クイタラン",
      "chinese": "熔蚁兽",
      "french": "Aflamanoir"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 85,
      "Attack": 97,
      "Defense": 66,
      "Sp. Attack": 105,
      "Sp. Defense": 66,
      "Speed": 65
    }
  },
  {
    "id": 632,
    "name": {
      "english": "Durant",
      "japanese": "アイアント",
      "chinese": "铁蚁",
      "french": "Fermite"
    },
    "type": [
      "Bug",
      "Steel"
    ],
    "base": {
      "HP": 58,
      "Attack": 109,
      "Defense": 112,
      "Sp. Attack": 48,
      "Sp. Defense": 48,
      "Speed": 109
    }
  },
  {
    "id": 633,
    "name": {
      "english": "Deino",
      "japanese": "モノズ",
      "chinese": "单首龙",
      "french": "Solochi"
    },
    "type": [
      "Dark",
      "Dragon"
    ],
    "base": {
      "HP": 52,
      "Attack": 65,
      "Defense": 50,
      "Sp. Attack": 45,
      "Sp. Defense": 50,
      "Speed": 38
    }
  },
  {
    "id": 634,
    "name": {
      "english": "Zweilous",
      "japanese": "ジヘッド",
      "chinese": "双首暴龙",
      "french": "Diamat"
    },
    "type": [
      "Dark",
      "Dragon"
    ],
    "base": {
      "HP": 72,
      "Attack": 85,
      "Defense": 70,
      "Sp. Attack": 65,
      "Sp. Defense": 70,
      "Speed": 58
    }
  },
  {
    "id": 635,
    "name": {
      "english": "Hydreigon",
      "japanese": "サザンドラ",
      "chinese": "三首恶龙",
      "french": "Trioxhydre"
    },
    "type": [
      "Dark",
      "Dragon"
    ],
    "base": {
      "HP": 92,
      "Attack": 105,
      "Defense": 90,
      "Sp. Attack": 125,
      "Sp. Defense": 90,
      "Speed": 98
    }
  },
  {
    "id": 636,
    "name": {
      "english": "Larvesta",
      "japanese": "メラルバ",
      "chinese": "燃烧虫",
      "french": "Pyronille"
    },
    "type": [
      "Bug",
      "Fire"
    ],
    "base": {
      "HP": 55,
      "Attack": 85,
      "Defense": 55,
      "Sp. Attack": 50,
      "Sp. Defense": 55,
      "Speed": 60
    }
  },
  {
    "id": 637,
    "name": {
      "english": "Volcarona",
      "japanese": "ウルガモス",
      "chinese": "火神蛾",
      "french": "Pyrax"
    },
    "type": [
      "Bug",
      "Fire"
    ],
    "base": {
      "HP": 85,
      "Attack": 60,
      "Defense": 65,
      "Sp. Attack": 135,
      "Sp. Defense": 105,
      "Speed": 100
    }
  },
  {
    "id": 638,
    "name": {
      "english": "Cobalion",
      "japanese": "コバルオン",
      "chinese": "勾帕路翁",
      "french": "Cobaltium"
    },
    "type": [
      "Steel",
      "Fighting"
    ],
    "base": {
      "HP": 91,
      "Attack": 90,
      "Defense": 129,
      "Sp. Attack": 90,
      "Sp. Defense": 72,
      "Speed": 108
    }
  },
  {
    "id": 639,
    "name": {
      "english": "Terrakion",
      "japanese": "テラキオン",
      "chinese": "代拉基翁",
      "french": "Terrakium"
    },
    "type": [
      "Rock",
      "Fighting"
    ],
    "base": {
      "HP": 91,
      "Attack": 129,
      "Defense": 90,
      "Sp. Attack": 72,
      "Sp. Defense": 90,
      "Speed": 108
    }
  },
  {
    "id": 640,
    "name": {
      "english": "Virizion",
      "japanese": "ビリジオン",
      "chinese": "毕力吉翁",
      "french": "Viridium"
    },
    "type": [
      "Grass",
      "Fighting"
    ],
    "base": {
      "HP": 91,
      "Attack": 90,
      "Defense": 72,
      "Sp. Attack": 90,
      "Sp. Defense": 129,
      "Speed": 108
    }
  },
  {
    "id": 641,
    "name": {
      "english": "Tornadus",
      "japanese": "トルネロス",
      "chinese": "龙卷云",
      "french": "Boréas"
    },
    "type": [
      "Flying"
    ],
    "base": {
      "HP": 79,
      "Attack": 115,
      "Defense": 70,
      "Sp. Attack": 125,
      "Sp. Defense": 80,
      "Speed": 111
    }
  },
  {
    "id": 642,
    "name": {
      "english": "Thundurus",
      "japanese": "ボルトロス",
      "chinese": "雷电云",
      "french": "Fulguris"
    },
    "type": [
      "Electric",
      "Flying"
    ],
    "base": {
      "HP": 79,
      "Attack": 115,
      "Defense": 70,
      "Sp. Attack": 125,
      "Sp. Defense": 80,
      "Speed": 111
    }
  },
  {
    "id": 643,
    "name": {
      "english": "Reshiram",
      "japanese": "レシラム",
      "chinese": "莱希拉姆",
      "french": "Reshiram"
    },
    "type": [
      "Dragon",
      "Fire"
    ],
    "base": {
      "HP": 100,
      "Attack": 120,
      "Defense": 100,
      "Sp. Attack": 150,
      "Sp. Defense": 120,
      "Speed": 90
    }
  },
  {
    "id": 644,
    "name": {
      "english": "Zekrom",
      "japanese": "ゼクロム",
      "chinese": "捷克罗姆",
      "french": "Zekrom"
    },
    "type": [
      "Dragon",
      "Electric"
    ],
    "base": {
      "HP": 100,
      "Attack": 150,
      "Defense": 120,
      "Sp. Attack": 120,
      "Sp. Defense": 100,
      "Speed": 90
    }
  },
  {
    "id": 645,
    "name": {
      "english": "Landorus",
      "japanese": "ランドロス",
      "chinese": "土地云",
      "french": "Démétéros"
    },
    "type": [
      "Ground",
      "Flying"
    ],
    "base": {
      "HP": 89,
      "Attack": 125,
      "Defense": 90,
      "Sp. Attack": 115,
      "Sp. Defense": 80,
      "Speed": 101
    }
  },
  {
    "id": 646,
    "name": {
      "english": "Kyurem",
      "japanese": "キュレム",
      "chinese": "酋雷姆",
      "french": "Kyurem"
    },
    "type": [
      "Dragon",
      "Ice"
    ],
    "base": {
      "HP": 125,
      "Attack": 130,
      "Defense": 90,
      "Sp. Attack": 130,
      "Sp. Defense": 90,
      "Speed": 95
    }
  },
  {
    "id": 647,
    "name": {
      "english": "Keldeo",
      "japanese": "ケルディオ",
      "chinese": "凯路迪欧",
      "french": "Keldeo"
    },
    "type": [
      "Water",
      "Fighting"
    ],
    "base": {
      "HP": 91,
      "Attack": 72,
      "Defense": 90,
      "Sp. Attack": 129,
      "Sp. Defense": 90,
      "Speed": 108
    }
  },
  {
    "id": 648,
    "name": {
      "english": "Meloetta",
      "japanese": "メロエッタ",
      "chinese": "美洛耶塔",
      "french": "Meloetta"
    },
    "type": [
      "Normal",
      "Psychic"
    ],
    "base": {
      "HP": 100,
      "Attack": 77,
      "Defense": 77,
      "Sp. Attack": 128,
      "Sp. Defense": 128,
      "Speed": 90
    }
  },
  {
    "id": 649,
    "name": {
      "english": "Genesect",
      "japanese": "ゲノセクト",
      "chinese": "盖诺赛克特",
      "french": "Genesect"
    },
    "type": [
      "Bug",
      "Steel"
    ],
    "base": {
      "HP": 71,
      "Attack": 120,
      "Defense": 95,
      "Sp. Attack": 120,
      "Sp. Defense": 95,
      "Speed": 99
    }
  },
  {
    "id": 650,
    "name": {
      "english": "Chespin",
      "japanese": "ハリマロン",
      "chinese": "哈力栗",
      "french": "Marisson"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 56,
      "Attack": 61,
      "Defense": 65,
      "Sp. Attack": 48,
      "Sp. Defense": 45,
      "Speed": 38
    }
  },
  {
    "id": 651,
    "name": {
      "english": "Quilladin",
      "japanese": "ハリボーグ",
      "chinese": "胖胖哈力",
      "french": "Boguérisse"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 61,
      "Attack": 78,
      "Defense": 95,
      "Sp. Attack": 56,
      "Sp. Defense": 58,
      "Speed": 57
    }
  },
  {
    "id": 652,
    "name": {
      "english": "Chesnaught",
      "japanese": "ブリガロン",
      "chinese": "布里卡隆",
      "french": "Blindépique"
    },
    "type": [
      "Grass",
      "Fighting"
    ],
    "base": {
      "HP": 88,
      "Attack": 107,
      "Defense": 122,
      "Sp. Attack": 74,
      "Sp. Defense": 75,
      "Speed": 64
    }
  },
  {
    "id": 653,
    "name": {
      "english": "Fennekin",
      "japanese": "フォッコ",
      "chinese": "火狐狸",
      "french": "Feunnec"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 40,
      "Attack": 45,
      "Defense": 40,
      "Sp. Attack": 62,
      "Sp. Defense": 60,
      "Speed": 60
    }
  },
  {
    "id": 654,
    "name": {
      "english": "Braixen",
      "japanese": "テールナー",
      "chinese": "长尾火狐",
      "french": "Roussil"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 59,
      "Attack": 59,
      "Defense": 58,
      "Sp. Attack": 90,
      "Sp. Defense": 70,
      "Speed": 73
    }
  },
  {
    "id": 655,
    "name": {
      "english": "Delphox",
      "japanese": "マフォクシー",
      "chinese": "妖火红狐",
      "french": "Goupelin"
    },
    "type": [
      "Fire",
      "Psychic"
    ],
    "base": {
      "HP": 75,
      "Attack": 69,
      "Defense": 72,
      "Sp. Attack": 114,
      "Sp. Defense": 100,
      "Speed": 104
    }
  },
  {
    "id": 656,
    "name": {
      "english": "Froakie",
      "japanese": "ケロマツ",
      "chinese": "呱呱泡蛙",
      "french": "Grenousse"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 41,
      "Attack": 56,
      "Defense": 40,
      "Sp. Attack": 62,
      "Sp. Defense": 44,
      "Speed": 71
    }
  },
  {
    "id": 657,
    "name": {
      "english": "Frogadier",
      "japanese": "ゲコガシラ",
      "chinese": "呱头蛙",
      "french": "Croâporal"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 54,
      "Attack": 63,
      "Defense": 52,
      "Sp. Attack": 83,
      "Sp. Defense": 56,
      "Speed": 97
    }
  },
  {
    "id": 658,
    "name": {
      "english": "Greninja",
      "japanese": "ゲッコウガ",
      "chinese": "甲贺忍蛙",
      "french": "Amphinobi"
    },
    "type": [
      "Water",
      "Dark"
    ],
    "base": {
      "HP": 72,
      "Attack": 95,
      "Defense": 67,
      "Sp. Attack": 103,
      "Sp. Defense": 71,
      "Speed": 122
    }
  },
  {
    "id": 659,
    "name": {
      "english": "Bunnelby",
      "japanese": "ホルビー",
      "chinese": "掘掘兔",
      "french": "Sapereau"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 38,
      "Attack": 36,
      "Defense": 38,
      "Sp. Attack": 32,
      "Sp. Defense": 36,
      "Speed": 57
    }
  },
  {
    "id": 660,
    "name": {
      "english": "Diggersby",
      "japanese": "ホルード",
      "chinese": "掘地兔",
      "french": "Excavarenne"
    },
    "type": [
      "Normal",
      "Ground"
    ],
    "base": {
      "HP": 85,
      "Attack": 56,
      "Defense": 77,
      "Sp. Attack": 50,
      "Sp. Defense": 77,
      "Speed": 78
    }
  },
  {
    "id": 661,
    "name": {
      "english": "Fletchling",
      "japanese": "ヤヤコマ",
      "chinese": "小箭雀",
      "french": "Passerouge"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 45,
      "Attack": 50,
      "Defense": 43,
      "Sp. Attack": 40,
      "Sp. Defense": 38,
      "Speed": 62
    }
  },
  {
    "id": 662,
    "name": {
      "english": "Fletchinder",
      "japanese": "ヒノヤコマ",
      "chinese": "火箭雀",
      "french": "Braisillon"
    },
    "type": [
      "Fire",
      "Flying"
    ],
    "base": {
      "HP": 62,
      "Attack": 73,
      "Defense": 55,
      "Sp. Attack": 56,
      "Sp. Defense": 52,
      "Speed": 84
    }
  },
  {
    "id": 663,
    "name": {
      "english": "Talonflame",
      "japanese": "ファイアロー",
      "chinese": "烈箭鹰",
      "french": "Flambusard"
    },
    "type": [
      "Fire",
      "Flying"
    ],
    "base": {
      "HP": 78,
      "Attack": 81,
      "Defense": 71,
      "Sp. Attack": 74,
      "Sp. Defense": 69,
      "Speed": 126
    }
  },
  {
    "id": 664,
    "name": {
      "english": "Scatterbug",
      "japanese": "コフキムシ",
      "chinese": "粉蝶虫",
      "french": "Lépidonille"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 38,
      "Attack": 35,
      "Defense": 40,
      "Sp. Attack": 27,
      "Sp. Defense": 25,
      "Speed": 35
    }
  },
  {
    "id": 665,
    "name": {
      "english": "Spewpa",
      "japanese": "コフーライ",
      "chinese": "粉蝶蛹",
      "french": "Pérégrain"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 45,
      "Attack": 22,
      "Defense": 60,
      "Sp. Attack": 27,
      "Sp. Defense": 30,
      "Speed": 29
    }
  },
  {
    "id": 666,
    "name": {
      "english": "Vivillon",
      "japanese": "ビビヨン",
      "chinese": "彩粉蝶",
      "french": "Prismillon"
    },
    "type": [
      "Bug",
      "Flying"
    ],
    "base": {
      "HP": 80,
      "Attack": 52,
      "Defense": 50,
      "Sp. Attack": 90,
      "Sp. Defense": 50,
      "Speed": 89
    }
  },
  {
    "id": 667,
    "name": {
      "english": "Litleo",
      "japanese": "シシコ",
      "chinese": "小狮狮",
      "french": "Hélionceau"
    },
    "type": [
      "Fire",
      "Normal"
    ],
    "base": {
      "HP": 62,
      "Attack": 50,
      "Defense": 58,
      "Sp. Attack": 73,
      "Sp. Defense": 54,
      "Speed": 72
    }
  },
  {
    "id": 668,
    "name": {
      "english": "Pyroar",
      "japanese": "カエンジシ",
      "chinese": "火炎狮",
      "french": "Némélios"
    },
    "type": [
      "Fire",
      "Normal"
    ],
    "base": {
      "HP": 86,
      "Attack": 68,
      "Defense": 72,
      "Sp. Attack": 109,
      "Sp. Defense": 66,
      "Speed": 106
    }
  },
  {
    "id": 669,
    "name": {
      "english": "Flabébé",
      "japanese": "フラベベ",
      "chinese": "花蓓蓓",
      "french": "Flabébé"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 44,
      "Attack": 38,
      "Defense": 39,
      "Sp. Attack": 61,
      "Sp. Defense": 79,
      "Speed": 42
    }
  },
  {
    "id": 670,
    "name": {
      "english": "Floette",
      "japanese": "フラエッテ",
      "chinese": "花叶蒂",
      "french": "FLOETTE"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 54,
      "Attack": 45,
      "Defense": 47,
      "Sp. Attack": 75,
      "Sp. Defense": 98,
      "Speed": 52
    }
  },
  {
    "id": 671,
    "name": {
      "english": "Florges",
      "japanese": "フラージェス",
      "chinese": "花洁夫人",
      "french": "Florges"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 78,
      "Attack": 65,
      "Defense": 68,
      "Sp. Attack": 112,
      "Sp. Defense": 154,
      "Speed": 75
    }
  },
  {
    "id": 672,
    "name": {
      "english": "Skiddo",
      "japanese": "メェークル",
      "chinese": "坐骑小羊",
      "french": "Cabriolaine"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 66,
      "Attack": 65,
      "Defense": 48,
      "Sp. Attack": 62,
      "Sp. Defense": 57,
      "Speed": 52
    }
  },
  {
    "id": 673,
    "name": {
      "english": "Gogoat",
      "japanese": "ゴーゴート",
      "chinese": "坐骑山羊",
      "french": "Chevroum"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 123,
      "Attack": 100,
      "Defense": 62,
      "Sp. Attack": 97,
      "Sp. Defense": 81,
      "Speed": 68
    }
  },
  {
    "id": 674,
    "name": {
      "english": "Pancham",
      "japanese": "ヤンチャム",
      "chinese": "顽皮熊猫",
      "french": "Pandespiègle"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 67,
      "Attack": 82,
      "Defense": 62,
      "Sp. Attack": 46,
      "Sp. Defense": 48,
      "Speed": 43
    }
  },
  {
    "id": 675,
    "name": {
      "english": "Pangoro",
      "japanese": "ゴロンダ",
      "chinese": "流氓熊猫",
      "french": "Pandarbare"
    },
    "type": [
      "Fighting",
      "Dark"
    ],
    "base": {
      "HP": 95,
      "Attack": 124,
      "Defense": 78,
      "Sp. Attack": 69,
      "Sp. Defense": 71,
      "Speed": 58
    }
  },
  {
    "id": 676,
    "name": {
      "english": "Furfrou",
      "japanese": "トリミアン",
      "chinese": "多丽米亚",
      "french": "Couafarel"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 75,
      "Attack": 80,
      "Defense": 60,
      "Sp. Attack": 65,
      "Sp. Defense": 90,
      "Speed": 102
    }
  },
  {
    "id": 677,
    "name": {
      "english": "Espurr",
      "japanese": "ニャスパー",
      "chinese": "妙喵",
      "french": "Psystigri"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 62,
      "Attack": 48,
      "Defense": 54,
      "Sp. Attack": 63,
      "Sp. Defense": 60,
      "Speed": 68
    }
  },
  {
    "id": 678,
    "name": {
      "english": "Meowstic",
      "japanese": "ニャオニクス",
      "chinese": "超能妙喵",
      "french": "Mistigrix"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 74,
      "Attack": 48,
      "Defense": 76,
      "Sp. Attack": 83,
      "Sp. Defense": 81,
      "Speed": 104
    }
  },
  {
    "id": 679,
    "name": {
      "english": "Honedge",
      "japanese": "ヒトツキ",
      "chinese": "独剑鞘",
      "french": "Monorpale"
    },
    "type": [
      "Steel",
      "Ghost"
    ],
    "base": {
      "HP": 45,
      "Attack": 80,
      "Defense": 100,
      "Sp. Attack": 35,
      "Sp. Defense": 37,
      "Speed": 28
    }
  },
  {
    "id": 680,
    "name": {
      "english": "Doublade",
      "japanese": "ニダンギル",
      "chinese": "双剑鞘",
      "french": "Dimoclès"
    },
    "type": [
      "Steel",
      "Ghost"
    ],
    "base": {
      "HP": 59,
      "Attack": 110,
      "Defense": 150,
      "Sp. Attack": 45,
      "Sp. Defense": 49,
      "Speed": 35
    }
  },
  {
    "id": 681,
    "name": {
      "english": "Aegislash",
      "japanese": "ギルガルド",
      "chinese": "坚盾剑怪",
      "french": "Exagide"
    },
    "type": [
      "Steel",
      "Ghost"
    ],
    "base": {
      "HP": 60,
      "Attack": 50,
      "Defense": 150,
      "Sp. Attack": 50,
      "Sp. Defense": 150,
      "Speed": 60
    }
  },
  {
    "id": 682,
    "name": {
      "english": "Spritzee",
      "japanese": "シュシュプ",
      "chinese": "粉香香",
      "french": "Fluvetin"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 78,
      "Attack": 52,
      "Defense": 60,
      "Sp. Attack": 63,
      "Sp. Defense": 65,
      "Speed": 23
    }
  },
  {
    "id": 683,
    "name": {
      "english": "Aromatisse",
      "japanese": "フレフワン",
      "chinese": "芳香精",
      "french": "Cocotine"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 101,
      "Attack": 72,
      "Defense": 72,
      "Sp. Attack": 99,
      "Sp. Defense": 89,
      "Speed": 29
    }
  },
  {
    "id": 684,
    "name": {
      "english": "Swirlix",
      "japanese": "ペロッパフ",
      "chinese": "绵绵泡芙",
      "french": "Sucroquin"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 62,
      "Attack": 48,
      "Defense": 66,
      "Sp. Attack": 59,
      "Sp. Defense": 57,
      "Speed": 49
    }
  },
  {
    "id": 685,
    "name": {
      "english": "Slurpuff",
      "japanese": "ペロリーム",
      "chinese": "胖甜妮",
      "french": "Cupcanaille"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 82,
      "Attack": 80,
      "Defense": 86,
      "Sp. Attack": 85,
      "Sp. Defense": 75,
      "Speed": 72
    }
  },
  {
    "id": 686,
    "name": {
      "english": "Inkay",
      "japanese": "マーイーカ",
      "chinese": "好啦鱿",
      "french": "Sepiatop"
    },
    "type": [
      "Dark",
      "Psychic"
    ],
    "base": {
      "HP": 53,
      "Attack": 54,
      "Defense": 53,
      "Sp. Attack": 37,
      "Sp. Defense": 46,
      "Speed": 45
    }
  },
  {
    "id": 687,
    "name": {
      "english": "Malamar",
      "japanese": "カラマネロ",
      "chinese": "乌贼王",
      "french": "Sepiatroce"
    },
    "type": [
      "Dark",
      "Psychic"
    ],
    "base": {
      "HP": 86,
      "Attack": 92,
      "Defense": 88,
      "Sp. Attack": 68,
      "Sp. Defense": 75,
      "Speed": 73
    }
  },
  {
    "id": 688,
    "name": {
      "english": "Binacle",
      "japanese": "カメテテ",
      "chinese": "龟脚脚",
      "french": "Opermine"
    },
    "type": [
      "Rock",
      "Water"
    ],
    "base": {
      "HP": 42,
      "Attack": 52,
      "Defense": 67,
      "Sp. Attack": 39,
      "Sp. Defense": 56,
      "Speed": 50
    }
  },
  {
    "id": 689,
    "name": {
      "english": "Barbaracle",
      "japanese": "ガメノデス",
      "chinese": "龟足巨铠",
      "french": "Golgopathe"
    },
    "type": [
      "Rock",
      "Water"
    ],
    "base": {
      "HP": 72,
      "Attack": 105,
      "Defense": 115,
      "Sp. Attack": 54,
      "Sp. Defense": 86,
      "Speed": 68
    }
  },
  {
    "id": 690,
    "name": {
      "english": "Skrelp",
      "japanese": "クズモー",
      "chinese": "垃垃藻",
      "french": "Venalgue"
    },
    "type": [
      "Poison",
      "Water"
    ],
    "base": {
      "HP": 50,
      "Attack": 60,
      "Defense": 60,
      "Sp. Attack": 60,
      "Sp. Defense": 60,
      "Speed": 30
    }
  },
  {
    "id": 691,
    "name": {
      "english": "Dragalge",
      "japanese": "ドラミドロ",
      "chinese": "毒藻龙",
      "french": "Kravarech"
    },
    "type": [
      "Poison",
      "Dragon"
    ],
    "base": {
      "HP": 65,
      "Attack": 75,
      "Defense": 90,
      "Sp. Attack": 97,
      "Sp. Defense": 123,
      "Speed": 44
    }
  },
  {
    "id": 692,
    "name": {
      "english": "Clauncher",
      "japanese": "ウデッポウ",
      "chinese": "铁臂枪虾",
      "french": "Flingouste"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 50,
      "Attack": 53,
      "Defense": 62,
      "Sp. Attack": 58,
      "Sp. Defense": 63,
      "Speed": 44
    }
  },
  {
    "id": 693,
    "name": {
      "english": "Clawitzer",
      "japanese": "ブロスター",
      "chinese": "钢炮臂虾",
      "french": "Gamblast"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 71,
      "Attack": 73,
      "Defense": 88,
      "Sp. Attack": 120,
      "Sp. Defense": 89,
      "Speed": 59
    }
  },
  {
    "id": 694,
    "name": {
      "english": "Helioptile",
      "japanese": "エリキテル",
      "chinese": "伞电蜥",
      "french": "Galvaran"
    },
    "type": [
      "Electric",
      "Normal"
    ],
    "base": {
      "HP": 44,
      "Attack": 38,
      "Defense": 33,
      "Sp. Attack": 61,
      "Sp. Defense": 43,
      "Speed": 70
    }
  },
  {
    "id": 695,
    "name": {
      "english": "Heliolisk",
      "japanese": "エレザード",
      "chinese": "光电伞蜥",
      "french": "Iguolta"
    },
    "type": [
      "Electric",
      "Normal"
    ],
    "base": {
      "HP": 62,
      "Attack": 55,
      "Defense": 52,
      "Sp. Attack": 109,
      "Sp. Defense": 94,
      "Speed": 109
    }
  },
  {
    "id": 696,
    "name": {
      "english": "Tyrunt",
      "japanese": "チゴラス",
      "chinese": "宝宝暴龙",
      "french": "Ptyranidur"
    },
    "type": [
      "Rock",
      "Dragon"
    ],
    "base": {
      "HP": 58,
      "Attack": 89,
      "Defense": 77,
      "Sp. Attack": 45,
      "Sp. Defense": 45,
      "Speed": 48
    }
  },
  {
    "id": 697,
    "name": {
      "english": "Tyrantrum",
      "japanese": "ガチゴラス",
      "chinese": "怪颚龙",
      "french": "Rexillius"
    },
    "type": [
      "Rock",
      "Dragon"
    ],
    "base": {
      "HP": 82,
      "Attack": 121,
      "Defense": 119,
      "Sp. Attack": 69,
      "Sp. Defense": 59,
      "Speed": 71
    }
  },
  {
    "id": 698,
    "name": {
      "english": "Amaura",
      "japanese": "アマルス",
      "chinese": "冰雪龙",
      "french": "Amagara"
    },
    "type": [
      "Rock",
      "Ice"
    ],
    "base": {
      "HP": 77,
      "Attack": 59,
      "Defense": 50,
      "Sp. Attack": 67,
      "Sp. Defense": 63,
      "Speed": 46
    }
  },
  {
    "id": 699,
    "name": {
      "english": "Aurorus",
      "japanese": "アマルルガ",
      "chinese": "冰雪巨龙",
      "french": "Dragmara"
    },
    "type": [
      "Rock",
      "Ice"
    ],
    "base": {
      "HP": 123,
      "Attack": 77,
      "Defense": 72,
      "Sp. Attack": 99,
      "Sp. Defense": 92,
      "Speed": 58
    }
  },
  {
    "id": 700,
    "name": {
      "english": "Sylveon",
      "japanese": "ニンフィア",
      "chinese": "仙子伊布",
      "french": "Nymphali"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 95,
      "Attack": 65,
      "Defense": 65,
      "Sp. Attack": 110,
      "Sp. Defense": 130,
      "Speed": 60
    }
  },
  {
    "id": 701,
    "name": {
      "english": "Hawlucha",
      "japanese": "ルチャブル",
      "chinese": "摔角鹰人",
      "french": "Brutalibré"
    },
    "type": [
      "Fighting",
      "Flying"
    ],
    "base": {
      "HP": 78,
      "Attack": 92,
      "Defense": 75,
      "Sp. Attack": 74,
      "Sp. Defense": 63,
      "Speed": 118
    }
  },
  {
    "id": 702,
    "name": {
      "english": "Dedenne",
      "japanese": "デデンネ",
      "chinese": "咚咚鼠",
      "french": "DEDENNE"
    },
    "type": [
      "Electric",
      "Fairy"
    ],
    "base": {
      "HP": 67,
      "Attack": 58,
      "Defense": 57,
      "Sp. Attack": 81,
      "Sp. Defense": 67,
      "Speed": 101
    }
  },
  {
    "id": 703,
    "name": {
      "english": "Carbink",
      "japanese": "メレシー",
      "chinese": "小碎钻",
      "french": "Strassie"
    },
    "type": [
      "Rock",
      "Fairy"
    ],
    "base": {
      "HP": 50,
      "Attack": 50,
      "Defense": 150,
      "Sp. Attack": 50,
      "Sp. Defense": 150,
      "Speed": 50
    }
  },
  {
    "id": 704,
    "name": {
      "english": "Goomy",
      "japanese": "ヌメラ",
      "chinese": "黏黏宝",
      "french": "Mucuscule"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 45,
      "Attack": 50,
      "Defense": 35,
      "Sp. Attack": 55,
      "Sp. Defense": 75,
      "Speed": 40
    }
  },
  {
    "id": 705,
    "name": {
      "english": "Sliggoo",
      "japanese": "ヌメイル",
      "chinese": "黏美儿",
      "french": "Colimucus"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 68,
      "Attack": 75,
      "Defense": 53,
      "Sp. Attack": 83,
      "Sp. Defense": 113,
      "Speed": 60
    }
  },
  {
    "id": 706,
    "name": {
      "english": "Goodra",
      "japanese": "ヌメルゴン",
      "chinese": "黏美龙",
      "french": "Muplodocus"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 90,
      "Attack": 100,
      "Defense": 70,
      "Sp. Attack": 110,
      "Sp. Defense": 150,
      "Speed": 80
    }
  },
  {
    "id": 707,
    "name": {
      "english": "Klefki",
      "japanese": "クレッフィ",
      "chinese": "钥圈儿",
      "french": "Trousselin"
    },
    "type": [
      "Steel",
      "Fairy"
    ],
    "base": {
      "HP": 57,
      "Attack": 80,
      "Defense": 91,
      "Sp. Attack": 80,
      "Sp. Defense": 87,
      "Speed": 75
    }
  },
  {
    "id": 708,
    "name": {
      "english": "Phantump",
      "japanese": "ボクレー",
      "chinese": "小木灵",
      "french": "Brocélôme"
    },
    "type": [
      "Ghost",
      "Grass"
    ],
    "base": {
      "HP": 43,
      "Attack": 70,
      "Defense": 48,
      "Sp. Attack": 50,
      "Sp. Defense": 60,
      "Speed": 38
    }
  },
  {
    "id": 709,
    "name": {
      "english": "Trevenant",
      "japanese": "オーロット",
      "chinese": "朽木妖",
      "french": "Desséliande"
    },
    "type": [
      "Ghost",
      "Grass"
    ],
    "base": {
      "HP": 85,
      "Attack": 110,
      "Defense": 76,
      "Sp. Attack": 65,
      "Sp. Defense": 82,
      "Speed": 56
    }
  },
  {
    "id": 710,
    "name": {
      "english": "Pumpkaboo",
      "japanese": "バケッチャ",
      "chinese": "南瓜精",
      "french": "Pitrouille"
    },
    "type": [
      "Ghost",
      "Grass"
    ],
    "base": {
      "HP": 59,
      "Attack": 66,
      "Defense": 70,
      "Sp. Attack": 44,
      "Sp. Defense": 55,
      "Speed": 41
    }
  },
  {
    "id": 711,
    "name": {
      "english": "Gourgeist",
      "japanese": "パンプジン",
      "chinese": "南瓜怪人",
      "french": "Banshitrouye"
    },
    "type": [
      "Ghost",
      "Grass"
    ],
    "base": {
      "HP": 85,
      "Attack": 100,
      "Defense": 122,
      "Sp. Attack": 58,
      "Sp. Defense": 75,
      "Speed": 54
    }
  },
  {
    "id": 712,
    "name": {
      "english": "Bergmite",
      "japanese": "カチコール",
      "chinese": "冰宝",
      "french": "Grelaçon"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 55,
      "Attack": 69,
      "Defense": 85,
      "Sp. Attack": 32,
      "Sp. Defense": 35,
      "Speed": 28
    }
  },
  {
    "id": 713,
    "name": {
      "english": "Avalugg",
      "japanese": "クレベース",
      "chinese": "冰岩怪",
      "french": "Séracrawl"
    },
    "type": [
      "Ice"
    ],
    "base": {
      "HP": 95,
      "Attack": 117,
      "Defense": 184,
      "Sp. Attack": 44,
      "Sp. Defense": 46,
      "Speed": 28
    }
  },
  {
    "id": 714,
    "name": {
      "english": "Noibat",
      "japanese": "オンバット",
      "chinese": "嗡蝠",
      "french": "Sonistrelle"
    },
    "type": [
      "Flying",
      "Dragon"
    ],
    "base": {
      "HP": 40,
      "Attack": 30,
      "Defense": 35,
      "Sp. Attack": 45,
      "Sp. Defense": 40,
      "Speed": 55
    }
  },
  {
    "id": 715,
    "name": {
      "english": "Noivern",
      "japanese": "オンバーン",
      "chinese": "音波龙",
      "french": "Bruyverne"
    },
    "type": [
      "Flying",
      "Dragon"
    ],
    "base": {
      "HP": 85,
      "Attack": 70,
      "Defense": 80,
      "Sp. Attack": 97,
      "Sp. Defense": 80,
      "Speed": 123
    }
  },
  {
    "id": 716,
    "name": {
      "english": "Xerneas",
      "japanese": "ゼルネアス",
      "chinese": "哲尔尼亚斯",
      "french": "Xerneas"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 126,
      "Attack": 131,
      "Defense": 95,
      "Sp. Attack": 131,
      "Sp. Defense": 98,
      "Speed": 99
    }
  },
  {
    "id": 717,
    "name": {
      "english": "Yveltal",
      "japanese": "イベルタル",
      "chinese": "伊裴尔塔尔",
      "french": "Yveltal"
    },
    "type": [
      "Dark",
      "Flying"
    ],
    "base": {
      "HP": 126,
      "Attack": 131,
      "Defense": 95,
      "Sp. Attack": 131,
      "Sp. Defense": 98,
      "Speed": 99
    }
  },
  {
    "id": 718,
    "name": {
      "english": "Zygarde",
      "japanese": "ジガルデ",
      "chinese": "基格尔德",
      "french": "Zygarde"
    },
    "type": [
      "Dragon",
      "Ground"
    ],
    "base": {
      "HP": 108,
      "Attack": 100,
      "Defense": 121,
      "Sp. Attack": 81,
      "Sp. Defense": 95,
      "Speed": 95
    }
  },
  {
    "id": 719,
    "name": {
      "english": "Diancie",
      "japanese": "ディアンシー",
      "chinese": "蒂安希",
      "french": "Diancie"
    },
    "type": [
      "Rock",
      "Fairy"
    ],
    "base": {
      "HP": 50,
      "Attack": 100,
      "Defense": 150,
      "Sp. Attack": 100,
      "Sp. Defense": 150,
      "Speed": 50
    }
  },
  {
    "id": 720,
    "name": {
      "english": "Hoopa",
      "japanese": "フーパ",
      "chinese": "胡帕",
      "french": "Hoopa"
    },
    "type": [
      "Psychic",
      "Ghost"
    ],
    "base": {
      "HP": 80,
      "Attack": 110,
      "Defense": 60,
      "Sp. Attack": 150,
      "Sp. Defense": 130,
      "Speed": 70
    }
  },
  {
    "id": 721,
    "name": {
      "english": "Volcanion",
      "japanese": "ボルケニオン",
      "chinese": "波尔凯尼恩",
      "french": "Volcanion"
    },
    "type": [
      "Fire",
      "Water"
    ],
    "base": {
      "HP": 80,
      "Attack": 110,
      "Defense": 120,
      "Sp. Attack": 130,
      "Sp. Defense": 90,
      "Speed": 70
    }
  },
  {
    "id": 722,
    "name": {
      "english": "Rowlet",
      "japanese": "モクロー",
      "chinese": "木木枭",
      "french": "Brindibou"
    },
    "type": [
      "Grass",
      "Flying"
    ],
    "base": {
      "HP": 68,
      "Attack": 55,
      "Defense": 55,
      "Sp. Attack": 50,
      "Sp. Defense": 50,
      "Speed": 42
    }
  },
  {
    "id": 723,
    "name": {
      "english": "Dartrix",
      "japanese": "フクスロー",
      "chinese": "投羽枭",
      "french": "Efflèche"
    },
    "type": [
      "Grass",
      "Flying"
    ],
    "base": {
      "HP": 78,
      "Attack": 75,
      "Defense": 75,
      "Sp. Attack": 70,
      "Sp. Defense": 70,
      "Speed": 52
    }
  },
  {
    "id": 724,
    "name": {
      "english": "Decidueye",
      "japanese": "ジュナイパー",
      "chinese": "狙射树枭",
      "french": "Archéduc"
    },
    "type": [
      "Grass",
      "Ghost"
    ],
    "base": {
      "HP": 78,
      "Attack": 107,
      "Defense": 75,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      "Speed": 70
    }
  },
  {
    "id": 725,
    "name": {
      "english": "Litten",
      "japanese": "ニャビー",
      "chinese": "火斑喵",
      "french": "Flamiaou"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 45,
      "Attack": 65,
      "Defense": 40,
      "Sp. Attack": 60,
      "Sp. Defense": 40,
      "Speed": 70
    }
  },
  {
    "id": 726,
    "name": {
      "english": "Torracat",
      "japanese": "ニャヒート",
      "chinese": "炎热喵",
      "french": "Matoufeu"
    },
    "type": [
      "Fire"
    ],
    "base": {
      "HP": 65,
      "Attack": 85,
      "Defense": 50,
      "Sp. Attack": 80,
      "Sp. Defense": 50,
      "Speed": 90
    }
  },
  {
    "id": 727,
    "name": {
      "english": "Incineroar",
      "japanese": "ガオガエン",
      "chinese": "炽焰咆哮虎",
      "french": "Félinferno"
    },
    "type": [
      "Fire",
      "Dark"
    ],
    "base": {
      "HP": 95,
      "Attack": 115,
      "Defense": 90,
      "Sp. Attack": 80,
      "Sp. Defense": 90,
      "Speed": 60
    }
  },
  {
    "id": 728,
    "name": {
      "english": "Popplio",
      "japanese": "アシマリ",
      "chinese": "球球海狮",
      "french": "Otaquin"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 50,
      "Attack": 54,
      "Defense": 54,
      "Sp. Attack": 66,
      "Sp. Defense": 56,
      "Speed": 40
    }
  },
  {
    "id": 729,
    "name": {
      "english": "Brionne",
      "japanese": "オシャマリ",
      "chinese": "花漾海狮",
      "french": "Otarlette"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 60,
      "Attack": 69,
      "Defense": 69,
      "Sp. Attack": 91,
      "Sp. Defense": 81,
      "Speed": 50
    }
  },
  {
    "id": 730,
    "name": {
      "english": "Primarina",
      "japanese": "アシレーヌ",
      "chinese": "西狮海壬",
      "french": "Oratoria"
    },
    "type": [
      "Water",
      "Fairy"
    ],
    "base": {
      "HP": 80,
      "Attack": 74,
      "Defense": 74,
      "Sp. Attack": 126,
      "Sp. Defense": 116,
      "Speed": 60
    }
  },
  {
    "id": 731,
    "name": {
      "english": "Pikipek",
      "japanese": "ツツケラ",
      "chinese": "小笃儿",
      "french": "Picassaut"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 35,
      "Attack": 75,
      "Defense": 30,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 65
    }
  },
  {
    "id": 732,
    "name": {
      "english": "Trumbeak",
      "japanese": "ケララッパ",
      "chinese": "喇叭啄鸟",
      "french": "Piclairon"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 55,
      "Attack": 85,
      "Defense": 50,
      "Sp. Attack": 40,
      "Sp. Defense": 50,
      "Speed": 75
    }
  },
  {
    "id": 733,
    "name": {
      "english": "Toucannon",
      "japanese": "ドデカバシ",
      "chinese": "铳嘴大鸟",
      "french": "Bazoucan"
    },
    "type": [
      "Normal",
      "Flying"
    ],
    "base": {
      "HP": 80,
      "Attack": 120,
      "Defense": 75,
      "Sp. Attack": 75,
      "Sp. Defense": 75,
      "Speed": 60
    }
  },
  {
    "id": 734,
    "name": {
      "english": "Yungoos",
      "japanese": "ヤングース",
      "chinese": "猫鼬少",
      "french": "Manglouton"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 48,
      "Attack": 70,
      "Defense": 30,
      "Sp. Attack": 30,
      "Sp. Defense": 30,
      "Speed": 45
    }
  },
  {
    "id": 735,
    "name": {
      "english": "Gumshoos",
      "japanese": "デカグース",
      "chinese": "猫鼬探长",
      "french": "Argouste"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 88,
      "Attack": 110,
      "Defense": 60,
      "Sp. Attack": 55,
      "Sp. Defense": 60,
      "Speed": 45
    }
  },
  {
    "id": 736,
    "name": {
      "english": "Grubbin",
      "japanese": "アゴジムシ",
      "chinese": "强颚鸡母虫",
      "french": "Larvibule"
    },
    "type": [
      "Bug"
    ],
    "base": {
      "HP": 47,
      "Attack": 62,
      "Defense": 45,
      "Sp. Attack": 55,
      "Sp. Defense": 45,
      "Speed": 46
    }
  },
  {
    "id": 737,
    "name": {
      "english": "Charjabug",
      "japanese": "デンヂムシ",
      "chinese": "虫电宝",
      "french": "Chrysapile"
    },
    "type": [
      "Bug",
      "Electric"
    ],
    "base": {
      "HP": 57,
      "Attack": 82,
      "Defense": 95,
      "Sp. Attack": 55,
      "Sp. Defense": 75,
      "Speed": 36
    }
  },
  {
    "id": 738,
    "name": {
      "english": "Vikavolt",
      "japanese": "クワガノン",
      "chinese": "锹农炮虫",
      "french": "Lucanon"
    },
    "type": [
      "Bug",
      "Electric"
    ],
    "base": {
      "HP": 77,
      "Attack": 70,
      "Defense": 90,
      "Sp. Attack": 145,
      "Sp. Defense": 75,
      "Speed": 43
    }
  },
  {
    "id": 739,
    "name": {
      "english": "Crabrawler",
      "japanese": "マケンカニ",
      "chinese": "好胜蟹",
      "french": "Crabagarre"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 47,
      "Attack": 82,
      "Defense": 57,
      "Sp. Attack": 42,
      "Sp. Defense": 47,
      "Speed": 63
    }
  },
  {
    "id": 740,
    "name": {
      "english": "Crabominable",
      "japanese": "ケケンカニ",
      "chinese": "好胜毛蟹",
      "french": "Crabominable"
    },
    "type": [
      "Fighting",
      "Ice"
    ],
    "base": {
      "HP": 97,
      "Attack": 132,
      "Defense": 77,
      "Sp. Attack": 62,
      "Sp. Defense": 67,
      "Speed": 43
    }
  },
  {
    "id": 741,
    "name": {
      "english": "Oricorio",
      "japanese": "オドリドリ",
      "chinese": "花舞鸟",
      "french": "Plumeline"
    },
    "type": [
      "Fire",
      "Flying"
    ],
    "base": {
      "HP": 75,
      "Attack": 70,
      "Defense": 70,
      "Sp. Attack": 98,
      "Sp. Defense": 70,
      "Speed": 93
    }
  },
  {
    "id": 742,
    "name": {
      "english": "Cutiefly",
      "japanese": "アブリー",
      "chinese": "萌虻",
      "french": "Bombydou"
    },
    "type": [
      "Bug",
      "Fairy"
    ],
    "base": {
      "HP": 40,
      "Attack": 45,
      "Defense": 40,
      "Sp. Attack": 55,
      "Sp. Defense": 40,
      "Speed": 84
    }
  },
  {
    "id": 743,
    "name": {
      "english": "Ribombee",
      "japanese": "アブリボン",
      "chinese": "蝶结萌虻",
      "french": "Rubombelle"
    },
    "type": [
      "Bug",
      "Fairy"
    ],
    "base": {
      "HP": 60,
      "Attack": 55,
      "Defense": 60,
      "Sp. Attack": 95,
      "Sp. Defense": 70,
      "Speed": 124
    }
  },
  {
    "id": 744,
    "name": {
      "english": "Rockruff",
      "japanese": "イワンコ",
      "chinese": "岩狗狗",
      "french": "Rocabot"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 45,
      "Attack": 65,
      "Defense": 40,
      "Sp. Attack": 30,
      "Sp. Defense": 40,
      "Speed": 60
    }
  },
  {
    "id": 745,
    "name": {
      "english": "Lycanroc",
      "japanese": "ルガルガン",
      "chinese": "鬃岩狼人",
      "french": "Lougaroc"
    },
    "type": [
      "Rock"
    ],
    "base": {
      "HP": 75,
      "Attack": 115,
      "Defense": 65,
      "Sp. Attack": 55,
      "Sp. Defense": 65,
      "Speed": 112
    }
  },
  {
    "id": 746,
    "name": {
      "english": "Wishiwashi",
      "japanese": "ヨワシ",
      "chinese": "弱丁鱼",
      "french": "Froussardine"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 45,
      "Attack": 20,
      "Defense": 20,
      "Sp. Attack": 25,
      "Sp. Defense": 25,
      "Speed": 40
    }
  },
  {
    "id": 747,
    "name": {
      "english": "Mareanie",
      "japanese": "ヒドイデ",
      "chinese": "好坏星",
      "french": "Vorastérie"
    },
    "type": [
      "Poison",
      "Water"
    ],
    "base": {
      "HP": 50,
      "Attack": 53,
      "Defense": 62,
      "Sp. Attack": 43,
      "Sp. Defense": 52,
      "Speed": 45
    }
  },
  {
    "id": 748,
    "name": {
      "english": "Toxapex",
      "japanese": "ドヒドイデ",
      "chinese": "超坏星",
      "french": "Prédastérie"
    },
    "type": [
      "Poison",
      "Water"
    ],
    "base": {
      "HP": 50,
      "Attack": 63,
      "Defense": 152,
      "Sp. Attack": 53,
      "Sp. Defense": 142,
      "Speed": 35
    }
  },
  {
    "id": 749,
    "name": {
      "english": "Mudbray",
      "japanese": "ドロバンコ",
      "chinese": "泥驴仔",
      "french": "Tiboudet"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 70,
      "Attack": 100,
      "Defense": 70,
      "Sp. Attack": 45,
      "Sp. Defense": 55,
      "Speed": 45
    }
  },
  {
    "id": 750,
    "name": {
      "english": "Mudsdale",
      "japanese": "バンバドロ",
      "chinese": "重泥挽马",
      "french": "Bourrinos"
    },
    "type": [
      "Ground"
    ],
    "base": {
      "HP": 100,
      "Attack": 125,
      "Defense": 100,
      "Sp. Attack": 55,
      "Sp. Defense": 85,
      "Speed": 35
    }
  },
  {
    "id": 751,
    "name": {
      "english": "Dewpider",
      "japanese": "シズクモ",
      "chinese": "滴蛛",
      "french": "Araqua"
    },
    "type": [
      "Water",
      "Bug"
    ],
    "base": {
      "HP": 38,
      "Attack": 40,
      "Defense": 52,
      "Sp. Attack": 40,
      "Sp. Defense": 72,
      "Speed": 27
    }
  },
  {
    "id": 752,
    "name": {
      "english": "Araquanid",
      "japanese": "オニシズクモ",
      "chinese": "滴蛛霸",
      "french": "Tarenbulle"
    },
    "type": [
      "Water",
      "Bug"
    ],
    "base": {
      "HP": 68,
      "Attack": 70,
      "Defense": 92,
      "Sp. Attack": 50,
      "Sp. Defense": 132,
      "Speed": 42
    }
  },
  {
    "id": 753,
    "name": {
      "english": "Fomantis",
      "japanese": "カリキリ",
      "chinese": "伪螳草",
      "french": "Mimantis"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 40,
      "Attack": 55,
      "Defense": 35,
      "Sp. Attack": 50,
      "Sp. Defense": 35,
      "Speed": 35
    }
  },
  {
    "id": 754,
    "name": {
      "english": "Lurantis",
      "japanese": "ラランテス",
      "chinese": "兰螳花",
      "french": "Floramantis"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 70,
      "Attack": 105,
      "Defense": 90,
      "Sp. Attack": 80,
      "Sp. Defense": 90,
      "Speed": 45
    }
  },
  {
    "id": 755,
    "name": {
      "english": "Morelull",
      "japanese": "ネマシュ",
      "chinese": "睡睡菇",
      "french": "Spododo"
    },
    "type": [
      "Grass",
      "Fairy"
    ],
    "base": {
      "HP": 40,
      "Attack": 35,
      "Defense": 55,
      "Sp. Attack": 65,
      "Sp. Defense": 75,
      "Speed": 15
    }
  },
  {
    "id": 756,
    "name": {
      "english": "Shiinotic",
      "japanese": "マシェード",
      "chinese": "灯罩夜菇",
      "french": "Lampignon"
    },
    "type": [
      "Grass",
      "Fairy"
    ],
    "base": {
      "HP": 60,
      "Attack": 45,
      "Defense": 80,
      "Sp. Attack": 90,
      "Sp. Defense": 100,
      "Speed": 30
    }
  },
  {
    "id": 757,
    "name": {
      "english": "Salandit",
      "japanese": "ヤトウモリ",
      "chinese": "夜盗火蜥",
      "french": "Tritox"
    },
    "type": [
      "Poison",
      "Fire"
    ],
    "base": {
      "HP": 48,
      "Attack": 44,
      "Defense": 40,
      "Sp. Attack": 71,
      "Sp. Defense": 40,
      "Speed": 77
    }
  },
  {
    "id": 758,
    "name": {
      "english": "Salazzle",
      "japanese": "エンニュート",
      "chinese": "焰后蜥",
      "french": "Malamandre"
    },
    "type": [
      "Poison",
      "Fire"
    ],
    "base": {
      "HP": 68,
      "Attack": 64,
      "Defense": 60,
      "Sp. Attack": 111,
      "Sp. Defense": 60,
      "Speed": 117
    }
  },
  {
    "id": 759,
    "name": {
      "english": "Stufful",
      "japanese": "ヌイコグマ",
      "chinese": "童偶熊",
      "french": "Nounourson"
    },
    "type": [
      "Normal",
      "Fighting"
    ],
    "base": {
      "HP": 70,
      "Attack": 75,
      "Defense": 50,
      "Sp. Attack": 45,
      "Sp. Defense": 50,
      "Speed": 50
    }
  },
  {
    "id": 760,
    "name": {
      "english": "Bewear",
      "japanese": "キテルグマ",
      "chinese": "穿着熊",
      "french": "Chelours"
    },
    "type": [
      "Normal",
      "Fighting"
    ],
    "base": {
      "HP": 120,
      "Attack": 125,
      "Defense": 80,
      "Sp. Attack": 55,
      "Sp. Defense": 60,
      "Speed": 60
    }
  },
  {
    "id": 761,
    "name": {
      "english": "Bounsweet",
      "japanese": "アマカジ",
      "chinese": "甜竹竹",
      "french": "Croquine"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 42,
      "Attack": 30,
      "Defense": 38,
      "Sp. Attack": 30,
      "Sp. Defense": 38,
      "Speed": 32
    }
  },
  {
    "id": 762,
    "name": {
      "english": "Steenee",
      "japanese": "アママイコ",
      "chinese": "甜舞妮",
      "french": "Candine"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 52,
      "Attack": 40,
      "Defense": 48,
      "Sp. Attack": 40,
      "Sp. Defense": 48,
      "Speed": 62
    }
  },
  {
    "id": 763,
    "name": {
      "english": "Tsareena",
      "japanese": "アマージョ",
      "chinese": "甜冷美后",
      "french": "Sucreine"
    },
    "type": [
      "Grass"
    ],
    "base": {
      "HP": 72,
      "Attack": 120,
      "Defense": 98,
      "Sp. Attack": 50,
      "Sp. Defense": 98,
      "Speed": 72
    }
  },
  {
    "id": 764,
    "name": {
      "english": "Comfey",
      "japanese": "キュワワー",
      "chinese": "花疗环环",
      "french": "Guérilande"
    },
    "type": [
      "Fairy"
    ],
    "base": {
      "HP": 51,
      "Attack": 52,
      "Defense": 90,
      "Sp. Attack": 82,
      "Sp. Defense": 110,
      "Speed": 100
    }
  },
  {
    "id": 765,
    "name": {
      "english": "Oranguru",
      "japanese": "ヤレユータン",
      "chinese": "智挥猩",
      "french": "Gouroutan"
    },
    "type": [
      "Normal",
      "Psychic"
    ],
    "base": {
      "HP": 90,
      "Attack": 60,
      "Defense": 80,
      "Sp. Attack": 90,
      "Sp. Defense": 110,
      "Speed": 60
    }
  },
  {
    "id": 766,
    "name": {
      "english": "Passimian",
      "japanese": "ナゲツケサル",
      "chinese": "投掷猴",
      "french": "Quartermac"
    },
    "type": [
      "Fighting"
    ],
    "base": {
      "HP": 100,
      "Attack": 120,
      "Defense": 90,
      "Sp. Attack": 40,
      "Sp. Defense": 60,
      "Speed": 80
    }
  },
  {
    "id": 767,
    "name": {
      "english": "Wimpod",
      "japanese": "コソクムシ",
      "chinese": "胆小虫",
      "french": "Sovkipou"
    },
    "type": [
      "Bug",
      "Water"
    ],
    "base": {
      "HP": 25,
      "Attack": 35,
      "Defense": 40,
      "Sp. Attack": 20,
      "Sp. Defense": 30,
      "Speed": 80
    }
  },
  {
    "id": 768,
    "name": {
      "english": "Golisopod",
      "japanese": "グソクムシャ",
      "chinese": "具甲武者",
      "french": "Sarmuraï"
    },
    "type": [
      "Bug",
      "Water"
    ],
    "base": {
      "HP": 75,
      "Attack": 125,
      "Defense": 140,
      "Sp. Attack": 60,
      "Sp. Defense": 90,
      "Speed": 40
    }
  },
  {
    "id": 769,
    "name": {
      "english": "Sandygast",
      "japanese": "スナバァ",
      "chinese": "沙丘娃",
      "french": "Bacabouh"
    },
    "type": [
      "Ghost",
      "Ground"
    ],
    "base": {
      "HP": 55,
      "Attack": 55,
      "Defense": 80,
      "Sp. Attack": 70,
      "Sp. Defense": 45,
      "Speed": 15
    }
  },
  {
    "id": 770,
    "name": {
      "english": "Palossand",
      "japanese": "シロデスナ",
      "chinese": "噬沙堡爷",
      "french": "Trépassable"
    },
    "type": [
      "Ghost",
      "Ground"
    ],
    "base": {
      "HP": 85,
      "Attack": 75,
      "Defense": 110,
      "Sp. Attack": 100,
      "Sp. Defense": 75,
      "Speed": 35
    }
  },
  {
    "id": 771,
    "name": {
      "english": "Pyukumuku",
      "japanese": "ナマコブシ",
      "chinese": "拳海参",
      "french": "Concombaffe"
    },
    "type": [
      "Water"
    ],
    "base": {
      "HP": 55,
      "Attack": 60,
      "Defense": 130,
      "Sp. Attack": 30,
      "Sp. Defense": 130,
      "Speed": 5
    }
  },
  {
    "id": 772,
    "name": {
      "english": "Type: Null",
      "japanese": "タイプ：ヌル",
      "chinese": "属性：空",
      "french": "Silvallié"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 95,
      "Attack": 95,
      "Defense": 95,
      "Sp. Attack": 95,
      "Sp. Defense": 95,
      "Speed": 59
    }
  },
  {
    "id": 773,
    "name": {
      "english": "Silvally",
      "japanese": "シルヴァディ",
      "chinese": "银伴战兽",
      "french": "Météno"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 95,
      "Attack": 95,
      "Defense": 95,
      "Sp. Attack": 95,
      "Sp. Defense": 95,
      "Speed": 95
    }
  },
  {
    "id": 774,
    "name": {
      "english": "Minior",
      "japanese": "メテノ",
      "chinese": "小陨星",
      "french": "Dodoala"
    },
    "type": [
      "Rock",
      "Flying"
    ],
    "base": {
      "HP": 60,
      "Attack": 60,
      "Defense": 100,
      "Sp. Attack": 60,
      "Sp. Defense": 100,
      "Speed": 60
    }
  },
  {
    "id": 775,
    "name": {
      "english": "Komala",
      "japanese": "ネッコアラ",
      "chinese": "树枕尾熊",
      "french": "Boumata"
    },
    "type": [
      "Normal"
    ],
    "base": {
      "HP": 65,
      "Attack": 115,
      "Defense": 65,
      "Sp. Attack": 75,
      "Sp. Defense": 95,
      "Speed": 65
    }
  },
  {
    "id": 776,
    "name": {
      "english": "Turtonator",
      "japanese": "バクガメス",
      "chinese": "爆焰龟兽",
      "french": "Togedemaru"
    },
    "type": [
      "Fire",
      "Dragon"
    ],
    "base": {
      "HP": 60,
      "Attack": 78,
      "Defense": 135,
      "Sp. Attack": 91,
      "Sp. Defense": 85,
      "Speed": 36
    }
  },
  {
    "id": 777,
    "name": {
      "english": "Togedemaru",
      "japanese": "トゲデマル",
      "chinese": "托戈德玛尔",
      "french": "Mimiqui"
    },
    "type": [
      "Electric",
      "Steel"
    ],
    "base": {
      "HP": 65,
      "Attack": 98,
      "Defense": 63,
      "Sp. Attack": 40,
      "Sp. Defense": 73,
      "Speed": 96
    }
  },
  {
    "id": 778,
    "name": {
      "english": "Mimikyu",
      "japanese": "ミミッキュ",
      "chinese": "谜拟Ｑ",
      "french": "Denticrisse"
    },
    "type": [
      "Ghost",
      "Fairy"
    ],
    "base": {
      "HP": 55,
      "Attack": 90,
      "Defense": 80,
      "Sp. Attack": 50,
      "Sp. Defense": 105,
      "Speed": 96
    }
  },
  {
    "id": 779,
    "name": {
      "english": "Bruxish",
      "japanese": "ハギギシリ",
      "chinese": "磨牙彩皮鱼",
      "french": "Draïeul"
    },
    "type": [
      "Water",
      "Psychic"
    ],
    "base": {
      "HP": 68,
      "Attack": 105,
      "Defense": 70,
      "Sp. Attack": 70,
      "Sp. Defense": 70,
      "Speed": 92
    }
  },
  {
    "id": 780,
    "name": {
      "english": "Drampa",
      "japanese": "ジジーロン",
      "chinese": "老翁龙",
      "french": "Sinistrail"
    },
    "type": [
      "Normal",
      "Dragon"
    ],
    "base": {
      "HP": 78,
      "Attack": 60,
      "Defense": 85,
      "Sp. Attack": 135,
      "Sp. Defense": 91,
      "Speed": 36
    }
  },
  {
    "id": 781,
    "name": {
      "english": "Dhelmise",
      "japanese": "ダダリン",
      "chinese": "破破舵轮",
      "french": "Bébécaille"
    },
    "type": [
      "Ghost",
      "Grass"
    ],
    "base": {
      "HP": 70,
      "Attack": 131,
      "Defense": 100,
      "Sp. Attack": 86,
      "Sp. Defense": 90,
      "Speed": 40
    }
  },
  {
    "id": 782,
    "name": {
      "english": "Jangmo-o",
      "japanese": "ジャラコ",
      "chinese": "心鳞宝",
      "french": "Écaïd"
    },
    "type": [
      "Dragon"
    ],
    "base": {
      "HP": 45,
      "Attack": 55,
      "Defense": 65,
      "Sp. Attack": 45,
      "Sp. Defense": 45,
      "Speed": 45
    }
  },
  {
    "id": 783,
    "name": {
      "english": "Hakamo-o",
      "japanese": "ジャランゴ",
      "chinese": "鳞甲龙",
      "french": "Ékaïser"
    },
    "type": [
      "Dragon",
      "Fighting"
    ],
    "base": {
      "HP": 55,
      "Attack": 75,
      "Defense": 90,
      "Sp. Attack": 65,
      "Sp. Defense": 70,
      "Speed": 65
    }
  },
  {
    "id": 784,
    "name": {
      "english": "Kommo-o",
      "japanese": "ジャラランガ",
      "chinese": "杖尾鳞甲龙",
      "french": "Tokorico"
    },
    "type": [
      "Dragon",
      "Fighting"
    ],
    "base": {
      "HP": 75,
      "Attack": 110,
      "Defense": 125,
      "Sp. Attack": 100,
      "Sp. Defense": 105,
      "Speed": 85
    }
  },
  {
    "id": 785,
    "name": {
      "english": "Tapu Koko",
      "japanese": "カプ・コケコ",
      "chinese": "卡璞・鸣鸣",
      "french": "Tokopiyon"
    },
    "type": [
      "Electric",
      "Fairy"
    ],
    "base": {
      "HP": 70,
      "Attack": 115,
      "Defense": 85,
      "Sp. Attack": 95,
      "Sp. Defense": 75,
      "Speed": 130
    }
  },
  {
    "id": 786,
    "name": {
      "english": "Tapu Lele",
      "japanese": "カプ・テテフ",
      "chinese": "卡璞・蝶蝶",
      "french": "Tokotoro"
    },
    "type": [
      "Psychic",
      "Fairy"
    ],
    "base": {
      "HP": 70,
      "Attack": 85,
      "Defense": 75,
      "Sp. Attack": 130,
      "Sp. Defense": 115,
      "Speed": 95
    }
  },
  {
    "id": 787,
    "name": {
      "english": "Tapu Bulu",
      "japanese": "カプ・ブルル",
      "chinese": "卡璞・哞哞",
      "french": "Tokopisco"
    },
    "type": [
      "Grass",
      "Fairy"
    ],
    "base": {
      "HP": 70,
      "Attack": 130,
      "Defense": 115,
      "Sp. Attack": 85,
      "Sp. Defense": 95,
      "Speed": 75
    }
  },
  {
    "id": 788,
    "name": {
      "english": "Tapu Fini",
      "japanese": "カプ・レヒレ",
      "chinese": "卡璞・鳍鳍",
      "french": "Cosmog"
    },
    "type": [
      "Water",
      "Fairy"
    ],
    "base": {
      "HP": 70,
      "Attack": 75,
      "Defense": 115,
      "Sp. Attack": 95,
      "Sp. Defense": 130,
      "Speed": 85
    }
  },
  {
    "id": 789,
    "name": {
      "english": "Cosmog",
      "japanese": "コスモッグ",
      "chinese": "科斯莫古",
      "french": "Cosmovum"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 43,
      "Attack": 29,
      "Defense": 31,
      "Sp. Attack": 29,
      "Sp. Defense": 31,
      "Speed": 37
    }
  },
  {
    "id": 790,
    "name": {
      "english": "Cosmoem",
      "japanese": "コスモウム",
      "chinese": "科斯莫姆",
      "french": "Solgaleo"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 43,
      "Attack": 29,
      "Defense": 131,
      "Sp. Attack": 29,
      "Sp. Defense": 131,
      "Speed": 37
    }
  },
  {
    "id": 791,
    "name": {
      "english": "Solgaleo",
      "japanese": "ソルガレオ",
      "chinese": "索尔迦雷欧",
      "french": "Lunala"
    },
    "type": [
      "Psychic",
      "Steel"
    ],
    "base": {
      "HP": 137,
      "Attack": 137,
      "Defense": 107,
      "Sp. Attack": 113,
      "Sp. Defense": 89,
      "Speed": 97
    }
  },
  {
    "id": 792,
    "name": {
      "english": "Lunala",
      "japanese": "ルナアーラ",
      "chinese": "露奈雅拉",
      "french": "Zéroïd"
    },
    "type": [
      "Psychic",
      "Ghost"
    ],
    "base": {
      "HP": 137,
      "Attack": 113,
      "Defense": 89,
      "Sp. Attack": 137,
      "Sp. Defense": 107,
      "Speed": 97
    }
  },
  {
    "id": 793,
    "name": {
      "english": "Nihilego",
      "japanese": "ウツロイド",
      "chinese": "虚吾伊德",
      "french": "Mouscoto"
    },
    "type": [
      "Rock",
      "Poison"
    ],
    "base": {
      "HP": 109,
      "Attack": 53,
      "Defense": 47,
      "Sp. Attack": 127,
      "Sp. Defense": 131,
      "Speed": 103
    }
  },
  {
    "id": 794,
    "name": {
      "english": "Buzzwole",
      "japanese": "マッシブーン",
      "chinese": "爆肌蚊",
      "french": "Cancrelove"
    },
    "type": [
      "Bug",
      "Fighting"
    ],
    "base": {
      "HP": 107,
      "Attack": 139,
      "Defense": 139,
      "Sp. Attack": 53,
      "Sp. Defense": 53,
      "Speed": 79
    }
  },
  {
    "id": 795,
    "name": {
      "english": "Pheromosa",
      "japanese": "フェローチェ",
      "chinese": "费洛美螂",
      "french": "Câblifère"
    },
    "type": [
      "Bug",
      "Fighting"
    ],
    "base": {
      "HP": 71,
      "Attack": 137,
      "Defense": 37,
      "Sp. Attack": 137,
      "Sp. Defense": 37,
      "Speed": 151
    }
  },
  {
    "id": 796,
    "name": {
      "english": "Xurkitree",
      "japanese": "デンジュモク",
      "chinese": "电束木",
      "french": "Bamboiselle"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 83,
      "Attack": 89,
      "Defense": 71,
      "Sp. Attack": 173,
      "Sp. Defense": 71,
      "Speed": 83
    }
  },
  {
    "id": 797,
    "name": {
      "english": "Celesteela",
      "japanese": "テッカグヤ",
      "chinese": "铁火辉夜",
      "french": "Katagami"
    },
    "type": [
      "Steel",
      "Flying"
    ],
    "base": {
      "HP": 97,
      "Attack": 101,
      "Defense": 103,
      "Sp. Attack": 107,
      "Sp. Defense": 101,
      "Speed": 61
    }
  },
  {
    "id": 798,
    "name": {
      "english": "Kartana",
      "japanese": "カミツルギ",
      "chinese": "纸御剑",
      "french": "Engloutyran"
    },
    "type": [
      "Grass",
      "Steel"
    ],
    "base": {
      "HP": 59,
      "Attack": 181,
      "Defense": 131,
      "Sp. Attack": 59,
      "Sp. Defense": 31,
      "Speed": 109
    }
  },
  {
    "id": 799,
    "name": {
      "english": "Guzzlord",
      "japanese": "アクジキング",
      "chinese": "恶食大王",
      "french": "Necrozma"
    },
    "type": [
      "Dark",
      "Dragon"
    ],
    "base": {
      "HP": 223,
      "Attack": 101,
      "Defense": 53,
      "Sp. Attack": 97,
      "Sp. Defense": 53,
      "Speed": 43
    }
  },
  {
    "id": 800,
    "name": {
      "english": "Necrozma",
      "japanese": "ネクロズマ",
      "chinese": "奈克洛兹玛",
      "french": "Magearna"
    },
    "type": [
      "Psychic"
    ],
    "base": {
      "HP": 97,
      "Attack": 107,
      "Defense": 101,
      "Sp. Attack": 127,
      "Sp. Defense": 89,
      "Speed": 79
    }
  },
  {
    "id": 801,
    "name": {
      "english": "Magearna",
      "japanese": "マギアナ",
      "chinese": "玛机雅娜",
      "french": "Marshadow"
    },
    "type": [
      "Steel",
      "Fairy"
    ],
    "base": {
      "HP": 80,
      "Attack": 95,
      "Defense": 115,
      "Sp. Attack": 130,
      "Sp. Defense": 115,
      "Speed": 65
    }
  },
  {
    "id": 802,
    "name": {
      "english": "Marshadow",
      "japanese": "マーシャドー",
      "chinese": "玛夏多",
      "french": "Vémini"
    },
    "type": [
      "Fighting",
      "Ghost"
    ],
    "base": {
      "HP": 90,
      "Attack": 125,
      "Defense": 80,
      "Sp. Attack": 90,
      "Sp. Defense": 90,
      "Speed": 125
    }
  },
  {
    "id": 803,
    "name": {
      "english": "Poipole",
      "japanese": "ベベノム",
      "chinese": "毒贝比",
      "french": "Mandrillon"
    },
    "type": [
      "Poison"
    ],
    "base": {
      "HP": 67,
      "Attack": 73,
      "Defense": 67,
      "Sp. Attack": 73,
      "Sp. Defense": 67,
      "Speed": 73
    }
  },
  {
    "id": 804,
    "name": {
      "english": "Naganadel",
      "japanese": "アーゴヨン",
      "chinese": "四颚针龙",
      "french": "Ama-Ama"
    },
    "type": [
      "Poison",
      "Dragon"
    ],
    "base": {
      "HP": 73,
      "Attack": 73,
      "Defense": 73,
      "Sp. Attack": 127,
      "Sp. Defense": 73,
      "Speed": 121
    }
  },
  {
    "id": 805,
    "name": {
      "english": "Stakataka",
      "japanese": "ツンデツンデ",
      "chinese": "垒磊石",
      "french": "Pierroteknik"
    },
    "type": [
      "Rock",
      "Steel"
    ],
    "base": {
      "HP": 61,
      "Attack": 131,
      "Defense": 211,
      "Sp. Attack": 53,
      "Sp. Defense": 101,
      "Speed": 13
    }
  },
  {
    "id": 806,
    "name": {
      "english": "Blacephalon",
      "japanese": "ズガドーン",
      "chinese": "砰头小丑",
      "french": "Zeraora"
    },
    "type": [
      "Fire",
      "Ghost"
    ],
    "base": {
      "HP": 53,
      "Attack": 127,
      "Defense": 53,
      "Sp. Attack": 151,
      "Sp. Defense": 79,
      "Speed": 107
    }
  },
  {
    "id": 807,
    "name": {
      "english": "Zeraora",
      "japanese": "ゼラオラ",
      "chinese": "捷拉奥拉",
      "french": "Meltan"
    },
    "type": [
      "Electric"
    ],
    "base": {
      "HP": 88,
      "Attack": 112,
      "Defense": 75,
      "Sp. Attack": 102,
      "Sp. Defense": 80,
      "Speed": 143
    }
  },
  {
    "id": 808,
    "name": {
      "english": "Meltan",
      "japanese": "メルタン",
      "chinese": "美录坦",
      "french": "Melmetal"
    },
    "type": [
      "Steel"
    ],
    "base": {
      "HP": 46,
      "Attack": 65,
      "Defense": 65,
      "Sp. Attack": 55,
      "Sp. Defense": 35,
      "Speed": 34
    }
  },
  {
    "id": 809,
    "name": {
      "english": "Melmetal",
      "japanese": "メルメタル",
      "chinese": "美录梅塔",
      "french": ""
    },
    "type": [
      "Steel"
    ],
    "base": {
      "HP": 135,
      "Attack": 143,
      "Defense": 143,
      "Sp. Attack": 80,
      "Sp. Defense": 65,
      "Speed": 34
    }
  }
];

export default pokedex;
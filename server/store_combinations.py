import itertools
from pymongo import MongoClient

def get_combinations():
    def modify(s):
        ml = []
        ref = {"S":0, "D":1, "F":2, "J":3, "K":4, "L":5}
        for c in s:
            ml.append(ref[c])
        return ml
    st = "SDFJKL"
    l = [''.join(word) for word in itertools.product(st, repeat=6)]
    ml = [modify(pattern) for pattern in l]
    return [{"PATTERN":l[i], "POSITIONS":ml[i]} for i in range(len(l))]

combinations = get_combinations()
client = MongoClient()
db = client['game_db']
db['patterns'].insert_many(combinations)

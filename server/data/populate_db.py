import pymongo
from nltk.corpus import wordnet
from pymongo import MongoClient
client = MongoClient()
db = client['perceptive_mem_check_db']
coll = db['words']
coll.delete_many({})

with open("orig_words.txt") as fp:
    lines = fp.readlines()

word_blank_associations = {}
for line in lines:
    splits = line.strip().split()
    word_blank_associations[splits[0]] = splits[1]

for key in word_blank_associations:
    syns = wordnet.synsets(key)
    if syns:
        coll.insert_one({"WORD":key, "BLANKS":word_blank_associations[key], "DESCRIPTION":syns[0].definition()})
    else:
        coll.insert_one({"WORD":key, "BLANKS":word_blank_associations[key],
            "DESCRIPTION":""})

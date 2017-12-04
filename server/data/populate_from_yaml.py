import yaml
import pymongo
from pymongo import MongoClient
from pprint import pprint

client = MongoClient()
db = client['procedural_mem_check_db']

data={}
with open("words.yaml", 'r') as stream:
    try:
        data=yaml.load(stream)
    except yaml.YAMLError as exc:
        print(exc)



collections = {}
for key in data.keys():
  collections[key]=db[key]
  collections[key].delete_many({})

for key in data.keys():
  collections[key].insert_one({"CATEGORY":key, "WORDS":data[key]})
  
for key in data.keys():
  coll=db[key]
  cursor=coll.find({})
  for doc in cursor:
    pprint(doc)



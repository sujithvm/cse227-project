import math
import random
import pickle
import os.path
import yaml
from pymongo import MongoClient
from nltk.corpus import wordnet
from collections import OrderedDict
from operator import itemgetter


class ProceduralMemoryChecker:
    def __init__(self):
        client = MongoClient()
        self.db = client['procedural_mem_check_db']

    def _get_word_list_for_user(self, user):
        return (self.db['users'].find_one({"name":user}, {"_id":0,
        "name":0}))['word_list']

    '''def _get_users(self):
        return self._word_list_associations.keys()'''

    def _get_random_word_list(self, size):
        categories = self._get_word_categories()
        result=[]
        for i in range(0,size):
            category = random.choice(categories)
            words  = list(self.db[category].distinct('WORDS'))
            result.append(random.sample(words,2))
        return result

    def _get_word_categories(self):
        categories = self.db.collection_names()
        categories = [x for x in categories  if x != 'users']
        return categories
         

    def register_user(self, user):
        results = list(self.db['users'].find({'name':user}))
        if results:
            print("User already exists")
            return False
        user_word_list = self._get_random_word_list(20)
        self.db['users'].insert_one({'name':user, "word_list":user_word_list})
        return True

    def get_train_set_for_user(self, user):
         return self._get_word_list_for_user(user)
        

    def get_test_set_for_user(self, user):
        word_list_for_user = [[ word+'.n.01' for word in word_pair] for word_pair in self._get_word_list_for_user(user)]
        all_words=[]
        results=[]
        categories = self._get_word_categories()
        for category in categories:
            all_words.append([word+".n.01" for word in self.db[category].distinct('WORDS')])
        all_words = [val for sublist in all_words for val in sublist]
        for word_pair in word_list_for_user:
            result_pair=[]
            for word in word_pair:
                similarity_list={}
                word1=wordnet.synset(word)
                for w in all_words:
                  word2=wordnet.synset(w)
                  similarity_list[w]= wordnet.wup_similarity(word1,word2)
                similarity_list=(OrderedDict(sorted(similarity_list.items(),key=itemgetter(1),reverse=True))).keys()[1:11]
                result_pair.append((random.choice(similarity_list)).split('.')[0])
            results.append(result_pair)


        return results


sample=ProceduralMemoryChecker()
sample.register_user("lmn")
print(sample.get_train_set_for_user("lmn"))
print("######################")
print(sample.get_test_set_for_user("lmn"))

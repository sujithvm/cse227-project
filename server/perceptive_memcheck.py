import math
import random
import pickle
import os.path
from pymongo import MongoClient


class PerceptiveMemoryChecker:
    def __init__(self):
        client = MongoClient()
        self.db = client['perceptive_mem_check_db']

    def _get_word_list_for_user(self, user):
        return (self.db['users'].find_one({"name":user}, {"_id":0,
        "name":0}))['word_list']

    def _get_users(self):
        return self._word_list_associations.keys()

    def _get_random_word_list(self, size):
        results = list(self.db['words'].find({}, {"_id":0 }))
        random.shuffle(results)
        return results[:20]


    def register_user(self, user):
        results = list(self.db['users'].find({'name':user}))
        if results:
            print("User already exists")
            return False
        user_word_list = self._get_random_word_list(20)
        self.db['users'].insert_one({'name':user, "word_list":user_word_list})
        return True

    def get_train_set_for_user(self, user):
        word_list_blanks = self._get_word_list_for_user(user)
        for d in word_list_blanks:
            d["POSITIONS"] =  [i for i, ltr in enumerate(d['BLANKS']) if ltr == "_"]
        return word_list_blanks

    def get_test_set_for_user(self, user):
        word_list_for_user = [d["WORD"] for d in
            self._get_word_list_for_user(user)]
        word_set_for_user = set(word_list_for_user)
        results = self.db['words'].find({}, {"WORD":1, "_id":0})
        all_words = [d["WORD"] for d in results]
        avail_words = list(set(all_words) - word_set_for_user)
        random.shuffle(word_list_for_user)
        random.shuffle(avail_words)
        test_word_list = word_list_for_user[:10] + avail_words[:10]
        results = list(self.db['words'].find({"$or":[{"WORD":word} for word in
            test_word_list] }, {"_id":0}))
        for d in results:
            d["POSITIONS"] =  [i for i, ltr in enumerate(d['BLANKS']) if ltr == "_"]
        return results


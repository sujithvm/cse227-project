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

    def _get_word_set_for_user(self, user):
        return (self.db['users'].find_one({"name":user}, {"_id":0,
        "name":0}))['word_set']

    '''def _get_users(self):
        return self._word_set_associations.keys()'''

    def _get_random_word_set(self, size):
        categories = self._get_word_categories()
        result=[]
        for i in range(0,size):
            category = random.choice(categories)
            words  = set(self.db[category].distinct('WORDS'))
            word = random.sample(words, 1)[0]
            words.remove(word)
            word1 = wordnet.synset(word + ".n.01")
            similarity = []
            for w in words:
                word2 = wordnet.synset(w + ".n.01")
                similarity.append((wordnet.wup_similarity(word1,word2), w))
            sorted(similarity, reverse=False)
            result.append((word, random.choice(similarity[:10])[1], category))
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
        user_word_set = self._get_random_word_set(20)
        self.db['users'].insert_one({'name':user, "word_set":user_word_set})
        return True

    def get_train_set_for_user(self, user):
        word_set_for_user = self._get_word_set_for_user(user)
        word_set_for_user = [(ele[0], ele[1]) for ele in word_set_for_user]
        return word_set_for_user

    def _get_similar_word(self, word, word_set):
        if word not in word_set:
            print(word, word_set, len(word_set))
        word1 = wordnet.synset(word + ".n.01")
        similarity = []
        reinsert = False
        if word in word_set:
            reinsert = True
            word_set.remove(word)
        for w in word_set:
            word2 = wordnet.synset(w + ".n.01")
            similarity.append((wordnet.wup_similarity(word1,word2), w))
        if reinsert:
            word_set.add(word)
        sorted(similarity, reverse=True)
        return random.choice(similarity[:10])[1]

        


    def get_test_set_for_user(self, user):
        word_set_for_user = self._get_word_set_for_user(user)
        test_set_for_user = []
        category_words = {}
        words = set()
        for category in self._get_word_categories():
            category_words[category] = set(self.db[category].distinct('WORDS'))
        for word_tuple in word_set_for_user:
            similar_word1 = self._get_similar_word(word_tuple[0],
                    category_words[word_tuple[2]] - words)
            words.add(similar_word1)
            similar_word2 = self._get_similar_word(word_tuple[1],
                    category_words[word_tuple[2]] - words)
            words.add(similar_word2)
            test_set_for_user.append((similar_word1, similar_word2))
        return test_set_for_user

        """ 
        word_set_for_user = [[ word+'.n.01' for word in word_pair] for word_pair in self._get_word_set_for_user(user)]
        all_words=[]
        results=[]
        categories = self._get_word_categories()
        for category in categories:
            all_words.append([word+".n.01" for word in self.db[category].distinct('WORDS')])
        all_words = [val for sublist in all_words for val in sublist]
        for word_pair in word_set_for_user:
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



        """

if __name__=="__main__":
    sample=ProceduralMemoryChecker()
    sample.register_user("lmn")
    print(sample.get_train_set_for_user("lmn"))
    print("######################")
    print(sample.get_test_set_for_user("lmn"))

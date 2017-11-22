import math
import random
import pickle
import os.path

class PerceptiveMemoryChecker:
    def __init__(self):
        self.words = self._get_words()
        self.available_word_lists = self._get_available_word_lists()
        self._word_list_associations = self._get_word_list_associations()
        self._word_blank_associations = self._get_word_blank_associations()

    def _get_words(self):
        with open("words.txt") as fp:
            words = list(map(lambda x: x.strip(), fp.readlines()))
        return words

    def _get_word_list_from_index(self, index):
        word_list = []
        start_index = len(self.words) - index
        for i in range(20):
            word_list.append(self.words[start_index+i])
        return word_list

    def _get_word_blank_associations(self):
        with open("orig_words.txt") as fp:
            lines = fp.readlines()
        word_blank_associations = {}
        for line in lines:
            splits = line.strip().split()
            word_blank_associations[splits[0]] = splits[1]
        return word_blank_associations

    def _get_all_word_lists(self):
        start = 20
        word_lists = []
        while(start < len(self.words)):
            word_lists.append(self._get_word_list_from_index(start))
            start += 10
        return word_lists

    def _get_available_word_lists(self):
        if not os.path.isfile("available_word_lists.pickle"):
            word_lists = self._get_all_word_lists()
            return word_lists
            #pickle.dump(word_lists, open("available_word_lists.pickle", "wb"))
        return pickle.load(open("available_word_lists.pickle", "rb"))

    def _get_word_list_associations(self):
        if not os.path.isfile("word_list_associations.pickle"):
            return {}
            #word_list_associations = {}
            #pickle.dump(word_list_associations, open("word_list_associations.pickle", "wb"))
        return pickle.load(open("word_list_associations.pickle", "rb"))

    def _get_users(self):
        return self._word_list_associations.keys()

    def _get_blanks_for_word(self, word):
        return self._word_blank_associations[word]


    def check_user(self, user):
        if user in self._word_list_associations:
            return True

    def register_user(self, user):
        if user in self._word_list_associations:
            print("User already exists")
            return False
        self._word_list_associations[user] = self.available_word_lists.pop()
        pickle.dump(self.available_word_lists, open("available_word_lists.pickle", "wb"))
        pickle.dump(self._word_list_associations, open("word_list_associations.pickle", "wb"))
        return True

    def get_train_set_for_user(self, user):
        word_list = self._get_word_list_for_user(user)
        word_blanks = list(map(self._get_blanks_for_word, word_list))
        blank_indices =  [[i for i, ltr in enumerate(word) if ltr == "_"] for
                word in word_blanks]
        return [{"actual": word_list[i], "word":word_blanks[i],
            "pos":blank_indices[i]} for i in range(len(word_list))]

    def get_test_set_for_user(self, user):
        word_list = self._get_word_list_for_user(user)
        word_set = set(word_list)
        avail_words = list(set(self.words) - word_set)
        random.shuffle(word_list)
        random.shuffle(avail_words)
        test_word_list = word_list[:10] + avail_words[:10]
        word_blanks = list(map(self._get_blanks_for_word, test_word_list))
        blank_indices =  [[i for i, ltr in enumerate(word) if ltr == "_"] for
                word in word_blanks]
        return [{"actual": test_word_list[i], "word":word_blanks[i],
            "pos":blank_indices[i]} for i in range(len(word_list))]




    def _get_word_list_for_user(self, user):
        if user in self._word_list_associations:
            return self._word_list_associations[user]
        self._word_list_associations[user] = self.available_word_lists.pop()
        pickle.dump(self.available_word_lists, open("available_word_lists.pickle", "wb"))
        pickle.dump(self._word_list_associations, open("word_list_associations.pickle", "wb"))
        return self._word_list_associations[user]

        



import pymongo
from HackathonScrape import property_Info_Getter
from HackathonScrape2 import property_Info_Getter2
from HackathonScrape3 import property_Info_Getter3

client = pymongo.MongoClient("mongodb+srv://karim:qhacksgangshit@cluster0-juenz.mongodb.net/test?retryWrites=true&w=majority")
database = client.get_database('qhacks')
collection = database.property

listing_one =  property_Info_Getter()
listing_two =  property_Info_Getter2()
listing_three = property_Info_Getter3()

propertyListings = listing_one + listing_two + listing_three

for i in propertyListings:
    if collection.count_documents({"address":i["address"]}) == 0:
        collection.insert_one(i)
    else:
        collection.find_one_and_delete({"address":i["address"]})
        collection.insert_one(i)

from bs4 import BeautifulSoup
from datetime import datetime
import requests
import re

def property_Info_Getter3():
    flag = True
    url = "http://cypresskingston.ca/student-friendly/"

    links = []
    properties = []

    while flag:
        source = requests.get(url).text  # getting the source HTML code from the website
        soup = BeautifulSoup(source, 'html')  # cleaning it up in an easy to read format

        for article in soup.find_all('div', {'class': 'property_listing'}):  # finds all links for listings
            links.append(article['data-link'])  # appends links to a list

        nextPage = soup.find('li', {'class': 'roundright'}).a['href']
        x = requests.head(nextPage).status_code

        if x != 200 or nextPage == "" or nextPage == url:
            break
        else:
            url = nextPage

    for property_link in links:
        property_dic = {"address": "", "unit": "", "date": "", "bed": "", "bath": "", "price": "", "link": ""}
        property_dic["link"] = property_link
        today  = datetime.now()
        property_dic["date"] = today.timestamp()

        propertyPage_Source = requests.get(property_link).text
        propertyPage = BeautifulSoup(propertyPage_Source, 'html')

        Address_Source = propertyPage.find('h1',{'class':'entry-title'}).text.lower()
        Address_Source = Address_Source.split("#")
        Full_Address = Address_Source[0].replace(chr(8211), "").split()

        if len(Address_Source) > 1:
            Unit = int(Address_Source[1])
            property_dic["unit"] = Unit

        Banned_Words=["apartment", "apt", "apt.", "e."]

        if Full_Address[0].isdigit():
            New_Address = Full_Address[0]

            if Full_Address[1].isalpha():
                New_Address += " " + Full_Address[1]

                print(Full_Address)
                print(len(Full_Address))
                print(len(Full_Address) > 2)

                if len(Full_Address) < 3:
                    property_dic["address"] = New_Address

                elif Full_Address[2].strip() in Banned_Words:
                    property_dic["address"] = New_Address

                elif len(Full_Address) > 2:
                    property_dic["address"] = New_Address + " " + Full_Address[2]

                info = propertyPage.find(id='details').find_all('div',{'class':'listing_detail'})
                refined_info = []

                for s in info:
                    refined_info.append(s.text.split(":"))

                for i in refined_info:
                    if i[0].find("price") == 0 or i[0].find("Price") == 0:
                        property_dic['price'] = int(''.join(c for c in i[1] if c.isdigit()))
                    elif (i[0].find("bed") == 0 or i[0].find("Bed") == 0) and i[1].strip().isdigit():
                        property_dic["bed"] = int(i[1])
                    elif (i[0].find("bath") == 0 or i[0].find("Bath") == 0) and i[1].strip().isdigit():
                        property_dic["bath"]= int(i[1])

                properties.append(property_dic)

    for i in properties:
        print(i)
    return properties
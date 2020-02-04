from bs4 import BeautifulSoup
import requests


def property_Info_Getter2():
    '''
    Description: Concept for scraping websites with the format of patryinc
    Returns: Properties, a list of dictionaries
    '''

    source = requests.get("https://patryinc.com/student-rentals").text
    soup = BeautifulSoup(source, 'html')
    links = []  # individual houses links
    properties = []  # collection of properties, to be returned at the end

    for article in soup.find_all('figure', {
        'class': 'wpb_wrapper vc_figure'}):  # looks in specific class to find each page link of a posting
        links.append(article.a['href'])  # saves links to list

    for i in range(len(links)):  # parses through links
        source = requests.get(links[i]).text
        soup = BeautifulSoup(source, 'html')
        head_links = soup.findAll('div', {
            'class': 'sc_table_wrap'})  # finds the part of the html code containing houses indivudal information
        for article in head_links:
            if "ALL UNITS LEASED" not in article.text:  # rejects all non available properties
                propertyy = article.text.split("\n")
                dic = {"address": "", "unit": "", "date": "", "bed": "", "bath": "", "price": "",
                       "link": ""}  # initializes dictionary
                for prop in range(len(propertyy)):
                    if propertyy[prop] != "":
                        if i == 1 and "St." in propertyy[prop]:
                            dic["address"] = propertyy[prop]
                        if i != 1:
                            dic["address"] = links[i].replace("https://patryinc.com/", "").replace("-", " ")
                        dic["link"] = links[i]
                        if "Unit" in propertyy[prop]:
                            dic["unit"] = propertyy[prop]
                        if len(propertyy[prop]) == 1:
                            dic["bed"] = int(propertyy[prop])
                        if "$" in propertyy[prop] and "," in propertyy[prop]:
                            dic["price"] = int(
                                propertyy[prop].replace("$", "").replace("\xa0", "").replace(",", "").replace(".00",
                                                                                                              ""))
                        if "2020" in propertyy[prop]:
                            dic["date"] = propertyy[prop]
                            properties.append(dic)
                            dic = {"address": "", "unit": "", "date": "", "bed": "", "bath": "", "price": "",
                                   "link": ""}
    return properties

print(property_Info_Getter2())
from bs4 import BeautifulSoup
import requests
from datetime import datetime

def property_Info_Getter():
    source = requests.get(
        "https://axonproperties.ca/available-rentals-kingston/").text  # getting the source HTML code from the website
    soup = BeautifulSoup(source, 'html.parser')  # cleaning it up in an easy to read format

    links = []
    text = []
    adresses = []
    bedrooms = []
    innerText = []
    properties = []

    for article in soup.find_all('div', {'class': 'elementor-button-wrapper'}):  # finds all links for listings
        links.append(article.a['href'])  # appends links to a list

    for article in soup.find_all('div', {'class': 'elementor-widget-wrap'}):
        if "Bed" in article.text:
            innerText.append((article.text).replace("\n", ""))
    for i in range(1, 17):
        propertyy = innerText[i].split(', ')
        dic = {"address": "", "unit": "", "date": "", "bed": "", "bath": "", "price": "", "link": ""}
        if len(propertyy) == 4:
            dic["address"] = (propertyy[0].strip())
            dic["unit"] = propertyy[1].split(" ")[0] + " " + propertyy[1].split(" ")[1]
            date = (propertyy[1].split(" ")[2] + " " + propertyy[1].split(" ")[3] + " "
                        + propertyy[2].split(" ")[1]).replace("st","").replace("th","").replace("nd","").replace("rd","")
            dic["date"] = datetime.strptime(date, '%B %d %Y').timestamp()
            dic["bed"] = int(propertyy[2].split(" ")[2])
            dic["bath"] = int(propertyy[3].split(" ")[0])
            dic["price"] = int((propertyy[3].split(" ")[2]).replace("/monthView", "").replace("$","").replace(",",""))
            dic["link"] = links[i - 1]

        if len(propertyy) == 3:
            dic["address"] = (propertyy[0].split(" ")[0] + " " + propertyy[0].split(" ")[1] + " " + \
                             propertyy[0].split(" ")[2] + " " + propertyy[0].split(" ")[3]).strip()
            date = (propertyy[0].split(" ")[4] + " " + propertyy[0].split(" ")[5] + " "
                                + propertyy[1].split(" ")[1]).replace("st","").replace("th","").replace("nd","").replace("rd","")
            dic["date"] = datetime.strptime(date, '%B %d %Y').timestamp()
            dic["bed"] = int(propertyy[1].split(" ")[2])
            dic["bath"] = int(propertyy[2].split(" ")[0])
            dic["price"] = int((propertyy[2].split(" ")[2]).replace("/monthView", "").replace("$","").replace(",",""))
            dic["link"] = links[i - 1]

        properties.append(dic)

    return properties
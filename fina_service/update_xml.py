import requests


def update():
    url = "https://ceyo.com.tr/xml/?AltUrun=1&TamLink=1&Dislink=1&Seo=1&Imgs=1&start=0&limit=99999&pass=q2rwq1&R=164045&K=b8f2"
    try:
        response = requests.get(url)
        with open("ceyo.com.tr.xml", "wb") as f:
            f.write(response.content)
    except Exception as e:
        print("Error updating XML file:",e)


    print("xml file updated!") 


def main():
    update()

if __name__ == "__main__":
    main() 



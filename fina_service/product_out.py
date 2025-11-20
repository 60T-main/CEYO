from get_data import fetch, auth

def save_product_out(body):
    token= auth()
    response = fetch(f"api/reporting/getRealizesJournal/",token, body=body, method='POST')

    return response
    

def main():
    ...


if __name__ == "__main__":
    main()



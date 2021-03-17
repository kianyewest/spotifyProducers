import requests

url = "https://api.genius.com/search?q=jim-e%20stack"

payload={}
headers = {
  'Authorization': 'Bearer Vc3TTP0H4K725TiOtFBrERqNRQA2LSbg5s_YHqUaUVjqUUXUAcFBH22tUO1X--gd',
  'Cookie': '__cfduid=d938a28355c93f4c414c99724297184811615539778'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)


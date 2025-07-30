# scripts/auto_supplier_search.py
import requests
import time
from typing import List

def search_local_suppliers(service_type: str, suburb: str, state: str) -> List[dict]:
    headers = {
        'User-Agent': 'Mozilla/5.0'
    }
    query = f"{service_type} services near {suburb}, {state}"
    params = {
        'q': query,
        'num': 5,
        'hl': 'en'
    }
    response = requests.get('https://serpapi.com/search.json', params={**params, 'api_key': 'YOUR_SERPAPI_KEY'})

    if response.status_code != 200:
        print("Failed to fetch results", response.text)
        return []

    results = []
    for result in response.json().get('local_results', [])[:5]:
        results.append({
            'service_type': service_type,
            'business_name': result.get('title'),
            'suburb': suburb,
            'state': state,
            'email': result.get('email'),
            'phone': result.get('phone'),
            'source_url': result.get('link')
        })

    return results

# Example usage:
if __name__ == '__main__':
    suppliers = search_local_suppliers("soil test", "Aldinga Beach", "SA")
    for s in suppliers:
        print(s)
    time.sleep(1)

from supabase import create_client, Client
import pandas as pd
import os
from dotenv import load_dotenv
load_dotenv()  # This loads the environment variables from the .env file

# Now you can safely access the environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


# Load Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load the spreadsheet data
df = pd.read_excel(r"C:\Users\denni\Downloads\Australian Councils by Postcode.xlsx", sheet_name="Flat AusPostcodes cleaned")

# Clean data and prepare for insertion
suppliers_data = df[['Postcode', 'Locality', 'SA3 Name', 'LGA Region']].dropna()

# Insert each row into the Supabase table
for index, row in suppliers_data.iterrows():
    supplier = {
        'postcode': row['Postcode'],
        'locality': row['Locality'],
        'sa3_name': row['SA3 Name'],
        'lga_region': row['LGA Region']
    }

    try:
        # Insert into the table
        supabase.table('councils_by_postcode').insert(supplier).execute()
        print(f"Inserted: {supplier['postcode']} - {supplier['locality']}")
    except Exception as e:
        print(f"Error inserting {supplier['postcode']}: {e}")


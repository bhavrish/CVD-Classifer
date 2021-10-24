import csv
import pandas as pd

#pd.read_csv('Data\heart_failure_clinical_records_dataset.csv')

with open('Data\heart_failure_clinical_records_dataset.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        print(row)


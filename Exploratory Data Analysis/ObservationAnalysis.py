import pandas as pd
import matplotlib.pyplot as plt
import csv

df = pd.read_csv('../Data/cardio_train.csv', delimiter=';')

print(df.head())
print("Number of observations: " + str(df.shape[0]))
print(df.isnull().sum()) # Total number of NaN values
print(df.isna().sum()) # Total number of empty values
import pandas as pd
import matplotlib.pyplot as plt
import csv

df = pd.read_csv('../Data/cardio_train.csv', delimiter=';')
df['age'] /= 365 # Convert age to years.
print(df.info())
print(df.corr())
plt.matshow(df.corr())
plt.show()
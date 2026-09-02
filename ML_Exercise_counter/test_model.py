import pickle
import pandas as pd

# Load model
with open("exercise_model.pkl", "rb") as file:
    model = pickle.load(file)

print("Model loaded successfully!")

# Show expected features
print("\nFeatures used by model:")
print(model.feature_names_in_)

# Show classes
print("\nClasses:")
print(model.classes_)
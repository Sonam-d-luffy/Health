import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# 1. Load dataset
df = pd.read_csv("exercise_dataset.csv")

print("Dataset shape:", df.shape)
print("\nClass distribution:")
print(df["label"].value_counts())

# 2. Separate features and labels
X = df.drop("label", axis=1)
y = df["label"]

# 3. Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))

# 4. Create Random Forest model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

# 5. Train
print("\nTraining model...")
model.fit(X_train, y_train)

# 6. Test
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\n==============================")
print("MODEL RESULTS")
print("==============================")
print(f"Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# 7. Save model
with open("exercise_model.pkl", "wb") as file:
    pickle.dump(model, file)

print("\nModel saved successfully!")
print("File: exercise_model.pkl")
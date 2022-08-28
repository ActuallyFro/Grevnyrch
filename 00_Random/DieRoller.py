# A simple Die roller for D&D

# Print Menu for d4 to d20 selection
print("\nSelect a die to roll:")
print("1. d4")
print("2. d6")
print("3. d8")
print("4. d10")
print("5. d12")
print("6. d20")

# Get user input for die selection
die_selection = int(input("\nEnter your selection: "))

# If statement to determine die selection and roll
if die_selection == 1:
    import random
    die_roll = random.randint(1, 4)
    print("\nYou rolled a", die_roll)
elif die_selection == 2:
    import random
    die_roll = random.randint(1, 6)
    print("\nYou rolled a", die_roll)
elif die_selection == 3:
    import random
    die_roll = random.randint(1, 8)
    print("\nYou rolled a", die_roll)
elif die_selection == 4:
    import random
    die_roll = random.randint(1, 10)
    print("\nYou rolled a", die_roll)
elif die_selection == 5:
    import random
    die_roll = random.randint(1, 12)
    print("\nYou rolled a", die_roll)
elif die_selection == 6:
    import random
    die_roll = random.randint(1, 20)
    print("\nYou rolled a", die_roll)
else:
    print("\nInvalid selection")
    print("\nExiting...")
    exit()
    
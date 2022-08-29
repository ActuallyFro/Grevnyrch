from itertools import count
import random
import os
    
def clear():
   if os.name == 'nt':
      _ = os.system('cls')

   else:
    _ = os.system('clear')

def PrintDieSelection(DiceAmount):
    print("\nSelect a die to roll:")
    print("0. Enter total dice to roll")
    print("1. d4")
    print("2. d6")
    print("3. d8")
    print("4. d10")
    print("5. d12")
    print("6. d20")
    print("\n")
    # q for quit
    print("q. Quit")
    print("Current dice amount:", DiceAmount)

    return

def AskForDiePick():
    die_selection = 0
    userInput =input("\nEnter your selection: ")

    if userInput.isdigit():
        die_selection = int(userInput)
    
    if userInput == "q":
        return -99
        
    if die_selection == 0:
        return 100
    elif die_selection == 1:
        return 4
    elif die_selection == 2:
        return 6
    elif die_selection == 3:
        return 8
    elif die_selection == 4:
        return 10
    elif die_selection == 5:
        return 12
    elif die_selection == 6:
        return 20
    else:
        print("\nInvalid selection!")

    return -1

def AskForDiceToRoll():
    total_dice = 1
    userInput =input("\nEnter total dice to roll: ")

    if userInput.isdigit():
        total_dice = int(userInput)
    
    print("\nSetting total dice to:", total_dice)

    return total_dice

def main():
    
    die_picked = False
    isUserDone = False
    upper_limit = 0
    counter = 0
    total_dice = 1

    while not isUserDone:
        if not die_picked:
            clear()
            PrintDieSelection(total_dice)
            upper_limit = AskForDiePick()
            if upper_limit <= 0:
                if upper_limit == -99:
                    isUserDone = True
                continue
            elif upper_limit == 100:
                clear()
                total_dice=AskForDiceToRoll()
                continue

            die_picked = True
            counter = 0

        else:
            for i in range(total_dice):
                counter += 1
                die_roll = random.randint(1, upper_limit)
                print("\n[", counter ,"] You rolled a ⦗", die_roll, "⦘")

            user_input = input("\n\tEnter to roll again; any # returns to main menu...")

            if user_input == "n":
                isUserDone = True

            elif user_input.isdigit():
                print("\nInvalid selection!")
                die_picked = False

            # else: #NOTHING -- aka reroll
            #     print("\nInvalid selection!")

if __name__ == "__main__":
    main()    

from itertools import count
import random
import os
    
def clear():
   if os.name == 'nt':
      _ = os.system('cls')

   else:
    _ = os.system('clear')

def PrintDieSelection():
    print("\nSelect a die to roll:")
    print("1. d4")
    print("2. d6")
    print("3. d8")
    print("4. d10")
    print("5. d12")
    print("6. d20")
    print("\n")
    # q for quit
    print("q. Quit")

    return

def AskForDiePick():
    die_selection = 0
    userInput =input("\nEnter your selection: ")

    if userInput.isdigit():
        die_selection = int(userInput)
    
    if userInput == "q":
        return -99

    if die_selection == 1:
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

def main():
    
    die_picked = False
    isUserDone = False
    upper_limit = 0
    counter = 0

    while not isUserDone:
        if not die_picked:
            clear()
            PrintDieSelection()
            upper_limit = AskForDiePick()
            if upper_limit <= 0:
                if upper_limit == -99:
                    isUserDone = True
                continue
            die_picked = True
            counter = 0

        else:
            die_roll = random.randint(1, upper_limit)
            counter += 1
            print("\n[", counter ,"] You rolled a ⦗", die_roll, "⦘")

            user_input = input("\n\tRoll again? (y/n): ")

            if user_input == "n":
                isUserDone = True

            elif user_input.isdigit():
                print("\nInvalid selection!")
                die_picked = False

            # else: #NOTHING -- aka reroll
            #     print("\nInvalid selection!")

if __name__ == "__main__":
    main()    

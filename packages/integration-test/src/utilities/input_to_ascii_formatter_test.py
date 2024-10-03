from input_to_ascii_formatter import *

names_with_diacritics =  ["Renée", "Noël", "Sørina", "Adrián", "Zoë", "François", "Mary-Jo", "Mónica", "Seán", "Mathéo", "Ruairí", "Mátyás", "Jokūbas", "John-Paul", "Siân", "Agnès", "Maël", "János", "KŠthe", "Chloë", "Øyvind", "Asbjørn", "Fañch", "José", "Nuñez"]
names_without_diacritics =  ["Renee", "Noel", "Sorina", "Adrian", "Zoe", "Francois", "Mary-Jo", "Monica", "Sean", "Matheo", "Ruairi", "Matyas", "Jokubas", "John-Paul", "Sian", "Agnes", "Mael", "Janos", "KSthe", "Chloe", "Oyvind", "Asbjorn", "Fanch", "Jose", "Nunez"]

names_with_non_letters = ["Kryst4l", "S#ub#a", "M!cha3l", "   Jack-son   ", "M@nju", "$tephen", "8ill", "Sa^^^^y", "Ma+ias"]
names_with_only_letters = ["Krystl", "Suba", "Mchal", "Jack-son", "Mnju", "tephen", "ill", "Say", "Maias"]

def print_passed(name, formatted_name, passed):
  if (passed):
    print(name + " to " + formatted_name + ": Passed!")
  else:
    print("\n***\n" + name + " to " + formatted_name + ": Failed." + "\n***\n")

def test_all_names_with_diacritics():
  name_index = 0
  for name in names_with_diacritics:
    formatted_name = input_to_ASCII_formatter(name, False)
    print_passed(name, formatted_name, name == names_with_diacritics[name_index] and formatted_name == names_without_diacritics[name_index])
    name_index += 1

def test_removes_all_non_letters():
  name_index = 0
  for name in names_with_non_letters:
    formatted_name = input_to_ASCII_formatter(name, True)
    print_passed(name, formatted_name, name == names_with_non_letters[name_index] and formatted_name == names_with_only_letters[name_index])
    name_index += 1

if(sys.argv[1] == 1 or sys.argv[1] == "diacritics"):
  test_all_names_with_diacritics()
if(sys.argv[1] == 2 or sys.argv[1] == "letters"):
  test_removes_all_non_letters()
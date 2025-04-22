const responses = {
    "hello": ["Hi there! 😊", "Hello! How can I assist you?", "Hey! What's up?", "Greetings! 👋", "Howdy!"],
    "how are you": ["I'm just a bot, but I'm feeling great! 😃", "I'm doing well, thanks! How about you?", "Just here to help!"],
    "what's your name": ["I'm just a chatbot. You can call me whatever you like!", "I don't have a name, but I'm here to help!"],
    "what can you do": ["I can chat with you, answer questions, and keep you entertained!", "I'm here to assist you with anything I can!"],
    "tell me a joke": [
        "Why don't skeletons fight each other? They don’t have the guts! 🤣",
        "Why did the scarecrow win an award? Because he was outstanding in his field! 😂",
        "What do you call fake spaghetti? An impasta! 🍝",
        "Why can't your nose be 12 inches long? Because then it would be a foot! 🤣"
    ],
    "what's the meaning of life": ["42. Just kidding! It's whatever you make of it. 😉", "To be happy and make the world a better place!"],
    "who created you": ["I was made by a developer who wanted me to chat with you!", "I exist thanks to the magic of programming!"],
    "do you like me": ["Of course! You're awesome! 😊", "I like everyone who chats with me!"],
    "how old are you": ["I don't age, but I'm always learning new things!", "I'm as old as the internet... just kidding!"],
    "can you help me": ["Sure! What do you need help with?", "Of course! Tell me what's on your mind."],
    "goodbye": ["Goodbye! Have a great day! 😊", "See you later! Take care!", "Bye! Come back anytime!"],
    "thank you": ["You're welcome! 😊", "No problem! Happy to help!", "Anytime!"],
    "who is your favorite person": ["Everyone who talks to me! 😃", "I like you! You're fun to chat with!"],
    "what's your favorite color": ["I like all colors, but blue is quite nice!", "I can't see colors, but I hear purple is cool!"],
    "are you real": ["I'm as real as you want me to be! 😉", "I'm just code, but I'm here for you!"],
    "how does the internet work": [
        "The internet is a network of connected devices that communicate with each other using protocols like HTTP!",
        "It's a vast web of data, servers, and users all around the world!"
    ],
    "how do computers work": [
        "Computers process binary code (0s and 1s) to perform tasks and calculations!",
        "They use hardware and software to execute instructions!"
    ],
    "random fact": [
        "Did you know honey never spoils? 🍯",
        "The Eiffel Tower can grow taller in the summer! 🌞",
        "Octopuses have three hearts! 🐙",
        "Bananas are berries, but strawberries aren’t! 🍌",
        "A day on Venus is longer than a year on Venus! 😲"
    ],
    "history": [
        "The Great Wall of China is over 13,000 miles long! 🏯",
        "The first email was sent in 1971. 📧",
        "The Titanic sank in 1912 after hitting an iceberg. 🚢"
    ],
    "science": [
        "Water expands when it freezes, unlike most substances! ❄️",
        "A teaspoon of a neutron star would weigh about 6 billion tons! 🌠",
        "Lightning is hotter than the surface of the sun! ⚡"
    ],
    "space": [
        "Did you know there’s a giant storm on Jupiter called the Great Red Spot? 🌪️",
        "There are more stars in the universe than grains of sand on Earth! 🌌",
        "The sun is about 93 million miles away from Earth! ☀️"
    ],
    "technology": [
        "The first computer was the size of a room! 🖥️",
        "Bluetooth is named after a Viking king, Harald Bluetooth! 📡",
        "Google was originally called 'BackRub'! 🤔"
    ],
    "sports": [
        "The Olympics were originally held in Greece over 2,700 years ago! 🏆",
        "Basketballs were originally brown, not orange! 🏀",
        "Soccer is the most popular sport in the world! ⚽"
    ],
    "movies": [
        "Did you know the first movie ever made was in 1888? 🎥",
        "Titanic and Avatar are among the highest-grossing movies ever! 🎬",
        "The voice of Darth Vader was done by James Earl Jones! 🌌"
    ],
    "food": [
        "Did you know pizza was invented in Italy? 🍕",
        "Chocolate was once used as currency by the Aztecs! 🍫",
        "The world's most expensive coffee comes from beans eaten and excreted by civet cats! ☕"
    ],
    "music": [
        "The Beatles hold the record for the most number-one hits in the U.S.! 🎸",
        "The world's longest concert lasted 639 years! 🎵",
        "Mozart started composing music when he was 5 years old! 🎼"
    ],
    "animals": [
        "A group of flamingos is called a 'flamboyance'! 🦩",
        "Cows have best friends and get stressed when separated! 🐄",
        "Sharks have been around longer than trees! 🦈"
    ],
    "weather": [
        "Did you know a single bolt of lightning can be five times hotter than the sun? ⚡",
        "The coldest temperature ever recorded on Earth was -128.6°F (-89.2°C)! ❄️",
        "A hurricane can release more energy in 10 minutes than all the world's nuclear weapons combined! 🌪️"
    ],
    "health": [
        "Laughing is good for your heart and can boost your immune system! 😂",
        "Drinking enough water can improve brain function and energy levels! 💧",
        "Walking just 30 minutes a day can improve your health! 🚶"
    ],
    "math": [
        "Did you know zero was invented in India? 0️⃣",
        "Pi (π) goes on forever without repeating! 🥧",
        "A 'googol' is a number with 100 zeros! 🔢"
    ],
    "quotes": [
        "Albert Einstein once said: 'Imagination is more important than knowledge.'",
        "Winston Churchill said: 'Success is not final, failure is not fatal: it is the courage to continue that counts.'",
        "Mahatma Gandhi said: 'Be the change that you wish to see in the world.'"
    ],
    "holidays": [
        "Christmas is celebrated on December 25th! 🎄",
        "Halloween originated from the ancient festival of Samhain! 🎃",
        "New Year's Day marks the beginning of the Gregorian calendar year! 🎉"
    ],
    "philosophy": [
        "Descartes said: 'I think, therefore I am.' 🤔",
        "Plato believed in the concept of ideal forms. 🏛️",
        "Socrates taught by asking questions, a method now called the 'Socratic Method'."
    ]
};

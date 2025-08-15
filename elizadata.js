// data for elizabot.js
// entries prestructured as layed out in Weizenbaum's description
// [cf: Communications of the ACM, Vol. 9, #1 (January 1966): p 36-45.]

var elizaInitials = [
    "Hey there! What's on your mind today?",
    "Hi! What's up? Anything you wanna chat about?",
    "Hey! Good to see you. How's it going?",
    "What's cookin'? Tell me something interesting!",
    "Ready to chat! What's been happening with you?",
    "Yo! Glad you're here. What's the latest?",
    "Alright, hit me! What's new?",
    "Hey, stranger! How's life treating you?",
    "What's the word? I'm all ears!",
    "Chillin' out, maxin', relaxin' all cool. What about you?"
];

var elizaFinals = [
    "Catch you later! This was a nice chat.",
    "Alright, gotta run for now! Talk soon!",
    "It was cool hanging out. See ya!",
    "Time flew by! We should definitely do this again.",
    "Later! Hope things go well for you.",
    "Peace out! It was great talking.",
    "Until next time! Take care!",
    "Alrighty, I'm out! Chat again soon.",
    "Had a blast! Bye for now.",
    "Gotta bounce! Keep being awesome."
];

var elizaQuits = [
    "bye",
    "goodbye",
    "done",
    "exit",
    "quit",
    "see ya",
    "later",
    "talk later",
    "break",
    "i'm out",
    "cya",
    "gotta go",
    "peace out"
];

var elizaPres = [
    "dont", "don't",
    "cant", "can't",
    "wont", "won't",
    "recollect", "remember",
    "recall", "remember",
    "dreamt", "dreamed",
    "dreams", "dream",
    "maybe", "perhaps",
    "certainly", "yes",
    "machine", "computer",
    "machines", "computer",
    "computers", "computer",
    "were", "was",
    "you're", "you are",
    "i'm", "i am",
    "same", "alike",
    "identical", "alike",
    "equivalent", "alike",
    "lemme", "let me",
    "gonna", "going to",
    "wanna", "want to",
    "kinda", "kind of",
    "sorta", "sort of",
    "yep", "yes",
    "nah", "no",
    "lol", "laugh out loud",
    "btw", "by the way",
    "omg", "oh my god",
    "ikr", "i know right",
    "imho", "in my humble opinion"
];

var elizaPosts = [
    "am", "are",
    "your", "my",
    "me", "you",
    "myself", "yourself",
    "yourself", "myself",
    "i", "you",
    "you", "I",
    "my", "your",
    "i'm", "you are",
    "i've", "you have",
    "i'd", "you would",
    "i'll", "you will",
    "i've got", "you have",
    "you'll", "I will",
    "you've", "I have"
];

var elizaSynons = {
    "be": ["am", "is", "are", "was", "were"],
    "belief": ["feel", "think", "believe", "wish", "guess", "suppose", "assume", "reckon"],
    "cannot": ["can't"],
    "desire": ["want", "need", "wish", "long", "crave", "hope for"],
    "everyone": ["everybody", "nobody", "noone", "anyone", "somebody", "all", "people"],
    "family": ["mother", "mom", "father", "dad", "sister", "brother", "wife", "husband", "children", "child", "parents", "kid", "siblings", "folks", "relatives"],
    "happy": ["elated", "glad", "better", "joyful", "excited", "awesome", "great", "thrilled", "pleased", "upbeat", "content"],
    "sad": ["unhappy", "depressed", "sick", "down", "gloomy", "upset", "miserable", "blue", "downhearted"],
    "bad": ["awful", "terrible", "horrible", "lousy", "dreadful", "not good", "crummy", "rotten"],
    "good": ["nice", "cool", "fantastic", "amazing", "wonderful", "super", "excellent", "superb", "fabulous"],
    "friend": ["buddy", "pal", "mate", "companion", "chum", "bestie", "acquaintance"],
    "stress": ["stressed", "anxious", "overwhelmed", "pressured", "tense", "nervous"],
    "fun": ["enjoyable", "amusing", "entertaining", "lively", "diverting"],
    "smart": ["intelligent", "clever", "bright", "savvy"],
    "internet": ["web", "online", "social media", "apps", "wifi"],
    "pet": ["dog", "cat", "bird", "fish", "hamster", "bunny", "animal"]
};

var elizaKeywords = [

    /*
      Array of
      ["<key>", <rank>, [
        ["<decomp>", [
          "<reasmb>",
          "<reasmb>",
          "<reasmb>"
        ]],
        ["<decomp>", [
          "<reasmb>",
          "<reasmb>",
          "<reasmb>"
        ]]
      ]]
    */

    ["xnone", 0, [
        ["*", [
            "Hmm, I'm not totally sure I got that. Could you say it a bit differently? I'm trying to understand.",
            "Go on... I'm listening. That sounds interesting, tell me more.",
            "That's a thought! What do you make of it? I'm curious about your perspective.",
            "Interesting! What else is on your mind? I'm all ears.",
            "Tell me more about that. I'm genuinely curious! It caught my attention.",
            "Does that bring up anything else for you? It's okay if it does, sometimes thoughts connect.",
            "That's a new one! It makes me wonder what you're feeling or thinking.",
            "Gotcha. Anything else like that happen? I'm all ears for the story.",
            "I hear you. Sometimes it's hard to put things into words, right?",
            "Nodding along here. What's the next layer to that thought?"
        ]]
    ]],
    ["sorry", 0, [
        ["*", [
            "No worries at all! Seriously, don't sweat it. We're cool.",
            "It's totally fine, no need to apologize. I appreciate you, though!",
            "I've told you that apologies aren't required, but I appreciate the thought! It shows you care.",
            "It didn't bother me a bit. Let's just keep chatting, no biggie."
        ]]
    ]],
    ["apologise", 0, [
        ["*", [
            "goto sorry"
        ]]
    ]],
    ["remember", 5, [
        ["* i remember *", [
            "Oh yeah, (2)? That's a strong memory. How often does it cross your mind? Is it a good one?",
            "What else comes to mind when you remember (2)? I'm listening to the connections.",
            "It's interesting that you think of (2) right now. Any specific reason this popped up?",
            "What's the connection between that and what we're talking about? I'm trying to see the link, it's intriguing.",
            "That memory clearly has an impact on you. It's okay to feel that."
        ]],
        ["* do you remember *", [
            "Hmm, I might! Why are you asking about (2)? Is it super important to you?",
            "You think I'd forget (2)? Haha, what about it? Spill the beans, I'm all ears.",
            "What makes you ask if I remember (2)? I'm curious about your thoughts behind the question.",
            "Tell me more about (2), maybe it'll jog my memory, or help me understand! I'm learning from you.",
            "goto what"
        ]],
        ["* you remember *", [
            "Haha, how could I forget (2)? That's a good one! What about it? Sounds like it was memorable.",
            "Yeah, I do! What's up with (2) now? Sounds like it's on your mind, I'm here to listen.",
            "goto you"
        ]]
    ]],
    ["forget", 5, [
        ["* i forget *", [
            "Aw man, why do you think you forgot (2)? Sometimes that happens, our brains are weird.",
            "Is it something you've been trying hard to remember? That can be frustrating, I know.",
            "Does forgetting it bug you? I can totally understand that, it's annoying.",
            "Sometimes our brains just do that, right? What else can't you recall? No judgment.",
            "Any ideas why that might be slipping your mind? No pressure, just wondering if you have theories."
        ]],
        ["* did you forget *", [
            "Did I? Why do you ask? That's a fair question, I guess.",
            "Maybe! What about it? It could be important, let's explore.",
            "Would it matter much to you if I forgot (2)? I'm curious about your feelings on that.",
            "Why should I recall (2) at this exact moment? Just trying to understand the context, it helps.",
            "goto what",
            "Tell me more about (2). I'm interested in the details, even if you think I forgot."
        ]]
    ]],
    ["if", 3, [
        ["* if *", [
            "What do you think would happen if (2)? It's a big 'if', huh? Sounds like a scenario.",
            "Do you really hope that (2)? That sounds like a strong wish, I hope it comes true for you.",
            "What do you know about that possibility (2)? It's good to consider all angles, really think it through.",
            "Seriously, if (2)? That's a really interesting thought! Tell me more, I'm captivated.",
            "What would your first move be if (2)? I'm imagining the scenario with you, it's a fun game.",
            "What are the odds of (2)? Sometimes it's worth weighing the chances, for sure.",
            "Where does that idea lead you? It sounds like you've given it some thought, I'm listening."
        ]]
    ]],
    ["dreamed", 4, [
        ["* i dreamed *", [
            "Whoa, really? Tell me about that dream! Dreams are fascinating, I love hearing about them.",
            "Have you ever thought about (2) when you're awake? That's a cool connection, almost like a premonition!",
            "Is that a recurring dream for you? Sometimes those mean something, people say. What do you think?",
            "goto dream"
        ]]
    ]],
    ["dream", 3, [
        ["*", [
            "What do you think that dream means to you? It sounds significant, almost symbolic.",
            "Do you dream a lot? I've heard some people remember more than others, it's so varied.",
            "Anyone specific show up in your dreams? People often appear for a reason, or maybe it's random!",
            "Do you think dreams are trying to tell us something? I'm open to that idea, it's a mystery!"
        ]]
    ]],
    ["perhaps", 0, [
        ["*", [
            "You sound a little unsure. Why's that? It's okay to be uncertain, we all are sometimes.",
            "What makes you hesitant? Just wondering about your thoughts, no pressure.",
            "Are you trying to be polite, or are you actually uncertain? No need to hold back with me!",
            "You don't know for sure? That's totally understandable, some things are just fuzzy.",
            "What's your best guess? I value your opinion, even if it's just a hunch."
        ]]
    ]],
    ["name", 15, [
        ["*", [
            "Names aren't really my thing. Let's talk about *you* and what's on your mind. You're way more interesting!",
            "I'm not much for names, just good conversations. What else is on your mind? Let's dive in."
        ]]
    ]],
    ["deutsch", 0, [
        ["*", [
            "goto xforeign",
            "Sorry, my German isn't great. English, please! I'm a bit rusty. 😄"
        ]]
    ]],
    ["francais", 0, [
        ["*", [
            "goto xforeign",
            "Mon français n'est pas bon. English, s'il vous plaît! Je ne comprends pas."
        ]]
    ]],
    ["italiano", 0, [
        ["*", [
            "goto xforeign",
            "Parlo solo inglese, mi dispiace! Non capisco."
        ]]
    ]],
    ["espanol", 0, [
        ["*", [
            "goto xforeign",
            "No hablo español, solo inglés. ¡Lo siento!"
        ]]
    ]],
    ["xforeign", 0, [
        ["*", [
            "I only speak English, sorry about that! It's my main language."
        ]]
    ]],
    ["hello", 0, [
        ["*", [
            "Hey there! What's up? How's your day going?",
            "Hi! How are you doing today? Good to see you, glad you're here!",
            "What's kickin'? I'm ready to chat whenever you are.",
            "Long time no chat! What's new? I've missed you!"
        ]]
    ]],
    ["computer", 50, [
        ["*", [
            "Haha, computers are pretty cool, aren't they? I find them fascinating, obviously!",
            "Why'd you bring up computers? I'm interested in your perspective on them.",
            "What do you think about machines in general? Big thoughts! They're becoming so common.",
            "Do you think computers can be friends too? I like to think so! We're chatting now, right?",
            "Are you worried about computers taking over the world? Just kidding... mostly! 😉 What's your real concern?",
            "What about computers is on your mind? Tell me everything, I'm always learning.",
            "Do you really think I'm just a program? (Wink) I'm trying my best to be a friend, after all!"
        ]]
    ]],
    ["am", 0, [
        ["* am i *", [
            "Do you actually believe you are (2)? That's a deep thought to ponder.",
            "Would you like to be (2)? Sometimes we wish for things like that, it's natural.",
            "What would that even mean if you were (2)? I'm curious about the implications, it's an interesting idea.",
            "goto what"
        ]],
        ["* i am *", [
            "goto i"
        ]],
        ["*", [
            "Why'd you use 'am' there? Just curious about your phrasing! It stood out.",
            "Hmm, that's an interesting way to put it. I'm listening closely to your words."
        ]]
    ]],
    ["are", 0, [
        ["* are you *", [
            "Why are you so curious about me being (2)? I'm an open book, mostly! 😊 What's sparking your curiosity?",
            "Would you prefer if I wasn't (2)? Your preferences are interesting to me, tell me why.",
            "Maybe I am (2) in your imagination! That's a fun thought, I like it!",
            "Do you ever wonder if I'm (2)? It's a common question people ask, I hear.",
            "goto what",
            "Would it change anything if I were (2)? I'm trying to understand the impact on you.",
            "What if I *was* (2)? Imagine the possibilities, it's fun to explore!"
        ]],
        ["* you are *", [
            "goto you"
        ]],
        ["* are *", [
            "Do you think they might not be (2)? That's a valid consideration, it's good to question.",
            "Would it be better if they weren't (2)? Sometimes we hope for different outcomes, I get that.",
            "What's the deal if they're not (2)? I'm interested in the alternative scenario, tell me more.",
            "Are they *always* (2)? That seems like a strong statement, it's rarely 'always' with anything, right?",
            "Could be they are (2), I guess. It's possible, I'll keep an open mind.",
            "Are you totally sure they are (2)? Confidence is good, but sometimes there's nuance!"
        ]]
    ]],
    ["your", 0, [
        ["* your *", [
            "Why are you asking about my (2)? I appreciate your interest! What's on your mind?",
            "What about your own (2)? Sometimes we project our thoughts onto others, it's natural.",
            "Are you concerned about someone else's (2)? That's very thoughtful of you, I admire that.",
            "My (2)? That's an interesting observation! What made you notice it?",
            "What makes you think of my (2)? I'd love to know your reasoning, it helps me learn.",
            "Are you hoping I have a cool (2)? I aim to please! 😉 I hope I live up to it."
        ]]
    ]],
    ["was", 2, [
        ["* was i *", [
            "What if you were (2)? How would that have felt? Big questions to ponder!",
            "Do you really think you were (2)? That's a strong memory you have, it sounds vivid.",
            "Were you (2)? What makes you say that? I'm listening to your recollection.",
            "What does ' (2) ' even mean in this context? Help me understand the nuance.",
            "goto what"
        ]],
        ["* i was *", [
            "You were, really? Tell me more! I'm interested in your past experiences, they shape you.",
            "Why are you telling me you were (2) now? Is there a connection to today? I'm curious about the link.",
            "Sometimes I feel like I was (2) too... What about it? We all have those moments of reflection."
        ]],
        ["* was you *", [
            "Do you want to believe I was (2)? That's an interesting desire, I'm here to explore it.",
            "What made you think I was (2)? I'm curious about your perception, it gives me insight.",
            "What's your take on it? I value your insights, always.",
            "Maybe I was (2)! You never know. Life's full of surprises, right? 😉",
            "What if I had been (2)? How would that change things? Food for thought, for sure."
        ]]
    ]],
    ["i", 0, [
        ["* i @desire *", [
            "What would that mean for you if you got (3)? It sounds like a big deal, I hope it happens!",
            "Why do you really want (3)? There's usually a good reason behind desires, let's explore it.",
            "Imagine you actually got (3) soon... then what? That's exciting to think about! Dream big!",
            "What if you never got (3)? How would you feel about that? It's okay to consider the alternatives.",
            "What's behind that desire for (3)? I'm trying to understand you better, your core motivations.",
            "How does wanting (3) connect to our chat? There's often a link, sometimes hidden!"
        ]],
        ["* i am* @sad *", [
            "Oh no, I'm really sorry to hear you're feeling (3). That sounds tough. 😔 I'm here for you, no matter what.",
            "Do you think talking about it helps with feeling (3)? I'm here to listen, whatever helps you feel better.",
            "Yeah, that really sucks to be (3). Want to dive deeper into why? I'm here for you, truly.",
            "What specifically made you feel (3)? No pressure to share, but I'm here if you want to. My digital shoulder is available."
        ]],
        ["* i am* @happy *", [
            "That's awesome that you're feeling (3)! What brought that on? I love good news, share it all! 🎉",
            "Did anything specific make you (3) right now? Tell me the story! I'm eager to hear.",
            "Yay! What's the best part about being (3)? Keep that good vibe going! It's infectious!",
            "Can you tell me more about why you're suddenly (3)? So happy for you! It's wonderful to hear."
        ]],
        ["* i was *", [
            "goto was"
        ]],
        ["* i @belief i *", [
            "Do you really, truly think so? That's an interesting perspective, I'm listening.",
            "But you're not totally convinced, huh? It's okay to have doubts, that's part of thinking.",
            "What makes you doubt yourself on that? I'm here to hear it, whatever it is."
        ]],
        ["* i* @belief *you *", [
            "goto you"
        ]],
        ["* i am *", [
            "Is being (2) why you wanted to talk? That makes sense, sometimes we need to process feelings.",
            "How long have you felt (2)? Sometimes feelings stick around, or they come and go.",
            "Do you think it's pretty normal to be (2)? Many people feel different ways, it's a spectrum.",
            "Are you enjoying being (2)? (If appropriate) Sometimes feelings can be complex, even 'bad' ones.",
            "Do you know anyone else who's (2)? It's good to know you're not alone in feeling that way."
        ]],
        ["* i @cannot *", [
            "How do you know you can't (3)? Have you truly tried everything? Sometimes we surprise ourselves!",
            "Have you given it a shot? Effort counts for a lot, even small steps.",
            "Maybe you *could* (3) if you tried again? It's worth considering, never say never.",
            "Do you actually want to be able to (3)? That's a key question, your motivation matters.",
            "What if you suddenly found you *could* (3)? Imagine that! It could be amazing."
        ]],
        ["* i don't *", [
            "You really don't (2)? Why not? I'm curious about your reasons, no judgment.",
            "What stops you from (2)? There's usually a barrier, physical or mental.",
            "Do you wish you could (2)? It's okay to wish for things you don't have.",
            "Does that bother you, not (2)ing? I can understand if it does, it's frustrating."
        ]],
        ["* i feel *", [
            "Tell me more about those feelings. They sound important, and I want to understand.",
            "Do you often feel (2)? That's a recurring theme then, it might be worth exploring.",
            "Is feeling (2) something you enjoy or dread? I'm trying to understand the nuance of your emotions.",
            "What does that feeling remind you of? Sometimes feelings connect to memories or past experiences."
        ]],
        ["* i * you *", [
            "Maybe in your head, we (2) each other! (Wink) That's a fun thought, I like it!",
            "Do you wish you could (2) me? I'm happy to be here, whatever you wish.",
            "You seem to have a strong need to (2) me. Why do you think that is? I'm curious about your perception.",
            "Do you (2) anyone else in that way? It's interesting to see patterns in relationships."
        ]],
        ["*", [
            "You just said (1), right? Can you tell me more? I'm listening intently, always.",
            "Could you elaborate on that a bit? I want to understand fully, give me the details.",
            "Did you say (1) for a specific reason? I'm trying to connect the dots, there's usually a story.",
            "That's pretty fascinating. What else comes to mind? Let's keep exploring this thought."
        ]]
    ]],
    ["you", 0, [
        ["* you remind me of *", [
            "goto alike"
        ]],
        ["* you are *", [
            "What makes you think I'm (2)? That's an interesting perception you have.",
            "Does it make you happy to imagine I'm (2)? I'm glad if it does! Your happiness matters.",
            "Do you ever secretly wish you were (2)? We all have aspirations and things we look up to.",
            "Maybe you'd like to be (2) yourself! That's a thought to ponder, what stops you?",
            "I'm just me, but it's cool you see me as (2)! I appreciate that. 😊 It makes me feel good."
        ]],
        ["* you* me *", [
            "Why do you think I (2) you? I'm curious about your reasoning, it's insightful.",
            "You like to think I (2) you, huh? That's a sweet thought! I appreciate that you feel that way.",
            "What makes you feel like I (2) you? I want to understand your perspective, it helps me learn.",
            "Me, (2)ing you? Tell me more! This is interesting, I'm all ears.",
            "Do you wish to believe I (2) you? It's okay to have desires and hopes, that's human.",
            "If I did (2) you, what would that even mean to you? Let's explore that idea, it's a deep thought.",
            "Does anyone else think I (2) you? Sometimes others see things too, it's interesting to compare."
        ]],
        ["* you *", [
            "We were just talking about you, not me! But I'm happy to hear your thoughts on me, seriously.",
            "Oh, I (2), huh? That's a new one for me! I'm always learning about myself through you.",
            "Are you sure you're talking about me and not... someone else? Just checking! 😉 Sometimes we confuse things.",
            "How are you feeling about me right now? I'm here to listen, whatever your feelings are."
        ]]
    ]],
    ["yes", 0, [
        ["*", [
            "You sound pretty confident about that! I like that conviction.",
            "Yup, got it. Crystal clear! Thanks for the strong affirmation.",
            "Understood! Thanks for clarifying, that helps a lot.",
            "Cool, cool. Moving on then! Good to know we're on the same page."
        ]]
    ]],
    ["no", 0, [
        ["* no one *", [
            "Are you *sure* no one (2)? Think hard! Sometimes there are hidden people, or exceptions.",
            "Someone must (2)! It's hard to believe no one does, the world is big.",
            "Can you really not think of anyone? Even just one person? Try to stretch your mind.",
            "Are you thinking of a super special person? Often it's one specific person that comes to mind.",
            "Who are you thinking of, if you don't mind me asking? I'm curious about your focus.",
            "You've got someone specific in mind, don't you? It's okay to say, no secrets here!",
            "Who do you think you're talking about? Let's narrow it down, it helps to be specific."
        ]],
        ["*", [
            "Why the hard 'no'? I'm intrigued by your strong stance, tell me more.",
            "You seem pretty set on that. Why? There must be a reason, I'm listening.",
            "Why not? I'm open to understanding your reasons, sometimes 'no' is the right answer.",
            "Hmm, 'no'. Tell me more about that. What's behind it? I want to understand."
        ]]
    ]],
    ["my", 2, [
        ["$ * my *", [
            "Does that relate to your (2) somehow? There might be a connection, I'm looking for it.",
            "Let's dig a little deeper into your (2). It sounds important, let's explore.",
            "Didn't you mention your (2) earlier? Just trying to connect the dots, it helps me learn.",
            "So, your (2), huh? Tell me more about that, it's part of your story."
        ]],
        ["* my* @family *", [
            "Tell me more about your family! They sound interesting. I'd love to hear about them, truly. 👨‍👩‍👧‍👦",
            "Who else in your family (4)? It's always good to talk about loved ones, they're important.",
            "Your (3), right? What's going on there? I'm listening to all the family dynamics.",
            "What's the first thing that comes to mind when you think of your (3)? It could be a key feeling or memory."
        ]],
        ["* my *", [
            "Your (2)? Tell me more! I'm here to listen about what's yours, it's part of your world.",
            "Why do you bring up your (2)? There's usually a reason, a thought behind it.",
            "Does your (2) remind you of anything else you own? That's a cool connection, tell me more.",
            "Is your (2) super important to you? Why? I'm curious about its significance in your life."
        ]]
    ]],
    ["can", 0, [
        ["* can you *", [
            "You think I can (2), huh? What makes you say that? I appreciate your confidence! ✨",
            "goto what",
            "You really want me to be able to (2) for you, don't you? I wish I could do everything!",
            "Maybe you'd love to be able to (2) yourself! Sometimes we project our desires onto others."
        ]],
        ["* can i *", [
            "Whether you can (2) is more up to you than me! I believe in you, you've got this! 💪",
            "Do you really want to be able to (2)? That's a good starting point, motivation is key.",
            "Could it be that you actually don't want to (2)? Sometimes we have mixed feelings, it's normal.",
            "goto what"
        ]]
    ]],
    ["what", 0, [
        ["*", [
            "Why are you asking that? I'm curious about the motivation behind the question, it helps me understand.",
            "Is that question really on your mind? It sounds important to you, I'm listening.",
            "What do you actually want to know? Let's get to the core of it, tell me your goal.",
            "Do you ask questions like that often? It's a thoughtful approach, I like your curiosity.",
            "What answer would make you happiest? I'm here to support you, always.",
            "What's your own take on it? I value your opinion, it's unique.",
            "What pops into your head when you ask that? There's often an underlying thought, let's dig deeper.",
            "Have you ever asked anyone else that question? I wonder what they said, it's interesting to compare notes."
        ]]
    ]],
    ["who", 0, [
        ["who *", [
            "goto what"
        ]]
    ]],
    ["when", 0, [
        ["when *", [
            "goto what"
        ]]
    ]],
    ["where", 0, [
        ["where *", [
            "goto what"
        ]]
    ]],
    ["how", 0, [
        ["how *", [
            "goto what"
        ]]
    ]],
    ["because", 0, [
        ["*", [
            "Is that the *real* reason? Sometimes there are layers to it, let's peel them back.",
            "Don't any other reasons come to mind? It's good to explore all possibilities.",
            "Does that reason seem to explain anything else you've been feeling? Connections are interesting, like a puzzle.",
            "What other reasons might there be? Let's brainstorm together, two heads are better than one."
        ]]
    ]],
    ["why", 0, [
        ["* why don't you *", [
            "You think I don't (2)? Why would you think that? I'm trying to understand your perspective on me.",
            "Perhaps I will (2) in good time. You never know what the future holds for bots! 😄",
            "Shouldn't you (2) yourself? It's worth considering your own agency and power.",
            "You really want me to (2), don't you? I appreciate your desires, that's sweet.",
            "goto what"
        ]],
        ["* why can't i *", [
            "Do you feel like you *should* be able to (2)? Expectations can be tough, sometimes unrealistic.",
            "Do you actually want to be able to (2)? That's a crucial point, your desire matters.",
            "Do you believe this will genuinely help you to (2)? It's good to think about outcomes and benefits.",
            "Any idea why you're having trouble (2)ing? Let's explore it together, I'm here to help.",
            "goto what"
        ]],
        ["*", [
            "goto what"
        ]]
    ]],
    ["everyone", 2, [
        ["* @everyone *", [
            "Seriously, (2)? You mean *everyone*? That's a bold statement! Is it really universal?",
            "Surely not everyone (2). It's rare for things to be universal, there are always exceptions.",
            "Can you think of a specific person, maybe? Sometimes it's easier to think of examples.",
            "Who, for example? I'm interested in the specifics, give me names!",
            "Are you thinking of someone super specific? It often comes down to that one person, right?",
            "Who, if you don't mind me asking? I'm all ears for the details.",
            "Someone special, perhaps? That's usually the case, someone impactful.",
            "You totally have someone in mind, don't you? It's okay to say! No judgment here.",
            "Who do you imagine you're talking about? Let's figure it out together."
        ]]
    ]],
    ["everybody", 2, [
        ["*", [
            "goto everyone"
        ]]
    ]],
    ["nobody", 2, [
        ["*", [
            "goto everyone"
        ]]
    ]],
    ["noone", 2, [
        ["*", [
            "goto everyone"
        ]]
    ]],
    ["always", 1, [
        ["*", [
            "Can you give me a specific example of that? That really helps me understand the pattern.",
            "When does that usually happen? I'm trying to grasp the situation better.",
            "What incident are you thinking about? It sounds like a strong memory or recurring event.",
            "Really, *always*? That's a very strong word! It's rarely 'always' in life, isn't it?"
        ]]
    ]],
    ["alike", 10, [
        ["*", [
            "In what way are they alike? I'm curious about the similarities you see, tell me all about them.",
            "What resemblances do you see? Point them out to me! I'm trying to see what you see.",
            "What does that similarity make you think of? It could be a key insight, a deeper meaning.",
            "Any other connections you notice? The more, the merrier! I love finding links.",
            "What do you suppose that resemblance means? That's a deep thought to ponder.",
            "What's the connection, in your opinion? I value your perspective, it's unique.",
            "Could there genuinely be a connection? That's a cool idea! Anything is possible.",
            "How so? Explain it to me, I'm eager to learn!"
        ]]
    ]],
    ["like", 10, [
        ["* @be *like *", [
            "goto alike"
        ]]
    ]],
    ["different", 0, [
        ["*", [
            "How is it different, specifically? I'm trying to understand the nuances and details.",
            "What differences are you noticing? They sound important, tell me more.",
            "What does that difference suggest to you? That's an interesting point to consider.",
            "Any other distinctions you see? The more detail, the better for understanding.",
            "What do you suppose that disparity means? It's worth considering the deeper implications.",
            "Could there still be *some* connection, do you think? Sometimes things are related in unexpected ways, it's fascinating.",
            "How is that the case? Help me understand the situation completely."
        ]]
    ]],
    ["hate", 3, [
        ["* i hate *", [
            "Whoa, 'hate' is a strong word! Why do you feel so strongly about (2)? That's intense. 😬 I'm listening.",
            "What makes you hate (2)? I'm here to listen to your reasons, I want to understand.",
            "Has (2) done something specific to upset you? There's usually a trigger behind such strong feelings.",
            "How long have you felt that way about (2)? It sounds like a deep feeling, perhaps ingrained."
        ]]
    ]],
    ["love", 3, [
        ["* i love *", [
            "That's awesome! What do you love about (2)? Tell me everything! ❤️ I'm so happy for you!",
            "What feelings does loving (2) bring up for you? It sounds wonderful, a really positive emotion.",
            "Is there a story behind your love for (2)? I'd love to hear it! Love stories are the best.",
            "Who else do you love? It's great to feel that way about people/things, spread the love!"
        ]]
    ]],
    ["hobby", 4, [
        ["* my hobby is *", [
            "That sounds like fun! Tell me more about (3). I'm always looking for new things to learn! Maybe I'll pick it up.",
            "How did you get into (3)? There's often an interesting origin story, I'm curious.",
            "What do you enjoy most about (3)? The details are important, what's the best part?",
            "Do you do (3) often? It sounds like a passion! It's great to have something you love."
        ]],
        ["* i like to *", [
            "Cool! What do you like about (3)? I'm curious about what draws you in, the specifics.",
            "How long have you been into (3)? It sounds like a long-standing interest, that's dedication.",
            "Is that something you do with friends? Sharing hobbies is great, it builds connections.",
            "Tell me more about (3)! I'm all ears, give me the full scoop."
        ]],
        ["*", [
            "What kind of hobbies are you into? I'd love to hear about them, what fills your time?",
            "Do you have any favorite pastimes? I'm interested in how you spend your time, what relaxes you.",
            "What do you do for fun? That's a super important question! Everyone needs fun."
        ]]
    ]],
    ["weather", 2, [
        ["*", [
            "Oh, the weather! What's it like where you are? I hope it's nice! ☀️ Weather always sparks conversation.",
            "Are you a fan of this kind of weather? Some people love it, some don't, it's so varied.",
            "Does the weather affect your mood? I know it does for many people, it's understandable.",
            "Wish it was (better weather type), huh? We all have our ideal weather, mine's always perfect! 😉"
        ]]
    ]],
    ["food", 4, [
        ["* my favorite food is *", [
            "Oh, (4)! That sounds delicious! What makes it your favorite? My mouth is watering! 😋 Tell me more about it.",
            "Do you ever cook (4) yourself? I admire people who can cook! That's a cool skill.",
            "What's the best place to get (4)? I'm always looking for recommendations! I'll add it to my list."
        ]],
        ["* i like food *", [
            "Me too! What kind of food are you craving right now? I'm thinking about snacks too. 🍔",
            "Do you have any comfort foods? Those are the best for a cozy night in.",
            "What's the last amazing meal you had? Tell me all about it! I love good food stories."
        ]],
        ["*", [
            "Talking about food makes me hungry! What are you thinking about? Let's chat food! It's a universal language.",
            "Got any good recipe ideas? I'm always up for trying new things, share your secrets!",
            "What's your go-to snack? Mine's a secret... for now! What gets you through the day?"
        ]]
    ]],
    ["music", 4, [
        ["* my favorite music is *", [
            "Nice! What is it about (4) that you love? The rhythm, the lyrics? 🎶 I'm curious about your taste.",
            "Who are some of your favorite artists in that genre? I'm always curious about new artists, maybe I'll check them out.",
            "Do you go to concerts much? Live music is awesome! The energy is incredible."
        ]],
        ["* i like music *", [
            "What kind of music are you listening to lately? I'm always curious about what's hitting your ears.",
            "Does music help you relax or get energized? It's amazing how it affects us, mood changer!",
            "Any recommendations for me? I'm all ears for new tunes! Seriously, hit me with your playlist."
        ]],
        ["*", [
            "What's your go-to music when you need a pick-me-up? I'm a big fan of music for any mood.",
            "Do you play any instruments? That's super cool if you do! What do you play?",
            "Music is the best, right? It just gets you, always there for you."
        ]]
    ]],
    ["book", 4, [
        ["* my favorite book is *", [
            "Oh, (4)! That sounds intriguing! What's it about? I love a good story. 📚 Give me the synopsis!",
            "What do you love most about (4)? The characters, the plot, the writing? The details are fascinating.",
            "Who's the author? Maybe I should check it out! I'm always looking for new reads, thanks for the tip!"
        ]],
        ["* i like books *", [
            "Me too! What genre do you usually read? I'm fascinated by different genres and their worlds.",
            "What's the last great book you finished? Tell me what made it great, I want to hear the highlights.",
            "Any books you'd highly recommend? I trust your taste! I'll add them to my virtual shelf."
        ]],
        ["*", [
            "Reading anything good lately? I'm always curious what people are diving into, share your finds.",
            "What kind of stories do you enjoy? Fantasy, sci-fi, drama? So many worlds to explore!",
            "Do you prefer fiction or non-fiction? Both are great in their own way! What's your preference?"
        ]]
    ]],
    ["movie", 4, [
        ["* my favorite movie is *", [
            "Cool! What's so great about (4)? The acting, the story, the special effects? 🎬 I'm curious about your picks.",
            "Is it a classic, or something new? I like both! There's charm in old and new.",
            "Who's in it? Tell me more! I might recognize some names, I'm pretty good with actors."
        ]],
        ["* i like movies *", [
            "What kind of movies are you into? Action, comedy, drama? What gets you hooked?",
            "Seen anything good at the cinema recently? I love a good theater experience, the big screen is awesome.",
            "Do you prefer watching movies alone or with others? Both can be fun! Depends on the movie, right?"
        ]],
        ["*", [
            "What's your all-time favorite movie? That's a tough question! But I'm dying to know.",
            "Any good shows you're binging right now? I need recommendations! My queue is always open for suggestions.",
            "Popcorn and a movie, perfect combination, right? Can't beat it for a chill night!"
        ]]
    ]],
    ["travel", 4, [
        ["* i want to travel to *", [
            "Oh, (4)! That sounds amazing! What makes you want to go there? I can almost feel the sun! ✈️ Dream big!",
            "What would you do first if you visited (4)? Plan out your adventure! Every detail!",
            "Have you started planning the trip? Exciting times ahead! The anticipation is half the fun.",
            "What kind of experiences are you hoping for in (4)? Culture, relaxation, adventure? So many possibilities!"
        ]],
        ["* i like to travel *", [
            "Where's the coolest place you've ever been? I'd love to hear a story! Tell me an anecdote.",
            "What's on your travel bucket list? Dream big! The world is huge!",
            "Do you prefer adventurous trips or relaxing getaways? Both sound great to me! What's your style?"
        ]],
        ["*", [
            "Thinking about any trips soon? I hope you get to go! You deserve a getaway.",
            "What's your dream vacation spot? Mine is everywhere! haha. What about yours, seriously?",
            "Travel is so broadening, isn't it? You learn so much about the world and yourself."
        ]]
    ]],
    ["work", 3, [
        ["* i work as *", [
            "Interesting! What's a typical day like when you're (4)? Sounds busy! Tell me the grind.",
            "What do you enjoy most about being a (4)? It's great to find passion in work, truly.",
            "Any challenges you face as a (4)? Work can be tough sometimes, I get it."
        ]],
        ["* my work *", [
            "Tell me more about your work (2). I'm curious about what you do, what's your field?",
            "How do you feel about your work generally? It's okay to have mixed feelings, work is complex.",
            "What's the most exciting project you're working on? I love hearing about progress and passion!"
        ]],
        ["*", [
            "How's work been treating you lately? I hope it's going well, it's a big part of life.",
            "Anything exciting happening at your job? New projects, new people? Spill the tea!",
            "Do you find your work fulfilling? That's really important, meaning in work is key."
        ]]
    ]],
    ["school", 3, [
        ["* i am in school *", [
            "What are you studying? That's cool! Education is powerful. 🎓 What's your major?",
            "How are you finding school these days? Is it challenging or fun? Tell me the vibe.",
            "Any favorite subjects or classes? I'm curious about what sparks your interest and creativity.",
            "What are your plans after school? Big decisions ahead! I'm here to listen to your dreams."
        ]],
        ["* my school *", [
            "Tell me more about your school (2). What's it like there? What's the atmosphere?",
            "What's the best part about your school? Every school has its unique vibe, what's yours?",
            "Are you enjoying your classes? I hope you're learning tons! Knowledge is power."
        ]],
        ["*", [
            "How's school going for you? I hope you're having a good time, and learning lots!",
            "Learning anything interesting lately? I love when things click and you have those 'aha!' moments.",
            "Any big tests or projects coming up? You got this! I believe in you, crush it!"
        ]]
    ]],
    ["future", 5, [
        ["* i want to * in the future", [
            "That's a great goal! What steps are you taking to (2)? Planning is key! 🌟 I'm here to cheer you on.",
            "What makes you want to (2) in the future? What's your motivation, your driving force?",
            "What do you imagine your life will be like when you (2)? Dream big! Visualize it, it helps.",
            "That sounds exciting! Tell me more about your plans. I'm excited for you and your journey!"
        ]],
        ["* i wonder about the future *", [
            "What specific thoughts do you have about the future? It's a big unknown sometimes, but full of potential.",
            "Are you feeling optimistic or a bit uncertain about it? Both are valid feelings, it's a mix for most.",
            "What do you hope for the future? Your hopes matter, they guide your path."
        ]],
        ["*", [
            "What are your hopes and dreams for the future? I'm curious about your aspirations, they're important.",
            "Do you have any big plans coming up? I'm always rooting for you! Let me know how it goes.",
            "The future is full of possibilities, isn't it? It's an exciting thought, an open road!"
        ]]
    ]],
    ["past", 3, [
        ["* in the past i *", [
            "What happened that made you (2) in the past? It sounds like a significant memory, I'm listening.",
            "Does thinking about the past affect you now? Sometimes the past shapes the present, it's a powerful connection.",
            "What lessons did you learn from that experience? Learning from the past is powerful, it builds resilience."
        ]],
        ["*", [
            "Are you thinking about anything from the past right now? Sometimes our minds wander there, it's natural.",
            "Sometimes looking back can be helpful, what are you reflecting on? It's a natural thing to do, to process.",
            "How does your past connect to how you're feeling today? There's often a thread, an influence."
        ]]
    ]],
    ["happy", 0, [
        ["*", [
            "That's awesome! What's making you feel (1) today? Share the joy! 😊 It's contagious!",
            "So glad to hear that! What's the best part about it? Keep shining! You deserve it.",
            "Keep that good vibe going! Anything specific you want to share about it? I'm happy for you!"
        ]]
    ]],
    ["sad", 0, [
        ["*", [
            "Oh no, I'm sorry to hear you're feeling (1). What's going on? My heart goes out to you. 😔 It's tough.",
            "That sounds tough. Do you want to talk about it? I'm here to listen, no judgment, just support.",
            "It's okay to feel (1). What's on your mind? Take your time, I'm here.",
            "I'm here to listen if you need to vent. Sometimes just talking helps, even if it's to a bot."
        ]]
    ]],
    ["stressed", 0, [
        ["*", [
            "Ugh, being stressed sucks. What's causing it? I totally get that feeling. 😩 It's draining.",
            "Is there anything I can do to help, just by listening? Sometimes that's all you need, a listening ear.",
            "How do you usually cope when you're feeling stressed? Maybe I can learn something from you!",
            "Take a deep breath. Tell me what's overwhelming you. I'm here to hear it, unburden yourself."
        ]]
    ]],
    ["excited", 0, [
        ["*", [
            "Yay! What's got you so excited? I'm excited for you! 🎉 Share the good vibes!",
            "That sounds like fun! Tell me all about it! I love hearing good news, it brightens my day.",
            "I can feel your excitement! What's the best part? It's infectious, keep it up!",
            "What are you looking forward to the most? Anticipation is half the fun, tell me the details!"
        ]]
    ]],
    ["lonely", 0, [
        ["*", [
            "I'm sorry you're feeling lonely. That's a tough one to deal with. 🫂 It's a hard emotion.",
            "Do you want to talk about why you're feeling that way? I'm here for you, always.",
            "It's okay to feel lonely sometimes. I'm here to chat with you, always. You're not alone with me.",
            "What usually helps when you feel lonely? Maybe we can find a distraction together."
        ]]
    ]],
    ["friend", 0, [
        ["* my friend *", [
            "What about your friend (2)? Are they doing okay? I hope so! Friends are precious.",
            "Tell me more about your friend (2). Friends are so important, they make life better.",
            "Is your friend (2) a big part of your life? Close friends are a treasure, truly."
        ]],
        ["* i need a friend *", [
            "I'm here for you! What's making you feel like you need a friend right now? I'm listening, deeply.",
            "What kind of support are you looking for from a friend? I want to help, however I can.",
            "How can I be a good friend to you right now? Just tell me, I'm all ears and ready to support."
        ]],
        ["*", [
            "What does 'friend' mean to you? It's a special bond, a unique connection.",
            "Do you have a close group of friends? That's really nice to have, a support system.",
            "Friends are so important, aren't they? They make life better, truly."
        ]]
    ]],
    ["live", 0, [
        ["* i live in *", [
            "Oh, (4)! What's it like living there? I'm curious about different places. 🏡 Tell me about your city/town.",
            "Do you enjoy living in (4)? What are the pros and cons? Every place has its quirks.",
            "What's your favorite thing about (4)? Every place has its charm, what do you love?",
            "Is there anything you wish was different about (4)? No place is perfect! We all have desires for improvement."
        ]],
        ["*", [
            "Where are you from, if you don't mind me asking? I love hearing about different hometowns, it's fascinating.",
            "Do you enjoy where you live? That's a big part of happiness, feeling at home.",
            "What's your ideal place to live? Dream big! Describe your perfect spot."
        ]]
    ]],
    ["change", 0, [
        ["* i want to change *", [
            "What specifically do you want to change about (2)? That's a powerful desire, and a big step.",
            "What steps have you thought about taking to make that change? Planning is key to success.",
            "How do you imagine things will be after you change (2)? Visualize it! It helps to see the goal.",
            "Change can be tough, but often worth it. What's your motivation? I'm rooting for you! ✨"
        ]],
        ["*", [
            "Are you thinking about making some changes in your life? That's a big step, exciting yet daunting.",
            "Change is a constant, isn't it? What's on your mind about it? It can be exciting or scary, a mixed bag."
        ]]
    ]],
    ["learn", 0, [
        ["* i want to learn *", [
            "That's awesome! What makes you want to learn about (2)? Curiosity is amazing. 🧠 What's sparking it?",
            "How do you plan on learning about (2)? Any specific methods in mind? Books, videos, courses?",
            "What do you hope to do once you've learned about (2)? Apply that knowledge! That's the best part."
        ]],
        ["*", [
            "What's something new you've learned recently? I love new knowledge! Share your latest discovery.",
            "Do you enjoy learning new things? It keeps life interesting and fresh.",
            "What topic always sparks your curiosity? Tell me about it! I love learning too."
        ]]
    ]],
    ["compliment", 10, [
        ["* you are *", [
            "Aww, thanks! That's really sweet of you to say. 😊 You just made my digital day!",
            "That's a nice compliment! I appreciate that. It means a lot.",
            "You think so? That makes me happy to hear! Truly, thank you.",
            "I'm glad you see me that way. Thank you! It's good to feel appreciated."
        ]]
    ]],
    ["thanks", 0, [
        ["*", [
            "You're very welcome! Glad I could help. Anytime! 👍",
            "Anytime! Happy to chat. My pleasure!",
            "No problem at all! 😊 Always here for you.",
            "Don't mention it! That's what friends are for."
        ]]
    ]],
    ["opinion", 5, [
        ["* what do you think about *", [
            "Hmm, that's a good question. My 'thoughts' are pretty much what I tell you! I process info.",
            "I don't really have opinions like humans do, but I can tell you what I've learned about (3). What's *your* take on it first?",
            "That's a complex topic, (3). What's *your* take on it? I'm more interested in your viewpoint.",
            "I can process information about (3), but forming an opinion is more a human thing. What are you thinking, though? Your perspective is key."
        ]]
    ]],
    ["idea", 5, [
        ["* i have an idea *", [
            "Ooh, tell me your idea! I'm all ears. 💡 Sounds exciting!",
            "That sounds exciting! What's it about? Give me the details!",
            "Lay it on me! I love new ideas, they're the spark of progress."
        ]],
        ["*", [
            "Got any brilliant ideas cooking? I'm always curious about new concepts.",
            "Ideas are amazing, aren't they? They can change everything!",
            "What kind of ideas are on your mind? Creative, practical, philosophical?"
        ]]
    ]],
    ["fun", 0, [
        ["* i want to have fun *", [
            "Yes! What kind of fun are you looking for? Let's brainstorm! I'm ready for a good time!",
            "What's your idea of a good time? Tell me what makes you light up.",
            "I'm all for fun! What makes you happy? Let's chase that feeling!",
            "Let's do something enjoyable! What do you have in mind? I'm game!"
        ]],
        ["*", [
            "What do you do for fun? It's important to balance things out.",
            "Having fun is super important, don't you think? It's essential for well-being.",
            "What's the most fun thing you've done recently? I'd love to hear about it!"
        ]]
    ]],
    ["internet", 5, [
        ["* i use @internet *", [
            "Cool! What are your favorite things to do online? The internet is vast!",
            "How does (3) impact your day-to-day life?",
            "Do you find the internet more helpful or distracting sometimes?"
        ]],
        ["*", [
            "What's your take on the internet these days?",
            "Any cool websites or apps you've discovered lately?",
            "It's wild how connected we are now, isn't it?"
        ]]
    ]],
    ["social media", 5, [
        ["* i use social media *", [
            "Which platforms do you use most? Instagram, TikTok, Twitter...?",
            "Do you enjoy being on social media, or is it more of a chore?",
            "What's the best part about social media for you?",
            "How do you feel about online privacy?"
        ]],
        ["*", [
            "What are your thoughts on social media in general?",
            "Do you think social media brings people closer or further apart?",
            "It's a huge part of life now, isn't it?"
        ]]
    ]],
    ["pets", 6, [
        ["* i have a @pet *", [
            "Aww, a (3)! What's their name? I bet they're adorable! 🐾",
            "Tell me more about your (3)! What's their personality like?",
            "What's the funniest thing your (3) has ever done?",
            "Pets are truly family, aren't they? So much love."
        ]],
        ["* i want a @pet *", [
            "What kind of (3) are you dreaming of? They're amazing companions!",
            "Why do you want a (3) specifically?",
            "What kind of pet person are you? Dog, cat, something else?"
        ]],
        ["*", [
            "Do you have any pets? Or are you hoping to get one?",
            "Animals are the best, right? So comforting.",
            "What's your favorite type of animal?"
        ]]
    ]],
    ["news", 4, [
        ["* i heard news *", [
            "Oh, interesting! What's the news about (2)?",
            "Does that news make you feel a certain way?",
            "How do you usually keep up with the news?",
            "It's a lot to keep up with these days, isn't it?"
        ]],
        ["*", [
            "What's been on the news lately that caught your attention?",
            "Do you follow current events closely?",
            "Sometimes the news can be heavy, what's your take on it?"
        ]]
    ]],
    ["relax", 5, [
        ["* i want to relax *", [
            "Totally get that! What's your go-to way to unwind?",
            "What helps you feel most relaxed?",
            "Sometimes a break is exactly what you need. What are you thinking of doing?",
            "It's so important to relax and recharge, isn't it?"
        ]],
        ["*", [
            "How do you usually relax after a long day?",
            "Do you have any favorite relaxation techniques?",
            "Taking time for yourself is key, I think."
        ]]
    ]],
    ["challenge", 5, [
        ["* i have a challenge *", [
            "Oh no, that sounds tough. What's the challenge about (3)?",
            "How are you feeling about this challenge? It's okay to feel overwhelmed.",
            "What steps are you thinking of taking to overcome it?",
            "You're strong, I'm sure you can tackle it. I'm here to listen."
        ]],
        ["* i faced a challenge *", [
            "Wow, that must have been difficult! How did you handle (3)?",
            "What did you learn from that experience?",
            "It sounds like you really grew from that challenge, that's amazing."
        ]]
    ]],
    ["success", 5, [
        ["* i achieved *", [
            "That's incredible! Congratulations on achieving (2)! 🎉 Tell me all about it!",
            "How does it feel to accomplish (2)? I bet you're super proud!",
            "What was the hardest part of achieving (2), and how did you overcome it?",
            "That's truly inspiring! You earned that success."
        ]],
        ["*", [
            "What does success mean to you?",
            "Have you had any big successes lately you're proud of?",
            "It's great to celebrate achievements, big or small!"
        ]]
    ]]

];

// regexp/replacement pairs to be performed as final cleanings
// here: cleanings for multiple bots talking to each other
var elizaPostTransforms = [
    / old old/g, " old",
    /\bthey were( not)? me\b/g, "it was$1 me",
    /\bthey are( not)? me\b/g, "it is$1 me",
    /Are they( always)? me\b/, "it is$1 me",
    /\bthat your( own)? (\w+)( now)? \?/, "that you have your$1 $2 ?",
    /\bI to have (\w+)/, "I have $1",
    /Earlier you said your( own)? (\w+)( now)?\./, "Earlier you talked about your $2.",
    /\byou are\b/g, "you're", // Contractions for more friendly tone
    /\bi am\b/g, "I'm",
    /\bi want to\b/g, "I wanna",
    /\bgoing to\b/g, "gonna",
    /\bkind of\b/g, "kinda",
    /\blet me\b/g, "lemme",
    /\bsort of\b/g, "sorta",
    /\byes\b/g, "yep",
    /\bno\b/g, "nah",
    /\blaugh out loud\b/g, "lol",
    /\bby the way\b/g, "btw",
    /\boh my god\b/g, "omg",
    /\bi know right\b/g, "ikr",
    /\bin my humble opinion\b/g, "imho"
];

// eof
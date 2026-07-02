export type ReadingLevelNumber = 1 | 2 | 3 | 4 | 5;

export type ReadingLevel = {
  level: ReadingLevelNumber;
  name: string;
  bandColor: string;
  description: string;
  sentenceStyle: string;
  wordsPerBook: string;
};

export type BookPage = {
  pageNumber: number;
  illustration: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
};

export type ReadingBook = {
  id: string;
  level: ReadingLevelNumber;
  title: string;
  coverEmoji: string;
  synopsis: string;
  phonicsFocus: string;
  targetWords: string[];
  wordCount: number;
  pages: BookPage[];
  quiz: QuizQuestion[];
};

export type ReadingBookSummary = Omit<ReadingBook, "pages" | "quiz">;

export const readingLevels: ReadingLevel[] = [
  {
    level: 1,
    name: "First Words",
    bandColor: "#f2a9c4",
    description: "Single words and tiny labels supported by big pictures.",
    sentenceStyle: "One or two words per page",
    wordsPerBook: "10-20 words"
  },
  {
    level: 2,
    name: "First Sentences",
    bandColor: "#e2574c",
    description: "Short repeated sentence patterns that build early confidence.",
    sentenceStyle: "One simple sentence per page",
    wordsPerBook: "30-50 words"
  },
  {
    level: 3,
    name: "Story Steps",
    bandColor: "#f0b429",
    description: "Simple stories with a clear beginning, middle and end.",
    sentenceStyle: "Two short sentences per page",
    wordsPerBook: "60-90 words"
  },
  {
    level: 4,
    name: "Growing Readers",
    bandColor: "#5aa9e6",
    description: "Longer stories introducing the past tense and question words.",
    sentenceStyle: "Longer sentences with connectives",
    wordsPerBook: "100-150 words"
  },
  {
    level: 5,
    name: "Adventure Readers",
    bandColor: "#57b894",
    description: "Rich adventure stories with varied sentences and dialogue.",
    sentenceStyle: "Varied sentences and simple dialogue",
    wordsPerBook: "150-220 words"
  }
];

export const readingBooks: ReadingBook[] = [
  // ---------- Level 1 · First Words ----------
  {
    id: "l1-my-family",
    level: 1,
    title: "My Family",
    coverEmoji: "👨‍👩‍👧‍👦",
    synopsis: "Meet Finn, Bella and their cat Tofu at home.",
    phonicsFocus: "Initial sounds m, d, c",
    targetWords: ["mum", "dad", "cat", "me"],
    wordCount: 12,
    pages: [
      { pageNumber: 1, illustration: "👩", text: "Mum." },
      { pageNumber: 2, illustration: "👨", text: "Dad." },
      { pageNumber: 3, illustration: "🐱", text: "Tofu the cat." },
      { pageNumber: 4, illustration: "👦", text: "Me!" },
      { pageNumber: 5, illustration: "👨‍👩‍👧‍👦🐱", text: "My family." }
    ],
    quiz: [
      {
        id: "q1",
        question: "Who is Tofu?",
        options: ["The dad", "The cat", "The mum"],
        answerIndex: 1
      },
      {
        id: "q2",
        question: "How do you say 妈妈 in English?",
        options: ["Dad", "Cat", "Mum"],
        answerIndex: 2
      }
    ]
  },
  {
    id: "l1-big-and-small",
    level: 1,
    title: "Big and Small",
    coverEmoji: "🐘",
    synopsis: "Finn spots big and small things at the zoo.",
    phonicsFocus: "Initial sounds b, s",
    targetWords: ["big", "small", "look"],
    wordCount: 14,
    pages: [
      { pageNumber: 1, illustration: "🐘", text: "Look! Big." },
      { pageNumber: 2, illustration: "🐭", text: "Look! Small." },
      { pageNumber: 3, illustration: "🦒", text: "A big giraffe." },
      { pageNumber: 4, illustration: "🐞", text: "A small bug." },
      { pageNumber: 5, illustration: "👦🐘🐭", text: "Big and small!" }
    ],
    quiz: [
      {
        id: "q1",
        question: "Which animal is big?",
        options: ["The bug", "The mouse", "The elephant"],
        answerIndex: 2
      },
      {
        id: "q2",
        question: "What does 'small' mean?",
        options: ["很小", "很大", "很快"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "l1-colours",
    level: 1,
    title: "I See Colours",
    coverEmoji: "🌈",
    synopsis: "Bella finds colours in the garden.",
    phonicsFocus: "Initial sounds r, g, y",
    targetWords: ["red", "green", "yellow", "see"],
    wordCount: 15,
    pages: [
      { pageNumber: 1, illustration: "🍎", text: "I see red." },
      { pageNumber: 2, illustration: "🍃", text: "I see green." },
      { pageNumber: 3, illustration: "🌻", text: "I see yellow." },
      { pageNumber: 4, illustration: "🌈", text: "I see a rainbow!" }
    ],
    quiz: [
      {
        id: "q1",
        question: "What colour is the apple?",
        options: ["Green", "Red", "Yellow"],
        answerIndex: 1
      },
      {
        id: "q2",
        question: "What does Bella see at the end?",
        options: ["A rainbow", "A cat", "A bus"],
        answerIndex: 0
      }
    ]
  },

  // ---------- Level 2 · First Sentences ----------
  {
    id: "l2-tofu-is-lost",
    level: 2,
    title: "Where Is Tofu?",
    coverEmoji: "🐱",
    synopsis: "Tofu the cat is hiding. The family looks everywhere.",
    phonicsFocus: "Short vowel o; sight words 'is', 'in'",
    targetWords: ["where", "is", "in", "box", "bed"],
    wordCount: 38,
    pages: [
      { pageNumber: 1, illustration: "🐱❓", text: "Where is Tofu?" },
      { pageNumber: 2, illustration: "📦", text: "Is Tofu in the box? No." },
      { pageNumber: 3, illustration: "🛏️", text: "Is Tofu on the bed? No." },
      { pageNumber: 4, illustration: "🧺", text: "Is Tofu in the basket? No." },
      { pageNumber: 5, illustration: "👒🐱", text: "Tofu is in the hat!" },
      { pageNumber: 6, illustration: "😄🐱", text: "Silly Tofu!" }
    ],
    quiz: [
      {
        id: "q1",
        question: "Where is Tofu at the end?",
        options: ["In the box", "In the hat", "On the bed"],
        answerIndex: 1
      },
      {
        id: "q2",
        question: "What does 'Where is Tofu?' ask?",
        options: ["Tofu 是谁?", "Tofu 在哪里?", "Tofu 几岁?"],
        answerIndex: 1
      }
    ]
  },
  {
    id: "l2-the-red-kite",
    level: 2,
    title: "The Red Kite",
    coverEmoji: "🪁",
    synopsis: "Finn gets a new kite. Up it goes!",
    phonicsFocus: "Long vowel i-e; sight words 'up', 'go'",
    targetWords: ["kite", "up", "go", "wind", "run"],
    wordCount: 42,
    pages: [
      { pageNumber: 1, illustration: "🪁", text: "Finn has a red kite." },
      { pageNumber: 2, illustration: "🏃", text: "Run, Finn, run!" },
      { pageNumber: 3, illustration: "💨", text: "The wind is big." },
      { pageNumber: 4, illustration: "🪁⬆️", text: "Up, up, up it goes." },
      { pageNumber: 5, illustration: "🌳🪁", text: "Oh no! The kite is in the tree." },
      { pageNumber: 6, illustration: "👨🪜", text: "Dad gets the kite. Hooray!" }
    ],
    quiz: [
      {
        id: "q1",
        question: "What colour is the kite?",
        options: ["Blue", "Red", "Green"],
        answerIndex: 1
      },
      {
        id: "q2",
        question: "Where does the kite go?",
        options: ["In the tree", "In the sea", "In the box"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "l2-pancakes",
    level: 2,
    title: "Pancakes for Breakfast",
    coverEmoji: "🥞",
    synopsis: "Bella helps Mum make pancakes on Sunday.",
    phonicsFocus: "Digraph 'ck'; sight words 'we', 'like'",
    targetWords: ["we", "like", "milk", "egg", "mix"],
    wordCount: 40,
    pages: [
      { pageNumber: 1, illustration: "🥚", text: "We get an egg." },
      { pageNumber: 2, illustration: "🥛", text: "We get the milk." },
      { pageNumber: 3, illustration: "🥣", text: "Mix, mix, mix!" },
      { pageNumber: 4, illustration: "🍳", text: "Mum cooks the pancakes." },
      { pageNumber: 5, illustration: "🥞", text: "We like pancakes!" }
    ],
    quiz: [
      {
        id: "q1",
        question: "Who cooks the pancakes?",
        options: ["Bella", "Mum", "Tofu"],
        answerIndex: 1
      },
      {
        id: "q2",
        question: "What do they mix with the egg?",
        options: ["Milk", "Juice", "Water"],
        answerIndex: 0
      }
    ]
  },

  // ---------- Level 3 · Story Steps ----------
  {
    id: "l3-the-lost-boot",
    level: 3,
    title: "The Lost Boot",
    coverEmoji: "🥾",
    synopsis: "One rainy day, Finn loses a boot in the mud.",
    phonicsFocus: "Digraphs 'oo' and 'ch'",
    targetWords: ["rain", "mud", "boot", "pull", "splash"],
    wordCount: 72,
    pages: [
      { pageNumber: 1, illustration: "🌧️", text: "It was a rainy day. Finn put on his red boots." },
      { pageNumber: 2, illustration: "💦", text: "Splash! Finn jumped in a puddle. The mud was deep." },
      { pageNumber: 3, illustration: "🥾", text: "Oh no! One boot was stuck in the mud." },
      { pageNumber: 4, illustration: "👧🤝", text: "Bella came to help. They pulled and pulled." },
      { pageNumber: 5, illustration: "🐱", text: "Tofu pulled too. Pop! Out came the boot." },
      { pageNumber: 6, illustration: "😂", text: "They all fell in the mud. What a mess!" }
    ],
    quiz: [
      {
        id: "q1",
        question: "Why was the boot stuck?",
        options: ["It was too big", "The mud was deep", "Tofu hid it"],
        answerIndex: 1
      },
      {
        id: "q2",
        question: "Who helped Finn pull the boot?",
        options: ["Bella and Tofu", "Dad and Mum", "Nobody"],
        answerIndex: 0
      },
      {
        id: "q3",
        question: "What happened at the end?",
        options: ["They went home", "They all fell in the mud", "The boot broke"],
        answerIndex: 1
      }
    ]
  },
  {
    id: "l3-the-school-play",
    level: 3,
    title: "The School Play",
    coverEmoji: "🎭",
    synopsis: "Bella is a star in the school play, but she feels shy.",
    phonicsFocus: "Long vowel 'ay'; feeling words",
    targetWords: ["play", "star", "shy", "brave", "clap"],
    wordCount: 78,
    pages: [
      { pageNumber: 1, illustration: "🎭", text: "The school play was today. Bella was a gold star." },
      { pageNumber: 2, illustration: "😟", text: "Bella felt shy. Her legs would not move." },
      { pageNumber: 3, illustration: "👦💬", text: "Finn said, \"You can do it. Be brave!\"" },
      { pageNumber: 4, illustration: "⭐", text: "Bella walked on. She said her lines with a big voice." },
      { pageNumber: 5, illustration: "👏", text: "Everyone clapped and clapped. Bella smiled." },
      { pageNumber: 6, illustration: "🌟", text: "\"I was shy,\" said Bella, \"but now I am brave!\"" }
    ],
    quiz: [
      {
        id: "q1",
        question: "What was Bella in the play?",
        options: ["A gold star", "A cat", "A tree"],
        answerIndex: 0
      },
      {
        id: "q2",
        question: "How did Bella feel at first?",
        options: ["Brave", "Shy", "Angry"],
        answerIndex: 1
      },
      {
        id: "q3",
        question: "Who told Bella to be brave?",
        options: ["Mum", "The teacher", "Finn"],
        answerIndex: 2
      }
    ]
  },
  {
    id: "l3-a-home-for-bug",
    level: 3,
    title: "A Home for Bug",
    coverEmoji: "🐞",
    synopsis: "Finn finds a ladybird and learns wild things need wild homes.",
    phonicsFocus: "CVC review; nature words",
    targetWords: ["home", "leaf", "jar", "free", "garden"],
    wordCount: 75,
    pages: [
      { pageNumber: 1, illustration: "🐞", text: "Finn found a ladybird on a leaf. He named it Bug." },
      { pageNumber: 2, illustration: "🫙", text: "Finn put Bug in a jar. \"This is your home,\" he said." },
      { pageNumber: 3, illustration: "😢🐞", text: "But Bug did not eat. Bug did not play." },
      { pageNumber: 4, illustration: "👩💬", text: "Mum said, \"A jar is not a home for a wild thing.\"" },
      { pageNumber: 5, illustration: "🌿", text: "Finn took Bug to the garden and let it go." },
      { pageNumber: 6, illustration: "🐞❤️", text: "Bug flew to a leaf. Now Bug was happy, and so was Finn." }
    ],
    quiz: [
      {
        id: "q1",
        question: "Where did Finn put Bug first?",
        options: ["In a jar", "In a box", "In his hat"],
        answerIndex: 0
      },
      {
        id: "q2",
        question: "Why was Bug sad in the jar?",
        options: ["It was too hot", "A jar is not a wild home", "Bug was hungry for cake"],
        answerIndex: 1
      },
      {
        id: "q3",
        question: "Where is Bug's real home?",
        options: ["The kitchen", "The garden", "The school"],
        answerIndex: 1
      }
    ]
  },

  // ---------- Level 4 · Growing Readers ----------
  {
    id: "l4-the-camping-trip",
    level: 4,
    title: "The Camping Trip",
    coverEmoji: "⛺",
    synopsis: "The family camps by the lake, but who took the sausages?",
    phonicsFocus: "Past tense -ed; question words",
    targetWords: ["tent", "torch", "night", "sound", "footprints"],
    wordCount: 120,
    pages: [
      {
        pageNumber: 1,
        illustration: "⛺",
        text: "Last summer, the family went camping by the lake. Finn and Bella helped Dad put up the tent."
      },
      {
        pageNumber: 2,
        illustration: "🔥",
        text: "At night, they cooked sausages on the fire. Mum told funny stories under the stars."
      },
      {
        pageNumber: 3,
        illustration: "🌙",
        text: "Suddenly, they heard a sound. Rustle, rustle! \"What was that?\" whispered Bella."
      },
      {
        pageNumber: 4,
        illustration: "🔦",
        text: "Finn turned on his torch. The sausages were gone! There were little footprints in the mud."
      },
      {
        pageNumber: 5,
        illustration: "🦊",
        text: "They followed the footprints to a bush. Two bright eyes looked back. It was a fox!"
      },
      {
        pageNumber: 6,
        illustration: "😄",
        text: "\"The fox was hungry too,\" laughed Dad. \"Next time, we will keep the food in the box.\""
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Where did the family go camping?",
        options: ["By the sea", "By the lake", "In the city"],
        answerIndex: 1
      },
      {
        id: "q2",
        question: "What did they hear at night?",
        options: ["A rustle", "A song", "Thunder"],
        answerIndex: 0
      },
      {
        id: "q3",
        question: "Who took the sausages?",
        options: ["Tofu", "A fox", "Finn"],
        answerIndex: 1
      }
    ]
  },
  {
    id: "l4-the-broken-robot",
    level: 4,
    title: "The Broken Robot",
    coverEmoji: "🤖",
    synopsis: "Bella's robot stops working before the science fair.",
    phonicsFocus: "Compound words; problem-solving words",
    targetWords: ["robot", "battery", "fix", "try", "idea"],
    wordCount: 118,
    pages: [
      {
        pageNumber: 1,
        illustration: "🤖",
        text: "Bella made a robot for the science fair. It could wave and roll across the floor."
      },
      {
        pageNumber: 2,
        illustration: "😨",
        text: "On the big day, the robot stopped. It did not wave. It did not roll. Bella wanted to cry."
      },
      {
        pageNumber: 3,
        illustration: "🤔",
        text: "\"Don't give up,\" said Finn. \"Let's check it step by step, like real engineers.\""
      },
      {
        pageNumber: 4,
        illustration: "🔋",
        text: "First they checked the wheels. Then they checked the wires. At last, they found it — a flat battery!"
      },
      {
        pageNumber: 5,
        illustration: "🔧",
        text: "Bella put in a new battery. The robot waved, rolled, and even did a little spin."
      },
      {
        pageNumber: 6,
        illustration: "🏅",
        text: "The robot won a gold sticker. \"Trying again was the best idea,\" said Bella proudly."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What was wrong with the robot?",
        options: ["A flat battery", "A broken wheel", "A lost wire"],
        answerIndex: 0
      },
      {
        id: "q2",
        question: "How did they find the problem?",
        options: ["They guessed", "They checked step by step", "They asked Mum"],
        answerIndex: 1
      },
      {
        id: "q3",
        question: "What did the robot win?",
        options: ["A gold sticker", "A cup", "A new battery"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "l4-market-day-mix-up",
    level: 4,
    title: "Market Day Mix-Up",
    coverEmoji: "🧺",
    synopsis: "Finn and Bella shop alone for the first time — with a mixed-up list.",
    phonicsFocus: "Plurals; shopping and number words",
    targetWords: ["list", "carrots", "cheese", "count", "change"],
    wordCount: 125,
    pages: [
      {
        pageNumber: 1,
        illustration: "📝",
        text: "Mum gave Finn a list: six eggs, two carrots, and one cheese. \"Count carefully,\" she said."
      },
      {
        pageNumber: 2,
        illustration: "🌧️📝",
        text: "But on the way, rain fell on the list. The words turned into blue puddles of ink!"
      },
      {
        pageNumber: 3,
        illustration: "🤷",
        text: "\"Was it six carrots and two eggs?\" asked Finn. \"Or six cheeses?\" Bella was not sure."
      },
      {
        pageNumber: 4,
        illustration: "🥕",
        text: "They tried to remember. \"Eggs come in a box of six,\" said Bella. \"That's it!\""
      },
      {
        pageNumber: 5,
        illustration: "🧀",
        text: "They bought six eggs, two carrots, and one cheese. The shopkeeper gave them the change."
      },
      {
        pageNumber: 6,
        illustration: "🏠",
        text: "\"Perfect shopping!\" said Mum at home. \"Next time, we will keep the list in a plastic bag.\""
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What happened to the list?",
        options: ["It blew away", "Rain made the ink run", "Tofu ate it"],
        answerIndex: 1
      },
      {
        id: "q2",
        question: "How many eggs did they need?",
        options: ["Two", "Six", "One"],
        answerIndex: 1
      },
      {
        id: "q3",
        question: "How did Bella remember the eggs?",
        options: ["Eggs come in a box of six", "She read the list again", "She called Mum"],
        answerIndex: 0
      }
    ]
  },

  // ---------- Level 5 · Adventure Readers ----------
  {
    id: "l5-the-glowing-map",
    level: 5,
    title: "The Glowing Map",
    coverEmoji: "🗺️",
    synopsis: "An old map in the attic begins to glow — and an adventure begins.",
    phonicsFocus: "Adventure vocabulary; dialogue",
    targetWords: ["attic", "glow", "riddle", "oak", "treasure"],
    wordCount: 170,
    pages: [
      {
        pageNumber: 1,
        illustration: "🏠",
        text: "One rainy afternoon, Finn and Bella explored the dusty attic. Behind an old trunk, Bella found a rolled-up map tied with a golden ribbon."
      },
      {
        pageNumber: 2,
        illustration: "✨",
        text: "When Finn touched the map, it began to glow! Silver lines appeared, showing their own garden — and a big X under the oak tree."
      },
      {
        pageNumber: 3,
        illustration: "📜",
        text: "Tiny words appeared: \"Dig where the shadow points at noon, and you will find a family treasure soon.\""
      },
      {
        pageNumber: 4,
        illustration: "🌳",
        text: "At noon, the oak tree's shadow pointed to the rose bed. \"There!\" shouted Bella. They dug carefully with Dad's small spade."
      },
      {
        pageNumber: 5,
        illustration: "📦",
        text: "Clunk! The spade hit a metal box. Inside were old photos, a medal, and a letter from Grandpa, written when he was ten."
      },
      {
        pageNumber: 6,
        illustration: "💌",
        text: "\"I hid this for the next explorers in our family,\" the letter said. \"Now hide your own treasure for the future.\""
      },
      {
        pageNumber: 7,
        illustration: "🤫",
        text: "That evening, Finn and Bella buried their own box — with a drawing, a coin, and the glowing map. The adventure would wait for the next explorers."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Where did Bella find the map?",
        options: ["In the garden", "In the attic", "At school"],
        answerIndex: 1
      },
      {
        id: "q2",
        question: "What did the riddle tell them to follow?",
        options: ["The oak tree's shadow at noon", "The river", "A rainbow"],
        answerIndex: 0
      },
      {
        id: "q3",
        question: "Who wrote the letter in the box?",
        options: ["Mum", "Grandpa", "A pirate"],
        answerIndex: 1
      },
      {
        id: "q4",
        question: "What did Finn and Bella do at the end?",
        options: ["Sold the medal", "Buried their own treasure box", "Lost the map"],
        answerIndex: 1
      }
    ]
  },
  {
    id: "l5-the-midnight-library",
    level: 5,
    title: "The Midnight Library",
    coverEmoji: "📚",
    synopsis: "The town library keeps a magical secret after dark.",
    phonicsFocus: "Descriptive language; sequence words",
    targetWords: ["library", "whisper", "midnight", "character", "return"],
    wordCount: 165,
    pages: [
      {
        pageNumber: 1,
        illustration: "🌃",
        text: "Bella left her scarf at the library, so she and Finn went back at closing time. The old librarian smiled. \"Be quick — strange things happen after dark.\""
      },
      {
        pageNumber: 2,
        illustration: "🕛",
        text: "As the clock struck, the lights flickered. A soft whisper filled the room: \"Read us... read us...\" The books were talking!"
      },
      {
        pageNumber: 3,
        illustration: "🐉",
        text: "A green dragon slid out of a storybook and stretched. \"At midnight, characters may leave their pages,\" it yawned, \"but we must return by morning.\""
      },
      {
        pageNumber: 4,
        illustration: "🏴‍☠️",
        text: "Soon the library was full of characters — a pirate reading maps, a queen drinking tea, and a small wolf who was afraid of the dark."
      },
      {
        pageNumber: 5,
        illustration: "🌅",
        text: "When the sky turned pink, the dragon rang a tiny bell. One by one, the characters climbed back into their books and fell asleep."
      },
      {
        pageNumber: 6,
        illustration: "🧣",
        text: "Bella found her scarf on the dragon's shelf. \"Come again,\" whispered the books. \"Every reader is part of our story now.\""
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Why did Bella go back to the library?",
        options: ["To meet the dragon", "To get her scarf", "To read a map"],
        answerIndex: 1
      },
      {
        id: "q2",
        question: "When may characters leave their pages?",
        options: ["At midnight", "At lunch", "On Sundays"],
        answerIndex: 0
      },
      {
        id: "q3",
        question: "What must the characters do by morning?",
        options: ["Hide in the attic", "Return to their books", "Leave the town"],
        answerIndex: 1
      },
      {
        id: "q4",
        question: "Who was afraid of the dark?",
        options: ["The queen", "The pirate", "The small wolf"],
        answerIndex: 2
      }
    ]
  },
  {
    id: "l5-race-to-lighthouse-rock",
    level: 5,
    title: "Race to Lighthouse Rock",
    coverEmoji: "🚣",
    synopsis: "A storm is coming, and a little boat needs help reaching the shore.",
    phonicsFocus: "Weather vocabulary; teamwork phrases",
    targetWords: ["storm", "lighthouse", "signal", "rope", "teamwork"],
    wordCount: 172,
    pages: [
      {
        pageNumber: 1,
        illustration: "🌊",
        text: "On holiday at the seaside, Finn and Bella climbed the cliff path to the old lighthouse. Dark clouds were racing across the sky."
      },
      {
        pageNumber: 2,
        illustration: "⛵",
        text: "Far below, a small sailing boat was struggling in the waves. \"The storm will catch it!\" cried Bella. \"We have to warn the keeper!\""
      },
      {
        pageNumber: 3,
        illustration: "🏃‍♀️",
        text: "They ran up the ninety-nine steps of the lighthouse. At the top, the keeper, Mrs. Reef, was polishing the great lamp."
      },
      {
        pageNumber: 4,
        illustration: "💡",
        text: "\"Quick — turn the handle together!\" said Mrs. Reef. The lamp blazed out its signal: flash, flash, flash. This way to the safe harbour!"
      },
      {
        pageNumber: 5,
        illustration: "🪢",
        text: "The boat turned toward the light. At the harbour, Finn threw the rope, and Dad helped pull the boat in just as the rain crashed down."
      },
      {
        pageNumber: 6,
        illustration: "🏆",
        text: "\"That,\" said Mrs. Reef, \"was perfect teamwork. The light shows the way, but brave helpers make the rescue.\""
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What was coming toward the sea?",
        options: ["A storm", "A whale", "A ship of pirates"],
        answerIndex: 0
      },
      {
        id: "q2",
        question: "How did the lighthouse help the boat?",
        options: ["It made the waves stop", "It flashed a signal to the harbour", "It called the police"],
        answerIndex: 1
      },
      {
        id: "q3",
        question: "What did Finn throw to the boat?",
        options: ["A ring", "A rope", "A net"],
        answerIndex: 1
      },
      {
        id: "q4",
        question: "What is the story mostly about?",
        options: ["Teamwork", "Fishing", "Cooking"],
        answerIndex: 0
      }
    ]
  }
];

export function getBooksByLevel(level: ReadingLevelNumber): ReadingBook[] {
  return readingBooks.filter((book) => book.level === level);
}

export function getBookById(bookId: string): ReadingBook | undefined {
  return readingBooks.find((book) => book.id === bookId);
}

export function toBookSummary(book: ReadingBook): ReadingBookSummary {
  const { pages: _pages, quiz: _quiz, ...summary } = book;
  return summary;
}

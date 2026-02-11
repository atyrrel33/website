import { useState, useEffect, useRef } from "react";

const TOPICS = [
  {
    id: "prophecy",
    icon: "📜",
    title: "Messianic Prophecy",
    subtitle: "300+ Prophecies Fulfilled",
    color: "#B8860B",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    accent: "#DAA520",
    sections: [
      {
        title: "The Mathematical Impossibility",
        content: "Jesus fulfilled over 300 specific prophecies made centuries before His birth — many completely outside His control. Mathematician Peter Stoner calculated that the probability of one person fulfilling just 8 of these prophecies by chance is 1 in 10¹⁷ (that's 1 in 100,000,000,000,000,000).\n\nTo picture this: cover the entire state of Texas two feet deep in silver dollars. Mark one coin. Blindfold someone and ask them to pick up that exact coin on their first try. That's the odds for just 8 prophecies.\n\nJesus fulfilled over 300. For 48 major prophecies, the probability drops to 1 in 10¹⁵⁷. This isn't coincidence — this is divine orchestration.",
        verse: "You search the Scriptures because you think that in them you have eternal life; and it is they that bear witness about me. — John 5:39"
      },
      {
        title: "Isaiah 53 — The Suffering Servant",
        content: "Written around 700 BCE — over seven centuries before Jesus — Isaiah 53 provides the most detailed portrait of Messiah's mission:\n\n• \"He was despised and rejected by men\" (v.3) → Fulfilled: John 1:11\n• \"Pierced for our transgressions\" (v.5) → The Hebrew מְחֹלָל (mecholal) means \"pierced through\" → Fulfilled: 1 Peter 2:24\n• \"Like a lamb led to slaughter, he opened not his mouth\" (v.7) → Fulfilled: Matthew 27:12-14\n• \"Made his grave with the wicked and with a rich man\" (v.9) → Crucified between criminals, buried in Joseph of Arimathea's wealthy tomb\n• \"When his soul makes an offering for guilt (אָשָׁם, asham), he shall prolong his days\" (v.10) → Death as sacrificial offering + resurrection implied\n\nSome argue Isaiah 53 describes corporate Israel — but the singular pronouns (\"he,\" \"him,\" \"his\"), the sinlessness (v.9), and the guilt offering language all point to an individual. And if the servant IS Israel, who are \"my people\" in verse 8?",
        verse: "He was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace. — Isaiah 53:5"
      },
      {
        title: "Psalm 22 — Written Before Crucifixion Existed",
        content: "King David wrote Psalm 22 around 1000 BCE. The Romans didn't invent crucifixion until about 400-300 BCE — roughly 600 years later. Yet David describes it in precise medical detail:\n\n\"My God, my God, why have you forsaken me?\" (v.1) → Jesus' exact words on the cross (Matthew 27:46)\n\n\"All my bones are out of joint\" → Dislocated shoulders from hanging\n\"My heart is like wax\" → Cardiac distress\n\"My strength is dried up\" → Severe dehydration\n\"They have pierced my hands and feet\" (v.16) → The Dead Sea Scrolls (pre-Christian) support the reading \"pierced\" (כָּרוּ, karu)\n\"They divide my garments among them, and for my clothing they cast lots\" (v.18) → Soldiers gambling for His clothes (John 19:23-24)\n\nThe soldiers didn't know they were fulfilling prophecy. Jesus couldn't control how mockers would taunt Him or how soldiers would gamble. This is either divine foreknowledge or the most statistically impossible coincidence in history.",
        verse: "They have pierced my hands and my feet — I can count all my bones — they stare and gloat over me. — Psalm 22:16-17"
      },
      {
        title: "Daniel 9 — The Timeline That Locks It Down",
        content: "Daniel 9 (written ~530 BCE) provides a precise mathematical timeline for when Messiah would appear and be \"cut off\" (killed). This prophecy is so specific it locks out all future messianic claimants.\n\nTHE CALCULATION:\n• \"Seventy weeks\" = 70 × 7 = 490 years\n• 7 weeks + 62 weeks = 69 weeks = 483 years\n• Starting point: Artaxerxes' decree to rebuild Jerusalem (Nehemiah 2:1-8) — 445 BCE\n• 483 years × 360 days (biblical prophetic year) = 173,880 days\n• Result: approximately 32-33 CE\n\nThis is the exact timeframe of Jesus' triumphal entry into Jerusalem.\n\nThen verse 26: \"After the sixty-two weeks, an anointed one shall be cut off\" — Jesus crucified. \"The people of the prince who is to come shall destroy the city and the sanctuary\" — Romans destroyed Jerusalem in 70 CE.\n\nEven Rashi (Judaism's most authoritative medieval commentator, 1040-1105 CE) confirms this timeline points to BEFORE the temple's destruction. The temple was destroyed in 70 CE. No future claimant can fulfill this — the deadline passed 2,000 years ago.",
        verse: "Know therefore and understand that from the going out of the word to restore and build Jerusalem to the coming of an anointed one, a prince, there shall be seven weeks. — Daniel 9:25"
      },
      {
        title: "The Resurrection — The Game Changer",
        content: "Paul wrote: \"If Christ has not been raised, our preaching is useless and so is your faith\" (1 Corinthians 15:14). Christianity stands or falls on the resurrection.\n\nTHE EVIDENCE:\n\n1. THE EMPTY TOMB — All four Gospels report it. Jewish authorities acknowledged it was empty (Matt 28:11-15) — they just claimed the disciples stole the body.\n\n2. POST-RESURRECTION APPEARANCES — Jesus appeared to individuals, groups, and over 500 people at once (1 Cor 15:6). Paul wrote this within 20 years while witnesses were still alive.\n\n3. DISCIPLE TRANSFORMATION — These men went from hiding behind locked doors to publicly proclaiming the resurrection at the cost of their lives. Nobody dies for what they know is a lie.\n\n4. THE EARLY CREED — Paul's testimony in 1 Cor 15:3-8 dates to within 2-5 years of the crucifixion. Too early for legend development.\n\n5. ALL ALTERNATIVES FAIL:\n• \"Disciples stole the body\" — Why die for a known lie?\n• \"Wrong tomb\" — Authorities could produce the body\n• \"Swoon theory\" — Medical experts confirm Jesus died (JAMA, 1986)\n• \"Hallucination\" — Hallucinations are individual; Jesus appeared to groups\n• \"Legend over time\" — The creed is too early for legend",
        verse: "And if Christ has not been raised, your faith is futile; you are still in your sins. — 1 Corinthians 15:17"
      },
      {
        title: "Two Comings, Not Two Messiahs",
        content: "The Old Testament contains TWO distinct portraits of Messiah:\n\nPORTRAIT 1 — SUFFERING SERVANT:\n• Isaiah 53 — Rejected, wounded, killed, buried\n• Psalm 22 — Pierced, mocked, forsaken\n• Zechariah 12:10 — Pierced and mourned\n• Daniel 9:26 — \"Cut off\" (killed)\n\nPORTRAIT 2 — CONQUERING KING:\n• Isaiah 9:6-7 — Eternal government, endless peace\n• Daniel 7:13-14 — Eternal dominion, universal worship\n• Zechariah 14:9 — King over all the earth\n\nHow can Messiah be BOTH killed AND reign forever?\n\nJudaism's solution: Two Messiahs (ben Joseph who dies, ben David who reigns)\nChristianity's solution: One Messiah, Two Comings\n\nJesus Himself indicated this prophetic gap. In Luke 4:18-19, He read from Isaiah 61: \"To proclaim the year of the LORD's favor\" — and stopped mid-sentence. The next phrase: \"and the day of vengeance of our God\" — that's the Second Coming. Same prophecy, two fulfillments separated by millennia.\n\nWhich solution is simpler? Occam's Razor favors one Messiah with two comings.",
        verse: "For to us a child is born, to us a son is given... and his name shall be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace. — Isaiah 9:6"
      }
    ],
    quiz: [
      { q: "How many OT prophecies did Jesus fulfill?", options: ["About 50", "Over 300", "Exactly 100", "Around 12"], answer: 1 },
      { q: "What's the probability of fulfilling just 8 prophecies by chance?", options: ["1 in a million", "1 in a billion", "1 in 10¹⁷", "1 in 10⁵"], answer: 2 },
      { q: "Psalm 22 was written how many years BEFORE crucifixion was invented?", options: ["100 years", "300 years", "600 years", "50 years"], answer: 2 },
      { q: "Daniel 9's timeline points to which timeframe for Messiah?", options: ["100 BCE", "500 CE", "32-33 CE", "200 BCE"], answer: 2 },
      { q: "Paul's resurrection creed dates to within how many years of the crucifixion?", options: ["50-100 years", "2-5 years", "200 years", "20-30 years"], answer: 1 },
      { q: "What Hebrew word in Isaiah 53:10 is a technical sacrificial term?", options: ["Chesed", "Shalom", "Asham (guilt offering)", "Berith"], answer: 2 }
    ]
  },
  {
    id: "heaven-hell",
    icon: "⚖️",
    title: "Heaven & Hell",
    subtitle: "What Scripture Actually Teaches",
    color: "#4a0e0e",
    gradient: "linear-gradient(135deg, #1a0a0a 0%, #2d1b1b 50%, #0a1628 100%)",
    accent: "#E8C547",
    sections: [
      {
        title: "Four Biblical Terms for 'Hell'",
        content: "The English word \"hell\" masks several distinct biblical concepts.\n\n1. SHEOL (שְׁאוֹל) — The Old Testament Grave\nAppearing 66 times in the OT, Sheol referred to the realm of the dead — where both righteous and wicked went. \"In Sheol who will give you praise?\" (Psalm 6:5). It lacked any developed concept of eternal torment.\n\n2. HADES (ᾅδης) — The Temporary Holding Place\nJesus revealed Hades has two compartments separated by an impassable chasm (Luke 16:19-31). The rich man suffers while Lazarus rests in \"Abraham's bosom.\" This is temporary — awaiting final judgment.\n\n3. GEHENNA (γέεννα) — The Final, Eternal Hell\nUsed by Jesus 11 out of 12 NT occurrences. Derived from \"Valley of Hinnom\" outside Jerusalem. Jesus used this as imagery for eternal punishment: \"eternal fire\" (Matt 18:8-9), where \"their worm does not die\" (Mark 9:47-48). Unlike Hades, Gehenna is permanent.\n\n4. TARTARUS (ταρταρόω) — The Angelic Prison\nUsed only once (2 Peter 2:4) for fallen angels held \"in chains of gloomy darkness...until the judgment.\"",
        verse: "I died, and behold I am alive forevermore, and I have the keys of Death and Hades. — Revelation 1:18"
      },
      {
        title: "Christ's Victory Over Death",
        content: "Through His death and resurrection, Jesus fundamentally altered the landscape of death.\n\nTHREE DECISIVE VICTORIES:\n\n1. HE CONQUERED DEATH — \"Death is swallowed up in victory. O death, where is your sting?\" (1 Cor 15:54-55). The sting of death was sin, and sin's power came through the law — but Christ fulfilled the law and paid sin's penalty.\n\n2. HE EMPTIED PARADISE — Leading \"captivity captive\" (Eph 4:8-10). Christ transferred believers from Abraham's bosom to heaven. Saints rose from the dead after His resurrection (Matt 27:52-53).\n\n3. HE STRIPPED SATAN'S AUTHORITY — \"He disarmed the rulers and authorities and put them to open shame\" (Col 2:13-15). Satan's power was based on sin's guilt (atoned for), the law's condemnation (fulfilled), and death's fear (conquered).\n\nTHE BIBLICAL TIMELINE:\n• OT Era: All dead go to Sheol\n• Christ's Death-Resurrection: Conquers death, empties paradise\n• Current Age: Believers go directly to heaven (2 Cor 5:8); unbelievers to Hades\n• Final Judgment (Rev 20:11-15): Unbelievers cast into Gehenna\n• Eternal State: New heaven and earth for believers",
        verse: "Through death he might destroy the one who has the power of death, that is, the devil. — Hebrews 2:14"
      },
      {
        title: "Eternal Punishment — The Hard Question",
        content: "Does hell mean eternal conscious torment, or annihilation?\n\nTHE KEY GREEK WORD — APOLLYMI (ἀπόλλυμι):\nSome argue \"destroy\" means annihilation. But actual NT usage shows:\n• Matt 9:17: Wineskins are \"destroyed\" — they don't vanish; they're ruined\n• Luke 15: The lost sheep is \"destroyed\" — yet it exists and is found\n• 2 Peter 3:6: The flood world \"perished\" — it didn't cease to exist\nVerdict: Apollymi means \"ruin, loss of well-being\" — not extinction.\n\nTHE DECISIVE TEXT — MATTHEW 25:46:\n\"These will go away into eternal punishment, but the righteous into eternal life.\" The same Greek adjective αἰώνιος modifies BOTH states with identical grammar. If eternal life means unending conscious existence, then eternal punishment must too.\n\nREVELATION'S EXPLICIT TESTIMONY:\n\"The smoke of their torment goes up forever and ever, and they have no rest, day and night\" (Rev 14:11). The phrase \"forever and ever\" (εἰς αἰῶνας αἰώνων) is the strongest Greek expression for unending duration — the same used of God's eternal existence.\n\nDEATH IN SCRIPTURE NEVER MEANS CESSATION — it always means separation. Adam \"died\" the day he ate (Gen 2:17), yet lived 930 years. The death was spiritual separation.",
        verse: "These will go away into eternal punishment, but the righteous into eternal life. — Matthew 25:46"
      },
      {
        title: "Heaven — Not Clouds and Harps",
        content: "Popular Christianity conflates two separate realities:\n\nTHE INTERMEDIATE STATE:\nWhere believers go at death. Conscious, blessed, \"with Christ\" (Phil 1:23). Disembodied. Temporary — awaiting resurrection.\n\nTHE FINAL STATE (New Heaven and New Earth):\nAfter Christ's return. Embodied existence in resurrection bodies. Physical earth renewed. Eternal — the permanent home.\n\nWHAT WE'LL ACTUALLY DO:\n• REIGN AND RULE — Authority over cities (Luke 19:17), governance (Rev 5:10)\n• BUILD AND CREATE — Houses, vineyards, purposeful work (Isaiah 65:21-22)\n• EAT AND DRINK — Table with Abraham (Matt 8:11), marriage supper (Rev 19:9)\n• LEARN AND GROW — \"Now I know in part; then I shall know fully\" (1 Cor 13:12). An infinite God means infinite depths to explore forever.\n• SEE HIS FACE — \"They will see his face\" (Rev 22:4). Direct sight of God.\n\nTHE NEW JERUSALEM:\nRev 21-22 gives extraordinary physical detail — cube-shaped, 1,400 miles per side, walls of jasper, streets of transparent gold, tree of life bearing twelve kinds of fruit monthly. Why such physical detail if this is non-material?",
        verse: "Behold, the dwelling place of God is with man. He will dwell with them, and they will be his people. — Revelation 21:3"
      },
      {
        title: "Why Hell Magnifies the Cross",
        content: "The reality of hell reveals the magnitude of God's love. If hell were merely non-existence, Christ's sacrifice would be disproportionate. But if hell means eternal conscious separation from God — then the cross becomes the most stunning display of love imaginable.\n\nJesus endured the wrath we deserved so we would never have to.\n\nTHE HOPE TRANSFORMS HOW WE LIVE:\n• Your body matters — it will be resurrected, not discarded\n• Your work matters — faithful labor prepares you for greater responsibility\n• This world matters — creation is being redeemed, not abandoned\n• Relationships matter — we'll know and love each other forever\n\n\"Therefore, my beloved brothers, be steadfast, immovable, always abounding in the work of the Lord, knowing that in the Lord your labor is not in vain\" (1 Cor 15:58).\n\nThis isn't about being good enough. It's about trusting in Christ's finished work. \"If you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved\" (Romans 10:9).\n\nThe choice is yours. The stakes are eternal. But the offer is grace.",
        verse: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life. — John 3:16"
      }
    ],
    quiz: [
      { q: "How many times does 'Sheol' appear in the Old Testament?", options: ["12 times", "66 times", "100 times", "33 times"], answer: 1 },
      { q: "Which Greek word for 'hell' did Jesus use most often?", options: ["Hades", "Tartarus", "Gehenna", "Sheol"], answer: 2 },
      { q: "What does apollymi (ἀπόλλυμι) actually mean?", options: ["Annihilation", "Ruin / loss of well-being", "Sleep", "Transformation"], answer: 1 },
      { q: "In Matt 25:46, αἰώνιος modifies both 'punishment' and?", options: ["Death", "Fire", "Life", "Judgment"], answer: 2 },
      { q: "What will believers ultimately experience (Rev 22:4)?", options: ["Eternal sleep", "Seeing God's face", "Floating on clouds", "Becoming angels"], answer: 1 }
    ]
  },
  {
    id: "tree",
    icon: "🌳",
    title: "The Tree of Knowledge",
    subtitle: "God's Gift of Real Choice",
    color: "#2d5a27",
    gradient: "linear-gradient(135deg, #1a2e1a 0%, #0d2818 50%, #1a3320 100%)",
    accent: "#7CCD7C",
    sections: [
      {
        title: "The Question Everyone Asks",
        content: "If God loved Adam and Eve, why did He put a dangerous tree in the Garden? Why give them the option to disobey?\n\nThe answer is found in understanding what God is like:\n\nGOD IS LOVE — Not just that He has love or shows love. God IS love. This is His very nature (1 John 4:8). His love is active — the greatest demonstration being sending Jesus to die for our sins (1 John 4:9).\n\nGOD IS TRUTH — He cannot lie. He cannot deceive. It is impossible for Him to be dishonest because that would contradict His very nature (Numbers 23:19; Hebrews 6:18).\n\nThese two attributes — love and truth — together explain why the Tree was necessary.",
        verse: "Anyone who does not love does not know God, because God is love. — 1 John 4:8"
      },
      {
        title: "Why Love Cannot Be Forced",
        content: "Here is the key insight: real love cannot be forced or programmed.\n\nIf someone forced you to say \"I love you,\" would that be real love? No. If someone programmed a robot to say \"I love you,\" would that be real love? No.\n\nReal love requires a real choice. You have to be able to say NO for your YES to mean anything.\n\nSince God IS love, He cannot violate what love actually is. He cannot force people to love Him because that would destroy the very thing He wants — genuine relationship.\n\nWHAT ABOUT FAKE FREEDOM?\nSomeone might say: \"What if God made people who THINK they have free will but are actually programmed?\"\n\nThis makes everything a lie:\n• You would be deceived about your own choices\n• God would be receiving fake love while pretending it's real\n• God would be lying to Himself\n\nRemember — God cannot lie. He cannot deny truth. \"If we are faithless, he remains faithful — for he cannot deny himself\" (2 Timothy 2:13).",
        verse: "God is not man, that he should lie, or a son of man, that he should change his mind. — Numbers 23:19"
      },
      {
        title: "The Tree: God's Gift of Real Choice",
        content: "The Tree gave Adam and Eve a real choice — it let them show whether they truly loved and trusted God.\n\n\"You may surely eat of every tree of the garden, but of the tree of the knowledge of good and evil you shall not eat\" (Genesis 2:16-17).\n\nNotice what God gave them:\n• ABUNDANCE — every tree of the garden\n• ONE SIMPLE BOUNDARY — one tree\n• CLEAR WARNING — you will die\n\nTHE TRAGIC CHOICE:\nGod had created them, blessed them, provided everything, gave them purpose, created companionship, walked with them daily. Every moment proved His love.\n\nYet when the serpent said God was lying, they believed a stranger who had done nothing for them over the God who had given them everything.\n\nThis was more than breaking a rule. It was rejecting God's proven character: \"We don't trust You. We think You're holding back good from us.\"\n\nAbraham was declared righteous because he believed God (Genesis 15:6). Adam and Eve failed this same test.",
        verse: "And he believed the LORD, and he counted it to him as righteousness. — Genesis 15:6"
      },
      {
        title: "Why It Matters Today",
        content: "The Tree was necessary because:\n• God IS love and love cannot be forced\n• God IS truth and cannot create fake freedom\n• Real choice requires real options\n• True love proves itself by choosing obedience when disobedience is possible\n\nWithout the Tree, there could be no real love. Without real choice, there could be no genuine relationship.\n\nThe Tree was a gift. It made real love possible.\n\nYOUR CHOICE TODAY:\nJust like Adam and Eve, you have a choice. Will you trust God's proven love shown in Jesus Christ? Will you believe His word even when the world tells you otherwise?\n\nGod proved His love by sending Jesus to die for your sins and rise again. He invites you to trust Him and receive eternal life.\n\nToday, we face the same choice. Will we trust God's word about Jesus Christ? Will we believe what He says about sin, salvation, and eternal life?",
        verse: "For this is the love of God, that we keep his commandments. And his commandments are not burdensome. — 1 John 5:3"
      }
    ],
    quiz: [
      { q: "According to 1 John 4:8, God doesn't just HAVE love — He _____ love.", options: ["Shows", "IS", "Gives", "Creates"], answer: 1 },
      { q: "Why can't God create beings with 'fake freedom'?", options: ["He lacks the power", "It violates His nature as Truth", "Angels wouldn't allow it", "It would take too long"], answer: 1 },
      { q: "Adam and Eve's disobedience ultimately revealed what?", options: ["God's weakness", "A flaw in creation", "Rejection of God's proven character", "The serpent was stronger"], answer: 2 },
      { q: "Who was declared righteous because he believed God?", options: ["Moses", "David", "Abraham", "Noah"], answer: 2 }
    ]
  },
  {
    id: "wilderness",
    icon: "🏜️",
    title: "Wilderness Complaints",
    subtitle: "Contentment vs. Complacency",
    color: "#8B6914",
    gradient: "linear-gradient(135deg, #2a1f0a 0%, #3d2e14 50%, #1a1508 100%)",
    accent: "#DEB887",
    sections: [
      {
        title: "The False Dichotomy",
        content: "Many Christians assume contentment means accepting mediocrity. Israel's wilderness complaints reveal the exact opposite.\n\nThe Israelites weren't rebuked for wanting to enter the Promised Land. They were rebuked for:\n1. Despising God's miraculous daily bread (Numbers 11)\n2. Preferring visible bondage to invisible promise (Numbers 14)\n3. Calling God's provision \"worthless\" (Numbers 21)\n4. Craving what enslaved them\n\nThis reveals sinful desire versus godly ambition — and the devastating consequences of looking back at spiritual bondage with nostalgia.",
        verse: "But godliness with contentment is great gain, for we brought nothing into the world, and we cannot take anything out. — 1 Timothy 6:6-7"
      },
      {
        title: "Graves of Craving (Numbers 11)",
        content: "\"The rabble had a strong craving... 'We remember the fish we ate in Egypt that cost nothing, the cucumbers, the melons, the leeks, the onions, and the garlic. But now there is nothing but this manna'\" (Numbers 11:4-6).\n\nHEBREW: הִתְאַוּוּ תַּאֲוָה (hit'avvu ta'avah) — \"craved a craving.\" Cognate accusative = extreme, consuming lust. Same root as the 10th commandment: \"You shall not covet.\"\n\nTHE IRONY — NOSTALGIA FOR SLAVERY:\nThey were SLAVES. Everything \"cost\" them their freedom, their children (Pharaoh drowned male infants), brutal labor, and beatings. Yet they remember the food as \"free\" — selective amnesia.\n\nThey despised miraculous bread from heaven — \"the grain of heaven, the bread of angels\" (Psalm 78:24-25) — while craving onions from slavery.\n\nGOD'S RESPONSE: He gave them what they craved — and it killed them. The place was named קִבְרוֹת הַתַּאֲוָה (Qivroth HaTa'avah) — \"Graves of Craving.\"",
        verse: "While the meat was yet between their teeth... the LORD struck down the people with a very great plague. — Numbers 11:33"
      },
      {
        title: "Kadesh-Barnea — Rejecting the Promise",
        content: "Twelve spies returned with conflicting reports.\n\nTHE MAJORITY (10 spies): \"We are not able to go up... we seemed to ourselves like grasshoppers\" (Numbers 13:31-33).\n\nTHE MINORITY (Joshua and Caleb): \"Let us go up at once! Do not fear the people of the land, for they are bread for us!\" (Numbers 13:30; 14:9).\n\nTHE PEOPLE: \"Would that we had died in Egypt! Let us choose a leader and go back\" (Numbers 14:1-4). Preferring slavery to freedom, known bondage to unknown promise.\n\nGOD'S JUDGMENT: The entire generation 20+ would die over 40 years. Only Joshua and Caleb would enter.\n\nBUT CALEB — at age 85 — still said: \"Give me this mountain!\" (Joshua 14:12). He was content with manna, ambitious for mountains, wholly following God.\n\nTHE CONTRAST:\n• The faithless majority: Saw obstacles, wanted slavery, died in wilderness\n• Caleb and Joshua: Saw God's promise, fought for inheritance, entered the land",
        verse: "But my servant Caleb, because he has a different spirit and has followed me fully, I will bring into the land. — Numbers 14:24"
      },
      {
        title: "The Fiery Serpents — Still Complaining",
        content: "38 years later, STILL complaining:\n\n\"We loathe this worthless food\" (Numbers 21:5). Hebrew: קְלֹקֵל (qeloqel) — \"contemptible, worthless.\" They called the bread of angels worthless.\n\nGod sent fiery serpents. When the people repented, God told Moses to make a bronze serpent on a pole — \"everyone who is bitten, when he sees it, shall live\" (Numbers 21:8).\n\nJESUS POINTED TO THIS: \"As Moses lifted up the serpent in the wilderness, so must the Son of Man be lifted up, that whoever believes in him may have eternal life\" (John 3:14-15).\n\nThe remedy for the serpent's venom was looking to the lifted bronze serpent.\nThe remedy for sin's venom is looking to the lifted Christ.",
        verse: "As Moses lifted up the serpent in the wilderness, so must the Son of Man be lifted up. — John 3:14"
      },
      {
        title: "The Critical Distinction",
        content: "BE CONTENT WITH:\n• Basic provision — food, shelter, clothing\n• God's timing — trusting His schedule\n• Current circumstances — not grumbling\n• Others' success — not coveting\nRoot: contentment is in God's presence, not possessions (Hebrews 13:5).\n\nSTRIVE FOR:\n• Excellence in your calling — \"work heartily, as for the Lord\" (Col 3:23)\n• Kingdom impact — bear much fruit (John 15:8)\n• Developing gifts — multiply what God entrusted (Matt 25:14-30)\n• Spiritual maturity — \"press on toward the goal\" (Phil 3:12-14)\n• Your \"mountain\" — the specific calling God has for you\n\nThe wilderness generation got it backwards — content with dying in circles, discontent with God's provision.\n\nCaleb got it right — content with manna, ambitious for mountains.\n\nGod has not called you to survive in the wilderness. He's called you to conquer the Promised Land.",
        verse: "Whatever you do, work heartily, as for the Lord and not for men. — Colossians 3:23"
      }
    ],
    quiz: [
      { q: "What does הִתְאַוּוּ תַּאֲוָה (hit'avvu ta'avah) literally mean?", options: ["Prayed a prayer", "Craved a craving", "Sang a song", "Fought a fight"], answer: 1 },
      { q: "What was the place called where people died from craving?", options: ["Taberah", "Kibroth-Hattaavah (Graves of Craving)", "Kadesh-Barnea", "Marah"], answer: 1 },
      { q: "How old was Caleb when he said 'Give me this mountain!'?", options: ["40", "65", "85", "100"], answer: 2 },
      { q: "Jesus compared Himself to what OT object in John 3:14?", options: ["Manna", "The bronze serpent on a pole", "The burning bush", "The ark"], answer: 1 }
    ]
  },
  {
    id: "science",
    icon: "🔬",
    title: "Faith & Science",
    subtitle: "Christianity vs. Modern Challenges",
    color: "#1a3a5c",
    gradient: "linear-gradient(135deg, #0a1929 0%, #132f4c 50%, #1a2744 100%)",
    accent: "#64B5F6",
    sections: [
      {
        title: "Framing the Debate Properly",
        content: "Contemporary scholarship raises substantial questions:\n\nSCIENTIFIC CHALLENGE: Universe ~13.8 billion years old, earth ~4.54 billion years, human evolution spanning millions of years.\n\nEGYPTIAN CHALLENGE: Pyramid Texts (~2400 BCE) predate written Torah, with sophisticated theology and 3,000 years of documented history.\n\nMESOPOTAMIAN CHALLENGE: Epic of Gilgamesh flood parallels, Code of Hammurabi predating Mosaic law, Enuma Elish creation parallels.\n\nTHE FUNDAMENTAL QUESTION: If these civilizations produced sophisticated texts before biblical writings, and if science contradicts literal Genesis, how can Christianity claim truth?\n\nTHE ANSWER: Christianity's core claims — particularly the resurrection — remain evidentially defensible and historically unique, even when we acknowledge ancient earth, cultural context, and earlier civilizations.",
        verse: "The heavens declare the glory of God, and the sky above proclaims his handiwork. — Psalm 19:1"
      },
      {
        title: "What's Actually at Stake",
        content: "KEY DISTINCTION: Christianity does NOT stand or fall on young earth or literal Genesis. It DOES stand or fall on resurrection historicity.\n\nTRUTH CATEGORIES:\n• Theological Truth — God is love — revelation, faith\n• Moral Truth — Love your neighbor — conscience, divine law\n• Historical Truth — Jesus crucified under Pilate — evidence\n• Phenomenological Truth — Sun \"rises\" — common observation\n• Scientific Truth — How the universe works — empirical investigation\n\nBiblical authors communicated theological truth using ancient cosmological frameworks. Jesus said \"I am the door\" (John 10:9) — He's not literally wood with hinges. Metaphorical language conveys theological truth.\n\nC.S. LEWIS'S \"ANTHROPOLOGICAL ADAM\":\nLewis suggested God prepared hominin forms through evolution, then gave spiritual consciousness — making them human in theological sense (image-bearers). This respects science while preserving theology.\n\nAUGUSTINE'S PRINCIPLE: Don't bind faith to uncertain scientific claims. Church Fathers allowed non-literal Genesis readings centuries before modern science.",
        verse: "In the beginning, God created the heavens and the earth. — Genesis 1:1"
      },
      {
        title: "Cultural Borrowing ≠ Falsehood",
        content: "Biblical texts engaged surrounding literature. This demonstrates:\n1. Biblical authors were real people in the ancient world\n2. They KNEW Mesopotamian traditions\n3. They ADAPTED shared cultural memory with theological transformation\n4. They CRITIQUED polytheism using familiar forms\n\nC.S. Lewis used Norse mythology in Narnia to convey Christian theology. Does that make Narnia \"just mythology\"? No — it's theological narrative using mythological motifs.\n\nGENESIS VS. GILGAMESH (FLOOD):\n• Gilgamesh: Gods flood earth because humans are too noisy. No moral framework.\n• Genesis: God judges moral wickedness. Covenant established. Accountability.\n\nGENESIS VS. ENUMA ELISH (CREATION):\n• Enuma Elish: Violent conflict. Humans created as slaves from divine blood.\n• Genesis: One God creates peacefully through speech. Humans created in God's image with dignity.\n\nSame motifs. Radically different theology. Biblical authors used familiar forms to convey revolutionary monotheistic truth.",
        verse: "For the word of the LORD is upright, and all his work is done in faithfulness. — Psalm 33:4"
      },
      {
        title: "The African Christian Contribution",
        content: "Why the African perspective matters:\n\n1. HOLISTIC INTEGRATION — African thought resists Western dualism. It sees God's action throughout creation. Theistic evolution fits African Christian cosmology.\n\n2. INTELLECTUAL HERITAGE — African Church Fathers (Tertullian, Cyprian, Augustine, Athanasius, Cyril) DEFINED Christian orthodoxy. They engaged philosophy critically. Christianity isn't a Western import — it's a homecoming.\n\n3. CULTURAL CONTEXTUALIZATION — African Christianity transformed indigenous wisdom without erasing it. Biblical faith similarly engaged Near Eastern culture. This is incarnational — God works through cultural forms.\n\n4. SUFFERING AND RESURRECTION — African Christianity was born in persecution. Resurrection hope sustained communities. Existential validation, not just intellectual.\n\nWHAT CHRISTIANITY ACTUALLY CLAIMS:\nNOT young earth, scientific omniscience of biblical authors, or temporal priority.\nYES God as Creator, humans as image-bearers, Jesus as historical person, bodily resurrection, salvation through Christ.",
        verse: "Faith seeking understanding. — Anselm of Canterbury"
      }
    ],
    quiz: [
      { q: "Christianity stands or falls on what?", options: ["Young earth", "The resurrection", "The age of the universe", "Genesis literalism"], answer: 1 },
      { q: "Which Church Father allowed non-literal Genesis readings?", options: ["Luther", "Calvin", "Augustine", "Wesley"], answer: 2 },
      { q: "In Gilgamesh, why do the gods flood the earth?", options: ["Moral judgment", "Humans are too noisy", "New world", "As a game"], answer: 1 },
      { q: "Which African Father's 'Confessions' helped define orthodoxy?", options: ["Tertullian", "Cyprian", "Augustine", "Athanasius"], answer: 2 }
    ]
  }
];

function CrossIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="7" y1="8" x2="17" y2="8" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function HomeScreen({ onSelectTopic, progress }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #0a0e1a 0%, #111827 40%, #1a1005 100%)", padding: "0 0 60px 0", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <div style={{ textAlign: "center", padding: "50px 24px 36px", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)", marginBottom: 20, boxShadow: "0 0 40px rgba(218,165,32,0.3)", color: "#1a1a2e" }}>
          <CrossIcon />
        </div>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 42px)", fontWeight: 700, color: "#F5E6C8", margin: "0 0 8px", letterSpacing: "0.02em", lineHeight: 1.15 }}>Foundations of Faith</h1>
        <p style={{ fontSize: "clamp(14px, 3vw, 17px)", color: "#A0937D", margin: 0, fontFamily: "'Segoe UI', system-ui, sans-serif", fontWeight: 400, letterSpacing: "0.04em" }}>Christian Apologetics · Interactive Study</p>
      </div>
      <div style={{ padding: "0 16px", maxWidth: 560, margin: "0 auto" }}>
        {TOPICS.map((topic, i) => {
          const quizDone = progress[topic.id]?.quizComplete;
          const sectionsRead = progress[topic.id]?.sectionsRead?.length || 0;
          const total = topic.sections.length;
          const pct = Math.round((sectionsRead / total) * 100);
          return (
            <div key={topic.id} onClick={() => onSelectTopic(topic)} style={{ background: topic.gradient, borderRadius: 16, padding: "22px 22px 18px", marginBottom: 14, cursor: "pointer", border: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${150 + i * 100}ms` }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${topic.accent}15, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 32, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", borderRadius: 12, flexShrink: 0 }}>{topic.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: "clamp(17px, 4vw, 20px)", fontWeight: 700, color: "#F5E6C8", margin: "0 0 3px", lineHeight: 1.2 }}>{topic.title}</h2>
                  <p style={{ fontSize: 13, color: topic.accent, margin: 0, fontFamily: "'Segoe UI', sans-serif", fontWeight: 500, opacity: 0.9 }}>{topic.subtitle}</p>
                </div>
                <div style={{ color: "#F5E6C8", opacity: 0.5, flexShrink: 0 }}><ChevronRight /></div>
              </div>
              {(sectionsRead > 0 || quizDone) && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(245,230,200,0.5)", fontFamily: "'Segoe UI', sans-serif", marginBottom: 5 }}>
                    <span>{sectionsRead}/{total} lessons</span>
                    <span>{quizDone ? "Quiz Complete ✓" : `${pct}%`}</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ height: "100%", borderRadius: 2, width: `${quizDone ? 100 : pct}%`, background: `linear-gradient(90deg, ${topic.accent}, ${topic.accent}99)`, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: 36, padding: "0 24px", opacity: loaded ? 1 : 0, transition: "opacity 1s ease 1s" }}>
        <p style={{ fontSize: 12, color: "rgba(160,147,125,0.5)", fontFamily: "'Segoe UI', sans-serif", margin: 0, lineHeight: 1.6 }}>All Scripture quotations ESV · Soli Deo Gloria<br/>Based on scholarly analysis with original Hebrew, Greek &amp; Aramaic</p>
      </div>
    </div>
  );
}

function TopicScreen({ topic, onBack, onOpenSection, onStartQuiz, progress }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);
  const sectionsRead = progress[topic.id]?.sectionsRead || [];
  return (
    <div style={{ minHeight: "100vh", background: topic.gradient, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <div style={{ padding: "16px 16px 0", position: "sticky", top: 0, zIndex: 10, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#F5E6C8", borderRadius: 10, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Segoe UI', sans-serif", fontSize: 14 }}><BackArrow /> Back</button>
      </div>
      <div style={{ textAlign: "center", padding: "24px 24px 32px", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{topic.icon}</div>
        <h1 style={{ fontSize: "clamp(26px, 6vw, 36px)", fontWeight: 700, color: "#F5E6C8", margin: "0 0 6px", lineHeight: 1.15 }}>{topic.title}</h1>
        <p style={{ fontSize: 15, color: topic.accent, fontFamily: "'Segoe UI', sans-serif", margin: 0, fontWeight: 500 }}>{topic.subtitle}</p>
      </div>
      <div style={{ padding: "0 16px 24px", maxWidth: 560, margin: "0 auto" }}>
        {topic.sections.map((section, i) => {
          const isRead = sectionsRead.includes(i);
          return (
            <div key={i} onClick={() => onOpenSection(i)} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${isRead ? topic.accent + '40' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: "18px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, opacity: loaded ? 1 : 0, transform: loaded ? "translateX(0)" : "translateX(-20px)", transition: `all 0.5s ease ${i * 80}ms` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: isRead ? topic.accent : "rgba(255,255,255,0.06)", color: isRead ? "#1a1a2e" : topic.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, flexShrink: 0, fontFamily: "'Segoe UI', sans-serif", transition: "all 0.3s" }}>{isRead ? "✓" : i + 1}</div>
              <h3 style={{ fontSize: "clamp(15px, 3.5vw, 17px)", fontWeight: 600, color: "#F5E6C8", margin: 0, lineHeight: 1.3, flex: 1 }}>{section.title}</h3>
              <div style={{ color: "#F5E6C8", opacity: 0.3, flexShrink: 0 }}><ChevronRight /></div>
            </div>
          );
        })}
        <div onClick={onStartQuiz} style={{ background: `linear-gradient(135deg, ${topic.accent}, ${topic.accent}cc)`, borderRadius: 14, padding: "18px 22px", marginTop: 20, cursor: "pointer", textAlign: "center", opacity: loaded ? 1 : 0, transition: `all 0.6s ease ${topic.sections.length * 80 + 100}ms`, boxShadow: `0 4px 20px ${topic.accent}30` }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", fontFamily: "'Segoe UI', sans-serif" }}>{progress[topic.id]?.quizComplete ? "✓ Quiz Complete — Retake?" : "📝 Take the Quiz"}</span>
        </div>
      </div>
    </div>
  );
}

function SectionReader({ topic, sectionIndex, onBack, onNext, onPrev, totalSections, markRead }) {
  const section = topic.sections[sectionIndex];
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => { setLoaded(false); if (scrollRef.current) scrollRef.current.scrollTop = 0; setTimeout(() => setLoaded(true), 50); markRead(); }, [sectionIndex]);
  const paragraphs = section.content.split("\n\n").filter(Boolean);
  return (
    <div ref={scrollRef} style={{ minHeight: "100vh", background: topic.gradient, fontFamily: "'Cormorant Garamond', Georgia, serif", overflowY: "auto" }}>
      <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10, background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 80%, transparent 100%)" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#F5E6C8", borderRadius: 10, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Segoe UI', sans-serif", fontSize: 13 }}><BackArrow /> Lessons</button>
        <span style={{ fontSize: 13, color: "rgba(245,230,200,0.5)", fontFamily: "'Segoe UI', sans-serif" }}>{sectionIndex + 1} / {totalSections}</span>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "8px 20px 100px", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(16px)", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
        <h1 style={{ fontSize: "clamp(24px, 5.5vw, 32px)", fontWeight: 700, color: "#F5E6C8", margin: "0 0 24px", lineHeight: 1.2 }}>{section.title}</h1>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: "clamp(16px, 3.8vw, 18px)", color: "rgba(245,230,200,0.88)", lineHeight: 1.75, margin: "0 0 18px", fontFamily: p.includes("•") || p.includes("→") || /^\d\./.test(p) ? "'Segoe UI', sans-serif" : "'Cormorant Garamond', Georgia, serif", whiteSpace: "pre-wrap" }}>{p}</p>
        ))}
        <div style={{ borderLeft: `3px solid ${topic.accent}`, padding: "16px 20px", margin: "32px 0", background: `${topic.accent}08`, borderRadius: "0 10px 10px 0" }}>
          <p style={{ fontSize: "clamp(16px, 3.5vw, 19px)", color: topic.accent, fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>{section.verse}</p>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, fontFamily: "'Segoe UI', sans-serif" }}>
          {sectionIndex > 0 && <button onClick={onPrev} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#F5E6C8", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>← Previous</button>}
          {sectionIndex < totalSections - 1 ? <button onClick={onNext} style={{ flex: 1, padding: "14px", background: `linear-gradient(135deg, ${topic.accent}, ${topic.accent}cc)`, border: "none", color: "#1a1a2e", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Next Lesson →</button> : <button onClick={onBack} style={{ flex: 1, padding: "14px", background: `linear-gradient(135deg, ${topic.accent}, ${topic.accent}cc)`, border: "none", color: "#1a1a2e", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 700 }}>✓ Complete — Back to Lessons</button>}
        </div>
      </div>
    </div>
  );
}

function QuizScreen({ topic, onBack, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);
  useEffect(() => { setLoaded(false); setTimeout(() => setLoaded(true), 50); }, [current]);
  const quiz = topic.quiz;
  const q = quiz[current];
  const handleSelect = (i) => { if (showResult) return; setSelected(i); setShowResult(true); if (i === q.answer) setScore(s => s + 1); };
  const handleNext = () => { if (current < quiz.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); } else { setFinished(true); onComplete(); } };

  if (finished) {
    const pct = Math.round((score / quiz.length) * 100);
    return (
      <div style={{ minHeight: "100vh", background: topic.gradient, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{pct >= 80 ? "🏆" : pct >= 50 ? "📖" : "💪"}</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: "#F5E6C8", margin: "0 0 8px" }}>{pct >= 80 ? "Excellent!" : pct >= 50 ? "Good Work!" : "Keep Studying!"}</h1>
          <p style={{ fontSize: 48, fontWeight: 700, color: topic.accent, margin: "0 0 8px" }}>{score}/{quiz.length}</p>
          <p style={{ fontSize: 16, color: "rgba(245,230,200,0.6)", fontFamily: "'Segoe UI', sans-serif", margin: "0 0 32px" }}>{pct >= 80 ? "You know this material well!" : "Review the lessons and try again."}</p>
          <button onClick={onBack} style={{ padding: "14px 32px", background: `linear-gradient(135deg, ${topic.accent}, ${topic.accent}cc)`, border: "none", color: "#1a1a2e", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "'Segoe UI', sans-serif" }}>Back to {topic.title}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: topic.gradient, fontFamily: "'Cormorant Garamond', Georgia, serif", padding: "0 0 40px" }}>
      <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#F5E6C8", borderRadius: 10, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Segoe UI', sans-serif", fontSize: 13 }}><BackArrow /> Exit Quiz</button>
        <span style={{ fontSize: 13, color: "rgba(245,230,200,0.5)", fontFamily: "'Segoe UI', sans-serif" }}>{current + 1} / {quiz.length}</span>
      </div>
      <div style={{ padding: "0 20px", marginBottom: 32 }}>
        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
          <div style={{ height: "100%", borderRadius: 2, width: `${((current + (showResult ? 1 : 0)) / quiz.length) * 100}%`, background: topic.accent, transition: "width 0.5s ease" }} />
        </div>
      </div>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(12px)", transition: "all 0.4s ease" }}>
        <h2 style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 700, color: "#F5E6C8", margin: "0 0 28px", lineHeight: 1.35 }}>{q.q}</h2>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isSelected = i === selected;
          let bg = "rgba(255,255,255,0.04)";
          let border = "rgba(255,255,255,0.08)";
          if (showResult && isCorrect) { bg = "rgba(74,222,128,0.12)"; border = "rgba(74,222,128,0.4)"; }
          else if (showResult && isSelected && !isCorrect) { bg = "rgba(248,113,113,0.12)"; border = "rgba(248,113,113,0.4)"; }
          return (
            <div key={i} onClick={() => handleSelect(i)} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 10, cursor: showResult ? "default" : "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.3s ease" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: showResult && isCorrect ? "rgba(74,222,128,0.2)" : showResult && isSelected && !isCorrect ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#F5E6C8", fontFamily: "'Segoe UI', sans-serif", flexShrink: 0 }}>
                {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✗" : String.fromCharCode(65 + i)}
              </div>
              <span style={{ fontSize: "clamp(15px, 3.5vw, 17px)", color: "#F5E6C8", fontFamily: "'Segoe UI', sans-serif", lineHeight: 1.4 }}>{opt}</span>
            </div>
          );
        })}
        {showResult && <button onClick={handleNext} style={{ width: "100%", padding: "15px", background: `linear-gradient(135deg, ${topic.accent}, ${topic.accent}cc)`, border: "none", color: "#1a1a2e", borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "'Segoe UI', sans-serif", marginTop: 16 }}>{current < quiz.length - 1 ? "Next Question →" : "See Results"}</button>}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState({});

  const markSectionRead = (topicId, sectionIdx) => {
    setProgress(prev => {
      const tp = prev[topicId] || { sectionsRead: [], quizComplete: false };
      const sr = tp.sectionsRead.includes(sectionIdx) ? tp.sectionsRead : [...tp.sectionsRead, sectionIdx];
      return { ...prev, [topicId]: { ...tp, sectionsRead: sr } };
    });
  };
  const markQuizComplete = (topicId) => {
    setProgress(prev => ({ ...prev, [topicId]: { ...(prev[topicId] || { sectionsRead: [] }), quizComplete: true } }));
  };

  if (screen === "home") return <HomeScreen progress={progress} onSelectTopic={(t) => { setCurrentTopic(t); setScreen("topic"); }} />;
  if (screen === "topic" && currentTopic) return <TopicScreen topic={currentTopic} progress={progress} onBack={() => setScreen("home")} onOpenSection={(i) => { setCurrentSection(i); setScreen("section"); }} onStartQuiz={() => setScreen("quiz")} />;
  if (screen === "section" && currentTopic) return <SectionReader topic={currentTopic} sectionIndex={currentSection} totalSections={currentTopic.sections.length} onBack={() => setScreen("topic")} onNext={() => setCurrentSection(s => s + 1)} onPrev={() => setCurrentSection(s => s - 1)} markRead={() => markSectionRead(currentTopic.id, currentSection)} />;
  if (screen === "quiz" && currentTopic) return <QuizScreen topic={currentTopic} onBack={() => setScreen("topic")} onComplete={() => markQuizComplete(currentTopic.id)} />;
  return null;
}

/* Unit 2 content. Hebrew translations and all authored examples were prepared for this app.
 * Worksheet source: PXL_20261111_193323497.jpg. Vocabulary: PXL_20261111_190950754.jpg.
 * Handwritten responses are not an answer key. Worksheet Q6 answer: huge.
 */
(function () {
  'use strict';
  const worksheetImage = 'PXL_20261111_193323497.jpg';
  const rows = [
    {
      id: 'area', en: 'area', he: 'אזור', hint: 'חלק מסוים של מקום, למשל אזור בפארק או בעיר.',
      alt: 'הנער מצביע על אזור פיקניק המוקף בגדר נמוכה בפארק', meaningDistractors: ['מצב', 'אסון', 'נס'],
      distractors: ["disaster","miracle","survivor"],
      examples: [
        ['Please stay in this ___ until the teacher comes.', 'אנא הישארו באזור הזה עד שהמורה יגיע.', 'מבקשים להישאר במקום מסוים עד שהמורה מגיע.', 9],
        ['This ___ of the park is only for dogs.', 'האזור הזה בפארק מיועד רק לכלבים.', 'המשפט מתאר חלק מסוים של הפארק.'],
        ['The picnic ___ has tables, benches, and a place to wash your hands.', 'באזור הפיקניק יש שולחנות, ספסלים ומקום לשטוף ידיים.', 'השולחנות והספסלים נמצאים באזור המיועד לפיקניק.'],
        ['Visitors must leave the swimming ___ when the pool closes.', 'המבקרים צריכים לצאת מאזור השחייה כשהבריכה נסגרת.', 'כשסוגרים את הבריכה יוצאים מהמקום שמיועד לשחייה.']
      ],
      usage: [
        ["The children played in a quiet area of the park.","An area tells you what time it is, such as half past three.","area הוא אזור במקום, ולא שעה ביום."],
        ["We marked the camping area on our map.","The area of the campsite is the number of campers sleeping there.","אזור המחנה הוא מקום, ולא מספר האנשים."]
      ]
    },
    {
      id: 'collapse', en: 'collapse', he: 'להתמוטט / לקרוס', hint: 'ליפול או להתפרק כשאין עוד תמיכה מספקת.',
      alt: 'הנער צופה מאחורי מחסום במחסן עץ ריק שקורס', meaningDistractors: ['לגלות', 'לשרוד', 'ללכוד'],
      distractors: ["lose hope","discover","trap"],
      examples: [
        ['The old bridge might ___ because it is not safe.', 'הגשר הישן עלול להתמוטט מפני שהוא אינו בטוח.', 'הגשר אינו בטוח ולכן הוא עלול ליפול ולהתפרק.', 4],
        ['The roof might ___ under the weight of all that snow.', 'הגג עלול לקרוס תחת משקל כל השלג הזה.', 'המשקל הכבד עלול לגרום לגג ליפול.'],
        ['Remove the bottom block and the whole tower will ___ into a pile.', 'הוציאו את הקובייה התחתונה וכל המגדל יתמוטט לערמה.', 'בלי הקובייה התומכת המגדל ייפול.'],
        ['The engineers added supports so the weak tunnel would not ___.', 'המהנדסים הוסיפו תמיכות כדי שהמנהרה החלשה לא תקרוס.', 'התמיכות מונעות מתקרת המנהרה ליפול.']
      ],
      usage: [
        ["The damaged roof could collapse during the storm.","When a roof collapses, it rises higher and becomes stronger.","collapse הוא לקרוס וליפול, ולא להתחזק ולהתרומם."],
        ["Our tower of cards may collapse if the table moves.","The tower of cards collapsed: every card stayed firmly in its original place.","אם כל הקלפים נשארו במקומם, המגדל לא קרס."]
      ]
    },
    {
      id: 'disaster', en: 'disaster', he: 'אסון', hint: 'אירוע שגורם נזק רב או פגיעה קשה.',
      alt: 'הנער משקיף על רחוב מוצף ובתים שניזוקו באסון', meaningDistractors: ['נס', 'אזור', 'צוות חילוץ'],
      distractors: ["survivor","rescue team","area"],
      examples: [
        ['The flood was a terrible ___ for the town.', 'השיטפון היה אסון נורא לעיירה.', 'השיטפון גרם נזק גדול לעיירה ולכן מתואר כאסון.', 8],
        ['The fire was a ___ that destroyed the whole village.', 'השרפה הייתה אסון שהחריב את כל הכפר.', 'הרס של כפר שלם הוא נזק כבד מאוד.'],
        ['After the natural ___, hundreds of families needed new homes.', 'אחרי אסון הטבע, מאות משפחות נזקקו לבתים חדשים.', 'אירוע טבע שהותיר מאות משפחות ללא בית הוא אסון.'],
        ['The oil spill became an environmental ___, harming birds and fish.', 'דליפת הנפט הפכה לאסון סביבתי ופגעה בציפורים ובדגים.', 'הנזק הרב לבעלי החיים מצביע על אסון סביבתי.']
      ],
      usage: [
        ["The flood was a disaster that left many families without homes.","A disaster is a harmless event that causes no damage or suffering.","אסון גורם נזק כבד או סבל; אירוע חסר נזק אינו אסון."],
        ["Quick action prevented a disaster when the kitchen caught fire.","The report called the flood a disaster because it caused no damage at all.","שיטפון הוא אסון בגלל הנזק הכבד, ולא בגלל היעדר נזק."]
      ]
    },
    {
      id: 'discover', en: 'discover', he: 'לגלות', hint: 'למצוא משהו או ללמוד דבר שלא ידענו קודם.',
      alt: 'הנער מסיט עלים ומגלה מפל נסתר בהפתעה', meaningDistractors: ['ללכוד', 'להתמוטט / לקרוס', 'לאבד תקווה'],
      distractors: ["trap","survive","collapse"],
      examples: [
        ['We went to the mountains to ___ new places.', 'הלכנו להרים כדי לגלות מקומות חדשים.', 'הטיול מאפשר להכיר מקומות שלא הכרנו קודם.', 5],
        ['Scientists hope to ___ a new kind of animal.', 'מדענים מקווים לגלות סוג חדש של בעל חיים.', 'המדענים מחפשים בעל חיים שעדיין אינו מוכר.', 16, ['collapse', 'survive', 'lose hope']],
        ['In this experiment, we will ___ which material keeps water warm longest.', 'בניסוי הזה נגלה איזה חומר שומר על חום המים לזמן הרב ביותר.', 'הניסוי ילמד אותנו מידע שעדיין איננו יודעים.'],
        ['You may ___ a mistake when you read your work again.', 'ייתכן שתגלו טעות כשתקראו שוב את העבודה שלכם.', 'קריאה נוספת עשויה לעזור למצוא טעות שלא ראינו.']
      ],
      usage: [
        ["Researchers hope to discover why the lake changes color.","To discover a fact means to forget it completely.","discover הוא לגלות מידע, ולא לשכוח אותו."],
        ["Read the next chapter to discover what happens to the missing dog.","I discovered the answer today, so I still have no idea what it is.","מי שגילה את התשובה יודע אותה; חוסר ידיעה מוחלט אינו גילוי."]
      ]
    },
    {
      id: 'earthquake', en: 'earthquake', he: 'רעידת אדמה', hint: 'אירוע שבו הקרקע רועדת ולעיתים גורמת נזק למבנים.',
      alt: 'הנער מתכופף מתחת לשולחן יציב בזמן רעידת אדמה', meaningDistractors: ['צוות חילוץ', 'הריסות / חורבות', 'נס'],
      distractors: ["rescue team","survivor","miracle"],
      examples: [
        ['The ___ was so strong that the buildings shook.', 'רעידת האדמה הייתה חזקה כל כך שהבניינים רעדו.', 'התנועה החזקה של הקרקע גורמת לבניינים לרעוד.', 1],
        ['During the ___, we felt the ground shake under our feet.', 'במהלך רעידת האדמה הרגשנו את הקרקע רועדת מתחת לרגלינו.', 'הקרקע רועדת בזמן רעידת אדמה.'],
        ['The ___ moved the ground and cracked the road in several places.', 'רעידת האדמה הזיזה את הקרקע וסדקה את הכביש בכמה מקומות.', 'תזוזת הקרקע והסדקים בכביש מצביעים על רעידת אדמה.'],
        ['Scientists recorded the ___ with instruments that measure movements of the ground.', 'מדענים תיעדו את רעידת האדמה בעזרת מכשירים שמודדים תנועות בקרקע.', 'המכשירים מודדים את רעידות הקרקע.']
      ],
      usage: [
        ["An earthquake shook the town early in the morning.","An earthquake is a change in the weather that makes rain fall from clouds.","רעידת אדמה היא תזוזת קרקע, ולא גשם."],
        ["The earthquake caused cracks in the road.","The guide described an earthquake as a light breeze blowing through trees.","רוח קלה היא תנועת אוויר; earthquake היא רעידת קרקע."]
      ]
    },
    {
      id: 'huge', en: 'huge', he: 'ענק / עצום', hint: 'גדול מאוד בגודל או בכמות.',
      alt: 'הנער ליד גדר תצפית ופיל ענק שממחיש את הבדל הגודל', meaningDistractors: ['מסוכן', 'שקט', 'שבור'],
      distractors: ['miracle', 'survivor', 'earthquake'],
      examples: [
        ['The elephant is a ___ animal.', 'הפיל הוא בעל חיים ענק.', 'המשפט מתאר את הגודל של הפיל. huge הוא ענק; miracle הוא נס.', 6],
        ['A ___ wave hit the beach during the storm.', 'גל ענק פגע בחוף במהלך הסערה.', 'הגל בסערה היה גדול מאוד.', 19, ['survive', 'discover', 'lose hope']],
        ['The box was so ___ that it could not fit through the classroom door.', 'הארגז היה ענק כל כך שלא הצליח לעבור בפתח הכיתה.', 'הארגז גדול מדי לפתח הדלת.'],
        ['A ___ crowd filled every seat in the stadium.', 'קהל עצום מילא את כל המושבים באצטדיון.', 'כל המושבים מלאים — מדובר בקהל גדול מאוד.']
      ],
      usage: [
        ["The huge suitcase was too big to fit in the small locker.","The huge suitcase measured only two centimeters from end to end.","huge הוא גדול מאוד; מזוודה שאורכה שני סנטימטרים היא זעירה."],
        ["The museum has a huge hall with space for hundreds of visitors.","The museum has a huge model of a house that is smaller than a grain of rice.","דגם קטן מגרגר אורז הוא זעיר, ולא huge."]
      ]
    },
    {
      id: 'lose-hope', en: 'lose hope', he: 'לאבד תקווה', hint: 'להפסיק להאמין שיש סיכוי לתוצאה טובה. זהו ביטוי של שתי מילים.',
      alt: 'הנער יושב מיואש מול פאזל שלא הצליח להשלים', meaningDistractors: ['לגלות', 'ללכוד', 'לשרוד'],
      distractors: ["discover","trap","survive"],
      examples: [
        ['Even when things are difficult, do not ___.', 'גם כשהמצב קשה, אל תאבדו תקווה.', 'המשפט מעודד להמשיך להאמין שאפשר להצליח.', 10],
        ['The family did not ___, even after many days of searching.', 'המשפחה לא איבדה תקווה, גם אחרי ימים רבים של חיפושים.', 'למרות החיפוש הארוך המשפחה המשיכה להאמין שתצליח.', 17],
        ['Do not ___ after one low grade; practice can help you improve.', 'אל תאבדו תקווה אחרי ציון נמוך אחד; תרגול יכול לעזור לכם להשתפר.', 'ציון נמוך אחד אינו סיבה להפסיק להאמין בשיפור.'],
        ['The coach told us not to ___ because there was still time to win.', 'המאמן אמר לנו לא לאבד תקווה מפני שעדיין היה זמן לנצח.', 'כל עוד המשחק לא נגמר אפשר להאמין בניצחון.']
      ],
      usage: [
        ["We must not lose hope while there is still a chance to find the dog.","To lose hope means to become completely certain that everything will turn out well.","לאבד תקווה הוא להפסיק להאמין בתוצאה טובה, ולא להיות בטוחים בה."],
        ["It is easy to lose hope after several failures, but a new plan may help.","When I lose hope, I believe more strongly than ever that I will succeed.","אובדן תקווה מחליש את האמונה בהצלחה; כאן האמונה מתחזקת."]
      ]
    },
    {
      id: 'miracle', en: 'miracle', he: 'נס', hint: 'דבר טוב ומפתיע שקשה מאוד להאמין שקרה.',
      alt: 'הנער מתאחד בשמחה עם כלבו האבוד שחזר מהיער', meaningDistractors: ['אסון', 'מצב', 'אזור'],
      distractors: ["disaster","survivor","rescue team"],
      examples: [
        ['It was a ___ that nobody was hurt in the accident.', 'זה היה נס שאיש לא נפגע בתאונה.', 'העובדה שאיש לא נפגע הייתה תוצאה טובה ומפתיעה מאוד.', 11],
        ['It seemed like a ___ that the lost dog found its way home after a year.', 'זה נראה כמו נס שהכלב האבוד מצא את דרכו הביתה אחרי שנה.', 'החזרה אחרי שנה היא אירוע טוב וקשה להאמנה.'],
        ['The doctors called her unexpected recovery a ___.', 'הרופאים כינו את החלמתה המפתיעה נס.', 'החלמה שלא ציפו לה יכולה להיתפס כנס.'],
        ['By some ___, the glass vase fell from the shelf without breaking.', 'בדרך נס, אגרטל הזכוכית נפל מהמדף בלי להישבר.', 'אגרטל שנופל ונשאר שלם הוא הפתעה טובה.']
      ],
      usage: [
        ["It felt like a miracle when our lost cat returned after six months.","A miracle is an ordinary event that happens exactly as everyone expects.","נס הוא אירוע טוב ומפתיע שקשה להאמין שקרה, ולא אירוע שגרתי וצפוי."],
        ["The family called it a miracle that everyone escaped safely.","The guide explained that a miracle is a disaster that always ends in tragedy.","miracle הוא נס טוב ומפתיע; אסון שמסתיים בטרגדיה אינו נס."]
      ]
    },
    {
      id: 'rescue-team', en: 'rescue team', he: 'צוות חילוץ', hint: 'קבוצה שפועלת להציל אנשים שנמצאים בסכנה. שתי המילים הן ביטוי אחד.',
      alt: 'הנער צופה בצוות חילוץ עם קסדות וחבלים המסייע למטיילת', meaningDistractors: ['ניצול / שורד', 'רעידת אדמה', 'הריסות / חורבות'],
      distractors: ["area","earthquake","disaster"],
      examples: [
        ['The ___ arrived quickly to help the people in danger.', 'צוות החילוץ הגיע במהירות כדי לעזור לאנשים שהיו בסכנה.', 'קבוצה מגיעה כדי להציל אנשים שנמצאים בסכנה.', 2],
        ['The ___ searched for people after the earthquake.', 'צוות החילוץ חיפש אנשים אחרי רעידת האדמה.', 'אחרי רעידת אדמה אנשי חילוץ מחפשים מי שזקוקים לעזרה.', 15],
        ['The ___ used ropes to bring the hikers safely down the mountain.', 'צוות החילוץ השתמש בחבלים כדי להוריד את המטיילים מההר בבטחה.', 'הקבוצה משתמשת בציוד חילוץ כדי לעזור למטיילים.'],
        ['A ___ in helmets arrived with equipment to free the people in the tunnel.', 'צוות חילוץ חבוש קסדות הגיע עם ציוד כדי לשחרר את האנשים במנהרה.', 'אנשים עם ציוד מתאים מגיעים לחלץ את מי שנתקעו במנהרה.']
      ],
      usage: [
        ["The rescue team brought the injured climber down the mountain.","A rescue team is a group whose only job is to sell football tickets.","צוות חילוץ מציל אנשים בסכנה; מכירת כרטיסים בלבד אינה חילוץ."],
        ["We called a rescue team when two hikers became trapped in a cave.","The guide defined a rescue team as a single person who survived an accident.","צוות חילוץ הוא קבוצת מחלצים. אדם יחיד שנשאר בחיים הוא ניצול."]
      ]
    },
    {
      id: 'ruins', en: 'ruins', he: 'הריסות / חורבות', hint: 'מה שנותר ממבנה שנהרס. הביטוי in ruins פירושו הרוס או בחורבות.',
      alt: 'הנער מבקר בחורבות טירה עם קירות וקשתות שבורים', meaningDistractors: ['אזור', 'צוות חילוץ', 'רעידת אדמה'],
      distractors: ["area","situation","disaster"],
      examples: [
        ['After the storm, many houses were in ___.', 'אחרי הסערה, בתים רבים היו הרוסים.', 'in ruins מתאר בתים שנהרסו ונשארו מהם חלקים.', 7],
        ['Only the ___ of the old castle remain today.', 'רק חורבות הטירה הישנה נותרו כיום.', 'הטירה כבר אינה שלמה; נשארו ממנה שרידים.', null, ['disaster', 'miracle', 'situation']],
        ['We walked among the ___ and saw parts of the old stone walls.', 'הלכנו בין החורבות וראינו חלקים מחומות האבן הישנות.', 'חלקי החומות הם מה שנשאר מהמבנים.'],
        ['Workers carefully removed the ___ of the burned building before rebuilding.', 'עובדים פינו בזהירות את הריסות הבניין שנשרף לפני שבנו מחדש.', 'לפני הבנייה מפנים את שרידי הבניין שנפגע.']
      ],
      usage: [
        ["Tourists explored the ruins of an ancient city.","The ruins were brand-new buildings that had never been damaged.","חורבות הן שרידי מבנים שנהרסו, ולא בניינים חדשים שמעולם לא נפגעו."],
        ["Only ruins remained where the old stone house had stood.","The guide said ruins are buildings that are still completely intact.","ruins הן חורבות; מבנים שלמים לחלוטין אינם חורבות."]
      ]
    },
    {
      id: 'situation', en: 'situation', he: 'מצב', hint: 'הנסיבות או מה שקורה בזמן מסוים.',
      alt: 'הנער בוחן מפה ושביל חסום בעץ במצב שמצריך החלטה', meaningDistractors: ['אזור', 'נס', 'ניצול / שורד'],
      distractors: ["discover","survive","huge"],
      examples: [
        ['The ___ was dangerous, so we called for help.', 'המצב היה מסוכן, ולכן קראנו לעזרה.', 'כאן מתארים את המצב שבו היינו. התשובה המיועדת בדף היא situation.', 13],
        ['We were lost without a phone, so the ___ was difficult.', 'הלכנו לאיבוד בלי טלפון, ולכן המצב היה קשה.', 'להיות אבודים בלי דרך להתקשר הוא מצב קשה.'],
        ['With no food and no way home, our ___ was getting worse.', 'בלי אוכל ובלי דרך לחזור הביתה, המצב שלנו הלך והחמיר.', 'כל הנסיבות יחד מתארות את המצב שלנו.', null, ['discover', 'survive', 'huge']],
        ['Before deciding what to do, the teacher asked us to explain the whole ___.', 'לפני שהחליטה מה לעשות, המורה ביקשה שנסביר את המצב כולו.', 'כדי להחליט צריך להבין את כל מה שקרה ואת הנסיבות.', null, ['discover', 'survive', 'huge']]
      ],
      usage: [
        ["The situation improved when we found a working phone.","A situation is a tool used only for measuring the length of a table.","situation הוא מצב או מכלול נסיבות, ולא כלי מדידה."],
        ["Please explain the situation so I can understand the problem.","The dictionary defines a situation as a person who stays alive after an accident.","מצב מתאר נסיבות. אדם שנותר בחיים אחרי תאונה הוא survivor."]
      ]
    },
    {
      id: 'survive', en: 'survive', he: 'לשרוד', hint: 'להישאר בחיים או לעבור מצב קשה. זהו פועל — פעולה.',
      alt: 'הנער בונה מחסה ואוסף מים כדי לשרוד בטבע', meaningDistractors: ['לגלות', 'ללכוד', 'להתמוטט / לקרוס'],
      distractors: ["discover","lose hope","huge"],
      examples: [
        ['The children had to ___ in the forest for two days.', 'הילדים נאלצו לשרוד ביער במשך יומיים.', 'הילדים היו צריכים להישאר בחיים עד שיגיעו לעזרה.', 12],
        ['Many people were able to ___ the terrible earthquake.', 'אנשים רבים הצליחו לשרוד את רעידת האדמה הנוראה.', 'האנשים נשארו בחיים אחרי רעידת האדמה.', 20, ['collapse', 'lose hope', 'huge']],
        ['These plants can ___ for weeks without rain.', 'הצמחים האלה יכולים לשרוד שבועות בלי גשם.', 'הצמחים מסוגלים להישאר בחיים גם כשאין גשם.'],
        ['Polar bears have thick fur that helps them ___ in freezing weather.', 'לדובי קוטב יש פרווה עבה שעוזרת להם לשרוד במזג אוויר קפוא.', 'הפרווה מגינה מפני הקור ועוזרת להישאר בחיים.']
      ],
      usage: [
        ["The cactus can survive with very little water.","Plants survive a drought by dying before it ends.","survive הוא להישאר בחיים; צמחים שמתו בבצורת לא שרדו אותה."],
        ["Warm clothes helped the hikers survive the freezing night.","None of the hikers survived the storm; all of them returned home alive and well.","אם כל המטיילים חזרו בחיים, הם שרדו; אין התאמה לטענה שאיש לא שרד."]
      ]
    },
    {
      id: 'survivor', en: 'survivor', he: 'ניצול / שורד', hint: 'אדם שנשאר בחיים לאחר אירוע מסוכן. זהו שם עצם — אדם, ולא פעולה.',
      alt: 'הנער כניצול עטוף בשמיכת חירום לצד אשת חילוץ', meaningDistractors: ['צוות חילוץ', 'מצב', 'אסון'],
      distractors: ["huge","miracle","disaster"],
      examples: [
        ['A ___ is a person who stays alive after a dangerous event.', 'ניצול הוא אדם שנותר בחיים לאחר אירוע מסוכן.', 'מחפשים שם של אדם שנשאר בחיים, ולא את הפועל לשרוד.', 3],
        ['Only one ___ was found after the accident.', 'רק ניצול אחד נמצא אחרי התאונה.', 'האדם שנמצא חי אחרי התאונה הוא ניצול.', 18],
        ['The reporter interviewed a ___ who had escaped from the burning building.', 'הכתב ראיין ניצול שהצליח לצאת מהבניין הבוער.', 'מי שיצא חי מהשרפה הוא אדם שניצל.'],
        ['Each ___ received a warm blanket after being brought safely to shore.', 'כל ניצול קיבל שמיכה חמה אחרי שהובא לחוף בבטחה.', 'נותנים שמיכות לאנשים שהוצאו מהסכנה ונשארו בחיים.']
      ],
      usage: [
        ["A survivor described how she escaped from the sinking boat.","A survivor is someone who died during a dangerous event.","ניצול הוא מי שנשאר בחיים, ולא מי שמת באירוע."],
        ["The survivor thanked the people who had rescued him.","The report listed one survivor, explaining that nobody had remained alive.","ניצול אחד פירושו שאדם אחד לפחות נותר בחיים."]
      ]
    },
    {
      id: 'trap', en: 'trap', he: 'ללכוד', hint: 'לגרום למישהו או למשהו להיתקע בלי יכולת לצאת. כאן trap הוא פועל.',
      alt: 'הנער מזעיק עזרה לאדם שנלכד בבקתה שעץ חוסם את דלתה', meaningDistractors: ['לשרוד', 'לגלות', 'לאבד תקווה'],
      distractors: ["discover","lose hope","collapse"],
      examples: [
        ['The broken door could ___ people inside the room.', 'הדלת המקולקלת הייתה עלולה ללכוד אנשים בתוך החדר.', 'דלת שאינה נפתחת יכולה למנוע מאנשים לצאת.', 14],
        ['A fallen tree could ___ us inside the house by blocking the only door.', 'עץ שנפל עלול ללכוד אותנו בבית בחסימת הדלת היחידה.', 'כשאין דרך יציאה נשארים לכודים.'],
        ['Plastic rings can ___ small sea animals and stop them from swimming away.', 'טבעות פלסטיק עלולות ללכוד בעלי חיים ימיים קטנים ולמנוע מהם לשחות הלאה.', 'הטבעות מונעות מבעלי החיים להשתחרר.'],
        ['Be careful not to ___ your finger when you close the drawer.', 'היזהרו לא ללכוד את האצבע כשאתם סוגרים את המגירה.', 'אצבע יכולה להיתקע בין המגירה למסגרת.']
      ],
      usage: [
        ["A heavy rock could trap the hikers inside the cave.","To trap an animal means to set it free so it can go wherever it wants.","trap הוא ללכוד ולמנוע יציאה, ולא לשחרר."],
        ["The net can trap fish and prevent them from swimming away.","The net trapped the fish, leaving every fish completely free to swim away.","לכידה ברשת מונעת בריחה. דגים שחופשיים לגמרי לשחות אינם לכודים."]
      ]
    }
  ];
  const words = rows.map((row) => {
    const clozes = row.examples.map(([text, translation, hint, sourceQuestion, distractors], index) => ({
      id: `${row.id}-cloze-${index + 1}`,
      text, displayText: text, originalText: text, answer: row.en, translation, hint,
      distractors: [...(distractors || row.distractors)],
      sourceKind: sourceQuestion ? 'worksheet' : 'authored',
      ...(sourceQuestion ? { sourceQuestion, sourceFile: worksheetImage } : { sourceNote: 'נכתב לאפליקציה' })
    }));
    const usage = row.usage.map(([correct, incorrect, hint], index) => ({
      id: `${row.id}-usage-${index + 1}`, correct, incorrect, hint,
      sourceKind: 'authored', sourceNote: 'נכתב לאפליקציה'
    }));
    return {
      id: row.id, en: row.en, he: row.he, hint: row.hint,
      image: `images/unit2/${row.id}.webp`, alt: row.alt,
      meaningDistractors: row.meaningDistractors, clozes, usage,
      sourceKind: 'textbook-vocabulary', sourceFile: 'PXL_20261111_190950754.jpg',
      translationSource: 'app-reviewed-translation'
    };
  });
  window.UNIT2_DATA = {
    id: 'unit-2', number: 2, title: 'Amazing but True · Unit 2', published: true, version: 2,
    description: '14 מילים וביטויים · ארבעה תרגילים',
    sources: { vocabulary: 'PXL_20261111_190950754.jpg', worksheet: worksheetImage },
    words
  };
})();

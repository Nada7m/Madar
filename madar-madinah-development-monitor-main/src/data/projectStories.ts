import type { Project } from "./projects";

export type ProjectStory = Pick<
  Project,
  | "storyTitleAr"
  | "storyTitleEn"
  | "storyAr"
  | "storyEn"
  | "storyFactAr"
  | "storyFactEn"
  | "storySourceUrl"
>;

export const PROJECT_STORIES: Record<string, ProjectStory> = {
  "bir-alfaqir": {
    storyTitleAr: "هنا بدأت حكاية الحرية",
    storyAr:
      "ترتبط هذه الأرض بقصة سلمان الفارسي رضي الله عنه، حين سعى إلى نيل حريته بعد رحلة طويلة قادته إلى المدينة المنورة. وتروي المصادر ارتباط الموقع بقصة غرس النخيل الذي كان جزءًا من سعيه للعتق. واليوم يبقى المكان شاهدًا على قصة تجمع بين الإيمان والعمل والتكافل، ويمنح الزائر فرصة للوقوف بالقرب من أحد المواقع المرتبطة بذاكرة المدينة وسيرتها.",
    storyFactAr: "ترتبط بئر الفقير ومحيطها بقصة سلمان الفارسي رضي الله عنه وسعيه إلى العتق.",
    storyTitleEn: "Where a Story of Freedom Began",
    storyEn:
      "This place is associated with the story of Salman Al-Farsi, whose long journey in search of faith eventually brought him to Madinah. Historical accounts connect the area with the planting of palm trees as part of his path toward freedom. Today, the site preserves a story of faith, work, and solidarity, allowing visitors to encounter a place closely tied to Madinah's early memory.",
    storyFactEn:
      "The site is associated with Salman Al-Farsi and the story of his journey toward freedom.",
  },
  "bir-ghars": {
    storyTitleAr: "بئر تحفظ أثرًا من السيرة",
    storyAr:
      "في منطقة العوالي تقف بئر غرس بوصفها أحد المواقع المأثورة في المدينة المنورة. ارتبط اسمها بالسيرة النبوية، وبقي موقعها حاضرًا ضمن ذاكرة المدينة التاريخية. زيارة البئر اليوم ليست مجرد مشاهدة لبناء قديم؛ بل وقوف أمام موضع حافظ على صلته بتاريخ المدينة عبر القرون.",
    storyFactAr: "تقع بئر غرس في منطقة العوالي، وتُعد من الآبار التاريخية المأثورة في المدينة.",
    storyTitleEn: "A Well Preserving the Memory of the Seerah",
    storyEn:
      "In the Al-Awali area stands Bir Ghars, one of Madinah's historic wells. Its name has long been associated with the Prophetic biography, preserving its place within the city's historical memory. Visiting it today is more than seeing an old structure; it is an encounter with a location that has maintained its connection to Madinah's past across centuries.",
    storyFactEn:
      "Bir Ghars is located in Al-Awali and is regarded as one of Madinah's historic wells.",
  },
  mughaisilah: {
    storyTitleAr: "حي قديم يعود إلى الحياة",
    storyAr:
      "يحمل حي المغيسلة ذاكرة عمرانية واجتماعية من المدينة القديمة. وجاء تطويره بفكرة تتجاوز تحسين الشوارع والمباني؛ إذ تسعى أعمال التأهيل إلى إعادة الحياة للمكان مع الحفاظ على هويته وارتباطه بتاريخ المدينة. وهكذا يصبح التجول في الحي فرصة لرؤية كيف يمكن للتطوير الحديث أن يعمل إلى جانب الذاكرة، لا على حسابها.",
    storyFactAr: "حصل مشروع تطوير وتأهيل حي المغيسلة على جائزة للتميز في إدارة المشاريع عام 2021.",
    storyTitleEn: "An Old Neighborhood Comes Back to Life",
    storyEn:
      "Al-Mughaisilah carries part of the urban and social memory of old Madinah. Its redevelopment goes beyond improving streets and buildings, aiming to bring life back to the neighborhood while preserving its identity and historical connection to the city. Walking through it offers a glimpse of how modern development can work alongside memory rather than replace it.",
    storyFactEn:
      "The Al-Mughaisilah rehabilitation project received a project-management excellence award in 2021.",
  },
  "airport-mma": {
    storyTitleAr: "البوابة الجوية لمدينة الرسول",
    storyAr:
      "بالنسبة إلى ملايين الزوار، تبدأ أولى مشاهد المدينة المنورة من هنا. تطور مطار الأمير محمد بن عبدالعزيز من مطار يخدم المدينة إلى بوابة دولية تستقبل القادمين من أنحاء العالم، ولا سيما الحجاج والمعتمرين والزوار. وبين لحظة الهبوط والوصول إلى المدينة، أصبح المطار جزءًا من تجربة الزيارة نفسها.",
    storyFactAr: "افتُتحت التوسعة الحديثة للمطار عام 2015.",
    storyTitleEn: "The Air Gateway to Madinah",
    storyEn:
      "For millions of visitors, their first glimpse of Madinah begins here. Prince Mohammad bin Abdulaziz International Airport evolved from a city airport into an international gateway welcoming travelers from around the world, particularly pilgrims and visitors. The journey between landing and entering Madinah has therefore become part of the visitor experience itself.",
    storyFactEn: "The airport's modern expansion opened in 2015.",
  },
  "haramain-station": {
    storyTitleAr: "450 كيلومترًا أصبحت أقرب",
    storyAr:
      "يربط قطار الحرمين السريع المدينة المنورة بمكة المكرمة عبر منظومة نقل حديثة صُممت لخدمة حركة السكان والحجاج والمعتمرين والزوار. ومع سرعة تشغيلية تصل إلى 300 كيلومتر في الساعة، تغيّرت تجربة الانتقال بين المدينتين المقدستين، وأصبحت الرحلة نفسها جزءًا من صورة حديثة للبنية التحتية في المملكة.",
    storyFactAr: "يمتد خط قطار الحرمين لنحو 450 كيلومترًا وتصل سرعته التشغيلية إلى 300 كم/ساعة.",
    storyTitleEn: "450 Kilometers, Brought Closer",
    storyEn:
      "The Haramain High Speed Railway connects Madinah and Makkah through a modern transport network serving residents, pilgrims, and visitors. With operating speeds reaching 300 km/h, the experience of traveling between the two holy cities has changed dramatically, making the journey itself part of Saudi Arabia's modern infrastructure story.",
    storyFactEn:
      "The Haramain railway extends for about 450 km and operates at speeds of up to 300 km/h.",
  },
  "hospital-nga": {
    storyTitleAr: "الرعاية جزء من رحلة المدينة",
    storyAr:
      "لا تتكوّن تجربة المدينة من معالمها ووجهاتها فقط؛ فخلف حركة السكان والزوار توجد منظومة من الخدمات التي تجعل الحياة والزيارة أكثر أمانًا واستقرارًا. ويمثل هذا المستشفى جانبًا من البنية الصحية في المدينة، ليذكّر بأن تطور المدن يقاس كذلك بقدرتها على توفير الرعاية لمن يعيش فيها ويزورها.",
    storyTitleEn: "Care Is Part of the City's Journey",
    storyEn:
      "A city's experience is shaped not only by its landmarks and destinations. Behind the movement of residents and visitors is a network of services that makes everyday life and travel safer. This hospital represents part of Madinah's healthcare infrastructure, reminding visitors that a city's development is also reflected in its ability to care for the people who live in and visit it.",
  },
  "anwar-al-madinah-moevenpick-hotel": {
    storyTitleAr: "إقامة في قلب تجربة المدينة",
    storyAr:
      "في مدينة تستقبل زوارًا من مختلف أنحاء العالم، تصبح الضيافة جزءًا من رحلة الوصول والإقامة والاستكشاف. يقدم أنوار المدينة موفنبيك تجربة فندقية ترتبط بقلب المدينة وخدماتها، ليكون الفندق محطة للراحة بين لحظات الزيارة والتنقل.",
    storyTitleEn: "A Stay at the Heart of Madinah",
    storyEn:
      "In a city welcoming visitors from around the world, hospitality becomes part of the journey of arrival, stay, and exploration. Anwar Al Madinah Mövenpick offers an accommodation experience connected to the heart of the city, providing a place to rest between moments of visiting and discovering Madinah.",
  },
  "the-oberoi-madina": {
    storyTitleAr: "الضيافة جزء من الرحلة",
    storyAr:
      "تختلف تجربة المدينة من زائر إلى آخر، لكن الإقامة تبقى جزءًا أساسيًا منها. في ذا أوبروي المدينة تتحول لحظات الراحة إلى امتداد لتجربة الزيارة، حيث يلتقي مفهوم الضيافة الراقية بأجواء المدينة وخصوصيتها.",
    storyTitleEn: "Hospitality as Part of the Journey",
    storyEn:
      "Every visitor experiences Madinah differently, yet accommodation remains an essential part of the journey. At The Oberoi, Madina, moments of rest become an extension of the visit, bringing refined hospitality together with the distinctive atmosphere of the city.",
  },
  "pullman-zamzam-madina": {
    storyTitleAr: "على مقربة من قلب الرحلة",
    storyAr:
      "تكتسب الإقامة في المدينة معنى مختلفًا حين تصبح الوجهات الأساسية قريبة من خطوات الزائر. يقدم بولمان زمزم المدينة تجربة ضيافة مرتبطة بسهولة الوصول إلى المسجد النبوي والمنطقة المركزية، لتصبح العودة إلى الفندق واستكمال الرحلة جزءين متصلين من يوم الزائر.",
    storyTitleEn: "Close to the Heart of the Journey",
    storyEn:
      "A stay in Madinah takes on a different meaning when key destinations are within easy reach. Pullman Zamzam Madina offers an accommodation experience connected to access to the Prophet's Mosque and the central area, making the hotel and the visitor's journey feel like connected parts of the same day.",
  },
  "shaza-al-madina": {
    storyTitleAr: "ضيافة تستلهم المكان",
    storyAr:
      "في مدينة ذات هوية لا تشبه غيرها، يمكن لتجربة الإقامة أن تحمل شيئًا من روح المكان. يقدم شذا المدينة محطة للراحة والضيافة ضمن رحلة الزائر، حيث تصبح تفاصيل الإقامة جزءًا من الذكريات التي يصنعها أثناء وجوده في المدينة.",
    storyTitleEn: "Hospitality Inspired by Place",
    storyEn:
      "In a city with an identity unlike any other, accommodation can carry something of the spirit of its surroundings. Shaza Madinah provides a place of rest and hospitality within the visitor journey, where the details of the stay become part of the memories created in Madinah.",
  },
  "dar-al-taqwa-hotel": {
    storyTitleAr: "حين تصبح الإقامة قريبة من وجهتك",
    storyAr:
      "تدور تجربة دار التقوى حول القرب من المسجد النبوي والمنطقة المركزية، وهو قرب يغيّر إيقاع يوم الزائر بالكامل. هنا لا تكون الإقامة مجرد مكان للنوم، بل نقطة يعود إليها الزائر بين زياراته ولحظاته في قلب المدينة.",
    storyTitleEn: "When Your Stay Is Close to Your Destination",
    storyEn:
      "The Dar Al Taqwa experience is shaped by its proximity to the Prophet's Mosque and Madinah's central area. That closeness changes the rhythm of a visitor's day: accommodation becomes more than a place to sleep, serving as a convenient point of return between moments spent in the heart of the city.",
  },
  "crowne-plaza-madinah": {
    storyTitleAr: "محطة هادئة في رحلة المدينة",
    storyAr:
      "بين الزيارة والتنقل واستكشاف المدينة يحتاج الزائر إلى نقطة يعود إليها. يمثل كراون بلازا المدينة إحدى تجارب الضيافة في المنطقة المركزية، حيث تلتقي الراحة بخدمات الإقامة ضمن رحلة الزائر اليومية.",
    storyTitleEn: "A Calm Stop in the Madinah Journey",
    storyEn:
      "Between visiting, moving around, and exploring Madinah, travelers need a place to return to. Crowne Plaza Madinah represents one of the city's hospitality experiences, bringing accommodation and comfort into the visitor's daily journey.",
  },
  "madinah-hilton": {
    storyTitleAr: "خطوات تفصل الإقامة عن الزيارة",
    storyAr:
      "يمنح الموقع القريب من المسجد النبوي تجربة مختلفة للإقامة؛ إذ يمكن أن يبدأ يوم الزائر من الفندق ثم ينتقل خلال دقائق إلى قلب المنطقة المركزية. في هيلتون المدينة يصبح الموقع نفسه عنصرًا أساسيًا في تجربة الضيف، لا مجرد عنوان على الخريطة.",
    storyFactAr: "يشير الفندق إلى أن المسجد النبوي يبعد نحو دقيقتين سيرًا.",
    storyTitleEn: "Only Steps Between the Stay and the Visit",
    storyEn:
      "Staying close to the Prophet's Mosque creates a different rhythm for a visit to Madinah. From Madinah Hilton, guests can move from their accommodation to the heart of the central area within minutes, making location itself a central part of the experience.",
    storyFactEn:
      "The hotel states that the Prophet's Mosque is approximately a two-minute walk away.",
  },
  "sofitel-shahd-al-madinah": {
    storyTitleAr: "حين تلتقي ثقافتان في تجربة ضيافة",
    storyAr:
      "تقدم سوفيتل تجربتها من خلال لقاء بين أسلوب الضيافة الفرنسية والضيافة العربية في المدينة المنورة. وفي مدينة تستقبل ثقافات متعددة كل يوم، تصبح هذه الفكرة جزءًا من قصة المكان: إقامة معاصرة تحمل هوية عالمية داخل واحدة من أكثر مدن العالم خصوصية.",
    storyTitleEn: "When Two Hospitality Traditions Meet",
    storyEn:
      "Sofitel presents its experience as a meeting point between French hospitality heritage and Arabian hospitality in Madinah. In a city welcoming cultures from around the world every day, this combination becomes part of the place's story: a contemporary international stay within one of the world's most distinctive cities.",
  },
  "madinah-marriott-hotel": {
    storyTitleAr: "راحة بين محطات الزيارة",
    storyAr:
      "المدينة رحلة تتكوّن من محطات كثيرة، والإقامة إحداها. يقدم ماريوت المدينة مساحة للراحة واستعادة الطاقة بين التنقل والزيارة والاستكشاف، ليصبح الفندق جزءًا عمليًا من إيقاع يوم الزائر.",
    storyTitleEn: "Rest Between the Stops of the Journey",
    storyEn:
      "A visit to Madinah is made up of many different moments, and accommodation is one of them. Madinah Marriott provides a place to rest and recharge between travel, visits, and exploration, becoming a practical part of the visitor's daily rhythm.",
  },
  "taiba-madinah-hotel": {
    storyTitleAr: "إقامة ترتبط بقلب المدينة",
    storyAr:
      "بالنسبة للزائر، لا يُقاس الفندق بالغرفة فقط، بل بما يتيحه موقعه من سهولة الحركة والوصول واستكمال الرحلة. تمثل طيبة المدينة إحدى محطات الضيافة التي ترافق الزائر أثناء اكتشاف المدينة والتنقل بين وجهاتها.",
    storyTitleEn: "A Stay Connected to the Heart of Madinah",
    storyEn:
      "For visitors, a hotel is defined not only by the room but also by how it supports movement, access, and the continuation of their journey. Taiba Madinah represents one of the hospitality stops accompanying visitors as they explore the city and move between its destinations.",
  },
  "bait-saaf": {
    storyTitleAr: "المذاق السعودي يحكي حكايته",
    storyAr:
      "في بيت سعف لا يتوقف اكتشاف المدينة عند العمارة والمعالم؛ بل يصل إلى المائدة. يقدم المكان تجربة ترتبط بالمطبخ السعودي والضيافة المحلية، ليمنح الزائر طريقة أخرى للتعرف على الثقافة: من خلال النكهة والأجواء والتفاصيل التي تحيط بالوجبة.",
    storyTitleEn: "Saudi Flavors Tell Their Story",
    storyEn:
      "At Bait Saaf, discovering Madinah extends beyond architecture and landmarks to the dining table. The place offers an experience connected to Saudi cuisine and local hospitality, giving visitors another way to encounter the culture through flavor, atmosphere, and the details surrounding the meal.",
  },
  "taqmira-neighborhood": {
    storyTitleAr: "منزل قديم... وحكاية جديدة",
    storyAr:
      "داخل منزل مديني يتجاوز عمره ثمانين عامًا بدأت حكاية جديدة. أعيد توظيف المكان ليحتضن تقميرة، حيث تلتقي المخبوزات والطعام والقهوة بعمارة تحمل ذاكرة المدينة. وهنا لا يشاهد الزائر التراث من الخارج فقط؛ بل يجلس داخله ويعيش تجربة معاصرة بين جدرانه.",
    storyFactAr: "يقع تقميرة داخل منزل مديني يتجاوز عمره 80 عامًا.",
    storyTitleEn: "An Old House, A New Story",
    storyEn:
      "Inside a Madinah house more than eighty years old, a new story began. The building was given a new purpose as Taqmera, where bakery, food, and coffee meet architecture carrying the memory of the city. Visitors do not simply observe heritage from outside; they sit within it and experience a contemporary use of an old Madinah home.",
    storyFactEn: "Taqmera is located inside a Madinah house more than 80 years old.",
  },
  "into-sushi": {
    storyTitleAr: "نكهة يابانية داخل بيت مديني",
    storyAr:
      "تكمن حكاية إنتو سوشي في المفارقة الجميلة بين المكان والتجربة. داخل بيت مديني قديم تُقدَّم تجربة مستوحاة من المطبخ الياباني، فتلتقي عمارة محلية تحمل ذاكرة المدينة بنكهات جاءت من ثقافة أخرى. إنها صورة صغيرة للطريقة التي تستطيع بها المدن الحفاظ على ماضيها واحتضان تجارب جديدة في الوقت نفسه.",
    storyTitleEn: "Japanese Flavors Inside an Old Madinah House",
    storyEn:
      "The story of Into Sushi lies in the contrast between its setting and its experience. Inside an old Madinah house, a Japanese-inspired dining experience brings together local architecture carrying the city's memory with flavors from another culture. It is a small example of how cities can preserve their past while welcoming something new.",
  },
  "row-farm": {
    storyTitleAr: "قهوة تحت النخيل",
    storyAr:
      "هنا تبدأ التجربة قبل وصول فنجان القهوة. تقع مزرعة رو داخل بيئة المربد التاريخية، حيث النخيل والمزرعة والأجواء المفتوحة تصنع جزءًا أساسيًا من الزيارة. وبين القهوة والحلويات والجلسات، يصبح المكان فرصة لاختبار جانب مختلف من المدينة؛ أكثر هدوءًا وقربًا من طبيعتها.",
    storyFactAr: "ترتبط تجربة Row Farm بمزرعة المربد التاريخية وأجوائها بين النخيل.",
    storyTitleEn: "Coffee Beneath the Palms",
    storyEn:
      "Here, the experience begins before the coffee arrives. Row Farm sits within the historic Al-Mirbad farm environment, where palms, open space, and the agricultural setting become an essential part of the visit. Between coffee, desserts, and seating areas, visitors encounter a quieter side of Madinah connected to its natural landscape.",
    storyFactEn:
      "Row Farm's visitor experience is connected to the historic Al-Mirbad farm and its palm-filled setting.",
  },
  "soul-specialty-coffee": {
    storyTitleAr: "وجه معاصر للمدينة",
    storyAr:
      "بين المواقع التاريخية والمشاريع الحديثة تظهر في المدينة تجارب يومية تصنع صورتها المعاصرة. يمثل Soul Specialty Coffee جانبًا من ثقافة القهوة المختصة التي أصبحت جزءًا من إيقاع المدن الحديثة، ومحطة يمكن للزائر أن يتوقف عندها بين وجهة وأخرى.",
    storyTitleEn: "A Contemporary Side of Madinah",
    storyEn:
      "Between historic places and modern developments, everyday experiences help shape contemporary Madinah. Soul Specialty Coffee represents the specialty-coffee culture that has become part of the rhythm of modern cities, offering visitors a place to pause between destinations.",
  },
  "duo-bakery-coffee": {
    storyTitleAr: "حين تلتقي القهوة بالمخبوزات الفرنسية",
    storyAr:
      "يمثل Duo جانبًا معاصرًا من تجربة المدينة؛ مكان يجمع بين القهوة المختصة والمخبوزات المستوحاة من المدرسة الفرنسية. وبعد جولة بين التاريخ والمشاريع والوجهات، يقدم المكان محطة مختلفة يتعرف فيها الزائر على جانب حديث من أسلوب الحياة في المدينة.",
    storyTitleEn: "When Coffee Meets French Baking",
    storyEn:
      "Duo represents a contemporary side of the Madinah experience, bringing specialty coffee together with French-inspired baking. After exploring history, projects, and destinations, the place offers visitors a different kind of stop and a glimpse into the city's modern lifestyle.",
  },
};

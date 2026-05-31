import type { ContributorProfile, DictionaryEntry } from "./dictionary-contracts";

export const dictionaryEntries: DictionaryEntry[] = [
  {
    id: "entry-kitap",
    slug: "kitap",
    headword: "kitap",
    languageLabel: "Türkçe madde",
    languagePair: "tr-fr",
    pronunciation: "ki-tap",
    ipa: "[kitap]",
    summary:
      "Basılı veya dijital metin bütünü; bağlama göre nesne, bilgi kaynağı veya mecazi anlatım olarak kullanılır.",
    domain: "genel dil",
    contributionStatus: "Topluluk oylarına açık",
    relatedTerms: ["okuma", "kütüphane", "metin", "yazar", "yayın"],
    synonyms: ["eser", "yayın", "cilt"],
    antonyms: ["sözlü anlatım", "doğaçlama"],
    idioms: [
      {
        phrase: "defteri kitabı kapatmak",
        meaning: "Bir iş veya konuyu tümüyle bitirmek."
      },
      {
        phrase: "kitabına uydurmak",
        meaning: "Kuralları kendi lehine yorumlayarak işi yürütmek."
      }
    ],
    etymology: "Arapça 'kitab' kökünden gelir; yazılı metin ve eser anlamları zamanla genişlemiştir.",
    editorialNote:
      "Bu madde anlam bazlı ilerliyor. Her yeni tanım ayrı oy alır; düşük oylu katkılar ana görünümü bozmaz.",
    senses: [
      {
        id: "sense-kitap-1",
        order: 1,
        definition: "Okumak için bir araya getirilmiş yazılı veya basılı yapraklardan oluşan eser.",
        translatedDefinition: "Livre composé de pages reliées ou publié sous forme numérique.",
        level: "A1",
        register: "günlük",
        partOfSpeech: "ad",
        note: "Temel ve en yüksek oylu tanım.",
        contributorName: "Selin Arda",
        examples: [
          {
            source: "Bu benim kitabım.",
            target: "C'est mon livre."
          }
        ],
        votes: {
          one: 2,
          two: 5,
          three: 29
        }
      },
      {
        id: "sense-kitap-2",
        order: 2,
        definition: "Bir alanda başvuru kaynağı olarak görülen düzenli bilgi bütünü.",
        translatedDefinition: "Ouvrage de référence ou ensemble de connaissances organisées.",
        level: "B2",
        register: "akademik",
        partOfSpeech: "ad",
        note: "Akademik bağlamdaki kullanım; teknik kategoride filtrelenebilir.",
        contributorName: "Murat İşler",
        examples: [
          {
            source: "Bu eser çeviri kuramında temel kitap sayılır.",
            target: "Cet ouvrage est considéré comme une référence en théorie de la traduction."
          }
        ],
        votes: {
          one: 1,
          two: 4,
          three: 18
        }
      },
      {
        id: "sense-kitap-3",
        order: 3,
        definition: "Kuralları veya alışık usulü temsil eden mecazi anlatım.",
        translatedDefinition: "Usage figuré évoquant la règle, la méthode ou la norme admise.",
        level: "C1",
        register: "edebi",
        partOfSpeech: "ad",
        note: "Mecazi kullanım düşük oyla gizli bölümde kalır.",
        contributorName: "Elif Duran",
        examples: [
          {
            source: "Böyle bir tavır bizim kitabımıza sığmaz.",
            target: "Une telle attitude ne correspond pas à notre façon de faire."
          }
        ],
        votes: {
          one: 3,
          two: 6,
          three: 12
        }
      }
    ],
    contributions: [
      {
        id: "contribution-kitap-1",
        author: "Selin Arda",
        type: "new-sense",
        summary: "Temel anlam eklendi ve örnek cümle girildi.",
        status: "featured"
      },
      {
        id: "contribution-kitap-2",
        author: "Elif Duran",
        type: "note",
        summary: "Mecazi kullanım için yeni tanım ve çeviri önerisi sunuldu.",
        status: "queued"
      }
    ]
  },
  {
    id: "entry-tourner",
    slug: "tourner",
    headword: "tourner",
    languageLabel: "Fransızca madde",
    languagePair: "fr-tr",
    pronunciation: "tur-ne",
    ipa: "[tuʁne]",
    summary:
      "Dönmek, çevirmek, çekmek veya yönelmek gibi farklı anlamlara açılan yüksek frekanslı eylem.",
    domain: "genel dil",
    contributionStatus: "Yeni anlam eklemeye uygun",
    relatedTerms: ["rotation", "film", "direction", "faire demi-tour"],
    synonyms: ["pivoter", "filmer", "retourner"],
    antonyms: ["arrêter", "figer"],
    idioms: [
      {
        phrase: "tourner la page",
        meaning: "Geçmişi geride bırakmak, yeni bir evreye geçmek."
      }
    ],
    etymology: "Latince 'tornare' fiilinden evrilmiştir; dönme ve biçim verme hareketini taşır.",
    editorialNote:
      "Eylem maddelerinde konu alanı ayrımı önemlidir; fiziksel hareket ile mecazi yöneliş aynı yerde karışmamalıdır.",
    senses: [
      {
        id: "sense-tourner-1",
        order: 1,
        definition: "Bir eksen etrafında hareket etmek veya döndürmek.",
        translatedDefinition: "Bir şey etrafında dönmek veya bir şeyi çevirmek.",
        level: "A2",
        register: "günlük",
        partOfSpeech: "eylem",
        note: "Temel fiziksel hareket anlamı.",
        contributorName: "Deniz Akar",
        examples: [
          {
            source: "La Terre tourne autour du Soleil.",
            target: "Dünya Güneş'in etrafında döner."
          }
        ],
        votes: {
          one: 1,
          two: 7,
          three: 21
        }
      },
      {
        id: "sense-tourner-2",
        order: 2,
        definition: "Bir filmi veya videoyu kaydetmek.",
        translatedDefinition: "Film ya da video çekmek.",
        level: "B1",
        register: "dijital",
        partOfSpeech: "eylem",
        note: "Sinema ve içerik üretimi bağlamında kullanılır.",
        contributorName: "Leyla Şener",
        examples: [
          {
            source: "Ils tournent une série à Istanbul.",
            target: "İstanbul'da bir dizi çekiyorlar."
          }
        ],
        votes: {
          one: 0,
          two: 5,
          three: 16
        }
      }
    ],
    contributions: [
      {
        id: "contribution-tourner-1",
        author: "Leyla Şener",
        type: "translation",
        summary: "Sinema bağlamında Türkçe karşılıklar zenginleştirildi.",
        status: "review"
      }
    ]
  },
  {
    id: "entry-usul",
    slug: "usul",
    headword: "usul",
    languageLabel: "Türkçe madde",
    languagePair: "tr-fr",
    pronunciation: "u-sul",
    ipa: "[usul]",
    summary:
      "Yöntem, biçim veya geleneksel düzen anlamlarına açılan; resmi ve akademik kayıtta sık görülen madde.",
    domain: "resmi dil",
    contributionStatus: "Oylar toparlanıyor",
    relatedTerms: ["yöntem", "prosedür", "gelenek", "biçim"],
    synonyms: ["yöntem", "metot", "usul"],
    antonyms: ["karmaşa", "düzensizlik"],
    idioms: [
      {
        phrase: "usul erkan bilmek",
        meaning: "Toplumsal veya mesleki davranış kurallarını bilmek."
      }
    ],
    etymology: "Arapça 'usul' kökeninden gelir; kök, temel ve yöntem anlam katmanları taşır.",
    editorialNote:
      "Bu tip maddelerde resmi dil ile günlük dil ayrımı kullanıcıya filtre olarak sunulmalıdır.",
    senses: [
      {
        id: "sense-usul-1",
        order: 1,
        definition: "Bir işin yapılış biçimi veya izlenen yöntem.",
        translatedDefinition: "Méthode ou manière de procéder.",
        level: "B1",
        register: "resmi",
        partOfSpeech: "ad",
        note: "Kurumsal yazışmalarda sık kullanılan anlam.",
        contributorName: "Aslı Üstün",
        examples: [
          {
            source: "Başvurular belirtilen usule göre alınacaktır.",
            target: "Les candidatures seront reçues selon la procédure indiquée."
          }
        ],
        votes: {
          one: 2,
          two: 3,
          three: 17
        }
      }
    ],
    contributions: [
      {
        id: "contribution-usul-1",
        author: "Aslı Üstün",
        type: "example",
        summary: "Resmi kayda uygun örnek cümle eklendi.",
        status: "featured"
      }
    ]
  },
  {
    id: "entry-ev",
    slug: "ev",
    headword: "ev",
    languageLabel: "Türkçe madde",
    languagePair: "tr-fr",
    pronunciation: "ev",
    ipa: "[ev]",
    summary: "İnsanların yaşadığı konut veya aile çevresini anlatan temel sözcük.",
    domain: "genel dil",
    contributionStatus: "Topluluk oylarına açık",
    relatedTerms: ["konut", "aile", "oda", "maison"],
    synonyms: ["konut", "hane"],
    antonyms: ["sokak", "dışarısı"],
    idioms: [
      {
        phrase: "ev bark sahibi olmak",
        meaning: "Düzenli bir yaşam ve konut kurmak."
      }
    ],
    etymology: "Eski Türkçe kökenli temel bir addır.",
    editorialNote: "Günlük kullanımda en sık görülen anlam öne çıkarılır.",
    senses: [
      {
        id: "sense-ev-1",
        order: 1,
        definition: "Bir kimsenin veya ailenin içinde yaşadığı yer.",
        translatedDefinition: "maison; logement où vit une personne ou une famille.",
        level: "A1",
        register: "günlük",
        partOfSpeech: "ad",
        note: "Temel konut anlamı.",
        contributorName: "Selin Arda",
        examples: [
          {
            source: "Bu ev çok sessiz.",
            target: "Cette maison est très calme."
          }
        ],
        votes: {
          one: 1,
          two: 3,
          three: 24
        }
      }
    ],
    contributions: [
      {
        id: "contribution-ev-1",
        author: "Selin Arda",
        type: "new-sense",
        summary: "Temel konut anlamı ve örnek tümce eklendi.",
        status: "featured"
      }
    ]
  },
  {
    id: "entry-maison",
    slug: "maison",
    headword: "maison",
    languageLabel: "Fransızca madde",
    languagePair: "fr-tr",
    pronunciation: "me-zon",
    ipa: "[mɛzɔ̃]",
    summary: "Konut, ev halkı veya kurum anlamlarına açılan yaygın Fransızca ad.",
    domain: "genel dil",
    contributionStatus: "Topluluk oylarına açık",
    relatedTerms: ["logement", "famille", "foyer"],
    synonyms: ["logement", "foyer"],
    antonyms: ["dehors"],
    idioms: [
      {
        phrase: "à la maison",
        meaning: "Evde."
      }
    ],
    etymology: "Latince 'mansio' kökünden gelir.",
    editorialNote: "Fiziksel konut anlamı ile kurum anlamı ayrı tanımlanmalıdır.",
    senses: [
      {
        id: "sense-maison-1",
        order: 1,
        definition: "Bâtiment destiné à l'habitation.",
        translatedDefinition: "İçinde yaşamak için kullanılan ev veya konut.",
        level: "A1",
        register: "günlük",
        partOfSpeech: "ad",
        note: "En temel karşılık.",
        contributorName: "Deniz Akar",
        examples: [
          {
            source: "Je rentre à la maison.",
            target: "Eve dönüyorum."
          }
        ],
        votes: {
          one: 0,
          two: 4,
          three: 22
        }
      }
    ],
    contributions: [
      {
        id: "contribution-maison-1",
        author: "Deniz Akar",
        type: "translation",
        summary: "Fransızca temel anlam ve Türkçe karşılık eklendi.",
        status: "featured"
      }
    ]
  },
  {
    id: "entry-ogrenmek",
    slug: "ogrenmek",
    headword: "öğrenmek",
    languageLabel: "Türkçe madde",
    languagePair: "tr-fr",
    pronunciation: "öğ-ren-mek",
    ipa: "[öğrenmek]",
    summary: "Bilgi veya beceri edinmek anlamındaki temel eylem.",
    domain: "eğitim",
    contributionStatus: "Yeni örnek eklemeye uygun",
    relatedTerms: ["bilmek", "çalışmak", "apprendre"],
    synonyms: ["edinmek", "kavramak"],
    antonyms: ["unutmak"],
    idioms: [],
    etymology: "Türkçe 'öğren-' fiil kökünden türemiştir.",
    editorialNote: "Eğitim ve günlük kullanım örnekleri ayrıştırılabilir.",
    senses: [
      {
        id: "sense-ogrenmek-1",
        order: 1,
        definition: "Bir bilgi, dil veya beceriyi çalışarak edinmek.",
        translatedDefinition: "apprendre; acquérir une connaissance ou une compétence.",
        level: "A2",
        register: "günlük",
        partOfSpeech: "eylem",
        note: "Dil öğrenme bağlamında sık kullanılır.",
        contributorName: "Elif Duran",
        examples: [
          {
            source: "Fransızca öğreniyorum.",
            target: "J'apprends le français."
          }
        ],
        votes: {
          one: 1,
          two: 5,
          three: 19
        }
      }
    ],
    contributions: [
      {
        id: "contribution-ogrenmek-1",
        author: "Elif Duran",
        type: "example",
        summary: "Eğitim alanına uygun örnek tümce eklendi.",
        status: "featured"
      }
    ]
  },
  {
    id: "entry-rapide",
    slug: "rapide",
    headword: "rapide",
    languageLabel: "Fransızca madde",
    languagePair: "fr-tr",
    pronunciation: "ra-pid",
    ipa: "[ʁapid]",
    summary: "Hızlı, çabuk veya kısa sürede gerçekleşen şeyler için kullanılan sıfat.",
    domain: "genel dil",
    contributionStatus: "Topluluk oylarına açık",
    relatedTerms: ["vite", "vitesse", "hızlı"],
    synonyms: ["vite", "prompt"],
    antonyms: ["lent"],
    idioms: [],
    etymology: "Latince 'rapidus' kökünden gelir.",
    editorialNote: "Sıfat ve zarf kullanımları örneklerle ayrılmalıdır.",
    senses: [
      {
        id: "sense-rapide-1",
        order: 1,
        definition: "Qui se déplace ou se fait en peu de temps.",
        translatedDefinition: "Hızlı; kısa sürede olan veya hareket eden.",
        level: "A2",
        register: "günlük",
        partOfSpeech: "önad",
        note: "Temel sıfat kullanımı.",
        contributorName: "Leyla Şener",
        examples: [
          {
            source: "Le train est rapide.",
            target: "Tren hızlıdır."
          }
        ],
        votes: {
          one: 0,
          two: 4,
          three: 17
        }
      }
    ],
    contributions: [
      {
        id: "contribution-rapide-1",
        author: "Leyla Şener",
        type: "translation",
        summary: "Sıfat kullanımı için Türkçe karşılık eklendi.",
        status: "review"
      }
    ]
  },
  {
    id: "entry-culture",
    slug: "culture",
    headword: "culture",
    languageLabel: "Fransızca madde",
    languagePair: "fr-tr",
    pronunciation: "kül-tür",
    ipa: "[kyltyʁ]",
    summary: "Kültür, eğitimle edinilen bilgi birikimi veya tarımsal yetiştirme anlamlarına gelebilen ad.",
    domain: "sosyal bilimler",
    contributionStatus: "Anlam ayrımı bekliyor",
    relatedTerms: ["société", "éducation", "kültür"],
    synonyms: ["civilisation", "savoir"],
    antonyms: ["ignorance"],
    idioms: [],
    etymology: "Latince 'cultura' kökünden gelir.",
    editorialNote: "Sosyal bilimler ve tarım anlamları ayrı oy almalıdır.",
    senses: [
      {
        id: "sense-culture-1",
        order: 1,
        definition: "Ensemble des connaissances, pratiques et valeurs d'un groupe.",
        translatedDefinition: "Bir toplumun bilgi, değer ve yaşam biçimleri bütünü; kültür.",
        level: "B2",
        register: "akademik",
        partOfSpeech: "ad",
        note: "Sosyal bilimlerdeki temel anlam.",
        contributorName: "Murat İşler",
        examples: [
          {
            source: "La culture influence la langue.",
            target: "Kültür dili etkiler."
          }
        ],
        votes: {
          one: 1,
          two: 6,
          three: 15
        }
      }
    ],
    contributions: [
      {
        id: "contribution-culture-1",
        author: "Murat İşler",
        type: "new-sense",
        summary: "Akademik bağlamda kültür anlamı eklendi.",
        status: "featured"
      }
    ]
  }
];

export const contributorProfiles: ContributorProfile[] = [
  {
    id: "profile-selin",
    handle: "selin-arda",
    name: "Selin Arda",
    avatarUrl: "/avatars/selin.svg",
    profession: "Mütercim tercüman",
    bio: "Genel dil ve çocuk edebiyatı çevirileri üzerinde çalışıyor.",
    languages: ["Türkçe", "Fransızca", "İngilizce"],
    focusAreas: ["çocuk edebiyatı", "genel dil", "örnek cümle"],
    stats: {
      entriesCreated: 12,
      contributions: 48,
      votesReceived: 126
    },
    recentContributions: [
      {
        entrySlug: "kitap",
        label: "kitap",
        summary: "Temel anlam ve basit örnek cümle akışı kuruldu."
      },
      {
        entrySlug: "usul",
        label: "usul",
        summary: "Resmi dil tonunda açıklama yapıldı."
      }
    ]
  },
  {
    id: "profile-deniz",
    handle: "deniz-akar",
    name: "Deniz Akar",
    avatarUrl: "/avatars/deniz.svg",
    profession: "Fransızca öğretmeni",
    bio: "A1-B2 düzeyindeki eylem kullanımlarını sade ve anlaşılır hale getirmeye odaklanıyor.",
    languages: ["Fransızca", "Türkçe"],
    focusAreas: ["eylemler", "seviye etiketleme", "temel çeviri"],
    stats: {
      entriesCreated: 7,
      contributions: 31,
      votesReceived: 84
    },
    recentContributions: [
      {
        entrySlug: "tourner",
        label: "tourner",
        summary: "Fiziksel hareket anlamı ve ilk örnek cümle eklendi."
      }
    ]
  },
  {
    id: "profile-elif",
    handle: "elif-duran",
    name: "Elif Duran",
    avatarUrl: "/avatars/elif.svg",
    profession: "Redaktör",
    bio: "Mecazi kullanımlar, deyimsel ifadeler ve editör notları ekliyor.",
    languages: ["Türkçe", "Fransızca"],
    focusAreas: ["deyimler", "mecaz", "editör notları"],
    stats: {
      entriesCreated: 3,
      contributions: 22,
      votesReceived: 51
    },
    recentContributions: [
      {
        entrySlug: "kitap",
        label: "kitap",
        summary: "Mecazi anlam için yeni tanım önerisi sundu."
      }
    ]
  }
];

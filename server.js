'use strict';

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const PUBLIC_DIR = path.join(ROOT, 'public');

const FILES = {
  courses: path.join(DATA_DIR, 'courses.json'),
  progress: path.join(DATA_DIR, 'progress.json'),
  favorites: path.join(DATA_DIR, 'favorites.json'),
  wrongAnswers: path.join(DATA_DIR, 'wrong-answers.json'),
  users: path.join(DATA_DIR, 'users.json'),
  activity: path.join(DATA_DIR, 'activity.json')
};

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function ensureFile(file, defaultValue) {
  ensureDirectory(path.dirname(file));

  if (!fs.existsSync(file)) {
    fs.writeFileSync(
      file,
      JSON.stringify(defaultValue, null, 2),
      'utf8'
    );
  }
}

function readJSON(file, fallback) {
  try {
    ensureFile(file, fallback);
    const raw = fs.readFileSync(file, 'utf8');

    if (!raw.trim()) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error('JSON okuma hatası:', file, error.message);
    return fallback;
  }
}

function writeJSON(file, data) {
  ensureDirectory(path.dirname(file));

  const temporary = `${file}.tmp`;

  fs.writeFileSync(
    temporary,
    JSON.stringify(data, null, 2),
    'utf8'
  );

  fs.renameSync(temporary, file);
}

ensureDirectory(DATA_DIR);
ensureDirectory(PUBLIC_DIR);

ensureFile(FILES.courses, []);
ensureFile(FILES.progress, {});
ensureFile(FILES.favorites, {});
ensureFile(FILES.wrongAnswers, {});
ensureFile(FILES.users, []);
ensureFile(FILES.activity, []);

const defaultCourses = [
  {
    id: 'gundelik-yasam-sosyolojisi',
    semester: 6,
    code: 'SOS306',
    title: 'Gündelik Yaşam Sosyolojisi',
    description:
      'Gündelik hayatın sosyolojik açıdan incelenmesi, temel yaklaşımlar, kavramlar ve önemli düşünürler.',
    icon: '◈',
    color: '#7c5cff',
    units: [
      {
        id: 'gys-1',
        number: 1,
        title: 'Gündelik Yaşamın Sosyolojik Analizi',
        summary:
          'Gündelik yaşam, bireylerin sıradan görünen faaliyetlerinin toplumsal ilişkiler ve yapılarla bağlantısını inceleyen önemli bir sosyolojik alandır.',
        keyTerms: [
          'Gündelik yaşam',
          'toplumsal etkileşim',
          'modernlik',
          'sosyal yapı'
        ],
        concepts: [
          {
            term: 'Gündelik yaşam',
            definition:
              'Bireylerin her gün gerçekleştirdiği ilişkiler, alışkanlıklar, pratikler ve deneyimler bütünüdür.'
          },
          {
            term: 'Toplumsal etkileşim',
            definition:
              'Bireylerin birbirlerinin davranışlarını etkiledikleri karşılıklı sosyal süreçtir.'
          }
        ],
        thinkers: [
          {
            name: 'Georg Simmel',
            contribution:
              'Gündelik etkileşim biçimlerinin ve modern kent yaşamının sosyolojik analizine önemli katkılar sağlamıştır.'
          }
        ],
        content: [
          'Gündelik yaşam sosyolojisi, sıradan olarak kabul edilen davranışların arkasındaki toplumsal düzeni anlamaya çalışır.',
          'Bireyin günlük hayatındaki alışkanlıklar yalnızca kişisel tercihler olarak değil, toplumsal yapı ve kültürle ilişkili pratikler olarak da ele alınabilir.',
          'Bu yaklaşım, insanların birbirleriyle nasıl iletişim kurduğunu ve anlam ürettiğini incelemeye önem verir.'
        ],
        questions: [
          {
            id: 'gys-1-q1',
            type: 'multiple',
            question:
              'Gündelik yaşam sosyolojisinin temel inceleme alanlarından biri aşağıdakilerden hangisidir?',
            options: [
              'Sadece biyolojik süreçler',
              'Günlük toplumsal etkileşimler',
              'Yalnızca ekonomik büyüme',
              'Sadece coğrafi hareketler'
            ],
            answer: 1,
            explanation:
              'Gündelik yaşam sosyolojisi, bireylerin günlük yaşamındaki toplumsal ilişkileri ve etkileşimleri inceler.'
          },
          {
            id: 'gys-1-q2',
            type: 'true-false',
            question:
              'Gündelik yaşam sosyolojisi sıradan görünen davranışların toplumsal boyutlarını inceleyebilir.',
            answer: true,
            explanation:
              'Doğru. Günlük pratiklerin toplumsal yapı, kültür ve etkileşimlerle ilişkisi incelenir.'
          }
        ]
      },
      {
        id: 'gys-2',
        number: 2,
        title: 'Georg Simmel ve Gündelik Etkileşim',
        summary:
          'Simmel, bireyler arasındaki etkileşim biçimlerinin toplumun oluşumundaki önemini vurgulayan klasik sosyologlardan biridir.',
        keyTerms: [
          'etkileşim',
          'toplumsal biçimler',
          'metropol',
          'yabancı'
        ],
        concepts: [
          {
            term: 'Metropol',
            definition:
              'Modern kent yaşamının yoğun, hızlı ve farklılaşmış toplumsal ilişkiler ürettiği büyük kent ortamıdır.'
          }
        ],
        thinkers: [
          {
            name: 'Georg Simmel',
            contribution:
              'Toplumu bireyler arasındaki etkileşim süreçleri üzerinden analiz etmiş ve modern kent yaşamına ilişkin önemli değerlendirmeler yapmıştır.'
          }
        ],
        content: [
          'Simmel sosyolojide etkileşim biçimlerine özel önem verir.',
          'Kent yaşamının bireyler üzerindeki etkileri onun çalışmalarında önemli bir yer tutar.',
          'Para ekonomisinin ve metropol yaşamının sosyal ilişkileri dönüştürdüğünü tartışır.'
        ],
        questions: [
          {
            id: 'gys-2-q1',
            type: 'multiple',
            question: 'Simmel hangi konu ile yakından ilişkilidir?',
            options: [
              'Metropol ve modern yaşam',
              'Sadece nüfus sayımı',
              'Yalnızca biyoloji',
              'Jeolojik oluşumlar'
            ],
            answer: 0,
            explanation:
              'Simmel, modern kent ve metropol yaşamının sosyolojik analizine önemli katkılar yapmıştır.'
          }
        ]
      }
    ]
  },

  {
    id: 'cagdas-sosyoloji-kuramlari',
    semester: 6,
    code: 'SOS308',
    title: 'Çağdaş Sosyoloji Kuramları',
    description:
      'Çağdaş sosyolojide öne çıkan kuramsal yaklaşımlar, düşünürler ve temel kavramlar.',
    icon: '◎',
    color: '#00b8d9',
    units: [
      {
        id: 'csk-1',
        number: 1,
        title: 'Çağdaş Sosyolojik Kuramların Temelleri',
        summary:
          'Çağdaş sosyoloji kuramları toplumsal yapıyı, eylemi, anlamı, iktidarı ve modern toplumsal ilişkileri farklı perspektiflerden açıklamaya çalışır.',
        keyTerms: [
          'yapı',
          'eylem',
          'iktidar',
          'modernlik',
          'toplumsal değişme'
        ],
        concepts: [
          {
            term: 'Yapı',
            definition:
              'Toplumsal ilişkileri ve bireylerin davranışlarını etkileyen kurumsal ve ilişkisel düzenlemeler bütünüdür.'
          },
          {
            term: 'Toplumsal eylem',
            definition:
              'Bireyin başkalarının davranışlarını dikkate alarak gerçekleştirdiği anlamlı davranıştır.'
          }
        ],
        thinkers: [
          {
            name: 'Anthony Giddens',
            contribution:
              'Yapılaşma kuramı ile yapı ve fail arasındaki ilişkiyi açıklamaya çalışmıştır.'
          },
          {
            name: 'Pierre Bourdieu',
            contribution:
              'Habitus, alan ve sermaye kavramları üzerinden toplumsal pratikleri analiz etmiştir.'
          }
        ],
        content: [
          'Çağdaş sosyolojik teoriler, klasik sosyolojinin temel sorularını yeni toplumsal koşullar içerisinde yeniden ele alır.',
          'Yapı-fail ilişkisi çağdaş sosyolojinin önemli tartışma alanlarından biridir.',
          'Bireylerin davranışları toplumsal yapılar tarafından etkilenirken bireyler de bu yapıların yeniden üretilmesine katkıda bulunabilir.'
        ],
        questions: [
          {
            id: 'csk-1-q1',
            type: 'multiple',
            question:
              'Yapılaşma kuramı özellikle hangi sosyologla ilişkilendirilir?',
            options: [
              'Anthony Giddens',
              'Auguste Comte',
              'Herbert Spencer',
              'Karl Mannheim'
            ],
            answer: 0,
            explanation:
              'Yapılaşma kuramı Anthony Giddens ile ilişkilendirilir.'
          }
        ]
      }
    ]
  },

  {
    id: 'din-sosyolojisi',
    semester: 6,
    code: 'SOS310',
    title: 'Din Sosyolojisi',
    description:
      'Din olgusunun toplumsal kurumlar, kültür ve toplumsal ilişkiler açısından incelenmesi.',
    icon: '◇',
    color: '#f59e0b',
    units: [
      {
        id: 'ds-1',
        number: 1,
        title: 'Din ve Toplum İlişkisi',
        summary:
          'Din sosyolojisi, dini inanç ve pratikleri toplumsal bağlamları içerisinde inceler.',
        keyTerms: [
          'din',
          'toplum',
          'sekülerleşme',
          'ritüel',
          'kurum'
        ],
        concepts: [
          {
            term: 'Sekülerleşme',
            definition:
              'Toplumsal yaşamın belirli alanlarında dini kurumların ve dini referansların etkisinin dönüşmesi sürecini ifade eden kavramdır.'
          }
        ],
        thinkers: [
          {
            name: 'Émile Durkheim',
            contribution:
              'Dini olguları toplumsal dayanışma ve kolektif yaşam bağlamında incelemiştir.'
          },
          {
            name: 'Max Weber',
            contribution:
              'Din ile ekonomik, kültürel ve toplumsal süreçler arasındaki ilişkileri analiz etmiştir.'
          }
        ],
        content: [
          'Din sosyolojisi dini yalnızca bireysel inanç açısından değil, toplumsal ilişkiler içerisinde inceler.',
          'Dini kurumlar toplumun değerleri, normları ve kolektif yaşamıyla ilişkili olabilir.',
          'Klasik sosyolojide Durkheim ve Weber din sosyolojisinin gelişiminde önemli yere sahiptir.'
        ],
        questions: [
          {
            id: 'ds-1-q1',
            type: 'multiple',
            question:
              'Din sosyolojisinin temel inceleme alanlarından biri aşağıdakilerden hangisidir?',
            options: [
              'Din-toplum ilişkisi',
              'Gezegenlerin hareketleri',
              'Kimyasal tepkimeler',
              'Dilbilgisi kuralları'
            ],
            answer: 0,
            explanation:
              'Din sosyolojisi din ile toplum arasındaki ilişkileri sosyolojik açıdan inceler.'
          }
        ]
      }
    ]
  },

  {
    id: 'egitim-sosyolojisi',
    semester: 6,
    code: 'SOS312',
    title: 'Eğitim Sosyolojisi',
    description:
      'Eğitim kurumunun toplum, kültür, eşitsizlik ve toplumsallaşma ile ilişkisi.',
    icon: '□',
    color: '#22c55e',
    units: [
      {
        id: 'es-1',
        number: 1,
        title: 'Eğitim ve Toplum',
        summary:
          'Eğitim, bireylerin toplumsallaşmasında ve kültürel değerlerin aktarılmasında önemli bir toplumsal kurumdur.',
        keyTerms: [
          'eğitim',
          'toplumsallaşma',
          'kültür',
          'eşitsizlik',
          'kurum'
        ],
        concepts: [
          {
            term: 'Toplumsallaşma',
            definition:
              'Bireyin toplumun değerlerini, normlarını, davranış kalıplarını ve kültürel kodlarını öğrenme sürecidir.'
          }
        ],
        thinkers: [
          {
            name: 'Émile Durkheim',
            contribution:
              'Eğitimin toplumsal dayanışma ve toplumsallaşmadaki rolünü vurgulamıştır.'
          }
        ],
        content: [
          'Eğitim bireyin toplumsal yaşama hazırlanmasında önemli bir role sahiptir.',
          'Okullar yalnızca bilgi aktaran kurumlar değildir; aynı zamanda sosyal normların ve kültürel değerlerin öğrenildiği ortamlardır.',
          'Eğitim sistemi toplumsal eşitsizliklerin yeniden üretimi veya dönüşümü açısından da incelenebilir.'
        ],
        questions: [
          {
            id: 'es-1-q1',
            type: 'multiple',
            question:
              'Eğitim kurumunun temel toplumsal işlevlerinden biri aşağıdakilerden hangisidir?',
            options: [
              'Toplumsallaşmaya katkı sağlamak',
              'Hava olaylarını değiştirmek',
              'Gezegenleri keşfetmek',
              'Kimyasal element üretmek'
            ],
            answer: 0,
            explanation:
              'Eğitim bireylerin toplumsallaşmasına ve kültürel değerleri öğrenmesine katkı sağlar.'
          }
        ]
      }
    ]
  },

  {
    id: 'saglik-sosyolojisi',
    semester: 6,
    code: 'SOS314',
    title: 'Sağlık Sosyolojisi',
    description:
      'Sağlık, hastalık, sağlık kurumları ve sağlık deneyimlerinin toplumsal boyutları.',
    icon: '+',
    color: '#ef4444',
    units: [
      {
        id: 'ss-1',
        number: 1,
        title: 'Sağlık ve Hastalığın Toplumsal Boyutu',
        summary:
          'Sağlık ve hastalık yalnızca biyolojik değil, aynı zamanda sosyal, kültürel ve ekonomik boyutları olan olgulardır.',
        keyTerms: [
          'sağlık',
          'hastalık',
          'toplum',
          'sağlık kurumu',
          'eşitsizlik'
        ],
        concepts: [
          {
            term: 'Sağlık eşitsizliği',
            definition:
              'Farklı toplumsal grupların sağlık koşulları ve sağlık hizmetlerine erişimleri arasındaki farklılıkları ifade eder.'
          }
        ],
        thinkers: [
          {
            name: 'Talcott Parsons',
            contribution:
              'Hastalık rolü kavramı üzerinden hastalığın toplumsal yönlerini ele almıştır.'
          }
        ],
        content: [
          'Sağlık sosyolojisi sağlık ve hastalık deneyimlerini toplumsal bağlam içerisinde değerlendirir.',
          'Sağlık hizmetlerine erişim toplumsal ve ekonomik koşullarla ilişkili olabilir.',
          'Sağlık kurumları da diğer toplumsal kurumlar gibi sosyolojik olarak incelenebilir.'
        ],
        questions: [
          {
            id: 'ss-1-q1',
            type: 'multiple',
            question:
              'Sağlık sosyolojisi aşağıdakilerden hangisini inceler?',
            options: [
              'Sağlığın toplumsal boyutlarını',
              'Sadece anatomik yapıyı',
              'Yalnızca matematiksel işlemleri',
              'Sadece iklim değişikliklerini'
            ],
            answer: 0,
            explanation:
              'Sağlık sosyolojisi sağlık ve hastalığın toplumsal boyutlarını inceler.'
          }
        ]
      }
    ]
  }
];

function initializeCourses() {
  const existing = readJSON(FILES.courses, []);

  if (!Array.isArray(existing) || existing.length === 0) {
    writeJSON(FILES.courses, defaultCourses);
    return defaultCourses;
  }

  return existing;
}

let courses = initializeCourses();

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${crypto
    .randomBytes(5)
    .toString('hex')}`;
}

function sanitizeText(value, maxLength = 5000) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

function findCourse(courseId) {
  return courses.find(course => course.id === courseId);
}

function findUnit(courseId, unitId) {
  const course = findCourse(courseId);

  if (!course || !Array.isArray(course.units)) {
    return null;
  }

  return course.units.find(unit => unit.id === unitId) || null;
}

function getAllUnits() {
  return courses.flatMap(course =>
    (course.units || []).map(unit => ({
      ...unit,
      courseId: course.id,
      courseTitle: course.title,
      semester: course.semester,
      code: course.code
    }))
  );
}

function getAllQuestions() {
  const result = [];

  for (const course of courses) {
    for (const unit of course.units || []) {
      for (const question of unit.questions || []) {
        result.push({
          ...question,
          courseId: course.id,
          courseTitle: course.title,
          unitId: unit.id,
          unitTitle: unit.title
        });
      }
    }
  }

  return result;
}

function normalizeUserId(value) {
  const cleaned = sanitizeText(String(value || ''), 100);

  if (!cleaned) {
    return 'guest';
  }

  return cleaned.replace(/[^a-zA-Z0-9_.@-]/g, '_');
}

function saveActivity(userId, type, metadata = {}) {
  const activity = readJSON(FILES.activity, []);

  activity.push({
    id: generateId('activity'),
    userId,
    type,
    metadata,
    timestamp: new Date().toISOString()
  });

  if (activity.length > 5000) {
    activity.splice(0, activity.length - 5000);
  }

  writeJSON(FILES.activity, activity);
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    name: 'ATA-AÖF Sosyoloji Çalışma Platformu',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/courses', (req, res) => {
  const semester = Number(req.query.semester);

  let result = courses;

  if (Number.isInteger(semester)) {
    result = courses.filter(course => course.semester === semester);
  }

  res.json({
    success: true,
    count: result.length,
    courses: result.map(course => ({
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description,
      icon: course.icon,
      color: course.color,
      semester: course.semester,
      unitCount: Array.isArray(course.units)
        ? course.units.length
        : 0,
      questionCount: (course.units || []).reduce(
        (total, unit) => total + (unit.questions || []).length,
        0
      )
    }))
  });
});

app.get('/api/courses/:courseId', (req, res) => {
  const course = findCourse(req.params.courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Ders bulunamadı.'
    });
  }

  res.json({
    success: true,
    course
  });
});

app.get('/api/courses/:courseId/units', (req, res) => {
  const course = findCourse(req.params.courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Ders bulunamadı.'
    });
  }

  res.json({
    success: true,
    courseId: course.id,
    courseTitle: course.title,
    units: (course.units || []).map(unit => ({
      id: unit.id,
      number: unit.number,
      title: unit.title,
      summary: unit.summary,
      keyTerms: unit.keyTerms || [],
      questionCount: (unit.questions || []).length
    }))
  });
});

app.get('/api/courses/:courseId/units/:unitId', (req, res) => {
  const unit = findUnit(
    req.params.courseId,
    req.params.unitId
  );

  if (!unit) {
    return res.status(404).json({
      success: false,
      error: 'Ünite bulunamadı.'
    });
  }

  const course = findCourse(req.params.courseId);

  res.json({
    success: true,
    course: {
      id: course.id,
      title: course.title,
      code: course.code
    },
    unit
  });
});

app.get('/api/units/:unitId', (req, res) => {
  const result = getAllUnits().find(
    unit => unit.id === req.params.unitId
  );

  if (!result) {
    return res.status(404).json({
      success: false,
      error: 'Ünite bulunamadı.'
    });
  }

  res.json({
    success: true,
    unit: result
  });
});

app.get('/api/questions', (req, res) => {
  const {
    courseId,
    unitId,
    type,
    search,
    limit
  } = req.query;

  let questions = getAllQuestions();

  if (courseId) {
    questions = questions.filter(
      question => question.courseId === courseId
    );
  }

  if (unitId) {
    questions = questions.filter(
      question => question.unitId === unitId
    );
  }

  if (type) {
    questions = questions.filter(
      question => question.type === type
    );
  }

  if (search) {
    const query = sanitizeText(search, 200).toLocaleLowerCase('tr-TR');

    questions = questions.filter(question =>
      question.question
        .toLocaleLowerCase('tr-TR')
        .includes(query)
    );
  }

  const requestedLimit = Number(limit);

  if (
    Number.isInteger(requestedLimit) &&
    requestedLimit > 0
  ) {
    questions = questions.slice(0, Math.min(requestedLimit, 500));
  }

  res.json({
    success: true,
    count: questions.length,
    questions
  });
});

app.get('/api/questions/random', (req, res) => {
  const count = Math.max(
    1,
    Math.min(Number(req.query.count) || 10, 100)
  );

  let questions = getAllQuestions();

  if (req.query.courseId) {
    questions = questions.filter(
      question => question.courseId === req.query.courseId
    );
  }

  if (req.query.unitId) {
    questions = questions.filter(
      question => question.unitId === req.query.unitId
    );
  }

  questions = [...questions].sort(() => Math.random() - 0.5);

  res.json({
    success: true,
    count: Math.min(count, questions.length),
    questions: questions.slice(0, count)
  });
});

app.get('/api/search', (req, res) => {
  const query = sanitizeText(req.query.q, 200);

  if (!query) {
    return res.json({
      success: true,
      query: '',
      results: []
    });
  }

  const normalized = query.toLocaleLowerCase('tr-TR');
  const results = [];

  for (const course of courses) {
    const courseMatch =
      course.title.toLocaleLowerCase('tr-TR').includes(normalized) ||
      course.description
        .toLocaleLowerCase('tr-TR')
        .includes(normalized);

    if (courseMatch) {
      results.push({
        type: 'course',
        id: course.id,
        title: course.title,
        description: course.description
      });
    }

    for (const unit of course.units || []) {
      const unitText = [
        unit.title,
        unit.summary,
        ...(unit.keyTerms || []),
        ...(unit.content || [])
      ]
        .join(' ')
        .toLocaleLowerCase('tr-TR');

      if (unitText.includes(normalized)) {
        results.push({
          type: 'unit',
          id: unit.id,
          courseId: course.id,
          courseTitle: course.title,
          title: unit.title,
          summary: unit.summary
        });
      }

      for (const question of unit.questions || []) {
        if (
          question.question
            .toLocaleLowerCase('tr-TR')
            .includes(normalized)
        ) {
          results.push({
            type: 'question',
            id: question.id,
            courseId: course.id,
            unitId: unit.id,
            courseTitle: course.title,
            unitTitle: unit.title,
            title: question.question
          });
        }
      }
    }
  }

  res.json({
    success: true,
    query,
    count: results.length,
    results: results.slice(0, 100)
  });
});

app.get('/api/stats', (req, res) => {
  const allUnits = getAllUnits();
  const allQuestions = getAllQuestions();

  res.json({
    success: true,
    stats: {
      courses: courses.length,
      units: allUnits.length,
      questions: allQuestions.length,
      semesters: [...new Set(courses.map(c => c.semester))]
    }
  });
});

app.post('/api/progress', (req, res) => {
  const userId = normalizeUserId(req.body.userId);
  const courseId = sanitizeText(req.body.courseId, 200);
  const unitId = sanitizeText(req.body.unitId, 200);

  if (!courseId || !unitId) {
    return res.status(400).json({
      success: false,
      error: 'courseId ve unitId gereklidir.'
    });
  }

  const progress = readJSON(FILES.progress, {});

  if (!progress[userId]) {
    progress[userId] = {};
  }

  if (!progress[userId][courseId]) {
    progress[userId][courseId] = {};
  }

  const current = progress[userId][courseId][unitId] || {
    completed: false,
    percent: 0,
    lastOpened: null,
    attempts: 0
  };

  const percent = Math.max(
    0,
    Math.min(Number(req.body.percent) || 0, 100)
  );

  current.percent = percent;
  current.completed =
    req.body.completed === true || percent >= 100;
  current.lastOpened = new Date().toISOString();
  current.attempts += 1;

  progress[userId][courseId][unitId] = current;

  writeJSON(FILES.progress, progress);

  saveActivity(userId, 'progress_update', {
    courseId,
    unitId,
    percent,
    completed: current.completed
  });

  res.json({
    success: true,
    progress: current
  });
});

app.get('/api/progress/:userId', (req, res) => {
  const userId = normalizeUserId(req.params.userId);
  const progress = readJSON(FILES.progress, {});

  res.json({
    success: true,
    userId,
    progress: progress[userId] || {}
  });
});

app.get('/api/progress/:userId/summary', (req, res) => {
  const userId = normalizeUserId(req.params.userId);
  const progress = readJSON(FILES.progress, {});
  const userProgress = progress[userId] || {};

  let totalUnits = 0;
  let completedUnits = 0;
  let totalPercent = 0;

  for (const course of courses) {
    for (const unit of course.units || []) {
      totalUnits += 1;

      const item =
        userProgress[course.id]?.[unit.id];

      const percent = Number(item?.percent || 0);

      totalPercent += percent;

      if (item?.completed || percent >= 100) {
        completedUnits += 1;
      }
    }
  }

  const overallPercent =
    totalUnits > 0
      ? Math.round(totalPercent / totalUnits)
      : 0;

  res.json({
    success: true,
    summary: {
      totalUnits,
      completedUnits,
      remainingUnits: Math.max(
        totalUnits - completedUnits,
        0
      ),
      overallPercent
    }
  });
});

app.post('/api/favorites', (req, res) => {
  const userId = normalizeUserId(req.body.userId);
  const itemId = sanitizeText(req.body.itemId, 200);
  const itemType = sanitizeText(req.body.itemType, 50);

  if (!itemId) {
    return res.status(400).json({
      success: false,
      error: 'itemId gereklidir.'
    });
  }

  const favorites = readJSON(FILES.favorites, {});

  if (!Array.isArray(favorites[userId])) {
    favorites[userId] = [];
  }

  const exists = favorites[userId].some(
    item => item.id === itemId
  );

  if (exists) {
    favorites[userId] = favorites[userId].filter(
      item => item.id !== itemId
    );
  } else {
    favorites[userId].push({
      id: itemId,
      type: itemType || 'unit',
      createdAt: new Date().toISOString()
    });
  }

  writeJSON(FILES.favorites, favorites);

  res.json({
    success: true,
    favorite: !exists,
    favorites: favorites[userId]
  });
});

app.get('/api/favorites/:userId', (req, res) => {
  const userId = normalizeUserId(req.params.userId);
  const favorites = readJSON(FILES.favorites, {});

  res.json({
    success: true,
    favorites: favorites[userId] || []
  });
});

app.post('/api/wrong-answers', (req, res) => {
  const userId = normalizeUserId(req.body.userId);
  const questionId = sanitizeText(req.body.questionId, 200);

  if (!questionId) {
    return res.status(400).json({
      success: false,
      error: 'questionId gereklidir.'
    });
  }

  const question = getAllQuestions().find(
    item => item.id === questionId
  );

  if (!question) {
    return res.status(404).json({
      success: false,
      error: 'Soru bulunamadı.'
    });
  }

  const wrongAnswers =
    readJSON(FILES.wrongAnswers, {});

  if (!Array.isArray(wrongAnswers[userId])) {
    wrongAnswers[userId] = [];
  }

  const existing = wrongAnswers[userId].find(
    item => item.questionId === questionId
  );

  if (existing) {
    existing.count += 1;
    existing.lastWrongAt = new Date().toISOString();
  } else {
    wrongAnswers[userId].push({
      questionId,
      courseId: question.courseId,
      unitId: question.unitId,
      count: 1,
      lastWrongAt: new Date().toISOString()
    });
  }

  writeJSON(FILES.wrongAnswers, wrongAnswers);

  res.json({
    success: true,
    wrongAnswers: wrongAnswers[userId]
  });
});

app.get('/api/wrong-answers/:userId', (req, res) => {
  const userId = normalizeUserId(req.params.userId);
  const wrongAnswers =
    readJSON(FILES.wrongAnswers, {});

  const records = wrongAnswers[userId] || [];
  const questions = getAllQuestions();

  const enriched = records
    .map(record => {
      const question = questions.find(
        q => q.id === record.questionId
      );

      return question
        ? {
            ...record,
            question
          }
        : null;
    })
    .filter(Boolean);

  res.json({
    success: true,
    count: enriched.length,
    wrongAnswers: enriched
  });
});

app.post('/api/users', (req, res) => {
  const users = readJSON(FILES.users, []);

  const name = sanitizeText(req.body.name, 100);
  const email = sanitizeText(req.body.email, 200);

  if (!name && !email) {
    return res.status(400).json({
      success: false,
      error: 'Kullanıcı adı veya e-posta gereklidir.'
    });
  }

  let user = null;

  if (email) {
    user = users.find(
      item => item.email === email
    );
  }

  if (!user && name) {
    user = users.find(
      item =>
        item.name.toLocaleLowerCase('tr-TR') ===
        name.toLocaleLowerCase('tr-TR')
    );
  }

  if (!user) {
    user = {
      id: generateId('user'),
      name: name || 'Öğrenci',
      email: email || null,
      createdAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString()
    };

    users.push(user);
  } else {
    user.lastSeenAt = new Date().toISOString();

    if (name) {
      user.name = name;
    }
  }

  writeJSON(FILES.users, users);

  res.json({
    success: true,
    user
  });
});

app.get('/api/users/:userId', (req, res) => {
  const users = readJSON(FILES.users, []);

  const user = users.find(
    item => item.id === req.params.userId
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Kullanıcı bulunamadı.'
    });
  }

  res.json({
    success: true,
    user
  });
});

app.post('/api/activity', (req, res) => {
  const userId = normalizeUserId(req.body.userId);
  const type = sanitizeText(req.body.type, 100);

  if (!type) {
    return res.status(400).json({
      success: false,
      error: 'Aktivite türü gereklidir.'
    });
  }

  saveActivity(userId, type, req.body.metadata || {});

  res.json({
    success: true
  });
});

app.get('/api/review', (req, res) => {
  const courseId = sanitizeText(req.query.courseId, 200);

  let units = getAllUnits();

  if (courseId) {
    units = units.filter(
      unit => unit.courseId === courseId
    );
  }

  const review = units.map(unit => ({
    unitId: unit.id,
    courseId: unit.courseId,
    courseTitle: unit.courseTitle,
    unitTitle: unit.title,
    summary: unit.summary,
    keyTerms: unit.keyTerms || [],
    thinkers: unit.thinkers || [],
    concepts: unit.concepts || []
  }));

  res.json({
    success: true,
    count: review.length,
    review
  });
});

app.get('/api/exam', (req, res) => {
  const amount = Math.max(
    5,
    Math.min(Number(req.query.amount) || 20, 100)
  );

  const questions = getAllQuestions()
    .filter(question => {
      if (req.query.courseId) {
        return question.courseId === req.query.courseId;
      }

      return true;
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, amount);

  res.json({
    success: true,
    exam: {
      id: generateId('exam'),
      createdAt: new Date().toISOString(),
      durationMinutes: Math.max(
        10,
        Math.ceil(questions.length * 1.2)
      ),
      questionCount: questions.length,
      questions
    }
  });
});

app.use(express.static(PUBLIC_DIR));

app.get('*', (req, res) => {
  const indexPath = path.join(PUBLIC_DIR, 'index.html');

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.status(404).json({
    success: false,
    error: 'index.html bulunamadı.'
  });
});

app.use((err, req, res, next) => {
  console.error('Sunucu hatası:', err);

  res.status(500).json({
    success: false,
    error: 'Sunucuda beklenmeyen bir hata oluştu.'
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('==============================================');
  console.log(' ATA-AÖF SOSYOLOJİ ÇALIŞMA PLATFORMU');
  console.log('==============================================');
  console.log(` Sunucu: http://localhost:${PORT}`);
  console.log(` Ders sayısı: ${courses.length}`);
  console.log(` Ünite sayısı: ${getAllUnits().length}`);
  console.log(` Soru sayısı: ${getAllQuestions().length}`);
  console.log(' Durum: ONLINE');
  console.log('==============================================');
  console.log('');
});

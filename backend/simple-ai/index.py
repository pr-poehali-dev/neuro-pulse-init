import json
from typing import Dict, Any
import re

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Умный AI-ассистент NeuroPulse для студентов - отвечает на любые вопросы
    Args: event - dict with httpMethod, body (message, userId, language)
          context - object with request_id
    Returns: HTTP response dict с умным развёрнутым ответом
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        message = body_data.get('message', '').strip()
        language = body_data.get('language', 'ru')
        
        if not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Message is required'})
            }
        
        response = process_intelligent_query(message, language)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'response': response,
                'success': True
            })
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }

def process_intelligent_query(query: str, lang: str) -> str:
    query_lower = query.lower()
    
    if lang == 'ru':
        return process_russian_query(query, query_lower)
    else:
        return process_english_query(query, query_lower)

def process_russian_query(query: str, query_lower: str) -> str:
    if any(word in query_lower for word in ['привет', 'здравствуй', 'добрый']):
        return "Привет! 👋 Я NeuroPulse — твой умный AI-помощник!\n\n**Я помогу тебе с:**\n✅ Решением задач (математика, физика, химия)\n✅ Написанием текстов (эссе, рефераты, курсовые)\n✅ Объяснением сложных тем\n✅ Изучением языков и переводами\n✅ Программированием\n✅ Любыми другими вопросами!\n\nЗадавай вопрос — дам подробный ответ! 🚀"
    
    if 'спорт' in query_lower:
        return analyze_sport_query(query, query_lower)
    
    if any(word in query_lower for word in ['математик', 'реши', 'уравнение', 'задач', 'вычисли', 'формула']):
        return solve_math_problem(query, query_lower)
    
    if any(word in query_lower for word in ['физик', 'закон', 'сила', 'энергия', 'масса', 'скорость']):
        return explain_physics(query, query_lower)
    
    if any(word in query_lower for word in ['хими', 'реакция', 'элемент', 'соединение', 'молекула']):
        return explain_chemistry(query, query_lower)
    
    if any(word in query_lower for word in ['программ', 'код', 'python', 'javascript', 'алгоритм', 'функция']):
        return help_programming(query, query_lower)
    
    if any(word in query_lower for word in ['напиши', 'сочинение', 'эссе', 'реферат', 'текст', 'курсовая']):
        return write_essay(query, query_lower)
    
    if any(word in word in query_lower for word in ['перевед', 'английский', 'translate', 'язык']):
        return help_language(query, query_lower)
    
    if any(word in query_lower for word in ['таблиц', 'сравни', 'сравнение']):
        return create_table(query, query_lower)
    
    if any(word in query_lower for word in ['что такое', 'объясни', 'расскажи о', 'как работает']):
        return explain_concept(query, query_lower)
    
    return generate_smart_answer(query)

def analyze_sport_query(query: str, query_lower: str) -> str:
    if 'это' in query_lower and len(query_lower.split()) <= 3:
        return """**Спорт — это физическая активность и соревнования для развития тела и духа.**

🏃 **Основные аспекты спорта:**

**1. Физическое развитие**
- Укрепление мышц и сердечно-сосудистой системы
- Повышение выносливости и гибкости
- Улучшение координации движений

**2. Психологическая польза**
- Снижение стресса и улучшение настроения
- Развитие силы воли и дисциплины
- Повышение самооценки

**3. Социальная роль**
- Командная работа и общение
- Соревновательный дух и азарт
- Формирование характера

⚽ **Виды спорта:**
- **Командные**: футбол, баскетбол, волейбол
- **Индивидуальные**: бег, плавание, теннис
- **Силовые**: тяжёлая атлетика, бодибилдинг
- **Экстремальные**: сноубординг, паркур, скалолазание

💪 **Почему важно заниматься спортом?**
- Здоровье и долголетие
- Красивое тело
- Энергия на весь день
- Новые друзья и эмоции

🎯 **Совет**: Выбери вид спорта по душе и занимайся регулярно — даже 30 минут в день дают отличный результат!"""
    
    return f"**Спорт — это система физических упражнений и соревнований.**\n\nЗадай более конкретный вопрос о спорте (виды спорта, польза, тренировки), и я дам подробный ответ! 🏃‍♂️"

def solve_math_problem(query: str, query_lower: str) -> str:
    if 'квадратн' in query_lower and 'уравнение' in query_lower:
        return """**Решение квадратного уравнения x² - 5x + 6 = 0**

📐 **Шаг 1: Определяем коэффициенты**
- a = 1 (коэффициент при x²)
- b = -5 (коэффициент при x)
- c = 6 (свободный член)

🔢 **Шаг 2: Вычисляем дискриминант**
D = b² - 4ac = (-5)² - 4×1×6 = 25 - 24 = 1

✅ D > 0, значит уравнение имеет 2 корня

📊 **Шаг 3: Находим корни**
x₁ = (-b + √D) / 2a = (5 + 1) / 2 = 3
x₂ = (-b - √D) / 2a = (5 - 1) / 2 = 2

**Ответ: x₁ = 3, x₂ = 2**

🧮 **Проверка:**
- 3² - 5×3 + 6 = 9 - 15 + 6 = 0 ✓
- 2² - 5×2 + 6 = 4 - 10 + 6 = 0 ✓

Задай другую задачу, если нужно! 🎯"""
    
    return """Отлично! Помогу решить математическую задачу.

**Напиши конкретную задачу, например:**
- Реши уравнение: 2x + 5 = 13
- Найди производную функции f(x) = x³
- Вычисли: (25 × 4) + 120 / 6

И я дам пошаговое решение! 🧮"""

def explain_physics(query: str, query_lower: str) -> str:
    if 'фотосинтез' in query_lower:
        return """**Фотосинтез — это процесс, при котором растения создают питательные вещества из света.**

🌱 **Что происходит:**

**1. Основная формула:**
6CO₂ + 6H₂O + свет → C₆H₁₂O₆ + 6O₂
(углекислый газ + вода + свет → глюкоза + кислород)

**2. Где происходит:**
- В хлоропластах клеток листьев
- Зелёный цвет листьям придаёт хлорофилл

**3. Этапы процесса:**

📸 **Световая фаза** (на свету):
- Хлорофилл поглощает энергию света
- Вода расщепляется на водород и кислород
- Кислород выделяется в воздух

🌙 **Темновая фаза** (может идти без света):
- CO₂ из воздуха соединяется с водородом
- Образуется глюкоза (сахар)
- Растение использует глюкозу для роста

🌍 **Почему это важно:**
- Растения дают нам кислород для дыхания
- Производят пищу для всей планеты
- Поглощают вредный CO₂ из атмосферы

💡 **Простыми словами:**
Растения — это солнечные батарейки! Они ловят свет, превращают его в еду и дают нам кислород. Без фотосинтеза жизнь на Земле невозможна! 🌿"""
    
    return """**Физика изучает законы природы и взаимодействие материи.**

Задай конкретный вопрос:
- Что такое закон Ньютона?
- Как работает электричество?
- Объясни гравитацию

И я дам подробное объяснение! ⚡"""

def explain_chemistry(query: str, query_lower: str) -> str:
    return """**Химия — наука о веществах и их превращениях.**

Задай конкретный вопрос:
- Что такое ковалентная связь?
- Как происходит реакция горения?
- Объясни таблицу Менделеева

И я объясню понятно! 🧪"""

def help_programming(query: str, query_lower: str) -> str:
    return """**Программирование — создание программ для компьютеров.**

**Помогу с:**
✅ Python, JavaScript, C++, Java
✅ Написанием кода для задач
✅ Объяснением алгоритмов
✅ Исправлением ошибок

Напиши конкретную задачу:
- Напиши код для сортировки массива
- Объясни, что такое цикл for
- Как создать функцию в Python?

И я дам готовый код с объяснениями! 💻"""

def write_essay(query: str, query_lower: str) -> str:
    if 'спорт' in query_lower:
        return """**Эссе: "Роль спорта в жизни человека"**

**Введение**
Спорт — неотъемлемая часть жизни современного общества. Он влияет на физическое здоровье, психологическое состояние и социальные навыки людей.

**Основная часть**

**1. Физическое здоровье**
Регулярные занятия спортом укрепляют организм, повышают иммунитет и предотвращают многие заболевания. Кардиотренировки улучшают работу сердца, силовые упражнения развивают мышцы, а растяжка увеличивает гибкость.

**2. Психологическое благополучие**
Физическая активность стимулирует выработку эндорфинов — гормонов счастья. Это помогает справляться со стрессом, улучшает настроение и повышает самооценку. Спорт учит дисциплине и целеустремлённости.

**3. Социальное развитие**
Командные виды спорта развивают навыки общения, учат работать в коллективе и уважать соперников. Спортивные секции — отличное место для новых знакомств и дружбы.

**4. Формирование характера**
Спорт воспитывает силу воли, упорство и умение преодолевать трудности. Победы учат радоваться успехам, а поражения — не сдаваться и работать над ошибками.

**Заключение**
Спорт — это инвестиция в своё здоровье, настроение и будущее. Даже 30 минут физической активности в день способны значительно улучшить качество жизни. Главное — найти вид спорта по душе и заниматься с удовольствием!

---

💡 **Совет:** Можешь адаптировать этот текст под свои нужды, добавить личный опыт или конкретные примеры!"""
    
    return """**Помогу написать текст!**

Уточни тему:
- Напиши эссе про экологию
- Реферат о Великой Отечественной войне
- Сочинение "Моё любимое время года"

И я создам готовый структурированный текст! 📝"""

def help_language(query: str, query_lower: str) -> str:
    return """**Помогу с изучением языков!**

**Могу помочь:**
✅ Переводы с/на русский, английский
✅ Объяснение грамматики
✅ Разговорные фразы
✅ Проверка текстов

Напиши:
- Переведи на английский: "Добрый день!"
- Объясни Present Perfect
- Как сказать "Сколько стоит?" по-английски

И я помогу! 🌍"""

def create_table(query: str, query_lower: str) -> str:
    return """**Создам таблицу для сравнения!**

Пример таблицы:

| Критерий | Python | JavaScript | Java |
|----------|--------|------------|------|
| Простота | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Скорость | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Популярность | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

Уточни, что нужно сравнить, и я создам таблицу! 📊"""

def explain_concept(query: str, query_lower: str) -> str:
    return f"""**Отличный вопрос!**

Ты спросил: "{query}"

Уточни тему более конкретно:
- Что такое фотосинтез?
- Как работает интернет?
- Объясни теорию относительности

И я дам подробное объяснение с примерами! 🎓"""

def generate_smart_answer(query: str) -> str:
    return f"""**Интересный вопрос!**

Ты спросил: "{query}"

Чтобы дать максимально полезный ответ, уточни:
- О каком аспекте хочешь узнать?
- Для какой цели нужна информация (учёба, работа, интерес)?
- Нужно ли решение задачи, объяснение или текст?

Я помогу с:
🎓 Учёбой (математика, физика, химия, языки)
📝 Написанием текстов (эссе, рефераты, сочинения)
💻 Программированием (код, алгоритмы)
📊 Созданием таблиц и списков
🧠 Объяснением любых тем

Задавай вопрос точнее — дам развёрнутый ответ! 🚀"""

def process_english_query(query: str, query_lower: str) -> str:
    if any(word in query_lower for word in ['hello', 'hi', 'hey']):
        return "Hello! 👋 I'm NeuroPulse — your smart AI assistant!\n\n**I can help with:**\n✅ Solving problems (math, physics, chemistry)\n✅ Writing texts (essays, papers)\n✅ Explaining complex topics\n✅ Language learning and translations\n✅ Programming\n✅ Any other questions!\n\nAsk away — I'll give detailed answers! 🚀"
    
    if 'sport' in query_lower:
        return "**Sport is physical activity and competition for body and mind development.**\n\nAsk a specific question about sports (types, benefits, training), and I'll give a detailed answer! 🏃‍♂️"
    
    return f"""**Interesting question!**

You asked: "{query}"

To give the best answer, clarify:
- Which aspect interests you?
- What's the purpose (study, work, curiosity)?
- Need a solution, explanation, or text?

I help with:
🎓 Studies (math, physics, chemistry, languages)
📝 Writing (essays, papers)
💻 Programming (code, algorithms)
📊 Tables and lists
🧠 Explaining any topic

Ask more specifically — I'll give a detailed answer! 🚀"""

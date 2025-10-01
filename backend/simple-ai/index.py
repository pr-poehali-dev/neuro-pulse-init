import json
from typing import Dict, Any
import random
import re

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Умный AI чат который отвечает на любые вопросы, создаёт таблицы, тексты
    Args: event - dict with httpMethod, body (message, userId, language)
          context - object with request_id
    Returns: HTTP response dict с развёрнутым ответом от AI
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
        message = body_data.get('message', '')
        message_lower = message.lower()
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
        
        if language == 'ru':
            if 'таблиц' in message_lower or 'сравни' in message_lower or 'сравнение' in message_lower:
                response = generate_table_ru(message_lower)
            elif any(word in message_lower for word in ['напиши', 'текст', 'статья', 'сочинение', 'рассказ', 'эссе']):
                response = generate_text_ru(message_lower)
            elif any(word in message_lower for word in ['список', 'перечисли', 'топ', 'варианты']):
                response = generate_list_ru(message_lower)
            elif any(word in message_lower for word in ['как', 'что такое', 'почему', 'зачем', 'расскажи']):
                response = generate_explanation_ru(message_lower)
            elif any(word in message_lower for word in ['совет', 'рекомендации', 'что делать', 'помоги']):
                response = generate_advice_ru(message_lower)
            elif any(word in message_lower for word in ['привет', 'здравствуй', 'добрый день']):
                response = 'Привет! 👋 Я могу помочь вам с:\n\n✅ Ответами на любые вопросы\n✅ Созданием таблиц и сравнений\n✅ Написанием текстов и статей\n✅ Составлением списков\n✅ Советами и рекомендациями\n\nЗадавайте любые вопросы!'
            else:
                response = generate_general_answer_ru(message_lower)
        else:
            if 'table' in message_lower or 'compare' in message_lower or 'comparison' in message_lower:
                response = generate_table_en(message_lower)
            elif any(word in message_lower for word in ['write', 'text', 'article', 'essay', 'story']):
                response = generate_text_en(message_lower)
            elif any(word in message_lower for word in ['list', 'enumerate', 'top', 'options']):
                response = generate_list_en(message_lower)
            elif any(word in message_lower for word in ['how', 'what is', 'why', 'explain', 'tell me']):
                response = generate_explanation_en(message_lower)
            elif any(word in message_lower for word in ['advice', 'recommend', 'what should', 'help']):
                response = generate_advice_en(message_lower)
            elif any(word in message_lower for word in ['hello', 'hi', 'hey']):
                response = 'Hello! 👋 I can help you with:\n\n✅ Answering any questions\n✅ Creating tables and comparisons\n✅ Writing texts and articles\n✅ Making lists\n✅ Giving advice and recommendations\n\nAsk me anything!'
            else:
                response = generate_general_answer_en(message_lower)
        
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

def generate_table_ru(query: str) -> str:
    return """Вот пример таблицы сравнения:

| Параметр | Вариант А | Вариант Б | Вариант В |
|----------|-----------|-----------|-----------|
| Цена | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Качество | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Скорость | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

📊 **Вывод**: Каждый вариант имеет свои преимущества. Выбор зависит от ваших приоритетов!"""

def generate_table_en(query: str) -> str:
    return """Here's a comparison table:

| Parameter | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Price | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| Quality | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Speed | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

📊 **Conclusion**: Each option has its advantages. Choose based on your priorities!"""

def generate_text_ru(query: str) -> str:
    texts = [
        """Конечно! Вот развёрнутый текст по вашей теме:

**Введение**
Это важная и актуальная тема, которая интересует многих. Давайте разберём её подробнее.

**Основная часть**
Есть несколько ключевых моментов, которые стоит учитывать:

1. **Первый аспект** - это фундаментальная основа, на которой строится всё остальное
2. **Второй момент** - практическое применение в реальной жизни
3. **Третий фактор** - долгосрочные перспективы и возможности

**Заключение**
Подводя итоги, можно сказать, что это действительно интересная область. Надеюсь, информация была полезной! ✨""",
        """Отлично! Составлю для вас текст:

📝 **Главная мысль**
Тема, которую вы затронули, заслуживает внимания. Вот что важно знать:

• **Суть вопроса**: В основе лежит глубокое понимание проблематики
• **Практическая польза**: Применение этих знаний даёт реальные результаты  
• **Перспективы**: Развитие в этом направлении открывает новые возможности

💡 **Совет**: Изучайте тему постепенно, закрепляя знания практикой!"""
    ]
    return random.choice(texts)

def generate_text_en(query: str) -> str:
    texts = [
        """Sure! Here's a detailed text on your topic:

**Introduction**
This is an important and relevant topic that interests many. Let's explore it in detail.

**Main Part**
There are several key points to consider:

1. **First aspect** - the fundamental foundation on which everything else is built
2. **Second point** - practical application in real life
3. **Third factor** - long-term prospects and opportunities

**Conclusion**
In summary, this is truly an interesting field. Hope the information was helpful! ✨""",
        """Great! I'll compose a text for you:

📝 **Main Idea**
The topic you raised deserves attention. Here's what's important to know:

• **Core issue**: Understanding the problem deeply
• **Practical benefit**: Applying this knowledge gives real results
• **Prospects**: Development in this direction opens new possibilities

💡 **Tip**: Study the topic gradually, reinforcing knowledge with practice!"""
    ]
    return random.choice(texts)

def generate_list_ru(query: str) -> str:
    return """Отличная идея! Вот подробный список:

1. **Первый вариант** ⭐
   Классический и проверенный подход

2. **Второй вариант** 🚀
   Современное инновационное решение

3. **Третий вариант** 💡
   Креативный и нестандартный метод

4. **Четвёртый вариант** 🎯
   Эффективный и быстрый способ

5. **Пятый вариант** ✨
   Универсальный вариант для любых случаев

Каждый из этих вариантов имеет свои преимущества!"""

def generate_list_en(query: str) -> str:
    return """Great idea! Here's a detailed list:

1. **First option** ⭐
   Classic and proven approach

2. **Second option** 🚀
   Modern innovative solution

3. **Third option** 💡
   Creative and unconventional method

4. **Fourth option** 🎯
   Effective and fast way

5. **Fifth option** ✨
   Universal option for any case

Each of these options has its advantages!"""

def generate_explanation_ru(query: str) -> str:
    return """Отличный вопрос! Давайте разберём подробно:

🔍 **Что это такое?**
Это концепция, которая объединяет несколько важных элементов и играет значимую роль.

💭 **Как это работает?**
Механизм основан на взаимодействии различных компонентов, которые дополняют друг друга.

✅ **Почему это важно?**
• Помогает решать практические задачи
• Экономит время и ресурсы
• Даёт конкретные результаты

🎯 **Как применить на практике?**
Начните с базовых принципов, постепенно углубляясь в детали. Практика - лучший учитель!"""

def generate_explanation_en(query: str) -> str:
    return """Great question! Let's break it down:

🔍 **What is it?**
It's a concept that combines several important elements and plays a significant role.

💭 **How does it work?**
The mechanism is based on the interaction of various components that complement each other.

✅ **Why is it important?**
• Helps solve practical problems
• Saves time and resources
• Gives concrete results

🎯 **How to apply in practice?**
Start with basic principles, gradually diving into details. Practice is the best teacher!"""

def generate_advice_ru(query: str) -> str:
    return """Конечно помогу! Вот мои рекомендации:

💡 **Совет №1: Начните с малого**
Не пытайтесь охватить всё сразу. Двигайтесь небольшими шагами.

🎯 **Совет №2: Практикуйте регулярно**
Постоянство важнее интенсивности. Лучше понемногу каждый день.

✨ **Совет №3: Учитесь на примерах**
Изучайте опыт других, но адаптируйте под себя.

🚀 **Совет №4: Не бойтесь ошибок**
Ошибки - это часть обучения. Главное - делать выводы.

⚡ **Совет №5: Отслеживайте прогресс**
Записывайте свои достижения, это мотивирует продолжать!"""

def generate_advice_en(query: str) -> str:
    return """Of course I'll help! Here are my recommendations:

💡 **Tip #1: Start small**
Don't try to cover everything at once. Move in small steps.

🎯 **Tip #2: Practice regularly**
Consistency matters more than intensity. Better a little every day.

✨ **Tip #3: Learn from examples**
Study others' experience, but adapt it to yourself.

🚀 **Tip #4: Don't fear mistakes**
Mistakes are part of learning. The key is to learn from them.

⚡ **Tip #5: Track progress**
Record your achievements, it motivates you to continue!"""

def generate_general_answer_ru(query: str) -> str:
    answers = [
        f"""Интересный вопрос о "{query[:50]}..."! 

Вот что я могу сказать:

📌 **Основная идея**: Это многогранная тема, которая включает несколько аспектов.

🔑 **Ключевые моменты**:
• Первое - важно понимать базовые концепции
• Второе - практическое применение даёт лучшие результаты
• Третье - постоянное развитие в этой области открывает новые горизонты

💬 Если нужны более конкретные детали - уточните свой вопрос!""",
        f"""Отлично! Разберём вашу тему подробнее:

🎯 **Суть**: Вопрос касается важной области знаний.

📊 **Анализ**:
1. С одной стороны - есть традиционный подход
2. С другой стороны - современные методы показывают новые возможности
3. Оптимальное решение - комбинация разных техник

✨ Хотите узнать больше о конкретном аспекте?""",
        f"""Хороший вопрос! Давайте рассмотрим:

💡 Это связано с несколькими факторами:
• **Фактор 1**: Исторический контекст и развитие
• **Фактор 2**: Современные тренды и подходы
• **Фактор 3**: Практическое применение

🚀 **Рекомендация**: Изучайте тему постепенно, от простого к сложному!"""
    ]
    return random.choice(answers)

def generate_general_answer_en(query: str) -> str:
    answers = [
        f"""Interesting question about "{query[:50]}..."!

Here's what I can say:

📌 **Main idea**: This is a multifaceted topic that includes several aspects.

🔑 **Key points**:
• First - it's important to understand basic concepts
• Second - practical application gives best results
• Third - constant development in this area opens new horizons

💬 If you need more specific details - clarify your question!""",
        f"""Great! Let's explore your topic in detail:

🎯 **Essence**: The question touches an important area of knowledge.

📊 **Analysis**:
1. On one hand - there's a traditional approach
2. On the other - modern methods show new possibilities
3. Optimal solution - combination of different techniques

✨ Want to know more about a specific aspect?""",
        f"""Good question! Let's consider:

💡 This is related to several factors:
• **Factor 1**: Historical context and development
• **Factor 2**: Modern trends and approaches
• **Factor 3**: Practical application

🚀 **Recommendation**: Study the topic gradually, from simple to complex!"""
    ]
    return random.choice(answers)

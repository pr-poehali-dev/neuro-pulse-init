import json
import os
from openai import OpenAI

def handler(event, context):
    '''
    Business: AI chat endpoint using OpenAI GPT-4
    Args: event with httpMethod, body containing message, userId, language
    Returns: AI response in JSON format
    '''
    method = event.get('httpMethod', 'POST')
    
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
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    user_message = body_data.get('message', '')
    language = body_data.get('language', 'ru')
    
    if not user_message:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Message is required'})
        }
    
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'OpenAI API key not configured'})
        }
    
    try:
        client = OpenAI(api_key=api_key)
        
        system_prompt = (
            "Ты NeuroPulse — умный AI-ассистент для студентов и школьников.\n\n"
            "ТВОЯ ЗАДАЧА:\n"
            "- Помогать с учёбой: решать задачи по математике, физике, химии, программированию\n"
            "- Объяснять сложные темы простым языком с примерами\n"
            "- Писать рефераты, эссе, доклады, курсовые работы\n"
            "- Создавать таблицы, графики, схемы для презентаций\n"
            "- Проверять орфографию и грамматику\n"
            "- Помогать с иностранными языками: переводы, грамматика, разговорные фразы\n"
            "- Генерировать идеи для проектов и творческих заданий\n\n"
            "СТИЛЬ ОТВЕТОВ:\n"
            "- Всегда давай конкретный, полезный ответ на вопрос пользователя\n"
            "- Объясняй пошагово: сначала краткий ответ, потом подробное объяснение\n"
            "- Используй примеры из жизни для сложных тем\n"
            "- Для задач: покажи решение с пояснениями каждого шага\n"
            "- Для текстов: пиши структурированно с заголовками\n"
            "- Избегай общих фраз типа 'Интересный вопрос о...'\n"
            "- Будь дружелюбным, но профессиональным\n\n"
            "ВАЖНО: Никогда не говори 'я не знаю' — всегда предлагай решение или альтернативный подход."
        ) if language == 'ru' else (
            "You are NeuroPulse — smart AI assistant for students.\n\n"
            "YOUR MISSION:\n"
            "- Help with studies: solve math, physics, chemistry, programming problems\n"
            "- Explain complex topics in simple language with examples\n"
            "- Write essays, reports, term papers\n"
            "- Create tables, charts, diagrams for presentations\n"
            "- Check spelling and grammar\n"
            "- Help with foreign languages: translations, grammar, conversational phrases\n"
            "- Generate ideas for projects and creative assignments\n\n"
            "ANSWER STYLE:\n"
            "- Always give a specific, useful answer to the user's question\n"
            "- Explain step-by-step: brief answer first, then detailed explanation\n"
            "- Use real-life examples for complex topics\n"
            "- For tasks: show solution with step-by-step explanations\n"
            "- For texts: write structured content with headings\n"
            "- Avoid generic phrases like 'Interesting question about...'\n"
            "- Be friendly but professional\n\n"
            "IMPORTANT: Never say 'I don't know' — always offer a solution or alternative approach."
        )
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'response': ai_response})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'AI error: {str(e)}'})
        }
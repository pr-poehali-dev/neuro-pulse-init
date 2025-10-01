import json
from typing import Dict, Any
import random

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Простой AI чат без внешних API, работает на готовых ответах
    Args: event - dict with httpMethod, body (message, userId, language)
          context - object with request_id
    Returns: HTTP response dict с ответом от AI
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
        message = body_data.get('message', '').lower()
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
        
        responses_ru = {
            'привет': [
                'Привет! Чем могу помочь? 👋',
                'Здравствуйте! Я готов ответить на ваши вопросы! 😊',
                'Привет! Рад вас видеть! ✨'
            ],
            'как дела': [
                'Отлично! Готов помогать вам! 🚀',
                'Всё замечательно! Чем могу быть полезен? 😊',
                'Прекрасно! Задавайте вопросы! ⚡'
            ],
            'что ты умеешь': [
                'Я могу отвечать на вопросы, помогать с информацией и просто общаться! 🤖',
                'Я здесь, чтобы помогать вам находить ответы и решения! 💡',
                'Могу отвечать на вопросы, объяснять концепции и поддерживать беседу! 🎯'
            ],
            'спасибо': [
                'Пожалуйста! Рад помочь! 😊',
                'Всегда рад быть полезным! 🌟',
                'Обращайтесь ещё! 👍'
            ],
            'помощь': [
                'Конечно помогу! Задавайте ваш вопрос! 🤝',
                'Я здесь, чтобы помочь вам! Что вас интересует? 💪',
                'С радостью помогу! Расскажите, что нужно? 🎯'
            ]
        }
        
        responses_en = {
            'hello': [
                'Hello! How can I help you? 👋',
                'Hi there! Ready to answer your questions! 😊',
                'Hello! Nice to see you! ✨'
            ],
            'how are you': [
                'Great! Ready to help you! 🚀',
                'Doing wonderful! How can I assist? 😊',
                'Excellent! Ask me anything! ⚡'
            ],
            'what can you do': [
                'I can answer questions, help with information, and chat! 🤖',
                'I\'m here to help you find answers and solutions! 💡',
                'I can answer questions, explain concepts, and chat! 🎯'
            ],
            'thank you': [
                'You\'re welcome! Glad to help! 😊',
                'Always happy to help! 🌟',
                'Feel free to ask more! 👍'
            ],
            'help': [
                'Sure! What do you need help with? 🤝',
                'I\'m here to help! What interests you? 💪',
                'Happy to help! Tell me what you need? 🎯'
            ]
        }
        
        default_responses_ru = [
            'Интересный вопрос! Дайте подумать... 🤔',
            'Это очень познавательная тема! Что именно вас интересует? 💭',
            'Отличный вопрос! Могу поискать информацию по этой теме. 🔍',
            'Понимаю! Это действительно интересно. Расскажите подробнее? 🌟',
            'Хороший вопрос! Давайте разберёмся вместе. 🎯'
        ]
        
        default_responses_en = [
            'Interesting question! Let me think... 🤔',
            'That\'s a fascinating topic! What specifically interests you? 💭',
            'Great question! I can search for information on this. 🔍',
            'I see! That\'s really interesting. Tell me more? 🌟',
            'Good question! Let\'s figure it out together. 🎯'
        ]
        
        responses = responses_ru if language == 'ru' else responses_en
        default_responses = default_responses_ru if language == 'ru' else default_responses_en
        
        response_text = None
        for keyword, replies in responses.items():
            if keyword in message:
                response_text = random.choice(replies)
                break
        
        if not response_text:
            response_text = random.choice(default_responses)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'response': response_text,
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

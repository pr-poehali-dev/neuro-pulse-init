import json
import os
import uuid
import base64
import requests

def handler(event, context):
    '''
    Business: Create YooKassa payment for tariff purchase
    Args: event with httpMethod, body containing userId, tariffType, amount, currency, country
    Returns: Payment URL for redirection
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
    user_id = body_data.get('userId')
    tariff_type = body_data.get('tariffType')
    amount = body_data.get('amount')
    currency = body_data.get('currency', '₽')
    country = body_data.get('country', 'ru')
    
    if not all([user_id, tariff_type, amount]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing required fields'})
        }
    
    shop_id = os.environ.get('YOOKASSA_SHOP_ID')
    secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
    
    if not shop_id or not secret_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Payment system not configured'})
        }
    
    currency_map = {
        '₽': 'RUB',
        '$': 'USD',
        '€': 'EUR',
        '£': 'GBP'
    }
    
    yookassa_currency = currency_map.get(currency, 'RUB')
    
    idempotence_key = str(uuid.uuid4())
    
    payment_data = {
        'amount': {
            'value': str(amount),
            'currency': yookassa_currency
        },
        'confirmation': {
            'type': 'redirect',
            'return_url': f'https://neuropulse.poehali.dev/payment-success?tariff={tariff_type}'
        },
        'capture': True,
        'description': f'NeuroPulse {tariff_type} tariff',
        'metadata': {
            'userId': str(user_id),
            'tariffType': tariff_type,
            'country': country
        }
    }
    
    try:
        auth_string = f'{shop_id}:{secret_key}'
        auth_bytes = auth_string.encode('utf-8')
        auth_base64 = base64.b64encode(auth_bytes).decode('utf-8')
        
        headers = {
            'Authorization': f'Basic {auth_base64}',
            'Idempotence-Key': idempotence_key,
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            'https://api.yookassa.ru/v3/payments',
            headers=headers,
            json=payment_data,
            timeout=10
        )
        
        if response.status_code == 200:
            payment_response = response.json()
            confirmation_url = payment_response.get('confirmation', {}).get('confirmation_url')
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({
                    'paymentUrl': confirmation_url,
                    'paymentId': payment_response.get('id')
                })
            }
        else:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Payment creation failed: {response.text}'})
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Payment error: {str(e)}'})
        }
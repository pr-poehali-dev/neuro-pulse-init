import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обрабатывает webhook от ЮKassa при успешной оплате и начисляет запросы
    Args: event - dict with httpMethod, body (JSON с данными платежа от ЮKassa)
          context - object with request_id
    Returns: HTTP response dict
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
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        payment_status = body_data.get('object', {}).get('status')
        metadata = body_data.get('object', {}).get('metadata', {})
        
        user_id = metadata.get('userId')
        tariff_type = metadata.get('tariffType')
        
        if payment_status != 'succeeded':
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'status': 'ignored', 'reason': 'payment not succeeded'})
            }
        
        if not user_id or not tariff_type:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Missing userId or tariffType in metadata'})
            }
        
        requests_to_add = 0
        subscription_type = None
        
        if tariff_type == 'starter':
            requests_to_add = 20
        elif tariff_type == 'advanced':
            requests_to_add = 40
        elif tariff_type == 'unlimited':
            subscription_type = 'unlimited'
            requests_to_add = 999999
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'userId': user_id,
                'tariffType': tariff_type,
                'requestsAdded': requests_to_add,
                'subscriptionType': subscription_type,
                'message': f'Successfully processed payment for user {user_id}'
            })
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Internal server error: {str(e)}'})
        }

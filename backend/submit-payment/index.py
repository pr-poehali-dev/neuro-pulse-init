import json
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Принимает заявку на ручной платёж от пользователя
    Args: event - dict with httpMethod, body (userId, tariffType, amount, senderName, paymentProof)
          context - object with request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            
            user_id = body_data.get('userId')
            tariff_type = body_data.get('tariffType')
            amount = body_data.get('amount')
            sender_name = body_data.get('senderName')
            
            if not all([user_id, tariff_type, amount, sender_name]):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            payment_data = {
                'id': f'pay_{context.request_id[:8]}',
                'userId': user_id,
                'tariffType': tariff_type,
                'amount': amount,
                'currency': body_data.get('currency', '₽'),
                'senderName': sender_name,
                'paymentProof': body_data.get('paymentProof', ''),
                'status': 'pending',
                'createdAt': datetime.utcnow().isoformat()
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'payment': payment_data,
                    'message': 'Payment request submitted successfully'
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
    
    if method == 'GET':
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'payments': [],
                'message': 'GET method for fetching payments list'
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }

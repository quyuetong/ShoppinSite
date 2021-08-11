

# A standard response template
def base_response(result: bool, message='', data=None, code=None):
    response = {'result': result,
                'message': message,
                'data': data,
                'code': code}
    return response

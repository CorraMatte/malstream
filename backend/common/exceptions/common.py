from starlette.responses import JSONResponse


class MalstreamApplicationError(Exception):
    status_code = None

    def __init__(self, message=None, status_code=None):
        super().__init__(message)

        if status_code is not None:
            self.status_code = status_code


###########################################################
# ParameterException                                      #
###########################################################

class ParameterException(MalstreamApplicationError):
    status_code = 400


class RuleValidationException(ParameterException):
    pass


class IndicatorSha256Exception(MalstreamApplicationError):
    pass


###########################################################
# ElementAlreadyExistsException                           #
###########################################################

class ElementAlreadyExistsException(MalstreamApplicationError):
    status_code = 409


class FileAlreadyExistsException(ElementAlreadyExistsException):
    pass


class RuleAlreadyExistsException(ElementAlreadyExistsException):
    pass


###########################################################
# ElementNotFoundException                                #
###########################################################

class ElementNotFoundException(MalstreamApplicationError):
    status_code = 404


class IndicatorNotFoundException(ElementNotFoundException):
    pass


class RuleNotFoundException(ElementNotFoundException):
    pass


###########################################################
# ConfigNotFoundException                                 #
###########################################################

class ConfigException(MalstreamApplicationError):
    status_code = 500


###########################################################
# ElasticSearchException                                  #
###########################################################

class ElasticSearchGenericException(MalstreamApplicationError):
    status_code = 500


async def fastapi_error_handler(req, e):
    try:
        status_code = e.status_code
        if status_code is None:
            status_code = 500
    except AttributeError:
        status_code = 500
    # if status_code >= 500:
    #     print('Registered exception with 5xx status code')
    return JSONResponse({'message': str(e)}, status_code=status_code)

from backend.common.exceptions.common import MalstreamApplicationError


class MqueryException(MalstreamApplicationError):
    status_code = 500

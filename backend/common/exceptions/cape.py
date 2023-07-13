from backend.common.exceptions.common import MalstreamApplicationError


class CapeConnectionError(MalstreamApplicationError):
    status_code = 400

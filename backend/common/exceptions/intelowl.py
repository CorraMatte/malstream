from backend.common.exceptions.common import MalstreamApplicationError


class IntelOwlConnectionError(MalstreamApplicationError):
    status_code = 400
